/**
 * Enhance DSP Obsidian notes with substantive textbook knowledge content.
 * Usage: node enhance-dsp-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV127411M7BU';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', 'DSP数字信号处理');
const DATE = '2026-06-06';

const supplement = require('./content/dsp-supplement');
const knowledge = Object.assign(
  {},
  require('./content/dsp-ch1'),
  require('./content/dsp-ch2'),
  require('./content/dsp-ch3'),
  require('./content/dsp-ch4'),
  require('./content/dsp-ch5'),
  require('./content/dsp-ch6'),
  require('./content/dsp-ch7')
);
for (const [page, extra] of Object.entries(supplement)) {
  const p = Number(page);
  if (knowledge[p]) knowledge[p] = knowledge[p] + '\n\n' + extra;
}

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

function getChapter(page) {
  if (page <= 9) return { num: 1, name: '离散时间信号与系统' };
  if (page <= 21) return { num: 2, name: 'z 变换与频域分析' };
  if (page <= 28) return { num: 3, name: '离散傅里叶变换（DFT）' };
  if (page <= 30) return { num: 4, name: '快速傅里叶变换（FFT）' };
  if (page <= 33) return { num: 5, name: '离散时间系统结构与实现' };
  if (page <= 40) return { num: 6, name: 'IIR 数字滤波器设计' };
  return { num: 7, name: 'FIR 数字滤波器设计' };
}

function getExamTips(page) {
  const tips = {
    1: '信号分类、LTI 框架、与信号与系统衔接',
    2: '序列三种表示、因果性、箭头标注',
    3: '典型序列定义、移位翻转运算',
    4: '有限长卷积计算（竖线法）',
    5: '系统五性质判定',
    6: 'LTI 定义、卷积求输出',
    7: '因果性与 BIBO 稳定性（必考）',
    8: '差分方程与 H(z)、求 h(n)',
    9: '奈奎斯特定理、混叠',
    10: 'DTFT 定义与典型对',
    11: 'DTFT 性质（时移、卷积）',
    12: 'Z 变换定义、ROC',
    13: 'ROC 性质、极点与稳定',
    14: 'Z 变换解差分方程',
    15: 'Z 变换性质、初值终值定理',
    16: '观察法 Z 反变换',
    17: '留数法',
    18: '部分分式展开',
    19: '零极点与因果稳定',
    20: 'H(e^jω) 与滤波类型',
    21: '零极点矢量几何法',
    22: 'DFT/IDFT 定义',
    23: '周期延拓、循环移位',
    24: '旋转因子 W_N',
    25: '循环移位性质',
    26: '循环卷积 vs 线性卷积',
    27: 'DFT 共轭对称性',
    28: '频率域采样定理',
    29: 'DIT 基 2 FFT 流图',
    30: 'DIF 基 2 FFT',
    31: '模拟-离散对应',
    32: '直接/级联/并联结构',
    33: '信号流图',
    34: '巴特沃斯设计',
    35: 'IIR/FIR 对比',
    36: '脉冲响应不变法',
    37: '双线性变换与预畸变',
    38: '高通频率变换',
    39: '带通频率变换',
    40: 'IIR 网络结构',
    41: 'FIR 线性相位',
    42: '四类线性相位 FIR',
    43: '窗函数法',
    44: '频率采样法',
  };
  return tips[page] || '对照教材补全推导';
}

function getTerms(part, page) {
  const ch = getChapter(page);
  const common = [
    ['离散时间信号', '在离散时刻取值的序列 x(n)'],
    ['LTI 系统', '线性时不变系统，DSP 核心研究对象'],
  ];
  const map = {
    绪论: [['数字信号处理', '对离散时间信号进行分析和处理的理论与方法']],
    序列: [['序列表示', '解析式、图形、数据列表三种等价形式']],
    典型序列: [['单位脉冲 δ(n)', '序列分解的基本单元'], ['单位阶跃 u(n)', '与 δ(n) 可相互表示']],
    卷积: [['卷积和', 'y(n)=Σx(k)h(n-k)，LTI 系统输出']],
    分类: [['记忆性', '输出是否只依赖当前输入'], ['BIBO 稳定', '有界输入产生有界输出']],
    线性时不变: [['冲激响应 h(n)', '系统对 δ(n) 的响应，完全表征 LTI 系统']],
    因果: [['因果性', 'h(n)=0, n<0'], ['绝对可和', 'Σ|h(n)|<∞ 为 BIBO 稳定充要条件']],
    差分方程: [['系统函数 H(z)', 'Y(z)/X(z)，零极点决定系统特性']],
    采样: [['奈奎斯特采样定理', 'fs>2fmax 可无混叠恢复'], ['混叠', 'fs 不足时高频折叠到低频']],
    傅里叶变换: [['DTFT', 'X(e^jω)=Σx(n)e^{-jωn}'], ['数字频率 ω', 'rad/样本，周期 2π']],
    性质: [['时移性质', 'x(n-k) ↔ z^{-k}X(z) 或 e^{-jωk}X(e^jω)']],
    z变换: [['Z 变换', 'X(z)=Σx(n)z^{-n}'], ['ROC', '使级数收敛的 z 区域，决定唯一性']],
    收敛域: [['因果 ROC', '|z|>最外极点模']],
    反变换: [['观察法', '对照典型 Z 变换对'], ['部分分式', '有理 X(z) 展开反变换']],
    极点: [['系统函数', 'H(z)=B(z)/A(z)，极点在单位圆内→因果稳定']],
    频响: [['频率响应', 'H(e^jω)=H(z)|_{z=e^jω}']],
    几何: [['零极点矢量法', '靠近零点衰减、靠近极点增强']],
    DFT: [['DFT', 'N 点频域采样，W_N=e^{-j2π/N}'], ['IDFT', '由 X(k) 重建 x(n)']],
    周期延拓: [['循环移位', 'x((n+m))_N，索引模 N 折回']],
    旋转因子: [['W_N', 'e^{-j2π/N}，DFT 基本复指数']],
    循环: [['循环卷积', 'N 点 DFT 对应时域模 N 卷积']],
    共轭: [['共轭对称', '实序列 x(n) 则 X(k)=X*(N-k)']],
    采样定理: [['频率域采样', 'N 点 X(k) 唯一确定 N 点 x(n)']],
    FFT: [['基 2 FFT', 'O(N log N)，分治分解 DFT'], ['蝶形运算', 'FFT 基本计算单元']],
    模拟: [['差分方程', '离散系统数学模型']],
    框图: [['直接 II 型', '共用延时链，延时数 max(M,N)']],
    信号流图: [['梅森公式', '由流图求 H(z)']],
    巴特沃斯: [['最大平坦', '通带内 |H|² 单调，无波纹']],
    数字滤波器: [['IIR', '含反馈，有理 H(z)'], ['FIR', '无反馈，仅零点']],
    脉冲响应不变: [['混叠', 's 平面映射到 z 平面的重叠']],
    双线性: [['预畸变', 'Ω=(2/T)tan(ω/2)']],
    频率变换: [['高通变换', 's_LP=Ω_c/s']],
    网络结构: [['级联二阶节', '数值稳定优于高阶直接型']],
    FIR: [['线性相位', 'h(n)=±h(N-1-n)']],
    窗函数: [['吉布斯现象', '矩形窗截断致通带波纹']],
    频率采样: [['过渡点', '优化 H_d(k) 改善阻带']],
  };
  for (const [key, terms] of Object.entries(map)) {
    if (part.includes(key)) return [...common, ...terms];
  }
  return [...common, ['本章关键词', `第 ${ch.num} 章 ${ch.name}`]];
}

function countChars(text) {
  return text.replace(/\s/g, '').length;
}

const fileNames = data.parts.map((p) => sanitizeFilename(p.part, p.page));
let totalChars = 0;

data.parts.forEach((p, idx) => {
  const fn = fileNames[idx];
  const prev = idx > 0 ? fileNames[idx - 1] : null;
  const next = idx < data.parts.length - 1 ? fileNames[idx + 1] : null;
  const nav = [
    `← [[${BV}-总览]]`,
    prev ? `← [[${prev}]]` : '',
    next ? `下一篇 → [[${next}]]` : '',
  ].filter(Boolean).join(' | ');

  const ch = getChapter(p.page);
  const content = knowledge[p.page];
  if (!content) {
    console.warn(`Missing knowledge for P${p.page}`);
    return;
  }
  totalChars += countChars(content);

  const terms = getTerms(p.part, p.page);
  const examTip = getExamTips(p.page);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${p.part}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [dsp, 数字信号处理, 视频笔记, 西电, 第${ch.num}章]
duration: "${p.duration_fmt.replace('分', 'm').replace('秒', 's')}"
cid: ${p.cid}
created: ${DATE}
updated: ${DATE}
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: ${countChars(content)}
---

# P${String(p.page).padStart(2, '0')} ${p.part}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${p.part} |
| 章节 | 第 ${ch.num} 章 · ${ch.name} |
| 时长 | ${p.duration_fmt.replace(/(\d+)分(\d+)秒/, '$1 分 $2 秒')} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 教材 | 西安电子科技大学出版社《数字信号处理》 |
| 内容来源 | 知识点增强（西电教材大纲，非逐字转写） |

## 核心要点

1. **本 P 主题**：${p.part.replace(/（.*?）/g, '').trim()}
2. **教材章节**：第 ${ch.num} 章「${ch.name}」
3. **考试侧重**：${examTip}
4. **学习建议**：先读下方详细笔记建立框架，再对照课本补全推导与习题
5. **与视频关系**：笔记覆盖 UP 本 P 应讲的核心知识点，具体例题步骤以视频为准

## 详细笔记

> 以下内容基于西电版《数字信号处理》教材知识体系撰写，对应 B 站分 P 标题「${p.part}」。**非 UP 逐字转写**；视频中的精选例题请对照观看。

${content}

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${data.parts[idx - 1].part}**（[[${prev}]]）` : '- ← 课程起点，见 [[BV127411M7BU-总览]]'}
${next ? `- → **${data.parts[idx + 1].part}**（[[${next}]]）` : '- → 课程终点'}

## 来源说明

- ✅ B 站官方标题、简介、分 P 元数据（\`api.bilibili.com\`，见 \`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ✅ **知识点增强**：西电教材大纲实质内容（约 ${countChars(content)} 字，${DATE}）
- ⏳ 逐字转写：B 站 API 无外挂字幕轨（内嵌配音字幕）；可选 Whisper/BiliNote 后续补充

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
  overview = overview.replace(
    /> 当前笔记基于 \*\*官方简介 \+ 分 P 结构 \+ 章节标题\*\* 整理，待 Whisper\/BiliNote 可继续补充逐字稿与公式推导。/,
    `> 各分 P 笔记已补充 **西电教材知识点实质内容**（约 800–1500 字/篇，${DATE}）。B 站 API 无外挂字幕，逐字稿可后续用 Whisper/BiliNote 补充。`
  );
  overview = overview.replace(/status: 已生成/, 'status: 已增强');
  overview = overview.replace(/updated: \d{4}-\d{2}-\d{2}/, `updated: ${DATE}`);
  fs.writeFileSync(overviewPath, overview, 'utf8');
}

console.log(`Enhanced ${data.parts.length} DSP notes in ${OUT_DIR}`);
console.log(`Total knowledge content: ~${totalChars} chars (avg ${Math.round(totalChars / data.parts.length)}/note)`);
