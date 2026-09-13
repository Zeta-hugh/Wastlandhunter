# Sprint 1 Public Source Inventory and Findings

Date: 2026-09-13

Scope is limited to town/map spatial grammar, first-vehicle progression,
bounty discovery/investigation pacing, and world/local-map transition. No ROM,
ROM data, ripped map, sprite, dialogue, event script, or proprietary asset was
downloaded or reproduced.

## A. Sources studied

| Source | Public URL | What was studied | Scope result |
|---|---|---|---|
| Wikipedia — Metal Max | https://en.wikipedia.org/wiki/Metal_Max | Series premise and vehicle-centered RPG structure | Used only to verify the broad vehicle/settlement grammar; no content copied. |
| Wikipedia — Metal Max 2 | https://en.wikipedia.org/wiki/Metal_Max_2 | Nonlinear travel, foot/tank mode, tank customization, inaccessible-by-tank areas | Used for transition and progression principles. |
| Wikipedia — Metal Saga | https://en.wikipedia.org/wiki/Metal_Saga | Salvage economy, machine-heavy threats, optional quests, east-to-west journey framing, early and optional endings | Used for investigation/reward pacing and nonlinearity principles. |
| Metal Max Wiki — Metal Max 2 | https://metalmax.fandom.com/wiki/Metal_Max_2 | Public summary of vehicle acquisition examples, repair-garage framing, salvage and overworld controls | Used as a secondary cross-check only; no page-specific names, maps, text, or layouts are reproduced. |

The following public pages were attempted but were not available to this
research pass because of access restrictions and therefore are not treated as
studied sources: StrategyWiki Metal Max 2 and MobyGames Metal Max Returns.

## B. Town/map principles

### Finding T1 — readable circulation

OBSERVED:
Public summaries describe settlements as practical stops in a nonlinear
journey, while services such as repair, party preparation, and trade support
vehicle travel.

USEFUL PRINCIPLE:
The first minutes in a town should teach the player one legible route from
arrival to the most important service, with optional spaces branching from it.

DO NOT COPY:
Do not reproduce any original settlement footprint, road shape, building
order, or recognizable landmark silhouette.

WASTELAND HUNTER DECISION:
Rustport uses a south Town Gate → central service spine → north Harbor route.
The first-time player sees the Hunter Guild sign and Garage sightline before
entering optional alleys.

IMPLEMENTATION DEPENDENCY:
Map: primary route geometry; Art: signage and sightlines; Runtime: entrance
camera framing; Mobile: readable tap targets; no schema change.

### Finding T2 — service clustering without a menu town

OBSERVED:
Vehicle repair, equipment, travel, and information are repeatedly presented as
settlement functions rather than isolated abstract menus.

USEFUL PRINCIPLE:
Cluster high-frequency services tightly enough to compare them, but leave a
short walk between them so the town remains a place.

DO NOT COPY:
Do not copy any source game's shop names, interior arrangement, NPC wording,
or service adjacency.

WASTELAND HUNTER DECISION:
Rustport's Garage, Hunter Guild, and Market form a primary circulation
triangle. Bar and Clinic sit one branch away; Harbor is a destination rather
than a service kiosk.

IMPLEMENTATION DEPENDENCY:
Map: building anchors and collision; Runtime: interaction targets; Art: facade
identity; Mobile: context-action priority; Contract: none.

### Finding T3 — foot/vehicle permeability

OBSERVED:
The public Metal Max 2 summary explicitly distinguishes areas tanks cannot
enter, requiring on-foot travel.

USEFUL PRINCIPLE:
Vehicle ownership should expand reach without making the player's body and
town-scale investigation obsolete.

DO NOT COPY:
Do not reproduce source-game chokepoints, cave layouts, vehicle restrictions,
or vehicle roster.

WASTELAND HUNTER DECISION:
Rustport's main spine and cargo apron are vehicle-accessible; the Clinic
steps, fish-market alleys, Scrap Yard interior, and rooftop footpaths are
on-foot pockets. The Garage is the deliberate mode-change threshold.

IMPLEMENTATION DEPENDENCY:
Map: nav/collision tags; Runtime: mount/dismount and vehicle collision;
Mobile: clear mode affordance; Art: scale cues; Contract: no change.

### Finding T4 — optional pockets create local texture

OBSERVED:
Nonlinear public summaries emphasize choosing which informal quests and
locations to pursue rather than following a single mandatory corridor.

USEFUL PRINCIPLE:
Keep the main objective readable while placing low-pressure discoveries within
one or two turns of the main route.

DO NOT COPY:
Do not reproduce source-game optional quest premises, jokes, rewards, or map
secrets.

