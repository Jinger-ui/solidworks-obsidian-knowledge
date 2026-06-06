/**
 * 生成教程级分页深化内容 data-element/dsp/sw-tutorial-detail.js
 * Usage: node generate-tutorial-details.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'content');

function writeModule(filename, obj) {
  const keys = Object.keys(obj).sort((a, b) => Number(a) - Number(b));
  const lines = keys.map((k) => {
    const v = obj[k].replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    return `  ${k}: \`${v}\`,`;
  });
  const content = `/** 教程级深化内容 - 由 generate-tutorial-details.js 生成 */\nmodule.exports = {\n${lines.join('\n')}\n};\n`;
  fs.writeFileSync(path.join(OUT, filename), content, 'utf8');
  console.log(`Wrote ${filename} (${keys.length} pages)`);
}

// ─── 数据要素 47P ───
const deData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'BV1ser5BDESU-full.json'), 'utf8'));

function deTheme(page) {
  if (page <= 6) return '政策与安全治理';
  if (page <= 8) return '可信数据空间标准';
  if (page <= 17) return '密态计算与 TEE';
  if (page === 18) return '可信数据空间连接器';
  if (page <= 24) return '隐私计算核心技术';
  if (page <= 32) return 'SecretFlow 生态';
  if (page <= 38) return '数据元件·区块链·数联网';
  return '行业实践案例';
}

const deExamTips = {
  1: '二十条意见、数据二十条、供得出流得动用得好保安全四原则',
  2: '公共数据授权运营、三权分置、运营机构职责',
  3: '数据安全法、个保法、网络安全法层级关系与核心义务',
  4: '匿名化与去标识化区别、k-匿名、l-多样性、t-接近性',
  5: '流通前评估、分类分级、技术+制度协同治理',
  6: '隐私计算产品安全能力分级、基础/增强/高安全等级',
  7: '可信数据空间标准体系、参与方、功能架构',
  8: '身份认证、使用控制、审计溯源、互联互通',
  9: '密态计算定义、与隐私计算关系、密文计算场景',
  10: '密态胶囊、数据封装、策略绑定、密钥管理',
  11: 'TEE 原理、Intel SGX/ARM TrustZone、Enclave',
  12: 'TrustFlow 架构、硬件信任根、密态流水线',
  13: '密态大模型推理、模型权重保护、TEE+加密',
  14: '密态大数据平台、存储计算分离、全链路加密',
  15: 'GPU-TEE、HyperGPU、AI 密态训练推理',
  16: '机密容器、Kata/TEE 容器、Kubernetes 集成',
  17: '远程证明、Attestation、信任链、星绽服务',
  18: '连接器功能、数据产品登记、策略执行、合约',
  19: 'MPC 定义、秘密分享、混淆电路、半诚实/恶意模型',
  20: 'FHE 原理、部分/全同态、Bootstrapping、性能瓶颈',
  21: 'PSI 协议、OT 基础、匿踪查询 PIR',
  22: 'ZK 完备性/可靠性/零知识性、SNARK/STARK',
  23: 'ε-差分隐私、敏感度、拉普拉斯/高斯机制',
  24: '横向/纵向/联邦迁移学习、FedAvg、安全聚合',
  25: 'SecretFlow 架构、Device 抽象、编程范式',
  26: 'YACL 密码原语、OT、PRF、同态算子',
  27: 'SPU 密态虚拟机、MPC+FHE 混合、编译执行',
  28: 'PSI 在 SecretFlow 中的实现、ECDH-PSI、KKRT',
  29: 'SCQL 语法、安全多方 SQL、权限策略',
  30: 'Kuscia 任务编排、Domain、跨域调度',
  31: 'SecretPad 可视化、项目/参与方/组件',
  32: 'KusciaAPI、gRPC、任务提交与状态查询',
  33: '数据元件概念、标准化封装、流通交易',
  34: '区块链基础、联盟链、智能合约、数据确权',
  35: '链上链下协同、存证、数据交易撮合',
  36: 'ZK 在区块链中的应用、隐私交易、可验证计算',
  37: '数联网架构、数据空间互联、标识解析',
  38: '数场技术、数据集市、供需匹配',
  39: '医疗联邦学习案例、特征工程、模型评估',
  40: '金融风控联合建模、样本对齐、评分卡',
  41: '跨企业 SCQL 查询、权限最小化',
  42: '运营商 PSI 对账、跨域结算、精度校验',
  43: '医疗数据协作架构、合规要求、隐语部署',
  44: '车险联合定价、多维数据融合、定价模型',
  45: '汽车行业可信数据空间、流通赋能',
  46: '车险密态计算、TEE 推理、行业前景',
  47: '普惠信贷多方建模、小微信贷、风控增强',
};

const deMermaid = {
  1: `flowchart LR\n  subgraph 四原则\n    A[供得出] --> B[流得动]\n    B --> C[用得好]\n    C --> D[保安全]\n  end\n  P01[数据二十条] --> A\n  P01 --> 产权[三权分置]`,
  25: `flowchart TB\n  subgraph 应用层\n    SP[SecretPad]\n  end\n  subgraph 算法层\n    FL[联邦学习]\n    MPC[MPC算子]\n  end\n  subgraph 设备层\n    PYU[PYU明文]\n    SPU[SPU密态]\n    HEU[HEU同态]\n    TEEU[TEEU]\n  end\n  YACL[YACL] --> SPU\n  Kuscia[Kuscia编排] --> SP`,
  19: `sequenceDiagram\n  participant A as 参与方A\n  participant B as 参与方B\n  participant P as MPC协议\n  A->>P: 秘密分享x\n  B->>P: 秘密分享y\n  P->>P: 安全计算f(x,y)\n  P-->>A: 结果份额\n  P-->>B: 结果份额`,
  39: `flowchart LR\n  H1[医院A特征] --> FL[联邦训练]\n  H2[医院B特征] --> FL\n  FL --> M[重病预测模型]\n  M --> API[合规推理服务]`,
};

const deExtra = {
  25: `### 为什么需要 SecretFlow（而非裸 MPC 库）

