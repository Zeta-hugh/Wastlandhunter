# Wasteland Hunter — Codex Production Asset Contract
## Git 工程素材生产、命名、尺寸、目录、元数据、调用与验收规范
### 版本：1.0
### 适用仓库：`Zeta-hugh/Wastlandhunter`

> **用途**
> 将本文件直接交给 Codex，作为《荒原猎手 / Wasteland Hunter》素材工程的唯一生产与调用契约。
> 目标不是让 Codex“理解大概意思”，而是让它在后续创建、导入、索引、调用、组装、验证游戏素材时**没有歧义**。
>
> **最高原则**
> 1. 正式游戏素材必须是独立文件，不允许使用宣传图、Asset Sheet、Contact Sheet、截图裁片作为 runtime 资产。
> 2. 所有 runtime 资产必须能通过 manifest / JSON 被代码精确定位。
> 3. 所有文件命名、尺寸、pivot、mount point、透明度、方向、帧序必须遵守本契约。
> 4. 不允许 Codex 自行更改目录、命名或尺寸规范。
> 5. 缺失素材只能标记 `PLANNED` / `NEEDS_ART`，不得用粗糙 placeholder 冒充正式完成。
> 6. 任何正式资源在进入 `release/` 前必须通过 QA。

---

# 1. Codex 启动 Prompt

将以下内容作为 Codex 第一次进入仓库时的执行指令：

```text
你正在接手 Wasteland Hunter 的真实 Git 工程。

仓库：
Zeta-hugh/Wastlandhunter

请把仓库根目录中的：
docs/WastelandHunter_Codex_Production_Asset_Contract_CN.md

视为素材系统最高优先级规范。

执行前必须完整阅读该文件。

严格规则：

1. 不允许自行更改正式目录结构。
2. 不允许修改正式 asset_id。
3. 不允许把宣传图、截图、概念图裁切后当 runtime asset。
4. 不允许为了让游戏“先跑起来”而把不合格 placeholder 标成 COMPLETE。
5. 不允许把多素材大板图当成正式资源。
6. 所有 runtime 图片都必须由 asset manifest 索引。
7. 所有 vehicle / weapon / building / tile 的 pivot、mount、方向、尺寸都必须从 metadata 读取，不能在代码中硬编码。
8. 所有路径必须使用 repo-relative POSIX path。
9. 不允许在 Windows/macOS 路径分隔符之间产生不一致。
10. 缺失文件必须明确报错，不允许静默 fallback 到错误素材。
11. 每次改动 asset system 后运行 assets QA。
12. 不通过 QA 的素材不得进入 release。
13. 如果当前仓库内容与本文件冲突，以本文件为准，除非用户明确要求修改规范。

你的任务不是重新设计游戏美术方向，而是建立稳定、可维护、可扩展的 production asset pipeline。
```

---

# 2. 仓库固定目录结构

Codex 必须维护以下目录。

