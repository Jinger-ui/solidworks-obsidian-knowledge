/**
 * Enhance Princeton ECE524 RL Obsidian notes to tutorial level (2500-3500 chars)
 * Usage: node enhance-rl-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1r6cjeCEkW';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '强化学习理论基础');
const DATE = '2026-06-06';

const { buildTutorialBody, countChars } = require('./lib/tutorial-framework');
const tutorialDetail = require('./content/rl-tutorial-detail');
const knowledge = require('./content/rl-knowledge');
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

function shortTitle(part) {
  return part.replace(/^【\d+】\s*/, '').trim();
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

function getExamTips(page) {
  const tips = {
    1: 'MDP 五元组、马尔可夫性、V^π/Q^π 定义、最优策略存在性',
    2: 'Bellman 期望/最优方程、压缩映射、贪婪最优策略构造',
    3: '值迭代与策略迭代、策略改进定理、VI/PI 复杂度',
    4: 'Hoeffding/Chernoff/Bernstein、Union bound、置信区间构造',
    5: '鞅定义、Azuma-Hoeffding、RL regret 分解中的鞅',
    6: 'MLE/EM/VAE、生成模型与 model-based RL/RLHF 联系',
    7: '探索-利用、regret 定义、R-Max/乐观主义、PAC 框架',
    8: 'MAB 形式化、UCB1 算法与 O(√KT log T) regret 证明思路',
    9: 'MDP 探索、UCBVI/R-Max、episodic regret 定义',
    10: 'MAB 问题依赖/minimax 下界、Fano/Le Cam 证明框架',
    11: 'MDP regret 下界、change-of-measure、与 UCBVI 上界对照',
    12: 'Offline RL、分布偏移、CQL/IQL/BCQ、coverage 条件',
    13: '维度灾难、线性 MDP、函数逼近、eluder dimension 预告',
    14: 'LSVI-UCB 算法、岭回归置信界、O(√d³H³K) regret',
    15: '大状态探索、eluder dim、PSRL、深度 vs 浅层探索',
    16: 'Bellman 误差、FQI、Deadly Triad、Bellman rank',
    17: '一般 F 上 UCB/Thompson、GOLF、reward-free exploration',
    18: 'MARL 设定、非平稳性、NE/CTDE、IQL 局限',
    19: '零和矩阵博弈、minimax 定理、no-regret→NE、CFR',
    20: '一般和 NE 多解、PoA、MADDPG、均衡计算复杂度',
    21: 'POMDP 七元组、belief 更新、belief MDP、POMCP',
    22: 'POMDP PSPACE 复杂度、PBVI/POMCP、Dec-POMDP、课程总结',
  };
  return tips[page] || '对照课程讲义与 Agarwal 教材';
}

