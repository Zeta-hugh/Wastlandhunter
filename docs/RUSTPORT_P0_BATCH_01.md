# Rustport P0 Batch 01

This batch contains 11 independent canonical production assets. The four root boards were used for palette, material, light, perspective, silhouette and detail density only. No board pixels, portraits, text, logos, maps or compositions were used as production content.

| asset_id | source master | runtime | pivot | ground contact | collision footprint | perspective | depth | mode | status |
|---|---:|---:|---:|---:|---:|---|---|---|---|
| `ground_dirt_oily_01` | 512x512 | 32x32 | [16,16] | [16,16] | [32,32] | ground_topdown | ground | RGB | QA_PASS |
| `concrete_clean` | 512x512 | 32x32 | [16,16] | [16,16] | [32,32] | ground_topdown | ground | RGB | QA_PASS |
| `concrete_cracked` | 512x512 | 32x32 | [16,16] | [16,16] | [32,32] | ground_topdown | ground | RGB | QA_PASS |
| `concrete_oily` | 512x512 | 32x32 | [16,16] | [16,16] | [32,32] | ground_topdown | ground | RGB | QA_PASS |
| `awning_canvas_beige` | 512x512 | 96x64 | [48,16] | [48,16] | [92,12] | three_quarter | structure | RGBA | QA_PASS |
| `barrel_rust` | 512x512 | 32x48 | [16,48] | [16,48] | [24,12] | three_quarter | structure | RGBA | QA_PASS |
| `rust_runner_chassis_s` | 768x768 | 128x128 | [64,96] | [64,96] | [76,49] | three_quarter | actor | RGBA | QA_PASS |
| `rust_runner_track_left` | 768x768 | 128x128 | [64,96] | [64,96] | [70,18] | three_quarter | actor | RGBA | QA_PASS |
| `rust_runner_track_right` | 768x768 | 128x128 | [64,96] | [64,96] | [70,18] | three_quarter | actor | RGBA | QA_PASS |
| `rust_runner_turret_00` | 768x768 | 128x128 | [64,61] | [64,61] | [52,32] | three_quarter | actor | RGBA | QA_PASS |
| `cannon_75mm` | 512x512 | 128x128 | [28,64] | [28,64] | [84,12] | three_quarter | actor | RGBA | QA_PASS |

Every record uses `light_direction: upper_left`; source/runtime PNG pairs exist; previews are in `qa/runtime_previews/`; tile 4x4 checks are in `qa/seam_tests/`; the south-facing vehicle assembly check is `qa/vehicle_mounts/rust_runner_s_p0_assembly.png`. The 960x540 runtime integration check is `qa/runtime_previews/rustport_p0_runtime_integration.png`; it renders this batch through the production asset loader, manifest pivots, scene references and `rust_runner.main_gun` mount without changing the `NEEDS_ART` status of out-of-batch assets.

Validation: manifest PASS, asset PASS, 11/11 preview files PASS, 14/14 transparent source/runtime canvas edges PASS, 11/11 asset bindings PASS, runtime pivot/mount integration PASS, Rustport map PASS, release contains 11 QA_PASS assets. Rust Runner remains NEEDS_ART because these 22 out-of-batch direction files are incomplete: `rust_runner_chassis_n`, `rust_runner_chassis_ne`, `rust_runner_chassis_e`, `rust_runner_chassis_se`, `rust_runner_chassis_sw`, `rust_runner_chassis_w`, `rust_runner_chassis_nw`, `rust_runner_turret_01`, `rust_runner_turret_02`, `rust_runner_turret_03`, `rust_runner_turret_04`, `rust_runner_turret_05`, `rust_runner_turret_06`, `rust_runner_turret_07`, `rust_runner_turret_08`, `rust_runner_turret_09`, `rust_runner_turret_10`, `rust_runner_turret_11`, `rust_runner_turret_12`, `rust_runner_turret_13`, `rust_runner_turret_14`, `rust_runner_turret_15`.

The exact accepted ImageGen prompts are recorded in `docs/RUSTPORT_P0_BATCH_01_PROMPTS.md`.
