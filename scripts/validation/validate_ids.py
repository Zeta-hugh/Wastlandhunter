"""Audit stable IDs without rewriting existing data."""

from __future__ import annotations

import argparse
import re

from common import ROOT, finish, json_files, main_exit, read_json

CANONICAL_ID = re.compile(r"^[a-z][a-z0-9]*(\.[a-z0-9_]+)+$")
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


def audit(strict: bool = False) -> int:
    errors: list[str] = []
    warnings: list[str] = []
    seen: dict[tuple[str, str], str] = {}
    for path in json_files("data"):
        if "schemas" in path.parts or path.name == "world_state_keys.json":
            continue
        value = read_json(str(path.relative_to(ROOT)))
        if not isinstance(value, dict):
            continue
        for field in ID_FIELDS:
            identifier = value.get(field)
            if not isinstance(identifier, str):
                continue
            location = str(path.relative_to(ROOT))
            previous = seen.get((field, identifier))
            if previous:
                errors.append(f"duplicate {field} {identifier}: {previous} and {location}")
            else:
                seen[(field, identifier)] = location
            if not CANONICAL_ID.fullmatch(identifier):
                message = f"legacy/non-canonical {field} {identifier} in {location}"
                if strict:
                    errors.append(message)
                else:
                    warnings.append(message)
    return finish(errors, warnings, "ID validation")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true")
    main_exit(audit(parser.parse_args().strict))
