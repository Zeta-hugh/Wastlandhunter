"""Validate cross-file references without changing owned data."""

from __future__ import annotations

from common import finish, read_json, main_exit


def validate() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    manifest = read_json("data/asset_manifest.json")
    manifest_ids = {record.get("asset_id") for record in manifest.get("assets", [])}
    bindings = read_json("data/asset_bindings.json").get("bindings", {})
    for binding, asset_ids in bindings.items():
        for asset_id in asset_ids:
            if asset_id not in manifest_ids:
                errors.append(f"binding {binding} references missing asset ID {asset_id}")
    scene = read_json("data/rustport_scene.json")
    for obj in scene.get("objects", []):
        asset_id = obj.get("asset_id")
        if asset_id and asset_id not in manifest_ids:
            errors.append(f"scene object {obj.get('id')} references missing asset ID {asset_id}")
    quest = read_json("data/quests/rustport.json")
    for objective in quest.get("objectives", []):
        if not objective.get("target"):
            errors.append(f"quest objective {objective.get('id')} has no target")
    warnings.append("definition references still use legacy bare IDs; no blind migration was performed")
    return finish(errors, warnings, "Reference validation")


if __name__ == "__main__":
    main_exit(validate())
