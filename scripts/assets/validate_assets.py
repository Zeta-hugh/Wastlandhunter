#!/usr/bin/env python3
"""Validate files, dimensions, alpha, indexing, source/runtime pairs and tile seams."""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageStat
except ImportError as error:  # pragma: no cover - dependency failure is explicit
    raise SystemExit("Pillow is required: python3 -m pip install -r scripts/assets/requirements.txt") from error

from validate_manifest import ROOT, load_manifest, validate_manifest

REPORT = ROOT / "qa/reports/assets_validation.json"
ACTIVE_STATUS = {"COMPLETE", "QA_PASS"}
IMAGE_LITERAL = re.compile(r"['\"](assets/[^'\"]+\.(?:png|webp|jpg|jpeg))['\"]")


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def seam_metrics(image: Image.Image) -> tuple[float, float]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    horizontal = ImageChops.difference(rgb.crop((0, 0, 1, height)), rgb.crop((width - 1, 0, width, height)))
    vertical = ImageChops.difference(rgb.crop((0, 0, width, 1)), rgb.crop((0, height - 1, width, height)))
    h_mean = sum(ImageStat.Stat(horizontal).mean) / 3
    v_mean = sum(ImageStat.Stat(vertical).mean) / 3
    return round(h_mean, 3), round(v_mean, 3)


def main() -> int:
    manifest = load_manifest()
    errors = validate_manifest(manifest)
    warnings: list[str] = []
    assets = manifest.get("assets", [])
    indexed_runtime = {record["runtime"] for record in assets}
    indexed_master = {record["source_master"] for record in assets}
    active = [record for record in assets if record["status"] in ACTIVE_STATUS]
    missing_art = [record["asset_id"] for record in assets if record["status"] in {"PLANNED", "NEEDS_ART", "NEEDS_REGEN"}]
    seam_results: dict[str, dict] = {}

    for record in active:
        asset_id = record["asset_id"]
        for field, size_field in (("source_master", "master_size"), ("runtime", "runtime_size")):
            path = ROOT / record[field]
            if not path.is_file():
                errors.append(f"{asset_id}: missing {field} file {record[field]}")
                continue
            with Image.open(path) as image:
                if list(image.size) != record[size_field]:
                    errors.append(f"{asset_id}: {field} size {list(image.size)} != {record[size_field]}")
                expected_mode = "RGBA" if record["alpha"] else "RGB"
                if image.mode != expected_mode:
                    errors.append(f"{asset_id}: {field} mode {image.mode} != {expected_mode}")
                if image.format != "PNG":
                    errors.append(f"{asset_id}: {field} is {image.format}, expected PNG")

        if record["category"] == "tile.ground" and record["status"] == "QA_PASS":
            runtime_path = ROOT / record["runtime"]
            if runtime_path.is_file():
                with Image.open(runtime_path) as tile:
                    h_mean, v_mean = seam_metrics(tile)
                seam_path = ROOT / record.get("seam_test", "")
                seam_results[asset_id] = {"horizontal_edge_mae": h_mean, "vertical_edge_mae": v_mean, "preview": relative(seam_path)}
                if h_mean > 12 or v_mean > 12:
                    errors.append(f"{asset_id}: seam edge MAE too high ({h_mean}, {v_mean})")
                if not seam_path.is_file():
                    errors.append(f"{asset_id}: missing 4x4 seam preview")
                else:
                    with Image.open(seam_path) as preview:
                        expected = [record["runtime_size"][0] * 4, record["runtime_size"][1] * 4]
                        if list(preview.size) != expected:
                            errors.append(f"{asset_id}: seam preview size {list(preview.size)} != {expected}")

    runtime_files = {relative(path) for path in (ROOT / "assets/runtime").rglob("*.png")}
    master_files = {relative(path) for path in (ROOT / "assets/source_master").rglob("*.png")}
    for path in sorted(runtime_files - indexed_runtime):
        errors.append(f"unindexed runtime file: {path}")
    for path in sorted(master_files - indexed_master):
        errors.append(f"unindexed source_master file: {path}")

    expected_release = {
        Path(record["runtime"]).relative_to("assets/runtime").as_posix()
        for record in assets if record["status"] == "QA_PASS"
    }
    actual_release = {
        path.relative_to(ROOT / "release/assets").as_posix()
        for path in (ROOT / "release/assets").rglob("*.png")
    }
    for path in sorted(actual_release - expected_release):
        errors.append(f"release contains a non-QA_PASS asset: release/assets/{path}")
    for path in sorted(expected_release - actual_release):
        errors.append(f"release is missing QA_PASS asset: release/assets/{path}")

    legacy_runtime_dependencies: list[dict[str, str]] = []
    for source in (ROOT / "game").rglob("*.js"):
        text = source.read_text(encoding="utf-8")
        for match in IMAGE_LITERAL.finditer(text):
            path = match.group(1)
            if path not in indexed_runtime:
                legacy_runtime_dependencies.append({"source": relative(source), "path": path})
    if legacy_runtime_dependencies:
        warnings.append(
            f"{len(legacy_runtime_dependencies)} compatibility image references still bypass AssetRegistry; "
            "they cannot enter release/assets and keep contract completion false"
        )

    status_counts = Counter(record["status"] for record in assets)
    report = {
        "result": "PASS" if not errors else "FAIL",
        "manifest_records": len(assets),
        "status_counts": dict(sorted(status_counts.items())),
        "active_files_checked": len(active),
        "missing_art_count": len(missing_art),
        "missing_art": missing_art,
        "legacy_runtime_dependencies": legacy_runtime_dependencies,
        "contract_complete": not errors and not missing_art and not legacy_runtime_dependencies,
        "seam_tests": seam_results,
        "release_assets": sorted(actual_release),
        "warnings": warnings,
        "errors": errors,
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Asset records: {len(assets)} | active: {len(active)} | NEEDS_ART: {len(missing_art)}")
    for asset_id, result in seam_results.items():
        print(f"SEAM {asset_id}: H={result['horizontal_edge_mae']} V={result['vertical_edge_mae']}")
    if legacy_runtime_dependencies:
        print(f"LEGACY_RUNTIME_DEBT: {len(legacy_runtime_dependencies)} image references still bypass AssetRegistry")
    if errors:
        print("Asset validation FAILED")
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print(f"Asset validation PASS; report: {relative(REPORT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
