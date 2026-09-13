# Shared Interfaces Changelog

## 2026-09-13 — Contract baseline

- Documented schema version rules and the `saveVersion` 23 → 24 boundary.
- Established lowercase dot-separated canonical IDs for new definitions.
- Audited existing bare IDs without performing a blind migration.
- Added the canonical WorldState registry contract.
- Defined the `GameState`, `WorldState`, quest, NPC, item, vehicle, weapon,
  map, save and asset interface families.
- Defined pure save migration ownership under `game/core/save/`.
- Defined development-only debug tooling under `game/core/debug/`.
- Added project, ID, WorldState, save and reference validation entry points.
- No gameplay, art, map, renderer, mobile, SaveData consumer, or legacy
  implementation was changed.
