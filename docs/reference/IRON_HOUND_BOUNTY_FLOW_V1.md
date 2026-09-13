# Iron Hound Bounty Flow v1

This is an original Wasteland Hunter bounty proposal. It is a design flow only:
no Runtime, schema, asset, or map implementation is included.

## 1. Flow overview

```text
Rumor
  → tracks
  → wreck evidence
  → NPC testimony
  → search zone
  → pre-boss encounter
  → boss arena
  → three phases
  → weak point
  → vehicle interaction
  → loot/proof
  → return to Hunter Guild
  → town reaction
```

The player may investigate the evidence in a flexible order. Three of four
clue beats reveal the search zone. Completing all four grants a readable
pre-boss advantage but never makes victory mandatory.

## 2. Research translation findings

### Finding I1 — rumor and local stakes

OBSERVED:
Public summaries describe informal quests and bounty hunting as activities
embedded in travel between settlements rather than only in a linear campaign.

USEFUL PRINCIPLE:
Begin with a local person or livelihood at risk, not with a monster
encyclopedia entry.

DO NOT COPY:
Do not copy any source bounty, boss, poster, rumor, or named settlement.

WASTELAND HUNTER DECISION:
At the Rustport Bar, a net-mender reports that two night crews failed to
return and that something has been dragging steel through the tidal mud. The
Hunter Guild posts only a provisional Iron Hound threat plate.

IMPLEMENTATION DEPENDENCY:
Content: rumor and Guild plate; Art: poster and bar staging; Runtime: start
condition; Map: Bar and Harbor anchors; no shared-contract change.

### Finding I2 — compact redundant clues

OBSERVED:
Open-world summaries support optional investigation, but the useful bounty
pattern remains anchored to concrete places, salvage, and recoverable proof.

USEFUL PRINCIPLE:
Use a compact set of independent clues that converge on a zone instead of
requiring a single NPC to deliver the whole answer.

DO NOT COPY:
Do not copy source clue counts, dialogue structures, monster tracks, or
investigation locations.

WASTELAND HUNTER DECISION:
The four clues are:

1. **Tracks:** three different tread-width marks at Net-Menders' Slip.
2. **Wreck evidence:** a torn loader arm and heat-scored cable in the
   Flooded Scrap Yard.
3. **NPC testimony:** the crane operator saw an orange maintenance light move
   inland after the tide pump failed.
4. **Guild comparison:** the evidence tray matches a decommissioned industrial
   hound chassis, not a military unit.

IMPLEMENTATION DEPENDENCY:
Map: four evidence anchors; Art: tracks/wreck/cable assets; Content:
testimony; Runtime: clue completion and reveal; Contract: no new key in this
proposal.

### Finding I3 — search zone and pressure

OBSERVED:
Public vehicle-RPG summaries pair nonlinear travel with specific locations and
optional side objectives; the player benefits from choosing when to commit.

USEFUL PRINCIPLE:
Reveal a bounded search zone, then apply pressure through an encounter that
signals the boss is near without starting the boss in the town.

DO NOT COPY:
Do not copy source overworld gates, random encounter tables, boss entrances,
or escalation scripts.

WASTELAND HUNTER DECISION:
The search zone is the Old Tideway, a narrow industrial drainage route west of
Rustport. A pre-boss encounter is a damaged maintenance drone guarding a
freshly dragged cable. If all four clues are complete, the player can bypass
the drone or disable it with one vehicle interaction; otherwise it calls the
Iron Hound sooner.

IMPLEMENTATION DEPENDENCY:
Map: Old Tideway and encounter pocket; Runtime: reveal/pressure state; Art:
maintenance drone and cable; Mobile: context action; no schema change.

### Finding I4 — boss arena reads as a place

OBSERVED:
The public series descriptions emphasize environmental vehicle battles rather
than a detached menu-only boss screen.

USEFUL PRINCIPLE:
The arena should explain the boss behavior before the first phase and provide
space for vehicle/foot contrast.

DO NOT COPY:
Do not copy source battle backdrops, boss silhouettes, phase names, attacks,
or arena geometry.

WASTELAND HUNTER DECISION:
Iron Hound's arena is a collapsed tide-pump station with three readable
elements: a raised dry platform, a flooded channel, and a cable gantry. The
player enters in the Rust Runner through the platform gate. The boss uses the
channel to break line of fire and the gantry as cover.

IMPLEMENTATION DEPENDENCY:
Map: arena geometry and collision; Art: station, water, gantry; Runtime:
camera, depth, boss placement; Mobile: vehicle movement clarity.

