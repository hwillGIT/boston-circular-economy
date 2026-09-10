"""Check contribution evidence without claiming human acceptance."""

from __future__ import annotations

import argparse
from graphlib import TopologicalSorter
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
PROSE_SCRIPTS = ROOT / ".agents/skills/make-evidence-based-technical-case/scripts"
sys.path.insert(0, str(PROSE_SCRIPTS))
import check_prose  # noqa: E402


def content_digest(path: Path) -> str:
    """Ignore platform line endings when identifying unchanged legacy text."""
    text = path.read_text(encoding="utf-8")
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def find_prose_violations(
    paths: list[Path], baseline: dict[str, str], root: Path
) -> tuple[list[check_prose.Finding], int]:
    """Skip only legacy content that still matches its recorded fingerprint."""
    profile = check_prose.load_profile(check_prose.DEFAULT_PROFILE)
    findings: list[check_prose.Finding] = []
    skipped = 0
    for path in check_prose.prose_files(paths):
        relative = path.resolve().relative_to(root.resolve()).as_posix()
        if baseline.get(relative) == content_digest(path):
            skipped += 1
            continue
        findings.extend(check_prose.markdown_findings(path, profile))
        findings.extend(check_prose.editorial_findings(path))
    return findings, skipped


def check_repository_prose() -> int:
    """Include tracked and untracked work while respecting Git exclusions."""
    baseline_path = ROOT / ".agents/prose-baseline.json"
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))["files"]
    completed = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    paths = [
        ROOT / name.decode("utf-8")
        for name in completed.stdout.split(b"\0")
        if name
    ]
    findings, skipped = find_prose_violations(paths, baseline, ROOT)
    for finding in findings:
        print(finding.format())
    print(f"Prose: {len(findings)} violations; {skipped} unchanged legacy files.")
    return int(bool(findings))


def validate_units(units: list[dict], schema: dict, root: Path) -> None:
    """Reject incomplete acceptance, broken inputs, and invalid dependencies."""
    from jsonschema import Draft202012Validator

    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    if not units:
        raise ValueError("no work-unit manifests found")
    by_id = {}
    for unit in units:
        validator.validate(unit)
        if unit["id"] in by_id:
            raise ValueError(f"duplicate work unit: {unit['id']}")
        by_id[unit["id"]] = unit
        for item in unit["inputs"]:
            reference = item["reference"]
            if reference.startswith("https://"):
                continue
            path = (root / reference).resolve()
            if not path.is_relative_to(root.resolve()) or not path.exists():
                raise ValueError(f"{unit['id']}: missing local input: {reference}")
    for unit in units:
        for dependency in unit["depends_on"]:
            if dependency not in by_id:
                raise ValueError(f"{unit['id']}: unknown dependency: {dependency}")
            if (
                unit["status"] not in {"waiting_for_reviewed_input", "needs_revision"}
                and by_id[dependency]["status"] != "accepted"
            ):
                raise ValueError(f"{unit['id']}: input is not accepted: {dependency}")
    list(TopologicalSorter({
        unit["id"]: unit["depends_on"] for unit in units
    }).static_order())


def check_manifests() -> int:
    """Validate the catalog and parse the reusable screen template."""
    import yaml

    directory = ROOT / "docs/work-units"
    schema = json.loads((directory / "manifest.schema.json").read_text(encoding="utf-8"))
    units = []
    for path in sorted(directory.glob("ui-*.json")):
        unit = json.loads(path.read_text(encoding="utf-8"))
        if unit["id"] != path.stem.upper():
            raise ValueError(f"manifest ID differs from filename: {path.name}")
        units.append(unit)
    validate_units(units, schema, ROOT)
    template = yaml.safe_load(
        (directory / "screen-manifest.template.yaml").read_text(encoding="utf-8")
    )
    if not isinstance(template, dict):
        raise ValueError("screen template must contain a mapping")
    print(f"Validated {len(units)} work units and the screen template.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("check", choices=["prose", "manifests", "all"])
    arguments = parser.parse_args(argv)
    result = 0
    if arguments.check in {"prose", "all"}:
        result |= check_repository_prose()
    if arguments.check in {"manifests", "all"}:
        result |= check_manifests()
    return result


if __name__ == "__main__":
    raise SystemExit(main())
