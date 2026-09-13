# Rustport Sprint 1 — Conflict Inventory

Date: 2026-09-13

## 1. Active conflicts

| ID | Conflict | Evidence | Owner | Decision |
|---|---|---|---|---|
| C-001 | Shared-contract baseline is tracked but not yet consumer-integrated | `git status`; `data/schemas/`, `docs/SHARED_INTERFACES.md`, `scripts/validation/` | Shared Contract / Save / QA + Integration | Tracking blocker resolved; consumer review remains |
| C-002 | Existing data uses 11 legacy bare IDs while the proposed contract uses dotted namespace IDs | `scripts/validation/validate_ids.py`; `qa/reports/shared_contract_validation.json` | Shared Contract / Save / QA | Migration deferred; no blind rewrite |
| C-003 | Canonical save version 24 is proposed while legacy compatibility ends at 23 and runtime adapters are not migrated | `docs/SHARED_INTERFACES.md`; `scripts/validation/validate_save.py`; validation warning | Shared Contract / Save / QA + Runtime | Contract baseline approved for planning; consumer migration blocked |
| C-004 | WorldState registry contains only compatibility `faction`; three Rustport keys are deprecated | `data/world_state_keys.json`; route/runtime reports | Shared Contract / Save / QA | Deprecated keys cannot be reintroduced; Rustport consumers need a later migration |
| C-005 | Old Art intake report says zero assets, while current P0 report says 11 `QA_PASS` pairs | `qa/assets/r1_art_intake_report.md`; `qa/reports/rustport_p0_batch_01.json`; `CURRENT_STATUS.md` | Production Art + Integration | P0 report supersedes old intake report; do not treat historical text as current |
| C-006 | Mobile and Reference Sprint 1 reports are present, pending review | `qa/reports/2_5d_spatial_test.md`; `docs/reference/SOURCE_INVENTORY_SPRINT1.md` | Mobile / Reference Leads | Missing-report blocker resolved; integration review remains |
| C-007 | `dist/` and `dist-next/` are shared generated outputs; `build-next` deletes `dist-next` | `scripts/build-next.mjs`; `scripts/build.mjs`; browser/next tests | Integration | Build-dependent jobs must run serially |
| C-008 | Proposed ownership includes `config/android/`, but the directory is missing while `android/` exists | Repository directory audit | Mobile / Integration | Mobile must map actual paths before editing |

## 2. Ownership violations or ambiguity

- No evidence in this audit proves a committed cross-workstream violation.
- The takeover audit found a clean worktree with Shared Contract files tracked;
  this does not itself establish consumer integration acceptance.
- `game/app/core/renderer.js`, `input.js`, `camera.js` and `movement.js` are
  potential Runtime/Mobile overlap points. Mobile must not edit them without a
  file-level agreement.

## 3. Build race risk

`scripts/build-next.mjs` recursively removes `dist-next/`, while `scripts/build.mjs`
writes `dist/`. Browser and next tests invoke build paths. Run these commands
serially and never from two workstreams at once.