```text
Wastlandhunter/
├── assets/
│   ├── source_master/
│   │   ├── tiles/
│   │   │   ├── ground/
│   │   │   ├── roads/
│   │   │   └── terrain_transitions/
│   │   ├── buildings/
│   │   │   ├── walls/
│   │   │   ├── pillars/
│   │   │   ├── doors/
│   │   │   ├── windows/
│   │   │   ├── roofs/
│   │   │   ├── awnings/
│   │   │   ├── stairs/
│   │   │   ├── platforms/
│   │   │   ├── railings/
│   │   │   ├── pipes/
│   │   │   └── cables/
│   │   ├── props/
│   │   │   ├── industrial/
│   │   │   └── small/
│   │   ├── vegetation/
│   │   ├── decals/
│   │   ├── characters/
│   │   ├── portraits/
│   │   ├── vehicles/
│   │   │   └── rust_runner/
│   │   │       ├── chassis/
│   │   │       ├── tracks/
│   │   │       ├── turret/
│   │   │       ├── armor/
│   │   │       ├── storage/
│   │   │       ├── antenna/
│   │   │       ├── lights/
│   │   │       ├── fuel/
│   │   │       └── damage_overlays/
│   │   ├── weapons/
│   │   │   ├── main/
│   │   │   ├── sub/
│   │   │   └── se/
│   │   ├── enemies/
│   │   ├── bosses/
│   │   ├── effects/
│   │   ├── ui/
│   │   └── icons/
│   │
│   └── runtime/
│       ├── tiles/
│       │   ├── ground/
│       │   ├── roads/
│       │   └── terrain_transitions/
│       ├── buildings/
│       │   ├── walls/
│       │   ├── pillars/
│       │   ├── doors/
│       │   ├── windows/
│       │   ├── roofs/
│       │   ├── awnings/
│       │   ├── stairs/
│       │   ├── platforms/
│       │   ├── railings/
│       │   ├── pipes/
│       │   └── cables/
│       ├── props/
│       │   ├── industrial/
│       │   └── small/
│       ├── vegetation/
│       ├── decals/
│       ├── characters/
│       ├── portraits/
│       ├── vehicles/
│       │   └── rust_runner/
│       │       ├── chassis/
│       │       ├── tracks/
│       │       ├── turret/
│       │       ├── armor/
│       │       ├── storage/
│       │       ├── antenna/
│       │       ├── lights/
│       │       ├── fuel/
│       │       └── damage_overlays/
│       ├── weapons/
│       │   ├── main/
│       │   ├── sub/
│       │   └── se/
│       ├── enemies/
│       ├── bosses/
│       ├── effects/
│       ├── ui/
│       └── icons/
│
├── data/
│   ├── asset_manifest.json
│   ├── tiles/
│   ├── buildings/
│   ├── props/
│   ├── vegetation/
│   ├── characters/
│   ├── vehicles/
│   ├── weapons/
│   ├── enemies/
│   ├── bosses/
│   ├── ui/
│   └── maps/
│
├── maps/
│   ├── rustport/
│   ├── saltwind/
│   ├── neon_well/
│   └── ...
│
├── qa/
│   ├── reports/
│   ├── seam_tests/
│   ├── tile_connection_tests/
│   ├── building_assembly/
│   ├── vehicle_consistency/
│   ├── vehicle_mounts/
│   └── runtime_previews/
│
├── scripts/
│   └── assets/
│       ├── validate_assets.py
│       ├── build_runtime_assets.py
│       ├── validate_manifest.py
│       ├── validate_maps.py
│       ├── validate_vehicle_mounts.py
│       └── build_release_manifest.py
│
├── docs/
│   ├── WastelandHunter_Codex_Production_Asset_Contract_CN.md
│   ├── ART_DIRECTION.md
│   ├── ASSET_INDEX.md
│   ├── TILE_SYSTEM.md
│   ├── VEHICLE_MODULAR_SYSTEM.md
│   ├── MAP_PIPELINE.md
│   └── IMPORT_GUIDE.md
│
└── release/
    └── assets/
```

---

# 3. 通用文件规则

## 3.1 文件名

仅允许：

```text
a-z
0-9
_
-
.
```

禁止：

```text
空格
中文文件名
大写字母
括号
特殊符号
```

示例：

```text
ground_dirt_clean_01.png
wall_corrugated_rust_01.png
rust_runner_chassis_ne.png
cannon_75mm.png
iron_hound_idle_s_00.png
```

---

## 3.2 图像格式

正式 runtime：

```text
PNG
RGBA 8-bit（需要透明背景）
RGB 8-bit（不透明 tile）
sRGB
禁止 JPEG
禁止 WebP 作为 source of truth
```

Source master：

```text
PNG
最低 512 px
保留 alpha
禁止有损压缩
```

---

## 3.3 Pixel filtering

游戏 runtime：

```text
texture filtering = nearest
mipmap = off（2D像素素材）
pixel snap = on
```

禁止 bilinear 造成像素模糊。

---

# 4. 坐标与 Pivot 契约

所有 runtime 坐标：

```text
origin = top-left
x → right
y → down
```

Pivot 格式：

```json
"pivot": [x, y]
```

单位：

```text
runtime pixel
```

例如：

```json
"runtime_size": [128, 128],
"pivot": [64, 96]
```

代表对象放置时 `(64,96)` 是脚底/接地点。

