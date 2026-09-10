"""Validate a committed work record and publish its result to the same commit."""

from __future__ import annotations

import base64
import binascii
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass

from check_submission import check_submission

RECORD_PATH = ".github/submission.md"
STATUS_CONTEXT = "Submission record"
SHA = re.compile(r"[0-9a-f]{40}\Z")
REPOSITORY = re.compile(r"[A-Za-z0-9][A-Za-z0-9-]*/[A-Za-z0-9_.-]+\Z")


class SubmissionError(Exception):
    """The available evidence cannot support a successful submission status."""


def valid_repository(value: object) -> bool:
    """Keep API paths within the named owner and repository."""
    return (
        isinstance(value, str)
        and bool(REPOSITORY.fullmatch(value))
        and value.rsplit("/", 1)[-1] not in {".", ".."}
    )


class GitHubAPI:
    """Use the installed CLI without placing the token in command arguments."""

    def request(self, method: str, path: str, body: dict | None = None) -> object:
        command = ["gh", "api", "--method", method, path]
        if body is not None:
            command.extend(["--input", "-"])
        try:
            completed = subprocess.run(
                command,
                input=json.dumps(body) if body is not None else None,
                capture_output=True,
                text=True,
                check=True,
                timeout=30,
            )
            return json.loads(completed.stdout)
        except (subprocess.SubprocessError, OSError, ValueError) as error:
            raise SubmissionError(f"GitHub request failed: {method} {path}") from error


@dataclass(frozen=True)
class SubmissionContext:
    repository: str
    pull_request: int
    base_sha: str
    head_sha: str
    target_url: str

    def __post_init__(self) -> None:
        if not valid_repository(self.repository) or self.pull_request < 1:
            raise SubmissionError("invalid repository or pull request")
        if not SHA.fullmatch(self.base_sha) or not SHA.fullmatch(self.head_sha):
            raise SubmissionError("base and head must identify complete commits")

    @property
    def pull_path(self) -> str:
        return f"repos/{self.repository}/pulls/{self.pull_request}"

    @property
    def status_path(self) -> str:
        return f"repos/{self.repository}/statuses/{self.head_sha}"


def live_head(api: GitHubAPI, context: SubmissionContext) -> tuple[str, str]:
    """Read the current commit and source repository from the pull request."""
    response = api.request("GET", context.pull_path)
    if not isinstance(response, dict):
        raise SubmissionError("pull request response must be an object")
    try:
        head = response["head"]
        sha = head["sha"]
        repository = head["repo"]["full_name"]
        if not SHA.fullmatch(sha) or not valid_repository(repository):
            raise SubmissionError("invalid pull request head")
        return sha, repository
    except (KeyError, TypeError) as error:
        raise SubmissionError("pull request head is unavailable") from error


def read_record(api: GitHubAPI, repository: str, revision: str) -> tuple[str, str]:
    """Decode Markdown as data and reject unsupported content responses."""
    response = api.request(
        "GET", f"repos/{repository}/contents/{RECORD_PATH}?ref={revision}"
    )
    if not isinstance(response, dict):
        raise SubmissionError("submission record response must be an object")
    try:
        if response["type"] != "file" or response["encoding"] != "base64":
            raise SubmissionError("submission record must be a Base64 file")
        blob_sha = response["sha"]
        if not SHA.fullmatch(blob_sha):
            raise SubmissionError("submission record has an invalid blob identifier")
        encoded = "".join(response["content"].split())
        content = base64.b64decode(encoded, validate=True)
        return blob_sha, content.decode("utf-8")
    except (KeyError, TypeError, AttributeError, ValueError, binascii.Error) as error:
        raise SubmissionError("submission record could not be decoded") from error


def publish_status(api: GitHubAPI, context: SubmissionContext, state: str) -> None:
    api.request(
        "POST",
        context.status_path,
        {
            "state": state,
            "context": STATUS_CONTEXT,
            "description": "Checking the committed record."
            if state == "pending"
            else "The committed submission check completed.",
            "target_url": context.target_url,
        },
    )


def check_and_publish(api: GitHubAPI, context: SubmissionContext) -> bool:
    """Keep a failed or stale validation from producing a successful status."""
    current_sha, source_repository = live_head(api, context)
    if current_sha != context.head_sha:
        raise SubmissionError("pull request head changed before validation")

    publish_status(api, context, "pending")
    successful = False
    try:
        base_blob, _ = read_record(api, context.repository, context.base_sha)
        head_blob, body = read_record(api, source_repository, context.head_sha)
        if base_blob == head_blob:
            raise SubmissionError("submission record is unchanged from the base")
        findings = check_submission(body)
        for finding in findings:
            print(finding.format())
        successful = not findings
    except SubmissionError as error:
        print(str(error), file=sys.stderr)

    current_sha, current_repository = live_head(api, context)
    if current_sha != context.head_sha or current_repository != source_repository:
        raise SubmissionError("pull request head changed during validation")

    publish_status(api, context, "success" if successful else "failure")
    return successful


def main() -> int:
    try:
        context = SubmissionContext(
            repository=os.environ["GITHUB_REPOSITORY"],
            pull_request=int(os.environ["PR_NUMBER"]),
            base_sha=os.environ["BASE_SHA"],
            head_sha=os.environ["HEAD_SHA"],
            target_url=os.environ["TARGET_URL"],
        )
        return 0 if check_and_publish(GitHubAPI(), context) else 1
    except (SubmissionError, KeyError, ValueError) as error:
        print(f"Submission check failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
