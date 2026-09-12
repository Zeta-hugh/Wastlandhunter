#!/usr/bin/env python3
"""Validate the Rustport Tiled map contract and referenced production tiles."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from validate_manifest import ROOT, load_manifest

EXPECTED_LAYERS = [
    "00_ground", "01_roads", "02_terrain", "03_building_floor", "04_walls",
    "05_doors_windows", "06_roof", "07_props_back", "08_props_front",
    "09_vegetation", "10_collision", "11_npc_spawns", "12_triggers", "13_lighting",
]
REPORT = ROOT / "qa/reports/maps_validation.json"


def main() -> int:
    errors: list[str] = []
    map_path = ROOT / "maps/rustport/rustport.tmj"
    if not map_path.is_file():
        errors.append("missing maps/rustport/rustport.tmj")
        map_data = {}
    else:
        map_data = json.loads(map_path.read_text(encoding="utf-8"))
    if [map_data.get("width"), map_data.get("height")] != [64, 64]:
        errors.append("Rustport map must be 64x64 tiles")
    if [map_data.get("tilewidth"), map_data.get("tileheight")] != [32, 32]:
        errors.append("Rustport tile size must be 32x32")
    layer_names = [layer.get("name") for layer in map_data.get("layers", [])]
    if layer_names != EXPECTED_LAYERS:
        errors.append(f"layer order mismatch: {layer_names}")

    tile_layers = map_data.get("layers", [])[:10]
    for layer in tile_layers:
        if layer.get("type") != "tilelayer" or len(layer.get("data", [])) != 4096:
            errors.append(f"{layer.get('name')}: expected a 64x64 tile layer")
    for layer in map_data.get("layers", [])[10:]:
        if layer.get("type") != "objectgroup":
            errors.append(f"{layer.get('name')}: expected an object layer")

    manifest = load_manifest()
    by_runtime = {record["runtime"]: record for record in manifest["assets"]}
    for tileset in map_data.get("tilesets", []):
        source = (map_path.parent / tileset["source"]).resolve()
        if not source.is_file():
            errors.append(f"missing tileset {source.relative_to(ROOT)}")
            continue
        data = json.loads(source.read_text(encoding="utf-8"))
        image = (source.parent / data["image"]).resolve()
        image_rel = image.relative_to(ROOT).as_posix()
        record = by_runtime.get(image_rel)
        if not image.is_file():
            errors.append(f"missing tileset image {image_rel}")
        if not record:
            errors.append(f"tileset image is not in asset_manifest: {image_rel}")
        elif record["status"] != "QA_PASS":
            errors.append(f"tileset image is not QA_PASS: {record['asset_id']}")

    report = {"result": "PASS" if not errors else "FAIL", "map": "maps/rustport/rustport.tmj", "layers": layer_names, "errors": errors}
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("Map validation FAILED")
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print("Map validation PASS: Rustport 64x64, 14 required layers, QA_PASS tileset")
    return 0


if __name__ == "__main__":
    sys.exit(main())
