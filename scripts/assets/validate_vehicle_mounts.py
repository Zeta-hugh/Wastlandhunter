#!/usr/bin/env python3
"""Validate Rust Runner metadata and report missing independent art explicitly."""

from __future__ import annotations

import json
import sys

from validate_manifest import ROOT, load_manifest

REPORT = ROOT / "qa/reports/vehicle_mounts_validation.json"
DIRECTIONS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"]


def in_bounds(point: list[int], size: list[int]) -> bool:
    return len(point) == 2 and 0 <= point[0] <= size[0] and 0 <= point[1] <= size[1]


def main() -> int:
    errors: list[str] = []
    needs_art: list[str] = []
    vehicle_path = ROOT / "data/vehicles/rust_runner.json"
    weapon_path = ROOT / "data/weapons/cannon_75mm.json"
    vehicle = json.loads(vehicle_path.read_text(encoding="utf-8"))
    weapon = json.loads(weapon_path.read_text(encoding="utf-8"))
    canvas = vehicle.get("runtime_canvas")
    if canvas != [128, 128] or vehicle.get("pivot") != [64, 96]:
        errors.append("Rust Runner canvas/pivot mismatch")
    if list(vehicle.get("chassis", {}).keys()) != DIRECTIONS:
        errors.append("Rust Runner chassis direction order mismatch")
    if vehicle.get("turret", {}).get("directions") != 16 or vehicle.get("turret", {}).get("pivot") != [64, 61]:
        errors.append("Rust Runner turret contract mismatch")
    for name, point in vehicle.get("mounts", {}).items():
        if not in_bounds(point, canvas):
            errors.append(f"mount outside canvas: {name} {point}")
    box = vehicle.get("collision_box", {})
    if min((box.get("x", -1), box.get("y", -1), box.get("w", -1), box.get("h", -1))) < 0 or box.get("x", 0) + box.get("w", 0) > 128 or box.get("y", 0) + box.get("h", 0) > 128:
        errors.append("collision_box outside canvas")
    if not in_bounds(weapon.get("pivot", []), weapon.get("runtime_size", [])) or not in_bounds(weapon.get("muzzle_point", []), weapon.get("runtime_size", [])):
        errors.append("cannon_75mm pivot or muzzle outside runtime canvas")

    manifest = load_manifest()
    by_runtime = {record["runtime"]: record for record in manifest["assets"]}
    required_paths = list(vehicle["chassis"].values()) + list(vehicle["tracks"].values())
    required_paths += [vehicle["turret"]["path_pattern"].replace("{index:02d}", f"{index:02d}") for index in range(16)]
    required_paths.append(weapon["asset"])
    for path in required_paths:
        record = by_runtime.get(path)
        if not record:
            errors.append(f"vehicle runtime path is absent from manifest: {path}")
        elif record["status"] != "QA_PASS" or not (ROOT / path).is_file():
            needs_art.append(record["asset_id"])

    result = "FAIL" if errors else "NEEDS_ART" if needs_art else "PASS"
    report = {"result": result, "vehicle": "rust_runner", "needs_art": needs_art, "errors": errors}
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("Vehicle validation FAILED")
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    if needs_art:
        print(f"Vehicle metadata PASS; production art NEEDS_ART: {len(needs_art)} independent files")
        for asset_id in needs_art:
            print(f"NEEDS_ART: {asset_id}")
        return 2
    print("Vehicle validation PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