裸 MPC 库（如 EMP-toolkit）提供密码协议原语，但**不解决**多方异构环境、设备抽象、任务编排、可视化运维等企业落地问题。SecretFlow 的价值在于：

1. **统一编程范式**：同一套 Python 代码可在 PYU/SPU/HEU/TEEU 间切换，降低算法工程师学习成本。
2. **与联邦学习融合**：不仅做两方加法，还覆盖纵向/横向联邦、安全聚合、预处理流水线。
3. **生产级编排**：Kuscia 支持 K8s 跨域调度，SecretPad 降低业务方门槛。
4. **国密与合规**：YACL 支持 SM 系列算法，便于国内金融、政务场景。

与 **FATE** 对比：FATE 侧重联邦学习流水线；SecretFlow 覆盖 MPC+FL+HE+TEE 更广谱，且 SPU 编译执行是差异化能力。

### PYU / SPU / HEU / TEEU 选型表

| Device | 适用场景 | 典型算子 | 性能 | 安全假设 |
|--------|----------|----------|------|----------|
| PYU | 单方明文预处理、非敏感特征 | pandas 清洗、编码 | 最快 | 无密码保护 |
| SPU | 多方联合统计、ML 训练推理 | 矩阵乘、比较、逻辑回归 | 中（通信密集） | 半诚实/诚实多数 |
| HEU | 单方加密外包计算、少量密态乘 | 密态求和、浅层乘 | 慢（密文膨胀） | 依赖 HE 方案强度 |
| TEEU | 低延迟推理、模型权重保护 | 大模型推理、规则引擎 | 快（硬件依赖） | 信任硬件厂商 |

### 最小联邦学习流程（伪代码）

\`\`\`python
import secretflow as sf
sf.init(parties=['bank', 'ecom'], address='...')

# 各方本地 PYU 读数据
bank_data = sf.PYU('bank')(load_data)()
ecom_data = sf.PYU('ecom')(load_data)()

# 敏感梯度在 SPU 上安全聚合
spu = sf.SPU(spu_conf)
@sf.device(spu)
def secure_train_step(grad_a, grad_b):
    return (grad_a + grad_b) / 2

for epoch in range(E):
    ga = sf.PYU('bank')(local_train)(bank_data)
    gb = sf.PYU('ecom')(local_train)(ecom_data)
    g_avg = secure_train_step(ga, gb)
    sf.PYU('bank')(apply_grad)(g_avg)
    sf.PYU('ecom')(apply_grad)(g_avg)
\`\`\`

### 金融/医疗场景映射

| 场景 | 数据形态 | 推荐组件 | 说明 |
|------|----------|----------|------|
| 银行+电商联合风控 | 纵向表 | SecretFlow FL + PSI 对齐 | 样本 ID 先 PSI，再纵向训练 |
| 多家医院重病预测 | 横向表 | FedAvg + 安全聚合 | 同特征不同患者 |
| 医保统计查询 | SQL 聚合 | SCQL | 最小权限列级控制 |
| 理赔模型推理 | 模型权重 | TEEU / 密态推理 | 权重不出域 |

### 安装入门

1. 访问 https://www.secretflow.org.cn/zh-CN/docs 选择「安装部署」
2. 开发机可用 Docker 单机仿真模式
3. 跑通 Quick Start 两方加法后，再试联邦逻辑回归示例
4. 生产环境规划 Kuscia Domain 与网络互通`,
};

