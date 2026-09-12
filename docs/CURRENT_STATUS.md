# CURRENT STATUS — 2026-09-12

## Latest preserved playable build
`legacy/WastelandHunter_CanonBuild_0.23.0_single.html`

Approximate size: 1.8 MB. It is a self-contained browser prototype.

## Development lineage
Major prototype sequence: v0.14 → 0.15 → 0.16 → 0.17 → 0.18 → 0.19 → 0.22 → Canon 0.23.

### v0.17 focus
8-direction characters; walk/action sprite concepts; chassis/turret separation; recoil/projectiles/explosions; animated enemies; Iron Hound states; scene-integrated dialogue cutouts.

### v0.18 focus
World/town density; profession NPCs; town prop atlas; ten boss assets/states; denser first towns; rare encounters; environmental story spots; boss phases.

### v0.19 “soul pass”
Recurring named NPCs; dialogue changes after crises; companion night scenes; radio banter; travel memories; first-tank keepsake; town recovery; relationship stages.

### v0.22 First Milestone
Authored Rustport side stories; consequence choices; first personal arcs for Liu Yan/Tao Yao/Lin Cheng; NPC schedules; town reputation; hunter rank; world-state menu; persistent consequences; chapter epilogue.

### v0.23 Canon integration
Added 2128/Ash Year 64 Canon, three transregional powers, Old Calendar survivors, Zero Protocol, Canon town contexts/arrival/ambient lore, world archive, neutral hunter framing and revised story context.

## What is good enough to preserve
- Core hunter fantasy and progression direction.
- Canon worldbuilding.
- Ten-town narrative skeleton.
- Main companions and relationship direction.
- Tank modularity concept.
- Existing quest/system logic that can be migrated.
- Hunter rank / town reputation / world state philosophy.

## What is NOT good enough
- Overall runtime art quality.
- World-map rendering.
- Placeholder/procedural-looking buildings.
- Character sprite fidelity and animation depth.
- Tank visual detail/modularity.
- Enemy/Boss asset differentiation.
- Dialogue presentation quality.
- Dungeon presentation.
- Combat staging/effects.
- UI consistency.
- Monolithic single-HTML engineering architecture.

## Correct completion assessment
Story/system skeleton: roughly 50% maturity.
Visual maturity: roughly 20–30%.
Overall player-perceived maturity: roughly 30–35%.

This assessment supersedes any earlier “80%” wording. 80% is a future quality target, not the current state.

## Current strategic decision
Do NOT keep expanding content breadth. Build a polished Rustport vertical slice first and establish reusable production standards.

## Latest engineering pass — 2026-09-12

## Production art reset — 2026-09-12

The four repository-root reference boards (`image.png` through `image4.png`) are now the visual direction reference for the production library. After review, all previously generated production images were intentionally removed from source master, runtime, release, and generated next-build copies. Their manifest records, stable asset IDs, binding schema, and import pipeline remain intact and are reset to `NEEDS_ART` for a clean rebuild. The legacy Canon 0.23 prototype and `assets/legacy/` compatibility material were not modified.

The release manifest currently contains zero production assets by design. Runtime visual tests that require `QA_PASS` files should remain blocked until the first R1-aligned replacement set is imported.

- Mobile virtual controls now use pointer capture and guaranteed release paths.
- Canvas rendering keeps the 960×540 logical coordinate system while scaling for device pixel ratio.
- Save/load failures are surfaced instead of being silently swallowed; V10/V8/V7 compatibility reads remain.
- Rustport route coverage verifies arrival, garage return, Iron Hound victory and persisted bounty state.
- Battle feedback includes input locking, hit flash and screen shake.
- `npm test`, `npm run test:route`, `npm run test:browser`, `npm run test:visual`, manifest validation and map validation pass in the project environments.

The next narrow objective is replacing compatibility character, vehicle and boss presentation in the Rustport slice with independent production assets.

## Independent runtime foundation — 2026-09-12

The project now has a separate `game/app/` runtime foundation instead of extending the legacy monolithic HTML:

- shared state, input routing, device-pixel rendering and save adapter;
- `next.html` Web/PWA entry with `app.webmanifest`;
- `dist-next/` build target;
- Capacitor configuration and an `android/` shell using the same next runtime;
- `npm run test:next` verifies the independent entry and touch/keyboard input.

The current next entry is an infrastructure slice, not visual milestone acceptance. Production Rustport art and the complete route will be migrated into it incrementally; the legacy browser entry remains available for compatibility regression coverage.

The next runtime now includes the first playable Rustport route: Liu Yan interaction, starter-tank repair, three-hit Iron Hound encounter and bounty settlement. `npm run test:next` covers this route through the public input surface.

The next runtime now loads every available `QA_PASS` record through `game/app/core/assets.js`. The Rustport slice uses the approved ground tile, road variants, awning, barrel and 75mm cannon; incomplete manifest records are not requested by the renderer.

Rustport combat feedback now keeps the approved Iron Hound death frame visible briefly after the final hit, while cannon placement follows the target's world position instead of remaining fixed to the viewport.

The new runtime now uses a shared 3/4 orthographic 2.5D projection for world ground, entity foot points, elevation and shadows. Startup has an explicit production-asset gate with a 15-second manifest/image timeout; it reports an actionable unavailable state instead of stopping the first animation frame after a missing asset. The current worktree still has the required Rustport production records at `NEEDS_ART`, so the playable slice is intentionally blocked until those files pass QA.

The Rustport route definition is now separated into `data/quests/rustport.json`, `data/dialogue/rustport.json` and `data/bounties/iron_hound.json`. Runtime managers advance the route and prevent duplicate bounty claims; art synchronization remains owned by the parallel asset-production workflow.

The next runtime now uses a shared movement controller with bounded circular collision and axis sliding, plus a context resolver that changes the mobile action label to 交谈, 进入车库 or 攻击 when the current Quest objective and proximity match.

The Rustport runtime now treats `rustport` fields and QuestState as the temporary compatibility boundary for this route. It no longer writes unregistered `worldState` keys, strips those keys when normalizing old next-runtime saves, and keeps `saveVersion` at the legacy 22/23 migration boundary until the canonical migration registry is available.

Movement now has acceleration/deceleration and retained velocity, while a separate camera module provides damped follow, look-ahead and map bounds before combat framing and zoom are added.
