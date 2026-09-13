# Rustport Spatial Grammar v1

This is an original design decision document for the Rustport vertical slice.
It defines circulation and interaction grammar, not a reproduced source map.

## 1. Spatial contract

### Primary circulation

Rustport is a coastal industrial town entered from the south Town Gate. The
main route runs north-east through the Gate Checkpoint, past the Hunter Guild
and Garage, bends through the Market, then opens onto the Harbor. A player can
understand the route from three sightline cues: the Guild's tall bounty board,
the Garage gantry, and the Harbor crane.

### Route hierarchy

- **Main route:** Town Gate → Guild/Garage triangle → Market → Harbor.
- **Secondary route A:** Guild → Bar → Clinic, for information and recovery.
- **Secondary route B:** Garage → Scrap Yard, for parts and practical errands.
- **Secondary route C:** Market → Net-Menders' Slip, for optional dock life.
- **Foot-only cut-through:** Clinic steps → upper service lane; no vehicle
  collision is allowed.
- **Vehicle loop:** Gate → Garage → cargo apron → Harbor gate → Gate. It is
  wide enough for the Rust Runner and has one deliberate parking bay.

### Service placement

| Service | Placement rule | Reason |
|---|---|---|
| Hunter Guild | Just north-east of Town Gate, visible on arrival | First information and bounty orientation |
| Garage | Across a short paved lane from Guild, with direct sightline | First-vehicle ownership and repair |
| Market | East of the triangle, between Guild and Harbor | Makes trade part of circulation, not a dead-end menu |
| Bar | One branch west of Guild | Rumor density without blocking the main route |
| Clinic | Beyond the Bar, sheltered from cargo traffic | Recovery and human-scale contrast |
| Harbor | North edge, wider and louder than the service core | Long-range goal and town identity |

### NPC density

Use a dense service core, medium bar/market density, and sparse harbor edges.
The main route should show named workers at readable intervals rather than a
crowd wall: one Guild clerk, two garage workers, three market vendors, one
clinic worker, and four dock workers are enough for the first slice. Ambient
unnamed workers can repeat in the Harbor only if they do not obscure
interactions.

### Landmark rules

Three major landmarks:

1. **The Tide-Cut Crane:** a rust-red cargo crane at the Harbor entrance; it
   identifies north and frames the Harbor approach.
2. **The Hunter Guild Board:** a tall, backlit board with replaceable bounty
   plates; it is the first readable service landmark from the Gate.
3. **The Broken Drydock Gantry:** the Garage's elevated repair frame; it
   silhouettes the Rust Runner and marks the vehicle threshold.

Five secondary landmarks:

1. **Salt-burnt water tower** beside the Clinic.
2. **Three-color cable bridge** crossing the Market lane.
3. **Collapsed fish-smoke chimney** at Net-Menders' Slip.
4. **Scrap weighing cage** at the Scrap Yard entrance.
5. **Flood marker wall** showing old storm heights near the Town Gate.

### Harbor relationship

The Harbor is visible from the north end of the central spine but is not a
single screen-wide backdrop. The player passes through a gate, then sees
working piers, net racks, a tide pump, and the Crane. The Harbor supplies
Rustport's labor identity and the first Iron Hound rumor without implying that
the bounty begins at the boss arena.

### Town Gate

The Gate is a compressed arrival threshold with a check kiosk, vehicle-width
road, pedestrian side path, and a board pointing toward Guild/Garage. On first
entry the camera gives a brief north-east look-ahead. On later entries it
returns control immediately and does not replay exposition.

### Scrap Yard

The Scrap Yard sits south-west of the Garage and is accessible by vehicle to
an outer sorting apron. Its inner cage, magnet platform, and evidence shed are
on foot. It is a practical pocket, not a dungeon: one short loop, one optional
scrap interaction, and one future-proofed evidence location.

## 2. Meaningful interactions

The first Rustport slice should expose at least these 18 interactions:

