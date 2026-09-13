# 2.5D Spatial Model — Sprint 1 Sandbox

Status: `READY_FOR_REVIEW` for the isolated technical experiment only.

Production follow-up: [Decision 002](../integration/SPATIAL_RENDERING_DECISION_002.md)
integrates a narrow draw-order pass using the existing production scene contract.
The sandbox formula below remains experimental and was not promoted wholesale.

This model is local to `game/app/spatial-sandbox/`. It does not add fields to
production `AssetEntry`, `WorldState`, `SaveData`, map data, or route data.

## Coordinate semantics

| Field | Meaning |
| --- | --- |
| `worldX` | Horizontal world position of the object's ground-contact origin. |
| `worldY` | Depth-axis world position of the ground-contact origin. Larger values are nearer the camera in the 3/4 view. |
| `visualZ` | Visual elevation above the ground plane. It changes screen height and contributes to depth ordering; it does not move the collision footprint. |
| `height` | Visual/debug geometry height only. It is not inferred as collision height. |
| `pivot` | Pixel offset from the visual rectangle's top-left to its authored reference point. It controls placement only. |
| `groundContact` | Pixel offset from the visual rectangle's top-left to the point touching the ground plane. It remains stable when visual height changes. |
| `collisionFootprint` | Explicit local world-space rectangle used for collision. Sprite bounds, pivot, and visual height do not create or resize it. |
| `interactionFootprint` | Explicit local world-space rectangle used for interaction/range tests. It is independent from both the sprite and collision footprint. |
| `depthBias` | Explicit small ordering adjustment for authored exceptions such as foreground occlusion. It is not a replacement for `worldY` or `visualZ`. |

## Ordering

The sandbox uses:

```text
depthKey = worldY + visualZ * 0.35 + depthLayer + depthBias
```

Layer bands are `ground=0`, `structure=10`, `actor=20`, and
`foreground=30`. Equal keys use stable ID ordering. This makes Y-sort,
elevation, bridge-over/under, and foreground exceptions reproducible without
mutating production scene data.

## Grounding and collision rules

Visual placement is `world + groundContact - pivot - visualZ`. Collision bounds
are `world + collisionFootprint` only. Therefore a different pivot changes
where pixels are drawn, while the collision rectangle remains identical.
Changing `height` also leaves the ground contact and collision rectangle
unchanged.

## Sandbox fixtures

The local scene contains a test actor, three normal props, a tall wall, a
foreground fence, an elevated platform, and paired bridge-under/bridge-over
fixtures. All geometry and labels are explicitly `TEST ONLY`.
