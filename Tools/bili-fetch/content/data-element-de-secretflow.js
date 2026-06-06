/** 数据要素技术 P25-P32 SecretFlow 生态 */
module.exports = {
  25: `### 1. SecretFlow 定位

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

开发者用 \`@sf.device\` 装饰器将函数调度到不同设备，框架自动插入密码协议。

### 4. 编程范式

\`\`\`python
# 概念示例
sf.init(['alice', 'bob'], ...)
spu = sf.SPU(spu_config)
@sf.device(spu)
def secure_add(x, y):
    return x + y
\`\`\`

### 5. 部署模式

- 单机仿真（开发调试）
- 多节点集群（生产）
- K8s + Kuscia 跨域

### 6. 考试/实践要点

- 列举四种 Device 及适用场景
- 说明 SecretFlow 与联邦学习框架（FATE）的差异点
- 完成官方 Quick Start 跑通两方加法`,

  26: `### 1. YACL 定位

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
- 解释为何需要独立密码库而非直接用 OpenSSL`,

  27: `### 1. SPU 定义

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
- 查阅文档中 SPU 支持的 ML 算子列表`,

  28: `### 1. PSI 在 SecretFlow 中

SecretFlow 提供 **psi** 组件，支持两方/多方隐私集合求交，是纵向联邦、联合营销、样本对齐的**前置步骤**。

### 2. 组件接口（概念）

\`\`\`python
from secretflow.psi import psi

result = psi(
    keys=['id'],
    receiver='alice',
    protocol='KKRT',  # 或 ECDH
    input_path=...,
)
\`\`\`

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
- 分析 PSI 后数据量变化对建模的影响`,

  29: `### 1. SCQL 定义

**SCQL**（Secure Collaborative Query Language）是面向多方数据的安全协作 SQL，语法类似 SQL，语义保证各参与方仅获知查询结果中**自己有权限的部分**，不泄露其他方私有数据。

### 2. 支持的操作

| 操作 | 安全语义 |
|------|----------|
| SELECT | 投影列受策略限制 |
| JOIN | 等值连接不暴露非匹配行 |
| GROUP BY | 聚合结果满足最小计数阈值 |
| WHERE | 过滤条件密态或明文协作 |

### 3. 查询编译

SCQL 引擎将 SQL 解析为**执行计划**，算子映射到 PSI、MPC、明文算子组合，优化通信与轮次。

### 4. 权限模型

- **列级权限**：哪些列可被哪些方出现在结果中
- **行级策略**：最小群体大小（防重识别）
- **结果方**：指定谁接收输出

### 5. 典型场景

跨企业客户画像查询、联合统计分析、监管报送（多方数据汇总）。

### 6. 考试/实践要点

- 写一条两方 JOIN 的 SCQL 示例
- 说明 SCQL 与联邦学习的互补关系
- 解释最小计数阈值对隐私的保护`,

  30: `### 1. Kuscia 定位

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
- 列举跨域部署的三项网络要求`,

  31: `### 1. SecretPad 定位

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
- 列举三类常用组件及输入输出`,

  32: `### 1. KusciaAPI 概述

**KusciaAPI** 提供 gRPC/HTTP 接口，供外部系统（SecretPad、业务中台、连接器）程序化提交跨域任务、查询状态、管理 Domain，实现**隐私计算即服务**。

### 2. 主要接口类别

| 类别 | 操作 |
|------|------|
| Job 管理 | CreateJob、QueryJob、StopJob |
| Domain 管理 | 注册、健康检查 |
| 数据管理 | 注册数据源、授权 |
| 证书 | 轮换、查询 |

### 3. 典型集成场景

- **可信数据空间连接器**调用 KusciaAPI 触发联合计算
- **调度系统**定时触发 PSI 对账 Job
- **CI/CD** 自动化测试隐私计算流水线

### 4. 调用流程示例

1. 客户端 mTLS 连接 Kuscia Master
2. CreateJob 传入 AppImage、参与方列表、输入输出 URI
3. 轮询 QueryJob 直至 Succeeded
4. 从约定 OSS/本地路径取结果

### 5. 错误处理

- 参与方未授权：Job 挂起，需人工审批
- 网络分区：重试与幂等 Job ID
- 资源不足：排队或扩容 Worker

### 6. 考试/实践要点

- 用伪代码描述 CreateJob 请求字段
- 说明 API 层与画布层的适用边界
- 设计连接器调用 KusciaAPI 的时序图`,
};
