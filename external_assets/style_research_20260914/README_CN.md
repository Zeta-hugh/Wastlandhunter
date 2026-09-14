# 重装机兵风格素材筛选

**后续已取得成批资源：136 张 PNG 和相关 Unity 元数据，含 1474 条切帧记录。最新结果见 [重装机兵分类素材库](../metalmax_library/README_CN.md) 和 [完整浏览页](../metalmax_library/index.html)。下方保留早期检索及失败记录，不代表当前只有预览图。**

更新：2026-09-14。优先检索重装机兵原版、同人自制与改编素材；Kenney 降为结构参考和备用。此目录是候选研究库，尚未接入生产 manifest。

## 换源实测：爱给与替代入口

- 用户提供的 [爱给 72476 页面](https://www.aigei.com/view/72476.html)：网页工具、curl、Python HTTP 请求均返回 403；浏览器工具返回没有可用浏览器。没有获得正文或附件，不能推断该包具体内容，也没有下载成功。
- Project1：搜索索引可读，附件要求登录；当前直接读取仍不可用。保留原帖线索，不反复请求同一个失败入口。
- Spriters Resource：尝试 MMR、MM2R 索引及 MMR 红狼/大地图图片入口，HTTP 请求均为 403。搜索可定位 [红狼图集](https://www.spriters-resource.com/snes/metalmaxreturns/asset/24084/) 和 [大地图图集](https://www.spriters-resource.com/snes/metalmaxreturns/asset/262901/)，但未取得文件。
- [《重装归来》GitHub 仓库](https://github.com/aaixy/zzgl)：API 和原始文件下载成功。仓库说明明确表示大量图片没有上传，不能视为完整素材库。

实际新增：`zzgl_reference/` 中 4 张动画图集（45mmpao、anmirocket1、anmirocket2、jiguang）及原仓库 README、LICENSE，共 6 文件、320184 字节。固定版本 `85a5d41543f3e3119c84063750c9436559fc72b5`，已验证全部 SHA-256 和 PNG 文件头/尺寸。

打开 [本地动画浏览页](zzgl_reference/index.html) 查看；[下载记录](zzgl_reference/downloads.json) 保留原路径、规范本地命名和下载链接。45mmpao 已目视检查为炮击/爆炸效果图集。其余图集按原文件名暂分类，未完成逐帧审核。

本批标记 `REFERENCE_ONLY_RIGHTS_UNVERIFIED`：原仓库的代码许可不能代替图片来源说明。Reference/Art 用于检查炮击、火箭和激光的视觉节奏；Contract 继续核对图片原作者；Runtime 尚不接入。没有把赛车小游戏或通用 RPG Maker 图集计作重装机兵角色/坦克素材。

## 系列来源与实际状态

### 233 乐园：已取得两帖实际配图

本轮使用普通 HTTP 成功读取页面及正文图片，不依赖网页工具的抓取结果。文件位于 `community_233/`，可打开 [本地浏览页](community_233/index.html)，来源、尺寸和 SHA-256 见 [下载记录](community_233/downloads.json)。每帖保存页面快照和只含该帖数据的 `post.json`。

| 帖子 | 实际取得内容 | 判断 |
|---|---|---|
| [用户提供的 MM1 自绘素材帖](https://www.233leyuan.com/post-detail/2095099043849428992) | 1 张 160×160 WebP，2122 字节 | 角色造型展示；不是完整八方向行走序列 |
| [MM3/MM2R 战斗图分享帖](https://www.233leyuan.com/post-detail/2058261900389720064) | 1 张 640×436 WebP，9826 字节 | 目视确认是月亮伊布动画截图，属于镇楼配图，不是重装机兵战斗素材；已排除 |

两帖均显示“转载”，显示账号分别为静若繁花、莫辞酒味薄，不能据此认定为原作者。核查了正文内容块及其中的链接，两帖各只有一段文字和一张图片，没有压缩包或原帖地址。按正文短语继续检索，尚未定位原作者发布页。网站通用“下载客户端”按钮不是素材包入口。

图片原字节保存，未转换或裁切。第一张暂标记 `REFERENCE_ONLY_ORIGINAL_AUTHOR_UNVERIFIED`，供 Reference/Art 比较角色轮廓；方向帧、透明边缘、原始无损图及使用条件未通过验收，Runtime 不直接替换。第二张标记 `REJECTED_UNRELATED_COVER_IMAGE`，只留作筛选证据，不作为美术候选。此批下载两张图片，仅一张属于相关参考，不计为完整素材包。

| 来源 | 分类和计划用途 | 当前状态 |
|---|---|---|
| [04sama：MMR 战车人物及自制 MM2R/MM3 风格行走图](https://rpg.blue/thread-410171-1-1.html) | 首选：坦克、人物方向帧；先核对自制与原版提取部分，再做帧表 | 搜索索引可读，正文/附件访问返回 HTTP 403，未下载 |
| [重装归来第二季 RMMV 开源工程](https://rpg.blue/thread-397764-1-1.html) | 城镇布局、人车切换与战车表现参考；逐文件区分原创、原版和 RPG Maker 素材 | 已定位；混合来源工程，未下载、未运行 |
| [Metal Max NES 敌人图集](https://www.spriters-resource.com/nes/metalmax/asset/75848/) | 原版敌人造型参考，不能充当地图行走动画 | 页面返回 HTTP 403，未下载 |
| [Metal Max 3 图集索引](https://www.spriters-resource.com/ds_dsi/metalmax3/) | 后续对比战斗造型和地图造型；分别建档 | 已定位，未下载 |

MMR 帖的搜索索引列出附件“重装机兵回归行走图素材.rar”（302.9 KB），作者 04sama，2018-09-14；页面标明转载需注明出处。附件内容尚未取得，不能据此确定每张图的来源、方向数或最终使用条件。不以“同人”或“开源工程”替代逐项来源记录。

## 已下载：废土像素备用候选

这两包不是重装机兵素材。保留为道路、残墙和围栏的候选，不以它们取代系列风格筛选。

| 本地文件 | 作者及来源 | 用途 |
|---|---|---|
| [建筑地形图集](post-apocalyptic-16x16-tileset/wasteland_terrain_buildings_atlas.png) | [CobraLad](https://opengameart.org/content/post-apocalyptic-16x16-tileset) | 废土环境对比，640×400，原生 16×16 图块 |
| [人物图集](post-apocalyptic-expansion/wasteland_characters_atlas.png) | [keith karnage，基于 CobraLad](https://opengameart.org/content/post-apocalyptic-expansion) | 人物候选，128×128；不是本项目已验收的八方向角色 |
| [道路墙体围栏图集](post-apocalyptic-expansion/wasteland_roads_walls_fences_atlas.png) | 同上 | 256×256；道路连接与可破坏墙体候选 |

作者页均标明 CC-BY-SA 3.0，使用及改编时保留署名、来源、许可和修改记录。来源页面已保存到各包的 `source_page.html`；原始文件名、下载链接、尺寸、字节数、SHA-256 见 [downloads.json](downloads.json)。仅改文件名，未改变图片字节。此批不属于旧库的 CC0 清单。

## 六条工作线的执行顺序

1. **Reference**：先获得 MMR 自制包并核对来源；MMR、MM2R、MM3 分版本比较，不混合成统一画风的假设。
2. **Art**：先制作人物/坦克帧表和锈港环境候选表；核对透视、像素密度、色板与角色比例，再裁切适配。原版战斗图不能直接替代地图行走图。
3. **Contract / QA**：记录每帧来源、使用条件、透明度、尺寸、脚点、方向数；坦克检查底盘、炮塔、武器是否可拆层。
4. **Runtime**：只接入通过验收的独立资源；沿用现有 asset_id、manifest 和 TMJ，不直接加载同人工程脚本。
5. **Mobile / 2.5D**：验证实际缩放后的可读性、遮挡、人物与坦克比例。
6. **Integration**：先验收锈港单场景对照截图，再扩展其他地图。当前仍未解除正式素材缺口。
