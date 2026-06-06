/**
 * 教程级笔记框架：将纲要级 knowledge 包装为 1500–3000 字教程结构
 */
function countChars(text) {
  return (text || '').replace(/\s/g, '').length;
}

function buildTutorialBody(ctx) {
  const {
    seriesName,
    page,
    shortTitle,
    themeName,
    prevTitle,
    nextTitle,
    examTip,
    baseContent,
    detail = {},
    durationFmt,
  } = ctx;

  const pos = detail.position || buildDefaultPosition(page, prevTitle, nextTitle, themeName);
  const quick = detail.quickSummary || `本集「${shortTitle}」属于「${themeName}」模块，核心考查：${examTip}。`;
  const intro = detail.zeroBaseIntro || buildDefaultIntro(shortTitle, themeName, seriesName);
  const analogy = detail.analogy || buildDefaultAnalogy(themeName);
  const walk = detail.walkthrough || buildDefaultWalkthrough(shortTitle, themeName, examTip);
  const myths = detail.misconceptions || buildDefaultMisconceptions(themeName);
  const videoMap = detail.videoMap || buildDefaultVideoMap(shortTitle, durationFmt);
  const checklist = detail.checklist || buildDefaultChecklist(themeName);
  const reading = detail.furtherReading || buildDefaultReading(themeName);
  const quiz = detail.quiz || buildDefaultQuiz(shortTitle, examTip);
  const mermaid = detail.mermaid || buildDefaultMermaid(themeName, page);
  const extra = detail.extraDetail || '';

  return `## 本节在系列中的位置

${pos}

## 3 分钟速览

${quick}

## 零基础导读

${intro}

## 详细讲解

${baseContent}

${extra}

## 图解

\`\`\`mermaid
${mermaid}
\`\`\`

## 类比与直觉

${analogy}

## 例题与场景 Walkthrough

${walk}

## 常见误区

${myths}

## 与视频对照表

${videoMap}

## 动手实践 Checklist

${checklist}

## 延伸阅读

${reading}

## 自测题

${quiz}`;
}

function buildDefaultPosition(page, prevTitle, nextTitle, themeName) {
  const lines = [`本集为系列第 **P${String(page).padStart(2, '0')}** 集，归属 **${themeName}** 模块。`];
  if (prevTitle) lines.push(`**前置知识**：建议先学完「${prevTitle}」，理解上下游概念后再读本集，避免孤立记忆术语。`);
  else lines.push('**前置知识**：本集为模块起点，可直接阅读；读完后建议结合总览把握全局脉络。');
  if (nextTitle) lines.push(`**后续衔接**：学完本集后继续「${nextTitle}」，将本集概念放入更大技术栈中验证。`);
  else lines.push('**后续衔接**：本集为模块收束，建议回到总览做模块复盘与自测。');
  lines.push('若时间紧，可先读「3 分钟速览」与「图解」，再按需深入「详细讲解」。');
  return lines.join('\n\n');
}

function buildDefaultIntro(title, theme, series) {
  return `假设你**尚未观看视频**，本节目标是用文字建立可独立理解的知识框架。

「${title}」是「${series}」中 **${theme}** 的关键一环。视频侧重演示与口述节奏，本笔记补齐**定义、流程、选型与落地**文字细节，便于离线复习与面试准备。

阅读建议：先通读「详细讲解」把握主干，用「图解」建立整体图景，再用「场景 Walkthrough」把政策或技术落到具体步骤。遇到缩写（MPC、TEE、PSI 等）可结合文末「关键术语」表查阅。`;
}

function buildDefaultAnalogy(theme) {
  const map = {
    '政策与安全治理': '数据要素政策像**交通规则**：先定道路（制度）、再发驾照（授权）、最后装护栏（安全技术）。没有规则，车（数据）跑得越快越危险。',
    '可信数据空间标准': '可信数据空间像**带门禁的联合办公室**：各方自带文件（数据）进共享会议室，按合约使用、出门留痕，原始文件不随便复印带走。',
    '密态计算与 TEE': '密态计算像**在保险箱里做算术**：数据加密放进去，计算在箱内完成，只把约定结果拿出来，箱外的人看不到中间过程。',
    '可信数据空间连接器': '连接器像**海关申报终端**：数据产品要登记、验货、绑策略，出关入关都有审计记录。',
    '隐私计算核心技术': '隐私计算像**蒙眼协作拼图**：每人只看到自己那块，通过协议拼出完整图案，但彼此不知道对方拼图内容。',
    'SecretFlow 生态': 'SecretFlow 像**隐私计算的 Android 系统**：YACL/SPU 是芯片驱动，Kuscia 是任务调度，SecretPad 是桌面，开发者写应用即可。',
    '数据元件·区块链·数联网': '数据元件像**标准化集装箱**，区块链像**不可篡改的货运单**，数联网像**港口铁路网**——让数据像货物一样可计量、可追踪、可交易。',
    '行业实践案例': '行业案例像**菜谱**：同样的隐私计算「厨具」，医疗、金融、车险各做一道菜，重点看食材（数据）与火候（合规）如何配合。',
  };
  return map[theme] || '把本节技术想象成**流水线的一环**：看清输入是什么、经过哪些处理、输出给谁用，比死记名词更有效。';
}

