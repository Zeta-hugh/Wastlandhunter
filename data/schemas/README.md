# Shared JSON Schemas

These schemas define the minimum shared contract for data consumed by Core and
QA. They are deliberately additive: existing domain-specific records may carry
extra fields until an owner approves a migration.

- `definition.schema.json` — common stable ID and schema envelope.
- `save-data.schema.json` — canonical serialized save envelope.
- `world-state.schema.json` — registry-backed WorldState shape.
- `asset-entry.schema.json` — canonical asset manifest entry.

The Python validators use the same required fields and registry rules without a
third-party JSON Schema dependency.
