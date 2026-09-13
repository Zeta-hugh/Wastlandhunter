# First Vehicle Progression v1 — Rust Runner

This document translates the Sprint 1 vehicle findings into an original,
Canon-compatible sequence. It does not alter the existing vehicle contract or
implement Runtime behavior.

## 1. Progression beats

### Beat 1 — See the possibility

OBSERVED:
Public Metal Max 2 references frame an early light vehicle through a repair
garage and describe tanks as central to the game's combat identity.

USEFUL PRINCIPLE:
The player should see the first vehicle in a state that invites repair before
receiving control of it.

DO NOT COPY:
Do not reproduce any source vehicle, garage, recovery scene, name, dialogue,
or staging.

WASTELAND HUNTER DECISION:
At Rustport arrival, the Rust Runner is visible under the Broken Drydock
Gantry, missing one track module and with a cold turret mount. Liu Yan is
nearby but does not claim ownership for the player.

IMPLEMENTATION DEPENDENCY:
Map: gantry sightline; Art: damaged chassis/turret/track layers; Content:
Liu Yan scene; Runtime: staged inspection; Contract: existing vehicle
metadata only.

### Beat 2 — Earn ownership

OBSERVED:
Public summaries connect vehicle use with repair, part enhancement, weight
limits, and a continued need for on-foot areas.

USEFUL PRINCIPLE:
Ownership should cost a manageable resource and a short action sequence so the
player feels responsible for the machine.

DO NOT COPY:
Do not copy repair prices, source resource names, formulas, or garage UI.

WASTELAND HUNTER DECISION:
The player supplies six scrap, helps align the track, and completes a three
step repair interaction. The Rust Runner becomes theirs only after Liu Yan
hands over the local ownership tag used by the current route.

IMPLEMENTATION DEPENDENCY:
Runtime: repair progression and existing route state; Art: repair frames;
Mobile: multi-step interaction; Map: safe repair footprint; Contract: no new
save key proposed.

### Beat 3 — Learn the vehicle safely

OBSERVED:
Vehicle-centered combat is paired with locations that require the party to
leave the tank.

USEFUL PRINCIPLE:
The first vehicle tutorial must teach both its power and its boundary.

DO NOT COPY:
Do not copy a source tutorial encounter, control scheme, enemy, or arena.

WASTELAND HUNTER DECISION:
After repair, the player drives through the Garage test lane, fires one 75mm
practice round at a marked dead loader, parks, and dismounts into the side
service lane. The test has no failure penalty and does not count as Iron Hound
damage.

IMPLEMENTATION DEPENDENCY:
Runtime: drive/fire/test state; Art: cannon recoil and target reaction; Map:
test lane and dismount bay; Mobile: control grouping; Contract: reuse existing
Rust Runner mount data.

### Beat 4 — Make one personal choice

OBSERVED:
Public descriptions emphasize part-by-part tank customization rather than a
single fixed vehicle upgrade.

USEFUL PRINCIPLE:
The first customization should be visible, reversible before confirmation,
and explain a play-style difference in one sentence.

DO NOT COPY:
Do not copy source parts, stat curves, customization screens, or vehicle
silhouettes.

WASTELAND HUNTER DECISION:
At the Garage parts bench, choose one:

- **Salvaged side rack:** visibly adds a storage layer and improves scrap
  carrying capacity.
- **Reinforced front plate:** visibly adds a front armor layer and improves
  collision recovery.

Both choices preserve the Rust Runner's independent chassis/turret/weapon
assembly and can be replaced later.

IMPLEMENTATION DEPENDENCY:
Contract: verify existing armor/storage mounts; Art: independent layers;
Runtime: preview/apply/replacement; Mobile: large readable choice cards; no
schema change in Sprint 1.

### Beat 5 — Convert ownership into emotional value

OBSERVED:
The public series summaries combine salvage, customization, travel, and
character relationships, making the vehicle a continuing object rather than a
one-time unlock.

USEFUL PRINCIPLE:
The first vehicle should immediately carry a memory and a practical reason to
keep it.

DO NOT COPY:
Do not copy source vehicle lore, named owners, pet/party scenes, or signature
phrasing.

WASTELAND HUNTER DECISION:
The Rust Runner keeps a small Harbor inspection tag from the first repair. On
return to the Garage, Liu Yan refers to the player's chosen rack or plate
once. The tag is visual flavor and does not force a faction or companion
relationship.

IMPLEMENTATION DEPENDENCY:
Content: one contextual line; Art: inspection tag; Runtime: selected-part
presentation; no Contract/Mobile dependency beyond existing UI.

## 2. Timing target

For the first 20–40 minutes of the Rustport slice:

1. Arrival and first sight: 0–5 minutes.
2. Guild/Bar rumor and Liu Yan setup: 5–12 minutes.
3. Six-scrap repair: 12–18 minutes.
4. Test lane and first customization: 18–25 minutes.
5. Investigation travel and Iron Hound pressure: 25–40 minutes.

These are pacing targets, not hard timers. Optional town interactions may
lengthen the route without hiding the next clear action.

## 3. Canon and contract guardrails

- The player remains an independent hunter.
- Rust Runner uses the existing modular chassis/turret/weapon model.
- No new SaveData or WorldState key is required by this proposal.
- The legacy prototype remains untouched.
- Missing production art remains `NEEDS_ART`; no placeholder can satisfy the
  first-vehicle acceptance bar.

## 4. Dependencies and owners

| Work item | Owner | Dependency class |
|---|---|---|
| Damaged/ready Rust Runner layers | Production Art | Art |
| Gantry, repair bay, and test lane | Map / Map integration | Map |
| Repair/test/ownership progression | Runtime | Runtime |
| Part preview and input affordance | Runtime + Mobile | Mobile |
| Mount and part IDs | Shared Contract review only | Contract |
| Liu Yan contextual lines | Content / Reference review | no engineering change |
