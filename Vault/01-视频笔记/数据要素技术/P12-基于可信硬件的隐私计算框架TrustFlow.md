---
title: "P12 基于可信硬件的隐私计算框架TrustFlow"
source: "https://www.bilibili.com/video/BV1ser5BDESU?p=12"
up: "defa_pro"
tags: [数据要素, 隐私计算, 视频笔记, confidential, SecretFlow]
duration: "18m48s"
cid: 35371942471
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 814
---

# P12 基于可信硬件的隐私计算框架TrustFlow

← [[BV1ser5BDESU-总览]] | ← [[P11-深入理解TEEOSes]] | 下一篇 → [[P13-密态大模型]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 基于可信硬件的隐私计算框架TrustFlow |
| 模块 | 密态计算与TEE |
| 时长 | 18 分 48 秒 |
| 链接 | [B 站 P12](https://www.bilibili.com/video/BV1ser5BDESU?p=12) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：基于可信硬件的隐私计算框架TrustFlow
2. **模块定位**：密态计算与TEE
3. **考试/实践侧重**：TrustFlow 架构、硬件信任根、密态流水线
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「基于可信硬件的隐私计算框架TrustFlow」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

### 1. TrustFlow 定位

**TrustFlow** 是蚂蚁集团开源的基于可信硬件的隐私计算框架，与隐语 SecretFlow 互补：TrustFlow 侧重 **TEE 路线**，SecretFlow 侧重 **MPC/联邦** 路线。二者可组合构建混合信任。

### 2. 架构组件

| 组件 | 功能 |
|------|------|
| TEE Runtime | SGX/TrustZone Enclave 管理 |
| 密态流水线 | 数据进 Enclave → 计算 → 密态出 |
| 策略引擎 | 校验使用权限 |
| 密码模块 | 国密/国际算法、密钥协商 |
| 证明客户端 | 对接远程证明服务 |

### 3. 典型工作流

1. 数据提供方将数据加密上传
2. 使用方提交计算任务（SQL/Python/模型推理）
3. TrustFlow 验证双方身份与策略
4. 在 TEE 内解密计算，明文不离开 Enclave
5. 结果加密返回，写审计日志

### 4. 与 SecretFlow 集成思路

- 联邦学习的**安全聚合**可在 TEE 中执行
- 高敏感特征预处理用 TrustFlow，模型训练用联邦
- 统一身份与审计层，底层计算引擎可插拔

### 5. 选型建议

| 场景 | 推荐 |
|------|------|
| 单方持有数据、多方查询 | TEE |
| 多方各持数据、联合统计 | MPC/联邦 |
| 超高敏感+性能要求 | TEE + 硬件加速 |

### 6. 考试/实践要点

- 画出 TrustFlow 信任边界图
- 说明 TEE 路线对「诚实但好奇」对手的假设
- 对比 TrustFlow 与纯 MPC 在延迟上的差异

### 7. 部署拓扑

TrustFlow 可部署为边车（Sidecar）模式，与业务微服务共存。K8s 编排与机密容器 P16 结合。

### 8. 性能基准

TEE 内 AES-GCM 可达 GB/s 级；复杂 SQL 需向量化与索引优化，避免全表扫描进 Enclave。

### 9. 代码迁移

将现有 Python 数据处理脚本迁入 TrustFlow 需识别敏感算子边界；非敏感 ETL 仍可在明文环境完成，仅核心聚合进 TEE。

## 关键术语

| 术语 | 说明 |
|------|------|
| 数据要素 | 可参与社会化配置、创造价值的数字化资源 |
| 隐私计算 | 数据可用不可见前提下实现协作计算的技术体系 |
| 模块 | 密态计算与TEE |

## 与前后分 P 的衔接

- ← **深入理解TEE OSes**（[[P11-深入理解TEEOSes]]）
- → **密态大模型**（[[P13-密态大模型]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1ser5BDESU-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 814 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1ser5BDESU-P12-cover.jpg|B站首帧 P12]]
