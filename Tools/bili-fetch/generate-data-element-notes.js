/**
 * Generate Obsidian notes for BV1ser5BDESU 数据要素技术 course
 * Usage: node generate-data-element-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1ser5BDESU';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '数据要素技术');
const DATE = '2026-06-06';

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

function fmtDurationHms(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function fmtDurationCn(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} 分 ${String(s).padStart(2, '0')} 秒`;
}

function getThemeGroup(page) {
  if (page <= 6) return { id: 'policy', name: '政策与安全治理', range: 'P01–P06' };
  if (page <= 8) return { id: 'tds', name: '可信数据空间标准', range: 'P07–P08' };
  if (page <= 17) return { id: 'confidential', name: '密态计算与TEE', range: 'P09–P17' };
  if (page <= 18) return { id: 'tds-conn', name: '可信数据空间连接器', range: 'P18' };
  if (page <= 24) return { id: 'privacy', name: '隐私计算核心技术', range: 'P19–P24' };
  if (page <= 32) return { id: 'secretflow', name: 'SecretFlow 生态', range: 'P25–P32' };
  if (page <= 38) return { id: 'infra', name: '数据元件·区块链·数联网', range: 'P33–P38' };
  return { id: 'cases', name: '行业实践案例', range: 'P39–P47' };
}

function getCorePoints(part, page) {
  const theme = getThemeGroup(page);
  const shortTitle = part.replace(/^\d+_/, '');
  return [
    `**主题模块**：${theme.name}（${theme.range}）`,
    `**本 P 主题**：${shortTitle}`,
    `**课程定位**：隐语 SecretFlow 官方「数据要素流通技术」系列，配套文档 https://www.secretflow.org.cn/zh-CN/docs`,
    `**学习建议**：先读总览学习路径，再按模块顺序学习；技术 P 建议动手跑 SecretFlow/SecretPad 示例`,
  ];
}

function getOutline(part, page) {
  const theme = getThemeGroup(page);
  return [
    `### 1. 模块定位（${theme.name}）`,
    `- 本 P 在 47 讲课程体系中的位置`,
    `- 与前后分 P 的逻辑衔接`,
    '',
    `### 2. 核心概念（基于分 P 标题）`,
    '- ⏳ 待知识点增强脚本补充实质内容',
    '- 对照隐语官方文档相应章节',
    '',
    '### 3. 制度/技术要点',
    '- ⏳ 当前为元数据增强笔记',
    '',
    '### 4. 实践与案例',
    '- ⏳ 待增强后补充架构图与落地要点',
  ].join('\n');
}

function getTerms(part) {
  const common = [
    ['数据要素', '可参与社会化配置、创造价值的数字化资源'],
    ['隐私计算', '在保护数据本身不泄露前提下实现数据价值挖掘的技术体系'],
  ];
  const map = {
    政策: [['供得出', '数据资源有效供给'], ['流得动', '合规流通机制'], ['用得好', '价值化利用'], ['保安全', '全生命周期安全']],
    公共数据: [['授权运营', '政府数据经授权由运营机构开发'], ['三权分置', '持有权、加工使用权、产品经营权']],
    法律法规: [['数据安全法', '2021年施行'], ['个人信息保护法', 'PIPL']],
    匿名化: [['去标识化', '移除直接标识符'], ['k-匿名', '每条记录至少与k-1条不可区分']],
    可信数据空间: [['连接器', '参与方接入与策略执行节点'], ['使用控制', '数据可用不可见']],
    密态: [['密态计算', '数据密文状态下完成计算'], ['TEE', '可信执行环境']],
    MPC: [['多方安全计算', '多方联合计算不泄露各自输入'], ['秘密分享', 'Shamir 方案']],
    同态: [['FHE', '全同态加密，密文上任意计算'], ['部分同态', '仅支持特定运算']],
    零知识: [['ZK', '证明者向验证者证明陈述为真而不泄露证据'], ['SNARK', '简洁非交互证明']],
    差分隐私: [['ε-DP', '隐私预算参数'], ['拉普拉斯机制', '加噪实现DP']],
    联邦学习: [['横向联邦', '样本空间重叠特征不同'], ['纵向联邦', '特征重叠样本不同']],
    SecretFlow: [['SPU', '密态计算单元'], ['SCQL', '安全协作查询语言']],
    区块链: [['智能合约', '链上自动执行逻辑'], ['联盟链', '许可制多方共识']],
    案例: [['联合建模', '多方数据协作训练模型'], ['PSI', '隐私集合求交']],
  };
  for (const [key, terms] of Object.entries(map)) {
    if (part.includes(key)) return [...common, ...terms];
  }
  return [...common, ['本模块关键词', part.replace(/^\d+_/, '').slice(0, 30)]];
}

const fileNames = data.parts.map((p) => sanitizeFilename(p.part, p.page));
fs.mkdirSync(OUT_DIR, { recursive: true });

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
  const points = getCorePoints(p.part, p.page);
  const terms = getTerms(p.part);
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
tool: "bilibili-obsidian-notes 工作流 + B站 API + Node 抓取"
status: 已生成
source_type: 元数据增强
---

# P${String(p.page).padStart(2, '0')} ${shortTitle}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${shortTitle} |
| 模块 | ${theme.name} |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 官方文档 | [SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs) |
| 合集 | ${data.season} |

## 核心要点

${points.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

## 详细笔记

${getOutline(p.part, p.page)}

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
- ⏳ 知识点增强（待 \`enhance-data-element-notes.js\`）

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Mind map
const mindmapNodes = data.parts.map((p, i) => {
  const fn = fileNames[i];
  const short = p.part.replace(/^\d+_/, '').slice(0, 18);
  return `    P${String(p.page).padStart(2, '0')} ${short}
      [[${fn}]]`;
}).join('\n');

const mindmapMd = `---
title: "数据要素技术 - 思维导图"
tags: [数据要素, 思维导图, mermaid, 隐私计算, SecretFlow]
updated: ${DATE}
---

# 数据要素技术 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    政策治理 P01-P06
      国家数据政策
      公共数据授权
      安全法规
    可信数据空间 P07-P08 P18
      标准体系
      连接器
    密态计算 P09-P17
      TEE TrustFlow
      密态大模型
      远程证明
    隐私计算 P19-P24
      MPC FHE ZK
      差分隐私 联邦学习
    SecretFlow P25-P32
      YACL SPU PSI
      SCQL Kuscia SecretPad
    区块链数联网 P33-P38
      数据元件
      区块链 ZK
    行业案例 P39-P47
      医疗 金融 车险
\`\`\`

## 分 P 详图

\`\`\`mermaid
mindmap
  root((${data.title}))
${mindmapNodes}
\`\`\`

> 时长来自 B 站 API（${DATE}）。封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

// Overview
const indexRows = data.parts.map((p, i) => {
  const fn = fileNames[i];
  const short = p.part.replace(/^\d+_/, '');
  return `| P${String(p.page).padStart(2, '0')} | ${short} | ${p.duration_fmt} | [[${fn}]] |`;
}).join('\n');

const themeFlow = `flowchart TB
  T1[政策与安全治理 P01-P06] --> T2[可信数据空间 P07-P08]
  T2 --> T3[密态计算与TEE P09-P17]
  T3 --> T4[隐私计算基础 P19-P24]
  T4 --> T5[SecretFlow生态 P25-P32]
  T5 --> T6[区块链与数联网 P33-P38]
  T6 --> T7[行业案例 P39-P47]
  T2 --> T8[连接器 P18]
  T8 --> T4`;

const overviewMd = `---
title: "${data.title}"
source: "https://www.bilibili.com/video/${BV}"
up: "${data.up}"
tags: [数据要素, 隐私计算, 视频笔记, MOC, SecretFlow, 联邦学习, 可信数据空间]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已生成
source_type: 元数据增强
---

# ${data.title}

> 隐语 SecretFlow 官方「**${data.season}**」系列教程，共 **${data.parts.length}** 个分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。UP **${data.up}** 从政策解读到 MPC、联邦学习、可信数据空间、区块链与行业案例，系统讲解数据要素流通技术栈。
>
> 当前笔记基于 **官方简介 + 分 P 结构** 整理，待知识点增强脚本补充 800–1500 字/篇实质内容。

## 视频简介（B 站原文）

${data.desc}

官方文档：[SecretFlow 文档](https://www.secretflow.org.cn/zh-CN/docs)

## 视频数据

| 字段 | 内容 |
|------|------|
| BV 号 | ${BV} |
| UP 主 | ${data.up} |
| 合集 | ${data.season} |
| 总时长 | ${fmtDurationHms(data.total_duration_sec)}（${data.total_duration_sec} 秒） |
| 分 P 数 | ${data.parts.length} |
| 播放量 | ${data.stat.view.toLocaleString()}（抓取时） |
| 收藏 | ${data.stat.favorite.toLocaleString()} |
| 标签 | ${data.tags.join('、')} |
| 字幕状态 | ${data.subtitle_status} |

## 思维导图

\`\`\`mermaid
mindmap
  root((数据要素流通技术))
    政策治理
      供得出流得动用得好保安全
      公共数据授权运营
      法律法规与匿名化
    可信数据空间
      标准体系与整体能力
      连接器与使用控制
    密态计算
      TEE与TrustFlow
      密态大模型与GPU-TEE
      远程证明
    隐私计算
      MPC FHE PSI ZK
      差分隐私与联邦学习
    SecretFlow
      YACL SPU SCQL
      Kuscia SecretPad
    区块链数联网
      数据元件
      ZK链上应用
      数场数联网
    行业案例
      医疗金融车险
      普惠信贷
\`\`\`

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 笔记 |
|------|-------------|------|------|
${indexRows}

## 学习路径

\`\`\`mermaid
${themeFlow}
\`\`\`

### 按主题分组

1. **政策与安全治理（P01–P06）** — 国家数据政策、公共数据授权、法律法规、匿名化、流通安全、产品分级
2. **可信数据空间（P07–P08、P18）** — 标准体系、整体能力、连接器
3. **密态计算与 TEE（P09–P17）** — 密态概念、密态胶囊、TEE OS、TrustFlow、密态大模型、GPU-TEE、机密容器、远程证明
4. **隐私计算核心技术（P19–P24）** — MPC、FHE、PSI/匿踪查询、ZK、差分隐私、联邦学习
5. **SecretFlow 生态（P25–P32）** — SecretFlow、YACL、SPU、PSI、SCQL、Kuscia、SecretPad、KusciaAPI
6. **数据元件·区块链·数联网（P33–P38）** — 数据元件、区块链与数据安全、ZK 链上应用、数联网与数场
7. **行业实践案例（P39–P47）** — 新冠预测、金融风控、跨企业查询、运营商对账、医疗、车险、汽车流通、普惠信贷

> 建议：零基础先 P01–P08 建立制度框架；有开发基础可 P09 后并行学技术栈；P25 起配合 SecretFlow 本地环境动手实践。

## 关联资源

- 原始 API 数据：\`Tools/${BV}-full.json\`
- 笔记生成：\`Tools/bili-fetch/generate-data-element-notes.js\`
- 知识点增强：\`Tools/bili-fetch/enhance-data-element-notes.js\`
- 封面目录：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]
- 官方文档：https://www.secretflow.org.cn/zh-CN/docs

## 工具与数据文件

| 工具 | 路径 | 用途 |
|------|------|------|
| Node 抓取脚本 | \`Tools/bili-fetch/fetch-bilibili.js\` | 元数据 + 首帧封面 |
| 结构化摘要 | \`Tools/${BV}-full.json\` | 分 P 数据 |
| 知识点库 | \`Tools/bili-fetch/content/data-element-knowledge.js\` | 批量维护增强内容 |
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

console.log(`Generated ${data.parts.length} part notes + 总览 + 思维导图 in ${OUT_DIR}`);
