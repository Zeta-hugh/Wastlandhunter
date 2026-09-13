# R1 P0 Asset Delivery Report

> Historical pre-intake report. Superseded by `qa/reports/rustport_p0_batch_01.json` after the 11-file production batch passed QA on 2026-09-13.

Date: 2026-09-12

Date: 2026-09-12

Scope: Rustport R1 P0 asset delivery and intake acceptance. No real production PNG input was present in this worktree, so this report records the exact delivery gap and preserves the production block. It does not create, delete, or promote production art.

## A. Current production input

```text
source_master PNG files: 0
runtime PNG files: 0
manifest records: 626
QA_PASS: 0
NEEDS_ART: 626
```

The four root reference boards are visual direction references only. They must not be cropped into runtime assets.

No real R1 production files were received or generated in this round. PNGs under `assets/legacy/`, `dist-next/`, Android resources, or other existing locations were not treated as R1 input.

## B. P0 delivery gap by canonical asset

All rows below are existing canonical IDs. Every listed `source_master` and `runtime` PNG is missing. The expected sizes and metadata are contract values only; no file or visual evidence exists to validate them.

| asset_id | source_master | runtime | expected master_size / runtime_size | expected pivot / ground_contact | expected collision_footprint | expected perspective / light_direction / depth_layer | missing metadata and QA |
|---|---|---|---|---|---|---|---|
| `ground_dirt_oily_01` | `assets/source_master/tiles/ground/ground_dirt_oily_01.png` | `assets/runtime/tiles/ground/ground_dirt_oily_01.png` | 512x512 / 32x32 | [16,16] / [16,16] | [32,32] | ground_topdown / upper_left / ground | `alpha`, all visual metadata, `qa.alpha_clean`, `qa.dimensions_valid`, `qa.no_text`, `qa.no_crop` |
| `concrete_clean` | `assets/source_master/tiles/roads/concrete_clean.png` | `assets/runtime/tiles/roads/concrete_clean.png` | 512x512 / 32x32 | [16,16] / [16,16] | [32,32] | ground_topdown / upper_left / ground | same metadata and QA flags |
| `concrete_cracked` | `assets/source_master/tiles/roads/concrete_cracked.png` | `assets/runtime/tiles/roads/concrete_cracked.png` | 512x512 / 32x32 | [16,16] / [16,16] | [32,32] | ground_topdown / upper_left / ground | same metadata and QA flags |
| `concrete_oily` | `assets/source_master/tiles/roads/concrete_oily.png` | `assets/runtime/tiles/roads/concrete_oily.png` | 512x512 / 32x32 | [16,16] / [16,16] | [32,32] | ground_topdown / upper_left / ground | same metadata and QA flags |
| `awning_canvas_beige` | `assets/source_master/buildings/awnings/awning_canvas_beige.png` | `assets/runtime/buildings/awnings/awning_canvas_beige.png` | 512x512 / 96x64 | [48,16] / [48,16] | support span to be measured | three_quarter / upper_left / structure | same metadata and QA flags |
| `barrel_rust` | `assets/source_master/props/small/barrel_rust.png` | `assets/runtime/props/small/barrel_rust.png` | 512x512 / 32x48 | [16,48] / [16,48] | [32,24] or approved measured base | three_quarter / upper_left / structure | same metadata and QA flags |
| `rust_runner_chassis_s` | `assets/source_master/vehicles/rust_runner/chassis/rust_runner_chassis_s.png` | `assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_s.png` | 768x768 / 128x128 | [64,96] / [64,96] | vehicle footprint to be measured | three_quarter / upper_left / structure | same metadata and QA flags |
| `rust_runner_track_left` | `assets/source_master/vehicles/rust_runner/tracks/rust_runner_track_left.png` | `assets/runtime/vehicles/rust_runner/tracks/rust_runner_track_left.png` | 768x768 / 128x128 | [64,96] / [64,96] | track footprint to be measured | three_quarter / upper_left / structure | same metadata and QA flags |
| `rust_runner_track_right` | `assets/source_master/vehicles/rust_runner/tracks/rust_runner_track_right.png` | `assets/runtime/vehicles/rust_runner/tracks/rust_runner_track_right.png` | 768x768 / 128x128 | [64,96] / [64,96] | track footprint to be measured | three_quarter / upper_left / structure | same metadata and QA flags |
| `rust_runner_turret_00` | `assets/source_master/vehicles/rust_runner/turret/rust_runner_turret_00.png` | `assets/runtime/vehicles/rust_runner/turret/rust_runner_turret_00.png` | 768x768 / 128x128 | [64,61] / mount contact to be measured | turret mount footprint to be measured | three_quarter / upper_left / structure | same metadata and QA flags |
| `cannon_75mm` | `assets/source_master/weapons/main/cannon_75mm.png` | `assets/runtime/weapons/main/cannon_75mm.png` | 512x512 / 128x128 | [28,64] / mount contact to be measured | weapon mount footprint and muzzle-safe bounds | three_quarter / upper_left / structure | same metadata and QA flags |

