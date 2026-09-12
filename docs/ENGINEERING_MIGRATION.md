# Engineering migration baseline — 2026-09-12

## Provenance

The canonical Git repository `Zeta-hugh/Wastlandhunter` was cloned into the workspace and was empty, with no commits. The original six `docs/` documents and legacy HTML were copied unchanged from `WastelandHunter_Project_Handoff_2026-09-12.zip`. The original handoff README is preserved as `docs/HANDOFF_README.md`; the repository README documents development usage.

Legacy HTML SHA-256: `4f09c32813dab16f79ab7a6b2dc06ad2768c10538dc6dc9b3326d0667278b65a`.

## Scope

Separated the stylesheet, 16 embedded images, initial story/Canon/equipment data, base state, parts calculations, tank statistics and base save functions. The remaining historical implementation is in `game/core/prototype-runtime.js`. Story wording, balance, original art pixels and save keys remain unchanged. One inherited renderer crash was fixed as described below.

The ordered build joins source fragments into one classic script. This preserves declaration hoisting and successive historical overrides. Extracted base functions are still extended by the remaining runtime; they are not yet independent systems. The largest remaining work is replacing those overrides with explicit system ownership and a deliberate startup sequence. Simply converting the current fragments to ES modules would not preserve their semantics.

## Confirmed renderer fix

The untouched prototype crashes on Rustport rendering: `v8BuildingPalette` defines only the five original service buildings, but later layouts include `inn`, `house` and `warehouse`. Accessing their missing palette stops the animation loop. Browser regression checks reproduce this on the preserved HTML before checking the migrated build. The migrated source adds exactly those three palette entries, using existing muted building colors; this is a runtime repair, not a production-art upgrade. The reconstruction test allows only this explicit source difference.

## Save compatibility boundary

- Primary localStorage key: `wastelandHunterV8`.
- Fallback key: `wastelandHunterV7`.
- Canon initially declares saveVersion 23, but later historical normalizers overwrite it, ending at 22. This migration preserves that behavior.
- The page title still says milestone 0.22. It is inherited metadata, not the authoritative project version.
- Browser localStorage is scoped to origin. Existing saves from another URL, port or file origin do not automatically appear on the new development origin. A player-facing import/export or explicit transfer workflow remains to be implemented before relying on migration for real player saves.
- Browser tests exercise current saves under both existing keys. They do not prove compatibility with every historical save shape; no real historical player-save fixtures were supplied.

## Validation and visual review

`npm test` verifies that replacing extracted assets with their original data URLs reconstructs the entire original JavaScript, stylesheet and HTML exactly after reversing the explicitly checked three-entry palette repair, and checks the legacy and image hashes. The build parses the assembled script before writing it.

`npm run test:browser` checks a fresh no-tank origin, keyboard movement, save/reload persistence, the V7 key fallback, image loading, and a combat action. It captures origin, Rustport, world map, tavern, Liu Yan dialogue, garage and Iron Hound. Scene setup for the six review captures is automated QA setup, not proof that the full chapter was played end to end.

Six curated runtime images are tracked in `docs/screenshots/` and displayed in the repository README. The full seven-capture QA output remains under the ignored `artifacts/baseline/` directory.

Screenshots document the prototype visual baseline and its shortcomings. They do not establish visual acceptance. The handoff's visual assessment remains the governing assessment.

## Next narrow implementation objective

Trace the Rustport path from origin through hunter registration, first vehicle repair/trial, Iron Hound and bounty turn-in. Establish focused route tests and explicit state ownership before replacing its renderer. Produce the vertical slice against `ART_DIRECTION_CN.md` and `ROADMAP_CN.md`; preserve useful authored dialogue and consequences. New production assets should use descriptive character/vehicle/environment names rather than the numbered legacy inventory.

Android packaging, APK builds, complete chapter playthrough, visual upgrades and full ES-module migration are not completed by this baseline.
