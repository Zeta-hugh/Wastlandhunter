# 重装机兵分类素材库

本轮取得 **136 张 PNG 原图**，保留原始路径，另建分类规范命名副本；像素未修改。打开 [本地浏览页](index.html) 查看全部图片；[catalog.json](catalog.json) 提供原始路径映射、来源、尺寸、透明通道范围、SHA-256 和切帧记录。

## 文件来源

- [Finb/MMX](https://github.com/Finb/MMX)：Unity 同人工程，固定提交 `4fc67b8924731f7ed12ff803e7eab6fd5099d15c`。下载 289 个文件，其中 117 张 PNG，其余为相关 PNG 导入元数据、地图 prefab/元数据及 LICENSE。没有执行工程。原目录在 `finb_mmx/original/`，逐文件下载记录在包内 `downloads.json`。仓库 MIT 文本已保存，但素材包含明显的原作风格/提取内容和其他来源图标，尚不能视为每张图片的复用授权。
- [Sprite Database / Metal Max Returns](https://spritedatabase.net/game/1544)：下载该目录 19 张图片，并逐页保存来源。包含坦克、人物、场景及物件。属于游戏提取图参考库，未取得项目发布所需的复用条件；保留原图署名。原目录在 `sdb_mmr/`。

## 分类与具体用途

| 分类目录 | PNG 数 | 六线使用安排 |
|---|---:|---|
| terrain_buildings | 23 | Art 优先对比墙体、工厂、废楼、地板、洞穴、山地、水面；Reference 提炼锈港可用的连接结构 |
| vehicles | 15 | Art 先评估 MMR 红狼、Tiger、Abrams 与 MMX 车辆帧；Contract 核对方向、底盘和炮管分层，Runtime 暂不接入 |
| characters_props | 58 | NPC、猎人、角色变体、门箱等；Art 先检查方向覆盖与比例，不能按文件数当作独立角色数 |
| scene_reference | 2 | 实验室、破败绿洲；Reference 研究场景布局，不能把整张场景截图当独立建筑组件 |
| ui_props_other | 38 | 装备、状态、窗口及其他物件；逐项筛选，不作为锈港首批重点 |

分类为初筛，包含配色变体、整张图集和物件，不代表 136 种独立造型。原始和分类目录是同一批图片的两份字节一致副本，不重复计数。

## 切帧与适配结论

从 Unity 元数据提取 **1474 条切帧记录**，原样记录在 catalog 的 `frames`。坐标原点为左下，接入 Canvas 前须转换；这些记录不是新生成的动画帧，也不代表全部通过生产验收。

已目视检查：MMR 红狼图集包含多朝向、炮管及小组件；MMX `mm1_walls.png` 为墙体破损图块；`$vehicle_7_base.png` 为车辆图集。猎人 `$npc_hunter_1.png`（96×128）与该车辆（96×134）的元数据均含 12 帧；不能当成项目规定的八方向完整动作。

Contract / QA 已完成下载记录的 SHA-256 对照、136 张 PNG 全量解码、规范副本建立。Mobile / 2.5D 下一步检查像素尺度和遮挡；Integration 以人物、坦克、工坊三项场景对比为下一批验收范围。现阶段均为参考或待来源审核候选，尚未修改正式 manifest、TMJ 或运行时。不能仅放大低分辨率图集就宣称解除视觉阻塞。

验证概要见 [validation.json](validation.json)。本轮不涉及运行时代码，因此未运行游戏测试；也未声称已获得完整系列素材或生产 QA_PASS。
