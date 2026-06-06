/**
 * Enhance 北大文再文最优化 Obsidian notes to tutorial level (2500-3500 chars)
 * Usage: node enhance-opt-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1Kc411i7kJ';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '最优化建模算法与理论');
const DATE = '2026-06-06';

const { buildTutorialBody, countChars } = require('./lib/tutorial-framework');
const tutorialDetail = require('./content/opt-tutorial-detail');
const knowledge = require('./content/opt-knowledge');
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

function shortTitle(part) {
  return part.replace(/^\d+\.\d+\s*/, '').trim();
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

const examTips = {
  1: '最优化定义、建模三要素、与机器学习关系、课程路线图',
  44: 'GD x_{k+1}=x_k-α∇f、L-光滑收敛 O(1/k)',
  32: '凸问题 KKT、互补松弛',
  79: 'FISTA 算法、O(1/k²) 收敛',
  91: 'ADMM 三步分裂、x/z/u 更新',
  101: 'DRS 分裂、全课总结',
};

function getExamTips(page) {
  try {
    const tips = require('./content/opt-tutorial-detail')[page];
    if (tips && tips.quickSummary) {
      const m = tips.quickSummary.match(/考试\/面试侧重：\*\*([^*]+)\*\*/);
      if (m) return m[1];
    }
  } catch (_) { /* ignore */ }
  return examTips[page] || '对照教材与课程习题';
}

function getTerms(page, part) {
  const common = [
    ['凸优化', '凸目标+凸可行域，局部最优即全局最优'],
    ['KKT', 'Karush-Kuhn-Tucker 最优性条件'],
    ['文再文', '北京大学教授，教材作者'],
  ];
  const st = shortTitle(part).slice(0, 20);
  const map = {
    6: [['ℓ_p 范数', '向量长度度量'], ['对偶范数', 'Hölder 配对']],
    18: [['单纯形法', 'LP 经典算法'], ['基本可行解', '顶点解']],
    20: [['SDP', '半定规划 X⪰0'], ['Schur 补', 'LMI 构造工具']],
    44: [['梯度下降', 'x_{k+1}=x_k-α∇f'], ['L-光滑', '‖∇f(x)-∇f(y)‖≤L‖x-y‖']],
    62: [['BFGS', '拟牛顿秩二更新'], ['割线方程', 'B_{k+1}s_k=y_k']],
    79: [['FISTA', '快速 ISTA'], ['Nesterov 动量', 'O(1/k²) 收敛']],
    91: [['ADMM', '交替方向乘子法'], ['分裂', 'x=z 一致性约束']],
  };
  return [...common, ...(map[page] || [['本讲关键词', st]])];
}

