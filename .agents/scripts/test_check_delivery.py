from __future__ import annotations

import copy
from graphlib import CycleError
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from jsonschema import ValidationError
import yaml

from check_delivery import (
    ROOT,
    check_api_call_manifest,
    content_digest,
    find_prose_violations,
    main,
    project_prose_paths,
    validate_api_call_template,
    validate_units,
)


class ProseBaselineTests(unittest.TestCase):
    def test_unchanged_legacy_text_is_exempt_but_edited_text_is_checked(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / "legacy.md"
            path.write_text("We cannot proceed; the input is absent.\n", encoding="utf-8")
            baseline = {"legacy.md": content_digest(path)}
            findings, skipped = find_prose_violations([path], baseline, root)
            self.assertEqual([], findings)
            self.assertEqual(1, skipped)

            path.write_text("We cannot proceed; the input is invalid.\n", encoding="utf-8")
            findings, skipped = find_prose_violations([path], baseline, root)
            self.assertTrue(findings)
            self.assertEqual(0, skipped)

    def test_new_prose_cannot_use_another_files_exemption(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / "new.md"
            path.write_text("We cannot proceed; the input is absent.\n", encoding="utf-8")
            findings, skipped = find_prose_violations(
                [path], {"legacy.md": content_digest(path)}, root
            )
            self.assertTrue(findings)
            self.assertEqual(0, skipped)

    def test_fingerprint_ignores_platform_line_endings(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "legacy.md"
            path.write_bytes(b"One line.\nAnother line.\n")
            digest = content_digest(path)
            path.write_bytes(b"One line.\r\nAnother line.\r\n")
            self.assertEqual(digest, content_digest(path))

    def test_copied_skill_text_stays_outside_project_prose_checks(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            vendored = root / ".agents/skills/write-timeless-technical-prose/SKILL.md"
            authored = root / "docs/guide.md"
            vendored.parent.mkdir(parents=True)
            authored.parent.mkdir(parents=True)
            vendored.write_text("We cannot proceed; the input is absent.\n", encoding="utf-8")
            authored.write_text("One clear sentence.\n", encoding="utf-8")
            self.assertEqual([authored], project_prose_paths([authored, vendored], root))


class ManifestTests(unittest.TestCase):
    def setUp(self) -> None:
        directory = ROOT / "docs/work-units"
        self.schema = json.loads((directory / "manifest.schema.json").read_text())
        self.api_schema = json.loads(
            (directory / "api-call-manifest.schema.json").read_text()
        )
        self.api_template = yaml.safe_load(
            (directory / "api-call-manifest.template.yaml").read_text()
        )
        self.units = [
            json.loads(path.read_text(encoding="utf-8"))
            for path in sorted(directory.glob("ui-*.json"))
        ]

    def test_catalog_is_consistent(self) -> None:
        validate_units(self.units, self.schema, ROOT)

    def test_api_call_template_is_consistent(self) -> None:
        validate_api_call_template(self.api_template, self.api_schema)
        template_path = ROOT / "docs/work-units/api-call-manifest.template.yaml"
        self.assertEqual(0, check_api_call_manifest(template_path))
        self.assertEqual(
            0, main(["api-call", "--api-call-file", str(template_path)])
        )

    def test_api_call_requires_success_empty_and_failure_cases(self) -> None:
        template = copy.deepcopy(self.api_template)
        template["response_cases"].pop()
        template["response_cases"].append(
            {
                "id": "empty",
                "transport_status": None,
                "meaning": "A second empty result case.",
                "client_behavior": None,
                "recovery_rule": None,
            }
        )
        with self.assertRaises(ValidationError):
            validate_api_call_template(template, self.api_schema)

    def test_accepted_api_call_requires_two_team_members(self) -> None:
        template = copy.deepcopy(self.api_template)
        template["status"] = "accepted"
        template["source"]["accepted_ui_spec_revision"] = "ui-002-revision"
        template["source"]["inspected_server_revision"] = "server-revision"
        template["operation"]["proposed_path"] = "/api/v1/clinic-search"
        template["review"].update(
            {
                "team_members": ["Frontend work lead"],
                "accepted_revision": "contract-revision",
                "team_observation": "The team checked the contract.",
            }
        )
        with self.assertRaises(ValidationError):
            validate_api_call_template(template, self.api_schema)
        template["review"]["team_members"].append("Backend/API lead")
        validate_api_call_template(template, self.api_schema)

    def test_acceptance_requires_two_review_team_members(self) -> None:
        unit = copy.deepcopy(self.units[0])
        unit["status"] = "accepted"
        unit["completion_record"].update(
            {
                "artifact_links": ["https://example.test/artifact"],
                "review_team_members": ["Frontend work lead"],
                "review_date": "2026-09-10",
                "accepted_revision": "example-revision",
                "contributor_explanation": "The contributor traced the chosen behavior.",
                "review_team_observation": "The team checked the explanation.",
            }
        )
        with self.assertRaises(ValidationError):
            validate_units([unit], self.schema, ROOT)
        unit["completion_record"]["review_team_members"].append(
            "Product or design owner"
        )
        validate_units([unit], self.schema, ROOT)

    def test_claiming_work_requires_accepted_input(self) -> None:
        self.units[1]["status"] = "claimed"
        with self.assertRaisesRegex(ValueError, "input is not accepted"):
            validate_units(self.units, self.schema, ROOT)

    def test_unknown_dependency_is_rejected(self) -> None:
        self.units[1]["depends_on"] = ["UI-999"]
        with self.assertRaisesRegex(ValueError, "unknown dependency"):
            validate_units(self.units, self.schema, ROOT)

    def test_cycle_is_rejected(self) -> None:
        self.units[0]["status"] = "waiting_for_reviewed_input"
        self.units[0]["depends_on"] = [self.units[1]["id"]]
        with self.assertRaises(CycleError):
            validate_units(self.units, self.schema, ROOT)

    def test_missing_local_source_is_rejected(self) -> None:
        self.units[0]["inputs"][0]["reference"] = "docs/absent-source.md"
        with self.assertRaisesRegex(ValueError, "missing local input"):
            validate_units(self.units, self.schema, ROOT)

    def test_local_source_cannot_escape_the_repository(self) -> None:
        self.units[0]["inputs"][0]["reference"] = "../"
        with self.assertRaisesRegex(ValueError, "missing local input"):
            validate_units(self.units, self.schema, ROOT)


class QualityGateTests(unittest.TestCase):
    def test_every_required_job_must_succeed(self) -> None:
        workflow = yaml.safe_load((ROOT / ".github/workflows/ci.yml").read_text())
        jobs = workflow["jobs"]
        gate = jobs["quality-gate"]
        required = {
            "lint-client", "lint-server", "lint-etl", "typecheck",
            "test-etl", "docs", "docs-python", "delivery-policy",
            "architecture-diagrams",
        }
        self.assertEqual(required, set(gate["needs"]))
        self.assertEqual("always()", gate["if"])
        script = gate["steps"][0]["run"].split("<<'PY'\n", 1)[1].rsplit("\nPY", 1)[0]
        results = {name: {"result": "success"} for name in required}

        def exit_code(values: dict) -> int:
            return subprocess.run(
                [sys.executable, "-c", script],
                env={**os.environ, "JOB_RESULTS": json.dumps(values)},
                capture_output=True,
                check=False,
            ).returncode

        self.assertEqual(0, exit_code(results))
        for name in required:
            for outcome in ("failure", "cancelled", "skipped"):
                with self.subTest(job=name, outcome=outcome):
                    failed = copy.deepcopy(results)
                    failed[name]["result"] = outcome
                    self.assertNotEqual(0, exit_code(failed))


if __name__ == "__main__":
    unittest.main()
