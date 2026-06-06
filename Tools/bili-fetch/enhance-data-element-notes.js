/**
 * Enhance 数据要素技术 Obsidian notes with substantive knowledge content.
 * Usage: node enhance-data-element-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1ser5BDESU';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '数据要素技术');
const DATE = '2026-06-06';

const supplement = require('./content/data-element-supplement');
const supplement2 = require('./content/data-element-supplement2');
const supplement3 = require('./content/data-element-supplement3');
const knowledge = Object.assign(
  {},
  require('./content/data-element-de-policy'),
  require('./content/data-element-de-privacy'),
  require('./content/data-element-de-secretflow'),
  require('./content/data-element-de-infra'),
  require('./content/data-element-de-cases')
);
// 合并补充深化，使每篇达 800+ 字
for (const [page, extra] of Object.entries(supplement)) {
  const p = Number(page);
  if (knowledge[p]) knowledge[p] = knowledge[p] + '\n\n' + extra;
}
for (const [page, extra] of Object.entries(supplement2)) {
  const p = Number(page);
  if (knowledge[p]) knowledge[p] = knowledge[p] + '\n\n' + extra;
}
for (const [page, extra] of Object.entries(supplement3)) {
  const p = Number(page);
  if (knowledge[p]) knowledge[p] = knowledge[p] + '\n\n' + extra;
}

const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function sanitizeFilename(part, page) {
  let name = part
    .replace(/^\d+_/, '')
    .replace(/（.*?）/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[———]/g, '-')
    .replace(/：/g, '-')
    .replace(/[\uFFFD]/g, '')
    .replace(/\s+/g, '')
    .trim();
  if (!name || name.length > 40) {
    name = part.replace(/^\d+_/, '').replace(/[\\/:*?"<>|（）()【】\[\]]/g, '').slice(0, 40);
  }
  return `P${String(page).padStart(2, '0')}-${name || `分P${page}`}`;
}

function getThemeGroup(page) {
  if (page <= 6) return { id: 'policy', name: '政策与安全治理' };
  if (page <= 8) return { id: 'tds', name: '可信数据空间标准' };
  if (page <= 17) return { id: 'confidential', name: '密态计算与TEE' };
  if (page <= 18) return { id: 'tds-conn', name: '可信数据空间连接器' };
  if (page <= 24) return { id: 'privacy', name: '隐私计算核心技术' };
  if (page <= 32) return { id: 'secretflow', name: 'SecretFlow 生态' };
  if (page <= 38) return { id: 'infra', name: '数据元件·区块链·数联网' };
  return { id: 'cases', name: '行业实践案例' };
}

function getExamTips(page) {
  const tips = {
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
  return tips[page] || '对照视频与 SecretFlow 文档';
}

function getTerms(part, page) {
  const theme = getThemeGroup(page);
  const common = [
    ['数据要素', '可参与社会化配置、创造价值的数字化资源'],
    ['隐私计算', '数据可用不可见前提下实现协作计算的技术体系'],
  ];
  const map = {
    政策: [['供得出', '健全供给体系'], ['流得动', '建设流通设施'], ['用得好', '深化融合应用'], ['保安全', '完善治理机制']],
    公共数据: [['授权运营', '政府委托运营机构开发公共数据'], ['三权分置', '持有权、加工使用权、产品经营权分离']],
    法律法规: [['数据安全法', '2021.9 施行，分类分级保护'], ['个人信息保护法', '2021.11 施行']],
    匿名化: [['去标识化', '移除标识符但可重识别'], ['匿名化', '不可复原到特定个人']],
    分级: [['安全分级', '按敏感程度划分保护等级'], ['产品分级', '隐私计算产品能力等级']],
    可信数据空间: [['使用控制', '约定用途、次数、期限'], ['连接器', '参与方接入节点']],
    密态: [['密态计算', '密文状态下完成计算'], ['密态胶囊', '数据+策略+密钥封装单元']],
    TEE: [['可信执行环境', '硬件隔离的安全计算区域'], ['远程证明', '验证 Enclave 完整性与身份']],
    MPC: [['秘密分享', 'Shamir (t,n) 门限方案'], ['混淆电路', 'Yao 协议基础']],
    同态: [['FHE', '支持任意次数加乘的密文计算'], ['RLWE', '格密码基础']],
    求交: [['PSI', '两方集合交集不泄露差集'], ['PIR', '查询不泄露查询项']],
    零知识: [['SNARK', '简洁非交互零知识证明'], ['电路', '将计算编译为算术电路']],
    差分隐私: [['隐私预算 ε', '越小隐私越强、效用越低'], ['全局敏感度', '单条记录最大影响']],
    联邦学习: [['FedAvg', '本地训练+梯度平均'], ['安全聚合', '加密梯度防泄露']],
    SecretFlow: [['SPU', 'Secure Processing Unit'], ['SCQL', 'Secure Collaborative Query Language']],
    Kuscia: [['Domain', '隐私计算域/参与方隔离单元'], ['Job', '跨域计算任务']],
    区块链: [['联盟链', '许可制、多方维护'], ['智能合约', '链上自动执行']],
    数场: [['数联网', '数据互联基础设施'], ['数据元件', '标准化可流通数据单元']],
    案例: [['联合建模', '多方数据协作训练'], ['对齐', '样本或特征 ID 匹配']],
  };
  for (const [key, terms] of Object.entries(map)) {
    if (part.includes(key)) return [...common, ...terms];
  }
  return [...common, ['模块', theme.name]];
}

function countChars(text) {
  return text.replace(/\s/g, '').length;
}

const fileNames = data.parts.map((p) => sanitizeFilename(p.part, p.page));
let totalChars = 0;
const wordCounts = [];

data.parts.forEach((p, idx) => {
  const fn = fileNames[idx];
  const prev = idx > 0 ? fileNames[idx - 1] : null;
  const next = idx < data.parts.length - 1 ? fileNames[idx + 1] : null;
  const nav = [
    `← [[${BV}-总览]]`,
    prev ? `← [[${prev}]]` : '',
    next ? `下一篇 → [[${next}]]` : '',
  ].filter(Boolean).join(' | ');

  const theme = getThemeGroup(p.page);
  const content = knowledge[p.page];
  if (!content) {
    console.warn(`Missing knowledge for P${p.page}`);
    return;
  }
  const wc = countChars(content);
  totalChars += wc;
  wordCounts.push(wc);

  const terms = getTerms(p.part, p.page);
  const examTip = getExamTips(p.page);
  const shortTitle = p.part.replace(/^\d+_/, '');

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${shortTitle}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [数据要素, 隐私计算, 视频笔记, ${theme.id}, SecretFlow]
duration: "${p.duration_fmt.replace('分', 'm').replace('秒', 's')}"
cid: ${p.cid}
created: ${DATE}
updated: ${DATE}
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: ${wc}
---

# P${String(p.page).padStart(2, '0')} ${shortTitle}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${shortTitle} |
| 模块 | ${theme.name} |
| 时长 | ${p.duration_fmt.replace(/(\d+)分(\d+)秒/, '$1 分 $2 秒')} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 内容来源 | 知识点增强（数据要素流通技术体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：${shortTitle}
2. **模块定位**：${theme.name}
3. **考试/实践侧重**：${examTip}
4. **学习建议**：先读下方详细笔记建立框架，再对照视频与 SecretFlow 文档动手实践
5. **与视频关系**：笔记覆盖本 P 核心知识点，演示细节以视频为准

## 详细笔记

> 以下内容基于数据要素流通与隐私计算技术体系撰写，对应 B 站分 P「${shortTitle}」。**非 UP 逐字转写**；实操步骤请对照视频与官方文档。

${content}

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${data.parts[idx - 1].part.replace(/^\d+_/, '')}**（[[${prev}]]）` : `- ← 课程起点，见 [[${BV}-总览]]`}
${next ? `- → **${data.parts[idx + 1].part.replace(/^\d+_/, '')}**（[[${next}]]）` : '- → 课程终点'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ✅ **知识点增强**：数据要素流通技术实质内容（约 ${wc} 字，${DATE}）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Update overview
const overviewPath = path.join(OUT_DIR, `${BV}-总览.md`);
if (fs.existsSync(overviewPath)) {
  let overview = fs.readFileSync(overviewPath, 'utf8');
  overview = overview.replace(/source_type: 元数据增强/, 'source_type: 知识点增强');
  overview = overview.replace(/status: 已生成/, 'status: 已增强');
  overview = overview.replace(
    /> 当前笔记基于 \*\*官方简介 \+ 分 P 结构\*\* 整理，待知识点增强脚本补充 800–1500 字\/篇实质内容。/,
    `> 各分 P 笔记已补充 **数据要素流通技术知识点实质内容**（约 800–1500 字/篇，${DATE}）。B 站 API 无外挂字幕，逐字稿可后续用 Whisper/BiliNote 补充。`
  );
  overview = overview.replace(/updated: \d{4}-\d{2}-\d{2}/, `updated: ${DATE}`);

  const rows = data.parts.map((p, idx) => {
    const wc = wordCounts[idx] || 0;
    const short = p.part.replace(/^\d+_/, '');
    return `| P${String(p.page).padStart(2, '0')} | ${short} | ${p.duration_fmt} | ~${wc} | [[${fileNames[idx]}]] |`;
  });
  const indexHeader = '| 分 P | B 站分集标题 | 时长 | 字数 | 笔记 |';
  const indexSep = '|------|-------------|------|------|------|';
  const learnStart = overview.indexOf('## 学习路径');
  const indexStart = overview.indexOf('## 分 P 索引');
  if (indexStart >= 0 && learnStart > indexStart) {
    const before = overview.slice(0, indexStart);
    const after = overview.slice(learnStart);
    overview = `${before}## 分 P 索引\n\n${indexHeader}\n${indexSep}\n${rows.join('\n')}\n\n${after}`;
  }
  fs.writeFileSync(overviewPath, overview, 'utf8');
}

// Update mindmap
const mindmapPath = path.join(OUT_DIR, '思维导图.md');
const themeBlocks = [
  { label: '政策治理', pages: [1, 6], fn: fileNames[0] },
  { label: '可信空间', pages: [7, 8], fn: fileNames[6] },
  { label: '密态计算', pages: [9, 17], fn: fileNames[8] },
  { label: '隐私计算', pages: [19, 24], fn: fileNames[18] },
  { label: 'SecretFlow', pages: [25, 32], fn: fileNames[24] },
  { label: '区块链数联网', pages: [33, 38], fn: fileNames[32] },
  { label: '行业案例', pages: [39, 47], fn: fileNames[38] },
];
const mindmapContent = `---
title: "数据要素技术 - 思维导图"
tags: [数据要素, 思维导图, mermaid, 隐私计算, SecretFlow]
updated: ${DATE}
status: 已增强
---

# 数据要素技术 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    政策治理 P01-P06 ~${wordCounts.slice(0, 6).reduce((a, b) => a + b, 0)}字
      [[${fileNames[0]}]]
    可信空间 P07-P08 P18
      [[${fileNames[6]}]]
    密态计算 P09-P17
      [[${fileNames[8]}]]
    隐私计算 P19-P24
      [[${fileNames[18]}]]
    SecretFlow P25-P32
      [[${fileNames[24]}]]
    区块链数联网 P33-P38
      [[${fileNames[32]}]]
    行业案例 P39-P47
      [[${fileNames[38]}]]
\`\`\`

> 各模块已按知识点增强（${DATE}，合计约 ${totalChars} 字，均篇 ${Math.round(totalChars / wordCounts.length)} 字）。封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(mindmapPath, mindmapContent, 'utf8');

console.log(`Enhanced ${wordCounts.length} notes in ${OUT_DIR}`);
console.log(`Word counts min=${Math.min(...wordCounts)} max=${Math.max(...wordCounts)} avg=${Math.round(totalChars / wordCounts.length)}`);
console.log(`Total: ~${totalChars} chars`);
