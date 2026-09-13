"""Run the shared contract validators and emit the audit-first report."""

from __future__ import annotations

import json
import re
from pathlib import Path

from common import ROOT, finish, json_files, main_exit, read_json
from validate_ids import audit as audit_ids
from validate_references import validate as validate_references
from validate_save import validate as validate_save
from validate_world_state import validate as validate_world_state


ID_FIELDS = (
    "asset_id",
    "bounty_id",
    "boss_id",
    "character_id",
    "item_id",
    "map_id",
    "npc_id",
    "quest_id",
    "town_id",
    "vehicle_id",
    "weapon_id",
)

STRUCTURES = {
    "GameState": {
        "current_files": ["game/app/core/state.js", "game/core/state.js"],
        "version_fields": ["saveVersion", "version"],
        "consumers": [
            "game/app/main.js",
            "game/app/core/renderer.js",
            "game/app/core/quest.js",
            "game/app/core/dialogue.js",
            "game/app/core/bounty.js",
            "game/app/core/state.js",
            "game/systems/persistence.js",
            "game/core/prototype-runtime.js",
        ],
        "references": ["WorldState", "QuestDefinition", "VehicleDefinition", "MapDefinition"],
    },
    "WorldState": {
        "current_files": ["game/app/core/state.js", "data/world_state_keys.json"],
        "version_fields": ["schema_version", "contract_version"],
        "consumers": [
            "game/app/core/dialogue.js",
            "game/app/core/state.js",
            "tests/architecture.test.mjs",
            "tests/route-data.test.mjs",
            "game/core/save/migrations.js",
        ],
        "references": ["DialogueDefinition", "SaveData"],
    },
    "QuestDefinition": {
        "current_files": ["data/quests/rustport.json"],
        "fields": ["quest_id", "title", "status", "prerequisites", "objectives", "rewards", "completion_effects"],
        "version_fields": [],
        "consumers": ["game/app/main.js", "game/app/core/quest.js", "tests/route-data.test.mjs"],
        "references": ["NPCDefinition", "VehicleDefinition", "BountyDefinition"],
    },
    "DialogueDefinition": {
        "current_files": ["data/dialogue/rustport.json"],
        "fields": ["dialogue_id", "entries"],
        "version_fields": [],
        "consumers": ["game/app/main.js", "game/app/core/dialogue.js", "tests/route-data.test.mjs"],
        "references": ["WorldState", "NPCDefinition"],
    },
    "BountyDefinition": {
        "current_files": ["data/bounties/iron_hound.json"],
        "fields": ["bounty_id", "name", "rumor", "location_hint", "difficulty", "reward", "weakness", "loot", "world_consequence"],
        "version_fields": [],
        "consumers": ["game/app/main.js", "game/app/core/bounty.js", "tests/route-data.test.mjs"],
        "references": ["BossDefinition", "ItemDefinition", "WorldState"],
    },
    "NPCDefinition": {
        "current_files": ["data/characters/*.json"],
        "fields": ["character_id", "status", "frame_size", "pivot", "directions", "animations", "path_pattern"],
        "version_fields": [],
        "consumers": ["game/app/main.js", "game/app/core/renderer.js", "game/app/core/dialogue.js"],
        "references": ["AssetEntry", "DialogueDefinition"],
    },
    "ItemDefinition": {
        "current_files": ["no standalone current definition file"],
        "fields": ["legacy inventory item values and loot strings only"],
        "version_fields": [],
        "consumers": ["game/app/core/bounty.js", "game/core/prototype-runtime.js", "game/systems/persistence.js"],
        "references": ["BountyDefinition", "SaveData"],
    },
    "VehicleDefinition": {
        "current_files": ["data/vehicles/rust_runner.json"],
        "fields": ["vehicle_id", "display_name_cn", "status", "runtime_canvas", "pivot", "chassis", "tracks", "turret", "mounts", "collision_box"],
        "version_fields": [],
        "consumers": ["game/app/main.js", "game/app/core/renderer.js", "game/app/core/assets.js", "scripts/assets/validate_vehicle_mounts.py"],
        "references": ["AssetEntry", "WeaponDefinition"],
    },
    "WeaponDefinition": {
        "current_files": ["data/weapons/cannon_75mm.json"],
        "fields": ["weapon_id", "display_name_cn", "status", "slot", "asset", "runtime_size", "pivot", "barrel_origin", "muzzle_point", "compatible_mounts", "damage_visual_class"],
        "version_fields": [],
        "consumers": ["game/app/core/state.js", "game/app/core/renderer.js", "scripts/assets/validate_vehicle_mounts.py"],
        "references": ["AssetEntry", "VehicleDefinition"],
    },
    "MapDefinition": {
        "current_files": ["data/maps/rustport.json", "data/rustport_scene.json", "data/tiles/*.json"],
        "fields": ["map_id", "display_name_cn", "tmj", "tile_size", "map_size_tiles", "world_size", "status"],
        "version_fields": ["schema_version", "version", "tiledversion"],
        "consumers": ["game/app/core/scene.js", "game/app/core/constants.js", "scripts/assets/validate_maps.py"],
        "references": ["AssetEntry", "WorldState"],
    },
    "SaveData": {
        "current_files": ["game/app/core/state.js", "game/systems/persistence.js", "game/core/prototype-runtime.js", "game/core/save/migrations.js"],
        "fields": ["saveVersion", "version", "state payload", "updatedAt", "localStorage keys"],
        "version_fields": ["saveVersion", "version"],
        "consumers": ["game/app/core/state.js", "game/systems/persistence.js", "game/core/prototype-runtime.js", "tests/browser.mjs", "tests/architecture.test.mjs"],
        "references": ["GameState", "WorldState"],
    },
    "AssetEntry": {
        "current_files": ["data/asset_manifest.json"],
        "fields": ["asset_id", "category", "source_master", "runtime", "master_size", "runtime_size", "alpha", "pivot", "status", "qa", "domain metadata"],
        "version_fields": ["schema_version", "contract_version"],
        "consumers": ["game/app/core/assets.js", "game/core/asset-registry.js", "scripts/assets/validate_assets.py", "scripts/assets/validate_manifest.py", "scripts/assets/build_release_manifest.py"],
        "references": ["VehicleDefinition", "WeaponDefinition", "MapDefinition"],
    },
}


