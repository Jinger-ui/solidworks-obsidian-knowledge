/** SolidWorks-AI 自动化教程知识点增强 P01-P06 */
module.exports = {
  1: `### 1. 为什么从「读图纸」开始

机械 AI 自动化不是「把图片丢给 AI 就出模型」。可靠流程的第一步是**结构化理解二维工程图**：视图关系、尺寸链、公差与技术要求。P01 建立这一认知框架，后续 P02–P06 的 API 与脚本才有明确输入规格。

本系列 UP 演示的是：**AI 读取 PDF/图片图纸 → 输出参数与特征描述 → Python/C# 调用 SolidWorks API 建模装配**。若跳过读图，API 再熟练也只能建出错误几何。

### 2. 视图投影与读图顺序

**第一角投影（国标 GB/T 4458.1，国内常用）**

| 视图位置 | 投影关系 |
|----------|----------|
| 俯视图 | 在主视图**正上方** |
| 左视图 | 在主视图**正右方** |
| 仰视图 | 在主视图正下方 |

**第三角投影（美标 ASME Y14.3）** 俯视图在主视图下方。读图前先看标题栏角标（⊿ 或三角符号）确认投影制式，避免 AI 把俯视图高度与主视图宽度对调。

**标准读图步骤**

1. 标题栏：零件名、图号、比例、材料、单位（mm/in）
2. 找主视图：信息量最大、最少虚线
3. 对照俯/左视图建立三维想象（「长对正、高平齐、宽相等」）
4. 剖视图/详图：确认内部孔、筋、壁厚
5. 尺寸标注：按功能分类提取

### 3. 尺寸链与标注分类

| 类型 | 含义 | 建模用途 |
|------|------|----------|
| 外形尺寸 | 总长、总宽、总高 | 包络框、基体拉伸 |
| 定位尺寸 | 孔心距、槽位相对基准 | 草图定位约束 |
| 定形尺寸 | R、Φ、角度、深度 | 驱动几何形状 |
| 参考尺寸 | 括号标注（仅供参考） | 不直接驱动，用于校验 |
| 链式/封闭尺寸 | 多段累加 | 注意公差累积，选关键链作驱动 |

**尺寸链实践**：从安装基准面出发，沿功能关系串联尺寸。例如法兰盘以中心线为对称基准，螺栓孔用节圆直径 D + 孔数 n + 起始角 θ 描述，比逐个孔距更利于参数化。

**公差与技术要求**
- 配合代号（H7/g6）：影响标准件选型，建模用公称尺寸
- 形位公差（⊥、∥、⌖）：装配与检验用，基础建模先记录
- 粗糙度 Ra、热处理、倒角 C0.5：决定后续工艺特征

### 4. 零件拆分与建模策略

在写任何 SolidWorks 代码之前，应输出**建模任务清单**：

| 步骤 | 内容 | 产出 |
|------|------|------|
| 1. 零件拆分 | 总成中有哪些独立件；螺栓/垫片/轴承是否标准件 | BOM 草稿 |
| 2. 基准策略 | 原点、主基准面（对称中心/安装面） | 坐标系定义 |
| 3. 特征顺序 | 基体→切除→孔→倒角圆角→阵列 | 特征树草稿 |
| 4. 参数表 | 哪些尺寸供 AI/API 修改 | JSON 字段列表 |
| 5. 约束关系 | 对称、同心、相切 | 草图逻辑说明 |

**示例：法兰盘建模思路**
- 基体：Front 面草图圆 → ExtrudeBoss 厚度 t
- 中心孔：Φd 贯穿切除
- 螺栓孔：单孔草图 → CircularPattern n 个，节圆 D
- 倒角：外缘 C1

**复杂总成拆分原则**：一零件一文件；焊接件可简化为单一零件或拆板件；标准件不重建模。

### 5. AI 在本流程中的角色

| 阶段 | AI 输入 | AI 输出 | 人工校验 |
|------|---------|---------|----------|
| 读图 | PDF/图片/扫描件 | 参数 JSON、特征列表 | 关键尺寸、视图对应 |
| 规划 | 参数 JSON | 建模步骤自然语言 | 特征顺序是否合理 |
| 执行 | API 脚本 | 三维模型 .SLDPRT | 干涉、质量、配合面 |

**推荐 JSON 结构（概念）**

\`\`\`json
{
  "part_name": "法兰盘",
  "unit": "mm",
  "params": { "od": 120, "thickness": 12, "center_hole_d": 30 },
  "features": [
    { "type": "extrude_boss", "sketch": "circle", "depth": "thickness" },
    { "type": "extrude_cut", "sketch": "circle", "d": "center_hole_d" }
  ]
}
\`\`\`

**AI 易错点**：隐藏线误判、剖面与实体边界混淆、mm/in 混用、螺纹大径当底孔、对称件漏镜像。关键配合尺寸**必须人工确认**后再驱动 SolidWorks。

### 6. 常见读图误区

- 把螺纹孔直径当底孔直径（M6 底孔约 Φ5，非 Φ6）
- 忽略「均布」「×4-Φ8 EQ」等阵列标注
- 剖面线区域误判为实体边界
- 局部放大图比例与主视图不同，尺寸仍适用主比例
- 焊接符号、表面粗糙度符号 OCR 识别错误

### 7. 实践与考试要点

1. 选一张简单零件图（主视图 + 剖视），手写参数表与特征树
2. 标明投影制式与基准面
3. 对照 UP 视频看其如何从图纸提炼 JSON
4. 勿跳过 P01 直接跑 API——缺结构化输入会导致反复返工

**自检清单**：能否在不看模型的情况下说出基体特征类型？能否列出全部驱动参数？能否区分标准件与自制件？`,

  2: `### 1. P02 目标：让自动化「跑起来」

P01 明确「建什么」之后，P02 解决「环境怎么跑起来」：启动 SolidWorks、配置 COM/API 连接、准备 Python 或 C# 运行环境、设置模板与单位、处理宏安全策略。本 P 时长最长（约 45 分钟），因为环境踩坑最多。

### 2. SolidWorks 自动化技术栈对比

| 方式 | 语言/工具 | 优点 | 缺点 |
|------|-----------|------|------|
| COM API | Python (pywin32)、C#、VB.NET | 文档全、示例多、本系列主路径 | 仅 Windows，需 SW 进程 |
| VBA 宏 | SolidWorks 内置 | 录制快、调试直观 | 难版本管理，难与 AI 流水线集成 |
| C# 插件 Add-in | .NET | 深度集成、可 UI | 开发部署成本高 |
| 第三方 | pySldWrap、xlwings 等 | 封装友好 | 版本兼容需验证 |

本系列 likely 使用 **Python + win32com** 或 **C# + Interop** 驱动 SolidWorks 2020+。

### 3. 环境检查清单

- [ ] SolidWorks 已授权安装，版本与 API 帮助文档一致
- [ ] Python **64 位**（与 SolidWorks 进程位数一致）
- [ ] \`pip install pywin32\`（Python 方案）
- [ ] C# 方案：引用 \`SolidWorks.Interop.sldworks\` 等互操作程序集
- [ ] 默认模板路径：零件 .prtdot、装配 .asmdot、工程图 .drwdot
- [ ] 工作目录与输出路径可写
- [ ] 关闭多余 SW 实例，避免僵尸进程占用 COM

### 4. COM 连接与 SldWorks 对象

**最小 Python 连接示例**

\`\`\`python
import win32com.client
sw = win32com.client.Dispatch("SldWorks.Application")
sw.Visible = True
# 0=零件, 1=装配, 2=工程图
model = sw.NewDocument(r"C:\\path\\Part.prtdot", 0, 0, 0)
\`\`\`

**关键对象层级**

\`\`\`
SldWorks.Application
  └── ModelDoc2 (当前文档)
        ├── PartDoc / AssemblyDoc / DrawingDoc
        ├── FeatureManager (特征树操作)
        ├── SelectionManager (选择)
        └── Extension (草图、尺寸)
\`\`\`

理解 **Dispatch → NewDocument → ActiveDoc → Feature 操作** 链路是后续 P03–P06 的基础。

### 5. 宏安全与 API 权限

| 设置项 | 路径/说明 |
|--------|-----------|
| 宏安全级别 | 工具 → 选项 → 系统选项 → 安全性 → 宏：建议「只为宏使用系统安全」或开发期「启用所有」 |
| 信任 VBA 项目 | 允许访问 VBA 项目对象模型（调试宏时需要） |
| 外部程序访问 | COM 自动化默认允许本机调用；远程需 DCOM 配置（一般不用） |
| 杀毒/防火墙 | 可能拦截 COM，需放行 SolidWorks 与 Python 解释器 |

**实践建议**：开发阶段 Visible=True 观察 UI；稳定后 Visible=False 提速。每次脚本结束调用 \`sw.ExitApp()\` 或显式释放 COM 引用。

### 6. Python 与 C# 环境准备

**Python 典型目录结构**

\`\`\`
project/
  config.json      # 模板路径、单位
  params/          # P01 产出的零件参数 JSON
  build_part.py    # 建模脚本
  requirements.txt # pywin32
\`\`\`

**C# 要点**：目标框架 .NET Framework 4.x 或与 SW 匹配的 .NET；平台 x64；通过 NuGet 或安装目录引用 Interop DLL。

**单位与精度**
- 系统选项 → 文档属性 → 单位：MMGS（毫米）与图纸一致
- 角度单位、小数位数写入 config，避免 API 按米解析

### 7. 文档管理与错误处理

| 操作 | 常用 API 思路 |
|------|---------------|
| 新建 | NewDocument(template, type, w, h) |
| 打开 | OpenDoc6(path, type, options, config, errors, warnings) |
| 保存 | SaveAs3(path, version, options, errors, warnings) |
| 关闭 | CloseDoc(path) |

**常见启动错误**
- \`Invalid class string\`：SolidWorks 未安装或 ProgID 错误
- 模板找不到：NewDocument 返回 None
- 权限：宏被禁用，特征创建静默失败

养成「**先手动能建，再写 API**」习惯；录制宏可快速获得 API 调用序列。

### 8. 与 P01/P03 衔接及实践要点

P01 输出建模思路 JSON → P02 确保 API 可调用 → P03 将 JSON 字段映射到 API 参数并调试。

**考试/实践要点**
- 能列出自动化环境依赖（OS、SW 版本、语言、位数）
- 理解 COM 连接与对象模型顶层结构
- 知道 NewDocument 参数与模板路径含义
- 能配置宏安全以便外部脚本调用`,

  3: `### 1. P03 定位：第一次 API 闭环

将 P01 的结构化参数通过 API **写入 SolidWorks 并验证**：尺寸是否驱动、特征是否成功、报错如何定位。这是「图纸 → JSON → 代码 → 模型」的第一次端到端闭环，也是本系列的核心转折 P。

### 2. SldWorks API 典型调用链

| 序号 | 步骤 | 说明 |
|------|------|------|
| 1 | 连接实例 | Dispatch / GetActiveObject |
| 2 | 新建零件 | NewDocument(.prtdot) |
| 3 | 选基准面 | SelectByID2("Front Plane", "PLANE", ...) |
| 4 | 插入草图 | InsertSketch2(True) |
| 5 | 画几何 | CreateCircle / CreateLine + 约束 |
| 6 | 标注尺寸 | AddDimension2；或事后 SetSystemValue3 |
| 7 | 退出草图 | InsertSketch2(False) |
| 8 | 特征 | FeatureExtrusion2 / FeatureCut3 |
| 9 | 重建 | EditRebuild3 / ForceRebuild3 |
| 10 | 保存 | SaveAs3 |

**调试原则**：每完成一步检查返回值（bool/int），失败即停，避免错误累积。

### 3. 参数 Schema 与映射表

P01 产出的 JSON 需有**稳定 schema**，供 AI 与脚本共用：

\`\`\`json
{
  "schema_version": "1.0",
  "part_id": "FLANGE-001",
  "unit": "mm",
  "parameters": {
    "outer_diameter": { "value": 120, "sw_dim": "D1@草图1" },
    "thickness": { "value": 12, "sw_dim": "D2@草图1" }
  },
  "feature_plan": [
    { "id": "boss_1", "type": "extrude_boss", "depth_param": "thickness" }
  ]
}
\`\`\`

**映射表（人工维护）**

| JSON 字段 | 含义 | SW 尺寸名 | 单位 |
|-----------|------|-----------|------|
| outer_diameter | 外径 | D1@草图1 | mm |
| thickness | 厚度 | D2@拉伸1 | mm |
| hole_count | 孔数 | 阵列实例数 | - |

UP 在 P03 演示的正是：读 JSON → 改 SetSystemValue3 → 看模型是否更新。

### 4. 差分方程到特征映射（设计意图）

机械零件常可用「特征序列」表达，类似离散系统的差分方程——当前特征状态依赖前序特征：

\`\`\`
基体高度 h = f(厚度参数 t)
孔位半径 r = PCD/2
阵列角步进 Δθ = 360°/n
\`\`\`

**映射策略**

| 图纸表达 | 特征类型 | API 关键词 |
|----------|----------|------------|
| 圆盘厚度 | ExtrudeBoss | FeatureExtrusion2 |
| 通孔 | ExtrudeCut / HoleWizard | FeatureCut3 |
| 圆周均布孔 | CircularPattern | FeatureCircularPattern4 |
| 倒角 C1 | Chamfer | FeatureChamfer2 |

先实现**最小可行特征集**（圆 + 拉伸 + 切除），再扩展阵列与倒角。

### 5. 参数确认流程

| 阶段 | 验证内容 | 通过标准 |
|------|----------|----------|
| 读入 JSON | 键名、单位、数量级 | 无缺失字段 |
| 单特征 | 仅拉伸基体 | 体积合理 |
| 全序列 | 按 P01 顺序添加 | 特征树无黄叹号 |
| 改参 | 修改 JSON 重跑 | 几何随动正确 |
| 对照图纸 | 卡尺测量关键尺寸 | 误差 < 设计允差 |

### 6. 常见 API 问题与调试

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 特征失败 | 草图欠定义/过定义 | 检查约束，FullyDefineSketch |
| 尺寸差 1000 倍 | 米/毫米单位 | 确认 IUserUnit 与输入值 |
| SelectByID2 失败 | 名称本地化 | 英文安装用 "Front Plane"，中文用「前视基准面」 |
| 特征为 Null | 返回值未检查 | 逐步打印 HRESULT |
| 重建不更新 | 未 Rebuild | ForceRebuild3(True) |

**调试技巧**：Visible=True；每步截图；与**宏录制**逐步对比；捕获 pywintypes.com_error。

### 7. 交付物与衔接

- 可运行的 \`build_part.py\`（或 C# 等价物）
- \`params_schema.md\` 或 JSON Schema 文件
- 已知限制列表（未自动化的特征类型）

← P02 环境就绪 → **本 P API 闭环** → P04 批量生成完整零件`,

  4: `### 1. P04：参数化零件建模生成

API 流程在 P03 调通后，P04 按 P01 建模思路**自动生成完整基础零件**：草图、拉伸、切除、孔、倒角、阵列。重点是**参数化特征树**与**可重复、可配置脚本**，而非单次手工建模。

### 2. 特征建模顺序（最佳实践）

| 顺序 | 特征类型 | API 典型接口 | 原则 |
|------|----------|--------------|------|
| 1 | 基体 | ExtrudeBoss / RevolveBoss | 先整体 |
| 2 | 去除 | ExtrudeCut / RevolveCut | 再局部 |
| 3 | 孔 | HoleWizard / Cut | 依赖基体面 |
| 4 | 修饰 | Fillet / Chamfer | 避免后续切除失效 |
| 5 | 阵列 | LinearPattern / CircularPattern | 单实例完成后再阵列 |

**口诀**：先大后小、先整体后局部、阵列前完成单实例、倒角放最后（或放阵列前视工艺而定）。

### 3. 草图与约束（API 思路）

**草图创建流程**
1. SelectByID2 基准面 → InsertSketch2(True)
2. CreateCircle2 / CreateLine / CreateCornerRectangle
3. AddDimension2 标注；或 SketchManager.FullyDefineSketch
4. InsertSketch2(False) 退出

**约束要点**
- 优先几何约束（同心、水平、竖直、对称）再标尺寸
- 对称零件：中心线 + 对称约束，减少驱动参数个数
- 避免悬空几何；草图须**完全定义**（黑线）

### 4. 拉伸与切除参数

**拉伸凸台 FeatureExtrusion2 关键参数（概念）**
- 方向：单向/双向
- 深度：给定深度 / 贯穿全部
- 拔模角：铸件需要时设置

**切除 FeatureCut3**：与拉伸类似，材料移除。通孔常用「贯穿全部」；盲孔用给定深度。

**旋转体**：轴对称件（轴、套筒）用 RevolveBoss，草图含中心线。

### 5. 参数化设计

| 方法 | 说明 |
|------|------|
| 尺寸驱动 | JSON 键 ↔ \`"D@草图名"\` 一一对应 |
| 方程式 | 工具 → 方程式：\`"D2@草图1" = "D1@草图1" / 2\` |
| 配置 | ConfigurationManager 管理多规格（同族零件） |
| 设计表 | Excel 驱动配置，适合系列件 |

AI 输出改 JSON 后，脚本循环 SetSystemValue3 即可换规格。

### 6. 脚本结构示例

\`\`\`python
def build_flange(sw, params):
    model = new_part(sw)
    sketch_circle(model, params["od"])
    extrude_boss(model, params["thickness"])
    sketch_circle(model, params["center_hole_d"])
    extrude_cut_through(model)
    if params.get("bolt_holes"):
        cut_one_hole(model, params["bolt_d"])
        circular_pattern(model, params["bolt_count"], params["pcd"])
    chamfer_outer(model, params.get("chamfer", 1))
    save_part(model, params["output_path"])
\`\`\`

模块化函数便于 P05 复用与单元测试（对单一特征单独跑）。

### 7. 质量检查与错误恢复

| 检查项 | API/操作 |
|--------|----------|
| 体积/质量 | Extension.CreateMassProperty |
| 包围盒 | GetPartBox |
| 关键尺寸 | 测量工具或读取尺寸值 |
| 与图纸核对 | 逐项比对 JSON |

**失败回滚**：FeatureManager.FeatureRollback 或删除失败特征后重建。保存检查点（中间版本）便于长脚本排错。

### 8. 实践要点

- 一个脚本对应**一类零件**（法兰、支架），用 JSON 区分实例
- 导出 STEP 便于非 SW 环境查看
- 记录特征耗时，优化瓶颈（通常 Rebuild 与选择）`,

  5: `### 1. P05：复杂零件与标准件完善

基础零件自动化在 P04 跑通后，P05 处理**复杂特征**（扫描、放样、筋、壳）并引入**标准件**（螺栓、螺母、轴承、密封圈）。目标是得到**可装配的完整零件集**，为 P06 插入配合做准备。

### 2. 复杂特征策略

| 特征 | 适用场景 | API 难度 | 自动化建议 |
|------|----------|----------|------------|
| 扫描 Sweep | 路径+截面（管道、弹簧） | 中 | 路径草图+截面草图先验证 |
| 放样 Loft | 多截面过渡 | 中高 | 截面数尽量少 |
| 筋 Rib | 加强筋 | 低 | 轮廓草图+厚度 |
| 壳 Shell | 抽壳容器 | 低 | 指定壁厚与移除面 |
| 曲面 | 流线外壳 | 高 | 优先供应商 STEP 或简化 |

**原则**：自动化优先**规则几何**；复杂曲面用库零件或「包络简化」代替全曲面重建，除非业务必须。

### 3. Toolbox 标准件

SolidWorks **Toolbox** 集成标准紧固件、轴承、O 形圈等。

| 方式 | 说明 |
|------|------|
| 界面插入 | 设计库 → Toolbox → ISO/GB |
| API 插入 | \`ToolboxConfigurator\` / \`CreatePartFromToolbox2\` 等（版本不同 API 名略有差异） |
| 配置螺栓 | 直径、长度、螺纹规格参数化 |

**不必从零建模 M6 螺栓**——标准件保证螺纹、头型、配合尺寸正确，且减轻 AI 读图负担（图纸常仅标注 M6×20）。

**其他标准件来源**
- 米思米 / 国标件供应商 STEP
- 自建标准件库文件夹，AddComponent 插入

### 4. 复杂图纸拆分

| 图纸类型 | 拆分策略 |
|----------|----------|
| 焊接件 | 拆为板件 + 焊缝（高级）；或单一零件简化 |
| 钣金 | SheetMetal 特征序列：基体法兰边 → 边线法兰 → 展开 |
| 铸件 | 拔模角、圆角铸态特征 |
| 传动件 | 齿轮/链轮优先 Toolbox 或库 |

每个自制件保存独立 **.SLDPRT**，定义**默认插入点**（坐标系原点与装配基准一致）。

### 5. 装配体层面准备

| 项目 | 规范 |
|------|------|
| 命名 | \`零件号_描述.SLDPRT\`，避免中文路径导致 COM 失败 |
| 原点 | 与装配配合面一致（如法兰底面中心） |
| 配合面 | 标注哪些面用于 Coincident / Concentric |
| 标准件清单 | BOM 字段：规格、数量、备注 |

**插入点示例**：轴类零件原点设在轴线中心与一端面交点，便于 P06 同心配合。

### 6. API 批量完善零件

\`\`\`python
for part_json in glob("params/*.json"):
    params = load(part_json)
    if params["type"] == "simple":
        build_flange(sw, params)
    elif params["type"] == "sheetmetal":
        build_bracket_sheetmetal(sw, params)
    elif params["type"] == "standard":
        insert_toolbox_fastener(sw, params)
\`\`\`

复杂特征**分步验证**：先单特征脚本成功，再并入主流水线。

### 7. 与 P06 衔接及实践要点

本 P 产出**完整零件集**（自制件 + 标准件）→ P06 新建装配体、AddComponent、AddMate、干涉检查、保存。

**实践要点**
- 标准件用库，自定义件用脚本
- 记录哪些特征类型尚未纳入自动化（技术债清单）
- 复杂件可先交付「简化几何」版本，再迭代细节`,

  6: `### 1. P06：装配、检查与交付收尾

系列最后一 P：将 P04/P05 零件**插入装配体**，添加配合约束，运行干涉检查，**保存并打包交付**。也是全流程复盘与局限讨论的起点。

### 2. 装配 API 基本流程

| 步骤 | API 思路 | 说明 |
|------|----------|------|
| 1 | NewDocument(.asmdot) | 新建装配体 |
| 2 | AddComponent4(path, x, y, z) | 插入零件，初始位置 |
| 3 | Fix 首个零件 | AssemblyDoc.FixComponent 或固定配合 |
| 4 | AddMate2 | 面重合、同心、距离等 |
| 5 | EditRebuild3 | 重建装配 |
| 6 | InterferenceDetection | 干涉检查 |
| 7 | SaveAs3 | 保存 .SLDASM |
| 8 | 可选 | Pack and Go、导出 STEP、BOM |

**配合前务必固定基准零件**（底座/机架），否则整个装配「飘移」。

### 3. 配合类型与自由度

| 配合 | 约束 DOF | 典型用途 |
|------|----------|----------|
| 重合 Coincident | 法向 + 位置 | 贴合面、共面 |
| 同心 Concentric | 轴线对齐 | 轴与孔、轴承 |
| 距离 Distance | 面间距 | 间隙、止口深度 |
| 平行 Parallel | 方向 | 导轨、侧板 |
| 垂直 Perpendicular | 方向 | 直角支架 |
| 角度 Angle | 转角 | 斜撑 |

**完全定位**：活动件剩余 6 个自由度应全部被配合约束（除故意留旋转的铰链）。**过约束**会报红，需删除冗余配合。

### 4. 推荐装配顺序

1. 固定基础零件（底座、框架）
2. 插入主要大件，添加主定位配合（面贴合 + 销孔同心）
3. 插入次要零件与盖板
4. 插入标准件（螺栓螺母：同心 + 重合，或使用 Smart Fasteners）
5. **干涉检查** InterferenceDetection
6. 爆炸视图（可选，用于说明或动画）

### 5. 干涉检查与验证

| 检查类型 | 工具/方法 |
|----------|-----------|
| 零件干涉 | 工具 → 评估 → 干涉检查 |
| 间隙验证 | 测量最小距离 |
| 质量属性 | 装配体质量、重心（仿真前） |
| 运动检查 | 配合正确时拖动零件应合理 |

API 调用干涉检测后，记录干涉体积与涉及零件，回 P04/P05 修改几何或配合。

### 6. 保存与工程交付

| 交付物 | 格式 | 用途 |
|--------|------|------|
| 装配体 | .SLDASM + 零件文件夹 | SolidWorks 原生编辑 |
| 便携包 | Pack and Go | 路径打包、外发 |
| 中立格式 | STEP / IGES | CAM、仿真、其他 CAD |
| 2D 图纸 | .SLDDRW | 加工图（可后续自动化） |
| 说明 | BOM Excel、截图、eDrawings | 沟通与归档 |

**命名与版本**：\`项目号_装配体名_RevA.SLDASM\`；重要里程碑 ZIP 备份。

### 7. 全流程回顾（P01–P06）

\`\`\`mermaid
flowchart LR
  A[P01 读图定参] --> B[P02 环境]
  B --> C[P03 API闭环]
  C --> D[P04 零件建模]
  D --> E[P05 标准件]
  E --> F[P06 装配交付]
\`\`\`

文字链：**图纸阅读 → 建模思路 JSON → 环境准备 → API 调试 → 参数化零件 → 复杂件/标准件 → 装配约束与保存**。

### 8. 局限与扩展方向

- 本系列为**流程演示**；工业级需 PLM、版本管理、变更流程
- AI 读图错误仍需人工复核，关键安全件必须签审
- 可扩展：有限元分析、工程图自动生成、MCP/Agent 驱动 SolidWorks、与 PLM/ERP 对接

### 9. 实践要点

- 配合前先 Fix 基准件；一次添加一组配合后重建
- 装配失败时 Suppress 配合逐个排查
- 保存前运行干涉检查；导出 STEP 供下游验证
- 写简短**复盘文档**：哪些步骤可全自动、哪些必须人工`,
};
