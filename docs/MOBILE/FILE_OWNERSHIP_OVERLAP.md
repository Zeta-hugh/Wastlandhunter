# File Ownership / Overlap Report — Sprint 1

Audit date: 2026-09-13. No Runtime-owned file was modified for this sprint.

## Actual map

| Area | Current files | Owner inferred from repository |
| --- | --- | --- |
| Renderer/projection | `game/app/core/renderer.js`, `game/app/core/projection.js` | Runtime |
| Camera | `game/app/core/camera.js` | Runtime |
| Input | `game/app/core/input.js` | Runtime |
| Movement/collision | `game/app/core/movement.js`, `game/app/core/world.js` | Runtime |
| Scene/definitions | `game/app/core/scene.js`, `game/app/core/definitions.js` | Runtime / shared boundary |
| Platform packaging | `capacitor.config.json`, `android/`, `scripts/build-next.mjs` | Mobile/Platform |
| Browser/runtime tests | `tests/next-runtime.mjs`, `tests/browser.mjs`, `tests/movement.test.mjs` | Runtime / QA |
| Isolated 2.5D sandbox | `game/app/spatial-sandbox/`, `tests/spatial-sandbox*.mjs` | Mobile/Platform |
| Sprint reports | `docs/MOBILE/`, `qa/reports/` | Mobile/Platform / QA |

## Overlap decisions

- The sandbox does not import or edit Runtime scene/state definitions.
- The sandbox has local spatial definitions so no production schema or save
  migration is required.
- The current camera and projection are read by tests only; no camera behavior
  was changed.
- Android and Capacitor files are inspection-only in this sprint.
- `legacy/WastelandHunter_CanonBuild_0.23.0_single.html` and production art are
  unchanged.

## Approval gate

Any future migration of this model into `game/app/core/renderer.js`,
`game/app/core/world.js`, map data, `AssetEntry`, `WorldState`, or `SaveData`
requires Runtime/Contract approval and a separate integration change.