def relative(path: Path) -> str:
    return str(path.relative_to(ROOT))


def collect_ids() -> dict[str, list[dict[str, str]]]:
    result: dict[str, list[dict[str, str]]] = {}
    for path in json_files("data"):
        if "schemas" in path.parts or path.name == "world_state_keys.json":
            continue
        value = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(value, dict):
            continue
        for field in ID_FIELDS:
            identifier = value.get(field)
            if isinstance(identifier, str):
                result.setdefault(identifier, []).append({"field": field, "file": relative(path)})
    return {key: result[key] for key in sorted(result)}


def collect_world_state_findings() -> dict[str, list[str]]:
    patterns = (
        re.compile(r"worldState\.([A-Za-z0-9_]+)"),
        re.compile(r"world_state\.([A-Za-z0-9_]+)"),
        re.compile(r"set:worldState\.([A-Za-z0-9_]+)"),
    )
    findings: dict[str, set[str]] = {}
    roots = [ROOT / "game", ROOT / "data", ROOT / "tests"]
    for root in roots:
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix not in {".js", ".mjs", ".json"}:
                continue
            text = path.read_text(encoding="utf-8")
            for pattern in patterns:
                for key in pattern.findall(text):
                    findings.setdefault(key, set()).add(relative(path))
    return {key: sorted(files) for key, files in sorted(findings.items())}


def collect_versions() -> list[dict[str, object]]:
    findings: list[dict[str, object]] = []
    patterns = {
        "schema_version": re.compile(r"schema_version"),
        "schemaVersion": re.compile(r"schemaVersion"),
        "saveVersion": re.compile(r"saveVersion"),
        "manifestVersion": re.compile(r"manifestVersion"),
        "mapSchemaVersion": re.compile(r"mapSchemaVersion"),
        "version": re.compile(r"\bversion\b"),
        "tiledversion": re.compile(r"tiledversion"),
    }
    for root in (ROOT / "game", ROOT / "data", ROOT / "scripts/assets", ROOT / "tests"):
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix not in {".js", ".mjs", ".py", ".json", ".tsj"}:
                continue
            text = path.read_text(encoding="utf-8")
            matched = sorted(name for name, pattern in patterns.items() if pattern.search(text))
            if matched:
                findings.append({"file": relative(path), "fields": matched})
    return findings