function buildDeDetail(page, part, prevPart, nextPart) {
  const short = part.replace(/^\d+_/, '');
  const theme = deTheme(page);
  const exam = deExamTips[page] || '对照视频与文档';
  const prev = prevPart ? prevPart.replace(/^\d+_/, '') : null;
  const next = nextPart ? nextPart.replace(/^\d+_/, '') : null;
  const p = deData.parts.find((x) => x.page === page);

  const quick = `**${short}** 是数据要素流通体系中的关键一课。读完本节你应能回答：① 核心概念定义；② 在「供得出—流得动—用得好—保安全」链条中的位置；③ 与隐私计算技术栈的衔接。考试/面试侧重：**${exam}**。`;

  const intro = `本节「${short}」属于 **${theme}**。即便未看视频，也应先建立**制度—技术—场景**三层视角：政策类章节回答「为什么允许流」；技术类章节回答「如何安全地算」；案例类章节回答「真实行业怎么落地」。

第一遍阅读请盯住三个问题：本集**解决什么痛点**？**关键参与方**是谁？**交付物或能力边界**是什么？第二遍阅读时，把术语表抄到 Obsidian 双链笔记，与前后分 P 交叉引用。`;

  const walkPolicy = `**场景：某市大数据局推进公共数据授权运营**

- **政策依据**：数据二十条、公共数据授权运营规范。
- **供得出**：交通局提供路况统计、医保局提供脱敏就诊汇总——先进目录、分级。
- **流得动**：通过可信数据空间连接器登记数据产品，API 或隐私计算方式交付。
- **用得好**：创业公司将路况+人口统计做成选址 SaaS。
- **保安全**：原始明细不出域；运营机构留存审计日志；使用方签署用途限制。
- **本集切入点**：${short} 主要约束上述链条中的 **${theme.split('·')[0]}** 环节。`;

  const walkTech = `**场景：两家机构联合建模（不共享明文）**

1. **样本对齐**：若双方仅有交集用户有价值，先用 PSI（P21/P28）对齐 ID。
2. **特征拼接**：纵向联邦（P24）下 A 方持标签、B 方持特征，梯度通过安全聚合更新。
3. **训练执行**：在 SecretFlow SPU（P27）上完成密态前向/反向，或 TEE 内明文训练（P11–P17）。
4. **模型发布**：输出评分服务；模型参数经评估后按需出域，训练数据永不出域。
5. **本集关联**：${short} 提供其中 **${exam.split('、')[0]}** 能力。`;

  const walk = theme.includes('政策') || (page <= 6)
    ? walkPolicy
    : page >= 39
      ? `**行业复盘：${short}**\n\n${walkTech}\n\n额外关注：行业监管口径（金融银保监会、医疗卫健委）、数据最小必要、个人信息影响评估、模型可解释性与备案要求。`
      : walkTech;

  const myths = `1. **「学完本集就会用隐语」**：SecretFlow 生态需多集串联（P19–P32），单集只是拼图一块。\n2. **「隐私计算等于不上传数据」**：数据仍以密文、份额或授权方式参与计算，网络与算力开销客观存在。\n3. **「TEE 绝对安全」**：TEE 依赖硬件与侧信道防护，需远程证明（P17）与补丁策略。\n4. **「区块链解决一切确权」**：链适合存证与交易撮合，大规模计算仍在链下隐私计算引擎。`;

  const quiz = `1. **本集核心考点？**  \n   **答**：${exam}。\n\n2. **本集在四原则中的位置？**  \n   **答**：${page <= 6 ? '主要对应制度与治理（供得出/保安全）' : page <= 18 ? '偏流得动基础设施' : page <= 32 ? '保安全的技术实现' : '用得好+行业落地'}。\n\n3. **与 SecretFlow 的关系？**  \n   **答**：${page >= 25 && page <= 32 ? '本集直接讲隐语组件' : page >= 19 ? '为 SecretFlow 提供密码学/算法基础' : '提供合规与架构前提，后续技术集在其上落地'}。\n\n4. **一项落地检查？**  \n   **答**：是否有授权、是否最小必要、是否可审计——三者缺一不可。\n\n5. **30 秒口述本集？**  \n   **答**：用「输入→处理→输出」各一句话概括（见 Walkthrough）。`;

  const checklist = page === 25
    ? `- [ ] 打开 https://www.secretflow.org.cn/zh-CN/docs 阅读「快速开始」\n- [ ] Docker 拉起单机仿真，跑通两方加法\n- [ ] 手绘 Device 四层架构图（PYU/SPU/HEU/TEEU）\n- [ ] 列出金融/医疗场景各 1 条到组件的映射\n- [ ] 阅读 Kuscia 与 SecretPad 简介页，理解分工`
    : page >= 25 && page <= 32
      ? `- [ ] 在 SecretFlow 文档搜索本集关键词（如 ${exam.split('、')[0]}）\n- [ ] 找到对应 API/组件的配置示例\n- [ ] 在 SecretPad 或脚本中定位该组件所处菜单/模块\n- [ ] 复现文档最小示例或记录阻塞问题\n- [ ] 与 P25 总架构图对照标注本集位置`
      : page <= 6
        ? `- [ ] 精读数据二十条原文 1 遍（国务院公报）\n- [ ] 制作「三法」义务对照表\n- [ ] 写出四原则各 1 个本地案例\n- [ ] 与合规同事确认 1 个业务的数据分类分级\n- [ ] 完成 5 道自测并口述给同事听`
        : `- [ ] 复述本集 3 个定义（不看笔记）\n- [ ] 根据 Walkthrough 写 200 字场景短文\n- [ ] 对照视频确认 1 个架构图/演示\n- [ ] 在总览思维导图中标注本集节点\n- [ ] 完成自测 Q1/Q5`;

  const reading = page === 25
    ? '- [SecretFlow 安装与快速开始](https://www.secretflow.org.cn/zh-CN/docs/secretflow/latest/zh-cn/getting_started)\n- [SPU 开发指南](https://www.secretflow.org.cn/zh-CN/docs/spu/latest/zh-cn/)\n- [Kuscia 部署](https://www.secretflow.org.cn/zh-CN/docs/kuscia/latest/zh-cn/)\n- 对比阅读：FATE 官方文档「联邦学习组件」章节'
    : page >= 19 && page <= 24
      ? '- 《隐私计算白皮书》对应章节\n- SecretFlow 文档「组件」- 密码学基础\n- 学术论文：FedAvg、CKKS、ECDH-PSI 原始论文摘要'
      : page <= 6
        ? '- 国务院「关于构建数据基础制度更好发挥数据要素作用的意见」\n- 《数据安全法》《个人信息保护法》\n- 国家数据局「数据要素×」行动计划'
        : '- [SecretFlow 文档中心](https://www.secretflow.org.cn/zh-CN/docs)\n- TC609 可信数据空间相关标准\n- 本系列相邻 2 个分 P 笔记';

  return {
    position: `**模块**：${theme} · 系列第 **P${String(page).padStart(2, '0')}/47** 集。\n\n${prev ? `**建议前置**：[[${prev}]]——建立本集所需背景。` : '**系列起点**：建议先浏览 [[BV1ser5BDESU-总览]] 把握 47 集路线图。'}\n\n${next ? `**建议后续**：[[${next}]]——在本集能力之上继续深入。` : '**模块终点**：回顾 [[思维导图]] 做模块级复盘。'}\n\n依赖关系：政策(P01–P06) → 可信空间(P07–P08,P18) → 密态/隐私技术(P09–P24) → SecretFlow 工程(P25–P32) → 基础设施与案例(P33–P47)。`,
    quickSummary: quick,
    zeroBaseIntro: intro,
    walkthrough: walk,
    misconceptions: myths,
    quiz,
    checklist,
    furtherReading: reading,
    mermaid: deMermaid[page] || undefined,
    extraDetail: deExtra[page] || (page >= 25 && page <= 32
      ? `### 工程落地提示（${short}）\n\n学习本集时请在 SecretFlow 文档中打开对应组件页，边读边在架构图中**标注位置**。生产部署需同时考虑：网络互通（mTLS）、参与方 Domain 隔离、任务失败重试、审计日志留存。开发阶段优先用单机仿真验证逻辑，再迁移 Kuscia 集群。`
      : page >= 39
        ? `### 案例精读建议\n\n阅读行业案例时采用 **STAR**：Situation（监管与痛点）、Task（业务目标）、Action（技术选型与过程）、Result（指标与合规结论）。将本集案例与您单位场景对比，列出 3 条可借鉴与 3 条不可照搬的理由。`
        : `### 深化理解（${short}）\n\n将本节概念放入「数据二十条」四原则框架：它主要支撑哪一条原则？若去掉该能力，哪类数据流通场景会受阻？用一句话向非技术经理解释本节价值。`),
  };
}

