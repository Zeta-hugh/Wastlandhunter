# 共享素材库使用说明

**最新方向（2026-09-14）：重装机兵原版与同人自制素材优先。下文 17 包的优先级属于上一批筛选，现降为备用；不再优先从 Kenney 制作工坊。最新来源、下载状态和六线安排见 [重装机兵风格筛选](style_research_20260914/README_CN.md)。新增两包 CC-BY-SA 废土像素候选单独存储，不属于下述 CC0 清单。**

下载日期：2026-09-14。17 个资源包，按作者页面核对为 CC0-1.0。

**打开 [index.html](index.html) 可用中文关键词搜索、查看作者预览并浏览本地文件。** 每个包都有中文用途说明、文件索引和来源记录。

## 分类与决定

| 分类 | 资源包 | 用途与优先级 |
|---|---|---|
| 房屋模块 | Kenney Building Kit、Modular Buildings | P0：工坊墙、门、窗、转角、管道；适配后使用 |
| 工业建筑 | Kenney City Kit Industrial | P1：仓库、工厂与工业地标；适配几何与材质 |
| 环境道具 | Kenney Survival Kit | P0：箱桶、围栏、营地道具；适配后使用 |
| 自然环境 | Kenney Nature Kit | P1：岩石、仙人掌、树木与桥梁；适配后使用 |
| 道路模型 | Kenney City Kit Roads | P1：道路、桥墩、电线杆、围挡；组合原创路网 |
| 道路/地形图块 | Kenney Isometric Roads、Isometric Tiles Landscape | P2：连接语法参考；透视不直接适用 |
| 房屋图块 | Kenney Isometric Tiles Buildings | P2：轮廓参考；不替代独立建筑模块 |
| 常见城镇/大地图 | Kenney Roguelike Modern City、Map Pack | P2：城镇设施、路线与地图符号参考 |
| 坦克 | Kenney Top-Down Tanks、hubahuba Tank1 | 分层参考 + P1 坦克几何候选；模型待拆分验证 |
| 常见车辆 | Kenney Isometric Tiles Vehicles | P2：车辆轮廓参考 |
| 武器 | quaternius Low Poly Guns、Lucian Pavel Hunting Rifle | P1：常规枪械几何与旧猎枪材质；装备图标/武器层候选 |
| 武器附件 | Kenney Blaster Kit | P2：附件与箱体参考；整枪偏玩具造型，不直接采用 |

各包的具体文件路径、选中模型、下载链接和使用理由见包内 `catalog.json` 与 `README_CN.md`。

## 命名与文件组织

- 包名统一为 `来源_资源包`，目录按类别划分。
- `original/` 保留完整原始文件树；原始压缩包保留原始字节。
- `named_png/` 是独立图片的规范命名副本；未修改图片像素。
- `named_models/` 是确认没有外部依赖的 GLB 规范命名副本；未修改模型内容。
- OBJ/MTL、FBX、存在外部引用的模型保持原名和相对目录，防止破坏贴图引用；通过规范资源键定位。
- 包内 `catalog.json` 保存原始路径、规范资源键、副本路径和每文件 SHA-256，支持追溯。
- 作者预览、示例、图集仅用于浏览，不作为正式生产单帧。

## 按六条工作线执行

1. **Reference**：候选已筛选，负责地图连接语法、服务布局与 Canon 一致性。
2. **Production Art**：优先从 Building Kit、Modular Buildings、Survival Kit 制作工坊墙门转角管道与箱桶围栏，统一旧化材质、3/4 相机和独立 PNG。3D 模型作为制作基础，不直接替换现有 Canvas 引擎。
3. **Contract / QA**：核对来源许可、hash、PNG 尺寸/alpha、脚点、拼接及方向一致性。
4. **Runtime**：将通过验收的具体素材按现有 canonical asset_id 接入 manifest；地图继续沿用 TMJ/TSJ。这里提供图块和模型，没有现成可玩的锈港地图。
5. **Mobile / 2.5D**：验证最终尺度、手机可读性、遮挡、加载及内存。
6. **Integration**：验收工坊组件组装、道路连接及真实场景截图；随后推进坦克组件检查和枪械装备图标。

## 验证与边界

检查结果见 [validation.json](validation.json)：压缩包 CRC、文件 SHA-256、图像解码、规范副本一致性、glTF/GLB 结构及外部依赖、Blender 文件头。

文件数量包含不同格式、贴图、预览和说明，不等于独立造型数量。OBJ/FBX/BLEND 尚未实际渲染验收。未运行下载包内脚本。

所有包当前为 `NOT_IMPORTED`。没有修改生产 manifest 或 legacy；该目录不在现有构建脚本复制范围内，不会随游戏自动发布。

复验并重建浏览目录：`python3 scripts/assets/audit_external_library.py`。

许可全文见 [CC0 1.0](licenses/cc0_1_0_legalcode.txt)，各包还保留原许可/README 和作者页面快照。

## 筛选记录

OpenGameArt 的 `https://opengameart.org/content/tank-1` 实际提供玩具照片且存在授权争议，未下载。采用的是另一作者 hubahuba 的 `https://opengameart.org/content/tank1` Blender 模型，二者不能混淆。

Kenney Blaster Kit 整枪偏玩具造型，已决定仅供参考，并补充了常规枪械与旧猎枪模型。
