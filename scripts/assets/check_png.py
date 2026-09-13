#!/usr/bin/env python3
"""Run deterministic technical checks for incoming production PNG pairs.

This script validates file and manifest contracts only. It does not judge
artistic quality and never changes manifest status.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = ROOT / "data/asset_manifest.json"

FIRST_BATCH = (
    "ground_dirt_oily_01",
    "concrete_clean",
    "concrete_cracked",
    "concrete_oily",
    "awning_canvas_beige",
    "barrel_rust",
    "rust_runner_chassis_s",
    "rust_runner_track_left",
    "rust_runner_track_right",
    "rust_runner_turret_00",
    "cannon_75mm",
)


def inspect_file(path: Path, expected_size: list[int], expected_alpha: bool) -> list[str]:
    errors: list[str] = []
    if not path.is_file():
        return [f"missing file: {path.relative_to(ROOT).as_posix()}"]
    try:
        with Image.open(path) as image:
            if image.format != "PNG":
                errors.append(f"{path.name}: format {image.format} != PNG")
            if list(image.size) != expected_size:
                errors.append(f"{path.name}: size {list(image.size)} != {expected_size}")
            expected_mode = "RGBA" if expected_alpha else "RGB"
            if image.mode != expected_mode:
                errors.append(f"{path.name}: mode {image.mode} != {expected_mode}")
            image.verify()
    except Exception as error:
        errors.append(f"{path.name}: unreadable PNG: {error}")
    return errors


def inspect_record(record: dict) -> dict:
    asset_id = record["asset_id"]
    source = ROOT / record["source_master"]
    runtime = ROOT / record["runtime"]
    errors: list[str] = []
    if source.name != f"{asset_id}.png":
        errors.append(f"source filename must be {asset_id}.png")
    if runtime.name != f"{asset_id}.png":
        errors.append(f"runtime filename must be {asset_id}.png")
    errors.extend(inspect_file(source, record["master_size"], record["alpha"]))
    errors.extend(inspect_file(runtime, record["runtime_size"], record["alpha"]))
    return {
        "asset_id": asset_id,
        "status": record["status"],
        "source_master": record["source_master"],
        "runtime": record["runtime"],
        "result": "PASS" if not errors else "BLOCKED",
        "errors": errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--asset-id",
        action="append",
        dest="asset_ids",
        help="Check one canonical asset_id; repeat for multiple IDs.",
    )
    parser.add_argument(
        "--first-batch",
        action="store_true",
        help="Check the approved Rustport P0 first batch.",
    )
    args = parser.parse_args()
    if not args.asset_ids and not args.first_batch:
        parser.error("choose --first-batch or at least one --asset-id")

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    records = {record["asset_id"]: record for record in manifest["assets"]}
    asset_ids = FIRST_BATCH if args.first_batch else tuple(args.asset_ids)
    results: list[dict] = []
    for asset_id in asset_ids:
        record = records.get(asset_id)
        if record is None:
            results.append({"asset_id": asset_id, "result": "BLOCKED", "errors": ["unknown asset_id"]})
        else:
            results.append(inspect_record(record))

    blocked = sum(result["result"] != "PASS" for result in results)
    print(json.dumps({"result": "PASS" if blocked == 0 else "BLOCKED", "assets": results}, ensure_ascii=False, indent=2))
    return 1 if blocked else 0


if __name__ == "__main__":
    sys.exit(main())
