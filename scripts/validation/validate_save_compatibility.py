"""Report save compatibility gaps; never claim compatibility."""

from __future__ import annotations

from common import finish, main_exit


def validate() -> int:
    warnings = [
        "legacy save versions 10, 11, 12, 22, and 23 are observed",
        "next runtime writes saveVersion 23 under wastelandHunterNextV1",
        "no complete historical save fixtures were supplied",
        "legacy and next runtime state shapes have no canonical envelope",
    ]
    return finish([], warnings, "Save compatibility audit")


if __name__ == "__main__":
    main_exit(validate())
