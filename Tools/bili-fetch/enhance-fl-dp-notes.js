/**
 * Enhance FL/DP Obsidian notes to tutorial level (2500-3500 chars/page)
 * Usage: node enhance-fl-dp-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1q4421A72h';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', '联邦学习与差分隐私');
const DATE = '2026-06-06';

const { buildTutorialBody, countChars } = require('./lib/tutorial-framework');
const tutorialDetail = require('./content/fl-dp-tutorial-detail');
const knowledge = require('./content/fl-dp-knowledge');

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

function getModule(page) {
  if (page <= 3) return { id: 'fl-base', name: '联邦学习基础' };
  if (page <= 5) return { id: 'fl-opt', name: '通信与联邦降维' };
  if (page === 6) return { id: 'dp-fl', name: '差分隐私联邦' };
  if (page <= 12) return { id: 'simons', name: 'Simons Institute 工作坊' };
  if (page === 13) return { id: 'dp-theory', name: '在线学习与差分隐私' };
  return { id: 'papers', name: '前沿论文' };
}

function getExamTips(page) {
  const tips = {
    1: 'FedAvg 流程、Cross-device/silo、Non-IID 入门、威胁模型',
    2: '协作学习 vs 联邦学习、数据驻留直觉、通信内容对比',
    3: 'FedAvg 伪代码、系统组件、$E$/$C$ 采样、客户端漂移',
    4: '量化/稀疏/误差反馈、FedProx、通信量估算',
    5: '联邦幂迭代 PCA、SecAgg、降维预处理',
    6: '用户级 $(\\varepsilon,\\delta)$-DP、DP-SGD、隐私会计、子采样放大',
    7: 'Simons 问题版图、协作范式、开放问题',
    8: '鲁棒聚合 Krum、个性化 FedPer、公平性',
    9: '攻击分类、SecAgg+DP 组合、投毒与推断',
    10: '纵向联邦、异质目标函数、合规遗忘',
    11: 'FedProx/SCAFFOLD、收敛界、通信复杂度',
    12: '去中心化 FL、大模型联邦、benchmark',
    13: 'OCO 遗憾、联邦 DP 组合、RDP 会计',
    14: 'Local GD 通信加速、最优 $\\tau$、异质性 $\\zeta$',
    15: 'Stiefel 流形、黎曼 PCA、在线随机 CCA',
  };
  return tips[page] || '对照视频与论文';
}

function getTerms(part, page) {
  const common = [
    ['联邦学习 FL', '数据不出本地，协作训练全局模型'],
    ['差分隐私 DP', '单条记录变化对输出分布影响有界'],
  ];
  const map = {
    1: [['FedAvg', '本地训练+加权平均聚合'], ['Non-IID', '各方数据分布不一致']],
    2: [['协作学习', '多方协作改进模型的广义框架']],
    3: [['客户端采样', '每轮仅部分客户端参与'], ['本地步 E', '通信间本地 SGD 步数']],
    4: [['Top-k 稀疏', '只传最大 k 个梯度坐标'], ['误差反馈', '补偿量化偏差']],
    5: [['幂迭代', '求主特征向量的迭代法'], ['SecAgg', '安全聚合只见总和']],
    6: [['用户级 DP', '增删一用户全部数据相邻'], ['梯度裁剪', '限制敏感度']],
    9: [['梯度反演', '从更新恢复样本'], ['成员推断', '判断是否参与训练']],
    11: [['FedProx', '近端项抑制漂移'], ['SCAFFOLD', '控制变量校正']],
    13: [['Regret', '在线损失相对最优静态决策'], ['RDP', 'Rényi 差分隐私']],
    14: [['Local GD', '每轮多步本地梯度下降'], ['通信加速', '同精度更少轮次']],
    15: [['Stiefel 流形', '正交矩阵约束的流形'], ['CCA', '典型相关分析']],
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
  const shortTitle = p.part.replace(/（.*?）/g, '').trim();
  const prevTitle = idx > 0 ? data.parts[idx - 1].part : null;
  const nextTitle = idx < data.parts.length - 1 ? data.parts[idx + 1].part : null;
  const examTip = getExamTips(p.page);

  const content = buildTutorialBody({
    seriesName: '联邦学习与差分隐私',
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
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [联邦学习, 差分隐私, 隐私计算, 视频笔记, ${mod.id}, 教程级]
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
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 内容来源 | 教程级知识点增强（非 UP 逐字转写） |

## 核心要点

1. **本 P 主题**：${shortTitle}
2. **模块定位**：${mod.name}
3. **研读侧重**：${examTip}
4. **笔记层级**：教程级（约 ${wc} 字），含速览、Mermaid、Walkthrough、自测题
5. **学习建议**：先读「3 分钟速览」与「图解」，再深入「详细讲解」

> 以下内容基于联邦学习、差分隐私与协作学习理论体系撰写，对应 B 站分 P「${p.part}」。**非 UP 逐字转写**；不看视频可建立框架，看视频对照「与视频对照表」。

${content}

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${data.parts[idx - 1].part}**（[[${prev}]]）` : `- ← 系列起点，见 [[${BV}-总览]]`}
${next ? `- → **${data.parts[idx + 1].part}**（[[${next}]]）` : '- → 系列终点，建议回到总览复盘'}

## 逐字转写

> 状态：待转写。运行 \`Tools/transcribe/transcribe.ps1 -Bvid ${BV} -Part ${p.page}\` 补充。

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

// Update overview
const overviewPath = path.join(OUT_DIR, `${BV}-总览.md`);
if (fs.existsSync(overviewPath)) {
  let overview = fs.readFileSync(overviewPath, 'utf8');
  overview = overview.replace(/source_type: 元数据增强/, 'source_type: 知识点增强');
  overview = overview.replace(/status: 已生成/, 'status: 已增强');
  overview = overview.replace(
    /> 当前笔记基于 \*\*官方简介 \+ 分 P 结构\*\* 整理，待 `enhance-fl-dp-notes\.js` 补充教程级 2500–3500 字\/篇。/,
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
    /- \[ \] 教程级知识点增强（15 篇\)/,
    '- [x] 教程级知识点增强（15 篇，均篇 ~' + Math.round(totalChars / wordCounts.length) + ' 字）'
  );
  fs.writeFileSync(overviewPath, overview, 'utf8');
}

// Update mindmap
const mindmapPath = path.join(OUT_DIR, '思维导图.md');
const mindmapContent = `---
title: "联邦学习与差分隐私 - 思维导图"
tags: [联邦学习, 差分隐私, 思维导图, mermaid]
updated: ${DATE}
status: 已增强
---

# 联邦学习与差分隐私 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    基础 P01-P03 ~${wordCounts.slice(0, 3).reduce((a, b) => a + b, 0)}字
      [[${fileNames[0]}]]
    专题 P04-P06 ~${wordCounts.slice(3, 6).reduce((a, b) => a + b, 0)}字
      [[${fileNames[3]}]]
    Simons P07-P12 ~${wordCounts.slice(6, 12).reduce((a, b) => a + b, 0)}字
      [[${fileNames[6]}]]
    论文 P13-P15 ~${wordCounts.slice(12, 15).reduce((a, b) => a + b, 0)}字
      [[${fileNames[12]}]]
\`\`\`

> 教程级增强完成（${DATE}），合计约 ${totalChars} 字，均篇 ${Math.round(totalChars / wordCounts.length)} 字。封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(mindmapPath, mindmapContent, 'utf8');

console.log(`Enhanced ${wordCounts.length} FL/DP notes in ${OUT_DIR}`);
console.log(`Word counts min=${Math.min(...wordCounts)} max=${Math.max(...wordCounts)} avg=${Math.round(totalChars / wordCounts.length)}`);
console.log(`Total: ~${totalChars} chars`);
