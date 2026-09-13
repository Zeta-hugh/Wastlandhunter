# Contract Decision 001 — Rustport Sprint 1 Baseline

Date: 2026-09-13
Decision owner: Integration Lead
Contract proposal owner: Shared Contract / Save / QA Lead
Status: approved baseline for review; consumer migration not yet approved

## Decision table

| Proposal | Decision | Scope and reason |
|---|---|---|
| Use `schema_version: "1.0"` for definition/schema documents | APPROVED | Matches the current Shared Interfaces proposal and existing asset documents; no consumer rewrite is required for the baseline |
| Use `contract_version` separately from definition `schema_version` | APPROVED | Prevents contract-family versioning from being confused with content shape versioning |
| New IDs use lowercase dotted namespaces | APPROVED | Examples: `npc.liuyan`, `quest.rustport.first_tank`, `bounty.iron_hound`; existing bare IDs remain migration findings |
| Blindly rewrite all existing bare IDs now | REJECTED | Existing references have not been fully migrated and the validator explicitly audits without rewriting |
| Create `data/world_state_keys.json` as sole registry | APPROVED | Registry exists and preserves only nullable compatibility `faction`; deprecated Rustport keys remain rejected |
| Reintroduce `iron_hound_dead`, `rustport_next_region_unlocked`, or `rustport_bounty_claimed` as canonical keys | REJECTED | They are explicitly deprecated; migration must choose canonical registered facts later |
| Establish canonical SaveData `saveVersion: 24` above legacy 23 | APPROVED | Approved as the migration boundary and envelope design, not as proof that runtime adapters are migrated |
| Claim that current Runtime consumes canonical saveVersion 24 | REJECTED | Validator reports runtime adapters are not migrated |
| Use the new validators in audit mode as Sprint 1 gate | APPROVED | Current project audit passes with explicit warnings |
| Turn strict ID validation on immediately | DEFERRED | Requires a consumer migration plan and fixtures |
| Allow Shared Contract files to be consumed before review | DEFERRED | Files are currently untracked; review and integration packaging are still required |

## Approved baseline files

- `data/schemas/`
- `data/world_state_keys.json`
- `docs/SHARED_INTERFACES.md`
- `docs/CHANGELOG_SHARED_INTERFACES.md`
- `game/core/save/`
- `game/core/debug/DEBUG_TOOLING.md`
- `scripts/validation/`
- `tests/shared-contract.test.mjs`

## Explicit non-decisions

This document does not approve:

- Runtime ID migration;
- Runtime SaveData migration;
- adding new Rustport WorldState keys;
- changes to the asset manifest structure;
- Mobile renderer refactors;
- new towns or expanded content;
- changes to the preserved legacy prototype.

