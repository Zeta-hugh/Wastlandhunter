# Production asset index

The machine-readable source of truth is `data/asset_manifest.json`. This page records the current import state without treating planned art as completed work.

## Current QA state

| Status | Count | Meaning |
| --- | ---: | --- |
| `QA_PASS` | 0 | No production asset is currently accepted after the visual-direction reset. |
| `NEEDS_ART` | 626 | Fixed asset IDs and metadata remain available; all production artwork must be rebuilt against the supplied R1 reference boards. |

The production library was intentionally reset on 2026-09-12 after review against the four R1 reference boards in the repository root (`image.png` through `image4.png`). The previous generated files were removed from source master, runtime, release, and generated next-build copies. Manifest records and stable asset IDs remain so the library can be rebuilt without changing game call sites. Nothing in `legacy/` was modified.

## Priority missing sets

- Rustport road connection families: clean, cracked and heavily damaged asphalt in all 11 `road_4way` variants.
- Rustport building kit: walls, pillars, doors, windows, roofs, awnings, stairs, platforms, railings, pipes and cables.
- Protagonist and Liu Yan: 48×72 independent frames in the fixed eight-direction/action order, plus 512×768 RGBA portraits.
- Rust Runner: eight chassis directions, two aligned track layers, sixteen turret directions and independent weapon/accessory/damage layers.
- Iron Hound: independent frames for idle, move, two attacks, hurt, enraged and death.
- Mechanical UI: 9-slice panel, four button states and icon families.

## Legacy boundary

`assets/legacy/` preserves the Canon 0.23 prototype art byte-for-byte. Several current prototype systems still display those atlases. They are compatibility material, not production assets, are excluded from `release/assets/`, and cannot be promoted by cropping or relabeling them. Replacement remains explicit asset migration work.

The current audit finds 16 image references from the compatibility runtime that still bypass `AssetRegistry`. Therefore `contract_complete` is `false`, even though the manifest, the imported tile and the initial Rustport map each pass their applicable validation.
