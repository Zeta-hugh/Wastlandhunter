# Rustport R1 Intake Checklist

This checklist is deterministic for file and metadata intake. It does not approve artistic quality. An asset remains `NEEDS_ART` until technical checks, visual QA, and mobile review all pass.

## 1. Identity and paths

- [ ] `asset_id` already exists in `data/asset_manifest.json`.
- [ ] `asset_id` is globally unique.
- [ ] No `_v2`, `_new`, `_final`, `_copy`, or other suffix alias is used.
- [ ] `source_master` and `runtime` use repository-relative POSIX paths.
- [ ] Both filenames are exactly `{asset_id}.png`.
- [ ] No manifest, binding, scene, map, or release reference is unintentionally removed.

## 2. File and technical checks

- [ ] Source master exists.
- [ ] Runtime exists.
- [ ] Both files are valid PNG files.
- [ ] Source master matches `master_size`.
- [ ] Runtime matches `runtime_size`.
- [ ] Image mode matches the manifest `alpha` contract.
- [ ] Alpha edges are clean where alpha is required.
- [ ] Source master and runtime depict the same asset and preserve the same silhouette.
- [ ] No file is a spritesheet unless separately approved.

Run the reproducible technical check:

```bash
python3 scripts/assets/check_png.py --first-batch
```

The command reports missing files as `BLOCKED` and never changes manifest status.

## 3. Required metadata

- [ ] `pivot` is present and inside runtime bounds.
- [ ] `visual.ground_contact` is present and inside runtime bounds.
- [ ] `visual.collision_footprint` describes actual occupied ground area, not the transparent canvas.
- [ ] `visual.perspective` is `ground_topdown` for ground tiles or `three_quarter` for objects.
- [ ] `visual.light_direction` is `upper_left`.
- [ ] `visual.depth_layer` is one of `ground`, `structure`, `actor`, `foreground`.
- [ ] Ground contact agrees with pivot and the intended world anchor.
- [ ] Vehicle mount and weapon muzzle bounds are separately checked where applicable.

## 4. Visual QA

- [ ] Perspective matches Rustport 2.5D camera language.
- [ ] Upper-left highlight and lower-right shadow tendency are consistent.
- [ ] No large baked-in fixed shadow.
- [ ] No clipped silhouette or transparent-edge crop.
- [ ] No text, watermark, logo, UI, reference-board border, or promotional fragment.
- [ ] Material reads as Rustport: repaired industrial, oxidized, dusty and used.
- [ ] Silhouette is readable at 100% runtime scale.
- [ ] Ground contact does not float.
- [ ] No obvious tile repetition or accidental seam pattern.
- [ ] No random-noise or filter-based fake detail.

## 5. Mobile and integration QA

- [ ] Asset is readable on the 960x540 logical canvas.
- [ ] Asset is readable at the target mobile viewport.
- [ ] Binding references the existing canonical ID.
- [ ] Scene object references the correct binding and layer.
- [ ] Tileset references remain valid for ground/road tiles.
- [ ] No deleted file remains silently required without a production block.
- [ ] `npm run assets:validate` passes.
- [ ] `npm run assets:vehicle` passes or reports only unrelated `NEEDS_ART`.
- [ ] `npm run assets:maps` passes only when the referenced ground tile is real and `QA_PASS`.

## 6. Status rule

Keep `status: NEEDS_ART` if any check is incomplete. Only after all required evidence is attached may the corresponding manifest record be considered for `QA_PASS`.