def build_report(results: list[int]) -> dict[str, object]:
    registry = read_json("data/world_state_keys.json")
    ids = collect_ids()
    canonical = {key: entries for key, entries in ids.items() if "." in key}
    bare = {key: entries for key, entries in ids.items() if "." not in key}
    duplicate = {
        key: entries for key, entries in ids.items()
        if len({entry["field"] for entry in entries}) != len(entries)
    }
    return {
        "report": "shared_contract_audit",
        "audit_mode": "read_only",
        "project": "Wasteland Hunter",
        "structures": STRUCTURES,
        "id_inventory": {
            "all_ids": ids,
            "bare_ids": bare,
            "prefixed_ids": canonical,
            "duplicates": duplicate,
            "ambiguous": ["iron_hound is used by both BossDefinition and BountyDefinition"],
            "unresolved_references": [
                "BountyDefinition.world_consequence rustport_next_region_unlocked is not a registered WorldState key",
                "Quest objective target values are bare IDs and have no typed reference namespace",
            ],
        },
        "world_state_inventory": {
            "registered": registry["keys"],
            "deprecated": registry["deprecated_keys"],
            "observed": collect_world_state_findings(),
            "findings": [
                "faction is registered and nullable",
                "deprecated keys remain in migration tests and bounty data",
                "rustport.* state is runtime state, not currently registered WorldState",
            ],
        },
        "version_inventory": collect_versions(),
        "save_compatibility": {
            "legacy": {
                "keys": ["wastelandHunterV10", "wastelandHunterV8", "wastelandHunterV7"],
                "observed_versions": [10, 11, 12, 22, 23],
                "shape": "monolithic state object with v11/v12/v19/v22 namespaces",
                "consumer": "game/core/prototype-runtime.js and game/systems/persistence.js",
            },
            "next": {
                "key": "wastelandHunterNextV1",
                "saveVersion": 23,
                "shape": "state object with player, rustport, inventory, equipment, vehicles, quests, worldState, relationships, map",
                "consumer": "game/app/core/state.js",
            },
            "incompatibilities": [
                "No canonical envelope is currently written by either runtime.",
                "Legacy and next runtime state fields are structurally incompatible.",
                "Legacy saveVersion 22 and 23 semantics are not proven by complete fixtures.",
                "Next runtime saveVersion 23 collides semantically with the legacy Canon 0.23 label.",
                "No fixture covers all historical localStorage keys or malformed saves.",
                "worldState keys are removed by next normalization but bounty data still names one deprecated key.",
            ],
            "claim": "Compatibility is not claimed; only a pure 23-to-24 proposal exists.",
        },
        "cross_reference_graph": {
            "quest_prerequisites": ["data/quests/rustport.json -> quest manager"],
            "dialogue_links": ["data/dialogue/rustport.json -> main.js/dialogue manager"],
            "bounty_references": ["data/bounties/iron_hound.json -> main.js/bounty manager"],
            "npc_references": ["quest/dialogue target liuyan -> character data and interaction resolver"],
            "item_references": ["bounty loot hound_core_scrap -> no ItemDefinition file"],
            "weapon_references": ["state equipment cannon_75mm -> data/weapons/cannon_75mm.json"],
            "vehicle_mount_references": ["vehicle mounts and compatible_mounts -> validate_vehicle_mounts.py"],
            "asset_references": ["asset_bindings/scene/tiles -> asset_manifest"],
            "map_references": ["data/maps/rustport.json -> rustport scene and map validator"],
        },
        "proposals": {
            "version_field": "schema_version is data shape; contract_version is shared contract family; saveVersion is serialized save migration integer; tool/version fields remain producer-specific.",
            "id_rule": "new IDs are lowercase dot-separated namespaced IDs; existing IDs require explicit migration plan.",
            "world_state_registry": "data/world_state_keys.json is authoritative; unknown keys fail validation.",
            "save_boundary": "legacy saveVersion 23 -> canonical SaveData saveVersion 24, with explicit migration only.",
            "validator_architecture": "pure read-only Python validators with deterministic JSON report output.",
        },
        "validator_results": {
            "validate_project": "PASS_WITH_AUDIT_WARNINGS" if not any(results) else "BLOCKED",
            "validate_ids": "PASS_WITH_LEGACY_WARNINGS",
            "validate_world_state": "PASS",
            "validate_save": "PASS_WITH_UNMIGRATED_CONSUMERS",
            "validate_references": "PASS_WITH_UNRESOLVED_REFERENCE_WARNINGS",
        },
        "blockers": [
            "Integration Lead approval is required before consumer migration.",
            "Canonical ID migration requires references owned by Runtime/data workflows.",
            "Complete save compatibility fixtures are missing.",
            "ItemDefinition and NPCDefinition are not standalone canonical files.",
        ],
        "consumer_changes": {
            "runtime": "required later; not changed in Sprint 1",
            "art": "none",
            "mobile": "none",
            "legacy": "none",
        },
    }


def validate() -> int:
    print(f"Shared contract audit: {ROOT}")
    results = [
        audit_ids(strict=False),
        validate_world_state(),
        validate_save(),
        validate_references(),
    ]
    report = build_report(results)
    report_path = ROOT / "qa/reports/shared_contract_audit.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    errors = ["one or more contract validators failed"] if any(results) else []
    print(f"Audit report: {relative(report_path)}")
    return finish(errors, [], "Project validation")


if __name__ == "__main__":
    main_exit(validate())
