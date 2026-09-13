# Rustport character batch 02 — prompts and intake

Date: 2026-09-13. Tool: built-in image_gen; no CLI/API fallback.
Reference: root image3.png, inspected alongside the other three boards.
Board pixels were not cropped or imported as assets.

## Protagonist south idle candidate

```text
Use case: stylized-concept. Create ONE standalone production game sprite: Wasteland Hunter protagonist, idle frame 00, facing SOUTH (toward viewer), slight elevated 3/4 orthographic RPG camera showing top of head/shoulders. Use attached repository board only as style and character-identity reference, never reproduce the board or crop its pixels. Identity from the black-haired male protagonist in the board: tousled black hair, brass goggles resting on head, rust-red scarf, patched brown scavenger jacket, dark utility trousers, heavy brown boots, practical belt. Full body neutral relaxed idle, arms at sides, two boots completely visible, no weapon, no scenery. High quality restrained pixel-art clusters, crisp contours, warm rust/brown leather with desaturated steel, upper-left warm light, readable at 48x72 game size. Single character only on genuinely TRANSPARENT background, no cast shadow, no text, no grid, no panel, no logo. Portrait canvas 1024x1536; character centered horizontally, soles at y=1450, head around y=180, all limbs inside with margin. Do not create a sheet or multiple poses. This is a directly usable independent sprite master, not a portrait illustration.
```

## Protagonist alpha retry

```text
Edit this single protagonist sprite. Preserve the character identity, clothing, camera angle, entire pose and silhouette exactly. Remove ALL of the checkerboard pattern background and replace it with actual alpha transparency, not white, gray, checkerboard, or simulated transparency. Output a true RGBA PNG with alpha=0 everywhere outside the character, including all space between limbs. No checkerboard pixels, no matte fringe, no added shadow, no text. Keep the full body uncropped in the same portrait canvas.
```

## Liu Yan south idle candidate

```text
Use case: stylized-concept. ONE independent game sprite master for Wasteland Hunter, Liu Yan (柳焰), south-facing idle frame 00. Reference board is ONLY identity/style guidance; no copying board pixels, no sheet. Adult pragmatic veteran female hunter, recognizable red hair, goggles on head, weathered charcoal-and-brown leather field jacket, practical light undershirt, utility belt, dark trousers and sturdy boots. Match the red-haired character in the reference, practical complete clothing suitable for combat. Elevated 3/4 orthographic RPG view, facing toward viewer, neutral idle stance, full body all boots and hands visible, arms relaxed. Crisp small-scale pixel-art forms, restrained rust-red/copper/charcoal palette, light from upper left. True transparent RGBA background with zero alpha outside character; DO NOT draw a checkerboard or any background at all. No ground, no cast shadow, no text, no logo, no panel, no extra people. Portrait 1024x1536 canvas, horizontally centered, sole contact at y=1450, top of hair at y=180. Intended downsample target 48x72. Single pose only.
```

## Intake

Candidates and failed variants are retained in `qa/assets/character_batch_02/`.
Technical results are recorded in `qa/reports/character_batch_02.json`.
No candidate may enter source_master/runtime/release until its real alpha,
dimensions, visual style, silhouette and ground-contact placement pass review.
These generated candidates do not change production manifest status.

