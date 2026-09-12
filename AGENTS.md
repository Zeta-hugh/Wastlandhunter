# Wasteland Hunter engineering

Read `docs/CODEX_INSTRUCTIONS.md` first, then all handoff documents. This is an existing project; preserve its Canon and design history. User instructions take precedence, followed by the handoff Canon/design documents, current source, then legacy implementation reference.

- Canonical repository: `Zeta-hugh/Wastlandhunter`.
- Keep `legacy/WastelandHunter_CanonBuild_0.23.0_single.html` unchanged.
- Prioritize the Rustport visual vertical slice before content expansion.
- No forced faction membership, faction locks or three-faction endings.
- Keep changes narrow and state assumptions. Do not refactor adjacent systems speculatively.
- `game/sources.json` controls assembly order. Historical function hoisting and overrides currently depend on one classic-script scope; do not split this into independent script tags or ES modules without behavioral validation.
- Run `npm test` and `npm run test:browser` for migration/runtime changes. Visual milestones require actual runtime screenshots.
- The exact reconstruction test is a migration-baseline guard. When intentional gameplay or visual changes begin, replace its relevant equality assertion with focused regression coverage; retain original legacy/asset integrity checks. Never change the preserved prototype to make the test pass.
- Read `docs/ENGINEERING_MIGRATION.md` before save-schema changes.
