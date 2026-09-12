# 故事素材与运行时对接矩阵

本文件把 Canon / 故事数据中的视觉需求连接到 `asset_id`。运行时代码不得直接猜测文件路径，也不得用旧 atlas 裁片替代正式素材。

## 调用规则

1. 先等待 `ASSET_BINDINGS_READY`，再调用 `AssetRegistry.resolve(binding)`。
2. 绑定返回 manifest record；绘制层只读取 `runtime`、`pivot`、`mount point` 和方向元数据。
3. `AssetRegistry.get()` 默认拒绝 `NEEDS_ART`、`PLANNED` 和其他非 `QA_PASS` 素材。开发预览如需检查布局，必须显式传入 `{ allowIncomplete: true }`，不能进入发布路径。
4. 图片层使用 `AssetRegistry.bindImage(assetId, image)` 或 `AssetRegistry.preload(binding)`，禁止新增 `assets/...` 字面路径。
5. 资源缺失、绑定拼写错误、manifest 状态不合格都必须抛出错误；不得静默回退到旧素材。

## 当前已登记的可调用绑定

| binding | 故事/执行用途 |
| --- | --- |
| `rustport.ground` | 锈港地面、道路与油污材质 |
| `rustport.building.awning` | 港区工坊、酒馆和服务建筑遮阳棚 |
| `rustport.props.industrial` | 油桶、货箱、灯具、工作台和港区工业小物 |
| `rust_runner.chassis` | Rust Runner / 沙狐 Mk.I 八方向车体；next runtime 已使用南向车体 |
| `rust_runner.tracks` | 左右履带层；next runtime 已参与车体组装 |
| `rust_runner.turret` | 炮塔 16 方向层；next runtime 已使用 00 方向炮塔 |
| `rust_runner.main_weapon` | 主炮模块；`cannon_75mm` 当前已通过 QA |
| `characters.dialogue_portraits` | 主角、柳焰、桃夭、林澄对话肖像 |
| `characters.gameplay` | 主角与柳焰 8 方向 idle、walk、attack、interact、hurt、down 独立 gameplay 帧，以及桃夭、林澄 idle 帧；当前 next runtime 已绘制到 Rustport 场景 |
| `rustport.bounty` | 铁牙猎犬 idle、attack、hurt、enraged、death 状态；当前 next runtime 已绘制 idle 状态 |
| `combat.effects` | 炮口焰、弹道、爆炸和烟雾帧 |
| `ui.core` | 对话、菜单、车库和 HUD 的基础控件 |

当前所有绑定素材均已重置为 `NEEDS_ART`，因为旧生产图未达到 R1 参考板的美术标准。绑定本身仍可用于审计，但正式渲染必须让 `resolve()` 抛出状态错误。这保证重建期间不会把旧素材或低质量素材误当成完成资源。

## 故事覆盖计划

`data/asset_bindings.json` 的 `planned_bindings` 保存尚未进入 manifest 的故事资产 ID。主角、柳焰与铁牙猎犬的第一批切片已经从计划项迁移到正式 `bindings`：

- `characters.gameplay` 的扩展：周默、桃夭与林澄的完整动作集，主角/柳焰的 run 帧，以及更多剧情动作；
- `rustport.bounty` 的扩展：铁牙猎犬的更多动画帧、破损叠层和战斗特效；
- `rust_runner` 的扩展：装甲、储物、天线、灯光、燃料与损伤 overlay；
- `towns.bounty_bosses`：其余九个城镇赏金首的独立主体与阶段；
- `towns.signature_environment`：十镇的地点识别套件；
- `vehicle_fleet`：沙狐之后的九辆专属战车；
- `equipment.modules`：主炮、副炮、SE、发动机、C-unit、装甲的可见模块层。

新增素材时，顺序固定为：

1. 先在 `planned_bindings` 中确认故事用途和稳定 ID；
2. 在 `data/asset_manifest.json` 添加固定尺寸、pivot、方向和 mount metadata；
3. 导入 source master，构建 runtime；
4. 通过资产 QA 后将状态改为 `QA_PASS`；
5. 将 ID 从计划项迁移到正式 `bindings`；
6. 在对应 renderer / scene loader 中调用 binding，而不是写路径；
7. 运行 manifest、asset、map、vehicle 和相关浏览器测试。

## 优化与发布边界

- source master 保留制作分辨率；runtime 使用 manifest 声明尺寸，不在 renderer 中临时缩放或裁切。
- 像素素材关闭平滑采样；透明素材保留 alpha；pivot 和 mount point 必须来自 manifest。
- `preload(binding)` 只缓存绑定中的图片，避免场景切换时重复创建 `Image`。
- `release/` 只接收 `QA_PASS` runtime 文件。未完成故事资产可以被审计，但不能被发布构建引用。
