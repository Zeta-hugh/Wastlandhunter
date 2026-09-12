# CODEX INSTRUCTIONS — MUST READ FIRST

## Project identity
Project: **Wasteland Hunter / 荒原猎手**
Repository target: `Zeta-hugh/Wastlandhunter`

This is an existing project with substantial design history. Do NOT reinterpret it as a new game.

## Source of truth hierarchy
1. Explicit new user instructions.
2. Documents in `/docs`, especially `WORLD_CANON_CN.md` and `ART_DIRECTION_CN.md`.
3. Current modular source once created.
4. Legacy 0.23 HTML only as implementation/reference material.

If legacy code conflicts with the Canon documents, the Canon documents win.

## Non-negotiable rules
- The protagonist is an **independent hunter**. Never force faction membership or a faction ending.
- Do not turn the story into a choose-one-of-three-factions RPG.
- Keep the 2128 / Ash Year 64 Canon and Zero Protocol backbone.
- Do not rename or fundamentally rewrite Liu Yan (柳焰), Tao Yao (桃夭), Lin Cheng (林澄), the three major powers, or the ten-town structure without explicit approval.
- Visual quality is currently the primary bottleneck. Do NOT prioritize adding more shallow systems or towns before the vertical slice is visually convincing.
- Do not report percentage completion from feature count alone.
- Do not replace distinctive assets with generic rectangles, colored blocks, emoji, or CSS placeholders and call the feature complete.
- Dialogue portraits/cutouts must feel integrated into scenes, not rectangular poster images beside text.
- Tanks require visibly modular chassis/turret/weapons and animation feedback.
- Character sprites require directional/action animation appropriate to actual gameplay.

## Engineering migration
Treat `legacy/WastelandHunter_CanonBuild_0.23.0_single.html` as the final monolithic prototype before restructuring.

Create a maintainable project layout rather than indefinitely patching that HTML. Suggested structure:

```
game/
  core/
  systems/
  maps/
  story/
  data/
assets/
  characters/
  vehicles/
  monsters/
  bosses/
  tilesets/
  buildings/
  ui/
  effects/
  audio/
android/
docs/
legacy/
```

Preserve save compatibility where practical, but architecture and rendering may be replaced when necessary for quality.

## Working method
For substantial work:
1. Read relevant docs.
2. Inspect existing implementation.
3. State the narrow implementation objective internally.
4. Implement rather than merely describe.
5. Run syntax/build/runtime checks available in the environment.
6. Avoid broad unrelated refactors.
7. Produce actual runtime screenshots for visual milestone reviews.

## Immediate objective
Build the visual vertical slice defined in `ROADMAP_CN.md` before broad content expansion.
