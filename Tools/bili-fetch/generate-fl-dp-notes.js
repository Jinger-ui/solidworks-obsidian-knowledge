/**
 * Generate Obsidian notes for BV1q4421A72h FL/DP course
 * Usage: node generate-fl-dp-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1q4421A72h';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '联邦学习与差分隐私');
const DATE = '2026-06-06';

const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function sanitizeFilename(part, page) {
  let name = part
    .replace(/（.*?）/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[———]/g, '-')
    .replace(/：/g, '-')
    .replace(/[\uFFFD]/g, '')
    .replace(/\s+/g, '')
    .trim();
  if (!name || name.length > 45) {
    name = part.replace(/[\\/:*?"<>|（）()【】\[\]]/g, '').replace(/\s+/g, '').slice(0, 45);
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

function getModule(page) {
  if (page <= 3) return { id: 'fl-base', name: '联邦学习基础' };
  if (page <= 5) return { id: 'fl-opt', name: '通信与联邦降维' };
  if (page === 6) return { id: 'dp-fl', name: '差分隐私联邦' };
  if (page <= 12) return { id: 'simons', name: 'Simons Institute 工作坊' };
  if (page === 13) return { id: 'dp-theory', name: '在线学习与差分隐私' };
  return { id: 'papers', name: '前沿论文' };
}

function getCorePoints(part, page) {
  const mod = getModule(page);
  const hints = {
    1: ['联邦学习动机：数据不出域、协作训练', 'FedAvg 一轮流程', 'Cross-device vs Cross-silo'],
    2: ['协作学习与联邦学习的包含关系', '可视化理解数据驻留', 'Non-IID 几何直觉'],
    3: ['FedAvg 算法与系统架构', 'Non-IID 与客户端漂移', '采样率 $C$ 与本地步 $E$'],
    4: ['量化、稀疏化、误差反馈', 'FedProx/SCAFFOLD 减通信轮次', '通信量估算'],
    5: ['联邦幂迭代 PCA', '安全聚合保护局部统计', '降维作为联邦预处理'],
    6: ['用户级 $(\\varepsilon,\\delta)$-DP', 'DP-SGD 裁剪与加噪', '隐私会计与子采样放大'],
    7: ['Simons 工作坊问题版图', '协作学习多种形式', '开放问题索引'],
    8: ['鲁棒聚合与个性化联邦', '异步与公平性', '拜占庭客户端'],
    9: ['隐私安全综述：攻击分类', 'SecAgg 与 DP 组合', '投毒与成员推断'],
    10: ['纵向联邦与异质性形式化', '通信-隐私联合设计', '合规与遗忘权'],
    11: ['优化综述：FedProx/SCAFFOLD', '收敛界与通信复杂度', '本地步 $E$ 在理论中的角色'],
    12: ['去中心化 FL 与大模型联邦', 'benchmark 与产学研鸿沟', 'Simons 系列复盘'],
    13: ['在线凸优化与遗憾界', '联邦多轮=DP 组合', 'RDP/PLD 隐私会计'],
    14: ['Local GD 通信加速定理', '最优本地步 $\\tau$ 与异质性', 'ICML 2022 Richtárik'],
    15: ['Stiefel 流形与黎曼 PCA', '在线随机 CCA', '与联邦 PCA 的进阶关系'],
  };
  const extra = hints[page] || [part, '对照视频与论文', '待增强脚本补充'];
  return [
    `**模块**：${mod.name}`,
    `**定位**：Proof-Trivial 联邦学习/差分隐私系列`,
    ...extra.slice(0, 4),
  ];
}

function getOutline(part, page) {
  const mod = getModule(page);
  return [
    `### 1. 模块定位（${mod.name}）`,
    `- 本 P 在 15 集路线图中的位置`,
    `- 与前后分 P 的逻辑衔接`,
    '',
    `### 2. 核心概念（基于「${part}」）`,
    '- ⏳ 待教程级增强脚本补充 2500–3500 字实质内容',
    '- 对照本集主题查阅经典论文与开放问题清单',
    '',
    '### 3. 算法与公式',
    '- ⏳ 当前为元数据增强笔记',
    '- 增强后将含 FedAvg/DP/优化等公式与 Walkthrough',
    '',
    '### 4. 实践与论文',
    '- ⏳ 待增强后补充自测题与延伸阅读',
  ].join('\n');
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

  const mod = getModule(p.page);
  const points = getCorePoints(p.part, p.page);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${p.part}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [联邦学习, 差分隐私, 隐私计算, 视频笔记, ${mod.id}]
duration: "${p.duration_fmt.replace('分', 'm').replace('秒', 's')}"
cid: ${p.cid}
created: ${DATE}
updated: ${DATE}
tool: "bilibili-obsidian-notes 工作流 + B站 API + Node 抓取"
status: 已生成
source_type: 元数据增强
---

# P${String(p.page).padStart(2, '0')} ${p.part}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${p.part} |
| 模块 | ${mod.name} |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 系列 | Proof-Trivial 联邦学习·协作学习·差分隐私 |

## 核心要点

${points.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

## 详细笔记

${getOutline(p.part, p.page)}

## 与前后分 P 的衔接

${prev ? `- ← **${data.parts[idx - 1].part}**（[[${prev}]]）` : `- ← 系列起点，见 [[${BV}-总览]]`}
${next ? `- → **${data.parts[idx + 1].part}**（[[${next}]]）` : '- → 系列终点'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ⏳ 教程级知识点增强（待 \`enhance-fl-dp-notes.js\`）
- ⏳ 逐字转写（${data.subtitle_status}）

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Mind map
const mindmapMd = `---
title: "联邦学习与差分隐私 - 思维导图"
tags: [联邦学习, 差分隐私, 思维导图, mermaid]
updated: ${DATE}
---

# 联邦学习与差分隐私 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    基础 P01-P03
      FedAvg
      Non-IID
      协作vs联邦
    专题 P04-P06
      通信优化
      联邦PCA
      用户级DP
    Simons P07-P12
      隐私安全综述
      优化综述
    理论论文 P13-P15
      在线DP
      本地步加速
      黎曼CCA
\`\`\`

## 分 P 详图

\`\`\`mermaid
mindmap
  root((${data.title.replace(/[\[\]]/g, '').slice(0, 30)}))
${data.parts.map((p, i) => `    P${String(p.page).padStart(2, '0')} ${p.part.slice(0, 18)}
      [[${fileNames[i]}]]`).join('\n')}
\`\`\`

> 封面见 \`06-资源附件/video-notes-images/\`。教程级增强后更新字数标注。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

// Overview
const indexRows = data.parts.map((p, i) => {
  return `| P${String(p.page).padStart(2, '0')} | ${p.part} | ${p.duration_fmt} | [[${fileNames[i]}]] |`;
}).join('\n');

const overviewMd = `---
title: "${data.title}"
source: "https://www.bilibili.com/video/${BV}"
up: "${data.up}"
tags: [联邦学习, 差分隐私, 隐私计算, 视频笔记, MOC, 教程]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已生成
source_type: 元数据增强
---

# ${data.title}

> Proof-Trivial 持续更新的联邦学习（Federated Learning）、协作学习（Collaborative Learning）、差分隐私（Differential Privacy）课程与讲座合集，共 **${data.parts.length}** 个分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。
>
> 当前笔记基于 **官方简介 + 分 P 结构** 整理，待 \`enhance-fl-dp-notes.js\` 补充教程级 2500–3500 字/篇。

## 视频简介（B 站原文）

${data.desc}

## 视频数据

| 字段 | 内容 |
|------|------|
| BV 号 | ${BV} |
| UP 主 | ${data.up} |
| 总时长 | ${fmtDurationHms(data.total_duration_sec)}（${data.total_duration_sec} 秒） |
| 分 P 数 | ${data.parts.length} |
| 播放量 | ${data.stat.view.toLocaleString()}（抓取时） |
| 收藏 | ${data.stat.favorite.toLocaleString()} |
| 标签 | ${data.tags.join('、')} |
| 字幕状态 | ${data.subtitle_status} |

## 思维导图

\`\`\`mermaid
mindmap
  root((联邦学习与差分隐私))
    基础入门 P01-P03
      FedAvg与系统
      可视化直觉
      Non-IID
    工程专题 P04-P06
      通信压缩
      联邦PCA
      用户级DP
    Simons P07-P12
      隐私安全Survey
      优化Survey
    论文深读 P13-P15
      在线学习×DP
      本地步通信加速
      Riemannian PCA
\`\`\`

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 笔记 |
|------|-------------|------|------|
${indexRows}

## 学习路径

\`\`\`mermaid
flowchart LR
  A[P01-P03 基础] --> B[P04-P06 专题]
  B --> C[P07-P12 Simons]
  C --> D[P13-P15 论文]
  B --> D
\`\`\`

1. **P01–P03** — 联邦学习动机、FedAvg、Non-IID、客户端采样
2. **P04–P06** — 通信优化、联邦 PCA、用户级差分隐私
3. **P07–P12** — Simons 工作坊：隐私安全与优化综述
4. **P13–P15** — 在线学习×DP、ICML 本地步加速、NeurIPS 黎曼 CCA

## 关联资源

- API 数据：\`Tools/${BV}-full.json\`
- 生成脚本：\`Tools/bili-fetch/generate-fl-dp-notes.js\`
- 增强脚本：\`Tools/bili-fetch/enhance-fl-dp-notes.js\`
- 封面：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]
- 交叉引用：[[BV1ser5BDESU-总览]] 数据要素课 P23–P24

## 待补充

- [ ] 教程级知识点增强（15 篇）
- [ ] Whisper 逐字转写
- [ ] 论文公式板书截图
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

console.log(`Generated ${data.parts.length} notes + 总览 + 思维导图 in ${OUT_DIR}`);
console.log('Files:', fileNames.join(', '));
