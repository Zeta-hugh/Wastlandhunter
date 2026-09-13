# Rustport Runtime Flow

Status: Sprint 1 behavior trace. This is a record of the current minimal route,
not a content redesign.

## Route chain

```text
Liu Yan dialogue
  -> Rust Runner repair condition
  -> Iron Hound three-hit encounter
  -> Liu Yan bounty claim
```

## Boot and definition loading

`game/app/main.js:boot()` loads, in parallel:

1. `data/quests/rustport.json` as `rustport_first_bounty`;
2. `data/dialogue/rustport.json` as `rustport_intro`;
3. `data/bounties/iron_hound.json` as `iron_hound`;
4. `data/vehicles/rust_runner.json` as `rust_runner`.

Definitions are validated by `loadDefinition()` and recursively frozen. Any
failed request, invalid response, missing stable ID, or ID mismatch rejects boot.
The runtime then loads the required production assets and Rustport scene. The
asset gate accepts only `QA_PASS` records, so missing production art keeps the
next runtime in its intentional blocked state.

## 1. Liu Yan interaction

- Trigger: confirm input while the player is within the `liuyan` interaction
  radius and the current objective is `meet_liuyan`.
- Definition: `data/dialogue/rustport.json`, entry `liuyan_intro`.
- State mutation:
  - `state.rustport.arrivalSeen = true`;
  - dialogue effect sets `state.rustport.liuyanMet = true`;
  - quest manager advances `rustport_first_bounty` from `meet_liuyan`.
- Expected outcome: current objective becomes `repair_starter_tank`.
- Unresolved dependency: Dialogue `conditions` are loaded but not evaluated by
  the current adapter.

## 2. Rust Runner repair

- Trigger: confirm input near `garage` while the current objective is
  `repair_starter_tank`.
- Definition: Quest objective target `rust_runner`; vehicle definition is loaded
  at boot.
- State mutation:
  - `state.rustport.starterTankReady = true`;
  - six scrap are removed, clamped at zero;
  - quest advances to `kill_iron_hound`.
- Expected outcome: Iron Hound becomes interactable and the renderer can draw
  the vehicle when the required assets are available.
- Unresolved dependency: the current route does not validate an explicit
  `VehicleDefinition` repair cost or ownership field; it uses the fixed route
  cost of six scrap.

## 3. Iron Hound encounter

- Trigger: confirm input near `iron_hound` while the current objective is
  `kill_iron_hound`.
- Definition: Quest objective target `iron_hound`; BountyDefinition supplies
  reward data after victory.
- State mutation per hit:
  - increments `state.rustport.combatHits`;
  - sets `lastAction` and `actionUntil`.
- State mutation at three hits:
  - `state.rustport.ironHoundDefeated = true`;
  - quest advances to `claim_bounty`.
- Expected outcome: the route reports victory and points back to Liu Yan.
- Unresolved dependency: combat is represented by the focused interaction
  route, not a separate combat system or weapon definition consumer.

## 4. Bounty claim

- Trigger: confirm input near Liu Yan while the objective is `claim_bounty` and
  `ironHoundDefeated` is true.
- Definition: `data/bounties/iron_hound.json`.
- State mutation:
  - adds 350 gold;
  - adds 8 scrap;
  - adds 1 hunter rank;
  - advances the quest to completion;
  - resolves the `bounty_claimed` dialogue entry.
- Expected outcome: duplicate claim is rejected by the quest completion callback.
- Unresolved dependency: `world_consequence` is present in Content but is not
  executed because its referenced WorldState key is not registered.

## Failure and isolation behavior

- Missing definition IDs do not fall back to another definition.
- Missing dialogue entries throw.
- Unsupported dialogue effects throw.
- Unknown WorldState effect keys throw.
- Bounty claim before defeat throws.
- Definition objects are immutable; state objects are mutable.
- Asset or scene contract failures stop boot and report the unavailable state.

## Contract migration touchpoints

If the Contract Lead approves migration later, the minimum Runtime touchpoints
will be:

- `game/app/main.js` route lookup keys and definition load IDs;
- `game/app/core/definitions.js` ID field/format validation;
- `game/app/core/quest.js` QuestState lookup keys;
- `game/app/core/dialogue.js` entry/effect references;
- `game/app/core/bounty.js` reward and completion boundary;
- `game/app/core/state.js` normalization and storage boundary;
- focused route and architecture tests;
- the three Rustport definition files, owned by Content rather than Runtime.

No migration is performed by this Sprint 1 audit.