---

# 5. 地形 Tile System

## 5.1 基础 Tile

固定：

```text
runtime = 32×32 px
source_master = 512×512 px
```

正式 ground asset：

| asset_id | runtime |
|---|---:|
| ground_dirt_clean_01 | 32×32 |
| ground_dirt_clean_02 | 32×32 |
| ground_dirt_clean_03 | 32×32 |
| ground_dirt_cracked_01 | 32×32 |
| ground_dirt_cracked_02 | 32×32 |
| ground_dirt_gravel_01 | 32×32 |
| ground_dirt_gravel_02 | 32×32 |
| ground_dirt_oily_01 | 32×32 |

路径：

```text
assets/runtime/tiles/ground/<asset_id>.png
```

Pivot：

```text
[16,16]
```

所有 tile 必须通过：

```text
4×4 seam test
```

---

# 6. Roads

基础 runtime：

```text
32×32
```

Source：

```text
512×512
```

资产：

```text
road_asphalt_clean
road_asphalt_cracked
road_asphalt_heavy_damage
road_center_marking
road_edge_dirt
road_edge_rubble
concrete_clean
concrete_cracked
concrete_oily
metal_floor_plate
metal_floor_rusted
metal_grate
```

连接变体：

```text
straight_ns
straight_ew
corner_ne
corner_nw
corner_se
corner_sw
t_n
t_e
t_s
t_w
cross
```

Codex 不允许把连接关系写死在渲染代码。

必须通过：

```json
"connection_type": "road_4way"
```

由 tile metadata 决定。

---

# 7. Terrain transitions

Source：

```text
512×512
```

Runtime：

```text
32×32
```

基础：

```text
dirt_to_road_edge
dirt_to_concrete_edge
dirt_to_rubble_edge
dirt_to_water_edge
sand_to_dirt
rock_to_dirt
grass_sparse_to_dirt
```

透明 overlay：

```text
oil_stain_overlay
mud_overlay
small_rubble_overlay
```

Overlay runtime：

```text
32×32 RGBA
```

---

# 8. Building Kit

建筑采用：

```text
3/4 top-down
统一透视
统一像素尺度
```

---

## 8.1 Walls

Runtime：

```text
64×64
```

Master：

```text
512×512
```

资产：

```text
wall_corrugated_rust_01
wall_corrugated_rust_02
wall_patchwork_metal
wall_old_brick
wall_concrete_dirty
wall_industrial_panel
```

Pivot：

```text
[32,64]
```

---

## 8.2 Pillars

Runtime：

```text
32×64
```

Pivot：

```text
[16,64]
```

资产：

```text
pillar_steel_01
pillar_steel_rusted
pillar_concrete
pillar_pipe_support
```

---

## 8.3 Doors

Runtime：

```text
64×96
```

Pivot：

```text
[32,96]
```

资产：

```text
door_metal_single
door_metal_double
door_workshop
door_bar
door_warehouse_shutter
```

---

## 8.4 Windows

Runtime：

```text
64×64
```

Pivot：

```text
[32,48]
```

资产：

```text
window_metal_closed
window_metal_lit
window_broken
window_barred
window_shop
```

---

## 8.5 Roofs

Runtime：

```text
128×96
```

Master：

```text
768×768
```

资产：

```text
roof_corrugated_01
roof_corrugated_02
roof_patchwork
roof_tar_sheet
```

Pivot：

```text
[64,96]
```

---

## 8.6 Awnings

Runtime：

```text
96×64
```

资产：

```text
awning_red_faded
awning_canvas_beige
awning_green_military
```

Pivot：

```text
[48,16]
```

---

## 8.7 Stairs

```text
stairs_metal_short = 96×96
stairs_metal_long  = 128×128
```

---

## 8.8 Platforms

```text
platform_metal_small = 128×96
platform_metal_large = 192×128
platform_wood_small  = 128×96
```

---

## 8.9 Railings

```text
railing_metal_straight = 64×64
railing_metal_corner   = 64×64
railing_pipe_straight  = 64×64
ladder_metal           = 32×96
```

---

# 9. Pipes / Cables