WASTELAND HUNTER DECISION:
Rustport has three optional pockets: Net-Menders' Slip, the Crane Catwalk,
and the Flooded Scrap Yard. Each has one practical interaction and one
storytelling prop cluster; none gates the first bounty.

IMPLEMENTATION DEPENDENCY:
Map: pocket geometry; Content: interaction text; Art: prop clusters; Runtime:
optional state presentation; no shared-schema change.

## C. First-vehicle principles

### Finding V1 — vehicle as an early horizon, not an instant reward

OBSERVED:
The public Metal Max 2 vehicle list describes a light vehicle being reclaimed
through a repair-garage context, while the series premise centers vehicle
combat.

USEFUL PRINCIPLE:
Show the first vehicle before it is usable, then make recovery a concrete
labor milestone.

DO NOT COPY:
Do not copy the source vehicle's name, hiding place, recovery dialogue, or
garage puzzle.

WASTELAND HUNTER DECISION:
Iron Hound's first sighting is a rust-covered Rust Runner chassis under a
repair gantry. Liu Yan frames it as a possible livelihood, not a destiny.
The player first sees its turret mount and missing track before the repair
step.

IMPLEMENTATION DEPENDENCY:
Art: chassis, turret, damage state; Map: garage sightline; Runtime: staged
repair state; Content: Liu Yan scene; Contract: existing vehicle definition
only, no schema alteration.

### Finding V2 — ownership needs a repair cost and a test

OBSERVED:
Public summaries connect tanks with repair garages, customization, weight
limits, and areas where the party must leave the vehicle.

USEFUL PRINCIPLE:
The first vehicle should require a modest sacrifice, then immediately prove
its value in a safe, readable test.

DO NOT COPY:
Do not copy source-game currency values, weight formulas, test fights, or
vehicle statistics.

WASTELAND HUNTER DECISION:
Rust Runner ownership is a six-scrap repair commitment followed by a short
yard maneuver and one controlled cannon test against a marked practice target.
The test teaches movement, firing, parking, and dismounting without consuming
the Iron Hound bounty encounter.

IMPLEMENTATION DEPENDENCY:
Runtime: repair/test state; Map: practice lane; Art: damage-to-ready states;
Mobile: drive/fire/dismount controls; Contract: review only if a future
ownership field is formalized.

### Finding V3 — first customization should be visible and personal

OBSERVED:
Metal Max 2 public summaries emphasize player-created/customized tanks and
part-by-part enhancement.

USEFUL PRINCIPLE:
The first meaningful customization should change what the player sees and
feels, not only a hidden statistic.

DO NOT COPY:
Do not copy source part names, interface layout, stat tables, or canonical
vehicle silhouettes.

WASTELAND HUNTER DECISION:
The first choice is between a salvaged side storage rack and a reinforced
front plate. Both are compatible with the Rust Runner contract and produce a
visible layer change; the rack supports carrying scrap, while the plate
supports safer collision recovery.

IMPLEMENTATION DEPENDENCY:
Art: independent armor/storage layers; Runtime: part application and preview;
Contract: existing vehicle mount metadata must be reused; Mobile: garage
selection readability.

## D. Bounty principles

### Finding B1 — rumor before coordinates

OBSERVED:
The public Metal Saga summary describes informal quests, optional bounties,
and a journey where information is revealed through encounters and travel
rather than one linear mission menu.

USEFUL PRINCIPLE:
A bounty should begin as a local concern, gain credibility through multiple
clues, and reveal a search zone only after the player has a reason to care.

DO NOT COPY:
Do not copy any original bounty, monster identity, reward, rumor wording,
poster, or clue chain.

WASTELAND HUNTER DECISION:
Iron Hound begins with a Bar rumor about missing dock crews. The Guild records
only a rough threat class; the exact search zone appears after track evidence
and two independent testimonies.

IMPLEMENTATION DEPENDENCY:
Content: rumor/clue text; Map: clue locations; Runtime: objective progression;
Art: track and wreck evidence; Contract: no change.

### Finding B2 — clue density should support investigation, not stall it

OBSERVED:
Open-world, non-linear summaries support optional exploration, but the public
vehicle/bounty framing still relies on concrete places and recoverable rewards.

USEFUL PRINCIPLE:
Use a small number of redundant clues: enough for confidence, not enough to
turn a first bounty into a scavenger hunt.

DO NOT COPY:
Do not copy source quest counts, exact pacing, NPC archetypes, or location
names.

WASTELAND HUNTER DECISION:
Iron Hound uses four clue beats: rumor, three-track comparison, wreck evidence,
and NPC testimony. Any three completed beats reveal the search zone, while all
four grant a pre-boss pressure advantage.