function buildDefaultWalkthrough(title, theme, examTip) {
  if (theme.includes('政策') || theme.includes('案例') && title.includes('政策')) {
    return `**Walkthrough：从政策到落地**

1. **政策输入**：识别本集涉及的法规/意见/标准名称，标注施行时间与适用主体（政府、运营机构、企业）。
2. **场景映射**：选一个本行业场景（如公共数据开放、联合风控），列出「谁供数、谁用数、谁审计」。
3. **技术选型**：在「保安全」环节对应隐私计算形态（TEE/MPC/FL/差分隐私），说明为何匹配该场景。
4. **交付物**：写出可交付成果——目录条目、授权协议要点、评估报告、技术 PoC 范围。
5. **验收**：用自测题与 checklist 核对是否覆盖「${examTip}」。`;
  }
  if (theme.includes('案例')) {
    return `**Walkthrough：行业场景复盘**

1. **业务痛点**：多方数据为何不能明文合并？合规红线是什么？
2. **数据输入**：各方提供哪些字段（特征/标签/ID），样本如何对齐？
3. **技术路径**：选用联邦学习、PSI、SCQL 或 TEE 中的哪条主线，为何？
4. **处理过程**：训练/查询/推理在哪执行，结果如何出域？
5. **输出与价值**：模型 AUC、对账精度、定价误差等业务指标；运维与审计安排。`;
  }
  return `**Walkthrough：技术链路复盘**

1. **输入**：本集技术处理什么数据形态（明文/密文/秘密分享）？参与方有几方？
2. **处理**：核心协议或组件是什么？通信轮次、计算开销大致量级？
3. **输出**：得到什么结果（模型、交集、统计值、证明）？哪部分可揭示、哪部分必须保持秘密？
4. **工程落地**：对应 SecretFlow/系统组件中的哪一层？开发时应选 PYU/SPU/HEU/TEEU 中哪种 Device？
5. **验证**：用官方 Quick Start 或案例配置单复现最小闭环，对照「${examTip}」自检。`;
}

function buildDefaultMisconceptions(theme) {
  return `1. **把概念当产品**：学完定义就认为「已经会部署」——还需完成 checklist 中的环境搭建与最小 Demo。
2. **忽视合规前提**：技术再强，若无授权与用途限制，仍可能违反数据安全法/个保法。
3. **孤立记忆缩写**：MPC、TEE、FL 不是互斥选项，实际项目常组合使用；本模块「${theme}」要放在全栈里理解。
4. **只看视频不复盘**：演示步骤易忘，必须以本笔记「场景 Walkthrough」自行走一遍纸面流程。`;
}

function buildDefaultVideoMap(title, durationFmt) {
  const dur = durationFmt || '本集';
  return `| 视频段落（约） | 预期演示内容 | 笔记对应章节 |
|-------------|------------|------------|
| 开篇 0%–15% | 本集目标、背景、与前后集关系 | 本节位置、3 分钟速览 |
| 前段 15%–40% | 核心概念定义与架构图 | 零基础导读、详细讲解 |
| 中段 40%–70% | 原理展开、对比、政策/代码示例 | 图解、类比、Walkthrough |
| 后段 70%–90% | 案例、问答、易错点 | 常见误区、Checklist |
| 收尾 90%–100% | 总结、延伸资源 | 延伸阅读、自测题 |

> 本集总时长约 **${dur}**。无官方外挂字幕时，以分 P 标题「${title}」与上表主题对齐视频画面。`;
}