const deDetails = {};
deData.parts.forEach((p, idx) => {
  const prev = idx > 0 ? deData.parts[idx - 1].part : null;
  const next = idx < deData.parts.length - 1 ? deData.parts[idx + 1].part : null;
  deDetails[p.page] = JSON.stringify(buildDeDetail(p.page, p.part, prev, next))
    .slice(1, -1) // not needed - buildDeDetail returns object
    ;
});
// Fix: store objects not JSON strings
deData.parts.forEach((p, idx) => {
  const prev = idx > 0 ? deData.parts[idx - 1].part : null;
  const next = idx < deData.parts.length - 1 ? deData.parts[idx + 1].part : null;
  const d = buildDeDetail(p.page, p.part, prev, next);
  // flatten object to template string sections joined
  deDetails[p.page] = Object.entries(d).map(([k, v]) => `<!-- ${k} -->\n${v}`).join('\n\n');
});
// Actually we need structured object for framework - rewrite write to use objects

// Rebuild properly as structured sections for framework consumption
const deDetailObj = {};
deData.parts.forEach((p, idx) => {
  const prev = idx > 0 ? deData.parts[idx - 1].part : null;
  const next = idx < deData.parts.length - 1 ? deData.parts[idx + 1].part : null;
  deDetailObj[p.page] = buildDeDetail(p.page, p.part, prev, next);
});