For every row, source/runtime content correspondence, PNG format, transparent-edge cleanliness where applicable, no-text/no-watermark, no-crop, material, silhouette, mobile readability, seam/connection, and 2.5D visual checks remain unperformed because both files are absent.

## B. Visual Direction Sheet

### 1. Overall style

- Use high-detail pixel / pixel-painted game art with deliberate pixel clusters, readable silhouettes and controlled texture.
- Rustport is a repaired industrial settlement: oxidized steel, patched sheet metal, dirty concrete, weathered wood, canvas, rubber, oil and dust.
- Surfaces may be worn and irregular, but wear must explain construction, use or repair. Do not add random noise, sharpening or scratch filters as fake detail.
- Do not use clean chrome, glossy sci-fi alloy, bright plastic, neon cyberpunk surfaces or generic cartoon simplification as the default language.
- Reference-board labels and UI are not production art. Runtime assets must contain no text, logos or watermarks unless the asset is an explicitly approved in-world sign.

### 2. Camera and perspective

- Ground tiles: `ground_topdown`, 32x32 runtime contract.
- Vertical objects, vehicles, characters and bosses: shared `three_quarter` camera language.
- Scene assembly layer remains independent from manifest visual depth metadata:
  - Scene: `ground`, `roads`, `decals`, `props_low`, `structures`, `actors`, `vehicles`, `roofs`, `foreground`, `fx`.
  - Asset metadata: `ground`, `structure`, `actor`, `foreground`.
- Keep the established ground compression target at `ground_scale_y = 0.58`.
- Every object must have a stable ground contact and must sit on the same world plane as characters and vehicles. No front elevation, pure side view, 45-degree isometric insert, photographic perspective or arbitrary object rotation.
- Runtime scale reference: characters use the existing 48x72 contract; Rust Runner modules use the existing 128x128 canvas and pivots; buildings and props must preserve the same visual pixel density.

### 3. Lighting

- Baked-light assumption is always `light_direction: upper_left`.
- Highlights face upper-left; cast/contact shadows trend lower-right.
- Use a small contact shadow at the ground contact only. Do not bake a large fixed shadow into a reusable object.
- Interior lamps, muzzle flashes and fire are independent FX/light layers, not painted permanently into the base sprite.

### 4. Palette and gameplay contrast

| Use | Direction |
|---|---|
| Ground | muted ochre, soil brown, dusty gray, desaturated green |
| Rusted steel | dark umber, oxidized red-brown, copper-orange edge accents |
| Concrete | cool gray, blue-gray shadow, dirty beige wear |
| Canvas / wood | faded beige, tan, weathered brown |
| Oil / soot | blue-black, charcoal, low-gloss dark stains |
| Functional highlight | restrained amber, warm lamp orange, faded warning red |
| Interactable | slightly higher value/contrast than surrounding material |
| NPC | clean silhouette and contrast above background |
| Enemy / bounty target | distinct outline and readable weak-point/attack area |

