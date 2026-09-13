# Rustport P0 Batch 01 — Accepted ImageGen Prompt Set

Mode: OpenAI built-in ImageGen. The four root boards (`image.png` through `image4.png`) were supplied only as style references. Chroma-magenta was an intermediate isolation background for alpha extraction; it is absent from production PNGs.

## ground_dirt_oily_01

```text
Regenerate asset_id ground_dirt_oily_01 as a production-ready 32x32 logical-pixel seamless game tile shown enlarged with nearest-neighbor scaling. Preserve only the broad material family of the last image: compacted Rustport soil, dusty ochre-brown, cool soot gray, localized oil-darkened earth and tiny gravel. Rebuild the pixel placement from scratch; do not copy the prior texture.

The artwork must behave as exactly 32 logical pixels across and 32 logical pixels high: large crisp square pixels, deliberate clusters, no antialiasing, no tiny subpixel noise, no sharpening texture. The entire square is filled and opaque. Exact camera is 90-degree ground_topdown. Keep all distinct patches smaller than roughly 5 logical pixels so a 4x4 repeat does not reveal a large recurring symbol, diagonal band, circular stain, central feature or grid. Use evenly distributed microvariation with only restrained low-contrast oil flecks and a few one-pixel gravel accents. Make left/right edges and top/bottom edges seamless and continuous. No road border, curb, object, footprint, tire icon, text, logo, symbol, UI, watermark, cast shadow, checkerboard or frame. Low saturation and controlled contrast. Use reference boards only for broad palette and material language; do not copy their specific pixels or layouts. Output only the enlarged tile artwork.
```

## concrete_clean

```text
Regenerate asset_id concrete_clean as a production-ready 32x32 logical-pixel seamless game tile shown enlarged with nearest-neighbor scaling. Preserve only the broad material family of the last image: relatively clean Rustport repair-yard concrete, cool dusty gray, dirty-beige aggregate and restrained wear. Rebuild pixel placement from scratch; do not copy the prior texture.

Artwork must behave as exactly 32 logical pixels by 32 logical pixels: large crisp square pixels, deliberate clusters, no antialiasing, no tiny subpixel noise, no sharpened filter texture. Entire square filled and opaque. Exact camera 90-degree ground_topdown. Keep the surface mostly even and low contrast; use fine distributed aggregate and a few tiny scuffs, with no large patch, diagonal band, central feature, repeated circle or grid visible in a 4x4 repeat. At most two very faint one-pixel hairline crack fragments. Left/right and top/bottom edges seamless and continuous. No slab boundary, curb, grout line, painted line, drain, object, footprint, oil stain, text, logo, symbol, UI, watermark, shadow, checkerboard or frame. Low saturation and practical industrial wear. Use reference boards only for broad palette/material language; do not copy specific pixels or layouts. Output only the enlarged tile artwork.
```

## concrete_cracked

```text
Regenerate asset_id concrete_cracked as a production-ready 32x32 logical-pixel seamless game tile shown enlarged with nearest-neighbor scaling. The last image is the new concrete_clean sibling; match its material family, cool dusty-gray and dirty-beige palette, aggregate size, pixel density and low saturation. Rebuild pixel placement from scratch; do not copy its exact texture.

Artwork must behave as exactly 32 logical pixels by 32 logical pixels: large crisp square pixels, deliberate clusters, no antialiasing, no tiny subpixel noise, no sharpened filter texture. Entire square filled and opaque. Exact camera 90-degree ground_topdown. Add one restrained irregular branching crack network and two tiny chipped aggregate spots. The crack must remain readable at 32x32 but occupy a narrow path, cross at least one tile edge naturally, and avoid letters, icons, circles, regular cells, centered composition, diagonal band or grid when repeated 4x4. Keep all other variation small and low contrast. Left/right and top/bottom edges seamless and continuous. No slab boundary, curb, road marking, drain, object, footprint, oil stain, text, logo, symbol, UI, watermark, cast shadow, checkerboard or frame. Use reference boards only for broad palette/material language; do not copy specific pixels or layouts. Output only the enlarged tile artwork.
```

## concrete_oily