// ─── DSP 44P ───
const dspData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'BV127411M7BU-full.json'), 'utf8'));

function dspChapter(page) {
  if (page <= 9) return { num: 1, name: '离散时间信号与系统' };
  if (page <= 21) return { num: 2, name: 'z 变换与频域分析' };
  if (page <= 28) return { num: 3, name: '离散傅里叶变换（DFT）' };
  if (page <= 30) return { num: 4, name: '快速傅里叶变换（FFT）' };
  if (page <= 33) return { num: 5, name: '离散时间系统结构与实现' };
  if (page <= 40) return { num: 6, name: 'IIR 数字滤波器设计' };
  return { num: 7, name: 'FIR 数字滤波器设计' };
}

const dspExam = {
  1: '信号分类、LTI 框架、与信号与系统衔接', 2: '序列三种表示、因果性、箭头标注',
  3: '典型序列定义、移位翻转运算', 4: '有限长卷积计算（竖线法）', 5: '系统五性质判定',
  6: 'LTI 定义、卷积求输出', 7: '因果性与 BIBO 稳定性（必考）', 8: '差分方程与 H(z)、求 h(n)',
  9: '奈奎斯特定理、混叠', 10: 'DTFT 定义与典型对', 11: 'DTFT 性质（时移、卷积）',
  12: 'Z 变换定义、ROC', 13: 'ROC 性质、极点与稳定', 14: 'Z 变换解差分方程',
  15: 'Z 变换性质、初值终值定理', 16: '观察法 Z 反变换', 17: '留数法',
  18: '部分分式展开', 19: '零极点与因果稳定', 20: 'H(e^jω) 与滤波类型',
  21: '零极点矢量几何法', 22: 'DFT/IDFT 定义', 23: '周期延拓、循环移位',
  24: '旋转因子 W_N', 25: '循环移位性质', 26: '循环卷积 vs 线性卷积',
  27: 'DFT 共轭对称性', 28: '频率域采样定理', 29: 'DIT 基 2 FFT 流图',
  30: 'DIF 基 2 FFT', 31: '模拟-离散对应', 32: '直接/级联/并联结构',
  33: '信号流图', 34: '巴特沃斯设计', 35: 'IIR/FIR 对比',
  36: '脉冲响应不变法', 37: '双线性变换与预畸变', 38: '高通频率变换',
  39: '带通频率变换', 40: 'IIR 网络结构', 41: 'FIR 线性相位',
  42: '四类线性相位 FIR', 43: '窗函数法', 44: '频率采样法',
};