```text
pipe_vertical   64×64
pipe_horizontal 64×64
pipe_corner     64×64
pipe_valve      64×64
pipe_large      96×96

cable_bundle    64×64
cable_hanging   96×64
```

透明 RGBA。

---

# 10. Props

## Industrial

```text
vent_small        32×32
vent_large        64×64
electric_box      32×48
junction_box      32×32
street_lamp       32×96
industrial_lamp   32×64
workbench         96×64
tool_cabinet      64×96
water_tank_small  96×128
```

## Small

```text
barrel_rust   32×48
barrel_blue   32×48
fuel_drum     32×48
wood_crate    32×32
metal_crate   32×32
sandbags      64×32
old_tire      32×32
trash_bin     32×48
```

Pivot 默认：

```text
bottom-center
```

---

# 11. Vegetation

```text
dry_grass_01          32×32
dry_grass_02          32×32
dead_bush_01          32×48
dead_bush_02          32×48
small_green_bush      48×48
flower_red_wasteland  32×32
small_tree_dry        64×96
small_tree_survivor   64×96
rock_small_01         32×32
rock_small_02         32×32
rock_cluster          64×48
cactus_small          32×48
cactus_large          48×80
```

---

# 12. Character Runtime Contract

角色采用：

```text
frame = 48×72
directions = 8
```

方向固定顺序：

```text
n
ne
e
se
s
sw
w
nw
```

动作：

```text
idle      4 frames
walk      6 frames
run       6 frames
attack    6 frames
interact  4 frames
hurt      3 frames
down      4 frames
```

文件必须为**独立帧**：

```text
assets/runtime/characters/protagonist/walk/s/frame_00.png
...
frame_05.png
```

不要依赖一个巨大 sprite sheet 作为 source of truth。

角色：

```text
protagonist
liuyan
lincheng
taoyao
```

Frame pivot：

```text
[24,68]
```

---

# 13. Portraits

正式立绘：

```text
source_master ≥ 1024×1536
runtime = 512×768
RGBA
```

角色：

```text
protagonist
liuyan
lincheng
taoyao
```

路径：

```text
assets/runtime/portraits/<character_id>.png
```

---

# 14. Rust Runner Modular Vehicle Contract

## 14.1 Runtime canvas

所有车体相关方向素材：

```text
128×128
RGBA
```

统一 vehicle pivot：

```text
[64,96]
```

---

## 14.2 Chassis

8方向：

```text
rust_runner_chassis_n.png
rust_runner_chassis_ne.png
rust_runner_chassis_e.png
rust_runner_chassis_se.png
rust_runner_chassis_s.png
rust_runner_chassis_sw.png
rust_runner_chassis_w.png
rust_runner_chassis_nw.png
```

Master：

```text
768×768
```

Runtime：

```text
128×128
```

禁止包含：

```text
炮塔
主炮
副炮
SE
天线
外挂箱
特效
```

---

## 14.3 Tracks

```text
rust_runner_track_left.png
rust_runner_track_right.png
```

Runtime：

```text
128×128
```

必须使用透明 canvas，位置与 chassis 坐标系一致。

---

# 15. Turret

16方向：

```text
00 = 0°
01 = 22.5°
02 = 45°
03 = 67.5°
04 = 90°
05 = 112.5°
06 = 135°
07 = 157.5°
08 = 180°
09 = 202.5°
10 = 225°
11 = 247.5°
12 = 270°
13 = 292.5°
14 = 315°
15 = 337.5°
```

命名：

```text
rust_runner_turret_00.png
...
rust_runner_turret_15.png
```

Runtime：

```text
128×128
```

Turret pivot：

```text
[64,61]
```

炮塔图片不允许包含炮管。

---

# 16. Weapon MOD

全部：

```text
RGBA
独立文件
不带车体
不带炮塔
```

## Main

```text
cannon_75mm
cannon_105mm
cannon_120mm
```

Runtime canvas：

```text
128×128
```

默认方向：

```text
E
```

Weapon pivot：

```text
[28,64]
```

Muzzle：

```text
75mm  = [112,64]
105mm = [118,64]
120mm = [124,64]
```

---

## Sub

