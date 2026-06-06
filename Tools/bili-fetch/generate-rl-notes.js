/**
 * Generate Obsidian notes for BV1r6cjeCEkW Princeton ECE524 RL course (skeleton)
 * Usage: node generate-rl-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1r6cjeCEkW';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '强化学习理论基础');
const DATE = '2026-06-06';

const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function sanitizeFilename(part, page) {
  let name = part
    .replace(/^【\d+】\s*/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[———]/g, '-')
    .replace(/：/g, '-')
    .replace(/\s+/g, '')
    .trim();
  if (!name || name.length > 45) {
    name = part.replace(/^【\d+】\s*/, '').replace(/[\\/:*?"<>|（）()【】\[\]]/g, '').slice(0, 45);
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
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h} 小时 ${m} 分 ${String(s).padStart(2, '0')} 秒`;
  return `${m} 分 ${String(s).padStart(2, '0')} 秒`;
}

function getThemeGroup(page) {
  if (page <= 3) return { id: 'mdp', name: 'MDP与动态规划', range: 'P01–P03' };
  if (page <= 5) return { id: 'prob', name: '概率工具与集中不等式', range: 'P04–P05' };
  if (page === 6) return { id: 'gen', name: '生成模型', range: 'P06' };
  if (page <= 11) return { id: 'explore', name: '探索与Regret理论', range: 'P07–P11' };
  if (page === 12) return { id: 'offline', name: '离线强化学习', range: 'P12' };
  if (page <= 17) return { id: 'approx', name: '大状态空间与函数逼近', range: 'P13–P17' };
  if (page <= 20) return { id: 'game', name: '多智能体与博弈论', range: 'P18–P20' };
  return { id: 'pomdp', name: '部分可观测RL', range: 'P21–P22' };
}

function shortTitle(part) {
  return part.replace(/^【\d+】\s*/, '').trim();
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
  const st = shortTitle(p.part);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${st}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [强化学习, RL理论, 视频笔记, ${theme.id}, Princeton, ECE524]
duration: "${p.duration_fmt.replace('分', 'm').replace('秒', 's')}"
cid: ${p.cid}
created: ${DATE}
updated: ${DATE}
tool: "bilibili-obsidian-notes 工作流 + B站 API + Node 抓取"
status: 已生成
source_type: 元数据增强
transcript_status: 待转写
---

# P${String(p.page).padStart(2, '0')} ${st}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${st} |
| 模块 | ${theme.name} |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 课程主页 | [Chi Jin ECE524](https://sites.google.com/view/cjin/teaching/ece524) |
| 讲师 | Chi Jin（Princeton ECE） |

## 核心要点

1. **主题模块**：${theme.name}（${theme.range}）
2. **本 P 主题**：${st}
3. **课程定位**：Princeton ECE524 强化学习理论基础（B 站转载 Proof-Trivial）
4. **学习建议**：先读总览学习路径，按 P01→P22 顺序；配合 Agarwal 教材与课程讲义

## 详细笔记

### 1. 模块定位（${theme.name}）

- 本 P 在 22 讲课程体系中的位置
- 与前后分 P 的逻辑衔接

### 2. 核心概念

- ⏳ 待 \`enhance-rl-notes.js\` 补充教程级内容

### 3. 定理与算法

- ⏳ 当前为元数据增强笔记

## 逐字转写

> ⏳ **待转写**（\`transcript_status: 待转写\`）
>
> B 站 API 无外挂字幕轨（\`need_login_subtitle: true\`）。可使用 \`Tools/transcribe/\` 下 Whisper/BiliNote 工作流后续补充。转写完成后在此节粘贴全文并更新 frontmatter \`transcript_status: 已完成\`。

## 关键术语

| 术语 | 说明 |
|------|------|
| MDP | 马尔可夫决策过程，RL 数学基础 |
| Regret | 相对最优策略的累积遗憾 |
| Chi Jin | Princeton 教授，RL 理论专家 |

## 与前后分 P 的衔接

${prev ? `- ← **${shortTitle(data.parts[idx - 1].part)}**（[[${prev}]]）` : `- ← 课程起点，见 [[${BV}-总览]]`}
${next ? `- → **${shortTitle(data.parts[idx + 1].part)}**（[[${next}]]）` : '- → 课程终点'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ⏳ 教程级增强（待 \`enhance-rl-notes.js\`）

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Mind map skeleton
const mindmapMd = `---
title: "强化学习理论基础 - 思维导图"
tags: [强化学习, 思维导图, mermaid, RL理论, Princeton]
updated: ${DATE}
---

# 强化学习理论基础 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    MDP与规划 P01-P03
    概率工具 P04-P05
    生成模型 P06
    探索Regret P07-P11
    离线RL P12
    函数逼近 P13-P17
    博弈MARL P18-P20
    POMDP P21-P22
\`\`\`

> 待 enhance-rl-notes.js 更新各 P 字数。封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

// Overview
const indexRows = data.parts.map((p, i) => {
  const fn = fileNames[i];
  const st = shortTitle(p.part);
  return `| P${String(p.page).padStart(2, '0')} | ${st} | ${p.duration_fmt} | [[${fn}]] |`;
}).join('\n');

const overviewMd = `---
title: "${data.title}"
source: "https://www.bilibili.com/video/${BV}"
up: "${data.up}"
tags: [强化学习, RL理论, 视频笔记, MOC, Princeton, ECE524, ChiJin]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已生成
source_type: 元数据增强
---

# ${data.title}

> Princeton **ECE524** 强化学习理论基础（讲师 **Chi Jin**），B 站 **${data.up}** 转载，共 **${data.parts.length}** 个分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。
>
> 当前笔记基于 **官方简介 + 分 P 结构** 整理，待 \`enhance-rl-notes.js\` 补充教程级内容。

## 视频简介（B 站原文）

${data.desc}

课程主页：[Chi Jin ECE524](https://sites.google.com/view/cjin/teaching/ece524)

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

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 笔记 |
|------|-------------|------|------|
${indexRows}

## 学习路径

1. **MDP 与动态规划（P01–P03）** — 马尔可夫决策过程、Bellman 方程、值/策略迭代
2. **概率工具（P04–P05）** — 集中不等式、鞅
3. **生成模型（P06）** — 与 RL/RLHF 的联系
4. **探索与 Regret（P07–P11）** — MAB、UCB、MDP 探索、上下界
5. **离线 RL（P12）** — 分布偏移、保守算法
6. **函数逼近（P13–P17）** — 大状态空间、LSVI-UCB、一般函数逼近
7. **博弈与 MARL（P18–P20）** — 零和/一般和、纳什均衡
8. **POMDP（P21–P22）** — 信念状态、部分可观测规划

## 关联资源

- 原始 API 数据：\`Tools/${BV}-full.json\`
- 笔记生成：\`Tools/bili-fetch/generate-rl-notes.js\`
- 教程级增强：\`Tools/bili-fetch/enhance-rl-notes.js\`
- 封面目录：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

console.log(`Generated ${data.parts.length} part notes + 总览 + 思维导图 in ${OUT_DIR}`);
