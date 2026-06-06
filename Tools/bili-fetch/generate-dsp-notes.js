/**
 * Generate Obsidian notes for BV127411M7BU DSP course
 * Usage: node generate-dsp-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV127411M7BU';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', 'DSP数字信号处理');
const DATE = '2026-06-06';

const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function sanitizeFilename(part, page) {
  let name = part
    .replace(/（.*?）/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[\uFFFD]/g, '')
    .replace(/^2-5-2z.?反变换2留数法$/, 'z反变换2留数法')
    .replace(/^\d+-\d+-?\d*\s*/, '')
    .replace(/^\d+-\d+\s*/, '')
    .replace(/\s+/g, '')
    .trim();
  if (!name || name.length > 30) {
    name = part.replace(/[\\/:*?"<>|（）()【】\[\]]/g, '').slice(0, 30);
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

function getChapter(page) {
  if (page <= 9) return { num: 1, name: '离散时间信号与系统' };
  if (page <= 21) return { num: 2, name: 'z 变换与频域分析' };
  if (page <= 28) return { num: 3, name: '离散傅里叶变换（DFT）' };
  if (page <= 30) return { num: 4, name: '快速傅里叶变换（FFT）' };
  if (page <= 33) return { num: 5, name: '离散时间系统结构与实现' };
  if (page <= 40) return { num: 6, name: 'IIR 数字滤波器设计' };
  return { num: 7, name: 'FIR 数字滤波器设计' };
}

function getCorePoints(part, page) {
  const ch = getChapter(page);
  const base = [
    `**教材章节**：第 ${ch.num} 章「${ch.name}」`,
    `**教学定位**：西电出版社《数字信号处理》配套浓缩讲解，侧重必考知识点与应用`,
    `**学习建议**：先理解本 P 概念框架，再对照课本补全公式推导`,
  ];
  const titleHints = {
    绪论: ['了解 DSP 研究对象：离散时间信号与系统', '明确本课程与「信号与系统」的衔接关系', '掌握数字信号处理的基本问题框架'],
    序列: ['掌握离散序列的数学表示方法', '理解序列作为 DSP 基本研究对象'],
    典型序列: ['熟记单位脉冲、单位阶跃、指数、正弦等典型序列', '掌握序列的移位、翻转、尺度变换等基本运算'],
    卷积: ['掌握离散序列卷积和的定义与计算方法', '理解卷积与 LTI 系统响应的关系', '通过例题巩固卷积运算技巧'],
    分类: ['按记忆性、因果性、稳定性、线性、时不变等性质分类系统', '建立系统性质判断的基本思路'],
    线性时不变: ['掌握 LTI 系统的定义与判定', '理解冲激响应与卷积和描述系统输出的关系'],
    因果: ['掌握离散系统因果性、稳定性的充要条件', '重点：BIBO 稳定与冲激响应可和性'],
    差分方程: ['建立离散 LTI 系统的差分方程数学模型', '理解差分方程与系统函数的关系'],
    采样: ['掌握模拟信号数字化的采样过程', '理解奈奎斯特采样定理与混叠问题'],
    傅里叶变换: ['掌握序列傅里叶变换（DTFT）的定义与物理意义', '理解频域表示与时域序列的对应关系'],
    性质: ['掌握变换域基本性质（线性、移位、卷积等）', '利用性质简化计算是考试重点'],
    z变换: ['掌握 z 变换的定义与收敛域（ROC）', '理解 z 变换与 DTFT 的关系'],
    收敛域: ['根据极点分布确定 ROC', 'ROC 与系统因果性、稳定性密切相关'],
    反变换: ['掌握 z 反变换的观察法、留数法、部分分式展开法', '根据 ROC 选择正确的反变换结果'],
    差分方程: ['用 z 变换解线性差分方程', '结合初值条件求系统响应'],
    极点: ['由系统函数极点分布判断因果性与稳定性', '单位圆内极点 → 稳定因果系统'],
    频响: ['理解系统频率响应 H(e^jω) 的含义', '掌握 z 变换与频响的对应关系'],
    几何: ['用零极点矢量几何法确定频响特性', '直观理解幅频、相频变化'],
    DFT: ['掌握 DFT 定义与 IDFT', '理解 DFT 与 DTFT、DFS 的关系'],
    周期延拓: ['理解 DFT 的隐含周期延拓假设', '掌握频域混叠与截断效应'],
    旋转因子: ['掌握 DFT 旋转因子 W_N 的计算技巧', '周期序列 DFS 系数求解'],
    循环: ['掌握循环移位、循环卷积特性', '区分线性卷积与循环卷积'],
    共轭: ['DFT 的共轭对称性及其应用', '利用对称性减少计算量'],
    采样定理: ['频率域采样定理：DFT 点数与序列长度的关系'],
    FFT: ['理解基 2 FFT 的分治思想', '掌握时域/频域抽取法的蝶形运算流图'],
    模拟: ['离散系统与模拟系统的对应关系', '掌握模拟原型到数字系统的基本思路'],
    框图: ['掌握直接型、级联型、并联型等系统结构', '理解不同结构对数值精度的影响'],
    信号流图: ['用信号流图表示系统运算关系', '梅森公式求系统函数（若涉及）'],
    巴特沃斯: ['模拟巴特沃斯低通滤波器设计步骤', '掌握幅度平方函数与极点分布'],
    数字滤波器: ['数字滤波器基本概念与设计流程', 'IIR 与 FIR 的设计思路对比'],
    脉冲响应不变: ['脉冲响应不变法设计 IIR 滤波器', '理解 s 域到 z 域的映射与混叠'],
    双线性: ['双线性变换法设计 IIR 滤波器', '预畸变校正频率轴'],
    频率变换: ['用频率变换法设计高通、带通滤波器', '从低通原型出发'],
    网络结构: ['IIR 滤波器直接型、级联型、并联型结构', '量化误差与稳定性考虑'],
    FIR: ['FIR 滤波器基本原理与线性相位条件', 'FIR 系统函数特点：只有零点'],
    窗函数: ['窗函数法设计 FIR 滤波器', '理解主瓣宽度与阻带衰减的权衡'],
    频率采样: ['频率采样法设计 FIR 滤波器', '内插与过渡带优化'],
  };
  const extra = [];
  for (const [key, pts] of Object.entries(titleHints)) {
    if (part.includes(key)) {
      extra.push(...pts.slice(0, 3));
      break;
    }
  }
  if (extra.length === 0) {
    extra.push(`本 P 主题：${part}`, '结合教材对应章节学习', '待 Whisper 转写后补充详细推导与例题');
  }
  return [...base, ...extra.slice(0, 4)];
}

function getOutline(part, page) {
  const ch = getChapter(page);
  return [
    `### 1. 章节定位（第 ${ch.num} 章 · ${ch.name}）`,
    `- 本 P 在全书中的位置与前置知识`,
    `- 与前后分 P 的逻辑衔接`,
    '',
    `### 2. 核心概念（基于分 P 标题「${part}」）`,
    '- ⏳ 待 Whisper/BiliNote 转写后补充逐字讲解要点',
    '- 对照西电出版社《数字信号处理》教材相应节次',
    '- 关注 UP 精选例题的解题思路',
    '',
    '### 3. 公式与推导',
    '- ⏳ 当前为元数据增强笔记，公式细节需对照课本或转写补充',
    '- 本系列刻意精简推导，考试前务必回归教材完整推导',
    '',
    '### 4. 典型例题',
    '- ⏳ 待转写后摘录 UP 讲解的例题与解法',
    '- 建议暂停视频自行演算后再对照',
  ].join('\n');
}

function getTerms(part) {
  const common = [
    ['离散时间信号', '在离散时刻取值的序列 x(n)'],
    ['LTI 系统', '线性时不变系统，DSP 核心研究对象'],
  ];
  const map = {
    绪论: [['数字信号处理', '对离散时间信号进行分析和处理的理论与方法']],
    卷积: [['卷积和', 'y(n)=Σx(k)h(n-k)，LTI 系统输出']],
    z变换: [['z 变换', 'X(z)=Σx(n)z^{-n}，复频域工具'], ['收敛域 ROC', '使级数收敛的 z 值集合']],
    DFT: [['DFT', '离散傅里叶变换，有限长序列频域分析'], ['旋转因子', 'W_N=e^{-j2π/N}']],
    FFT: [['FFT', '快速傅里叶变换，DFT 的高效算法'], ['蝶形运算', 'FFT 基本计算单元']],
    滤波器: [['IIR', '无限冲激响应，含反馈'], ['FIR', '有限冲激响应，无反馈']],
    采样: [['采样定理', 'fs≥2fmax 可无失真恢复']],
    因果: [['因果性', '输出仅依赖当前及过去输入'], ['BIBO 稳定', '有界输入产生有界输出']],
  };
  for (const [key, terms] of Object.entries(map)) {
    if (part.includes(key)) return [...common, ...terms];
  }
  return [...common, ['待补充', 'Whisper 转写后完善']];
}

const fileNames = data.parts.map((p) => sanitizeFilename(p.part, p.page));

fs.mkdirSync(OUT_DIR, { recursive: true });

// --- Part notes ---
data.parts.forEach((p, idx) => {
  const fn = fileNames[idx];
  const prev = idx > 0 ? fileNames[idx - 1] : null;
  const next = idx < data.parts.length - 1 ? fileNames[idx + 1] : null;
  const nav = [
    `← [[${BV}-总览]]`,
    prev ? `← [[${prev}]]` : '',
    next ? `下一篇 → [[${next}]]` : '',
  ].filter(Boolean).join(' | ');

  const points = getCorePoints(p.part, p.page);
  const terms = getTerms(p.part);
  const ch = getChapter(p.page);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${p.part}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [dsp, 数字信号处理, 视频笔记, 西电, 第${ch.num}章]
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
| 章节 | 第 ${ch.num} 章 · ${ch.name} |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 教材 | 西安电子科技大学出版社《数字信号处理》 |

## 核心要点

${points.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

## 详细笔记

${getOutline(p.part, p.page)}

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${data.parts[idx - 1].part}**（[[${prev}]]）` : '- ← 课程起点，见 [[BV127411M7BU-总览]]'}
${next ? `- → **${data.parts[idx + 1].part}**（[[${next}]]）` : '- → 课程终点'}

## 来源说明

- ✅ B 站官方标题、简介、分 P 元数据（\`api.bilibili.com\`，见 \`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（Node 脚本 \`Tools/bili-fetch/fetch-bilibili.js\` 下载）
- ⏳ 屏幕录制逐字稿（${data.subtitle_status}；待 Whisper/BiliNote 转写）

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// --- Mind map ---
const mindmapNodes = data.parts.map((p, i) => {
  const fn = fileNames[i];
  const short = p.part.replace(/（.*?）/g, '').slice(0, 20);
  return `    P${String(p.page).padStart(2, '0')} ${short} ${p.duration_fmt.replace('分', 'm')}
      [[${fn}]]`;
}).join('\n');

const mindmapMd = `---
title: "DSP 数字信号处理 - 思维导图"
tags: [dsp, 思维导图, mermaid, 数字信号处理]
updated: ${DATE}
---

# DSP 数字信号处理 · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    第1章 离散信号与系统 P01-P09
      序列 卷积 LTI
    第2章 z变换 P10-P21
      DTFT z变换 频响
    第3章 DFT P22-P28
      循环卷积 对称性
    第4章 FFT P29-P30
      基2时域 基2频域
    第5章 系统结构 P31-P33
      框图 信号流图
    第6章 IIR P34-P40
      巴特沃斯 双线性
    第7章 FIR P41-P44
      窗函数 频率采样
\`\`\`

## 分 P 详图

\`\`\`mermaid
mindmap
  root((${data.title.replace(/[\[\]]/g, '')}))
${mindmapNodes}
\`\`\`

> 时长来自 B 站 API（${DATE} 抓取）。子节点基于官方简介 + 分 P 标题整理；首帧封面已下载至 \`06-资源附件/video-notes-images/\`。Whisper 转写后可继续扩展子节点。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

// --- Overview ---
const indexRows = data.parts.map((p, i) => {
  const fn = fileNames[i];
  return `| P${String(p.page).padStart(2, '0')} | ${p.part} | ${p.duration_fmt} | [[${fn}]] |`;
}).join('\n');

const chapterFlow = `flowchart TB
  C1[第1章 离散信号与系统 P01-P09] --> C2[第2章 z变换 P10-P21]
  C2 --> C3[第3章 DFT P22-P28]
  C3 --> C4[第4章 FFT P29-P30]
  C4 --> C5[第5章 系统结构 P31-P33]
  C5 --> C6[第6章 IIR P34-P40]
  C6 --> C7[第7章 FIR P41-P44]`;

const overviewMd = `---
title: "${data.title}"
source: "https://www.bilibili.com/video/${BV}"
up: "${data.up}"
tags: [dsp, 数字信号处理, 视频笔记, MOC, 西电, 教程]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已生成
source_type: 元数据增强
---

# ${data.title}

> 西安电子科技大学出版社《数字信号处理》教材配套浓缩教程，共 **${data.parts.length}** 个分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。UP **${data.up}** 从初学者角度编排，精炼必考知识点，侧重应用数学解决问题的能力。
>
> 当前笔记基于 **官方简介 + 分 P 结构 + 章节标题** 整理，待 Whisper/BiliNote 可继续补充逐字稿与公式推导。

## 视频简介（B 站原文）

${data.desc.split('\n').map((l) => (l.trim() ? l : '')).join('\n\n')}

## 视频数据

| 字段 | 内容 |
|------|------|
| BV 号 | ${BV} |
| UP 主 | ${data.up} |
| 总时长 | ${fmtDurationHms(data.total_duration_sec)}（${data.total_duration_sec} 秒） |
| 分 P 数 | ${data.parts.length} |
| 播放量 | ${data.stat.view.toLocaleString()}（抓取时） |
| 收藏 | ${data.stat.favorite.toLocaleString()} |
| 投币 | ${data.stat.coin.toLocaleString()} |
| 标签 | ${data.tags.join('、')} |
| 教材 | 西安电子科技大学出版社《数字信号处理》 |
| 字幕状态 | ${data.subtitle_status} |

## 思维导图

\`\`\`mermaid
mindmap
  root((DSP 数字信号处理))
    第1章 离散信号与系统
      序列表示与运算
      卷积与LTI系统
      差分方程与采样
    第2章 变换域分析
      DTFT与性质
      z变换与反变换
      系统函数与频响
    第3章 DFT
      定义与周期延拓
      循环卷积与对称性
      频率域采样
    第4章 FFT
      时域抽取基2
      频域抽取基2
    第5章 系统实现
      模拟与框图
      信号流图
    第6章 IIR设计
      巴特沃斯原型
      脉冲不变与双线性
      频率变换
    第7章 FIR设计
      线性相位原理
      窗函数法
      频率采样法
\`\`\`

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 笔记 |
|------|-------------|------|------|
${indexRows}

## 学习路径

\`\`\`mermaid
${chapterFlow}
\`\`\`

1. **第 1 章（P01–P09）** — 建立离散信号、卷积、LTI 系统与采样基础
2. **第 2 章（P10–P21）** — 掌握 DTFT、z 变换及系统频响分析
3. **第 3 章（P22–P28）** — 理解 DFT 及其循环性质
4. **第 4 章（P29–P30）** — 学习基 2 FFT 算法
5. **第 5 章（P31–P33）** — 系统结构与信号流图
6. **第 6 章（P34–P40）** — IIR 滤波器设计方法
7. **第 7 章（P41–P44）** — FIR 滤波器设计方法

> 建议按 P01→P44 顺序学习；每看完一 P，对照教材相应章节补全推导。

## 关联资源

- 原始 API 数据：\`Tools/${BV}-full.json\`
- 笔记生成脚本：\`Tools/bili-fetch/generate-dsp-notes.js\`
- 封面目录：[[../../06-资源附件/video-notes-images/]]
- 思维导图专页：[[思维导图]]

## 工具与数据文件

| 工具 | 路径 | 用途 |
|------|------|------|
| bilibili-obsidian-notes | \`D:\\\\solidworks\\\\Tools\\\\bilibili-obsidian-notes\\\\\` | 字幕/关键帧/笔记工作流 |
| Node 抓取脚本 | \`D:\\\\solidworks\\\\Tools\\\\bili-fetch\\\\fetch-bilibili.js\` | 无 Key 拉取元数据 + 首帧封面 |
| 结构化摘要 | \`D:\\\\solidworks\\\\Tools\\\\${BV}-full.json\` | 整理后的分 P 数据 |

## 待 Whisper 补充

- [ ] P01–P${String(data.parts.length).padStart(2, '0')} 逐字转写与时间戳
- [ ] 板书/公式关键帧截图（需 ffmpeg）
- [ ] 精选例题完整推导同步至笔记
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');

console.log(`Generated ${data.parts.length} part notes + 总览 + 思维导图 in ${OUT_DIR}`);
console.log('Files:', fileNames.map((f) => f + '.md').join(', '));
