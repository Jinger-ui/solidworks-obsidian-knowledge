/**
 * Generate Obsidian notes for BV16j411q7pf MPC course (冯登国院士)
 * Usage: node generate-mpc-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV16j411q7pf';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '安全多方计算MPC冯登国');
const DATE = '2026-06-07';

const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function videoUrl(part) {
  const bvid = part.bvid || BV;
  return `https://www.bilibili.com/video/${bvid}`;
}

function sanitizeFilename(part, page) {
  let name = part
    .replace(/（.*?）/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[———]/g, '-')
    .replace(/Lecture\s*\d+\s*/i, '')
    .replace(/冯登国院士/g, '')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|]/g, '')
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
  if (page === 1) return { id: 'mpc-base', name: 'MPC 基本概念与基础组件' };
  if (page === 2) return { id: 'mpc-ss', name: '基于秘密分享的 MPC' };
  return { id: 'mpc-gc', name: '基于混淆电路的 MPC' };
}

function getCorePoints(part, page) {
  const mod = getModule(page);
  const hints = {
    1: ['MPC 定义与百万富翁问题', '半诚实/恶意敌手与威胁模型', '不经意传输 OT、承诺方案', '秘密分享入门与理想功能'],
    2: ['Shamir 门限秘密分享', 'BGW 协议：乘法门与度数约简', 'GMW 协议：布尔电路与 AND 门', '恶意安全与验证秘密分享'],
    3: ['Yao 混淆电路 Garbled Circuit', 'OT 扩展与 Free-XOR 优化', 'Cut-and-choose 恶意安全', '两方 vs 多方 GC 路线'],
  };
  const extra = hints[page] || [part, '对照视频与经典论文', '待增强脚本补充'];
  return [
    `**模块**：${mod.name}`,
    `**定位**：冯登国院士 MPC 系统课程（合集 3 讲）`,
    ...extra.slice(0, 4),
  ];
}

function getOutline(part, page) {
  const mod = getModule(page);
  return [
    `### 1. 模块定位（${mod.name}）`,
    `- 本 P 在 3 讲路线图中的位置`,
    `- 与前后 Lecture 的逻辑衔接`,
    '',
    `### 2. 核心概念（基于「${part}」）`,
    '- ⏳ 待教程级增强脚本补充 2500–3500 字实质内容',
    '- 对照本集主题查阅 Goldreich、Yao、BGW 等经典文献',
    '',
    '### 3. 算法与公式',
    '- ⏳ 当前为元数据增强笔记',
    '- 增强后将含 Shamir/BGW/GMW/Yao GC 公式与 Walkthrough',
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
  const url = videoUrl(p);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${p.part}"
source: "${url}"
up: "${data.up}"
tags: [MPC, 安全多方计算, 密码学, 隐私计算, 视频笔记, ${mod.id}]
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
| 链接 | [B 站 Lecture ${p.page}](${url}) |
| 系列 | 安全多方计算（MPC）—— 冯登国原院士 |

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
- ⏳ 教程级知识点增强（待 \`enhance-mpc-notes.js\`）
- ⏳ 逐字转写（${data.subtitle_status}）

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

const mindmapMd = `---
title: "安全多方计算 MPC 冯登国 - 思维导图"
tags: [MPC, 安全多方计算, 思维导图, mermaid]
updated: ${DATE}
---

# 安全多方计算 MPC · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    Lecture1 基本概念
      威胁模型
      OT与承诺
      秘密分享入门
    Lecture2 秘密分享
      Shamir
      BGW
      GMW
    Lecture3 混淆电路
      Yao GC
      Cut-and-choose
      OT扩展
\`\`\`

## 分 P 详图

\`\`\`mermaid
mindmap
  root((冯登国 MPC 三讲))
${data.parts.map((p, i) => `    P${String(p.page).padStart(2, '0')} ${p.part.slice(0, 20)}
      [[${fileNames[i]}]]`).join('\n')}
\`\`\`

> 封面见 \`06-资源附件/video-notes-images/\`。教程级增强后更新字数标注。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

const indexRows = data.parts.map((p, i) => {
  return `| P${String(p.page).padStart(2, '0')} | ${p.part} | ${p.duration_fmt} | [[${fileNames[i]}]] |`;
}).join('\n');

const overviewMd = `---
title: "${data.title}"
source: "https://www.bilibili.com/video/${BV}"
up: "${data.up}"
tags: [MPC, 安全多方计算, 密码学, 隐私计算, 视频笔记, MOC, 教程]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已生成
source_type: 元数据增强
---

# ${data.title}

> 冯登国院士系统讲授安全多方计算（MPC）理论与协议，B 站合集共 **${data.parts.length}** 讲（约 ${fmtDurationHms(data.total_duration_sec)}）。
>
> 当前笔记基于 **官方元数据 + 合集结构** 整理，待 \`enhance-mpc-notes.js\` 补充教程级 2500–3500 字/篇。

## 视频简介（B 站合集）

${data.desc || '网络空间安全领域经典 MPC 课程，涵盖基本概念、秘密分享协议族与混淆电路方法。'}

## 视频数据

| 字段 | 内容 |
|------|------|
| BV 号（合集入口） | ${BV} |
| UP 主 | ${data.up} |
| 总时长 | ${fmtDurationHms(data.total_duration_sec)}（${data.total_duration_sec} 秒） |
| 分 P 数 | ${data.parts.length} |
| 播放量 | ${data.stat.view.toLocaleString()}（合集抓取时） |
| 收藏 | ${(data.stat.fav || data.stat.favorite || 0).toLocaleString()} |
| 标签 | ${data.tags.join('、')} |
| 字幕状态 | ${data.subtitle_status} |

## 思维导图

\`\`\`mermaid
mindmap
  root((冯登国 MPC))
    Lecture1 概念与组件
      威胁模型
      OT 承诺
      秘密分享
    Lecture2 秘密分享路线
      Shamir BGW
      GMW 布尔电路
    Lecture3 混淆电路路线
      Yao GC
      Cut-and-choose
\`\`\`

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 笔记 |
|------|-------------|------|------|
${indexRows}

## 学习路径

\`\`\`mermaid
flowchart LR
  A[Lecture1 概念] --> B[Lecture2 秘密分享]
  B --> C[Lecture3 混淆电路]
  A --> D[[P19-多方安全计算MPC]]
  C --> E[[联邦学习系列]]
\`\`\`

1. **Lecture 1** — MPC 定义、威胁模型、OT/承诺/秘密分享基础组件
2. **Lecture 2** — Shamir、BGW、GMW 等算术/布尔电路协议
3. **Lecture 3** — Yao 混淆电路、OT 扩展、Cut-and-choose 恶意安全

## 关联资源

- API 数据：\`Tools/${BV}-full.json\`
- 生成脚本：\`Tools/bili-fetch/generate-mpc-notes.js\`
- 增强脚本：\`Tools/bili-fetch/enhance-mpc-notes.js\`
- 封面：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]
- 交叉引用：[[BV1ser5BDESU-总览]] [[P19-多方安全计算MPC]] · [[BV1q4421A72h-总览]] 联邦学习

## 待补充

- [ ] 教程级知识点增强（3 篇）
- [ ] Whisper 逐字转写
- [ ] 板书公式截图
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

console.log(`Generated ${data.parts.length} notes + 总览 + 思维导图 in ${OUT_DIR}`);
console.log('Files:', fileNames.join(', '));
