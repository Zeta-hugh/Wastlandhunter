# Map pipeline

Rustport is defined at `maps/rustport/rustport.tmj` as a 64×64 map with 32-pixel tiles and a 2048×2048 world size. Its fourteen layers use the exact order and names from the production asset contract.

The initial TMJ establishes a loadable pipeline, a QA-passed ground tileset, boundary collision objects, a Liu Yan NPC spawn, the first-tank trigger, the south exit and a central light. Road, architecture, prop and vegetation layers remain empty until their independent manifest entries pass QA.

Run `python3 scripts/assets/validate_maps.py` after each map or tileset change. The validator checks map dimensions, layer order and types, tile counts, external TSJ resolution, manifest indexing and `QA_PASS` status for referenced tiles.
