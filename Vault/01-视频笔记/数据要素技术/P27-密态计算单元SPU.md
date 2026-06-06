---
title: "P27 密态计算单元 SPU"
source: "https://www.bilibili.com/video/BV1ser5BDESU?p=27"
up: "defa_pro"
tags: [数据要素, 隐私计算, 视频笔记, secretflow, SecretFlow]
duration: "20m31s"
cid: 35372008230
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 902
---

# P27 密态计算单元 SPU

← [[BV1ser5BDESU-总览]] | ← [[P26-隐私计算密码库YACL]] | 下一篇 → [[P28-隐私集合求交PSI]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 密态计算单元 SPU |
| 模块 | SecretFlow 生态 |
| 时长 | 20 分 31 秒 |
| 链接 | [B 站 P27](https://www.bilibili.com/video/BV1ser5BDESU?p=27) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：密态计算单元 SPU
2. **模块定位**：SecretFlow 生态
3. **考试/实践侧重**：SPU 密态虚拟机、MPC+FHE 混合、编译执行
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「密态计算单元 SPU」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

### 1. SPU 定义

**SPU**（Secure Processing Unit）是 SecretFlow 的密态计算虚拟机，将 Python/ JAX 风格计算编译为 MPC+FHE 混合协议，在多方间安全执行。

### 2. 执行流程

1. 前端捕获计算图（XLA/HLO）
2. 编译器将算子映射为 SPU 内核（秘密分享、HE 等）
3. 运行时协调多方通信执行协议
4. 输出秘密分享或加密结果，按需揭示

### 3. 支持的运算

- 算术：加、乘、矩阵乘
- 比较：小于、等于（电路或协议）
- 机器学习：逻辑回归、神经网络层
- 统计：均值、方差、相关系数

### 4. 性能优化

- 算子融合减少通信轮次
- 定点数模拟浮点
- 3PC 诚实多数协议降低开销
- 与 PYU 混合：非敏感部分明文执行

### 5. 典型用法

联合训练：各方特征/标签在 SPU 上完成前向反向；联邦推理：模型权重秘密分享后密态预测。

### 6. 考试/实践要点

- 解释 SPU 与 HEU 的分工
- 说明编译执行 vs 解释执行的优势
- 查阅文档中 SPU 支持的 ML 算子列表

### 7. 调试

SPU 仿真模式 log 协议轮次；生产关闭详细 log 防泄露中间值。

### 8. 算子扩展

自定义算子需实现 SPU kernel 注册；参考官方 logistic regression 示例。

### 9. 内存优化

SPU 多方通信与本地秘密分享占内存；大矩阵乘需分块（tile）执行，SecretFlow 部分算子已自动分块。

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
| 密态计算 | 密文状态下完成计算 |
| 密态胶囊 | 数据+策略+密钥封装单元 |

## 与前后分 P 的衔接

- ← **隐私计算密码库 YACL**（[[P26-隐私计算密码库YACL]]）
- → **隐私集合求交 PSI**（[[P28-隐私集合求交PSI]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1ser5BDESU-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 902 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1ser5BDESU-P27-cover.jpg|B站首帧 P27]]