```text
Regenerate asset_id concrete_oily as a production-ready 32x32 logical-pixel seamless game tile shown enlarged with nearest-neighbor scaling. The last image is the new concrete_clean sibling; match its material family, cool dusty-gray and dirty-beige palette, aggregate size, pixel density and low saturation. Rebuild pixel placement from scratch; do not copy its exact texture.

Artwork must behave as exactly 32 logical pixels by 32 logical pixels: large crisp square pixels, deliberate clusters, no antialiasing, no tiny subpixel noise, no sharpened filter texture. Entire square filled and opaque. Exact camera 90-degree ground_topdown. Add several small irregular blue-black oil marks, one short softened tire scuff and restrained mechanical service wear. Oil must stay localized and translucent enough that concrete remains visible; no stain larger than roughly 5 logical pixels and no tile-wide darkening. Avoid any dominant central blot, diagonal band, repeated circle, icon or grid in a 4x4 repeat. Keep cracks very faint and sparse. Left/right and top/bottom edges seamless and continuous. No slab boundary, curb, painted line, drain, object, footprint, text, logo, symbol, UI, watermark, cast shadow, checkerboard or frame. Use reference boards only for broad palette/material language; do not copy specific pixels or layouts. Output only the enlarged tile artwork.
```

## awning_canvas_beige

```text
Create one original isolated production game asset for Wasteland Hunter: asset_id awning_canvas_beige.

Use the supplied boards only to infer Rustport's muted palette, purposeful repair materials, high-detail pixel-painted treatment, three-quarter camera language, and upper-left lighting. Do not reproduce or crop any specific pixels, text, logos, portraits, layouts, signs, or distinctive compositions.

Output exactly one old beige canvas wall awning module on a genuinely transparent RGBA background. No wall, building, floor, scene, panel, checkerboard, matte, halo, frame, UI, text, logo, watermark, flag, advertisement, or separate objects. Camera is fixed 2.5D three_quarter, compatible with other Rustport props. Show the top plane and hanging front edge clearly: faded dusty beige canvas, practical stitched seams, restrained folds, mild sag between supports, dirty lower hem, patched repair, and two short oxidized mounting brackets integrated into the module. Upper-left highlights and lower-right shading, plus no large cast shadow. The attachment line should read near the upper center so a runtime pivot at [48,16] on a 96x64 canvas can mount it to a wall. Keep the complete silhouette centered with ample transparent padding and no cropped pixels. Deliberate pixel clusters, crisp outline, realistic weathered industrial material, low saturation, readable at 96x64. Do not make it a tent, roof, sign, banner, clean fabric, cartoon prop, photographic object, or concept sheet.
```

Isolation edit:

```text
Edit this exact awning production asset. Preserve the awning's design, proportions, pixels, materials, upper-left lighting, mounting brackets, folds, stitched repair patch, color and complete silhouette. Replace every checkerboard and background pixel with one perfectly uniform flat chroma-magenta color #FF00FF so it can be removed cleanly in the asset build. No gradient, texture, shadow plane, halo, transparency pattern, white or gray areas in the background. Keep exactly one awning centered with ample padding and no crop. Do not add or remove object details, and do not add text, wall, floor, props, frame, UI, logo, watermark, or effects.
```

## barrel_rust

```text
Create one original isolated production game asset for Wasteland Hunter: asset_id barrel_rust.

Use the supplied boards only to infer Rustport's muted palette, realistic worn-industrial pixel treatment, three-quarter camera language, outline density, and upper-left lighting. Do not reproduce or crop any specific pixels, text, logos, portraits, layouts, signs, or distinctive compositions.

Output exactly one rusted industrial oil drum on a genuinely transparent RGBA background. No floor, wall, scenery, checkerboard, matte, halo, frame, UI, text, brand, hazard symbol, logo, watermark, fire, smoke, liquid spill, or separate debris. Camera is fixed 2.5D three_quarter, showing an elliptical top plane, cylindrical body volume, metal hoops, bottom rim and a clear ground contact. Material: dark oxidized steel, layered red-brown rust along seams and edges, chipped faded dark paint, oil and soot localized around use points, one believable welded repair patch. Upper-left highlights, lower-right form shading, only a tiny tight contact shadow. Keep the complete silhouette centered with ample transparent padding and no cropped pixels. Deliberate pixel clusters, crisp readable contour, low saturation, realistic purposeful wear, recognizable at 32x48 runtime. Do not make it cartoonish, plastic, clean, photographic, front-on, side-on, or a concept sheet.
```

Isolation edit:

```text
Edit this exact rusted barrel production asset. Preserve the barrel's design, proportions, pixels, cylindrical volume, elliptical top, hoops, welded repair, corrosion, upper-left lighting, small contact shadow and complete silhouette. Replace every checkerboard and background pixel with one perfectly uniform flat chroma-magenta color #FF00FF so it can be removed cleanly in the asset build. No gradient, texture, shadow plane outside the tight contact shadow, halo, transparency pattern, white or gray areas in the background. Keep exactly one barrel centered with ample padding and no crop. Do not add or remove object details, and do not add text, hazard symbols, floor, props, frame, UI, logo, watermark, fire, smoke, or effects.
```

## rust_runner_chassis_s

```text
Create one original isolated production game asset for Wasteland Hunter: asset_id rust_runner_chassis_s.

Use the supplied boards only for Rustport's muted material palette, realistic high-detail pixel-painted treatment, silhouette density, and shared 2.5D three-quarter camera language. Do not reproduce or crop any specific pixels, named vehicle, text, logo, map layout, character, or distinctive composition.

Output exactly one SOUTH-FACING Rust Runner central chassis/hull module, isolated on a perfectly uniform solid chroma-magenta background #FF00FF for later alpha removal. The background must be completely flat with no checkerboard, gradient, texture, lighting, ground plane, scenery, frame, UI, text, logo, watermark, or extra object. The vehicle module is a compact improvised industrial wasteland hull seen in fixed three_quarter view: front points toward the bottom of the canvas; show top deck, angled front glacis and side volume. Materials: oxidized steel, purposeful mismatched armor plates, dark seams, welded patch repairs, bolts, worn rubber isolation blocks and mechanical track-connection points. It must have a strong readable independent silhouette and real chassis volume. Include left and right track mounting structures and suspension attachment points, but NO track belts or complete track modules. NO turret, turret weapon, main cannon, machine gun, antenna, storage boxes, fuel tanks, lights, crew, decals, fire, smoke, muzzle flash, large cast shadow, or ground.

Upper-left highlights, lower-right form shading, only minimal underbody darkening contained within the object. Low saturation, crisp deliberate pixel clusters, realistic purposeful wear, mobile readable at 128x128. Center the complete object with generous clear magenta padding; do not crop any pixel. Design it for a runtime pivot at [64,96] and later layering with separate left track, right track, turret and cannon assets in the same 128x128 coordinate space.
```

## rust_runner_track_left

```text
Create one original isolated production game asset for Wasteland Hunter: asset_id rust_runner_track_left.

The last supplied image is the newly generated SOUTH-facing Rust Runner chassis sibling. Match its exact material family, pixel scale, wear level, camera angle, chassis length and suspension connection language. Use the other boards only for broad Rustport art direction. Do not copy or crop specific reference-board pixels, text, logos, vehicle examples, layouts, or distinctive compositions.

Output exactly one LEFT-SIDE track module for that SOUTH-facing chassis, isolated on a perfectly uniform solid chroma-magenta background #FF00FF for later alpha removal. The background must be completely flat with no checkerboard, gradient, texture, ground, frame, UI, text, logo, watermark, or extra object. Show a complete continuous rubber-and-steel track belt, front and rear wheels, compact road wheels, suspension arms, oxidized guards and the inner mounting face that connects to the chassis. Fixed 2.5D three_quarter view consistent with the chassis, front of vehicle pointing toward the bottom of canvas. This is the module mounted on the vehicle's screen-left side; its foreshortening and contact edge must match the SOUTH chassis. No chassis hull, turret, cannon, weapon, accessories, dust, smoke, sparks, fire, track marks, terrain, or large cast shadow.

Upper-left highlights and lower-right form shading. Low saturation, dark worn rubber, oxidized steel, deliberate pixel clusters and crisp functional silhouette, readable at 128x128. Center the complete module with generous magenta padding and no crop. Design it for later placement in the same 128x128 coordinate system with shared vehicle pivot [64,96]; retain a clear lower contact edge.
```

## rust_runner_track_right