function fmtDurationCn(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h} 小时 ${m} 分 ${String(s).padStart(2, '0')} 秒`;
  return `${m} 分 ${String(s).padStart(2, '0')} 秒`;
}

function fmtDurationHms(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

const fileNames = data.parts.map((p) => sanitizeFilename(p.part, p.page));
const titles = data.parts.map((p) => shortTitle(p.part));
fs.mkdirSync(OUT_DIR, { recursive: true });

let totalChars = 0;
const wordCounts = [];

data.parts.forEach((p, idx) => {
  const fn = fileNames[idx];
  const st = titles[idx];
  const theme = getThemeGroup(p.page);
  const baseContent = knowledge[p.page];
  if (!baseContent) {
    console.warn(`Missing knowledge for P${p.page}`);
    return;
  }

  const detail = tutorialDetail[p.page] || {};
  const examTip = detail.quickSummary
    ? (detail.quickSummary.match(/\*\*([^*]+)\*\*\s*。$/) || [])[1] || getExamTips(p.page)
    : getExamTips(p.page);

  const content = buildTutorialBody({
    seriesName: '北大文再文《最优化：建模、算法与理论》',
    page: p.page,
    shortTitle: st,
    themeName: theme.name,
    prevTitle: idx > 0 ? titles[idx - 1] : null,
    nextTitle: idx < data.parts.length - 1 ? titles[idx + 1] : null,
    examTip,
    baseContent,
    detail,
    durationFmt: p.duration_fmt,
  });

  const wc = countChars(content);
  totalChars += wc;
  wordCounts.push(wc);

  const prev = idx > 0 ? fileNames[idx - 1] : null;
  const next = idx < data.parts.length - 1 ? fileNames[idx + 1] : null;
  const nav = [
    `← [[${BV}-总览]]`,
    prev ? `← [[${prev}]]` : '',
    next ? `下一篇 → [[${next}]]` : '',
  ].filter(Boolean).join(' | ');

  const terms = getTerms(p.page, p.part);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${st}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [最优化, 凸优化, 视频笔记, ${theme.id}, 北大, 文再文, 教程级]
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

# P${String(p.page).padStart(2, '0')} ${st}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${p.part} |
| 模块 | ${theme.name} |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 教材 | 文再文《最优化：建模、算法与理论》 |
| 内容来源 | 知识点增强（教材体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：${st}
2. **模块定位**：${theme.name}（${theme.range}）
3. **考试/实践侧重**：${examTip}
4. **笔记层级**：教程级（约 ${wc} 字），含速览、图解、Walkthrough、自测题
5. **学习建议**：先通读「3 分钟速览」与「图解」，再读「详细讲解」

> 以下内容基于北大文再文最优化课程体系撰写，对应 B 站分 P「${p.part}」。**非 UP 逐字转写**；不看视频也可建立框架，看视频可对照「与视频对照表」深化。

${content}

## 逐字转写

> ⏳ **待转写**（\`transcript_status: 待转写\`）
>
> B 站 API 无外挂字幕轨（\`need_login_subtitle: true\`）。可使用 \`Tools/transcribe/\` 下 Whisper/BiliNote 工作流后续补充。转写完成后在此节粘贴全文并更新 frontmatter \`transcript_status: 已完成\`。

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${titles[idx - 1]}**（[[${prev}]]）` : `- ← 课程起点，见 [[${BV}-总览]]`}
${next ? `- → **${titles[idx + 1]}**（[[${next}]]）` : '- → 课程终点'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ✅ **教程级增强**：含 Mermaid、Walkthrough、自测题（约 ${wc} 字，${DATE}）
- ⏳ 逐字转写：API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Update overview
const indexRows = data.parts.map((p, idx) => {
  const wc = wordCounts[idx] || 0;
  const fn = fileNames[idx];
  const st = titles[idx];
  return `| P${String(p.page).padStart(2, '0')} | ${st} | ${p.duration_fmt.replace('分', 'm').replace('秒', 's')} | ~${wc} | [[${fn}]] |`;
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
status: 已增强
source_type: 教程级知识点增强
---

# ${data.title}

> 北京大学 **2023 秋最优化**（讲师 **文再文**），B 站 **${data.up}** 转载，共 **${data.parts.length}** 个分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。
>
> 各分 P 笔记已升级为 **教程级**（约 2500–3500 字/篇，含 Mermaid、Walkthrough、自测题，${DATE}）。参考教材：文再文《最优化：建模、算法与理论》。

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
| 合计字数 | ~${totalChars}（均篇 ~${Math.round(totalChars / wordCounts.length)}） |

## 思维导图

\`\`\`mermaid
mindmap
  root(最优化)
    绪论 P01-P05
    凸集 P06-P11
    凸函数 P12-P16
    凸优化 P17-P22
    对偶 P23-P32
    最优性 P33-P39
    梯度法 P40-P47
    次梯度 P48-P52
    Newton TR P53-P60
    拟牛顿 P61-P66
    prox P67-P72
    prox-grad P73-P77
    FISTA P78-P83
    ALM P84-P90
    ADMM P91-P101
\`\`\`

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 字数 | 笔记 |
|------|-------------|------|------|------|
${indexRows}

## 学习路径

\`\`\`mermaid
flowchart TB
  T1[绪论 P01-P05] --> T2[凸集/函数 P06-P16]
  T2 --> T3[凸优化/对偶 P17-P32]
  T3 --> T4[最优性 P33-P39]
  T4 --> T5[一阶/二阶 P40-P66]
  T5 --> T6[prox/FISTA P67-P83]
  T6 --> T7[ALM/ADMM P84-P101]
\`\`\`

### 按章节分组

1. **绪论（P01–P05）** — 建模、基本概念、LLM 辅助
2. **凸集（P06–P11）** — 范数、凸集、对偶锥
3. **凸函数（P12–P16）** — 梯度/Hessian、凸性判定
4. **凸优化问题（P17–P22）** — LP、SOCP、SDP
5. **对偶理论（P23–P25）** — 弱/强对偶
6. **拉格朗日（P26–P32）** — KKT、Slater
7. **最优性（P33–P39）** — Farkas、约束品性
8. **线搜索与梯度法（P40–P47）** — GD、BB
9. **次梯度法（P48–P52）** — 非光滑优化
10. **牛顿与信赖域（P53–P60）** — 二阶方法
11. **拟牛顿法（P61–P66）** — BFGS、L-BFGS
12. **邻近与投影（P67–P72）** — prox 算子
13. **近似点梯度（P73–P77）** — ISTA、Frank-Wolfe
14. **Nesterov/FISTA（P78–P83）** — 加速方法
15. **增广拉格朗日（P84–P90）** — ALM、基追踪
16. **ADMM/DRS（P91–P101）** — 分裂算法与应用

> 建议：有线性代数与多元微积分基础从 P01 顺序学习；已熟悉 Boyd 凸优化可从 P26 KKT 切入；配合教材习题与 CVXPY 实践。

## 关联资源

- 原始 API 数据：\`Tools/${BV}-full.json\`
- 笔记生成：\`Tools/bili-fetch/generate-opt-notes.js\`
- 教程级增强：\`Tools/bili-fetch/enhance-opt-notes.js\`
- 知识点库：\`Tools/bili-fetch/content/opt-knowledge.js\`（分章 opt-ch*.js）
- 封面目录：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]

## 工具与数据文件

| 工具 | 路径 | 用途 |
|------|------|------|
| Node 抓取脚本 | \`Tools/bili-fetch/fetch-bilibili.js\` | 元数据 + 首帧封面 |
| 结构化摘要 | \`Tools/${BV}-full.json\` | 分 P 数据 |
| 内容生成 | \`Tools/bili-fetch/build-opt-content.js\` | 知识点 + tutorial-detail |
| 教程深化 | \`Tools/bili-fetch/content/opt-tutorial-detail.js\` | 分页 Walkthrough/自测 |
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

// Mindmap
const mindmapNodes = data.parts.map((p, i) => {
  const fn = fileNames[i];
  const short = titles[i].slice(0, 14);
  const wc = wordCounts[i] || 0;
  return `    P${String(p.page).padStart(2, '0')} ${short} ~${wc}字
      [[${fn}]]`;
}).join('\n');

const mindmapMd = `---
title: "最优化建模算法与理论 - 思维导图"
tags: [最优化, 思维导图, mermaid, 凸优化, 北大]
updated: ${DATE}
status: 已增强
---

# 最优化建模算法与理论 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    第1章绪论 P01-P05
      建模 基本概念
    第2章凸集 P06-P11
      范数 对偶锥
    第3章凸函数 P12-P16
      梯度 Hessian
    第4章凸优化 P17-P22
      LP SOCP SDP
    第5-6章对偶 P23-P32
      KKT Slater
    第7章最优性 P33-P39
      Farkas CQ
    第8-9章一阶 P40-P52
      GD 次梯度
    第10-11章二阶 P53-P66
      Newton BFGS
    第12-14章近端 P67-P83
      prox FISTA
    第15-16章分裂 P84-P101
      ALM ADMM DRS
\`\`\`

## 分 P 详图

\`\`\`mermaid
mindmap
  root((${data.title.slice(0, 18)}))
${mindmapNodes}
\`\`\`

> 各 P 已按**教程级**增强（${DATE}，合计约 ${totalChars} 字，均篇 ${Math.round(totalChars / wordCounts.length)} 字）。封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

console.log(`Enhanced ${data.parts.length} OPT notes in ${OUT_DIR}`);
console.log(`Word counts min/max/avg: ${Math.min(...wordCounts)}/${Math.max(...wordCounts)}/${Math.round(totalChars / wordCounts.length)}`);
console.log(`Total: ~${totalChars}`);