Do not make loot, interactive objects or hazards into saturated mobile-game effects. Readability must come from contrast and silhouette first.

### 5. Material rules

| Material | Must show | Must not show |
|---|---|---|
| Rusted steel | layered oxidation, chipped edges, patched plates, dark seams | clean chrome or uniform orange noise |
| Concrete | aggregate, cracks, stains, repaired edges | smooth gray placeholder blocks |
| Canvas | folds, sag, faded dye, stitched/dirty edge | plastic gloss or flat solid fill |
| Wood | grain direction, broken edge, uneven repair | perfect new timber |
| Oil / soot | localized stains near machinery/contact areas | full-tile random black noise |
| Glass / lamps | controlled highlight and functional glow | neon UI look or text baked into glass |
| Scrap / crates | construction logic and varied wear | identical repeated cubes |

### 6. Silhouette requirements

- Rust Runner chassis, tracks and turret must remain separately readable in black silhouette.
- `cannon_75mm` must read as a short/light main weapon and remain visually separate from chassis and turret.
- Garage, awning, barrel and industrial props must remain identifiable at 100% runtime scale and at the mobile viewport.
- Iron Hound must read as a mechanical bounty creature, not a barrel, vehicle module or generic animal.
- Characters must preserve head, torso, hair silhouette, weapon/tool and facing direction; Liu Yan's red hair is a required silhouette cue.

### 7. Scene hierarchy

```text
ground
→ roads
→ decals
→ props_low
→ structures
→ actors / vehicles
→ roofs
→ foreground occlusion
→ fx
```

Every Rustport scene assembly must contain:

- one primary landmark;
- functional secondary structure/props;
- tertiary material variation;
- one storytelling cluster;
- readable navigation and interactables;
- foreground occlusion where the camera passes behind structures;
- independent FX where light, smoke or impact is required.

### 8. Mobile readability gate

- Validate at 960x540 logical canvas and at the target mobile viewport; zoomed reference-board inspection is not acceptance.
- 32x32 tiles must retain material family and navigation edge, not micro-detail.
- 32x48 props must retain silhouette, top plane and contact edge.
- 48x72 characters must retain head, torso, hair, facing and tool/weapon.
- 128x128 vehicle modules must retain track/chassis/turret separation and weapon direction.
- Interactive objects need a clear silhouette and contrast boundary; labels must not be required for basic recognition.
- Distant objects may drop tertiary texture, but may not lose landmark silhouette, collision footprint or interaction read.

## C. Reference-board to batch mapping

| Reference | Direction extracted | R1 batch use |
|---|---|---|
| `image.png` | Complete visual language: palette, UI contrast, tiles, modular buildings, characters, vehicles, enemies, boss and FX overview | Cross-batch palette, outline, contrast and density baseline |
| `image2.png` | Environment and vehicle module sheet: ground families, walls, doors/windows, roofs, props, chassis, tracks, turrets and weapons | P0 ground/navigation, P0 vehicle modules, P1 structures and props |
| `image3.png` | Character/enemy/boss/UI presentation and gameplay readability | P1 protagonist, Liu Yan, Iron Hound, character silhouette and combat readability |
| `image4.png` | Modular 2.5D assembly examples, scene composition, vehicle layering, props and vegetation | Scene hierarchy, landmark composition, depth ordering and mobile-scale composition |

The boards provide shape language, material treatment, lighting and density only. Do not copy specific pixels, labels, logos, portraits, map layouts or distinctive board compositions. Remove any board element that conflicts with Wasteland Hunter Canon or cannot remain readable at runtime size.

## D. First R1 batch

No new IDs are proposed. All entries below already exist in `data/asset_manifest.json`.

### P0 ground and navigation

| asset_id | runtime size | pivot | required visual metadata |
|---|---:|---:|---|
| `ground_dirt_oily_01` | 32x32 | [16,16] | ground_topdown, ground, ground_contact [16,16], footprint [32,32] |
| `concrete_clean` | 32x32 | [16,16] | ground_topdown, ground, ground_contact [16,16], footprint [32,32] |
| `concrete_cracked` | 32x32 | [16,16] | ground_topdown, ground, ground_contact [16,16], footprint [32,32] |
| `concrete_oily` | 32x32 | [16,16] | ground_topdown, ground, ground_contact [16,16], footprint [32,32] |

