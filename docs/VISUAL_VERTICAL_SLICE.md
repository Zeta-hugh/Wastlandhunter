# Rustport visual vertical slice

## v1 street pass — 2026-09-12

This is the first production-oriented visual pass after the Canon 0.23 migration baseline. It improves the playable Rustport town scene while keeping existing gameplay geometry and authored content intact.

### Implemented

- Added a dedicated Rustport renderer in `game/maps/rustport-visual.js`; all other towns continue through the preserved renderer.
- Added a game-bound ground asset at `assets/environments/rustport-ground-v1.png`.
- Rebuilt Rustport's visible street layer: seawater and seawall, road hierarchy, drains, building depth and roofs, distinct service-building facades, doors aligned to existing interaction coordinates, cargo, barrels, utility cables, lamps, smoke and foreground pipes.
- Added different day and dusk treatment without changing the existing time state.
- Preserved town collision, doors, NPC schedules, quests, player/tank rendering, save keys and balance.
- Added `tests/visual-rustport.mjs` for asset loading, day/dusk differentiation, screenshot capture and runtime-error detection.

### Ground-asset generation record

Mode: built-in image generation.

Final prompt:

> Use case: stylized-concept. Asset type: production game environment texture for a 3/4 top-down pixel-art RPG. Create one seamless square ground texture for Rustport, a post-nuclear coastal industrial settlement in 2128. The surface is dense wet dock paving assembled from dark slate cobblestones, cracked poured concrete, patched steel plates, drainage channels, salt stains, small rust marks, tire wear, and subtle shallow puddles. Polished hand-authored pixel art, crisp pixel clusters, readable materials, designed for nearest-neighbor filtering. Strict orthographic top-down surface texture, evenly distributed detail, seamless on all four edges, no horizon or perspective vanishing point. Overcast cold ambient light with sparse warm industrial reflections; muted charcoal, oxidized brown, blue-gray and dirty ochre. Surface only: no buildings, vehicles, characters, props, signs, UI, labels, letters, borders, grid separators, watermark or large landmark. Avoid flat gray blocks, photorealism, an isometric scene, large debris, text, logos and high-frequency noise.

The generated source was copied into the repository and used at reduced contrast beneath code-authored navigation and architecture. It is not presented as concept art or a screenshot substitute.

### Validation

- Migration reconstruction test passes, with the new renderer explicitly separated from the preserved prototype comparison.
- Full browser regression passes: fresh origin, movement, save/reload, V7-key fallback, asset loading and combat action.
- Visual browser check passes in Google Chrome at 960 × 540 with no page or asset errors.
- Curated actual-runtime captures: `docs/screenshots/rustport-v1-day.png` and `docs/screenshots/rustport-v1-dusk.png`.

### Acceptance boundary

This street pass does not complete the Rustport vertical slice. The character sprites remain too small and weakly differentiated, the first tank and Iron Hound still use legacy presentation, interiors have not received the same material standard, and HUD/dialogue consistency remains unfinished. The next pass should address the protagonist and Liu Yan together so their gameplay sprites, scale, facing and dialogue cutouts share one visual identity.
