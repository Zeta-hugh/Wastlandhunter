# Map pipeline

Rustport is defined at `maps/rustport/rustport.tmj` as a 64×64 map with 32-pixel tiles and a 2048×2048 world size. Its fourteen layers use the exact order and names from the production asset contract.

The initial TMJ establishes a loadable pipeline, a QA-passed ground tileset, boundary collision objects, a Liu Yan NPC spawn, the first-tank trigger, the south exit and a central light. Road, architecture, prop and vegetation layers remain empty until their independent manifest entries pass QA.

Run `python3 scripts/assets/validate_maps.py` after each map or tileset change. The validator checks map dimensions, layer order and types, tile counts, external TSJ resolution, manifest indexing and `QA_PASS` status for referenced tiles.

## 2.5D scene assembly

The TMJ remains the structural source of truth for collision, entrances, NPCs and triggers. Visual objects are assembled separately from production bindings and carry `anchor`, `z_height`, `depth_layer`, `occlusion` and `story_role` metadata. A building footprint is not the same thing as its visual bounds.

Recommended layer order:

```text
ground → roads/transitions → decals → low props → structures → actors/vehicles → roofs/awnings → foreground occlusion → ambient FX
```

An important area must include a primary landmark, secondary functional details, tertiary material variation and at least one storytelling-prop cluster before it can be marked `VISUAL_PASS`. The root reference boards `image.png` through `image4.png` are visual references only; they must never be imported as map or runtime images.
