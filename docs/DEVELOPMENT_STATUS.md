# Wasteland Hunter — Development Status

This status tracks playable functionality rather than the number of files or written content. The target is an Android-first, 2.5D mobile RPG with a PC/Web development build.

## Current checkpoint

The new runtime has a Rustport route prototype and a shared orthographic 2.5D projection. The P0 architecture foundation now provides:

- legacy-aligned `GameState` fields for player, world state, quests, equipment, vehicles, relationships, hunter rank, town reputation, map position and play time (`saveVersion` remains at the 22/23 migration boundary);
- backward-compatible normalization through the existing `SaveManager` adapter;
- data-driven JSON definition loading with stable-id validation and caching;
- world entities with position `(x, y, z)`, collision footprint, interaction footprint, visibility and render depth;
- explicit startup asset gating and timeout behavior;
- a no-faction-membership default.

The Rustport playable slice remains blocked when required production records are `NEEDS_ART` or their PNG files are absent. This is intentional: incomplete art must not silently enter a release build.

## Track status

| Track | Status | Evidence / next boundary |
| --- | --- | --- |
| Core architecture | P0 foundation | `game/app/core/state.js`, `definitions.js`, `world.js`; managers still need to be wired scene-by-scene |
| 2.5D world | P0 foundation | `projection.js` and renderer foot-point/shadow path; Y-sort/occlusion/stairs/indoor transitions remain |
| Mobile camera | In progress | DPR, bounded smooth follow and look-ahead now exist; zoom/combat framing remain |
| Mobile controls | In progress | unified keyboard/touch input and context-sensitive Talk/Open/Attack label now exist; joystick, vehicle aim/fire remain |
| Character movement | In progress | 8-direction movement now uses bounded collision-aware sliding plus acceleration/deceleration; animation states remain |
| Vehicle gameplay | Blocked by art | data contract exists; chassis/turret/track QA assets are not available |
| Combat | Prototype | Iron Hound three-hit route exists; projectile, armor, AI phases and weak points remain |
| Exploration | Not started | Rustport outskirts/optional route/loot loop remains |
| Town simulation | Not started | NPC schedules and town state changes remain |
| Dialogue/cutscene | Prototype | first Liu Yan prompt exists; data-driven dialogue and presentation remain |
| Quest | In progress | `data/quests/rustport.json` and `core/quest.js` now drive the first route; graph validation and broader objective effects remain |
| Bounty | In progress | `data/bounties/iron_hound.json` and `core/bounty.js` now drive one-time reward claim; rumor/investigate/locate presentation remains |
| Inventory/equipment | Foundation | schema exists; UI and generic item/equipment operations remain |
| Progression | Foundation | independent fields exist; gameplay rules remain |
| Companions | Not started | relationship schema exists; companion content remains |
| World state | Foundation | runtime no longer writes unregistered temporary keys; canonical registry is still pending |
| Save system | In progress | normalization is aligned to the legacy 22/23 boundary; autosave/checkpoint/migration coverage remains |
| Mobile UI/UX | Prototype | safe-area HUD and touch controls exist; interaction, garage, quest and inventory UI remain |
| Audio | Not started | no runtime AudioManager yet |
| Performance | Not started | no budget instrumentation or pooling yet |
| Debug tools | Not started | no release-gated debug menu yet |
| Content validation | In progress | asset/map validators exist; definition and quest graph validators remain |
| Rustport vertical slice | Blocked | required production art is currently `NEEDS_ART`/missing |

## Approximate playable-functionality score

These are conservative, track-based estimates and are not a feature-count completion claim.

| Area | Estimate |
| --- | ---: |
| Architecture | 18% |
| Gameplay | 10% |
| Content | 5% |
| Art integration | 8% |
| Mobile UX | 12% |
| Performance | 3% |
| QA | 18% |
| Overall | 9% |

## Required next order

1. Restore or produce the Rustport production assets and return only verified records to `QA_PASS`.
2. Add collision-aware movement and context-sensitive mobile interaction.
3. Add Rust Runner vehicle controller using the shared vehicle schema.
4. Add Rustport outskirts, first ruin and the bounty-claim/next-region hook.
