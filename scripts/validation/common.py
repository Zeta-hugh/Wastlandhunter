"""Shared helpers for contract validators."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]


def read_json(relative_path: str) -> Any:
    path = ROOT / relative_path
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def fail(message: str) -> None:
    print(f"ERROR: {message}")


def warn(message: str) -> None:
    print(f"WARN: {message}")


def finish(errors: list[str], warnings: list[str], label: str) -> int:
    for message in warnings:
        warn(message)
    for message in errors:
        fail(message)
    if errors:
        print(f"{label} FAILED ({len(errors)} error(s))")
        return 1
    print(f"{label} PASS" + (f" ({len(warnings)} audit warning(s))" if warnings else ""))
    return 0


def json_files(*directories: str) -> list[Path]:
    files: list[Path] = []
    for directory in directories:
        files.extend((ROOT / directory).rglob("*.json"))
    return sorted(files)


def main_exit(code: int) -> None:
    sys.exit(code)