function buildDspDetail(page, part, prevPart, nextPart) {
  const ch = dspChapter(page);
  const exam = dspExam[page] || '对照教材';
  const prev = prevPart || null;
  const next = nextPart || null;

  return {
    position: `**章节**：第 ${ch.num} 章「${ch.name}」· P${String(page).padStart(2, '0')}/44。\n\n${prev ? `**前置**：建议掌握「${prev}」中的公式与定义。` : '**课程起点**：先读 [[BV127411M7BU-总览]]。'}\n\n${next ? `**后续**：「${next}」将在此基础上延伸。` : '**第 7 章终点**：建议做一套历年 DSP 考研真题。'}`,
    quickSummary: `本集讲解「${part}」，属第 ${ch.num} 章。考点：**${exam}**。`,
    zeroBaseIntro: `数字信号处理的主线是：**用离散数学工具（序列、Z 变换、DFT）分析 LTI 系统，并设计数字滤波器**。本集「${part}」即便不看视频，也应先弄清：定义是什么、与前后章如何衔接、考试会怎么考。

西电教材证明较完整，本笔记是**提纲+考点+直觉**；期末/考研请回教材补证明与习题。`,
    analogy: ch.num <= 2
      ? '序列像**按编号排列的样本点**；LTI 系统像**固定配方滤镜**，同样原料（输入）永远得到同样成品（输出），且两种原料混合过滤等于分别过滤再相加。'
      : ch.num === 3
        ? 'DFT 像**对一段乐曲做有限个频谱采样**；循环卷积像**把曲子首尾相接成环再混响**——不补零就会「绕回」产生失真。'
        : ch.num >= 6
          ? 'IIR/FIR 滤波器设计像**调 EQ**：IIR 用反馈（省阶数但可能不稳），FIR 无反馈（稳定且可线性相位但阶数高）。'
          : 'FFT 像**分治求和**：把 N 点 DFT 拆成两个 N/2 点，复杂度从 N² 降到 N log N，是工程可算的关键。',
    walkthrough: `**例题思路（本集主题）**

1. **读题**：标出已知是时域序列、系统函数还是频域采样。
2. **选型**：时域卷积 → 第 1 章；Z 域代数 → 第 2 章；频域周期序列 → 第 3–4 章；滤波器指标 → 第 6–7 章。
3. **计算**：按「${exam}」列步骤；卷积用竖线法，反变换用部分分式或留数法，设计用双线性/窗函数。
4. **检验**：因果性看 $h(n)$ 右边；稳定性看极点是否在单位圆内；实序列看 DFT 共轭对称。
5. **对照视频**：UP 本集应演示 1–2 道典型算例，暂停跟算。`,
    misconceptions: `1. **只背公式不做题**：DSP 是计算课，卷积、反变换、FFT 流图必须手算一遍。\n2. **忽略 ROC**：同一 $X(z)$ 不同 ROC 对应不同序列，因果/反因果搞反必错。\n3. **混淆线性卷积与循环卷积**：要等于线性卷积需补零到 $N \\geq N_1+N_2-1$。\n4. **数字频率 $\\omega$ 与模拟 $\\Omega$ 混用**：记住 $\\omega=\\Omega T$ 与双线性预畸变。`,
    quiz: `1. **本集考点？**  **答**：${exam}。\n2. **属于哪章？**  **答**：第 ${ch.num} 章 ${ch.name}。\n3. **与上集关系？**  **答**：${prev ? `在「${prev}」基础上扩展` : '绪论，建立全局框架'}。\n4. **一道必会手算？**  **答**：见 Walkthrough 步骤 3。\n5. **教材哪一节？**  **答**：对照西电《数字信号处理》第 ${ch.num} 章目录同名小节。`,
    checklist: `- [ ] 在教材找到对应小节并标出定理/公式\n- [ ] 手算 1 道与本集标题相关的例题\n- [ ] 画出 1 张概念图（定义→性质→应用）\n- [ ] 对照视频核对 1 个推导或流图\n- [ ] 将易错点写入错题本（ROC/补零/稳定性）`,
    furtherReading: `- 西电《数字信号处理》第 ${ch.num} 章\n- Oppenheim《离散时间信号处理》对应章节\n- 课程 P${String(Math.max(1, page - 1)).padStart(2, '0')}–P${String(Math.min(44, page + 1)).padStart(2, '0')} 笔记交叉阅读`,
    mermaid: ch.num === 1 ? `flowchart LR\n  x[n] --> SYS[LTI系统]\n  SYS --> y[n]\n  h[n] --> SYS` : ch.num === 2 ? `flowchart LR\n  x[n] --> Z[Z变换]\n  Z --> Xz[X(z)]\n  Xz --> Hz[H(z)]\n  Hz --> yz[Y(z)]` : `flowchart TD\n  IN[时域序列] --> TR[变换域]\n  TR --> PROC[处理/设计]\n  PROC --> INV[反变换]\n  INV --> OUT[输出]`,
    extraDetail: `### 本章学习节奏（P${String(page).padStart(2, '0')}）\n\n建议每周完成 3–4 个分 P：先看笔记建立定义，再跟视频做 2 道题，最后闭卷复述关键性质。第 ${ch.num} 章期末占比高，${page <= 9 ? '卷积与稳定性是全书地基' : page <= 21 ? 'Z 变换与 ROC 是滤波器设计前置' : page <= 30 ? 'DFT/FFT 是频域算法核心' : '滤波器设计要结合指标表与 MATLAB 验证'}。`,
  };
}