function buildDefaultChecklist(theme) {
  if (theme.includes('SecretFlow')) {
    return `- [ ] 阅读 [SecretFlow 文档首页](https://www.secretflow.org.cn/zh-CN/docs)
- [ ] 完成单机仿真 Quick Start（两方加法或联邦逻辑回归）
- [ ] 画出本集组件在架构图中的位置（YACL/SPU/Kuscia/SecretPad）
- [ ] 记录一种业务场景到 Device/组件的映射表
- [ ] 在 GitHub Issues 或论坛搜索本集关键词的一个实战问题`;
  }
  if (theme.includes('政策')) {
    return `- [ ] 列出本集涉及的 3 份政策/法规全称与施行日期
- [ ] 用一张表写出「供得出、流得动、用得好、保安全」各对应一项制度或技术
- [ ] 选一个本地公共数据平台，写 200 字合规点评
- [ ] 与法务/合规同事确认一个真实业务的授权链条`;
  }
  return `- [ ] 通读笔记后闭卷写出本集 3 个核心概念
- [ ] 根据「图解」向同事口述 2 分钟版本
- [ ] 完成文末 3 道自测题并核对答案
- [ ] 对照视频确认 1 处演示细节（参数、界面、命令）
- [ ] 记录 1 个仍不清楚的问题，标记到延伸阅读查阅`;
}

function buildDefaultReading(theme) {
  const base = '- [SecretFlow 官方文档](https://www.secretflow.org.cn/zh-CN/docs)\n';
  const map = {
    '政策与安全治理': '- 国务院「数据二十条」全文及解读\n- 《数据安全法》《个人信息保护法》条文导读\n- 国家数据局官网政策动态',
    '可信数据空间标准': '- TC609 可信数据空间相关标准草案\n- 国家数据基础设施建设指引',
    '密态计算与 TEE': '- Intel SGX Developer Guide\n- Confidential Computing Consortium 白皮书',
    '隐私计算核心技术': '- 《隐私计算白皮书》\n- MPC/FHE/ZK 综述论文（见课程推荐）',
    'SecretFlow 生态': '- SecretFlow 安装指南、SPU 开发指南、Kuscia 部署文档\n- SecretPad 用户手册',
    '数据元件·区块链·数联网': '- 数据元件技术规范\n- 联盟链与数据交易行业报告',
    '行业实践案例': '- 隐语行业案例集\n- 本集涉及行业的监管指引（金融、医疗、汽车）',
  };
  return base + (map[theme] || '- 课程配套 PDF/PPT\n- 本系列其他分 P 笔记交叉引用');
}

function buildDefaultQuiz(title, examTip) {
  return `1. **本集主题是什么？**  
   **答**：${title}；实践侧重：${examTip}。

2. **为何本集在系列中重要？**  
   **答**：它是当前模块的关键节点，承上启下；脱离前后集很难单独落地。

3. **一项最容易混淆的概念？**  
   **答**：参见「常见误区」——需结合场景区分技术概念与合规概念。

4. **若只有 30 分钟如何复习？**  
   **答**：速览 + 图解 + Walkthrough 走一遍，再做 1 道自测题。

5. **下一步建议动作？**  
   **答**：完成 Checklist 第一项（文档阅读或最小 Demo）。`;
}

function buildDefaultMermaid(theme, page) {
  if (theme.includes('政策')) {
    return `flowchart LR
  A[供得出] --> B[流得动]
  B --> C[用得好]
  C --> D[保安全]
  D --> A
  P${page}[本集 P${String(page).padStart(2, '0')}] --> A`;
  }
  if (theme.includes('SecretFlow')) {
    return `flowchart TB
  App[SecretPad / 业务 SDK]
  Alg[算法层 FL/MPC]
  Dev[SPU / HEU / PYU / TEEU]
  YACL[YACL 密码库]
  Kus[Kuscia 编排]
  App --> Alg --> Dev --> YACL
  Kus --> App`;
  }
  if (theme.includes('隐私计算')) {
    return `mindmap
  root(隐私计算)
    MPC
    同态加密
    联邦学习
    差分隐私
    零知识证明
    TEE`;
  }
  return `flowchart TD
  IN[数据输入] --> PROC[本集核心技术]
  PROC --> OUT[合规输出]
  PROC --> AUDIT[审计溯源]`;
}

module.exports = {
  countChars,
  buildTutorialBody,
  buildDefaultPosition,
  buildDefaultIntro,
  buildDefaultAnalogy,
  buildDefaultWalkthrough,
  buildDefaultMisconceptions,
  buildDefaultVideoMap,
  buildDefaultChecklist,
  buildDefaultReading,
  buildDefaultQuiz,
  buildDefaultMermaid,
};
