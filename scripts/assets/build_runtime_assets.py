#!/usr/bin/env python3
"""Build declared runtime PNGs from available source_master PNGs."""

from __future__ import annotations

import sys

try:
    from PIL import Image
except ImportError as error:  # pragma: no cover
    raise SystemExit("Pillow is required: python3 -m pip install -r scripts/assets/requirements.txt") from error

from validate_manifest import ROOT, load_manifest, validate_manifest


def main() -> int:
    manifest = load_manifest()
    errors = validate_manifest(manifest)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    built = 0
    for record in manifest["assets"]:
        source = ROOT / record["source_master"]
        if not source.is_file():
            if record["status"] in {"COMPLETE", "QA_PASS"}:
                print(f"ERROR: active asset has no source_master: {record['asset_id']}")
                return 1
            continue
        runtime = ROOT / record["runtime"]
        runtime.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as image:
            mode = "RGBA" if record["alpha"] else "RGB"
            image.convert(mode).resize(tuple(record["runtime_size"]), Image.Resampling.LANCZOS).save(runtime, "PNG", optimize=True)
        built += 1
        print(f"BUILT {record['asset_id']} -> {record['runtime']}")
    print(f"Runtime build complete: {built} asset(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
