---
title: "P25 通用隐私计算框架 SecretFlow"
source: "https://www.bilibili.com/video/BV1ser5BDESU?p=25"
up: "defa_pro"
tags: [数据要素, 隐私计算, 视频笔记, secretflow, SecretFlow]
duration: "24m05s"
cid: 35372007939
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 834
---

# P25 通用隐私计算框架 SecretFlow

← [[BV1ser5BDESU-总览]] | ← [[P24-联邦学习FL]] | 下一篇 → [[P26-隐私计算密码库YACL]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 通用隐私计算框架 SecretFlow |
| 模块 | SecretFlow 生态 |
| 时长 | 24 分 05 秒 |
| 链接 | [B 站 P25](https://www.bilibili.com/video/BV1ser5BDESU?p=25) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：通用隐私计算框架 SecretFlow
2. **模块定位**：SecretFlow 生态
3. **考试/实践侧重**：SecretFlow 架构、Device 抽象、编程范式
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「通用隐私计算框架 SecretFlow」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

### 1. SecretFlow 定位

**SecretFlow**（隐语）是蚂蚁集团开源的通用隐私计算框架，统一编程接口支持 MPC、联邦学习、同态加密、TEE 等多种 Device，是数据要素流通的**计算引擎**。

官方文档：https://www.secretflow.org.cn/zh-CN/docs

### 2. 架构分层

| 层 | 组件 |
|------|------|
| 应用层 | SecretPad、业务 SDK |
| 算法层 | 联邦、MPC 算子、预处理 |
| 设备层 | SPU、HEU、PYU、TEEU |
| 密码层 | YACL |
| 编排层 | Kuscia |

### 3. Device 抽象

- **PYU**：明文 Python 单元，本地计算
- **SPU**：Secure Processing Unit，MPC+FHE 混合密态计算
- **HEU**：同态加密单元
- **TEEU**：TEE 执行单元

开发者用 `@sf.device` 装饰器将函数调度到不同设备，框架自动插入密码协议。

### 4. 编程范式

```python
# 概念示例
sf.init(['alice', 'bob'], ...)
spu = sf.SPU(spu_config)
@sf.device(spu)
def secure_add(x, y):
    return x + y
```

### 5. 部署模式

- 单机仿真（开发调试）
- 多节点集群（生产）
- K8s + Kuscia 跨域

### 6. 考试/实践要点

- 列举四种 Device 及适用场景
- 说明 SecretFlow 与联邦学习框架（FATE）的差异点
- 完成官方 Quick Start 跑通两方加法

### 7. 版本与社区

跟踪 GitHub secretflow/secretflow 发布说明；参与 Discussions 与 Issue。

### 8. 与 Spark 集成

大数据预处理用 Spark，敏感算子下沉 SPU，构建混合流水线。

### 9. 商业支持

生产部署建议购买商业技术支持；开源版适合研发，注意版本兼容矩阵（SecretFlow×Kuscia×SecretPad）。

## 关键术语

| 术语 | 说明 |
|------|------|
| 数据要素 | 可参与社会化配置、创造价值的数字化资源 |
| 隐私计算 | 数据可用不可见前提下实现协作计算的技术体系 |
| SPU | Secure Processing Unit |
| SCQL | Secure Collaborative Query Language |

## 与前后分 P 的衔接

- ← **联邦学习FL**（[[P24-联邦学习FL]]）
- → **隐私计算密码库 YACL**（[[P26-隐私计算密码库YACL]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1ser5BDESU-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 834 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1ser5BDESU-P25-cover.jpg|B站首帧 P25]]
