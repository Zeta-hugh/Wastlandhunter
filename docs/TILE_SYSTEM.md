# Tile system

Production tiles use 32×32 runtime PNGs and 512×512 source-master PNGs. Runtime filtering is nearest, mipmaps are disabled, and placement uses pixel snapping. Tile paths and pivots come from `data/asset_manifest.json`.

Road topology is data-driven through `data/tiles/roads.json`. The fixed connection type is `road_4way`, and its variant order is `straight_ns`, `straight_ew`, four corners, four T-junctions, and `cross`. Renderers must choose the matching manifest asset ID from neighbor connectivity; they must not encode image paths or connection filenames themselves.

Every ground tile requires a generated 4×4 preview under `qa/seam_tests/`. Road families require an all-connections preview under `qa/tile_connection_tests/` before their records can move to `QA_PASS`.

The 2.5D integration directive adds a strict visual gate: ground remains 90° top-down, vertical objects use the shared 3/4 camera language, and every accepted record must declare `visual.perspective`, `visual.light_direction`, `visual.depth_layer`, `visual.ground_contact` and `visual.collision_footprint`. A mismatch is a visual QA failure, not a reason to resize the image arbitrarily.
