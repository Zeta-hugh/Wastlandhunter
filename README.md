# Wasteland Hunter / 荒原猎手

Canonical engineering repository: `Zeta-hugh/Wastlandhunter`.

This continues the existing game. Read [CODEX_INSTRUCTIONS.md](docs/CODEX_INSTRUCTIONS.md), then the remaining handoff documents before changing it. The next product milestone is the polished Rustport vertical slice: protagonist, Liu Yan, first tank, and Iron Hound.

## Canon 0.23 runtime baseline / 实机基线

These are screenshots from the migrated game running in Google Chrome at 960 × 540. They document the preserved Canon 0.23 prototype before the planned visual vertical-slice upgrade. The review scenes were opened through QA scene setup, so this gallery demonstrates real rendering rather than a recorded end-to-end playthrough.

| World / 大世界 | Rustport / 锈港街区 |
| --- | --- |
| ![Canon 0.23 world-map runtime baseline](docs/screenshots/runtime-world.png) | ![Canon 0.23 Rustport runtime baseline](docs/screenshots/runtime-rustport.png) |

| Tavern / 酒馆 | Liu Yan dialogue / 柳焰对话 |
| --- | --- |
| ![Canon 0.23 tavern runtime baseline](docs/screenshots/runtime-tavern.png) | ![Canon 0.23 Liu Yan dialogue runtime baseline](docs/screenshots/runtime-liu-yan-dialogue.png) |

| First tank garage / 第一辆战车车库 | Iron Hound battle / 铁牙猎犬赏金战 |
| --- | --- |
| ![Canon 0.23 garage runtime baseline](docs/screenshots/runtime-garage.png) | ![Canon 0.23 Iron Hound battle runtime baseline](docs/screenshots/runtime-iron-hound.png) |

These images are the visual starting point, not milestone acceptance. The governing visual assessment remains [ART_DIRECTION_CN.md](docs/ART_DIRECTION_CN.md), and the target scenes are defined in [ROADMAP_CN.md](docs/ROADMAP_CN.md).

## Run locally

Requires Node.js 22 or newer. The build and development server have no external dependencies.

```sh
npm run dev
```

Open http://127.0.0.1:5173. After source edits, run `npm run build` and refresh. The development server has no hot reload. `dist/` is the standalone static build output.

```sh
npm test
npm install
npm run test:browser
```

Browser checks use Playwright and installed Google Chrome with a temporary browser profile. They generate seven QA captures in the ignored `artifacts/baseline/` directory and check startup, movement, persistence, image loading and one combat action. The six curated screenshots above are tracked separately in `docs/screenshots/`. No player browser profile is accessed.

## Source layout

- `docs/`: original handoff documents plus the engineering migration record.
- `docs/screenshots/`: tracked, curated runtime baseline images displayed above.
- `legacy/`: byte-identical Canon 0.23 monolithic prototype; do not overwrite.
- `game/data/`: character definitions, towns, vehicles and parts.
- `game/story/`: chapter data and Canon world text.
- `game/systems/`: extracted base parts, tank statistics and persistence functions.
- `game/core/`: initialization, base state, portraits and the remaining prototype runtime.
- `game/sources.json`: explicit source assembly order.
- `assets/legacy/`: 16 original embedded images, extracted unchanged with hashes.
- `assets/ui/`: existing stylesheet.

This is an extraction baseline with one confirmed legacy renderer crash fixed (missing inn/house/warehouse palette entries). The build assembles one classic script to preserve function hoisting and historical overrides. It is not yet an ES-module architecture or a completed visual milestone. See [ENGINEERING_MIGRATION.md](docs/ENGINEERING_MIGRATION.md) for boundaries and next steps.
