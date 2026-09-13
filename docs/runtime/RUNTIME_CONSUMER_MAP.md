# Runtime Consumer Map

Status: Sprint 1 runtime audit. This document records current behavior only. It
does not approve or apply ID, schema, WorldState, or save migrations.

## QuestDefinition

- Source: `data/quests/rustport.json`
- Consumer: `game/app/main.js`; `createQuestManager()` in
  `game/app/core/quest.js`
- Fields read:
  - `quest_id` is validated by `loadDefinition()`.
  - `status` initializes a QuestState entry.
  - `objectives[]` is read through `objectiveIndex`.
  - each objective `id` is compared during `advance()`.
  - `rewards` is not read by the quest manager; bounty reward data is consumed
    by the bounty manager.
- Fields mutated: none. The definition is frozen after loading.
- State mutated: `state.quests[id]` with `status`, `objectiveIndex`, and
  `progress`.
- Assumptions: the requested definition ID exists, `objectives` is an array,
  and the current objective ID matches the caller's transition.
- Default behavior: an absent QuestState starts as the definition status or
  `LOCKED`; `start()` changes `AVAILABLE` to `ACTIVE`.
- Failure behavior: an unknown definition ID currently fails through property
  access; an invalid transition returns `false`; an absent current objective
  returns `false`. No fallback definition is created.

## DialogueDefinition

- Source: `data/dialogue/rustport.json`
- Consumer: `createDialogueManager()` in `game/app/core/dialogue.js`;
  route calls are wired in `game/app/main.js`.
- Fields read:
  - `dialogue_id` is validated by `loadDefinition()`.
  - `entries[id]` selects an entry.
  - entry `effects` are parsed and applied.
  - entry `text` is displayed by the route.
  - entry `conditions` are present in data but are not evaluated by the
    current adapter.
- Fields mutated: none. The definition is frozen after loading.
- State mutated: effect target paths, with an explicit guard for
  `worldState.<key>`.
- Assumptions: entries exist and effects use the current `set:path=value`
  grammar.
- Default behavior: an omitted effects array is treated as empty.
- Failure behavior: missing entries and unsupported effects throw explicit
  errors; unknown WorldState keys throw instead of being created.

## BountyDefinition

- Source: `data/bounties/iron_hound.json`
- Consumer: `createBountyManager()` in `game/app/core/bounty.js`;
  route wiring is in `game/app/main.js`.
- Fields read:
  - `bounty_id` is validated by `loadDefinition()`.
  - `reward.gold`, `reward.scrap`, and `reward.hunterRank` are applied on
    successful claim.
  - `world_consequence` is currently not executed by Runtime.
- Fields mutated: none. The definition is frozen after loading.
- State mutated: `state.inventory.gold`, `state.inventory.scrap`, and
  `state.hunterRank`.
- Assumptions: `state.rustport.ironHoundDefeated` is the route precondition and
  the injected `isClaimed()` callback owns duplicate-claim detection.
- Default behavior: duplicate claims return `false`.
- Failure behavior: claiming before defeat throws; malformed reward data
  propagates a normal runtime error rather than being silently defaulted.

## WorldState

- Source: `state.worldState` in `game/app/core/state.js`.
- Consumer: dialogue effect adapter and save normalization.
- Current field: `faction`, initialized to `null`.
- Fields mutated: only registered existing keys may be mutated by dialogue
  effects. The route uses `state.rustport.*` for temporary Rustport state and
  does not write new WorldState keys.
- Assumptions: the current registry surface is represented by existing keys;
  no new key may be inferred from Content.
- Failure behavior: unknown `worldState` effect keys throw. Deprecated
  unregistered keys are removed during next-state normalization/migration.

## GameState

- Source: `createInitialState()` and `normalizeState()` in
  `game/app/core/state.js`.
- Consumer: `game/app/main.js`, quest/dialogue/bounty managers, movement,
  camera, and renderer.
- Fields read and mutated by the Rustport route:
  - `player.x`, `player.y`, `player.facing`
  - `rustport.arrivalSeen`, `starterTankReady`, `ironHoundDefeated`,
    `combatHits`, `lastAction`, `actionUntil`
  - `inventory.scrap`, `inventory.gold`
  - `quests[questId]`
  - `hunterRank`
- Other initialized fields include equipment, vehicles, relationships,
  town reputation, map position, play time, and `updatedAt`.
- Assumptions: normalization supplies the expected nested defaults.
- Failure behavior: invalid top-level storage values return a fresh initial
  state; save failures are logged and rethrown.

## SaveData

- Next runtime consumer: `createStorage()` in `game/app/core/state.js`.
- Next runtime key: `wastelandHunterNextV1`.
- Fields read: serialized state object, with `saveVersion` and `version` set to
  `23` by the current next-state normalizer.
- Fields mutated: normalization creates a new state object and removes known
  deprecated WorldState keys; storage writes the normalized object.
- Legacy migration consumer: `game/core/save/migrations.js`.
- Legacy migration fields: envelope `saveVersion`, `state`, optional
  `schema_version`; current migration code defines `CURRENT_SAVE_VERSION=24`
  and accepts legacy version `23` only through its explicit migration path.
- Failure behavior: malformed envelopes, unsupported future versions, missing
  schema versions for current saves, and unknown versions throw in the legacy
  migration module. Next storage load returns a fresh state after logging a
  parse/storage error.
- Migration touchpoint: these two save paths must not be unified without an
  approved migration design.

## VehicleDefinition

- Source: `data/vehicles/rust_runner.json`
- Consumer: loaded in `game/app/main.js` and passed to
  `createRenderer()` in `game/app/core/renderer.js`.
- Fields read: `vehicle_id` for identity validation; `pivot` for chassis
  placement; `mounts.main_gun` for cannon placement. Other chassis, tracks,
  turret, collision, and mount fields remain data contract metadata for future
  rendering expansion.
- Fields mutated: none. The loaded definition is frozen.
- Assumptions: pivot and main-gun mount coordinates match the asset metadata.
- Failure behavior: definition load and ID mismatch errors propagate; missing
  renderer fields fall back only to the renderer's existing hard-coded defaults
  for current behavior.

## WeaponDefinition

- Source: `data/weapons/cannon_75mm.json`
- Direct definition consumer: none in `game/app/main.js`; the next renderer
  resolves the weapon image through the production asset lookup
  `cannon_75mm`.
- Fields read by current Runtime: no JSON fields are read from this definition.
  The asset manifest record supplies runtime image, pivot, and loading status.
- Fields mutated: none.
- Assumptions: the asset ID and the vehicle mount contract remain aligned.
- Failure behavior: missing or non-QA asset records fail through
  `loadProductionAssets()` or asset registry lookup.
- Migration touchpoint: an approved future weapon consumer must explicitly
  define this boundary rather than silently borrowing vehicle fields.

## Asset lookup

- Next runtime consumer: `loadProductionAssets()` in
  `game/app/core/assets.js`; renderer calls `assets.get()` and `assets.record()`.
- Fields read: manifest `assets[]`, `asset_id`, `status`, `runtime`, and `pivot`
  records.
- Fields mutated: an in-memory image map only; manifest and asset records are
  not mutated.
- Default behavior: only `QA_PASS` records are loaded.
- Failure behavior: manifest errors, missing required IDs, image errors, and
  timeouts throw explicit errors. No placeholder asset is substituted.

## Mutation audit conclusion

Definitions loaded by `loadDefinition()` or `createDefinitionRegistry()` are
recursively frozen. Runtime state remains mutable. Current focused tests verify
both properties, cache identity, and error propagation.
