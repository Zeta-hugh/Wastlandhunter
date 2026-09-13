# 接管执行记录 — 2026-09-13

## 已完成

- 建立 [工作分工](WORK_ALLOCATION_CN.md)，由当前主代理承担全部工作线的协调与执行。
- 核对实际 Git 跟踪状态，更新工作线状态、文件归属和冲突清单；Mobile/Reference 交付已存在，待审查。
- 将迁移清单中的 next 存档起始版本由过时的 1 修正为实际 23；未执行 24 消费者迁移。
- 修复主角渲染使用固定 `(640,360)` 而非玩家实际世界位置的问题。
- 新增 `tests/renderer.test.mjs` 和 `npm run test:renderer`：覆盖初始位置、移动后位置、镜头移动后位置。测试在修复前出现坐标断言失败，修复后通过。

## 当前验证

| 检查 | 本次结果 |
|---|---|
| `npm test` | PASS；保留 legacy 和资产完整性 |
| `npm run test:renderer` | PASS；1 项位置回归 |
| `npm run test:architecture` | PASS；3 项 |
| `npm run test:shared` | PASS；2 项 |
| `npm run test:route:data` | PASS；11 项 |
| `npm run test:movement` | PASS；4 项 |
| `npm run test:spatial` | PASS；5 项 |
| `npm run validate:project` | 审计模式 PASS；11 个旧 ID 警告、存档适配器未迁移警告、旧引用警告仍存在 |
| `npm run test:browser` | PASS；修复后复验，包含移动、存档重载、V7 回退、战斗、资产加载 |
| `npm run test:spatial:browser` | PASS；13 个沙盒对象；本次无头浏览器样本 68 帧/秒，不代表 Android 性能 |
| `npm run test:next` | P0 资产预览通过；完整运行时明确输出 BLOCKED，不能按进程退出码 0 声称完整通过 |
| `git diff --check` | PASS |

浏览器测试首次被沙箱阻止本地端口监听，获准后重跑完成。主角测试验证的是绘制坐标；正式人物缺图，尚未完成该修复的正式人物运行画面验收。

## 下一批任务

1. Art：主角 `protagonist_idle_{n,ne,e,se,s,sw,w,nw}_00` 和柳焰 `liuyan_idle_{n,ne,e,se,s,sw,w,nw}_00` 共 16 帧均为 NEEDS_ART；铁牙猎犬 idle/attack/hurt/enraged/death 共 5 帧同样缺失。先按现有制作契约产出并逐项 QA，再补动作集和战车方向。
2. Runtime：审查启动资源列表。目前只把人物南向列为必需项，但 renderer 会请求八方向；应在正式人物接入时补齐门槛和缺方向回归，防止启动通过后转向报错。
3. Mobile/Runtime：审查沙盒排序与正式脚点、遮挡规则，再执行有测试的逐文件接入；不把沙盒模型直接视作正式标准。
4. 契约：准备 23 → 24 消费者迁移样例与准确引用清单，独立验收。

完整视觉切片、Android 实机验收和发布尚未完成。当前没有修改 legacy、远程推送或发布。

## 第二轮执行：资源门槛与角色基准帧

- **VERIFIED**：启动资源检查覆盖主角和柳焰各八方向待机帧；浏览器逐一模拟 16 个缺帧场景，均在图片加载前明确阻止启动。测试只拦截内存中的 manifest 响应，不修改正式资源。
- **VERIFIED**：人物和铁牙猎犬使用 manifest pivot 定位，不再把画布底边当脚底。渲染回归覆盖人物移动、镜头移动、八方向和非默认 pivot。
- **VERIFIED**：`test:renderer`、`npm test`、`test:browser`、`assets:validate`、`assets:maps`、`git diff --check` 通过。`test:next` 的 16 个门槛用例和 P0 预览通过，完整路线仍 BLOCKED。
- **BLOCKED（Art）**：内置 image_gen 生成主角南向候选、一次透明度修订、柳焰南向候选，共三个文件。逐个检查均为 RGB，棋盘格是背景像素，不是真透明。柳焰姿势也不完全符合正南待机。全部留在 `qa/assets/character_batch_02/`，未修改 manifest，未导入 source_master/runtime/release。
- 提示词：`docs/RUSTPORT_CHARACTER_BATCH_02_PROMPTS.md`；技术结果：`qa/reports/character_batch_02.json`。下一步需要真实 RGBA 基准帧，确认姿势和脚点后才扩展剩余方向。
- 已查看最新 `qa/runtime_previews/rustport_p0_runtime_integration.png`：仅环境/战车组件预览，仍有原型场景块和标题重叠；不属于正式视觉里程碑，不能代替人物画面验收。

## 第三轮执行：正式渲染遮挡排序

- **VERIFIED**：正式 renderer 接入按世界 Y、场景高度、既有图层序号计算的逐帧排序；同深度按 ID 稳定排序。主角不再固定画在所有物体前面。
- **VERIFIED**：战车组件作为一组绘制；人物/Boss 抬高时改变显示位置和深度，地面阴影不随高度漂浮。碰撞及交互数据未改动。
- **VERIFIED**：世界物体绘制后重置 HUD 左对齐，修正标题被世界标签对齐状态影响的问题。
- **VERIFIED**：`test:renderer`（2 项含多个场景）、`test:renderer:browser`、`npm test`、`test:browser`、`test:movement`（4 项）、`test:architecture`（3 项）以及 `git diff --check` 通过。`test:next` 的 16 个缺帧用例及 P0 预览通过；完整路线仍 BLOCKED。
- 已查看实际浏览器截图 `qa/runtime_previews/production_depth_order.png`：使用正式 P0 战车/桶资产验证前后遮挡。测试布置仅存在于浏览器内存；未修改生产地图。它是技术验收，不是锈港视觉里程碑。
- 方案与边界见 `SPATIAL_RENDERING_DECISION_002.md`。未照搬沙盒的高度系数；桥梁、室内和屋顶切换仍需独立设计与验证。
- **Art 仍 BLOCKED**：上一轮真实 alpha 输出失败的证据不变，本轮未重复同样的生成调用，也没有把 RGB 候选图提升为正式素材。

下一项独立工程任务：核对存档 23 → 24 的迁移输入、往返保存样例和字段保持规则；Art 需要能通过透明度与姿势检查的独立基准帧。
