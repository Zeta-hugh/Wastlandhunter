# Rustport Sprint 1 — Ownership Matrix

Date: 2026-09-13

The owner column is authoritative for the current parallel plan. A missing
directory is recorded as `planned/missing`; it must not be created by another
workstream as a workaround.

| Path | Owner | Current repository state | Access rule |
|---|---|---|---|
| `data/schemas/` | Shared Contract / Save / QA | Present, tracked baseline files | Sole contract owner |
| `data/world_state_keys.json` | Shared Contract / Save / QA | Present, tracked | Sole contract owner |
| `data/asset_manifest.json` | Production Art, contract shape reviewed by Integration | Present and existing | Art owns asset records; structural changes require Integration review |
| `data/asset_bindings.json` | Production Art | Present and existing | Art owns binding updates; consumers read only |
| `data/quests/` | Runtime / Content | Present | Runtime consumes; contract migrations require Shared Contract approval |
| `data/dialogue/` | Runtime / Content | Present | Runtime consumes; contract migrations require Shared Contract approval |
| `data/bounties/` | Runtime / Content | Present | Runtime consumes; contract migrations require Shared Contract approval |
| `game/app/` | Runtime, with Mobile overlap review | Present | Runtime owns gameplay; Mobile must report file overlap before edits |
| `game/core/` | Runtime, with Shared Contract-owned `save/` and `debug/` exceptions | Present | Subdirectory ownership follows this matrix |
| `game/core/save/` | Shared Contract / Save / QA | Present, tracked baseline | Sole Save contract owner until consumer migration |
| `game/core/debug/` | Shared Contract / Save / QA | Present, tracked specification | Specification only unless Integration approves implementation |
| `game/systems/` | Runtime | Present | Runtime owner |
| `assets/` | Production Art | Present | Art owner; no placeholders |
| `maps/` | Runtime / Map integration | Present | No edits in Sprint 1 unless explicitly approved |
| `game/maps/` | Runtime / Map integration | Present | Renderer/map owner; Mobile must not refactor without review |
| `qa/` | QA and owning workstream reports | Present | Reports may be added; shared conclusions require Integration review |
| `scripts/validation/` | Shared Contract / Save / QA | Present, tracked baseline | Sole shared validator owner |
| `scripts/assets/` | Production Art | Present | Asset validation/import owner |
| `docs/` | Integration plus document owners | Present | Contract and integration docs require Integration review |
| `android/` | Mobile / Platform | Present | Mobile owner; no Sprint 1 migration yet |
| `config/android/` | Mobile / Platform | Missing | Do not create solely to match the plan |
| `legacy/` | No workstream; preserved artifact | Present | Read-only, never modify |
| `dist/`, `dist-next/` | Build outputs | Generated/shared | Never rebuild concurrently; never treat as source ownership |

## Shared-file rule

Any change touching SaveData, WorldState, schema files, contract documents,
asset-manifest structure or legacy compatibility requires Integration review
before consumer changes.

