---
title: "P03 Introduction to Federated Learning"
source: "https://www.bilibili.com/video/BV1q4421A72h?p=3"
up: "Proof-Trivial"
tags: [联邦学习, 差分隐私, 隐私计算, 视频笔记, fl-base, 教程级]
duration: "45m47s"
cid: 1433719663
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 教程级增强脚本"
status: 教程级已增强
source_type: 教程级知识点增强
detail_level: 教程级
word_count: 3225
transcript_engine: 
transcript_status: 待转写
---

# P03 Introduction to Federated Learning

← [[BV1q4421A72h-总览]] | ← [[P02-AvisualIntroductiontoFederatedorCollaborative]] | 下一篇 → [[P04-联邦学习中的高效通信优化方法]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | Introduction to Federated Learning |
| 模块 | 联邦学习基础 |
| 时长 | 45 分 47 秒 |
| 链接 | [B 站 P3](https://www.bilibili.com/video/BV1q4421A72h?p=3) |
| 内容来源 | 教程级知识点增强（非 UP 逐字转写） |

## 核心要点

1. **本 P 主题**：Introduction to Federated Learning
2. **模块定位**：联邦学习基础
3. **研读侧重**：FedAvg 伪代码、系统组件、$E$/$C$ 采样、客户端漂移
4. **笔记层级**：教程级（约 3225 字），含速览、Mermaid、Walkthrough、自测题
5. **学习建议**：先读「3 分钟速览」与「图解」，再深入「详细讲解」

> 以下内容基于联邦学习、差分隐私与协作学习理论体系撰写，对应 B 站分 P「Introduction to Federated Learning」。**非 UP 逐字转写**；不看视频可建立框架，看视频对照「与视频对照表」。

## 本节在系列中的位置

**模块**：联邦学习基础 · **P03/15**（核心课，45min）。

**前置**：[[P01-FederatedLearning简介]]、[[P02-AvisualIntroductiontoFederatedorCollaborativeLearning]]。

**后续**：[[P04-联邦学习中的高效通信优化方法]]（通信）或 [[P06-带有正式用户级差分隐私保证的联邦学习]]（隐私）。

## 3 分钟速览

**Introduction to Federated Learning** 深入 FedAvg、系统组件、Non-IID、采样与收敛直觉。考点：**FedAvg 伪代码、$E$/$C$/$n_k$、客户端漂移、SecAgg/DP 概述**。

## 零基础导读

本集通常是系列中**信息量最大**的入门课之一。阅读策略：先通读「详细讲解」FedAvg 与 Non-IID 两节，再回看视频对照系统架构图。数学只需掌握加权平均与梯度下降，证明留到 P11/P14。

## 详细讲解

### 1. 经典 FedAvg 算法（McMahan et al., 2017）

**Federated Averaging** 是工业界与学术界的默认基线：

**输入**：初始模型 $w_0$，通信轮次 $T$，本地 epoch $E$，学习率 $\eta$，客户端采样率 $C$

**每轮 $t$**：
1. 随机采样客户端 $S_t$，$|S_t| = \max(C \cdot K, 1)$
2. 广播 $w_t$ 到 $S_t$
3. 各客户端 $k$ 本地求解：
   $$w_t^k \leftarrow w_t - \eta \nabla F_k(w_t) \text{（运行 } E \text{ 步 SGD）}$$
4. 聚合：
   $$w_{t+1} \leftarrow \sum_{k \in S_t} \frac{n_k}{\sum_{j \in S_t} n_j} w_t^k$$

其中 $n_k$ 为客户端 $k$ 样本数，$F_k$ 为本地经验风险。

### 2. 系统架构组件

| 组件 | 职责 | 设计考量 |
|------|------|----------|
| 任务调度器 | 选客户端、控轮次 |  straggler 处理、公平性 |
| 模型仓库 | 版本管理、回滚 | A/B、灰度发布 |
| 客户端运行时 | 本地训练、断点续训 | 电量、算力、后台限制 |
| 通信层 | 上传下载、压缩 | TLS、量化、差分更新 |
| 监控 | 损失、参与率、漂移 | 异常客户端告警 |

### 3. 统计异质性（Statistical Heterogeneity）

**Non-IID** 类型：
- **标签偏斜**：某客户端只有部分类别
- **特征偏斜**：同标签不同分布（不同医院设备）
- **数量偏斜**：$n_k$ 差几个数量级
- **时序偏斜**：概念漂移

后果：本地目标与全局目标不一致，FedAvg 收敛慢或发散。缓解：**FedProx**（近端项）、**SCAFFOLD**（控制变量）、**个性化层**、**知识蒸馏对齐**。

### 4. 客户端采样策略

| 策略 | 说明 | 适用 |
|------|------|------|
| 随机均匀 | 每客户端等概率 | 理论分析 |
| 按数据量加权 | 大客户端更常选中 | 精度优先 |
| 按资源可用 | 仅选在线且算力足 | Cross-device |
| 公平配额 | 保证长尾客户端参与 | 公平性合规 |

采样率 $C$ 过小→方差大；过大→通信瓶颈与 straggler 拖慢。

### 5. 收敛直觉（不展开证明）

IID 且全参与时，FedAvg 等价于大批量 SGD。Non-IID + 部分参与时，需控制本地步数 $E$：$E$ 过大→**客户端漂移**（Client Drift），全局模型偏离；$E$ 过小→通信频繁。P14 将严格讨论本地步数与通信加速的权衡。

### 6. 隐私与安全（概述）

梯度可能泄露训练样本（Deep Leakage）。工程上叠加：
- **安全聚合**（SecAgg）：服务端只见聚合和
- **差分隐私**（P06）：形式化隐私预算
- **鲁棒聚合**：抵御投毒

### 7. 实践参数建议（起点）

| 场景 | $C$ | $E$ | 备注 |
|------|-----|-----|------|
| 跨机构 10 方 | 1.0 | 1–5 | 可用较大 $E$ |
| 手机 10k 方 | 0.01 | 1 | 控制漂移与掉线 |
| 强 Non-IID | 0.5+ | 1–2 | 配合 FedProx $\mu$ |

### 8. 本集学习要点

- 默写 FedAvg 四轮伪代码
- 解释 $E$、$C$、$n_k$ 权重各代表什么
- 列举三类 Non-IID 及一种缓解算法

### 系统故障排查表

| 症状 | 可能原因 | 对策 |
|------|----------|------|
| 损失 NaN | 学习率过大 | 降 lr、梯度裁剪 |
| 精度停滞 | Non-IID | FedProx、个性化 |
| 轮次极慢 | straggler | 异步、超时剔除 |
| 参与率低 | 客户端负担 | 减 $E$、压缩 P04 |

## 图解

```mermaid
flowchart LR
  w_t[全局 w_t] --> 广播
  广播 --> 本地1[客户端1: E步SGD]
  广播 --> 本地2[客户端2: E步SGD]
  本地1 --> 聚合[加权平均]
  本地2 --> 聚合
  聚合 --> w_t1[w_{t+1}]
```

## 类比与直觉

FedAvg 像**各班期中考后按人数加权算年级平均分**：人多的班权重大（$n_k$），但各班考题难度不同（Non-IID）时，平均分不能代表每个学生真实水平——需要 FedProx 等「分班辅导」。

## 例题与场景 Walkthrough

**调参实验纸面设计（不必真跑）**

| 轮次 | $C$ | $E$ | 观察指标 |
|------|-----|-----|----------|
| 1 | 1.0 | 1 | 基线损失 |
| 2 | 0.2 | 1 | 方差是否增大 |
| 3 | 1.0 | 10 | 是否发散（漂移） |
| 4 | 1.0 | 3 + FedProx | 是否恢复稳定 |

## 常见误区

1. **$E$ 越大越好**：过大导致客户端漂移。
2. **采样率无所谓**：过小增加方差与收敛轮次。
3. **权重用 1/K 而非 $n_k$**：样本极不均衡时应按 $n_k$ 加权。

## 与视频对照表

| 视频段落（约） | 预期演示内容 | 笔记对应章节 |
|-------------|------------|------------|
| 开篇 0%–15% | 本集目标、背景、与前后集关系 | 本节位置、3 分钟速览 |
| 前段 15%–40% | 核心概念定义与架构图 | 零基础导读、详细讲解 |
| 中段 40%–70% | 原理展开、对比、政策/代码示例 | 图解、类比、Walkthrough |
| 后段 70%–90% | 案例、问答、易错点 | 常见误区、Checklist |
| 收尾 90%–100% | 总结、延伸资源 | 延伸阅读、自测题 |

> 本集总时长约 **45分47秒**。无官方外挂字幕时，以分 P 标题「Introduction to Federated Learning」与上表主题对齐视频画面。

## 动手实践 Checklist

- [ ] 默写 FedAvg 四轮伪代码
- [ ] 解释 $n_k$ 权重的统计意义
- [ ] 阅读 Kairouz 开放问题清单摘要
- [ ] 在 Flower 找 FedAvg 配置项
- [ ] 完成 5 道自测

## 延伸阅读

- FedAvg 原论文 (McMahan 2017)
- Li et al., FedProx (2020)
- Karimireddy et al., SCAFFOLD (2020)
- [[P11-【SimonsInstitute】联邦学习&协作学习5SurveyonOptimizationinFL]]

## 自测题

1. **ClientUpdate 做什么？**  **答**：从 $w_t$ 出发本地优化 $F_k$ 共 $E$ 步得 $w_t^k$。
2. **三类 Non-IID？**  **答**：标签偏斜、特征偏斜、数量偏斜。
3. **straggler 影响？**  **答**：同步聚合被最慢客户端拖慢。
4. **梯度泄露为何重要？**  **答**：反演攻击可重构样本，需 SecAgg/DP。
5. **跨机构默认 $E$ 范围？**  **答**：常 1–5，视异质性调整。

## 关键术语

| 术语 | 说明 |
|------|------|
| 联邦学习 FL | 数据不出本地，协作训练全局模型 |
| 差分隐私 DP | 单条记录变化对输出分布影响有界 |
| 客户端采样 | 每轮仅部分客户端参与 |
| 本地步 E | 通信间本地 SGD 步数 |

## 与前后分 P 的衔接

- ← **A visual Introduction to Federated or Collaborative Learning**（[[P02-AvisualIntroductiontoFederatedorCollaborative]]）
- → **联邦学习中的高效通信优化方法**（[[P04-联邦学习中的高效通信优化方法]]）

## 逐字转写

> 状态：待转写。运行 `Tools/transcribe/transcribe.ps1 -Bvid BV1q4421A72h -Part 3` 补充。

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1q4421A72h-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **教程级增强**：含 Mermaid、Walkthrough、自测题（约 3225 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1q4421A72h-P03-cover.jpg|B站首帧 P03]]