### P0 Rustport identity

| asset_id | runtime size | pivot | required visual metadata |
|---|---:|---:|---|
| `awning_canvas_beige` | 96x64 | [48,16] | three_quarter, structure, contact [48,16], footprint matching support span |
| `barrel_rust` | 32x48 | [16,48] | three_quarter, structure, contact [16,48], footprint [32,24] or approved measured base |

### P0 Rust Runner

| asset_id | runtime size | pivot | required visual metadata |
|---|---:|---:|---|
| `rust_runner_chassis_n` through `rust_runner_chassis_nw` | 128x128 | [64,96] | three_quarter, structure, contact [64,96], vehicle collision footprint |
| `rust_runner_track_left` | 128x128 | [64,96] | three_quarter, structure, contact [64,96], track footprint |
| `rust_runner_track_right` | 128x128 | [64,96] | three_quarter, structure, contact [64,96], track footprint |
| `rust_runner_turret_00` through `rust_runner_turret_15` | 128x128 | [64,61] | three_quarter, structure, turret mount footprint |
| `cannon_75mm` | 128x128 | [28,64] | three_quarter, structure, weapon mount footprint and muzzle-safe bounds |

### P1 structure, prop and occlusion records

| asset_id | intended use |
|---|---|
| `wall_corrugated_rust_01`, `door_warehouse_shutter`, `window_metal_lit`, `roof_corrugated_01` | garage modular shell |
| `cable_bundle`, `pipe_vertical`, `railing_metal_straight` | secondary structure and foreground/edge detail |
| `awning_canvas_beige`, `awning_green_military`, `awning_red_faded` | Rustport awning variation |
| `workbench`, `industrial_lamp`, `vent_large`, `vent_small` | repair zone functional props |
| `barrel_rust`, `barrel_blue`, `fuel_drum`, `metal_crate`, `old_tire`, `sandbags`, `trash_bin`, `wood_crate` | industrial and storytelling prop clusters |
| `pillar_steel_rusted` | memorial/structural storytelling anchor |

All P1 records use existing canonical IDs and require the same full metadata contract before QA promotion.

### P1 character and bounty records

| asset_id family | required read |
|---|---|
| `protagonist_*` | independent hunter silhouette, tool/weapon and eight-direction facing |
| `liuyan_*` | red hair silhouette, mechanic identity, eight-direction gameplay read |
| `iron_hound_idle`, `iron_hound_attack`, `iron_hound_hurt`, `iron_hound_enraged`, `iron_hound_death` | mechanical bounty silhouette, attack identity, damage/phase/death state |

## E. Intake metadata checklist

Every delivered PNG pair must provide:

```text
asset_id                 existing canonical ID only
source_master            repo-relative POSIX PNG path
runtime                  repo-relative POSIX PNG path
master_size              [width, height]
runtime_size             [width, height]
pivot                    [x, y], in runtime bounds
visual.ground_contact    [x, y], in runtime bounds
visual.collision_footprint [width, height], non-negative
visual.perspective       ground_topdown or three_quarter
visual.light_direction   upper_left
visual.depth_layer       ground, structure, actor or foreground
alpha                    boolean
qa.alpha_clean           true after edge inspection
qa.dimensions_valid      true
qa.no_text               true
qa.no_crop               true
status                   NEEDS_ART until all QA is complete
```

The source master and runtime files must depict the same asset, with runtime produced at the canonical runtime size and without arbitrary runtime rescaling. A production record may become `QA_PASS` only after file, metadata, visual, seam/connection and mobile checks all pass.

## F. Reference and contract audit

