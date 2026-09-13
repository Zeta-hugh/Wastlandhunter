# 2.5D Spatial Test Report — Sprint 1

Date: 2026-09-13  
Status: `READY_FOR_REVIEW`

## A. Actual directory / ownership map

See [FILE_OWNERSHIP_OVERLAP.md](../../docs/MOBILE/FILE_OWNERSHIP_OVERLAP.md).
Runtime owns the existing renderer/camera/input/movement/world modules; the
new experiment is isolated under `game/app/spatial-sandbox/`.

## B. Files changed

- `game/app/spatial-sandbox/model.js`
- `game/app/spatial-sandbox/scene.js`
- `game/app/spatial-sandbox/index.html`
- `tests/spatial-sandbox.test.mjs`
- `tests/spatial-sandbox-browser.mjs`
- `docs/MOBILE/2_5D_SPATIAL_MODEL.md`
- `docs/MOBILE/FILE_OWNERSHIP_OVERLAP.md`
- `qa/reports/2_5d_spatial_test.md`
- `qa/runtime_previews/2_5d_spatial_sandbox.png` (generated runtime evidence)

No Runtime-owned, Android, Capacitor, legacy, production-art, schema, save, or
WorldState files were changed.

## C. Spatial model

The sandbox defines explicit `worldX`, `worldY`, `visualZ`, `height`, `pivot`,
`groundContact`, `collisionFootprint`, `interactionFootprint`, and
`depthBias`. Ordering is `worldY + visualZ * 0.35 + layer + depthBias`.
Full semantics are documented in [2_5D_SPATIAL_MODEL.md](../../docs/MOBILE/2_5D_SPATIAL_MODEL.md).

## D. Sorting test cases / results

| Case | Result |
| --- | --- |
| Actor behind normal object | PASS; lower `worldY` sorts first |
| Actor in front of normal object | PASS; higher `worldY` sorts later |
| Actor behind tall wall | PASS; lower `worldY` draws actor before the wall |
| Actor on elevated platform | PASS; matching `visualZ` keeps actor on platform |
| Actor under bridge | PASS; actor layer precedes bridge-over foreground layer |
| Foreground occlusion | PASS; foreground depth bias precedes the actor-front fixture |
| Y-sort | PASS; deterministic numeric key plus ID tie-break |
| Elevation-dependent sort | PASS; `visualZ` changes both placement and key |

## E. Collision / visual separation

Automated tests prove that changing `pivot` changes visual placement but not
collision bounds, and changing visual `height` does not change ground contact or
collision bounds. Sprite/debug rectangles are never used to derive collision.

## F. Camera compatibility

The sandbox uses the same logical 3/4 coordinate assumptions as the current
camera/projection (`game/app/core/camera.js` and `projection.js`) and renders
correctly in a 1200×700 browser viewport. No camera implementation was
changed; full mobile camera work remains out of scope.

## G. Performance baseline

Browser smoke test: 13 debug objects, 1 canvas, one draw per animation frame,
no runtime errors, at least 45 rendered frames during a one-second headless
Chrome sample. Exact frame/draw counts are printed by
`tests/spatial-sandbox-browser.mjs`; the screenshot is
`qa/runtime_previews/2_5d_spatial_sandbox.png`.

## H. Cross-workstream dependencies

- Runtime approval is required before integrating sorting or footprint
  semantics into production renderer/world code.
- Contract approval is required before any production schema fields are
  introduced.
- Production Art remains independent; this sandbox uses debug geometry only.
- Android packaging is unchanged and can consume the sandbox only after an
  explicit integration decision.

## I. Blockers

Production integration is intentionally blocked pending Runtime/Contract
approval. This sprint does not prove mobile controls, production art
occlusion, indoor transitions, or a complete camera suite.

## J. Decision

`READY_FOR_REVIEW` — isolated sandbox acceptance criteria pass; not ready to
merge into the production runtime without the ownership approvals above.