function getTerms(page, part) {
  const common = [
    ['MDP', '马尔可夫决策过程 (S,A,P,r,γ)'],
    ['Regret', '累积遗憾，衡量探索算法样本效率'],
    ['Chi Jin', 'Princeton ECE 教授，RL 理论专家'],
  ];
  const map = {
    1: [['策略 π', '状态到动作分布'], ['价值函数 V^π', '策略期望回报']],
    2: [['Bellman 方程', '价值递归关系'], ['压缩映射', 'γ-收缩保证收敛']],
    3: [['值迭代 VI', '反复 Bellman 最优备份'], ['策略迭代 PI', '评估+改进交替']],
    4: [['Hoeffding', '有界独立和集中界'], ['Chernoff', '指数尾概率衰减']],
    5: [['鞅', '条件期望不变随机过程'], ['Azuma', '有界鞅差分集中界']],
    6: [['VAE', '变分自编码器'], ['RLHF', '人类反馈强化学习微调 LLM']],
    7: [['探索-利用', '试错与最优权衡'], ['PAC', 'Probably Approximately Correct']],
    8: [['MAB', '多臂老虎机'], ['UCB', '置信上界算法']],
    9: [['UCBVI', '乐观值迭代'], ['R-Max', '乐观模型探索']],
    10: [['Minimax 下界', '最坏情况 regret Ω(√KT)'], ['Fano', '假设检验下界']],
    11: [['Change-of-measure', '构造难实例证明下界'], ['Diameter D', 'MDP 直径参数']],
    12: [['Offline RL', '固定 batch 学习'], ['CQL', '保守 Q 学习']],
    13: [['线性 MDP', '转移/奖励对特征线性'], ['Eluder dim', '函数类探索复杂度']],
    14: [['LSVI-UCB', '岭回归+UCB 探索'], ['Episodic H', '有限步回合长度']],
    15: [['PSRL', '后验采样 RL'], ['深度探索', '多步 informative 访问']],
    16: [['FQI', '拟合 Q 迭代'], ['Deadly Triad', 'FA+自举+离策略发散']],
    17: [['GOLF', '全局乐观局部回归'], ['Reward-free', '先探索后任意 reward']],
    18: [['MARL', '多智能体 RL'], ['CTDE', '集中训练分散执行']],
    19: [['Minimax', '零和博弈值'], ['NE', '纳什均衡']],
    20: [['PoA', '无效率价格'], ['MADDPG', '多 agent DDPG']],
    21: [['POMDP', '部分可观测 MDP'], ['Belief', '状态后验分布']],
    22: [['POMCP', '蒙特卡洛 belief 规划'], ['Dec-POMDP', '分布式 POMDP']],
  };
  return [...common, ...(map[page] || [['本讲关键词', shortTitle(part).slice(0, 40)]])];
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

  const content = buildTutorialBody({
    seriesName: 'Princeton ECE524 强化学习理论基础',
    page: p.page,
    shortTitle: st.replace(/^【\d+】\s*/, ''),
    themeName: theme.name,
    prevTitle: idx > 0 ? titles[idx - 1] : null,
    nextTitle: idx < data.parts.length - 1 ? titles[idx + 1] : null,
    examTip: getExamTips(p.page),
    baseContent,
    detail: tutorialDetail[p.page] || {},
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
  const examTip = getExamTips(p.page);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${st}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [强化学习, RL理论, 视频笔记, ${theme.id}, Princeton, ECE524, 教程级]
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
| 分集 | ${st} |
| 模块 | ${theme.name} |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 课程主页 | [Chi Jin ECE524](https://sites.google.com/view/cjin/teaching/ece524) |
| 内容来源 | 知识点增强（RL 理论体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：${st}
2. **模块定位**：${theme.name}（${theme.range}）
3. **考试/实践侧重**：${examTip}
4. **笔记层级**：教程级（约 ${wc} 字），含速览、图解、Walkthrough、自测题
5. **学习建议**：先通读「3 分钟速览」与「图解」，再读「详细讲解」

> 以下内容基于 Princeton ECE524 强化学习理论课程体系撰写，对应 B 站分 P「${p.part}」。**非 UP 逐字转写**；不看视频也可建立框架，看视频可对照「与视频对照表」深化。

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
tags: [强化学习, RL理论, 视频笔记, MOC, Princeton, ECE524, ChiJin]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已增强
source_type: 教程级知识点增强
---

# ${data.title}

> Princeton **ECE524** 强化学习理论基础（讲师 **Chi Jin**），B 站 **${data.up}** 转载，共 **${data.parts.length}** 个分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。
>
> 各分 P 笔记已升级为 **教程级**（约 2500–3500 字/篇，含 Mermaid、Walkthrough、自测题，${DATE}）。B 站 API 无外挂字幕，逐字稿可后续用 Whisper/BiliNote 补充。

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

## 思维导图

\`\`\`mermaid
mindmap
  root((ECE524 RL))
    MDP规划 P01-P03
      Bellman VI PI
    概率 P04-P05
      Hoeffding 鞅
    生成模型 P06
    探索 P07-P11
      UCB regret界
    离线 P12
    函数逼近 P13-P17
      LSVI-UCB
    博弈 P18-P20
      NE minimax
    POMDP P21-P22
\`\`\`

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 字数 | 笔记 |
|------|-------------|------|------|------|
${indexRows}

## 学习路径

\`\`\`mermaid
flowchart TB
  T1[MDP/Bellman P01-P03] --> T2[概率工具 P04-P05]
  T2 --> T3[探索 Regret P07-P11]
  T6[生成模型 P06] --> T3
  T3 --> T4[离线 RL P12]
  T4 --> T5[函数逼近 P13-P17]
  T5 --> T7[博弈 MARL P18-P20]
  T7 --> T8[POMDP P21-P22]
\`\`\`

### 按主题分组

1. **MDP 与动态规划（P01–P03）** — MDP 形式化、Bellman 方程、值迭代与策略迭代
2. **概率工具（P04–P05）** — 集中不等式、鞅、为 regret 证明奠基
3. **生成模型（P06）** — MLE/VAE、与 model-based RL 及 RLHF 的桥梁
4. **探索与 Regret（P07–P11）** — MAB、UCB、MDP 探索、上下界
5. **离线 RL（P12）** — 分布偏移、CQL/IQL、coverage
6. **函数逼近（P13–P17）** — 线性 MDP、LSVI-UCB、eluder dimension
7. **博弈与 MARL（P18–P20）** — 零和/一般和、纳什均衡
8. **POMDP（P21–P22）** — 信念规划、POMCP、课程总结

> 建议：有概率论基础从 P01 顺序学习；已熟悉 Sutton & Barto 可从 P07 探索理论切入；配合 Agarwal *RL: Theory and Algorithms* 与课程讲义 PDF。

## 关联资源

- 原始 API 数据：\`Tools/${BV}-full.json\`
- 笔记生成：\`Tools/bili-fetch/generate-rl-notes.js\`
- 教程级增强：\`Tools/bili-fetch/enhance-rl-notes.js\`
- 知识点库：\`Tools/bili-fetch/content/rl-knowledge.js\`
- 封面目录：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]

## 工具与数据文件

| 工具 | 路径 | 用途 |
|------|------|------|
| Node 抓取脚本 | \`Tools/bili-fetch/fetch-bilibili.js\` | 元数据 + 首帧封面 |
| 结构化摘要 | \`Tools/${BV}-full.json\` | 分 P 数据 |
| 教程深化 | \`Tools/bili-fetch/content/rl-tutorial-detail.js\` | 分页 Walkthrough/自测 |
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

// Mindmap
const mindmapNodes = data.parts.map((p, i) => {
  const fn = fileNames[i];
  const short = titles[i].slice(0, 16);
  const wc = wordCounts[i] || 0;
  return `    P${String(p.page).padStart(2, '0')} ${short} ~${wc}字
      [[${fn}]]`;
}).join('\n');

const mindmapMd = `---
title: "强化学习理论基础 - 思维导图"
tags: [强化学习, 思维导图, mermaid, RL理论, Princeton]
updated: ${DATE}
status: 已增强
---

# 强化学习理论基础 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    MDP与规划 P01-P03
      马尔可夫决策
      Bellman方程
      值策略迭代
    概率工具 P04-P05
      集中不等式
      鞅
    生成模型 P06
    探索Regret P07-P11
      MAB UCB
      上下界
    离线RL P12
    函数逼近 P13-P17
      LSVI-UCB
      Eluder
    博弈MARL P18-P20
      零和 纳什
    POMDP P21-P22
\`\`\`

## 分 P 详图

\`\`\`mermaid
mindmap
  root((${data.title.slice(0, 20)}))
${mindmapNodes}
\`\`\`

> 各 P 已按**教程级**增强（${DATE}，合计约 ${totalChars} 字，均篇 ${Math.round(totalChars / wordCounts.length)} 字）。封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

console.log(`Enhanced ${data.parts.length} RL notes in ${OUT_DIR}`);
console.log(`Word counts: ${wordCounts.join(', ')}`);
console.log(`Avg: ${Math.round(totalChars / wordCounts.length)}, Total: ~${totalChars}`);
