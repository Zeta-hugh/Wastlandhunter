# Rustport Sprint 1 — Integration Dependency Graph

Date: 2026-09-13

## Dependency graph

```text
Shared Contract / Save / QA
  ├─> canonical schemas, IDs, WorldState registry
  ├─> SaveData/saveVersion migration plan
  ├─> project validators
  │
  ├─> Runtime migration checklist
  │     └─> Runtime Lead consumer migration
  │             └─> route/data/integration tests
  │
  └─> Mobile consumer contract requirements
          └─> 2.5D Mobile Platform technical integration

Production Art
  ├─> manifest and AssetRegistry records
  ├─> source/runtime QA pairs
  └─> scene/map reference validation
          └─> renderer asset loading and visual review

Reference / Game Design
  ├─> observed design grammar
  ├─> Rustport recommendations
  └─> Iron Hound loop proposal
          └─> Integration review
                  └─> Contract/Runtime implementation proposals

Mobile + Runtime + Art
  └─> Rustport vertical-slice integration
          └─> serial validation and runtime screenshots
```

## Gate order

1. Integration accepts the Shared Contract baseline or records explicit
   `DEFERRED` decisions.
2. Shared Contract publishes the exact Runtime migration checklist.
3. Runtime migrates only the listed consumers.
4. Mobile reports file overlaps and validates isolated spatial behavior.
5. Art validates each real asset batch and its references.
6. Reference proposals are reviewed for Canon and scope fit.
7. Integration runs serial validation and visual runtime checks.

## Non-dependencies

- Reference research must not directly modify Runtime or schemas.
- Art QA must not depend on invented WorldState keys.
- Mobile technical tests must not require production art to exist.
- Runtime migration must not depend on the legacy prototype being edited.

