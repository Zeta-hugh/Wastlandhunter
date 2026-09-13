# Shared Interfaces Contract

Status: proposed canonical contract, documented before consumer migration  
Date: 2026-09-13  
Owner: Shared Contract / Save / QA

The audit supporting this proposal is in
`docs/SHARED_CONTRACT_AUDIT.md`; its machine-readable output is
`qa/reports/shared_contract_audit.json`. This proposal is not an approval to
migrate current consumers.

This document is the contract boundary for Core, story/data, asset intake and
QA. It does not authorize gameplay, art, map, renderer or legacy changes.

## Contract version rules

- Definition schemas use `schema_version: "1.0"` until a breaking shape
  change requires a new major version.
- `contract_version` identifies the contract family and is independent from a
  definition's content version.
- A definition must declare its stable ID field and must not silently change
  that ID.
- `saveVersion` is an integer migration version for serialized player state.
  The current legacy save is version `23`; the first canonical save envelope is
  version `24`.
- A reader accepts versions at or below its current version only through an
  explicit migration. Future versions are rejected.
- Unknown save fields are preserved during migration unless they collide with a
  canonical field. Unknown WorldState keys are rejected from the canonical
  registry and are never copied into canonical state.

## Canonical IDs

New definitions must use lowercase dot-separated IDs:

```text
npc.liuyan
quest.rustport.first_tank
bounty.iron_hound
vehicle.rust_runner
weapon.cannon_75mm
town.rustport
```

Allowed characters are `a-z`, `0-9`, `_`, and `.`; the first segment is the
type namespace. Existing data currently uses legacy bare IDs such as
`liuyan`, `rustport_first_bounty`, `iron_hound`, and `rust_runner`. They are
recorded by `scripts/validation/validate_ids.py` as migration findings and are
not rewritten in this change. A consumer migration requires an explicit
reference audit and a separate changelog entry.

## Canonical definitions

The following interfaces are established in `data/schemas/`:

- `GameState`: mutable runtime state, not serialized directly as a contract.
- `WorldState`: registry-backed persistent world facts.
- `QuestDefinition`: quest ID, objectives, prerequisites, rewards and status.
- `NPCDefinition`: stable NPC ID, presentation and interaction metadata.
- `ItemDefinition`: stable item ID, stack/economy metadata.
- `VehicleDefinition`: stable vehicle ID, modules, mounts and collision data.
- `WeaponDefinition`: stable weapon ID, slot, runtime asset and mount data.
- `MapDefinition`: stable map ID, tile/world dimensions and status.
- `SaveData`: serialized save envelope with `saveVersion`, `schema_version`,
  state payload and migration metadata.
- `AssetEntry`: asset manifest record with paired paths, dimensions, visual
  metadata and QA flags.

The JSON schemas intentionally describe the shared minimum. Domain-specific
fields remain in their existing data files until their owners approve a
contract migration.

## WorldState registry

`data/world_state_keys.json` is the sole registry for persistent WorldState
keys. `faction` is retained as a nullable compatibility field; the registry
does not force faction membership. Legacy keys removed by the next-runtime
normalizer (`iron_hound_dead`, `rustport_next_region_unlocked`,
`rustport_bounty_claimed`) are explicitly deprecated and cannot be reintroduced
as canonical keys.

## Save migration architecture

`game/core/save/` owns pure migration functions only:

1. Parse and validate the outer envelope.
2. Identify the source `saveVersion`.
3. Apply ordered, named migrations to the next version.
4. Validate the resulting WorldState against the registry.
5. Return a mutable runtime state copy.

Storage adapters remain owned by their current runtimes until a consumer
migration is approved. This change does not change localStorage keys, legacy
HTML behavior, or runtime save writes.

## Debug tooling boundary

The development debug tooling specification is in
`docs/DEBUG_TOOLING_CONTRACT.md`. The mirrored Core-owned note at
`game/core/debug/DEBUG_TOOLING.md` defines the same command and validation
guards;
it does not add gameplay shortcuts to a shipped runtime.

## Validation commands

```text
npm run validate:project
npm run validate:ids
npm run validate:world-state
npm run validate:save
npm run validate:references
```

The default ID validator is audit mode: legacy IDs are reported without
rewriting or failing the current data set. Strict mode is available for future
CI after consumers are migrated.