```text
machinegun_12mm
autocannon_20mm
autocannon_30mm
```

Runtime：

```text
96×96
```

---

## SE

```text
missile_launcher_small
missile_launcher_quad
rocket_pod
flamethrower
```

Runtime：

```text
96×96
```

---

# 17. Vehicle accessories

```text
side_armor_light      128×128
side_armor_heavy      128×128
front_armor_plate     128×128

rear_storage_rack     128×128
storage_box_small      64×64
storage_box_large      96×64
fuel_tank_external     64×64

antenna_short          32×64
antenna_long           32×96
spotlight              32×32
tow_hook               32×32
spare_wheel            48×48
spare_track             64×32
smoke_launcher          48×48
```

---

# 18. Damage overlay

```text
damage_scratches_light 128×128
damage_burn_medium     128×128
damage_armor_broken    128×128
damage_smoke_source    128×128
```

必须：

```text
RGBA
透明背景
只画 damage
```

禁止包含原车体。

---

# 19. Vehicle JSON

路径：

```text
data/vehicles/rust_runner.json
```

Schema：

```json
{
  "vehicle_id": "rust_runner",
  "display_name_cn": "破风巡逻车",
  "runtime_canvas": [128,128],
  "pivot": [64,96],

  "chassis": {
    "n":  "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_n.png",
    "ne": "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_ne.png",
    "e":  "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_e.png",
    "se": "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_se.png",
    "s":  "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_s.png",
    "sw": "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_sw.png",
    "w":  "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_w.png",
    "nw": "assets/runtime/vehicles/rust_runner/chassis/rust_runner_chassis_nw.png"
  },

  "tracks": {
    "left": "assets/runtime/vehicles/rust_runner/tracks/rust_runner_track_left.png",
    "right": "assets/runtime/vehicles/rust_runner/tracks/rust_runner_track_right.png"
  },

  "turret": {
    "pivot": [64,61],
    "directions": 16,
    "path_pattern": "assets/runtime/vehicles/rust_runner/turret/rust_runner_turret_{index:02d}.png"
  },

  "mounts": {
    "main_gun": [64,60],
    "sub_gun": [72,63],
    "se": [52,58],
    "antenna": [52,46],
    "light": [79,55],
    "rear_storage": [64,80]
  },

  "collision_box": {
    "x": 26,
    "y": 55,
    "w": 76,
    "h": 49
  }
}
```

Codex 不能把这些坐标重新硬编码在 renderer。

---

# 20. Weapon JSON

例如：

```text
data/weapons/cannon_75mm.json
```

Schema：

```json
{
  "weapon_id": "cannon_75mm",
  "display_name_cn": "75mm 主炮",
  "slot": "main",
  "asset": "assets/runtime/weapons/main/cannon_75mm.png",
  "runtime_size": [128,128],
  "pivot": [28,64],
  "barrel_origin": [28,64],
  "muzzle_point": [112,64],
  "damage_visual_class": "medium_shell",
  "compatible_mounts": ["rust_runner.main_gun"]
}
```

---

# 21. Boss / enemy

普通敌人 runtime：

```text
64×64
96×96
128×128
```

Boss：

```text
256×256 minimum
384×256 preferred
512×384 maximum standard
```

Boss 状态：

```text
idle
move
attack_01
attack_02
hurt
enraged
death
```

每个 animation 独立帧。

禁止：

```text
boss sheet 作为唯一 source
```

---

# 22. Effects

## Muzzle flash

```text
64×64
6 frames
RGBA
pivot = [32,32]
```

路径：

```text
assets/runtime/effects/muzzle_flash/frame_00.png
...
```

## Explosion

```text
128×128
8 frames
```

## Smoke

```text
96×96
8 frames
```

## Projectile

```text
shell_small = 16×16
shell_medium = 24×24
rocket = 32×16
```

---

# 23. UI

内部逻辑分辨率：

```text
1280×720
```

UI 九宫格：

```text
panel_dark_9slice = 64×64
button_normal     = 160×48
button_hover      = 160×48
button_pressed    = 160×48
button_disabled   = 160×48
```

Icons：

```text
small = 32×32
large = 64×64
```

