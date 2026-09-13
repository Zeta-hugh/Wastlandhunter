# Rustport Sprint 1 — Runtime Migration Checklist

Date: 2026-09-13
Status: blocked pending consumer migration approval

This is an exact migration plan, not authorization to execute it. Runtime may
begin only after the Shared Contract baseline is accepted as an integration
unit and the affected tests/fixtures are ready.

| # | Exact file | Old form | New form | Required validation |
|---|---|---|---|---|
| 1 | `data/characters/liuyan.json`, `taoyao.json`, `lincheng.json`, `protagonist.json` | `character_id: liuyan` and equivalent bare IDs | Namespaced `npc.*` or approved character namespace; preserve Canon names | `validate:ids`, reference audit, route-data tests |
| 2 | `data/quests/rustport.json` | `quest_id: rustport_first_bounty` | `quest.rustport.first_bounty` or the final approved Rustport quest ID | `validate:ids`, quest reference validation, route-data tests |
| 3 | `data/bounties/iron_hound.json` and `data/bosses/iron_hound.json` | bare `iron_hound` IDs | `bounty.iron_hound` and approved boss namespace | `validate:ids`, bounty/runtime route tests |
| 4 | `data/vehicles/rust_runner.json` | `vehicle_id: rust_runner` | `vehicle.rust_runner` | `validate:ids`, vehicle mount validation, Runtime vehicle tests |
| 5 | `data/weapons/cannon_75mm.json` | `weapon_id: cannon_75mm` | `weapon.cannon_75mm` | `validate:ids`, mount/reference validation |
| 6 | `data/maps/rustport.json` and map consumers | `map_id: rustport` | `map.rustport` | `validate:ids`, map/reference validation |
| 7 | `data/tiles/ground_dirt_oily_01.json` | bare tile `asset_id` | Approved namespaced asset ID, if Asset Contract owner accepts it | `assets:validate`, `assets:maps`, reference validation |
| 8 | `game/app/core/state.js` and next save adapter | next-runtime `saveVersion: 1` | Explicit migration into canonical envelope `saveVersion: 24` | `validate:save`, migration fixtures, `test:shared`, next runtime tests |
| 9 | `game/systems/persistence.js` and legacy adapter consumers | legacy 22/23 normalizers | Preserve legacy reads; emit canonical 24 only after adapter approval | `npm test`, browser save/reload, V7/V8 fixtures |
| 10 | `game/app/core/quest.js`, `dialogue.js`, `bounty.js` | deprecated/unregistered Rustport world-state writes | Registry-backed canonical keys only; no permanent aliases | `validate:world-state`, route-data tests, integration route test |

## Execution order

1. Add migration fixtures and reference inventory.
2. Migrate definitions and all consumers as one atomic workstream.
3. Update validators/tests in the same change.
4. Run targeted tests.
5. Run serial integration validation.
6. Only then enable strict ID validation.

## Current gate

`Runtime migration: BLOCKED`

Reason: the baseline contract is documented and locally validated, but the
consumer migration has not been approved or executed. No Runtime file should
be changed solely to satisfy this checklist before the Integration Lead opens
the migration gate.