IMPLEMENTATION DEPENDENCY:
Runtime: clue completion and reveal; Content: conditional testimony; Map:
evidence placements; Art: readable evidence; no engineering change to shared
contracts.

### Finding B3 — return payoff closes the social loop

OBSERVED:
Public summaries connect bounty hunting with town travel, salvage, currency,
and character-specific consequences.

USEFUL PRINCIPLE:
The reward should be more than loot: returning to the issuing town should
visibly acknowledge what changed.

DO NOT COPY:
Do not copy source reward tables, victory speeches, ending structures, or
character relationships.

WASTELAND HUNTER DECISION:
Returning to the Hunter Guild yields proof validation, 350 credits, eight
scrap, and one Hunter Rank. Bar patrons, the Clinic queue, and dock workers
change one short ambient line each; no faction allegiance is created.

IMPLEMENTATION DEPENDENCY:
Content: reaction lines; Runtime: bounty settlement and one-shot claim;
Contract: use existing registered progress fields only; Art: optional small
world-state props; Mobile: no special dependency.

## E. Explicit DO-NOT-COPY findings

- Do not reproduce any Metal Max or Metal Saga town, overworld, dungeon, boss
  arena, vehicle, sprite, dialogue, UI, quest text, map geometry, or reward
  table.
- Do not use screenshots, wiki images, extracted tiles, ROM data, or fan
  rips as runtime assets.
- Do not make Rustport a disguised version of a source settlement. Its
  coastal-industrial logic comes from Wasteland Hunter Canon and its own
  circulation rules.
- Do not make Iron Hound a renamed source bounty. Its evidence, arena,
  phases, weak point, proof, and town consequences are original.
- Do not force the player into any of the three major powers. The first
  bounty remains an independent hunter story.

## F. Rustport decision index

The complete concrete specification is in
[RUSTPORT_GRAMMAR_V1.md](/Users/hao/Wastlandproject/Wastlandhunter/docs/reference/RUSTPORT_GRAMMAR_V1.md).

## G. Iron Hound decision index

The complete original flow is in
[IRON_HOUND_BOUNTY_FLOW_V1.md](/Users/hao/Wastlandproject/Wastlandhunter/docs/reference/IRON_HOUND_BOUNTY_FLOW_V1.md).

## H. Implementation dependency summary

| Decision area | Contract | Runtime | Art | Mobile | Map | Owner |
|---|---|---|---|---|---|---|
| Rustport circulation and pockets | No | Route/camera integration | Signs, landmarks, props | Tap-target review | Primary owner | Map / Runtime / Art |
| Garage and first-vehicle staging | Existing vehicle contract review only | Repair, ownership, test | Modular Rust Runner layers | Drive/fire/dismount review | Garage and practice lane | Runtime / Art / Map |
| Iron Hound investigation | No new keys proposed | Clue state, reveal, encounter | Evidence, boss states, proof | Context action review | Evidence/search/boss spaces | Content / Runtime / Map / Art |
| Return-to-town reaction | Existing progress fields only | Settlement and one-shot guard | Ambient reaction props | No special work | Reaction locations | Content / Runtime / Art |

## I. Files created

- `docs/reference/SOURCE_INVENTORY_SPRINT1.md`
- `docs/reference/RUSTPORT_GRAMMAR_V1.md`
- `docs/reference/FIRST_VEHICLE_PROGRESSION_V1.md`
- `docs/reference/IRON_HOUND_BOUNTY_FLOW_V1.md`
- `data/reference_analysis/rustport_grammar_v1.json`
- `data/reference_analysis/iron_hound_flow_v1.json`

## J. Shared-contract proposals

No shared schema, SaveData, WorldState, asset manifest, or runtime contract was
modified. The only proposal is deferred: if Content later needs generic clue
or ownership fields, the Shared Contract owner should review them as a
separate migration. Sprint 1 can use existing Rustport compatibility fields
and existing vehicle metadata.

## K. BLOCKERS

1. Production-quality protagonist, Liu Yan, Rust Runner, and Iron Hound art
   remains an Art workstream dependency, as already recorded by the visual
   vertical-slice status.
2. The current runtime's focused Iron Hound interaction is not yet a full
   multi-phase combat implementation; this document intentionally proposes
   behavior only and does not implement it.
3. Any future generic clue/vehicle-ownership schema requires Shared Contract
   review before Runtime migration.

## L. READY_FOR_REVIEW

READY_FOR_REVIEW: Reference / Game Design deliverables are complete for Sprint
1 scope. They are original, Canon-compatible, owner-tagged, and contain no
Runtime, art, map, schema, or legacy modifications.