正式 UI 不允许：

```text
浏览器默认按钮
默认 HTML select
未经美术包装的 input
```

---

# 24. Rustport Map Contract

地图：

```text
64×64 tiles
tile size = 32
world pixel size = 2048×2048
```

Tiled：

```text
.tmj
.tsj
```

地图层严格命名：

```text
00_ground
01_roads
02_terrain
03_building_floor
04_walls
05_doors_windows
06_roof
07_props_back
08_props_front
09_vegetation
10_collision
11_npc_spawns
12_triggers
13_lighting
```

禁止更改层名。

---

# 25. Map Object types

NPC：

```json
{
  "type": "npc",
  "properties": {
    "npc_id": "liuyan",
    "facing": "s"
  }
}
```

Trigger：

```json
{
  "type": "trigger",
  "properties": {
    "trigger_id": "rustport_first_tank",
    "once": true
  }
}
```

Exit：

```json
{
  "type": "exit",
  "properties": {
    "target_map": "rustport_outskirts",
    "target_spawn": "south_gate"
  }
}
```

---

# 26. Asset Manifest Schema

唯一入口：

```text
data/asset_manifest.json
```

每个 asset：

```json
{
  "asset_id": "wall_corrugated_rust_01",
  "category": "building.wall",
  "source_master": "assets/source_master/buildings/walls/wall_corrugated_rust_01.png",
  "runtime": "assets/runtime/buildings/walls/wall_corrugated_rust_01.png",
  "master_size": [512,512],
  "runtime_size": [64,64],
  "alpha": true,
  "pivot": [32,64],
  "status": "COMPLETE",
  "qa": {
    "alpha_clean": true,
    "dimensions_valid": true,
    "no_text": true,
    "no_crop": true
  }
}
```

合法状态：

```text
PLANNED
NEEDS_ART
NEEDS_REGEN
COMPLETE
QA_PASS
QA_FAIL
ARCHIVED
```

---

# 27. Codex Asset Loader Contract

代码不得：

```text
"assets/foo/bar.png"
```

到处硬编码。

必须实现：

```text
AssetRegistry.get("wall_corrugated_rust_01")
AssetRegistry.get("cannon_75mm")
AssetRegistry.get("rust_runner")
```

AssetRegistry 启动时读取：

```text
data/asset_manifest.json
```

如果 asset 不存在：

```text
throw explicit error in development
```

禁止：

```text
silent fallback
```

---

# 28. Validation

Codex 必须实现：

```text
python scripts/assets/validate_assets.py
```

检查：

```text
文件存在
文件扩展名正确
runtime尺寸正确
alpha正确
manifest重复asset_id
不存在manifest路径
未索引runtime文件
source/runtime配对
非法文件名
```

---

# 29. Vehicle validation

```text
python scripts/assets/validate_vehicle_mounts.py
```

检查：

```text
8 chassis present
16 turret present
tracks present
weapon files present
turret pivot in bounds
mounts in bounds
muzzle points in bounds
collision box in bounds
```

---

# 30. Tile QA

程序生成：

```text
qa/seam_tests/<asset_id>_4x4.png
```

不得作为正式 asset。

道路生成：

```text
qa/tile_connection_tests/roads_all_connections.png
```

---

# 31. Building QA

必须使用真实模块程序拼装：

```text
qa/building_assembly/rustport_house_test.png
qa/building_assembly/rustport_bar_test.png
qa/building_assembly/rustport_workshop_test.png
```

禁止重新生成整栋测试建筑图片。

---

# 32. Vehicle QA

程序组合：

```text
qa/vehicle_consistency/rust_runner_8dir.png
qa/vehicle_consistency/rust_runner_turret_16dir.png
qa/vehicle_mounts/rust_runner_weapon_swap.png
qa/vehicle_mounts/rust_runner_accessories.png
qa/vehicle_mounts/rust_runner_damage.png
```

只由正式组件组合。

---

# 33. Release Rules

`release/assets/` 仅允许：

```text
status = QA_PASS
```

绝不允许：

```text
PLANNED
NEEDS_ART
NEEDS_REGEN
QA_FAIL
placeholder
concept
promo
screenshot_crop
contact_sheet
asset_sheet
```

