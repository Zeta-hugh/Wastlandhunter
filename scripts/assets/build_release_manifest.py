#!/usr/bin/env python3
"""Copy only QA_PASS runtime assets into release/assets and write the release manifest."""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

from validate_manifest import ROOT, load_manifest, validate_manifest


def main() -> int:
    manifest = load_manifest()
    errors = validate_manifest(manifest)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    release_assets = ROOT / "release/assets"
    if release_assets.exists():
        shutil.rmtree(release_assets)
    release_assets.mkdir(parents=True)
    released = []
    for record in manifest["assets"]:
        if record["status"] != "QA_PASS":
            continue
        source = ROOT / record["runtime"]
        if not source.is_file():
            print(f"ERROR: QA_PASS runtime is missing: {record['runtime']}")
            return 1
        relative = Path(record["runtime"]).relative_to("assets/runtime")
        target = release_assets / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        released.append({
            "asset_id": record["asset_id"],
            "path": (Path("assets") / relative).as_posix(),
            "runtime_size": record["runtime_size"],
            "alpha": record["alpha"],
            "pivot": record["pivot"],
        })
    release_manifest = {"schema_version": "1.0", "assets": released}
    (ROOT / "release/asset_manifest.json").write_text(json.dumps(release_manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Release manifest built with {len(released)} QA_PASS asset(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