## 3. Original three-phase encounter

### Phase 1 — Searchlight and charge

The Iron Hound is intact enough to move on four industrial legs. It sweeps a
white-orange maintenance lamp across the platform, then charges along the
dry edge. Its readable vulnerability is the exposed **left coolant manifold**
when the lamp pauses to reorient. Cannon hits to the main body deal reduced
damage; the player learns to wait for the lamp pause.

Vehicle interaction: the Rust Runner can ram a loose pump brace to create a
temporary cover wedge. This is a positioning action, not a copied source
gimmick.

### Phase 2 — Flooded channel split

At roughly two-thirds integrity, the right rear leg tears a seal and the
channel floods higher. The Iron Hound alternates between the platform and
channel, forcing the player to use the Rust Runner's turning space and one
short dismount path. The coolant manifold is still the weak point, but only
after the boss completes a cable-drag animation.

Vehicle interaction: the player can fire the 75mm cannon into the tide pump
valve to lower the channel for a short window. A foot-only side switch can
extend the window but is optional and risky.

### Phase 3 — Failing maintenance protocol

At roughly one-third integrity, the lamp turns red and the boss begins a
three-step protocol: mark the vehicle, cut across the flooded channel, and
attempt a clamp attack. The left coolant manifold opens longer after the
clamp misses. Destroying it disables the red lamp and ends the protocol. The
boss then exposes its proof-bearing control core for the final damage window.

Vehicle interaction: the player may stay mounted for the safer route or
dismount to pull a manual release on the gantry. The manual release is a
choice, not a required class or faction action.

## 4. Weak point, loot, and proof

The consistent weak point is the left coolant manifold; its visual damage
state changes after each phase. The final control core is not a second hidden
answer: it is the proof component exposed after the manifold is disabled.

Victory yields:

- **Iron Hound control seal:** proof item for the Guild.
- **Industrial hound jaw plate:** visible Rust Runner scrap/armor material,
  subject to normal future item integration.
- **Tide-pump regulator:** practical town-repair material.
- Credit and scrap reward resolved only at Guild return.

No victory reward grants faction membership or a faction lock.

## 5. Return-to-town payoff

### Hunter Guild

The Guild clerk validates the control seal, pays 350 credits, awards eight
scrap and one Hunter Rank, and marks the bounty complete. A duplicate claim
must be rejected by the existing one-shot completion boundary.

### Town reaction

- The Bar rumor keeper replaces the missing-crew rumor with a short
  acknowledgment that the tide route is usable again.
- The Clinic clears one dock-worker cot and mentions that the next patient came
  in with machine-burns, establishing ongoing danger without a new quest gate.
- The Harbor crane operator raises the orange maintenance pennant to green.
- Liu Yan comments once on the player's chosen Rust Runner part.

These are local reaction beats, not a world-saving ending and not a faction
reputation system.

## 6. Dependency matrix

| Decision | Contract | Runtime | Art | Mobile | Map | Owner |
|---|---|---|---|---|---|---|
| Rumor/clue chain | No new fields proposed | Clue state and objective reveal | Poster, tracks, wreck evidence | Context action review | Four evidence anchors | Content + Runtime + Map + Art |
| Search zone | Existing route boundary only | Zone unlock and pressure | Drone/cable evidence | Targeting/interaction | Old Tideway | Runtime + Map |
| Three phases | No schema change proposed | Phase machine, hit feedback, camera | Boss states, weak-point damage | Drive/fire/dismount | Tide-pump arena | Runtime + Art + Map + Mobile |
| Vehicle interactions | Reuse Rust Runner mounts | Brace/valve/manual release | Pump/gantry feedback | Input affordances | Collision and cover | Runtime + Map + Art |
| Proof/reward | Existing bounty boundary | Claim/reward/repeat prevention | Loot/proof icons | No special work | Guild return anchor | Runtime + Art |
| Town reaction | Existing registered progress only | One-shot local reactions | Pennant, NPC state, props | No special work | Reaction placements | Content + Runtime + Art + Map |

## 7. Acceptance and blockers

- Original flow is Canon-compatible and keeps the player independent.
- No source map, sprite, dialogue, or event script is reproduced.
- The current minimal three-hit route is not claimed to satisfy this design;
  multi-phase behavior remains a future Runtime work item.
- Production boss and evidence assets remain an Art dependency.
- Any generic clue or phase schema must go through Shared Contract review
  before implementation.