---

# 34. Git LFS

建议：

```gitattributes
*.png filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.kra filter=lfs diff=lfs merge=lfs -text
```

JSON/TMJ/TSJ/MD：

```text
正常 Git
```

---

# 35. Codex 不得擅自做的事

Codex 禁止：

1. 为了减少文件数量把独立帧重新合成一个不可索引的大 sprite sheet。
2. 修改 asset_id。
3. 更改方向顺序。
4. 改变 runtime tile size。
5. 把 32×32 tile 放大后当正式 master。
6. 使用宣传图裁切。
7. 使用 JPEG。
8. 用 CSS filter 伪造 damage state。
9. 在代码里写死 mount point。
10. 自动缩放不同车型来强行匹配。
11. 找不到素材时静默替换成别的素材。
12. 把 QA 图放进 runtime。
13. 把 source_master 加载进游戏。
14. 把 UI panel 当作场景 background。
15. 重新解释角色或战车美术方向。

---

# 36. Codex 实际任务顺序

Codex 按此顺序工作：

```text
1. Validate directory structure
2. Build asset_manifest schema
3. Implement AssetRegistry
4. Implement validators
5. Import completed assets
6. Validate dimensions
7. Generate QA previews
8. Build Rustport map
9. Implement modular vehicle renderer
10. Implement weapon swap
11. Implement damage overlays
12. Run complete QA
13. Build release assets
```

---

# 37. 完成定义（Definition of Done）

只有同时满足以下条件，Codex 才能回复“asset pipeline complete”：

```text
[ ] asset_manifest 可解析
[ ] 所有 QA_PASS 文件真实存在
[ ] runtime 无 concept/promotional files
[ ] ground tiles seam test PASS
[ ] road connections PASS
[ ] building assembly PASS
[ ] Rust Runner 8方向 PASS
[ ] turret 16方向 PASS
[ ] weapon swap PASS
[ ] mount points PASS
[ ] damage overlay PASS
[ ] Rustport TMJ 可以加载
[ ] 无 missing path
[ ] 无 duplicate asset_id
[ ] validate_assets.py exit code 0
[ ] validate_vehicle_mounts.py exit code 0
[ ] validate_maps.py exit code 0
```

---

# 38. 最终 Codex 执行 Prompt

当素材已上传到 Git 仓库后，向 Codex 发送：

```text
Read docs/WastelandHunter_Codex_Production_Asset_Contract_CN.md completely.

Treat it as the authoritative contract for all Wasteland Hunter production assets.

Do not redesign the asset system.

Your task is to:

1. inspect the repository;
2. reconcile existing folders with the contract without deleting valid production art;
3. build/update data/asset_manifest.json;
4. implement AssetRegistry;
5. implement asset validation scripts;
6. verify every runtime asset dimension and alpha mode;
7. ensure no promotional/reference/contact-sheet image is used by runtime;
8. build the Rustport Tiled map pipeline;
9. implement the Rust Runner modular renderer using independent chassis, tracks, turret, weapons, armor, accessories and damage overlays;
10. use metadata for every pivot/mount/muzzle/collision value;
11. generate QA previews from real production components;
12. run the complete QA suite;
13. move only QA_PASS runtime assets into release/assets/;
14. report all missing assets explicitly as NEEDS_ART instead of inventing or substituting them.

Never silently fall back to an incorrect asset.

Never crop promotional art into production assets.

Never mark placeholders as COMPLETE.

At the end, provide:
- validation summary
- missing asset list
- QA failures
- files changed
- paths added
- integration status for Rustport
- integration status for Rust Runner
```

---

# 39. 最终原则

**美术生成工具负责制作像素；Codex 负责维护工程契约。**

Codex 的职责是：

```text
路径正确
尺寸正确
方向正确
metadata正确
引用正确
组合正确
验证正确
Git结构正确
```

而不是：

```text
看到缺一张图就随便画/替换一张
```

当正式素材尚未制作时：

```text
status = NEEDS_ART
```

这是正确状态，不是错误。

**宁可明确缺素材，也不能让错误素材污染 Production Final。**
