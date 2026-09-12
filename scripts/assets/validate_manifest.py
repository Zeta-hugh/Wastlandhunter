#!/usr/bin/env python3
"""Validate production asset manifest structure without touching image pixels."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = ROOT / "data/asset_manifest.json"
ASSET_ID = re.compile(r"^[a-z0-9_-]+$")
ALLOWED_STATUS = {
    "PLANNED", "NEEDS_ART", "NEEDS_REGEN", "COMPLETE",
    "QA_PASS", "QA_FAIL", "ARCHIVED",
}
REQUIRED_KEYS = {
    "asset_id", "category", "source_master", "runtime", "master_size",
    "runtime_size", "alpha", "pivot", "status", "qa",
}


def load_manifest(path: Path = MANIFEST_PATH) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_manifest(manifest: dict) -> list[str]:
    errors: list[str] = []
    if manifest.get("schema_version") != "1.0":
        errors.append("schema_version must be 1.0")
    assets = manifest.get("assets")
    if not isinstance(assets, list):
        return errors + ["assets must be an array"]

    seen: set[str] = set()
    runtime_paths: set[str] = set()
    for index, record in enumerate(assets):
        label = record.get("asset_id", f"record[{index}]")
        missing = REQUIRED_KEYS - record.keys()
        if missing:
            errors.append(f"{label}: missing keys {sorted(missing)}")
            continue
        asset_id = record["asset_id"]
        if not ASSET_ID.fullmatch(asset_id):
            errors.append(f"{asset_id}: illegal asset_id")
        if asset_id in seen:
            errors.append(f"{asset_id}: duplicate asset_id")
        seen.add(asset_id)
        if record["status"] not in ALLOWED_STATUS:
            errors.append(f"{asset_id}: illegal status {record['status']}")

        for field, prefix in (("source_master", "assets/source_master/"), ("runtime", "assets/runtime/")):
            value = record[field]
            if not isinstance(value, str) or "\\" in value or value.startswith("/"):
                errors.append(f"{asset_id}: {field} must be a repo-relative POSIX path")
                continue
            if str(PurePosixPath(value)) != value or not value.startswith(prefix):
                errors.append(f"{asset_id}: {field} must stay under {prefix}")
            if not value.endswith(".png"):
                errors.append(f"{asset_id}: {field} must be PNG")
        if record["runtime"] in runtime_paths:
            errors.append(f"{asset_id}: duplicate runtime path {record['runtime']}")
        runtime_paths.add(record["runtime"])

        for field in ("master_size", "runtime_size", "pivot"):
            value = record[field]
            if not isinstance(value, list) or len(value) != 2 or not all(isinstance(n, int) and n >= 0 for n in value):
                errors.append(f"{asset_id}: {field} must contain two non-negative integers")
        if isinstance(record["runtime_size"], list) and isinstance(record["pivot"], list):
            width, height = record["runtime_size"]
            px, py = record["pivot"]
            if px > width or py > height:
                errors.append(f"{asset_id}: pivot {record['pivot']} is outside {record['runtime_size']}")
        if not isinstance(record["alpha"], bool):
            errors.append(f"{asset_id}: alpha must be boolean")
        qa = record["qa"]
        if not isinstance(qa, dict) or any(key not in qa for key in ("alpha_clean", "dimensions_valid", "no_text", "no_crop")):
            errors.append(f"{asset_id}: incomplete qa object")
        elif record["status"] == "QA_PASS" and not all(qa.values()):
            errors.append(f"{asset_id}: QA_PASS requires every qa flag to be true")
    return errors


def main() -> int:
    manifest = load_manifest()
    errors = validate_manifest(manifest)
    print(f"Manifest records: {len(manifest.get('assets', []))}")
    if errors:
        print("Manifest validation FAILED")
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print("Manifest validation PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
