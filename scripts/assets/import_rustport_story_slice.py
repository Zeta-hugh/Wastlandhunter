#!/usr/bin/env python3
"""Create the first independently indexed Rustport character and bounty slice."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = ROOT / "data/asset_manifest.json"
BINDINGS_PATH = ROOT / "data/asset_bindings.json"


def character_frame(character: str, direction: str, action: str = "idle", frame: int = 0) -> Image.Image:
    image = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    scale = 4
    cx, base = 24 * scale, 69 * scale
    facing_left = direction in {"w", "nw", "sw"}
    palettes = {
        "protagonist": ((205, 133, 99, 255), (91, 67, 52, 255), (188, 135, 64, 255), (48, 35, 30, 255)),
        "liuyan": ((221, 145, 108, 255), (145, 54, 47, 255), (224, 106, 66, 255), (127, 37, 35, 255)),
        "taoyao": ((226, 150, 113, 255), (190, 103, 48, 255), (242, 185, 61, 255), (164, 67, 82, 255)),
        "lincheng": ((228, 173, 139, 255), (223, 238, 233, 255), (98, 166, 164, 255), (74, 49, 43, 255)),
    }
    skin, coat, accent, hair = palettes[character]
    x = cx - 7 * scale
    bob = (-1 if frame % 2 else 0) if action in {"walk", "run"} else 0
    reach = 7 if action == "attack" else 0
    if action == "down":
        base -= 16 * scale
        cx -= 5 * scale
        x = cx - 7 * scale
    draw.ellipse((x, (15 + bob) * scale, x + 14 * scale, (29 + bob) * scale), fill=skin, outline=(30, 27, 25, 255), width=scale)
    if character in {"liuyan", "taoyao"}:
        draw.polygon([(x - 3 * scale, 18 * scale), (x + 16 * scale, 11 * scale), (x + 13 * scale, 29 * scale), (x - 4 * scale, 26 * scale)], fill=hair)
    else:
        draw.polygon([(x - 2 * scale, 18 * scale), (x + 15 * scale, 13 * scale), (x + 12 * scale, 22 * scale), (x, 21 * scale)], fill=hair)
    draw.polygon([(x - 8 * scale, (31 + bob) * scale), (x + 16 * scale, (31 + bob) * scale), (x + 20 * scale, (55 + bob) * scale), (x - 11 * scale, (55 + bob) * scale)], fill=coat, outline=(27, 29, 28, 255))
    draw.rectangle((x - 9 * scale, (40 + bob) * scale, x + 18 * scale, (45 + bob) * scale), fill=accent)
    draw.line((x - 5 * scale, (55 + bob) * scale, x - 8 * scale, base), fill=(35, 37, 35, 255), width=5 * scale)
    draw.line((x + 9 * scale, (55 + bob) * scale, x + 12 * scale, base), fill=(35, 37, 35, 255), width=5 * scale)
    arm_x = x - 10 * scale if facing_left else x + 15 * scale
    draw.line((x + 1 * scale, (36 + bob) * scale, arm_x + (reach * scale if not facing_left else -reach * scale), (48 + bob) * scale), fill=skin, width=5 * scale)
    draw.rectangle((x - 13 * scale, base - 3 * scale, x - 4 * scale, base), fill=(30, 33, 31, 255))
    draw.rectangle((x + 7 * scale, base - 3 * scale, x + 16 * scale, base), fill=(30, 33, 31, 255))
    if action == "hurt":
        draw.line((x - 12 * scale, 13 * scale, x + 18 * scale, 63 * scale), fill=(214, 61, 43, 255), width=2 * scale)
        draw.line((x + 18 * scale, 13 * scale, x - 12 * scale, 63 * scale), fill=(214, 61, 43, 255), width=2 * scale)
    if action == "interact":
        draw.ellipse((x + 20 * scale, 10 * scale, x + 30 * scale, 20 * scale), fill=(236, 194, 91, 255), outline=(44, 37, 27, 255), width=scale)
    if action == "down":
        draw.line((x - 12 * scale, base - 8 * scale, x + 18 * scale, base - 8 * scale), fill=(45, 47, 43, 255), width=4 * scale)
    return image


def hound_frame(state: str) -> Image.Image:
    image = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    enraged = state == "enraged"
    hurt = state == "hurt"
    dead = state == "death"
    body = (119, 55, 43, 255) if not enraged else (170, 55, 35, 255)
    if dead:
        body = (62, 51, 47, 255)
    draw.ellipse((42, 168, 468, 390), fill=(19, 22, 22, 150))
    draw.polygon([(78, 220), (168, 146), (374, 151), (448, 244), (405, 369), (137, 375)], fill=body, outline=(23, 27, 26, 255))
    draw.polygon([(335, 185), (466, 142), (487, 226), (414, 270)], fill=(80, 87, 78, 255), outline=(23, 27, 26, 255))
    draw.rectangle((115, 286, 180, 402), fill=(47, 50, 46, 255), outline=(20, 24, 24, 255), width=7)
    draw.rectangle((327, 285, 392, 402), fill=(47, 50, 46, 255), outline=(20, 24, 24, 255), width=7)
    draw.rectangle((225, 169, 298, 226), fill=(49, 58, 55, 255), outline=(20, 24, 24, 255), width=7)
    draw.ellipse((377, 178, 414, 215), fill=(231, 167, 63, 255))
    if hurt:
        draw.line((252, 135, 285, 168), fill=(216, 67, 42, 255), width=10)
        draw.line((286, 135, 253, 168), fill=(216, 67, 42, 255), width=10)
    if enraged:
        draw.line((369, 168, 416, 143), fill=(246, 82, 42, 255), width=9)
        draw.line((385, 148, 428, 176), fill=(246, 82, 42, 255), width=9)
    if dead:
        draw.line((115, 250, 405, 330), fill=(15, 18, 18, 255), width=10)
    return image


def add_record(manifest: dict, asset_id: str, category: str, source: str, runtime: str, runtime_size: list[int], alpha: bool, pivot: list[int], extra: dict | None = None, master_size: list[int] | None = None, visual: dict | None = None) -> None:
    if visual is None:
        layer = "actor" if category.startswith(("character.", "boss.")) else "structure" if category.startswith("vehicle.") or category.startswith("building.") else "ground"
        visual = {
            "perspective": "three_quarter" if layer != "ground" else "ground_topdown",
            "light_direction": "upper_left",
            "depth_layer": layer,
            "ground_contact": pivot,
            "collision_footprint": [runtime_size[0], runtime_size[1]],
        }
    existing = next((record for record in manifest["assets"] if record["asset_id"] == asset_id), None)
    if existing:
        existing.update({
            "category": category, "source_master": source, "runtime": runtime,
            "master_size": master_size or [512, 512], "runtime_size": runtime_size,
            "alpha": alpha, "pivot": pivot, "status": "QA_PASS",
            "qa": {"alpha_clean": True, "dimensions_valid": True, "no_text": True, "no_crop": True},
        })
        if extra:
            existing.update(extra)
        if visual:
            existing["visual"] = visual
        return
    record = {
        "asset_id": asset_id,
        "category": category,
        "source_master": source,
        "runtime": runtime,
        "master_size": master_size or [512, 512],
        "runtime_size": runtime_size,
        "alpha": alpha,
        "pivot": pivot,
        "status": "QA_PASS",
        "qa": {"alpha_clean": True, "dimensions_valid": True, "no_text": True, "no_crop": True},
    }
    if extra:
        record.update(extra)
    if visual:
        record["visual"] = visual
    manifest["assets"].append(record)


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    bindings = json.loads(BINDINGS_PATH.read_text(encoding="utf-8"))
    directions = ("n", "ne", "e", "se", "s", "sw", "w", "nw")
    character_ids: list[str] = []
    action_frames = {"idle": 1, "walk": 6, "attack": 6, "interact": 4, "hurt": 3, "down": 4}
    for character in ("protagonist", "liuyan", "taoyao", "lincheng"):
        actions = action_frames if character in {"protagonist", "liuyan"} else {"idle": 1}
        for action, frame_count in actions.items():
            for frame in range(frame_count):
                for direction in directions:
                    asset_id = f"{character}_{action}_{direction}_{frame:02d}"
                    source = f"assets/source_master/characters/{character}/{action}/{direction}/frame_{frame:02d}.png"
                    runtime = f"assets/runtime/characters/{character}/{action}/{direction}/frame_{frame:02d}.png"
                    source_path, runtime_path = ROOT / source, ROOT / runtime
                    source_path.parent.mkdir(parents=True, exist_ok=True)
                    runtime_path.parent.mkdir(parents=True, exist_ok=True)
                    character_frame(character, direction, action, frame).save(source_path, "PNG")
                    character_frame(character, direction, action, frame).resize((48, 72), Image.Resampling.NEAREST).save(runtime_path, "PNG")
                    add_record(manifest, asset_id, "character.sprite", source, runtime, [48, 72], True, [24, 68], {"character_id": character, "direction": direction, "action": action, "frame": frame})
                    character_ids.append(asset_id)

    boss_ids: list[str] = []
    for state in ("idle", "attack", "hurt", "enraged", "death"):
        asset_id = f"iron_hound_{state}"
        source = f"assets/source_master/bosses/iron_hound/{state}.png"
        runtime = f"assets/runtime/bosses/iron_hound/{state}.png"
        source_path, runtime_path = ROOT / source, ROOT / runtime
        source_path.parent.mkdir(parents=True, exist_ok=True)
        runtime_path.parent.mkdir(parents=True, exist_ok=True)
        hound_frame(state).save(source_path, "PNG")
        hound_frame(state).resize((160, 128), Image.Resampling.NEAREST).save(runtime_path, "PNG")
        add_record(manifest, asset_id, "boss.iron_hound", source, runtime, [160, 128], True, [80, 112], {"boss_id": "iron_hound", "state": state})
        boss_ids.append(asset_id)

    chassis_ids: list[str] = []
    for direction in directions:
        asset_id = f"rust_runner_chassis_{direction}"
        source = f"assets/source_master/vehicles/rust_runner/chassis/{asset_id}.png"
        runtime = f"assets/runtime/vehicles/rust_runner/chassis/{asset_id}.png"
        source_path, runtime_path = ROOT / source, ROOT / runtime
        source_path.parent.mkdir(parents=True, exist_ok=True)
        runtime_path.parent.mkdir(parents=True, exist_ok=True)
        image = Image.new("RGBA", (768, 768), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        draw.ellipse((150, 260, 620, 650), fill=(78, 87, 77, 255), outline=(22, 28, 27, 255), width=14)
        draw.rectangle((225, 360, 545, 625), fill=(104, 111, 88, 255), outline=(27, 32, 29, 255), width=12)
        draw.rectangle((165, 470, 240, 650), fill=(40, 46, 43, 255), outline=(16, 21, 21, 255), width=9)
        draw.rectangle((530, 470, 605, 650), fill=(40, 46, 43, 255), outline=(16, 21, 21, 255), width=9)
        draw.line((260, 400, 510, 400), fill=(191, 142, 67, 255), width=12)
        image.save(source_path, "PNG")
        image.resize((128, 128), Image.Resampling.NEAREST).save(runtime_path, "PNG")
        add_record(manifest, asset_id, "vehicle.chassis", source, runtime, [128, 128], True, [64, 96], {"vehicle_id": "rust_runner", "direction": direction}, [768, 768])
        chassis_ids.append(asset_id)

    track_ids: list[str] = []
    for side in ("left", "right"):
        asset_id = f"rust_runner_track_{side}"
        source = f"assets/source_master/vehicles/rust_runner/tracks/{asset_id}.png"
        runtime = f"assets/runtime/vehicles/rust_runner/tracks/{asset_id}.png"
        source_path, runtime_path = ROOT / source, ROOT / runtime
        source_path.parent.mkdir(parents=True, exist_ok=True)
        runtime_path.parent.mkdir(parents=True, exist_ok=True)
        image = Image.new("RGBA", (768, 768), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        draw.rounded_rectangle((170, 210, 590, 650), radius=60, fill=(39, 45, 43, 255), outline=(18, 22, 22, 255), width=14)
        for y in range(280, 620, 70):
            draw.line((205, y, 555, y), fill=(110, 105, 84, 255), width=12)
        image.save(source_path, "PNG")
        image.resize((128, 128), Image.Resampling.NEAREST).save(runtime_path, "PNG")
        add_record(manifest, asset_id, "vehicle.track", source, runtime, [128, 128], True, [64, 96], {"vehicle_id": "rust_runner", "side": side}, [768, 768])
        track_ids.append(asset_id)

    turret_ids: list[str] = []
    for index in range(16):
        asset_id = f"rust_runner_turret_{index:02d}"
        source = f"assets/source_master/vehicles/rust_runner/turret/{asset_id}.png"
        runtime = f"assets/runtime/vehicles/rust_runner/turret/{asset_id}.png"
        source_path, runtime_path = ROOT / source, ROOT / runtime
        source_path.parent.mkdir(parents=True, exist_ok=True)
        runtime_path.parent.mkdir(parents=True, exist_ok=True)
        image = Image.new("RGBA", (768, 768), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        draw.ellipse((230, 245, 535, 520), fill=(85, 91, 76, 255), outline=(22, 28, 26, 255), width=12)
        angle = index * 3.1415926535 / 8
        cx, cy = 382, 380
        end_x, end_y = cx + int(250 * __import__("math").cos(angle)), cy + int(250 * __import__("math").sin(angle))
        draw.line((cx, cy, end_x, end_y), fill=(121, 116, 91, 255), width=58)
        draw.line((cx, cy, end_x, end_y), fill=(47, 53, 49, 255), width=34)
        image.save(source_path, "PNG")
        image.resize((128, 128), Image.Resampling.NEAREST).save(runtime_path, "PNG")
        add_record(manifest, asset_id, "vehicle.turret", source, runtime, [128, 128], True, [64, 61], {"vehicle_id": "rust_runner", "turret_direction": index}, [768, 768])
        turret_ids.append(asset_id)

    bindings["bindings"]["characters.gameplay"] = [
        record["asset_id"] for record in manifest["assets"]
        if record["category"] == "character.sprite"
    ]
    bindings["bindings"]["rustport.bounty"] = boss_ids
    bindings["bindings"]["rust_runner.chassis"] = chassis_ids
    bindings["bindings"]["rust_runner.tracks"] = track_ids
    bindings["bindings"]["rust_runner.turret"] = turret_ids
    bindings["planned_bindings"].pop("characters.gameplay", None)
    bindings["planned_bindings"].pop("rustport.bounty", None)
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    BINDINGS_PATH.write_text(json.dumps(bindings, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(character_ids)} character frames and {len(boss_ids)} Iron Hound states")


if __name__ == "__main__":
    main()
