"""Validate the canonical save envelope and migration boundary."""

from __future__ import annotations

from common import finish, main_exit

CURRENT_SAVE_VERSION = 24
LEGACY_SAVE_VERSION = 23


def validate() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    envelope = {
        "schema_version": "1.0",
        "saveVersion": CURRENT_SAVE_VERSION,
        "migratedFrom": LEGACY_SAVE_VERSION,
        "state": {"worldState": {"faction": None}},
    }
    if envelope["saveVersion"] < CURRENT_SAVE_VERSION:
        errors.append("canonical saveVersion must not be below 24")
    if envelope["migratedFrom"] != LEGACY_SAVE_VERSION:
        errors.append("the first canonical migration boundary must be legacy saveVersion 23")
    if not isinstance(envelope["state"], dict):
        errors.append("SaveData.state must be an object")
    warnings.append("runtime storage adapters still own localStorage keys; no consumer was migrated")
    return finish(errors, warnings, "Save validation")


if __name__ == "__main__":
    main_exit(validate())
