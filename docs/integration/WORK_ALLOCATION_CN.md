# 锈港项目接管与工作分工

更新：2026-09-13。用户已授权当前主代理接管本仓库全部工作线并推进实施。以下是角色分工，不代表已启动多个代理或存在独立团队；当前由主代理承担执行、协调与集成，按文件边界串行修改。

## 当前目标

当前执行优先级以 [锈港下一批决定](RUSTPORT_NEXT_BATCH_CN.md) 为准：停止广泛扩库，保留已验收素材，先做南门—柳焰—首车工坊局部构图和五种工坊模块；角色基础帧仍是启动依赖。以下素材批次记录保留为历史，不作为新的扩库指令。

先交付锈港、主角、柳焰、首辆战车、铁牙猎犬的可玩视觉切片。保留 Canon、独立猎人立场和 legacy 原件。新城镇、广泛系统扩展和发布工程排在切片验收之后。

## 分工与下一项交付

| 工作线 | 唯一修改责任 | 下一项工作 | 交付与验收 |
|---|---|---|---|
| 集成负责人（当前主代理） | `docs/integration/`、跨线变更调度、共享构建 | 校正状态，确认依赖，逐项打开实施门槛 | 每项记录实际改动、检查、阻塞；不以文件存在认定验收完成 |
| 契约 / 存档 / QA | `data/schemas/`、`data/world_state_keys.json`、`game/core/save/`、`scripts/validation/`、契约测试 | 核对当前 23 → 24 迁移清单，准备旧档及往返保存样例 | `test:shared`、`validate:project`；消费者迁移前列全引用与兼容策略 |
| Runtime / 地图接入 | `game/app/core/`、`game/systems/`、任务/对话/赏金定义、正式地图 | 位置、脚点及基础深度排序已验证；接下来验证真实角色资产遮挡及动画 | 聚焦回归、`npm test`、`test:browser`、`test:next`；正式资产缺失保持可见阻塞 |
| Production Art | `assets/`、manifest 资产记录、bindings、`scripts/assets/` | 先列主角/柳焰/铁牙猎犬启动必需帧，再补角色动作及战车方向资产 | source/runtime 成对、逐项 QA、实际场景截图；禁止占位图冒充正式资产 |
| Mobile / 2.5D | `game/app/spatial-sandbox/`、对应测试、`docs/MOBILE/`；平台文件按阶段解锁 | 基础排序已按 Decision 002 接入；桥梁/室内/屋顶方案仍待独立验收 | `test:spatial`、`test:spatial:browser`；沙盒通过不等于正式渲染或 Android 通过 |
| 设计 / Reference | `docs/reference/`、`data/reference_analysis/` | 将现有首车/赏金提案收敛为切片必需项，核对术语与状态依赖 | Canon 一致；每个实施项绑定 Runtime/Art/地图依赖；不直接改生产逻辑 |

## 文件冲突处理

### 外部共享素材复用

最新入库结果：已取得 [重装机兵分类素材库](../../external_assets/metalmax_library/README_CN.md)，136 张 PNG、1474 条 Unity 切帧记录。Reference/Art 从这里开展人物、车辆、工坊三项候选对比；Contract 审查来源和坐标；Runtime 等待适配验收，Mobile 验证实际尺度，Integration 验收真实场景。此条覆盖下方“系列附件尚未取得”的旧进度；仍未完成生产替换。

最新执行方向（2026-09-14，覆盖下方旧批次优先级）：按用户要求，以重装机兵原版、MMR、MM2R/MM3 及同人自制素材为首选；Kenney 降为备用结构参考。具体来源、已下载文件、访问阻塞及六线后续工作见 [重装机兵风格筛选记录](../../external_assets/style_research_20260914/README_CN.md)。已补充两包废土像素候选，系列素材附件尚未取得，不计为已完成素材。

缺素材时先检索可复用资源，再决定适配或定制。独立 PNG、统一风格和 QA 要求不意味着必须从零制作。

- Reference：寻找针对锈港缺口的共享素材包、成熟制作流程，提供具体来源。
- Art：比较透视、比例、调色板、透明度和完整方向/动作覆盖，估算适配成本。
- 契约 / QA：记录作者、来源、版本、文件校验值、逐项许可和署名要求，并验证资产。
- Runtime：将获准资产接入现有 manifest、pivot 和动画接口。
- Mobile：检查内存开销、移动端可读性及 2.5D 遮挡适用性。
- 集成：比较复用与定制的总成本，决定采用范围并组织验收。

