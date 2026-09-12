# Production asset import guide

1. Create one independent lossless PNG in the exact `assets/source_master/` path already declared by `asset_id` in `data/asset_manifest.json`.
2. Confirm composition, transparency, direction and exclusions against the production contract. Do not import screenshots, promotional art, contact sheets or atlas crops.
3. Set the manifest record to `COMPLETE`, then run `python3 scripts/assets/build_runtime_assets.py` to create the declared runtime PNG.
4. Run `python3 scripts/assets/validate_manifest.py` and `python3 scripts/assets/validate_assets.py`.
5. Generate and inspect the category-specific QA preview. Tiles require seam or connection previews; buildings and vehicles must be assembled from the actual components.
6. Change the record to `QA_PASS` only after every QA field is true and visual inspection succeeds.
7. Use `AssetRegistry.get(asset_id)` or `AssetRegistry.bindImage(asset_id, image)` in runtime code. Do not add a literal image path to a renderer.
8. Run map and vehicle validators as applicable, then run `python3 scripts/assets/build_release_manifest.py`. Only `QA_PASS` files are copied into `release/assets/`.

Missing art stays `NEEDS_ART`. A missing or incomplete asset must raise an explicit development error if runtime code attempts to request it.
