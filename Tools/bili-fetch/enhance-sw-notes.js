/**
 * Enhance SolidWorks-AI Obsidian notes with substantive content.
 * Usage: node enhance-sw-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1Yo5D6TEVk';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', 'SolidWorks-AI自动化');
const DATE = '2026-06-06';

const knowledge = require('./content/sw-knowledge');
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

const fileNames = [
  'P01-图纸阅读与建模思路',
  'P02-环境自动化准备',
  'P03-API调用与参数确认',
  'P04-参数化零件建模',
  'P05-装配体标准件生成',
  'P06-装配尝试与保存收尾',
];

const titles = [
  '图纸阅读与建模思路',
  '环境自动化准备',
  'API 调用与参数确认',
  '参数化零件建模',
  '装配体标准件生成',
  '装配尝试与保存收尾',
];

const outputs = [
  '结构化读图与建模思路、参数 JSON 草稿',
  'SolidWorks API 运行环境（Python/C# + COM）',
  '参数 JSON schema 与 API 映射验证',
  '参数化零件生成脚本',
  '复杂件与 Toolbox 标准件库',
  '装配体、干涉检查与最终交付',
];

function getExamTips(page) {
  const tips = {
    1: '视图投影、尺寸链分类、零件拆分与建模策略、AI 读图边界',
    2: 'COM 连接、宏安全、模板路径、Python/C# 环境依赖',
    3: 'SldWorks 对象链、JSON schema、SetSystemValue3、逐步调试',
    4: '特征顺序、草图约束、拉伸切除、参数化脚本结构',
    5: '复杂特征取舍、Toolbox 标准件、装配前零件准备',
    6: '配合类型与 DOF、干涉检查、Pack and Go、全流程复盘',
  };
  return tips[page] || '对照视频与 API 帮助文档';
}

function getTerms(page) {
  const map = {
    1: [
      ['第一角投影', '俯视图在主视图正上方，国标常用'],
      ['尺寸链', '从基准串联的功能尺寸关系'],
      ['参数 JSON', 'AI 读图输出的结构化驱动参数'],
      ['特征树', '建模操作历史，决定 API 调用顺序'],
    ],
    2: [
      ['COM API', 'SolidWorks 自动化接口，win32com 调用'],
      ['SldWorks.Application', '顶层应用对象，入口 ProgID'],
      ['宏安全', '控制 VBA/COM 外部访问权限'],
      ['prtdot', '零件默认模板文件'],
    ],
    3: [
      ['ModelDoc2', '当前活动文档对象'],
      ['SetSystemValue3', '修改驱动尺寸值的 API'],
      ['参数映射表', 'JSON 字段与 SW 尺寸名对应关系'],
      ['ForceRebuild3', '强制重建模型'],
    ],
    4: [
      ['ExtrudeBoss', '拉伸凸台，创建基体'],
      ['ExtrudeCut', '拉伸切除，去除材料'],
      ['完全定义草图', '黑线状态，特征创建前提'],
      ['CircularPattern', '圆周阵列特征'],
    ],
    5: [
      ['Toolbox', 'SolidWorks 标准件库'],
      ['Sweep', '扫描特征，路径+截面'],
      ['SheetMetal', '钣金特征序列'],
      ['插入点', '零件原点在装配中的定位基准'],
    ],
    6: [
      ['AddMate2', '添加装配配合约束'],
      ['干涉检查', 'InterferenceDetection 发现体积重叠'],
      ['Pack and Go', '打包装配体及引用零件'],
      ['STEP', '中立 CAD 交换格式'],
    ],
  };
  return map[page] || [['SolidWorks API', '驱动建模装配的 COM 接口']];
}

function countChars(text) {
  return text.replace(/\s/g, '').length;
}

let totalChars = 0;
const wordCounts = [];

data.parts.forEach((p, idx) => {
  const fn = fileNames[idx];
  const content = knowledge[p.page];
  if (!content) {
    console.warn(`Missing knowledge for P${p.page}`);
    return;
  }
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

  const terms = getTerms(p.page);
  const examTip = getExamTips(p.page);

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${titles[idx]}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [solidworks, ai, 视频笔记, 机械设计, 自动化]
duration: "${p.duration_fmt.replace('分', 'm').replace('秒', 's')}"
cid: ${p.cid}
created: ${DATE}
updated: ${DATE}
tool: "bilibili-obsidian-notes 工作流 + 知识点增强脚本"
status: 已增强
source_type: 知识点增强
word_count: ${wc}
---

# P${String(p.page).padStart(2, '0')} ${titles[idx]}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${p.part} |
| 时长 | ${p.duration_fmt.replace(/(\d+)分(\d+)秒/, '$1 分 $2 秒')} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 内容来源 | 知识点增强（SolidWorks API/机械设计体系，非逐字转写） |

## 核心要点

1. **本 P 主题**：${titles[idx]}——系列第 ${p.page}/6 步
2. **前置依赖**：${idx === 0 ? '无，系列起点' : `需完成 P0${idx}（[[${fileNames[idx - 1]}]]）`}
3. **产出物**：${outputs[idx]}
4. **学习侧重**：${examTip}
5. **学习建议**：先读下方详细笔记建立框架，再对照视频看 UP 具体操作

## 详细笔记

> 以下内容基于 SolidWorks API 与机械设计知识体系撰写，对应 B 站分 P「${p.part}」。**非 UP 逐字转写**；视频中的界面操作与代码以观看为准。

${content}

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${data.parts[idx - 1].part}**（[[${prev}]]）` : '- ← 系列起点，见 [[BV1Yo5D6TEVk-总览]]'}
${next ? `- → **${data.parts[idx + 1].part}**（[[${next}]]）` : '- → 系列终点'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`Tools/bili-fetch/fetch-bilibili.js\`）
- ✅ **知识点增强**：SolidWorks API/机械设计实质内容（约 ${wc} 字，${DATE}）
- ⏳ 逐字转写：API 无外挂字幕轨；可选 Whisper/BiliNote 后续补充

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
    /> 分 P 标题含「带字幕配音」，但 B 站 API 未返回可下载字幕轨；当前笔记基于 \*\*官方简介 \+ 分 P 结构\*\* 整理，待 Whisper\/BiliNote 可继续补充逐字稿。/,
    `> 各分 P 笔记已补充 **SolidWorks API/机械设计知识点实质内容**（约 800–1500 字/篇，${DATE}）。B 站 API 无外挂字幕，逐字稿可后续用 Whisper/BiliNote 补充。`
  );
  overview = overview.replace(/updated: \d{4}-\d{2}-\d{2}/, `updated: ${DATE}`);
  // Add word count row to index table if not present
  if (!overview.includes('字数')) {
    overview = overview.replace(
      /\| 分 P \| B 站分集标题 \| 时长 \| 笔记 \|/,
      '| 分 P | B 站分集标题 | 时长 | 字数 | 笔记 |'
    );
    overview = overview.replace(
      /\|------\|-------------\|------\|------\|/,
      '|------|-------------|------|------|------|'
    );
  }
  const rows = data.parts.map((p, idx) => {
    const wc = wordCounts[idx] || 0;
    const dur = p.duration_fmt.replace('分', 'm').replace('秒', 's');
    return `| P0${p.page} | ${p.part} | ${dur} | ~${wc} | [[${fileNames[idx]}]] |`;
  });
  overview = overview.replace(
    /\| P0\d \|[^\n]+\n/g,
    ''
  );
  const indexHeader = '| 分 P | B 站分集标题 | 时长 | 字数 | 笔记 |';
  const indexSep = '|------|-------------|------|------|------|';
  const indexStart = overview.indexOf('## 分 P 索引');
  const learnStart = overview.indexOf('## 学习路径');
  if (indexStart >= 0 && learnStart > indexStart) {
    const before = overview.slice(0, indexStart);
    const after = overview.slice(learnStart);
    overview = `${before}## 分 P 索引\n\n${indexHeader}\n${indexSep}\n${rows.join('\n')}\n\n${after}`;
  }
  fs.writeFileSync(overviewPath, overview, 'utf8');
}

// Update mindmap
const mindmapPath = path.join(OUT_DIR, '思维导图.md');
const mindmapContent = `---
title: "SolidWorks AI 自动化 - 思维导图"
tags: [solidworks, 思维导图, mermaid]
updated: ${DATE}
status: 已增强
---

# SolidWorks AI 自动化 · 思维导图

← [[BV1Yo5D6TEVk-总览]]

\`\`\`mermaid
mindmap
  root((BV1Yo5D6TEVk))
    P01 读图 25m ~${wordCounts[0] || 0}字
      第一角投影
      尺寸链与零件拆分
      AI参数JSON
      [[P01-图纸阅读与建模思路]]
    P02 环境 45m ~${wordCounts[1] || 0}字
      COM与SldWorks
      宏安全
      Python/C#准备
      [[P02-环境自动化准备]]
    P03 API 30m ~${wordCounts[2] || 0}字
      调用链与Schema
      参数映射
      逐步调试
      [[P03-API调用与参数确认]]
    P04 建模 40m ~${wordCounts[3] || 0}字
      草图拉伸切除
      参数化特征树
      脚本模块化
      [[P04-参数化零件建模]]
    P05 标准件 30m ~${wordCounts[4] || 0}字
      Toolbox
      复杂特征
      装配前准备
      [[P05-装配体标准件生成]]
    P06 装配 20m ~${wordCounts[5] || 0}字
      配合与DOF
      干涉检查
      保存交付
      [[P06-装配尝试与保存收尾]]
\`\`\`

> 各 P 子节点已按知识点增强（${DATE}，合计约 ${totalChars} 字）。时长来自 B 站 API；封面见 \`06-资源附件/video-notes-images/\`。
`;
fs.writeFileSync(mindmapPath, mindmapContent, 'utf8');

console.log(`Enhanced ${data.parts.length} SolidWorks notes in ${OUT_DIR}`);
console.log(`Word counts: ${wordCounts.join(', ')} (avg ${Math.round(totalChars / wordCounts.length)})`);
console.log(`Total: ~${totalChars} chars`);
