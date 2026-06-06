---
title: "P03 API 调用与参数确认"
source: "https://www.bilibili.com/video/BV1Yo5D6TEVk?p=3"
up: "夜刀凉宫忧x"
tags: [solidworks, ai, 视频笔记, 机械设计, 自动化]
duration: "30m03s"
cid: 38323356909
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 685
---

# P03 API 调用与参数确认

← [[BV1Yo5D6TEVk-总览]] | ← [[P02-环境自动化准备]] | 下一篇 → [[P04-参数化零件建模]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | P03_API调试与流程确认_带字幕配音 |
| 时长 | 30 分 03 秒 |
| 链接 | [B 站 P3](https://www.bilibili.com/video/BV1Yo5D6TEVk?p=3) |
| 内容来源 | 知识点增强（教程流程梳理，非逐字转写） |

## 核心要点

1. **本 P 定位**：API 调用与参数确认——系列第 3/6 步
2. **前置依赖**：需完成 P02（[[P02-环境自动化准备]]）
3. **产出物**：参数 JSON 与 API 映射验证
4. **学习建议**：结合下方详细笔记理解流程，再对照视频看 UP 具体操作

## 详细笔记

> 以下内容基于机械 AI + SolidWorks 自动化通用实践撰写，对应 UP 分 P 主题。**非逐字转写**。

### 1. P03 定位：API 调试与流程确认

将 P01 的结构化参数通过 API **写入 SolidWorks 并验证**：尺寸是否驱动、特征是否成功、报错如何定位。这是「设计 → 代码 → 模型」的第一次闭环。

### 2. 典型 API 调用链

1. 连接 SolidWorks 实例
2. 新建零件文档
3. 选择基准面（Front/Top/Right）
4. 创建草图 → 添加几何与尺寸
5. 退出草图 → 特征（ExtrudeBoss/Cut）
6. 读取/修改尺寸 Dimension.SetSystemValue3
7. 重建模型 ForceRebuild3
8. 保存 SaveAs3

### 3. 参数确认流程

| 步骤 | 验证内容 |
|------|----------|
| 读入 JSON | 键名、单位、数量级 |
| 映射表 | JSON 字段 → API 尺寸名 |
| 单次特征 | 仅拉伸，看是否成功 |
| 全特征 | 按 P01 顺序逐个添加 |
| 修改参数 | 改驱动尺寸，看几何更新 |

### 4. 常见 API 问题

- **草图未完全定义**：欠定义/过定义导致特征失败
- **单位错误**：米 vs 毫米差 1000 倍
- **选择错误**：面/边/顶点 Selection 失败
- **特征顺序**：先阵列后倒角 vs 相反，结果不同

### 5. 调试技巧

- 打开 SolidWorks 界面 Visible=True 观察
- 逐步执行，每步 Save 或截图
- 捕获 COM 异常 HRESULT 码
- 与手动操作逐步对比

### 6. 流程确认交付物

- 可运行的 `build_part.py`（或等价脚本）
- 参数 JSON schema 文档
- 已知限制列表（哪些特征尚未自动化）

### 7. 与前后衔接

← P02 环境就绪 → 本 P API 闭环 → P04 批量生成零件

## 关键术语

| 术语 | 说明 |
|------|------|
| COM API | SolidWorks 自动化接口，Python/C# 通过 win32com 调用 |
| 特征树 | SolidWorks 建模操作历史，API 按序添加特征 |
| 参数化 | 驱动尺寸控制几何，供 AI/API 修改 |
| 配合 | 装配体中约束零件相对位置的关系 |

## 与后续分 P 的衔接

- ← [[P02-环境自动化准备]]
- → [[P04-参数化零件建模]]

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1Yo5D6TEVk-full.json`）
- ✅ 分 P 首帧封面
- ✅ **知识点增强**（约 685 字，2026-06-06）
- ⏳ 逐字转写：API 无外挂字幕；可选 Whisper 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1Yo5D6TEVk-P03-cover.jpg|B站首帧 P03]]