const dspDetailObj = {};
dspData.parts.forEach((p, idx) => {
  const prev = idx > 0 ? dspData.parts[idx - 1].part : null;
  const next = idx < dspData.parts.length - 1 ? dspData.parts[idx + 1].part : null;
  dspDetailObj[p.page] = buildDspDetail(p.page, p.part, prev, next);
});

// ─── SolidWorks 6P ───
const swData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'BV1Yo5D6TEVk-full.json'), 'utf8'));
const swTitles = ['图纸阅读与建模思路', '环境自动化准备', 'API 调用与参数确认', '参数化零件建模', '装配体标准件生成', '装配尝试与保存收尾'];
const swOutputs = ['结构化读图与建模思路、参数 JSON 草稿', 'SolidWorks API 运行环境（Python/C# + COM）', '参数 JSON schema 与 API 映射验证', '参数化零件生成脚本', '复杂件与 Toolbox 标准件库', '装配体、干涉检查与最终交付'];
const swExam = {
  1: '视图投影、尺寸链分类、零件拆分与建模策略、AI 读图边界',
  2: 'COM 连接、宏安全、模板路径、Python/C# 环境依赖',
  3: 'SldWorks 对象链、JSON schema、SetSystemValue3、逐步调试',
  4: '特征顺序、草图约束、拉伸切除、参数化脚本结构',
  5: '复杂特征取舍、Toolbox 标准件、装配前零件准备',
  6: '配合类型与 DOF、干涉检查、Pack and Go、全流程复盘',
};

