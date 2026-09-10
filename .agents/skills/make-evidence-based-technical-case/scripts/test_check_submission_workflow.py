from __future__ import annotations

import base64
import copy
import hashlib
import io
import json
import os
import subprocess
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest import mock

from check_submission_workflow import (
    GitHubAPI,
    SubmissionContext,
    SubmissionError,
    check_and_publish,
    main,
)

ROOT = Path(__file__).resolve().parents[4]
BASE_SHA = "a" * 40
HEAD_SHA = "b" * 40
REPOSITORY = "hwillGIT/boston-circular-economy"


def record(body: str) -> dict:
    data = body.encode("utf-8")
    blob = f"blob {len(data)}\0".encode() + data
    return {
        "type": "file",
        "encoding": "base64",
        "sha": hashlib.sha1(blob).hexdigest(),
        "content": base64.encodebytes(data).decode(),
    }


class FakeGitHub(GitHubAPI):
    """Provide API responses without Git operations, network calls, or real statuses."""

    def __init__(self, body: str, source: str = REPOSITORY) -> None:
        self.context = SubmissionContext(
            REPOSITORY, 12, BASE_SHA, HEAD_SHA, "https://example.invalid/run"
        )
        head = {"head": {"sha": HEAD_SHA, "repo": {"full_name": source}}}
        self.heads: list[object] = [copy.deepcopy(head), copy.deepcopy(head)]
        self.base_path = (
            f"repos/{REPOSITORY}/contents/.github/submission.md?ref={BASE_SHA}"
        )
        self.head_path = f"repos/{source}/contents/.github/submission.md?ref={HEAD_SHA}"
        self.records: dict[str, object] = {
            self.base_path: record("Previous submission."),
            self.head_path: record(body),
        }
        self.calls: list[tuple[str, str]] = []
        self.accepted_states: list[str] = []
        self.reject_state: str | None = None

    def request(self, method: str, path: str, body: dict | None = None) -> object:
        self.calls.append((method, path))
        if method == "GET" and path == self.context.pull_path:
            response = self.heads.pop(0)
        elif method == "GET" and path in self.records:
            response = self.records[path]
        elif method == "POST" and path == self.context.status_path:
            assert body is not None
            if body["state"] == self.reject_state:
                raise SubmissionError("status write failed")
            if body["context"] != "Submission record":
                raise AssertionError("unexpected status context")
            self.accepted_states.append(body["state"])
            return {}
        else:
            raise AssertionError(f"unexpected request: {method} {path}")
        if isinstance(response, Exception):
            raise response
        return copy.deepcopy(response)


