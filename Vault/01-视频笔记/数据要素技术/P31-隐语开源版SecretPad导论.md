---
title: "P31 隐语开源版SecretPad导论"
source: "https://www.bilibili.com/video/BV1ser5BDESU?p=31"
up: "defa_pro"
tags: [数据要素, 隐私计算, 视频笔记, secretflow, SecretFlow]
duration: "24m48s"
cid: 35372009198
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 972
---

# P31 隐语开源版SecretPad导论

← [[BV1ser5BDESU-总览]] | ← [[P30-基于K8S的跨域隐私计算应用编排框架Kuscia]] | 下一篇 → [[P32-KusciaAPI的相关概念和场景实践-正式版]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 隐语开源版SecretPad导论 |
| 模块 | SecretFlow 生态 |
| 时长 | 24 分 48 秒 |
| 链接 | [B 站 P31](https://www.bilibili.com/video/BV1ser5BDESU?p=31) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：隐语开源版SecretPad导论
2. **模块定位**：SecretFlow 生态
3. **考试/实践侧重**：SecretPad 可视化、项目/参与方/组件
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「隐语开源版SecretPad导论」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

### 1. SecretPad 定位

**SecretPad** 是隐语开源的**隐私计算 Web 平台**，提供可视化项目创建、参与方管理、组件拖拽编排、任务运行与结果查看，降低非开发人员使用门槛。

### 2. 核心功能

| 功能 | 说明 |
|------|------|
| 项目管理 | 创建协作项目、邀请参与方 |
| 组件库 | PSI、联邦、预测、预处理等 |
| 画布编排 | 拖拽连线定义 DAG |
| 任务运行 | 提交到 Kuscia/本地后端 |
| 结果下载 | 模型、报表、日志 |

### 3. 版本区分

- **开源版**：本地部署，适合学习与小规模 PoC
- **企业版**：多租户、权限、审计增强（若有）

### 4. 使用流程

1. 部署 SecretPad + Kuscia + SecretFlow
2. 注册节点与证书
3. 新建项目，添加数据源
4. 拖拽组件（如 PSI → 纵向联邦）
5. 配置参数，提交运行
6. 各方授权后任务执行

### 5. 适用人群

业务分析师、数据科学家、合规人员——无需手写 MPC 协议，但需理解组件语义与数据准备。

### 6. 考试/实践要点

- 完成 SecretPad 官方教程一个完整项目
- 说明画布 DAG 与 SecretFlow 脚本的关系
- 列举三类常用组件及输入输出

### 7. 权限 RBAC

SecretPad 项目管理员、数据科学家、审计员角色分离；操作留痕。

### 8. 多语言

界面中文；组件文档中英对照，算法参数有 tooltips。

### 9. 培训路径

业务人员 2 天 SecretPad 培训即可跑通 PSI+联邦；研发人员需 1–2 周掌握 SecretFlow Python API。

### 10. 学习与实践检查单

- [ ] 对照本 P 标题回顾 B 站视频章节要点
- [ ] 在 [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) 找到对应模块
- [ ] 能用一句话向同事解释本 P 核心概念
- [ ] 识别一个本行业可落地的应用场景
- [ ] 记录与前后分 P 的技术依赖关系

### 11. 模块知识串联
本讲属于「数据要素流通技术」体系中的重要一环。建议在学习日志中标注：输入依赖（前序知识）、输出能力（学完能做什么）、与隐语组件映射（SecretFlow/Kuscia/SecretPad/TEE）。完成 47 讲后应能独立设计一个「政策合规+连接器+隐私计算+审计存证」的端到端方案，并评估 MPC、TEE、联邦学习的选型依据。

## 关键术语

| 术语 | 说明 |
|------|------|
| 数据要素 | 可参与社会化配置、创造价值的数字化资源 |
| 隐私计算 | 数据可用不可见前提下实现协作计算的技术体系 |
| 模块 | SecretFlow 生态 |

## 与前后分 P 的衔接

- ← **基于K8S的跨域隐私计算应用编排框架Kuscia**（[[P30-基于K8S的跨域隐私计算应用编排框架Kuscia]]）
- → **KusciaAPI的相关概念和场景实践-正式版**（[[P32-KusciaAPI的相关概念和场景实践-正式版]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1ser5BDESU-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 972 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1ser5BDESU-P31-cover.jpg|B站首帧 P31]]
