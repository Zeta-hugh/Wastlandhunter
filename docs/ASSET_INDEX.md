# Production asset index

The machine-readable source of truth is `data/asset_manifest.json`. This page records the current import state without treating planned art as completed work.

## Current QA state

| Status | Count | Meaning |
| --- | ---: | --- |
| `QA_PASS` | 11 | Rustport P0 Batch 01: four ground/road tiles, two environment props and five Rust Runner modules. |
| `NEEDS_ART` | 615 | Remaining fixed asset IDs stay unavailable to production rendering. |

The production library was intentionally reset on 2026-09-12 after review against the four R1 reference boards in the repository root (`image.png` through `image4.png`). Rustport P0 Batch 01 was accepted on 2026-09-13 without changing canonical IDs; its exact manifest and QA evidence are recorded in `qa/reports/rustport_p0_batch_01.json`. Nothing in `legacy/` was modified.

## Priority missing sets

- Rustport road connection families: clean, cracked and heavily damaged asphalt in all 11 `road_4way` variants.
- Rustport building kit: walls, pillars, doors, windows, roofs, awnings, stairs, platforms, railings, pipes and cables.
- Protagonist and Liu Yan: 48×72 independent frames in the fixed eight-direction/action order, plus 512×768 RGBA portraits.
- Rust Runner: seven remaining chassis directions, fifteen remaining turret directions and the later weapon/accessory/damage layers. The south chassis, both tracks, turret 00 and 75mm cannon are accepted.
- Iron Hound: independent frames for idle, move, two attacks, hurt, enraged and death.
- Mechanical UI: 9-slice panel, four button states and icon families.

## Legacy boundary

`assets/legacy/` preserves the Canon 0.23 prototype art byte-for-byte. Several current prototype systems still display those atlases. They are compatibility material, not production assets, are excluded from `release/assets/`, and cannot be promoted by cropping or relabeling them. Replacement remains explicit asset migration work.

The current audit finds 16 image references from the compatibility runtime that still bypass `AssetRegistry`. Therefore `contract_complete` is `false`, even though the manifest, the imported tile and the initial Rustport map each pass their applicable validation.
