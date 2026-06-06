---
title: "P28 隐私集合求交 PSI"
source: "https://www.bilibili.com/video/BV1ser5BDESU?p=28"
up: "defa_pro"
tags: [数据要素, 隐私计算, 视频笔记, secretflow, SecretFlow]
duration: "23m06s"
cid: 35372008571
created: 2026-06-06
updated: 2026-06-06
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: 944
---

# P28 隐私集合求交 PSI

← [[BV1ser5BDESU-总览]] | ← [[P27-密态计算单元SPU]] | 下一篇 → [[P29-安全协作查询语言SCQL]]

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | 隐私集合求交 PSI |
| 模块 | SecretFlow 生态 |
| 时长 | 23 分 06 秒 |
| 链接 | [B 站 P28](https://www.bilibili.com/video/BV1ser5BDESU?p=28) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：隐私集合求交 PSI
2. **模块定位**：SecretFlow 生态
3. **考试/实践侧重**：PSI 在 SecretFlow 中的实现、ECDH-PSI、KKRT
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「隐私集合求交 PSI」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

### 1. PSI 在 SecretFlow 中

SecretFlow 提供 **psi** 组件，支持两方/多方隐私集合求交，是纵向联邦、联合营销、样本对齐的**前置步骤**。

### 2. 组件接口（概念）

```python
from secretflow.psi import psi

result = psi(
    keys=['id'],
    receiver='alice',
    protocol='KKRT',  # 或 ECDH
    input_path=...,
)
```

### 3. 协议选择

| 协议 | 规模 | 安全 |
|------|------|------|
| ECDH-PSI | 中小规模 | 半诚实 |
| KKRT | 大规模 | 可扩展恶意安全 |
| 三方 PSI | 多源对齐 | 需诚实多数 |

### 4. 数据准备

- 主键统一格式（去空格、大小写、哈希）
- 去重、空值处理
- 输出交集 ID 列表供下游 SCQL/联邦使用

### 5. 与 Kuscia 集成

跨域 PSI 任务由 Kuscia 调度，各方数据不离开 Domain，仅交换协议消息，结果写入约定路径。

### 6. 考试/实践要点

- 完成一次两方 PSI 实验并记录耗时
- 说明 receiver 角色含义
- 分析 PSI 后数据量变化对建模的影响

### 7. 缓存

重复 PSI 任务可缓存交集结果（加密存储），注意过期与授权撤销。

### 8. 多方扩展

三方以上 PSI 拓扑复杂，常用星型协调者或逐对 PSI 组合。

### 9. 法律协议

PSI 前签署数据联合处理协议，明确交集用途、保留期限、销毁义务；技术协议与法律协议双轨并行。

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
| PSI | 两方集合交集不泄露差集 |
| PIR | 查询不泄露查询项 |

## 与前后分 P 的衔接

- ← **密态计算单元 SPU**（[[P27-密态计算单元SPU]]）
- → **安全协作查询语言 SCQL**（[[P29-安全协作查询语言SCQL]]）

## 来源说明

- ✅ B 站官方元数据（`Tools/BV1ser5BDESU-full.json`）
- ✅ 分 P 首帧封面（`Tools/bili-fetch/fetch-bilibili.js`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 944 字，2026-06-06）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/BV1ser5BDESU-P28-cover.jpg|B站首帧 P28]]
