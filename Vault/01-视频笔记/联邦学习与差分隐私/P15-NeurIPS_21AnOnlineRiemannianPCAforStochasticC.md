---
title: "P15 【NeurIPS_21】An Online Riemannian PCA for Stochastic CCA"
source: "https://www.bilibili.com/video/BV1q4421A72h?p=15"
up: "Proof-Trivial"
tags: [联邦学习, 差分隐私, 隐私计算, 视频笔记, papers, 教程级]
duration: "14m13s"
cid: 1433697321
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 教程级增强脚本"
status: 教程级已增强
source_type: 教程级知识点增强
detail_level: 教程级
word_count: 2724
transcript_engine: 
transcript_status: 待转写
---

# P15 【NeurIPS_21】An Online Riemannian PCA for Stochastic CCA

← [[BV1q4421A72h-总览]] | ← [[P14-ICML_22PeterRichtarik联邦学习中本地梯度步骤可证明导致通信加速]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 【NeurIPS_21】An Online Riemannian PCA for Stochastic CCA |
| 模块 | 前沿论文 |
| 时长 | 14 分 13 秒 |
| 链接 | [B 站 P15](https://www.bilibili.com/video/BV1q4421A72h?p=15) |
| 内容来源 | 教程级知识点增强（非 UP 逐字转写） |

## 核心要点

1. **本 P 主题**：【NeurIPS_21】An Online Riemannian PCA for Stochastic CCA
2. **模块定位**：前沿论文
3. **研读侧重**：Stiefel 流形、黎曼 PCA、在线随机 CCA
4. **笔记层级**：教程级（约 2724 字），含速览、Mermaid、Walkthrough、自测题
5. **学习建议**：先读「3 分钟速览」与「图解」，再深入「详细讲解」

> 以下内容基于联邦学习、差分隐私与协作学习理论体系撰写，对应 B 站分 P「【NeurIPS_21】An Online Riemannian PCA for Stochastic CCA」。**非 UP 逐字转写**；不看视频可建立框架，看视频对照「与视频对照表」。

## 本节在系列中的位置

**模块**：前沿论文 · **P15/15**（NeurIPS 2021）。

**前置**：[[P05-可扩展且保护隐私的联邦主成分分析]]（联邦降维基础）。

**后续**：回到 [[BV1q4421A72h-总览]] 做全系列复盘。

## 3 分钟速览

Online Riemannian PCA for Stochastic CCA：Stiefel 流形、黎曼梯度、收缩更新、在线随机 CCA、联邦多视图扩展。

## 零基础导读

本集进入**流形优化**。若未学黎曼几何，先掌握：正交约束 → 用黎曼梯度+收缩代替欧氏更新；再读与 P05 联邦 PCA 的异同。

## 详细讲解

### 1. 问题：随机典型相关分析（Stochastic CCA）

典型相关分析（CCA）求两组特征的最大相关投影方向。**随机/在线 CCA**：数据流式到达，需在线更新投影矩阵。应用：多视图学习、联邦双方特征融合、神经科学 fMRI-行为关联。

### 2. 为何在黎曼流形上建模

投影矩阵 $U$ 满足正交约束 $U^\top U = I$，自然生活在 **Stiefel 流形** $\mathrm{St}(d,r)$ 上，而非欧氏空间。欧氏梯度下降会破坏正交性，需**黎曼梯度**与**收缩（Retraction）**。

### 3. Online Riemannian PCA 核心思想

论文 *An Online Riemannian PCA for Stochastic CCA*（NeurIPS 2021）将：
- **PCA 子问题**放在 Stiefel 流形上在线更新
- 与 **CCA 目标**交替或嵌套优化
- 利用**随机梯度**与**方差缩减**处理大数据流

### 4. 黎曼优化基础

| 概念 | 欧氏 | 黎曼 |
|------|------|------|
| 梯度 | $\nabla f(w)$ | $\text{grad} f(U)$ |
| 更新 | $w - \eta \nabla f$ | Retraction$_U(-\eta \text{grad})$ |
| 正交性 | 需投影回流形 | 内建于收缩 |

常用收缩：QR 分解、Polar 分解、Cayley 变换。

### 5. 随机 CCA 目标（简化）

给定双流 $x_t \in \mathbb{R}^{d_1}$，$y_t \in \mathbb{R}^{d_2}$，求 $U, V$ 最大化相关：
$$\max \mathbb{E}[\|U^\top x_t\|^2] \text{ s.t. } \mathbb{E}[(U^\top x_t)(V^\top y_t)^\top] \text{ 相关最大化}$$

实际转为带协方差估计的优化，样本协方差用**在线平均**更新。

### 6. 与联邦 PCA（P05）的进阶关系

| | P05 联邦 PCA | P15 Riemannian 在线 CCA |
|--|--------------|-------------------------|
| 约束 | 线性子空间 | 正交投影流形 |
| 数据 | 批量/多轮联邦 | 随机/在线 |
| 方法 | 幂迭代+SecAgg | 黎曼 SGD |
| 输出 | 主成分方向 | 典型相关方向 |

联邦场景可扩展：各方本地流式更新，聚合**充分统计量**或**黎曼梯度**（需 SecAgg）。

### 7. 实现要点

- 维护 $U \in \mathrm{St}(d,r)$ 的矩阵表示
- 每步：估计随机梯度 → 黎曼梯度 → Cayley/QR 收缩
- 监控正交性数值误差 $|U^\top U - I|_F$
- 与 PyManopt、Geoopt 等库对照验证

### 8. 应用场景

- **联邦多视图**：医院影像特征 + 基因特征在线对齐
- **推荐系统**：用户行为与商品嵌入相关分析
- **脑机接口**：神经信号与运动意图流式解码

### 9. 本集学习要点

- 说明为何 PCA/CCA 投影矩阵需黎曼优化
- 对比欧氏 GD 与黎曼收缩更新
- 联系 P05 联邦 PCA 与 P15 在线流形 CCA 的异同

### 联邦 + 在线 CCA 设想

各方本地算黎曼梯度 $g_k$，SecAgg 聚合后统一收缩更新全局 $U$——需注意异质分布下全局 CCA 方向解释。

## 图解

```mermaid
flowchart LR
  Ut[U on Stiefel] --> Rgrad[黎曼梯度]
  Rgrad --> retract[Cayley收缩]
  retract --> Ut1[U_{t+1}]
  CCA[随机CCA目标] --> Rgrad
```

## 类比与直觉

黎曼优化像**在球面上走路**：不能笔直穿球心，必须沿球面切线方向迈步（黎曼梯度），再用收缩把你「贴回」球面。

## 例题与场景 Walkthrough

**Geoopt/PyManopt 验证步骤**

1. 生成合成双流数据 $(x_t,y_t)$。
2. 初始化 $U\in\mathrm{St}(d,r)$。
3. 实现 Cayley 收缩更新。
4. 监控 $|U^\top U-I|$ 与目标值。
5. 对比欧氏 GD（应破坏正交性）。

## 常见误区

1. **欧氏 GD+投影足够**：步长难选，收缩更稳。
2. **CCA 与 PCA 相同**：CCA 最大化跨视图相关。
3. **与联邦无关**：可联邦聚合黎曼梯度或统计量。

## 与视频对照表

| 视频段落（约） | 预期演示内容 | 笔记对应章节 |
|-------------|------------|------------|
| 开篇 0%–15% | 本集目标、背景、与前后集关系 | 本节位置、3 分钟速览 |
| 前段 15%–40% | 核心概念定义与架构图 | 零基础导读、详细讲解 |
| 中段 40%–70% | 原理展开、对比、政策/代码示例 | 图解、类比、Walkthrough |
| 后段 70%–90% | 案例、问答、易错点 | 常见误区、Checklist |
| 收尾 90%–100% | 总结、延伸资源 | 延伸阅读、自测题 |

> 本集总时长约 **14分13秒**。无官方外挂字幕时，以分 P 标题「【NeurIPS_21】An Online Riemannian PCA for Stochastic CCA」与上表主题对齐视频画面。

## 动手实践 Checklist

- [ ] 读 NeurIPS 2021 论文摘要
- [ ] 运行 Geoopt Stiefel 示例
- [ ] 对比幂迭代 PCA 与黎曼 PCA
- [ ] 写多视图联邦场景 200 字
- [ ] 系列总复盘

## 延伸阅读

- Absil et al., Optimization on Matrix Manifolds
- Geoopt 文档
- [[P05-可扩展且保护隐私的联邦主成分分析]]

## 自测题

1. **Stiefel 流形？**  **答**：$U^\top U=I$ 的矩阵集合。
2. **收缩作用？**  **答**：更新后仍满足正交约束。
3. **随机 CCA？**  **答**：数据流式，在线更新投影。
4. **与 P05？**  **答**：P05 欧氏联邦 PCA，P15 流形在线 CCA。
5. **联邦扩展？**  **答**：SecAgg 聚合黎曼梯度或充分统计。

## 关键术语

| 术语 | 说明 |
|------|------|
| 联邦学习 FL | 数据不出本地，协作训练全局模型 |
| 差分隐私 DP | 单条记录变化对输出分布影响有界 |
| Stiefel 流形 | 正交矩阵约束的流形 |
| CCA | 典型相关分析 |

## 与前后分 P 的衔接

- ← **【ICML_22】【Peter Richtarik】联邦学习中本地梯度步骤可证明导致通信加速**（[[P14-ICML_22PeterRichtarik联邦学习中本地梯度步骤可证明导致通信加速]]）
- → 系列终点，建议回到总览复盘

## 逐字转写

> 状态：待转写。运行 `Tools/transcribe/transcribe.ps1 -Bvid BV1q4421A72h -Part 15` 补充。

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1q4421A72h-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **教程级增强**：含 Mermaid、Walkthrough、自测题（约 2724 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1q4421A72h-P15-cover.jpg|B站首帧 P15]]
