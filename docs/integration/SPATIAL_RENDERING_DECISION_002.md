# Decision 002 — Rustport production draw ordering

Date: 2026-09-13. Integration / Runtime owner: current primary agent,
acting under the user's project takeover and implementation authorization.

## Scope accepted

Integrate depth ordering into `game/app/core/renderer.js` using existing
scene position, `z_height`, `depth_layer`, and `occlusion` fields. No new
AssetEntry, WorldState or SaveData fields are introduced.

The sandbox's `visualZ * 0.35` formula and separate ground-contact coordinate
model are not copied into production. The existing production projection
already subtracts height in screen pixels and uses manifest pivots.
The production integration directive specifies `worldY + depth_layer + z_height`.
For this narrow pass, the existing ordered `scene.layers` array supplies the
numeric layer offset. An object's `occlusion: foreground` selects that layer's
offset. Equal depth uses stable object ID ordering.

This is additive depth ordering, not an unconditional foreground overlay.
Bridges, indoor transitions and roof-toggle behavior still require separate
authored geometry and acceptance tests. This change does not claim those work.

## Implemented behavior

- Queue scene props, the existing garage/sign representation, characters,
  vehicle and bounty actor before drawing, then sort each frame.
- Keep vehicle tracks/chassis/turret/weapon together as one queued object;
  preserve their internal component order.
- Project actor elevation visually, while the contact shadow remains on the
  ground. Collision and interaction data remain independent and unchanged.
- Draw HUD after the world queue and reset text alignment so world labels
  cannot make the HUD title clip at the left edge.

## Acceptance evidence

- `npm run test:renderer`: movement/camera/pivot checks plus player/prop
  crossing, elevation, stable ground shadow, grouped vehicle components,
  deterministic order, and unchanged scene data.
- `npm run test:renderer:browser`: real production renderer and QA_PASS P0
  vehicle/prop PNGs; vehicle draw order switches on the two sides of a barrel.
- Runtime screenshot: `qa/runtime_previews/production_depth_order.png`.
  This is a technical two-view fixture, not a complete Rustport scene.
- Standard runtime compatibility and next-entry gates are recorded in
  `TAKEOVER_PROGRESS_CN.md`.

## Remaining boundaries

Character and Boss production art is still missing. Character rendering is
covered by recording-canvas tests, not accepted visual screenshots. Existing
prototype building blocks and incomplete scene composition remain visible.
No visual milestone is approved by this decision.
