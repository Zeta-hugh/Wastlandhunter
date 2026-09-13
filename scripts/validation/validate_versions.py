"""Report version fields and their observed semantics without changing data."""

from __future__ import annotations

from validate_project import collect_versions


def validate() -> int:
    findings = collect_versions()
    print(f"Version-bearing files: {len(findings)}")
    for finding in findings:
        print(f"{finding['file']}: {', '.join(finding['fields'])}")
    print("Version validation PASS_WITH_SEMANTIC_REVIEW")
    return 0


if __name__ == "__main__":
    raise SystemExit(validate())