function buildSwDetail(page) {
  const title = swTitles[page - 1];
  const prev = page > 1 ? swTitles[page - 2] : null;
  const next = page < 6 ? swTitles[page] : null;
  return {
    position: `**系列第 ${page}/6 步**：${title}。\n\n${prev ? `**前置产出**：完成 [[P0${page - 1}-${prev.replace(/ /g, '')}]] 的交付物。` : '**起点**：无代码前置，但需基本机械制图常识。'}\n\n${next ? `**下一步**：[[P0${page + 1}-${next.replace(/ /g, '')}]] 将使用本步产出。` : '**终点**：应能复盘 AI+API 全流程。'}\n\n六步流水线：读图 → 环境 → API/Schema → 零件建模 → 标准件 → 装配交付。`,
    quickSummary: `**${title}**——产出：${swOutputs[page - 1]}。重点：${swExam[page]}。`,
    zeroBaseIntro: `本系列演示 **AI 读工程图 + SolidWorks API 自动建模装配**。P0${page}「${title}」即使不看视频，也要弄清：本步**输入是什么、输出交给谁、失败如何排查**。

不要跳步：没有 P01 的参数 JSON，P04 脚本无米下锅；没有 P02 环境，P03 COM 调用必报错。`,
    analogy: page === 1 ? '读图像**翻译合同**：先把图纸条款（尺寸、视图、公差）结构化，再交给「施工队」（API）盖房子（模型）。'
      : page === 2 ? '搭环境像**给厨师备厨房**：炉子（SolidWorks）、燃气（COM）、菜谱（模板）缺一不可。'
      : page <= 4 ? 'API 建模像**用遥控器开车**：你发指令（方法调用），车（SolidWorks）动；要先弄清遥控器按钮对应哪根线（对象链）。'
      : '装配像**拼乐高**：每件有编号（零件文件）和卡扣位置（配合面），干涉就是两块硬塞不进去。',
    walkthrough: page === 1
      ? `**Walkthrough：法兰盘读图 → JSON 草稿**\n\n1. 读标题栏：材料 Q235、比例 1:1、单位 mm。\n2. 主视图+俯视图确定外径 Φ120、厚 12、中心孔 Φ30。\n3. 螺栓孔：8×Φ9，节圆 Φ90，起始角 0°。\n4. 输出 JSON：\`{ "od":120, "thickness":12, "center_hole_d":30, "bolt_holes":{ "n":8, "d":9, "pcd":90 } }\`\n5. 人工复核：俯视图孔位是否与主视图一致。`
      : page === 2
        ? `**Walkthrough：Python 连接 SolidWorks**\n\n1. 安装 SolidWorks 与对应版本 API SDK 帮助文档。\n2. \`pip install pywin32\`，脚本 \`win32com.client.Dispatch("SldWorks.Application")\`。\n3. 设置宏安全、默认模板路径（零件 prtdot）。\n4. \`Visible=True\` 便于调试，\`NewDocument\` 创建零件。\n5. 记录 SolidWorks 版本号与 ProgID，写入 README。`
        : `**Walkthrough：本步在流水线中的位置**\n\n- **输入**：${page === 3 ? 'P01 JSON + P02 环境' : page === 4 ? '已验证 schema + 空白零件' : page === 5 ? '零件脚本与复杂特征清单' : '全部零件文件'}\n- **操作**：${swExam[page]}\n- **输出**：${swOutputs[page - 1]}\n- **验收**：${page === 6 ? '无干涉、配合正确、Pack and Go 可迁移' : '对照视频复现 UP 演示结果'}`,
    misconceptions: `1. **AI 读图 100% 准**：必须人工复核关键尺寸与视图对应。\n2. **API 版本无关**：不同 SolidWorks 年份接口名可能变化，需查帮助。\n3. **跳过草图约束**：未完全定义草图会导致特征失败或下游装配配合不上。\n4. **标准件全建模**：螺栓螺母应优先 Toolbox，节省时间。`,
    quiz: `1. **本步产出？**  **答**：${swOutputs[page - 1]}。\n2. **关键 API/概念？**  **答**：${swExam[page]}。\n3. **上一步依赖？**  **答**：${prev || '无，系列起点'}。\n4. **常见失败？**  **答**：见「常见误区」与视频排错片段。\n5. **如何自测？**  **答**：独立完成 Checklist 第一项。`,
    checklist: page === 1
      ? `- [ ] 找一张真实图纸练习写 JSON\n- [ ] 区分第一角/第三角投影\n- [ ] 列出零件拆分清单\n- [ ] 标注驱动尺寸 vs 参考尺寸\n- [ ] 与视频法兰盘示例对照`
      : page === 2
        ? `- [ ] Python 成功 Dispatch SldWorks\n- [ ] 新建零件并保存\n- [ ] 记录版本与模板路径\n- [ ] 宏安全策略截图存档\n- [ ] 编写最小 hello_sw.py`
        : `- [ ] 完成本步 UP 演示复现\n- [ ] 提交/保存本步产出文件\n- [ ] 记录 1 个 API 踩坑\n- [ ] 阅读 SolidWorks API Help 相关方法\n- [ ] 准备下一步输入物`,
    furtherReading: '- [SolidWorks API Help](https://help.solidworks.com/)\n- pywin32 文档\n- GB/T 4458 机械制图标准\n- 本系列相邻分 P 笔记',
    mermaid: `flowchart LR\n  P01[读图JSON] --> P02[环境]\n  P02 --> P03[API/Schema]\n  P03 --> P04[零件]\n  P04 --> P05[标准件]\n  P05 --> P06[装配]\n  style P0${page} fill:#f9f,stroke:#333`,
    extraDetail: `### 实操要点（P0${page}）\n\n建议开双屏：左 Obsidian 笔记，右 SolidWorks + IDE。每完成一个 API 调用立即保存宏/脚本版本。遇到 COM 错误先查 \`Visible\` 与对象是否为 \`None\`，再查尺寸名是否与草图完全一致（区分大小写）。`,
  };
}

const swDetailObj = {};
for (let i = 1; i <= 6; i++) swDetailObj[i] = buildSwDetail(i);

// Write as JS modules exporting objects
function serializeDetailModule(obj) {
  const keys = Object.keys(obj).sort((a, b) => Number(a) - Number(b));
  const parts = keys.map((k) => {
    const inner = Object.entries(obj[k])
      .map(([field, val]) => `    ${field}: ${JSON.stringify(val)},`)
      .join('\n');
    return `  ${k}: {\n${inner}\n  },`;
  });
  return `/** 教程级深化 - generate-tutorial-details.js */\nmodule.exports = {\n${parts.join('\n')}\n};\n`;
}

fs.writeFileSync(path.join(OUT, 'data-element-tutorial-detail.js'), serializeDetailModule(deDetailObj), 'utf8');
fs.writeFileSync(path.join(OUT, 'dsp-tutorial-detail.js'), serializeDetailModule(dspDetailObj), 'utf8');
fs.writeFileSync(path.join(OUT, 'sw-tutorial-detail.js'), serializeDetailModule(swDetailObj), 'utf8');

console.log(`DE: ${Object.keys(deDetailObj).length}, DSP: ${Object.keys(dspDetailObj).length}, SW: ${Object.keys(swDetailObj).length}`);
