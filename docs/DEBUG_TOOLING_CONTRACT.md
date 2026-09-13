# Development Debug Tooling Contract

Status: specification only; no debug UI or production command surface is
implemented.

All commands are development-only, require a debug build gate, report the
contract version, and must not implicitly save state. New arguments require
canonical IDs. A temporary legacy resolver may warn but must not rewrite data.

| Command | Input contract | Validation / output |
|---|---|---|
| `teleport` | `map_id`, finite `x`, finite `y` | map exists; report resolved map and position |
| `quest state` | `quest_id`, optional status/objective | quest exists; status is `AVAILABLE`, `ACTIVE`, `COMPLETED` or `LOCKED` |
| `world state` | registered key and typed value | key exists in registry; report old/new value; reject unknown key |
| `give item` | `item_id`, positive integer count | item exists; report resulting inventory delta |
| `give vehicle` | `vehicle_id` | vehicle exists; report instance ID and definition ID |
| `spawn enemy` | enemy ID and finite position | definition exists; report entity ID and position |
| `spawn boss` | boss ID and finite position | definition exists; report entity ID and position |
| `relationship` | NPC ID and bounded numeric value | NPC exists; report old/new relationship value |
| `collision` | entity ID | read-only collision footprint and broad-phase result |
| `pivot` | asset ID | read-only runtime size, pivot and ground contact |
| `mount point` | vehicle ID and mount name | read-only mount coordinates and compatibility |
| `FPS` | optional sample duration | read-only frame timing summary |

Forbidden behavior:

- silently accepting unknown IDs;
- mutating SaveData without an explicit save action;
- bypassing WorldState registration;
- changing collision, pivot or mount data from the debug command;
- shipping the command surface in the production runtime.