1. Town Gate flood marker: inspect old storm height.
2. Gate kiosk: ask for safe road conditions.
3. Hunter Guild bounty board: read available plates.
4. Hunter Guild clerk: register/confirm independent hunter status.
5. Guild evidence tray: inspect Iron Hound track sample.
6. Garage mechanic: request Rust Runner assessment.
7. Liu Yan at the gantry: receive first-vehicle context.
8. Rust Runner hull: inspect missing track and turret mount.
9. Garage parts bench: choose storage rack or front plate.
10. Garage test lane marker: perform the first cannon test.
11. Market fuel vendor: compare safe fuel grades.
12. Market scrap broker: trade or appraise scrap.
13. Bar rumor keeper: hear the missing dock-worker rumor.
14. Bar wall map: mark the harbor search direction.
15. Clinic intake desk: learn which dock workers returned injured.
16. Clinic water tower valve: restore a small flow, optional.
17. Net-Menders' Slip: speak with a net repairer and inspect drag marks.
18. Scrap Yard weighing cage: trade one scrap bundle for local credit.
19. Harbor tide pump: inspect unusual oil in the intake.
20. Harbor crane operator: obtain a time-of-day testimony.

The list is intentionally larger than the first quest path. The player should
not need every interaction to start or finish Iron Hound.

## 3. Optional exploration pockets

### Net-Menders' Slip

On foot only. Contains net racks, a tide stain, the net repairer, and a small
recoverable scrap cache. It teaches that the Harbor is a working place.

### Crane Catwalk

Foot-only upper path reached from the Harbor service stairs. Contains a
wind-warning pennant, a view over the Rust Runner route, and a safe overlook
for reading the Tide-Cut Crane landmark. No combat is required.

### Flooded Scrap Yard

Vehicle-accessible apron with a foot-only flooded inner cage. Contains a
magnet operator, one optional salvage check, and a nonessential wreck fragment
that can strengthen Iron Hound pre-boss information.

## 4. On-foot and vehicle accessibility rules

- The Rust Runner can enter the Gate, main spine, Garage apron, Market loading
  lane, and Harbor cargo apron.
- The Rust Runner cannot enter Clinic steps, Bar interior, Market vendor
  alleys, Crane Catwalk, Net-Menders' inner slip, or Scrap Yard inner cage.
- Every vehicle exclusion has a visible reason: width, stairs, overhead cable,
  standing water, or pedestrian safety barrier.
- Dismount points must be beside, not inside, an interaction target.
- The Garage is the canonical mode-change location; field dismounting is
  permitted only at marked bays.
- Mobile context actions prioritize Talk, Enter Garage, Drive, and Inspect in
  that order based on distance and current objective.

## 5. Arrival and transition

The world map transition places the player at the south Gate with the Rustport
silhouette visible before local control begins. Exiting uses the same Gate
after a short road alignment, preventing accidental Harbor bypass. The local
map must preserve the last parked vehicle position; the world map displays the
town as a coastal industrial node, not a scaled-down local map.

## 6. Dependency ownership

| Decision | Contract | Runtime | Art | Mobile | Map | Engineering owner |
|---|---|---|---|---|---|---|
| Gate/spine/triangle | No change | Camera/entry trigger | Signage and facades | Tap-target review | Primary | Map |
| Services and NPC density | No change | Interaction priority | NPC silhouettes/props | Interaction affordance | Spawn/layout | Runtime + Map |
| Major/secondary landmarks | No change | Occlusion/depth loading | Landmark assets | Readability review | Placement | Art + Map |
| Foot/vehicle restrictions | Reuse current vehicle metadata | Collision/mount state | Barriers and scale cues | Drive/dismount UX | Collision zones | Runtime + Map |
| Optional pockets | No change | Optional state flags only | Story props | No special dependency | Pocket geometry | Content + Map |
| World/local transition | No save/schema change proposed | Transition/camera | Gate and world-node art | Loading/input review | Exit/entry anchors | Runtime + Map |

No implementation is performed by this document.
