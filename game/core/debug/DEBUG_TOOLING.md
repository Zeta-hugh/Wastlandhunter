# Development Debug Tooling Specification

Development-only commands must be gated out of production builds and must
never mutate a save implicitly. Each command reports its result and the
current contract version.

| Command | Required input | Guard |
|---|---|---|
| `teleport` | map ID, x, y | map exists; position is finite |
| `quest state` | canonical quest ID, status/objective | quest is registered; status is allowed |
| `world state` | canonical key, value | key exists in `data/world_state_keys.json`; value matches type |
| `give item` | canonical item ID, count | item is registered; count is positive integer |
| `give vehicle` | canonical vehicle ID | vehicle is registered; no duplicate instance ID |
| `spawn enemy` | canonical enemy ID, position | enemy definition exists; position is finite |
| `spawn boss` | canonical boss ID, position | boss definition exists; position is finite |
| `relationship` | canonical NPC ID, value | NPC exists; value is finite and bounded by relationship contract |
| `collision` | entity ID | prints collision footprint and broad-phase result; no mutation |
| `pivot` | asset ID | asset exists; prints runtime size and pivot; no mutation |
| `mount point` | vehicle ID, mount name | vehicle and mount exist; prints coordinates; no mutation |
| `FPS` | optional sample duration | reports frame timing; no gameplay state mutation |

Canonical IDs are required for new debug commands. A temporary compatibility
resolver may accept an audited legacy ID, but must print a migration warning and
must not rewrite stored data.
