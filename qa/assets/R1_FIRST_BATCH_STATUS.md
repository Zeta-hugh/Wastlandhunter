# Rustport R1 First Batch Status

Date: 2026-09-13

## Current input state

```text
source_master production PNG: 11
runtime production PNG: 11
manifest records: 626
NEEDS_ART: 615
QA_PASS: 11
```

The 11 received pairs are the approved first batch. No additional asset IDs
were created. The files were already present in the worktree before this
intake verification; this report records their acceptance evidence.

## Accepted first batch

| asset_id | source_master | runtime | runtime size | pivot | status |
|---|---|---|---:|---:|---|
| `ground_dirt_oily_01` | `assets/source_master/tiles/ground/ground_dirt_oily_01.png` | `assets/runtime/tiles/ground/ground_dirt_oily_01.png` | 32x32 | [16,16] | QA_PASS |
| `concrete_clean` | `assets/source_master/tiles/roads/concrete_clean.png` | `assets/runtime/tiles/roads/concrete_clean.png` | 32x32 | [16,16] | QA_PASS |
| `concrete_cracked` | `assets/source_master/tiles/roads/concrete_cracked.png` | `assets/runtime/tiles/roads/concrete_cracked.png` | 32x32 | [16,16] | QA_PASS |
| `concrete_oily` | `assets/source_master/tiles/roads/concrete_oily.png` | `assets/runtime/tiles/roads/concrete_oily.png` | 32x32 | [16,16] | QA_PASS |
| `awning_canvas_beige` | `assets/source_master/buildings/awnings/awning_canvas_beige.png` | `assets/runtime/buildings/awnings/awning_canvas_beige.png` | 96x64 | [48,16] | QA_PASS |
| `barrel_rust` | `assets/source_master/props/small/barrel_rust.png` | `assets/runtime/props/small/barrel_rust.png` | 32x48 | [16,48] | QA_PASS |
| `rust_runner_chassis_s` | `assets/source_master/vehicles/rust_runner/chassis/rust_runner_chassis_s.png` | `assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_s.png` | 128x128 | [64,96] | QA_PASS |
| `rust_runner_track_left` | `assets/source_master/vehicles/rust_runner/tracks/rust_runner_track_left.png` | `assets/runtime/vehicles/rust_runner/tracks/rust_runner_track_left.png` | 128x128 | [64,96] | QA_PASS |
| `rust_runner_track_right` | `assets/source_master/vehicles/rust_runner/tracks/rust_runner_track_right.png` | `assets/runtime/vehicles/rust_runner/tracks/rust_runner_track_right.png` | 128x128 | [64,96] | QA_PASS |
| `rust_runner_turret_00` | `assets/source_master/vehicles/rust_runner/turret/rust_runner_turret_00.png` | `assets/runtime/vehicles/rust_runner/turret/rust_runner_turret_00.png` | 128x128 | [64,61] | QA_PASS |
| `cannon_75mm` | `assets/source_master/weapons/main/cannon_75mm.png` | `assets/runtime/weapons/main/cannon_75mm.png` | 128x128 | [28,64] | QA_PASS |

## Evidence

- `python3 scripts/assets/check_png.py --first-batch`: PASS.
- All 11 source/runtime pairs exist at the manifest paths.
- All 11 records have complete `visual` metadata and QA flags.
- Ground/road seam previews exist and the asset validator reports seam metrics.
- Runtime previews exist for all 11 records.
- `npm run assets:maps`: PASS; the ground tileset is now present and QA-approved.

## Remaining blockers

- The remaining 615 manifest records stay `NEEDS_ART`.
- Rust Runner still lacks 7 directional chassis, 15 turret frames and other
  non-batch production files; vehicle validation reports 22 files `NEEDS_ART`.
- Full Rustport integration is not complete until the remaining required
  character, boss and vehicle coverage is delivered and integrated.
