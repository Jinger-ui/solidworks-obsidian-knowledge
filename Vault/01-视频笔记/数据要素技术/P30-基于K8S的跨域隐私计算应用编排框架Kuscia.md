---
title: "P30 基于K8S的跨域隐私计算应用编排框架Kuscia"
source: "https://www.bilibili.com/video/BV1ser5BDESU?p=30"
up: "defa_pro"
tags: [数据要素, 隐私计算, 视频笔记, secretflow, SecretFlow]
duration: "29m17s"
cid: 35372076553
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 1032
---

# P30 基于K8S的跨域隐私计算应用编排框架Kuscia

← [[BV1ser5BDESU-总览]] | ← [[P29-安全协作查询语言SCQL]] | 下一篇 → [[P31-隐语开源版SecretPad导论]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 基于K8S的跨域隐私计算应用编排框架Kuscia |
| 模块 | SecretFlow 生态 |
| 时长 | 29 分 17 秒 |
| 链接 | [B 站 P30](https://www.bilibili.com/video/BV1ser5BDESU?p=30) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：基于K8S的跨域隐私计算应用编排框架Kuscia
2. **模块定位**：SecretFlow 生态
3. **考试/实践侧重**：Kuscia 任务编排、Domain、跨域调度
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「基于K8S的跨域隐私计算应用编排框架Kuscia」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

### 1. Kuscia 定位

**Kuscia**（Kubernetes-based Secure Collaborative InfrA）是基于 K8s 的**跨域隐私计算编排框架**，管理多参与方（Domain）的任务调度、网络互通、证书与资源隔离。

### 2. 核心概念

| 概念 | 说明 |
|------|------|
| Domain | 一个参与方的隐私计算域，独立 K8s 命名空间 |
| Job | 跨域计算任务（联邦、PSI、MPC） |
| AppImage | 任务容器镜像模板 |
| InterConn | 域间网络与路由 |

### 3. 任务生命周期

1. 发起方创建 Job 定义（参与方、算法、资源）
2. Kuscia 协商各方授权
3. 调度 SecretFlow Worker 到各方 Domain
4. 执行协议，交换加密消息
5. 结果写入约定存储，Job 完成

### 4. 与 SecretFlow 关系

SecretFlow 负责**算子与协议**，Kuscia 负责**多集群编排与治理**。生产环境通常 SecretFlow + Kuscia 组合部署。

### 5. 运维要点

- 域间 mTLS 证书轮换
- 资源配额防止单方耗尽
- 任务超时与重试策略
- 审计日志集中采集

### 6. 考试/实践要点

- 画出 Alice/Bob 两 Domain 的 Kuscia 拓扑
- 说明 Job 与 K8s Job 的区别
- 列举跨域部署的三项网络要求

### 7. Helm 部署

官方 Helm Chart 一键装 Kuscia；生产自定义 values 配置资源与域名。

### 8. 升级策略

滚动升级 Worker，Job 断点续跑或幂等重试设计。

### 9. 观测性

Prometheus 采集 Kuscia Job 指标：耗时、通信字节、失败率；Grafana 大盘供运维与计费依据。

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
| Domain | 隐私计算域/参与方隔离单元 |
| Job | 跨域计算任务 |

## 与前后分 P 的衔接

- ← **安全协作查询语言 SCQL**（[[P29-安全协作查询语言SCQL]]）
- → **隐语开源版SecretPad导论**（[[P31-隐语开源版SecretPad导论]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1ser5BDESU-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 1032 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1ser5BDESU-P30-cover.jpg|B站首帧 P30]]
