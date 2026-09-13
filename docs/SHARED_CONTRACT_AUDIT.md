# Shared Contract Audit — Sprint 1

Date: 2026-09-13  
Mode: read-only audit; no production data migration

Machine-readable output: `qa/reports/shared_contract_audit.json`.

## A. Structures audited

| Structure | Current files | Actual consumers | Current version fields |
|---|---|---|---|
| `GameState` | `game/app/core/state.js`, `game/core/state.js` | next `main.js`, renderer, quest/dialogue/bounty managers, legacy prototype, persistence | `saveVersion`, `version` |
| `WorldState` | `game/app/core/state.js`, `data/world_state_keys.json` | dialogue effects, next normalizer, tests, proposed save migration | `schema_version`, `contract_version` |
| `QuestDefinition` | `data/quests/rustport.json` | next main, quest manager, route tests | none |
| `DialogueDefinition` | `data/dialogue/rustport.json` | next main, dialogue manager, route tests | none |
| `BountyDefinition` | `data/bounties/iron_hound.json` | next main, bounty manager, route tests | none |
| `NPCDefinition` | `data/characters/*.json` | next main/renderer/dialogue references | none |
| `ItemDefinition` | no standalone file; inventory and loot strings | bounty manager, persistence, legacy prototype | none |
| `VehicleDefinition` | `data/vehicles/rust_runner.json` | next main/renderer, asset and mount validation | none |
| `WeaponDefinition` | `data/weapons/cannon_75mm.json` | next state/renderer, mount validation | none |
| `MapDefinition` | `data/maps/rustport.json`, scene and tile files | scene loader, map validator, asset registry | `schema_version`, Tiled `version` |
| `SaveData` | next state, legacy persistence/prototype, proposed save module | localStorage adapters and browser tests | `saveVersion`, `version` |
| `AssetEntry` | `data/asset_manifest.json` | next/core asset registries and asset validators | `schema_version`, `contract_version` |

### Current fields and cross-definition references

The JSON field inventory is captured in the report under `structures`. Important
gaps are explicit: there is no standalone `ItemDefinition`, no standalone
`NPCDefinition`, and quest/dialogue/bounty files do not carry schema versions.

## B. ID findings

The report inventories every current ID under `id_inventory.all_ids` and
classifies them as `bare_ids`, `prefixed_ids`, `duplicates`, `ambiguous`, or
`unresolved_references`.

Findings:

- Current IDs are predominantly bare: `liuyan`, `rustport_first_bounty`,
  `iron_hound`, `rust_runner`, `cannon_75mm`, `rustport`, and asset IDs.
- `iron_hound` is semantically ambiguous because it identifies both a boss and a
  bounty in separate definition types.
- `bounty.world_consequence` points at
  `rustport_next_region_unlocked`, which is deprecated and not registered.
- Quest objective targets are untyped bare IDs.
- No IDs were renamed, aliased, or rewritten.

## C. WorldState findings

Registered:

- `faction: string|null`, default `null`; this preserves the independent hunter
  rule.

Observed WorldState-like keys:

- `faction` — registered.
- `iron_hound_dead` — deprecated; appears in migration tests and old save
  normalization.
- `rustport_next_region_unlocked` — deprecated/unregistered; appears in bounty
  data and old normalization.
- `rustport_bounty_claimed` — deprecated; appears in old normalization.
- `rustport.*` fields such as `rustport.liuyanMet` are runtime route state, not
  registered WorldState.

This is a semantic boundary requiring Integration Lead approval before changing
consumers.

## D. Version findings

- `schema_version: "1.0"` is used for asset bindings, asset manifest, scene,
  tiles and the new shared schemas.
- `contract_version: "1.0"` currently appears on asset contracts and the new
  registry/schemas.
- `saveVersion` is not consistent: legacy code observes 10, 11, 12, 22 and
  23; next runtime initializes and normalizes to 23.
- `version` is used as a second save field in next state and is also used by
  Tiled as a producer format field.
- `tiledversion: "1.11.0"` describes the Tiled producer, not the game contract.
- No `schemaVersion` or `manifestVersion` or `mapSchemaVersion` field was
  found in current owned data.

## E. Save compatibility findings

Legacy saves use localStorage keys `wastelandHunterV10`, `V8`, and `V7` and a
monolithic state with `v11`, `v12`, `v19`, and `v22` namespaces. The next
runtime uses `wastelandHunterNextV1` and a different state shape. Complete
historical fixtures are absent.

Compatibility is **not claimed**. Explicit gaps:

- no canonical envelope is currently written;
- legacy and next state shapes are incompatible;
- saveVersion 22/23 semantics are not proven by complete fixtures;
- next saveVersion 23 collides semantically with the legacy 0.23 lineage;
- malformed, partial and all historical-key fixtures are missing;
- deprecated WorldState names still occur in content/tests.

## F. Cross-reference graph

- Quest prerequisites/objectives → quest manager; targets are currently bare.
- Dialogue entries/effects → dialogue manager; effects can write runtime paths
  and are guarded only for registered `worldState` keys.
- Bounty reward/loot/consequence → bounty manager; loot lacks ItemDefinition
  and consequence points at a deprecated key.
- NPC targets → character JSON, interaction resolver and dialogue.
- Weapons → vehicle equipment, cannon definition and vehicle mount validator.
- Vehicle mounts → vehicle definition, weapon compatibility and asset records.
- Assets → manifest, bindings, scene, tiles and asset registries.
- Maps → map definition, Rustport scene and map validator.

## G. Canonical proposals (pending Integration Lead approval)

1. `schema_version` describes data shape; `contract_version` describes the
   shared contract family; `saveVersion` is only the serialized save migration
   integer; producer fields such as Tiled `version` remain local.
2. New IDs use lowercase dot-separated namespaces:
   `npc.liuyan`, `quest.rustport.first_bounty`, `bounty.iron_hound`,
   `vehicle.rust_runner`, `weapon.cannon_75mm`, `town.rustport`.
3. `data/world_state_keys.json` is authoritative and unknown keys fail audit.
4. A future canonical SaveData boundary is legacy 23 → canonical 24, through
   an explicit migration only.
5. Validators remain deterministic, read-only Python tools and emit the JSON
   report.

## H. Validator commands/results

```text
npm run validate:project             PASS_WITH_AUDIT_WARNINGS
npm run validate:ids                 PASS_WITH_11_LEGACY_ID_WARNINGS
npm run validate:world-state         PASS
npm run validate:save                PASS_WITH_UNMIGRATED_CONSUMERS
npm run validate:references          PASS_WITH_UNRESOLVED_REFERENCE_WARNINGS
npm run validate:versions            PASS_WITH_SEMANTIC_REVIEW
npm run validate:save-compatibility  PASS_WITH_EXPLICIT_GAPS
```

`validate_project.py` writes deterministic output to
`qa/reports/shared_contract_audit.json`.

## I–K. Consumer impact

- Runtime: later changes required to adopt canonical SaveData and IDs; no
  runtime consumer changed in this sprint.
- Art: no changes.
- Mobile: no changes.
- Maps, renderer, combat, assets and legacy: no changes.

## L. Blockers

- Integration Lead approval is required before breaking contract changes.
- ID migration crosses Runtime/data ownership boundaries.
- Complete save fixtures are missing.
- ItemDefinition and NPCDefinition are not standalone definitions.
- The deprecated bounty consequence requires an owner decision.

## M. Status

**BLOCKED / READY_FOR_REVIEW** — audit deliverables are complete and safe for
Integration Lead review; consumer migration is intentionally not authorized.