优先检索环境模块、道具、音效、特效和 UI 图标；主角、柳焰、铁牙猎犬仍需符合既定身份和美术方向。共享数据库作为检索来源，验收后固定版本保存在本地，不让游戏依赖外部网站在线加载。

候选入口：Kenney、OpenGameArt、Poly Haven。它们尚未通过本项目具体资产验收；OpenGameArt 必须逐件核对许可，Poly Haven 的材质/3D 资源需评估转为像素 2.5D 的额外成本。下一次素材工作从具体候选对比开始，避免反复依赖同一生成方法。

2026-09-14 执行更新：17 包共享素材已分类下载、建立规范命名副本和来源/hash 映射。查看 [中文资源说明](../../external_assets/README_CN.md) 和 [离线浏览目录](../../external_assets/index.html)。本批 Art 优先适配 Building Kit、Modular Buildings、Survival Kit 的工坊墙门转角管道及箱桶围栏；Contract / QA 复核尺寸和脚点，Runtime 接入 manifest，Mobile 验证实际尺度，Integration 审核场景。坦克模型先做组件可分离性检查，常规枪械优先做装备图标，地图图块由 Reference 提炼连接规则。逐包用途与选中文件见 `external_assets/catalog.json` 和包内 `README_CN.md`。生产资产状态尚未改变。

- Runtime 是 `renderer.js`、`camera.js`、`input.js`、`movement.js`、`world.js` 的唯一修改方；Mobile 提交方案和隔离验证，由 Runtime 接入。
- Art 修改 manifest 内容；结构变更由契约角色审查，再由集成负责人确认。运行时不得擅自修改资产状态。
- `package.json`、构建脚本、跨线测试由集成负责人安排单一修改者；`dist/`、`dist-next/` 的构建与浏览器测试串行运行。
- 存档/ID 变更作为一个完整迁移单元，包含消费者、引用、测试和回退说明。不得仅为消除审计警告直接批量替换 ID。
- `legacy/` 始终只读。Git/SSH 发布任务继续待定，本次接管不自动执行远程发布。

## 执行顺序

1. **基线校正与验证**：确认报告已存在、文件已跟踪，运行基础和浏览器检查；修复已证实的当前流程问题。
2. **解除视觉阻塞**：Art 提供启动必需资产清单及正式素材；Runtime 审查空间接入，契约角色准备迁移样例。这些任务可独立开展，不互相占用源文件。
3. **逐项集成**：每批素材验收后接入；先人物位置/动画、遮挡，再战车模块与铁牙猎犬反馈。不等待全库完成，也不降低 QA 门槛。
4. **切片验收**：完整走通柳焰 → 修车 → 赏金战 → 一次性领奖 → 保存重载；检查键盘/触屏和六类真实画面。

六类画面为大世界、锈港街区、酒馆/室内、玩家与 NPC、车库、铁牙猎犬战。尚未实现的画面明确标记缺失；不能以沙盒截图或概念图替代。

## 状态与交付规则

状态统一使用 TODO / IN_PROGRESS / READY_FOR_REVIEW / VERIFIED / BLOCKED。READY_FOR_REVIEW 只说明可审查；VERIFIED 必须附当前命令结果或实际运行证据。BLOCKED 必须说明依赖和解除条件。

每项交付写明：目标、负责人角色、修改文件、验收结果、剩余依赖。已有检查不反复重跑，除非实现变化、失败或未解决问题需要复验。不以功能数量估算整体完成百分比。

## 本次核查发现

- Mobile 的 `qa/reports/2_5d_spatial_test.md` 和设计组的 `docs/reference/SOURCE_INVENTORY_SPRINT1.md` 已存在；原集成表的“缺失”过时。
- 共享契约目录已被 Git 跟踪，接管前工作树干净；“未跟踪”已不能作为阻塞理由。消费者尚未迁移与是否跟踪是两件事。
- `game/app/core/state.js` 当前为 saveVersion 23，原迁移清单的版本 1 过时。
- 必需角色/Boss 素材仍是视觉切片的关键依赖，报告存在不代表这些资产已可用。
