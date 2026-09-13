"""Validate the canonical WorldState registry and known usages."""

from __future__ import annotations

import re

from common import ROOT, finish, read_json, main_exit


def validate() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    registry = read_json("data/world_state_keys.json")
    if registry.get("schema_version") != "1.0":
        errors.append("world_state_keys.json must use schema_version 1.0")
    if registry.get("contract_version") != "1.0":
        errors.append("world_state_keys.json must use contract_version 1.0")
    keys = registry.get("keys")
    deprecated = registry.get("deprecated_keys")
    if not isinstance(keys, dict) or not keys:
        errors.append("WorldState registry must declare at least one key")
        keys = {}
    if not isinstance(deprecated, list):
        errors.append("WorldState deprecated_keys must be an array")
        deprecated = []
    for key, definition in keys.items():
        if not re.fullmatch(r"[a-z][a-z0-9_]*", key):
            errors.append(f"invalid WorldState key: {key}")
        if not isinstance(definition, dict) or "type" not in definition or "default" not in definition:
            errors.append(f"WorldState key lacks type/default: {key}")
    overlap = set(keys).intersection(deprecated)
    for key in sorted(overlap):
        errors.append(f"WorldState key is both active and deprecated: {key}")

    dialogue = read_json("data/dialogue/rustport.json")
    for entry_id, entry in dialogue.get("entries", {}).items():
        for effect in entry.get("effects", []):
            match = re.match(r"^set:worldState\.([a-z][a-z0-9_]*)=", effect)
            if match and match.group(1) not in keys:
                errors.append(f"dialogue entry {entry_id} writes unregistered key {match.group(1)}")
    if not any("faction" in key for key in keys):
        warnings.append("faction compatibility field is not registered")
    print(f"WorldState keys: {len(keys)} | deprecated: {len(deprecated)}")
    return finish(errors, warnings, "WorldState validation")


if __name__ == "__main__":
    main_exit(validate())
