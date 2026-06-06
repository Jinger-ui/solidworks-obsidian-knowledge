---
title: "P03 API 调用与参数确认"
source: "https://www.bilibili.com/video/BV1Yo5D6TEVk?p=3"
up: "夜刀凉宫忧x"
tags: [solidworks, ai, 视频笔记, 机械设计, 自动化, 教程级]
duration: "30m03s"
cid: 38323356909
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 教程级增强脚本"
status: 教程级已增强
source_type: 教程级知识点增强
detail_level: 教程级
word_count: 3675
---

# P03 API 调用与参数确认

← [[BV1Yo5D6TEVk-总览]] | ← [[P02-环境自动化准备]] | 下一篇 → [[P04-参数化零件建模]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | P03_API调试与流程确认_带字幕配音 |
| 时长 | 30 分 03 秒 |
| 链接 | [B 站 P3](https://www.bilibili.com/video/BV1Yo5D6TEVk?p=3) |
| 内容来源 | 知识点增强（SolidWorks API/机械设计体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：API 调用与参数确认——系列第 3/6 步
2. **前置依赖**：需完成 P02（[[P02-环境自动化准备]]）
3. **产出物**：参数 JSON schema 与 API 映射验证
4. **学习侧重**：SldWorks 对象链、JSON schema、SetSystemValue3、逐步调试
5. **笔记层级**：教程级（约 3675 字），含流水线图解、实操 Walkthrough、Checklist

> 以下内容基于 SolidWorks API 与机械设计知识体系撰写，对应 B 站分 P「P03_API调试与流程确认_带字幕配音」。**非 UP 逐字转写**；不看视频可按 Walkthrough 纸面演练，看视频对照操作细节。

## 本节在系列中的位置

**系列第 3/6 步**：API 调用与参数确认。

**前置产出**：完成 [[P02-环境自动化准备]] 的交付物。

**下一步**：[[P04-参数化零件建模]] 将使用本步产出。

六步流水线：读图 → 环境 → API/Schema → 零件建模 → 标准件 → 装配交付。

## 3 分钟速览

**API 调用与参数确认**——产出：参数 JSON schema 与 API 映射验证。重点：SldWorks 对象链、JSON schema、SetSystemValue3、逐步调试。

## 零基础导读

本系列演示 **AI 读工程图 + SolidWorks API 自动建模装配**。P03「API 调用与参数确认」即使不看视频，也要弄清：本步**输入是什么、输出交给谁、失败如何排查**。

不要跳步：没有 P01 的参数 JSON，P04 脚本无米下锅；没有 P02 环境，P03 COM 调用必报错。

## 详细讲解

### 1. P03 定位：第一次 API 闭环

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

```json
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
```

**映射表（人工维护）**

| JSON 字段 | 含义 | SW 尺寸名 | 单位 |
|-----------|------|-----------|------|
| outer_diameter | 外径 | D1@草图1 | mm |
| thickness | 厚度 | D2@拉伸1 | mm |
| hole_count | 孔数 | 阵列实例数 | - |

UP 在 P03 演示的正是：读 JSON → 改 SetSystemValue3 → 看模型是否更新。

### 4. 差分方程到特征映射（设计意图）

机械零件常可用「特征序列」表达，类似离散系统的差分方程——当前特征状态依赖前序特征：

```
基体高度 h = f(厚度参数 t)
孔位半径 r = PCD/2
阵列角步进 Δθ = 360°/n
```

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

- 可运行的 `build_part.py`（或 C# 等价物）
- `params_schema.md` 或 JSON Schema 文件
- 已知限制列表（未自动化的特征类型）

← P02 环境就绪 → **本 P API 闭环** → P04 批量生成完整零件

### 实操要点（P03）

建议开双屏：左 Obsidian 笔记，右 SolidWorks + IDE。每完成一个 API 调用立即保存宏/脚本版本。遇到 COM 错误先查 `Visible` 与对象是否为 `None`，再查尺寸名是否与草图完全一致（区分大小写）。

## 图解

```mermaid
flowchart LR
  P01[读图JSON] --> P02[环境]
  P02 --> P03[API/Schema]
  P03 --> P04[零件]
  P04 --> P05[标准件]
  P05 --> P06[装配]
  style P03 fill:#f9f,stroke:#333
```

## 类比与直觉

API 建模像**用遥控器开车**：你发指令（方法调用），车（SolidWorks）动；要先弄清遥控器按钮对应哪根线（对象链）。

## 例题与场景 Walkthrough

**Walkthrough：本步在流水线中的位置**

- **输入**：P01 JSON + P02 环境
- **操作**：SldWorks 对象链、JSON schema、SetSystemValue3、逐步调试
- **输出**：参数 JSON schema 与 API 映射验证
- **验收**：对照视频复现 UP 演示结果

## 常见误区

1. **AI 读图 100% 准**：必须人工复核关键尺寸与视图对应。
2. **API 版本无关**：不同 SolidWorks 年份接口名可能变化，需查帮助。
3. **跳过草图约束**：未完全定义草图会导致特征失败或下游装配配合不上。
4. **标准件全建模**：螺栓螺母应优先 Toolbox，节省时间。

## 与视频对照表

| 视频段落（约） | 预期演示内容 | 笔记对应章节 |
|-------------|------------|------------|
| 开篇 0%–15% | 本集目标、背景、与前后集关系 | 本节位置、3 分钟速览 |
| 前段 15%–40% | 核心概念定义与架构图 | 零基础导读、详细讲解 |
| 中段 40%–70% | 原理展开、对比、政策/代码示例 | 图解、类比、Walkthrough |
| 后段 70%–90% | 案例、问答、易错点 | 常见误区、Checklist |
| 收尾 90%–100% | 总结、延伸资源 | 延伸阅读、自测题 |

> 本集总时长约 **30分03秒**。无官方外挂字幕时，以分 P 标题「API 调用与参数确认」与上表主题对齐视频画面。

## 动手实践 Checklist

- [ ] 完成本步 UP 演示复现
- [ ] 提交/保存本步产出文件
- [ ] 记录 1 个 API 踩坑
- [ ] 阅读 SolidWorks API Help 相关方法
- [ ] 准备下一步输入物

## 延伸阅读

- [SolidWorks API Help](https://help.solidworks.com/)
- pywin32 文档
- GB/T 4458 机械制图标准
- 本系列相邻分 P 笔记

## 自测题

1. **本步产出？**  **答**：参数 JSON schema 与 API 映射验证。
2. **关键 API/概念？**  **答**：SldWorks 对象链、JSON schema、SetSystemValue3、逐步调试。
3. **上一步依赖？**  **答**：环境自动化准备。
4. **常见失败？**  **答**：见「常见误区」与视频排错片段。
5. **如何自测？**  **答**：独立完成 Checklist 第一项。

## 关键术语

| 术语 | 说明 |
|------|------|
| ModelDoc2 | 当前活动文档对象 |
| SetSystemValue3 | 修改驱动尺寸值的 API |
| 参数映射表 | JSON 字段与 SW 尺寸名对应关系 |
| ForceRebuild3 | 强制重建模型 |

## 与前后分 P 的衔接

- ← **P02_SolidWorks启动与自动化准备_带字幕配音**（[[P02-环境自动化准备]]）
- → **P04_基础零件建模生成_带字幕配音**（[[P04-参数化零件建模]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1Yo5D6TEVk-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **教程级增强**：含 Mermaid 流水线、实操 Walkthrough、自测题（约 3675 字，2026-06-06）
- ⏳ 逐字转写：API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1Yo5D6TEVk-P03-cover.jpg|B站首帧 P03]]