```text
Create one original isolated production game asset for Wasteland Hunter: asset_id rust_runner_track_right.

The last two supplied images are the newly generated SOUTH-facing Rust Runner chassis and its LEFT track sibling. Create the matching RIGHT-SIDE track module: same construction family, physical scale, number and proportions of wheels, track pitch, suspension logic, material palette, wear level, pixel density and fixed camera. It must be a separately drawn right-side counterpart with lighting still from upper-left, not a simple mirrored duplicate. Use the other boards only for broad Rustport art direction. Do not copy or crop specific reference-board pixels, text, logos, vehicle examples, layouts, or distinctive compositions.

Output exactly one RIGHT-SIDE track module, isolated on a perfectly uniform solid chroma-magenta background #FF00FF for later alpha removal. Background completely flat: no checkerboard, gradient, texture, ground, frame, UI, text, logo, watermark, or extra object. Show complete rubber-and-steel track belt, front/rear wheels, road wheels, suspension arms, oxidized guards and inner chassis mounting face. Fixed 2.5D three_quarter view consistent with the SOUTH chassis, front of vehicle pointing toward bottom of canvas. This module mounts on the vehicle's screen-right side, with correct opposite-side foreshortening and matching contact edge. No chassis hull, turret, cannon, weapon, accessories, dust, smoke, sparks, fire, track marks, terrain, or large cast shadow.

Upper-left highlights and lower-right form shading. Low saturation, dark worn rubber, oxidized steel, deliberate pixel clusters and crisp functional silhouette, readable at 128x128. Center complete module with generous magenta padding and no crop. Design it for the same 128x128 coordinate system and shared vehicle pivot [64,96], with a clear lower contact edge.
```

## rust_runner_turret_00

```text
Create one original isolated production game asset for Wasteland Hunter: asset_id rust_runner_turret_00.

The last supplied image is the newly generated Rust Runner chassis sibling. Match its oxidized steel palette, purposeful patchwork construction, pixel density, wear level, three-quarter camera and scale. Use the other boards only for broad Rustport art direction. Do not copy or crop specific reference-board pixels, text, logos, named vehicle examples, layouts, or distinctive compositions.

Output exactly one Rust Runner base turret body at rotation state 00, isolated on a perfectly uniform solid chroma-magenta background #FF00FF for later alpha removal. Background completely flat: no checkerboard, gradient, ground, texture, frame, UI, text, logo, watermark, or other objects. Fixed 2.5D three_quarter camera. The turret is a compact low-profile rotating armored assembly with an unmistakable circular turret ring/rotation center, asymmetric welded patch plates, bolts, a modest commander hatch and a clear EAST-facing main-gun socket/mantlet at the right edge for attachment to cannon_75mm. Include the gun mounting socket only. Do NOT include any barrel, main cannon, machine gun, weapon, chassis, tracks, antenna, storage, crew, smoke, fire, muzzle flash, effects, or cast shadow.

Upper-left highlights, lower-right form shading. Low saturation, oxidized steel, dark seams and purposeful repairs. Crisp deliberate pixel clusters and strong readable silhouette at 128x128. Keep the complete turret centered with generous magenta padding and no crop. Design its rotation center to align with runtime pivot [64,61] and its east-facing gun mount to accept a separate weapon whose pivot is [28,64].
```

## cannon_75mm

```text
Create one original isolated production game asset for Wasteland Hunter: asset_id cannon_75mm.

The last two supplied images are the newly generated Rust Runner chassis and turret. Match their oxidized steel palette, physical construction, pixel density, wear level, upper-left lighting and fixed three-quarter camera. The cannon must fit the turret's east-facing circular gun socket. Use the other boards only for broad Rustport art direction. Do not copy or crop specific reference-board pixels, text, logos, weapon examples, layouts, or distinctive compositions.

Output exactly one independent 75mm main gun module pointing EAST, isolated on a perfectly uniform solid chroma-magenta background #FF00FF for later alpha removal. Background completely flat: no checkerboard, gradient, ground, texture, frame, UI, text, logo, watermark, or other objects. Show the rear mounting collar/breech interface at the left, a practical mantlet connector, a medium-light 75mm barrel with believable wall thickness and restrained taper, one repaired heat sleeve/clamp, and a clear open muzzle at the right. Length and weight should feel plausible for a mobile improvised armored vehicle: visibly lighter and shorter than 105mm or 120mm guns, but unmistakably a main cannon. No turret body, chassis, tracks, projectile, shell casing, muzzle flash, smoke, fire, recoil effect, large cast shadow, or duplicate weapon.

Upper-left highlights and lower-right form shading. Low saturation, oxidized steel, dark seams and purposeful repair wear. Crisp deliberate pixel clusters and a strong readable silhouette at 128x128. Keep the entire cannon centered vertically with ample magenta padding and no cropped muzzle. Compose for runtime pivot [28,64] at the mounting point and muzzle_point [112,64], with the barrel axis exactly horizontal toward the right.
```
