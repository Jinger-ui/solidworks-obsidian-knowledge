/**
 * Enhance MPC Obsidian notes to tutorial level (2500-3500 chars/page)
 * Usage: node enhance-mpc-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV16j411q7pf';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '安全多方计算MPC冯登国');
const DATE = '2026-06-07';

const { buildTutorialBody, countChars } = require('./lib/tutorial-framework');
const tutorialDetail = require('./content/mpc-tutorial-detail');
const knowledge = require('./content/mpc-knowledge');

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

function getModule(page) {
  if (page === 1) return { id: 'mpc-base', name: 'MPC 基本概念与基础组件' };
  if (page === 2) return { id: 'mpc-ss', name: '基于秘密分享的 MPC' };
  return { id: 'mpc-gc', name: '基于混淆电路的 MPC' };
}

function getExamTips(page) {
  const tips = {
    1: 'MPC 定义、理想/真实范式、半诚实/恶意敌手、OT、承诺、秘密分享入门',
    2: 'Shamir 门限分享、BGW 度约简、GMW AND 门、Beaver 三元组、BGW vs GMW',
    3: 'Yao Garbled Circuit、Wire label、Free-XOR、Cut-and-choose、OT 扩展',
  };
  return tips[page] || '对照视频与经典论文';
}

function getTerms(part, page) {
  const common = [
    ['MPC', '多方在不泄露私有输入下联合计算函数'],
    ['模拟器', '证明真实协议不泄露超过理想功能的视图生成器'],
  ];
  const map = {
    1: [
      ['半诚实敌手', '遵守协议但试图推断他人秘密'],
      ['恶意敌手', '可任意偏离协议与篡改消息'],
      ['OT', '发送方两条消息，接收方择一收取且选择保密'],
      ['承诺', '先承诺后打开，具隐藏性与绑定性'],
    ],
    2: [
      ['Shamir 分享', '$(t,n)$ 门限，$t+1$ 份重构秘密'],
      ['BGW', '诚实多数下算术电路 MPC，乘法门需度约简'],
      ['GMW', '布尔电路 MPC，XOR 本地、AND 用 OT'],
      ['Beaver 三元组', '离线预处理 $c=ab$ 用于在线 AND'],
    ],
    3: [
      ['Garbled Circuit', 'Yao 将布尔电路加密供 Evaluator 求值'],
      ['Free-XOR', 'XOR 门 label 异或，无需门表'],
      ['Cut-and-choose', '多发电路随机抽检以防御恶意 Garbler'],
      ['OT 扩展', '少量种子 OT 扩展为海量 OT'],
    ],
  };
  if (map[page]) return [...common, ...map[page]];
  const mod = getModule(page);
  return [...common, ['模块关键词', mod.name]];
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

  const mod = getModule(p.page);
  const baseContent = knowledge[p.page];
  if (!baseContent) {
    console.warn(`Missing knowledge for P${p.page}`);
    return;
  }
  const shortTitle = p.part.replace(/——.*$/g, '').replace(/冯登国院士/g, '').trim();
  const prevTitle = idx > 0 ? data.parts[idx - 1].part : null;
  const nextTitle = idx < data.parts.length - 1 ? data.parts[idx + 1].part : null;
  const examTip = getExamTips(p.page);
  const url = videoUrl(p);

  const content = buildTutorialBody({
    seriesName: '安全多方计算 MPC（冯登国院士）',
    page: p.page,
    shortTitle,
    themeName: mod.name,
    prevTitle,
    nextTitle,
    examTip,
    baseContent,
    detail: tutorialDetail[p.page] || {},
    durationFmt: p.duration_fmt,
  });
  const wc = countChars(content);
  totalChars += wc;
  wordCounts.push(wc);

  const terms = getTerms(p.part, p.page);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${p.part}"
source: "${url}"
up: "${data.up}"
tags: [MPC, 安全多方计算, 密码学, 隐私计算, 视频笔记, ${mod.id}, 教程级]
duration: "${p.duration_fmt.replace('分', 'm').replace('秒', 's')}"
cid: ${p.cid}
created: ${DATE}
updated: ${DATE}
tool: "bilibili-obsidian-notes 工作流 + 教程级增强脚本"
status: 教程级已增强
source_type: 教程级知识点增强
detail_level: 教程级
word_count: ${wc}
transcript_engine: 
transcript_status: 待转写
---

# P${String(p.page).padStart(2, '0')} ${p.part}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${p.part} |
| 模块 | ${mod.name} |
| 时长 | ${p.duration_fmt.replace(/(\d+)分(\d+)秒/, '$1 分 $2 秒')} |
| 链接 | [B 站 Lecture ${p.page}](${url}) |
| 内容来源 | 教程级知识点增强（非 UP 逐字转写） |

## 核心要点

1. **本 P 主题**：${shortTitle}
2. **模块定位**：${mod.name}
3. **研读侧重**：${examTip}
4. **笔记层级**：教程级（约 ${wc} 字），含速览、Mermaid、Walkthrough、自测题
5. **学习建议**：先读「3 分钟速览」与「图解」，再深入「详细讲解」

> 以下内容基于 MPC 密码学理论体系撰写，对应冯登国院士 B 站课程「${p.part}」。**非 UP 逐字转写**；不看视频可建立框架，看视频对照「与视频对照表」。

${content}

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${data.parts[idx - 1].part}**（[[${prev}]]）` : `- ← 系列起点，见 [[${BV}-总览]]`}
${next ? `- → **${data.parts[idx + 1].part}**（[[${next}]]）` : '- → 系列终点，建议回到总览复盘'}

## 逐字转写

> 状态：待转写。运行 \`Tools/transcribe/transcribe.ps1 -Bvid ${p.bvid || BV} -Part 1\` 补充（合集 Lecture ${p.page} 对应独立 BV）。

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ✅ **教程级增强**：含 Mermaid、Walkthrough、自测题（约 ${wc} 字，${DATE}）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

const overviewPath = path.join(OUT_DIR, `${BV}-总览.md`);
if (fs.existsSync(overviewPath)) {
  let overview = fs.readFileSync(overviewPath, 'utf8');
  overview = overview.replace(/source_type: 元数据增强/, 'source_type: 知识点增强');
  overview = overview.replace(/status: 已生成/, 'status: 已增强');
  overview = overview.replace(
    /> 当前笔记基于 \*\*官方元数据 \+ 合集结构\*\* 整理，待 `enhance-mpc-notes\.js` 补充教程级 2500–3500 字\/篇。/,
    `> 各分 P 笔记已升级为 **教程级**（约 2500–3500 字/篇，含 Mermaid、Walkthrough、自测题，${DATE}）。B 站 API 无外挂字幕，逐字稿可后续用 Whisper/BiliNote 补充。`
  );
  overview = overview.replace(/updated: \d{4}-\d{2}-\d{2}/, `updated: ${DATE}`);

  const rows = data.parts.map((p, idx) => {
    const wc = wordCounts[idx] || 0;
    return `| P${String(p.page).padStart(2, '0')} | ${p.part} | ${p.duration_fmt} | ~${wc} | [[${fileNames[idx]}]] |`;
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

  overview = overview.replace(
    /- \[ \] 教程级知识点增强（3 篇\)/,
    '- [x] 教程级知识点增强（3 篇，均篇 ~' + Math.round(totalChars / wordCounts.length) + ' 字）'
  );
  fs.writeFileSync(overviewPath, overview, 'utf8');
}

const mindmapPath = path.join(OUT_DIR, '思维导图.md');
const mindmapContent = `---
title: "安全多方计算 MPC 冯登国 - 思维导图"
tags: [MPC, 安全多方计算, 思维导图, mermaid]
updated: ${DATE}
status: 已增强
---

# 安全多方计算 MPC · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    Lecture1 ~${wordCounts[0] || 0}字
      [[${fileNames[0]}]]
    Lecture2 ~${wordCounts[1] || 0}字
      [[${fileNames[1]}]]
    Lecture3 ~${wordCounts[2] || 0}字
      [[${fileNames[2]}]]
\`\`\`

> 教程级增强完成（${DATE}），合计约 ${totalChars} 字，均篇 ${Math.round(totalChars / wordCounts.length)} 字。封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(mindmapPath, mindmapContent, 'utf8');

console.log(`Enhanced ${wordCounts.length} MPC notes in ${OUT_DIR}`);
console.log(`Word counts min=${Math.min(...wordCounts)} max=${Math.max(...wordCounts)} avg=${Math.round(totalChars / wordCounts.length)}`);
console.log(`Total: ~${totalChars} chars`);
