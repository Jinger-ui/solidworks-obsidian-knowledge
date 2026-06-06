---
title: "P26 隐私计算密码库 YACL"
source: "https://www.bilibili.com/video/BV1ser5BDESU?p=26"
up: "defa_pro"
tags: [数据要素, 隐私计算, 视频笔记, secretflow, SecretFlow]
duration: "21m49s"
cid: 35372008301
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 1014
---

# P26 隐私计算密码库 YACL

← [[BV1ser5BDESU-总览]] | ← [[P25-通用隐私计算框架SecretFlow]] | 下一篇 → [[P27-密态计算单元SPU]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 隐私计算密码库 YACL |
| 模块 | SecretFlow 生态 |
| 时长 | 21 分 49 秒 |
| 链接 | [B 站 P26](https://www.bilibili.com/video/BV1ser5BDESU?p=26) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：隐私计算密码库 YACL
2. **模块定位**：SecretFlow 生态
3. **考试/实践侧重**：YACL 密码原语、OT、PRF、同态算子
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「隐私计算密码库 YACL」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

### 1. YACL 定位

**YACL**（Yet Another Crypto Library）是隐语底层隐私计算密码库，提供 OT、PRF、哈希、对称加密、同态算子、随机数等原语，供 SPU、PSI、SCQL 等上层组件调用。

### 2. 核心模块

| 模块 | 功能 |
|------|------|
| crypto tools | AES、SM4、SHA、HMAC |
| ECC/DH | 密钥交换 |
| OT/VOLE | 不经意传输及扩展 |
| PRF/OPRF | 伪随机函数，PSI 基础 |
| HE ops | 同态加乘接口 |
| RPCH | 随机置换哈希 |

### 3. 设计原则

- **可组合**：原语可拼装为 PSI、MPC 协议
- **高性能**：SIMD、多线程、GPU 加速（部分）
- **国密支持**：SM2/SM3/SM4 满足国内合规
- **可证明安全**：参数选择遵循标准建议

### 4. 与 OpenSSL 关系

YACL 专注隐私计算协议所需原语，不替代通用 TLS。通信层仍用 TLS/mTLS，计算层用 YACL。

### 5. 开发者使用

一般通过 SPU/PSI 高级 API 间接使用 YACL；底层扩展新协议时需直接调用 YACL 原语并注意侧信道安全。

### 6. 考试/实践要点

- 说明 OT 在 PSI 中的作用
- 列举 YACL 三大设计原则
- 解释为何需要独立密码库而非直接用 OpenSSL

### 7. 贡献指南

向 YACL 提交 PR 需通过单元测试与侧信道审查 checklist。

### 8. 硬件加速

AES-NI、AVX-512 自动检测；OT 批量处理提升 PSI 吞吐。

### 9. 随机数

MPC 安全依赖 CSPRNG；YACL 提供熵源检测，生产环境禁用弱随机（/dev/random 阻塞处理）。

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

- ← **通用隐私计算框架 SecretFlow**（[[P25-通用隐私计算框架SecretFlow]]）
- → **密态计算单元 SPU**（[[P27-密态计算单元SPU]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1ser5BDESU-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 1014 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1ser5BDESU-P26-cover.jpg|B站首帧 P26]]
