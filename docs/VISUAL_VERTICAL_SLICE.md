# Rustport visual vertical slice

## v2 production-asset integration — 2026-09-12

The repository now uses the production asset contract. The initial Rustport ground artwork was converted into an independent 512×512 RGB source master and a 32×32 RGB runtime tile:

- `assets/source_master/tiles/ground/ground_dirt_oily_01.png`
- `assets/runtime/tiles/ground/ground_dirt_oily_01.png`
- `qa/seam_tests/ground_dirt_oily_01_4x4.png`

`game/maps/rustport-visual.js` resolves the runtime tile by `asset_id` through `AssetRegistry`; it no longer contains the image path. The full-scene concept generated from the later target collages was rejected as a runtime asset because the contract forbids concept or promotional scenes from being used as production maps.

This integration establishes the asset pipeline and a valid Rustport TMJ. It does not raise the visual milestone by itself: the remaining 220 planned image records stay `NEEDS_ART`, and the legacy character/vehicle atlases remain a compatibility layer until independent production files replace them.

## v1 street pass — 2026-09-12

This is the first production-oriented visual pass after the Canon 0.23 migration baseline. It improves the playable Rustport town scene while keeping existing gameplay geometry and authored content intact.

### Implemented

- Added a dedicated Rustport renderer in `game/maps/rustport-visual.js`; all other towns continue through the preserved renderer.
- Added the initial game-bound ground artwork; v2 subsequently imported it into the formal source-master/runtime paths above.
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
