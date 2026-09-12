# Rust Runner modular vehicle system

The fixed vehicle metadata lives at `data/vehicles/rust_runner.json`. The renderer must read its 128×128 canvas, `[64,96]` vehicle pivot, `[64,61]` turret pivot, mounts and collision box from that file.

The production vehicle is assembled from independent PNG files: eight chassis directions, aligned left/right track layers, sixteen turret directions, weapons, armor, storage, antenna, light, fuel and damage overlays. A chassis image must not contain a turret or weapon. A turret image must not contain a barrel. Damage images contain damage only.

`scripts/assets/validate_vehicle_mounts.py` validates metadata immediately and reports every missing independent component as `NEEDS_ART`. It must pass before the modular renderer or weapon-swap system can be accepted.