class SubmissionWorkflowTests(unittest.TestCase):
    def setUp(self) -> None:
        self.body = (ROOT / ".github/submission.md").read_text(encoding="utf-8")
        self.api = FakeGitHub(self.body)
        self.output = io.StringIO()
        self.addCleanup(self.output.close)
        self.stdout = redirect_stdout(self.output)
        self.stderr = redirect_stderr(self.output)
        self.stdout.__enter__()
        self.stderr.__enter__()
        self.addCleanup(self.stdout.__exit__, None, None, None)
        self.addCleanup(self.stderr.__exit__, None, None, None)

    def run_check(self) -> bool:
        return check_and_publish(self.api, self.api.context)

    def test_valid_committed_record_succeeds_on_the_expected_head(self) -> None:
        self.assertTrue(self.run_check())
        self.assertEqual(["pending", "success"], self.api.accepted_states)
        self.assertEqual(("GET", self.api.context.pull_path), self.api.calls[-2])
        self.assertEqual(("POST", self.api.context.status_path), self.api.calls[-1])

    def test_fork_record_is_read_from_its_source_repository(self) -> None:
        self.api = FakeGitHub(self.body, source="contributor/circular-economy")
        self.assertTrue(self.run_check())
        self.assertIn(("GET", self.api.head_path), self.api.calls)
        self.assertIn(("GET", self.api.base_path), self.api.calls)

    def test_invalid_record_publishes_failure(self) -> None:
        self.api.records[self.api.head_path] = record("An incomplete record.")
        self.assertFalse(self.run_check())
        self.assertEqual(["pending", "failure"], self.api.accepted_states)

    def test_unchanged_record_publishes_failure(self) -> None:
        self.api.records[self.api.base_path] = self.api.records[self.api.head_path]
        self.assertFalse(self.run_check())
        self.assertEqual(["pending", "failure"], self.api.accepted_states)

    def test_head_changed_before_validation_causes_no_status_write(self) -> None:
        self.api.heads[0]["head"]["sha"] = "c" * 40
        with self.assertRaisesRegex(SubmissionError, "before validation"):
            self.run_check()
        self.assertEqual([], self.api.accepted_states)
        self.assertEqual(1, len(self.api.calls))

    def test_head_changed_during_validation_cannot_publish_success(self) -> None:
        self.api.heads[1]["head"]["sha"] = "c" * 40
        with self.assertRaisesRegex(SubmissionError, "during validation"):
            self.run_check()
        self.assertEqual(["pending"], self.api.accepted_states)

    def test_changed_source_repository_cannot_publish_success(self) -> None:
        self.api.heads[1]["head"]["repo"]["full_name"] = "different/repository"
        with self.assertRaisesRegex(SubmissionError, "during validation"):
            self.run_check()
        self.assertEqual(["pending"], self.api.accepted_states)

    def test_unavailable_records_publish_failure(self) -> None:
        for path in (self.api.base_path, self.api.head_path):
            with self.subTest(path=path):
                self.api = FakeGitHub(self.body)
                self.api.records[path] = SubmissionError("record unavailable")
                self.assertFalse(self.run_check())
                self.assertEqual(["pending", "failure"], self.api.accepted_states)

    def test_malformed_record_responses_publish_failure(self) -> None:
        for value in (
            None,
            [],
            {},
            {"type": "dir", "encoding": "base64"},
            {**record(self.body), "encoding": "none"},
            {**record(self.body), "content": "%%%"},
            {**record(self.body), "content": "é"},
            {**record(self.body), "content": "/w=="},
            {**record(self.body), "sha": "missing"},
        ):
            with self.subTest(response=value):
                self.api = FakeGitHub(self.body)
                self.api.records[self.api.head_path] = value
                self.assertFalse(self.run_check())
                self.assertEqual(["pending", "failure"], self.api.accepted_states)

    def test_failed_initial_head_read_writes_no_status(self) -> None:
        self.api.heads[0] = SubmissionError("head lookup failed")
        with self.assertRaises(SubmissionError):
            self.run_check()
        self.assertEqual([], self.api.accepted_states)

    def test_failed_final_head_read_cannot_publish_success(self) -> None:
        self.api.heads[1] = SubmissionError("head lookup failed")
        with self.assertRaises(SubmissionError):
            self.run_check()
        self.assertEqual(["pending"], self.api.accepted_states)

    def test_invalid_head_metadata_writes_no_status(self) -> None:
        for response in (
            None,
            {},
            {"head": None},
            {"head": {"sha": "bad", "repo": None}},
        ):
            with self.subTest(response=response):
                self.api = FakeGitHub(self.body)
                self.api.heads[0] = response
                with self.assertRaises(SubmissionError):
                    self.run_check()
                self.assertEqual([], self.api.accepted_states)

    def test_failed_pending_write_stops_before_reading_the_record(self) -> None:
        self.api.reject_state = "pending"
        with self.assertRaises(SubmissionError):
            self.run_check()
        self.assertNotIn(("GET", self.api.head_path), self.api.calls)
        self.assertEqual([], self.api.accepted_states)

    def test_failed_final_write_does_not_report_success(self) -> None:
        self.api.reject_state = "success"
        with self.assertRaises(SubmissionError):
            self.run_check()
        self.assertEqual(["pending"], self.api.accepted_states)

    def test_record_commands_are_inert_data(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            marker = Path(directory) / "executed"
            code = f"__import__('pathlib').Path({str(marker)!r}).write_text('executed')"
            body = self.body + "\n\n```python\n" + code + "\n```\n"
            self.api.records[self.api.head_path] = record(body)
            with mock.patch(
                "subprocess.run", side_effect=AssertionError("unexpected command")
            ):
                self.assertTrue(self.run_check())
            self.assertFalse(marker.exists())

    def test_invalid_context_cannot_build_an_api_path(self) -> None:
        for repository in (
            "../foreign",
            "owner/..",
            "owner/.",
            "https://example.invalid",
        ):
            with (
                self.subTest(repository=repository),
                self.assertRaises(SubmissionError),
            ):
                SubmissionContext(repository, 1, BASE_SHA, HEAD_SHA, "")
        with self.assertRaises(SubmissionError):
            SubmissionContext(REPOSITORY, 1, "main", HEAD_SHA, "")

    def test_command_exit_status_matches_the_validation_result(self) -> None:
        environment = {
            "GITHUB_REPOSITORY": REPOSITORY,
            "PR_NUMBER": "12",
            "BASE_SHA": BASE_SHA,
            "HEAD_SHA": HEAD_SHA,
            "TARGET_URL": "https://example.invalid/run",
        }
        with mock.patch.dict(os.environ, environment):
            with mock.patch(
                "check_submission_workflow.GitHubAPI", return_value=self.api
            ):
                self.assertEqual(0, main())
            self.api = FakeGitHub("An incomplete record.")
            with mock.patch(
                "check_submission_workflow.GitHubAPI", return_value=self.api
            ):
                self.assertEqual(1, main())

    def test_cli_uses_stdin_for_json_and_a_bounded_timeout(self) -> None:
        result = subprocess.CompletedProcess([], 0, stdout='{"state":"pending"}')
        with mock.patch(
            "check_submission_workflow.subprocess.run", return_value=result
        ) as command:
            response = GitHubAPI().request(
                "POST", self.api.context.status_path, {"state": "pending"}
            )
        self.assertEqual({"state": "pending"}, response)
        self.assertEqual(
            {"state": "pending"}, json.loads(command.call_args.kwargs["input"])
        )
        self.assertEqual(30, command.call_args.kwargs["timeout"])
        self.assertIn("--input", command.call_args.args[0])

    def test_cli_timeout_is_a_submission_failure(self) -> None:
        with (
            mock.patch(
                "check_submission_workflow.subprocess.run",
                side_effect=subprocess.TimeoutExpired("gh", 30),
            ),
            self.assertRaises(SubmissionError),
        ):
            GitHubAPI().request("GET", self.api.context.pull_path)


if __name__ == "__main__":
    unittest.main()
