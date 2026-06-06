/**
 * Generate Obsidian notes skeleton for BV1Kc411i7kJ 北大文再文最优化课程
 * Usage: node generate-opt-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1Kc411i7kJ';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '最优化建模算法与理论');
const DATE = '2026-06-06';

const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function sanitizeFilename(part, page) {
  let name = part
    .replace(/^\d+\.\d+\s*/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[———]/g, '-')
    .replace(/：/g, '-')
    .replace(/\s+/g, '')
    .trim();
  if (!name || name.length > 45) {
    name = part.replace(/^\d+\.\d+\s*/, '').replace(/[\\/:*?"<>|（）()【】\[\]]/g, '').slice(0, 45);
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

function shortTitle(part) {
  return part.replace(/^\d+\.\d+\s*/, '').trim();
}

function partLabel(part) {
  return part;
}

function getThemeGroup(page) {
  if (page <= 5) return { id: 'intro', name: '第1章 绪论', range: 'P01–P05' };
  if (page <= 11) return { id: 'convex-set', name: '第2章 凸集', range: 'P06–P11' };
  if (page <= 16) return { id: 'convex-fn', name: '第3章 凸函数', range: 'P12–P16' };
  if (page <= 22) return { id: 'cvx-prob', name: '第4章 凸优化问题', range: 'P17–P22' };
  if (page <= 25) return { id: 'dual', name: '第5章 对偶理论', range: 'P23–P25' };
  if (page <= 32) return { id: 'lagrange', name: '第6章 拉格朗日对偶', range: 'P26–P32' };
  if (page <= 39) return { id: 'optimality', name: '第7章 最优性条件', range: 'P33–P39' };
  if (page <= 47) return { id: 'linesearch', name: '第8章 线搜索与梯度法', range: 'P40–P47' };
  if (page <= 52) return { id: 'subgrad', name: '第9章 次梯度法', range: 'P48–P52' };
  if (page <= 60) return { id: 'newton-tr', name: '第10章 牛顿法与信赖域', range: 'P53–P60' };
  if (page <= 66) return { id: 'quasi-newton', name: '第11章 拟牛顿法', range: 'P61–P66' };
  if (page <= 72) return { id: 'prox', name: '第12章 邻近算子与投影', range: 'P67–P72' };
  if (page <= 77) return { id: 'prox-grad', name: '第13章 近似点梯度法', range: 'P73–P77' };
  if (page <= 83) return { id: 'fista', name: '第14章 Nesterov与FISTA', range: 'P78–P83' };
  if (page <= 90) return { id: 'alm', name: '第15章 增广拉格朗日', range: 'P84–P90' };
  return { id: 'admm', name: '第16章 ADMM与DRS', range: 'P91–P101' };
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
tags: [最优化, 凸优化, 视频笔记, ${theme.id}, 北大, 文再文]
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
| 分集 | ${partLabel(p.part)} |
| 模块 | ${theme.name} |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 教材 | 文再文《最优化：建模、算法与理论》 |
| 讲师 | 文再文（北京大学） |

## 核心要点

1. **主题模块**：${theme.name}（${theme.range}）
2. **本 P 主题**：${st}
3. **课程定位**：北大 2023 秋最优化（B 站 Proof-Trivial 转载，华文慕课）
4. **学习建议**：先读总览学习路径，按 P01→P101 顺序；配合教材与习题

## 详细笔记

### 1. 模块定位（${theme.name}）

- 本 P 在 101 讲课程体系中的位置
- 与前后分 P 的逻辑衔接

### 2. 核心概念

- ⏳ 待 \`enhance-opt-notes.js\` 补充教程级内容

### 3. 定理与算法

- ⏳ 当前为元数据增强笔记

## 逐字转写

> ⏳ **待转写**（\`transcript_status: 待转写\`）
>
> B 站 API 无外挂字幕轨（\`need_login_subtitle: true\`）。可使用 \`Tools/transcribe/\` 下 Whisper/BiliNote 工作流后续补充。转写完成后在此节粘贴全文并更新 frontmatter \`transcript_status: 已完成\`。

## 关键术语

| 术语 | 说明 |
|------|------|
| 凸优化 | 凸目标+凸约束，全局最优可高效求解 |
| KKT | 约束最优性条件：梯度+互补松弛 |
| ADMM | 交替方向乘子法，适合大规模分裂结构 |
| 文再文 | 北京大学教授，本课主讲 |

## 与前后分 P 的衔接

${prev ? `- ← **${shortTitle(data.parts[idx - 1].part)}**（[[${prev}]]）` : `- ← 课程起点，见 [[${BV}-总览]]`}
${next ? `- → **${shortTitle(data.parts[idx + 1].part)}**（[[${next}]]）` : '- → 课程终点'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ⏳ 教程级增强（待 \`enhance-opt-notes.js\`）

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Mind map skeleton
const mindmapMd = `---
title: "最优化建模算法与理论 - 思维导图"
tags: [最优化, 思维导图, mermaid, 凸优化, 北大]
updated: ${DATE}
---

# 最优化建模算法与理论 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    第1章绪论 P01-P05
    第2章凸集 P06-P11
    第3章凸函数 P12-P16
    第4章凸优化 P17-P22
    第5章对偶 P23-P25
    第6章拉格朗日 P26-P32
    第7章最优性 P33-P39
    第8章梯度法 P40-P47
    第9章次梯度 P48-P52
    第10章牛顿信赖域 P53-P60
    第11章拟牛顿 P61-P66
    第12章邻近投影 P67-P72
    第13章近似点梯度 P73-P77
    第14章FISTA P78-P83
    第15章增广拉格朗日 P84-P90
    第16章ADMM P91-P101
\`\`\`

> 待 enhance-opt-notes.js 更新各 P 字数。封面见 \`06-资源附件/video-notes-images/\`。
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
tags: [最优化, 凸优化, 视频笔记, MOC, 北大, 文再文]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已生成
source_type: 元数据增强
---

# ${data.title}

> 北京大学 **2023 秋最优化**（讲师 **文再文**），B 站 **${data.up}** 转载（华文慕课），共 **${data.parts.length}** 个分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。
>
> 参考教材：文再文《最优化：建模、算法与理论》。当前笔记基于 **官方简介 + 分 P 结构** 整理，待 \`enhance-opt-notes.js\` 补充教程级内容。

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

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 笔记 |
|------|-------------|------|------|
${indexRows}

## 学习路径

1. **绪论（P01–P05）** — 最优化建模、基本概念、LLM 辅助工具
2. **凸集（P06–P11）** — 范数、凸集、保凸运算、对偶锥
3. **凸函数（P12–P16）** — 梯度/Hessian、凸性判定、推广
4. **凸优化问题（P17–P22）** — LP、SOCP、SDP、建模软件
5. **对偶理论（P23–P25）** — LP/SOCP/SDP 对偶
6. **拉格朗日（P26–P32）** — Lagrangian、Slater、KKT
7. **最优性（P33–P39）** — 存在性、Farkas、约束品性
8. **线搜索与梯度法（P40–P47）** — Armijo/Wolfe、GD、BB
9. **次梯度法（P48–P52）** — 次微分、非光滑优化
10. **牛顿与信赖域（P53–P60）** — Newton、Trust-Region、CG
11. **拟牛顿法（P61–P66）** — BFGS、L-BFGS、NLS
12. **邻近与投影（P67–P72）** — prox、投影算子
13. **近似点梯度（P73–P77）** — ISTA、镜像下降、Frank-Wolfe
14. **Nesterov/FISTA（P78–P83）** — 加速一阶法
15. **增广拉格朗日（P84–P90）** — 罚函数、ALM、基追踪
16. **ADMM/DRS（P91–P101）** — 分裂算法、分布式、应用

## 关联资源

- 原始 API 数据：\`Tools/${BV}-full.json\`
- 笔记生成：\`Tools/bili-fetch/generate-opt-notes.js\`
- 教程级增强：\`Tools/bili-fetch/enhance-opt-notes.js\`
- 封面目录：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

console.log(`Generated ${data.parts.length} part notes + 总览 + 思维导图 in ${OUT_DIR}`);