- `asset_id` uniqueness: PASS; 626 unique IDs.
- Conflict suffixes `_v2`, `_new`, `_final`: none found.
- Manifest schema: PASS; only `schema_version: "1.0"` is used.
- Binding IDs missing from manifest: none.
- Scene bindings missing from `asset_bindings.json`: none.
- Scene layer names: match approved independent scene assembly layer.
- Manifest visual layer names: remain independent asset metadata enum.
- `role` field: retained as the scene object field.
- Source/runtime path strings: structurally paired for all 626 records.
- Actual source/runtime PNG files: 0; all 1252 referenced files are currently absent by design.
- `ground_dirt_oily_01`: still referenced by manifest, binding, tile metadata and Rustport tileset; runtime PNG is missing.
- Deleted PNGs: still represented by canonical manifest/binding records where their IDs are part of the approved contract; no record was removed.

## G. Validation

```text
npm run assets:validate
PASS

npm run assets:maps
FAIL (known production input block)
ground_dirt_oily_01 runtime is missing and status is NEEDS_ART

npm run assets:vehicle
NEEDS_ART
27 independent Rust Runner production files remain unavailable
```

The map failure is not a validator defect and must not be changed to a success state.

## H. Manifest status

No manifest records changed. All 11 requested P0 records remain `NEEDS_ART`; no record was promoted to `QA_PASS`, and no other asset ID was modified.

## I. Bindings, scene and tileset reference result

- `data/asset_bindings.json`: all requested IDs remain referenced by the existing canonical bindings; unchanged.
- `data/rustport_scene.json`: existing `barrel_rust` scene reference remains intact; unchanged.
- `data/tiles/rustport_ground.tsj`: continues to reference `assets/runtime/tiles/ground/ground_dirt_oily_01.png`; unchanged and currently missing.
- No map, tileset, binding, scene, validator, runtime, or shared contract workaround was applied.

## J. Validation results

1. `npm run assets:validate`: PASS — `Asset records: 626 | active: 0 | NEEDS_ART: 626`; report generated at `qa/reports/assets_validation.json`.
2. `npm run assets:vehicle`: NEEDS_ART / exit 2 — 27 independent Rust Runner production files remain unavailable, including the requested track, turret and cannon records.
3. `npm run assets:maps`: FAIL / exit 1 — missing tileset image and `ground_dirt_oily_01` is not `QA_PASS`.

Required map-block text:

```text
Rustport production input blocked:
ground_dirt_oily_01 is missing and not QA_PASS.
```

## K. Ground block status

`ground_dirt_oily_01` remains missing and `NEEDS_ART`; the Rustport production block is not解除.

## L. Unresolved issues

1. Receive real source/runtime PNG pairs for all 11 P0 canonical IDs.
2. Supply and verify the complete metadata contract for every pair, including measured collision footprints and contacts.
3. Perform visual, alpha-edge, no-text, no-crop, seam/connection, and mobile readability QA.
4. Re-run the three serial validators after real intake; do not alter the map reference or validators to bypass the missing ground tile.

## M. Main workflow integration review

Not ready for main workflow integration review. The batch has no real production PNG input and no `QA_PASS` records.

The first real R1 batch is now present and technically accepted: 11
source/runtime pairs are `QA_PASS`. No placeholder art was created and no
shared contract was modified. The remaining 615 records stay `NEEDS_ART`.

## N. Sprint 1 intake pipeline

The deterministic technical intake command is:

```bash
python3 scripts/assets/check_png.py --first-batch
```

It checks manifest-selected source/runtime paths, exact filenames, PNG format,
expected dimensions, expected RGB/RGBA mode, and source/runtime file presence.
It reports `BLOCKED` for missing or invalid files and never changes manifest
status or performs artistic approval.

The human acceptance checklist is maintained in:

- `qa/assets/R1_INTAKE_CHECKLIST.md`
- `qa/assets/R1_FIRST_BATCH_STATUS.md`

At this checkpoint, all 11 first-batch records have real source/runtime PNGs
and complete technical metadata. The deterministic check passes. Visual
integration remains limited to the accepted batch; the remaining Rustport
runtime coverage is still blocked.
