/**
 * Enhance PCB Obsidian notes to tutorial level (2500-3500 chars)
 * Usage: node build-pcb-content.js && node enhance-pcb-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1At421h7Ui';
const MASTER_BV = 'BV1m441157T7';
const COURSE_URL = 'https://pan.quark.cn/s/05650fad6466';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', 'PCB设计嘉立创EDA');
const DATE = '2026-06-06';

const { buildTutorialBody, countChars } = require('./lib/tutorial-framework');
const tutorialDetail = require('./content/pcb-tutorial-detail');
const knowledge = require('./content/pcb-knowledge');
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function sanitizeFilename(part, page) {
  let name = part
    .replace(/^【入门篇】\d+-/, '')
    .replace(/^【强化篇】\d+-/, '')
    .replace(/^开场白：/, '开场白-')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|&]/g, '')
    .replace(/[———]/g, '-')
    .replace(/：/g, '-')
    .replace(/\s+/g, '')
    .trim();
  if (!name || name.length > 45) {
    name = part.replace(/[\\/:*?"<>|（）()【】\[\]]/g, '').slice(0, 45);
  }
  return `P${String(page).padStart(2, '0')}-${name || `分P${page}`}`;
}

function shortTitle(part) {
  return part
    .replace(/^【入门篇】\d+-/, '')
    .replace(/^【强化篇】\d+-/, '')
    .replace(/^开场白：/, '开场白：')
    .trim();
}

function getThemeGroup(page) {
  if (page <= 2) return { id: 'intro', name: '课程导览', range: 'P01–P02' };
  if (page <= 8) return { id: 'circuit', name: '电路分析基础', range: 'P03–P08' };
  if (page <= 12) return { id: 'pcb_base', name: 'PCB设计基础', range: 'P09–P12' };
  if (page <= 17) return { id: 'eda', name: '嘉立创EDA操作', range: 'P13–P17' };
  if (page <= 24) return { id: 'mcu51', name: '51核心板实战', range: 'P18–P24' };
  return { id: 'usb_hub', name: 'USB拓展坞实战', range: 'P25–P29' };
}

const examTips = {
  1: 'PCB 设计全流程概览、三篇学习路线、课程资料获取',
  2: '三篇课程结构、学习前置、配套资料用法',
  3: 'PCB 发展史、IPC 标准、嘉立创 EDA+制造生态',
  4: '阻容感元件特性、RC/RL 电路、去耦电容',
  5: '二极管/三极管/MOS 特性与应用',
  6: 'Datasheet 阅读、极限参数、封装页',
  7: '欧姆定律、KCL/KVL、戴维南、叠加定理',
  8: '原理图阅读、网络标号、模块化分析',
  9: 'PCB 四层结构、焊盘/过孔/铜皮',
  10: '2/4 层叠层、阻抗、信号-地配对',
  11: '符号与封装对应、焊盘编号',
  12: '原理图→PCB→DRC→Gerber 全流程',
  13: 'lceda.cn 下载安装、专业版特性',
  14: 'EDA 界面分区、库面板、快捷键',
  15: '设计规则、栅格、单位 mil/mm',
  16: '符号绘制、引脚类型、库保存',
  17: '封装绘制、IPC-7351 焊盘',
  18: '51 板器件选型：STC89/CH340/AMS1117',
  19: '电源树、晶振负载电容、最小系统',
  20: '外围电路、ERC/DRC 报错处理',
  21: '功能分区布局、去耦紧靠 VCC',
  22: '3W 布线原则、电源加粗、回流路径',
  23: '51 板布线、铺铜、过孔扇出',
  24: '丝印、DRC、Gerber/BOM 导出',
  25: 'USB Hub/Type-C/ESD 选型',
  26: 'Hub 原理图、CC 电阻、模块化',
  27: 'USB 板布局、差分预留',
  28: 'USB 差分 90Ω、等长匹配',
  29: 'USB 板 DRC、下单参数核对',
};

function getTerms(page, part) {
  const common = [
    ['PCB', '印刷电路板，承载元器件与走线'],
    ['嘉立创 EDA', '国产 PCB 设计软件，lceda.cn'],
    ['DRC', 'Design Rule Check，设计规则检查'],
  ];
  const map = {
    4: [['电阻', '阻碍电流，分压分流'], ['去耦电容', '0.1μF 滤高频噪声']],
    5: [['MOSFET', '电压控开关，现代数字电路主流'], ['ESD', '静电放电保护']],
    6: [['Datasheet', '元器件官方规格书'], ['Absolute Maximum', '绝对最大额定值']],
    7: [['KCL', '节点电流代数和为零'], ['KVL', '回路电压代数和为零']],
    8: [['网络标号', '同标号即电气连通'], ['电源树', '从输入到各芯片的供电路径']],
    9: [['FR-4', '玻璃纤维 PCB 基材'], ['过孔 Via', '连接不同铜层']],
    10: [['叠层 Stackup', '铜层与介质排列'], ['阻抗控制', '差分对 90Ω 等']],
    11: [['Symbol', '原理图符号'], ['Footprint', 'PCB 封装焊盘']],
    15: [['mil', '1/1000 英寸，PCB 常用单位'], ['设计规则', '线宽/间距/过孔限制']],
    18: [['STC89C52', '51 内核 MCU'], ['CH340G', 'USB 转 UART']],
    19: [['LDO', '低压差线性稳压'], ['负载电容', '晶振两侧补偿电容']],
    22: [['3W原则', '最短最直最宽'], ['铺铜', '大面积接地降低阻抗']],
    25: [['CH334R', 'USB2.0 Hub IC'], ['Type-C CC', '配置通道下拉电阻']],
    28: [['差分对', 'DP/DM 等长等距'], ['90Ω', 'USB2.0 特性阻抗']],
  };
  return [...common, ...(map[page] || [['本讲关键词', shortTitle(part).slice(0, 30)]])];
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
  const content = buildTutorialBody({
    seriesName: '零基础入门PCB设计-嘉立创EDA专业版',
    page: p.page,
    shortTitle: st,
    themeName: theme.name,
    prevTitle: idx > 0 ? titles[idx - 1] : null,
    nextTitle: idx < data.parts.length - 1 ? titles[idx + 1] : null,
    examTip: examTips[p.page] || st,
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
  const examTip = examTips[p.page] || st;

  const md = `---
title: "P${String(p.page).padStart(2, '0')} ${st}"
source: "https://www.bilibili.com/video/${BV}?p=${p.page}"
up: "${data.up}"
tags: [PCB, PCB设计, 嘉立创EDA, 视频笔记, ${theme.id}, 保姆级教学, 教程级]
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
course_materials: "${COURSE_URL}"
---

# P${String(p.page).padStart(2, '0')} ${st}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${st} |
| 模块 | ${theme.name}（${theme.range}） |
| 时长 | ${fmtDurationCn(p.duration_sec)} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 课程资料 | [夸克网盘](${COURSE_URL}) |
| 内容来源 | 教程级知识点增强（非逐字转写） |

## 核心要点

1. **本 P 主题**：${st}
2. **模块定位**：${theme.name}（${theme.range}）
3. **实操/考试侧重**：${examTip}
4. **笔记层级**：教程级（约 ${wc} 字），含速览、Mermaid、Walkthrough、自测题
5. **学习建议**：P13 起请安装嘉立创 EDA 专业版跟画；资料包工程与视频同步打开

> 以下内容基于 Expert电子实验室 PCB 课程体系撰写，对应 B 站分 P「${p.part}」。**非 UP 逐字转写**；不看视频也可建立框架，看视频可对照「与视频对照表」深化。

${content}

## 逐字转写

> ⏳ **待转写**（\`transcript_status: 待转写\`）
>
> B 站 API 无外挂字幕轨（视频为内嵌中文字幕）。可使用 \`Tools/transcribe/\` 下 Whisper/BiliNote 工作流后续补充。转写完成后在此节粘贴全文并更新 frontmatter \`transcript_status: 已完成\`。
>
> **课程资料**：[夸克网盘](${COURSE_URL})（原理图工程、封装库、BOM）

## 关键术语

| 术语 | 说明 |
|------|------|
${terms.map(([t, d]) => `| ${t} | ${d} |`).join('\n')}

## 与前后分 P 的衔接

${prev ? `- ← **${titles[idx - 1]}**（[[${prev}]]）` : `- ← 课程起点，见 [[${BV}-总览]]`}
${next ? `- → **${titles[idx + 1]}**（[[${next}]]）` : '- → 强化篇终点；大师篇见 [[BV1At421h7Ui-总览#大师篇]]'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面（\`06-资源附件/video-notes-images/${p.cover_local}\`）
- ✅ **教程级增强**：含 Mermaid、Walkthrough、自测题（约 ${wc} 字，${DATE}）
- ✅ 课程资料：[夸克网盘](${COURSE_URL})
- ⏳ 逐字转写：待 Whisper/BiliNote

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Overview
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
tags: [PCB, PCB设计, 嘉立创EDA, 视频笔记, MOC, 保姆级教学, Expert电子实验室]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 教程级已增强
source_type: 教程级知识点增强
course_materials: "${COURSE_URL}"
---

# ${data.title}

> **Expert电子实验室（国一学长）** 嘉立创 EDA 专业版 PCB 保姆级教程，本 BV 含 **入门篇 + 强化篇** 共 **${data.parts.length}** 分 P（约 ${fmtDurationHms(data.total_duration_sec)} / ${data.total_duration_fmt}）。
>
> 各分 P 笔记已升级为 **教程级**（约 2500–3500 字/篇，含 Mermaid、Walkthrough、自测题，${DATE}）。**大师篇**为独立视频合集，见下文链接。

## 视频简介（B 站原文）

${data.desc}

## 课程资料

📦 **[夸克网盘课程资料](${COURSE_URL})**（原理图工程、封装库、BOM 等）

## 大师篇

本 BV（BV1At421h7Ui）覆盖**入门篇 P02–P12** 与 **强化篇 P13–P29**。**大师篇**（高速、多层板等进阶内容）为 UP 主**独立上传**的合集，推荐学完本 BV 后继续：

- 🔗 [大师篇合集](https://www.bilibili.com/video/${MASTER_BV})（嘉立创EDA 教程关联推荐，标题含「大师篇」）
- 在 B 站搜索 UP **Expert电子实验室** → 视频列表 →「大师篇」

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
  root((PCB嘉立创EDA))
    入门篇 P02-P12
      电路分析 P04-P08
      PCB基础 P09-P12
    强化篇 P13-P29
      EDA操作 P13-P17
      51核心板 P18-P24
      USB拓展坞 P25-P29
    大师篇 另BV
      高速多层
\`\`\`

## 分 P 索引

| 分 P | B 站分集标题 | 时长 | 字数 | 笔记 |
|------|-------------|------|------|------|
${indexRows}

## 学习路径

\`\`\`mermaid
flowchart TB
  T0[P01 开场] --> T1[电路基础 P03-P08]
  T1 --> T2[PCB概念 P09-P12]
  T2 --> T3[EDA软件 P13-P17]
  T3 --> T4[51核心板 P18-P24]
  T4 --> T5[USB拓展坞 P25-P29]
  T5 --> T6[大师篇 另BV]
\`\`\`

### 按主题分组

1. **课程导览（P01–P02）** — 学习路线、资料获取
2. **电路分析基础（P03–P08）** — 阻容感、半导体、Datasheet、电路定理、读原理图
3. **PCB 设计基础（P09–P12）** — 板层结构、叠层、符号封装、设计流程
4. **嘉立创 EDA 操作（P13–P17）** — 安装、界面、规则、符号/封装绘制
5. **51 核心板实战（P18–P24）** — 选型、原理图、布局、布线、导出
6. **USB 拓展坞实战（P25–P29）** — Hub 选型、原理图、差分布线、DRC 下单

> 建议：零基础从 P01 顺序学习；有模电基础可从 P09 切入；每集配合夸克资料包工程跟画。

## 关联资源

- 原始 API 数据：\`Tools/${BV}-full.json\`
- 笔记生成：\`Tools/bili-fetch/generate-pcb-notes.js\`
- 教程级增强：\`Tools/bili-fetch/enhance-pcb-notes.js\`
- 知识点库：\`Tools/bili-fetch/content/pcb-knowledge.js\`
- 教程深化：\`Tools/bili-fetch/content/pcb-tutorial-detail.js\`
- 内容构建：\`Tools/bili-fetch/build-pcb-content.js\`
- 封面目录：[[../../06-资源附件/video-notes-images/]]
- 思维导图：[[思维导图]]

## 工具与数据文件

| 工具 | 路径 | 用途 |
|------|------|------|
| Node 抓取脚本 | \`Tools/bili-fetch/fetch-bilibili.js\` | 元数据 + 首帧封面 |
| 结构化摘要 | \`Tools/${BV}-full.json\` | 分 P 数据 |
| 教程深化 | \`Tools/bili-fetch/content/pcb-tutorial-detail.js\` | 分页 Walkthrough/自测 |
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
title: "PCB设计嘉立创EDA - 思维导图"
tags: [PCB, 思维导图, mermaid, 嘉立创EDA, Expert电子实验室]
updated: ${DATE}
status: 教程级已增强
---

# PCB 设计嘉立创 EDA · 思维导图

← [[${BV}-总览]]

\`\`\`mermaid
mindmap
  root((${BV}))
    课程导览 P01-P02
      学习路线
      资料获取
    电路分析 P03-P08
      阻容感
      半导体
      读原理图
    PCB基础 P09-P12
      叠层结构
      符号封装
      设计流程
    EDA操作 P13-P17
      界面规则
      库绘制
    51核心板 P18-P24
      原理图
      布局布线
      Gerber
    USB拓展坞 P25-P29
      Hub选型
      差分90Ω
    大师篇 另BV
\`\`\`

## 分 P 详图

\`\`\`mermaid
mindmap
  root((PCB保姆级29讲))
${mindmapNodes}
\`\`\`

> 各 P 已按**教程级**增强（${DATE}，合计约 ${totalChars} 字，均篇 ${wordCounts.length ? Math.round(totalChars / wordCounts.length) : 0} 字）。封面见 \`06-资源附件/video-notes-images/BV1At421h7Ui-P*-cover.jpg\`。
`;
fs.writeFileSync(path.join(OUT_DIR, '思维导图.md'), mindmapMd, 'utf8');

const avg = wordCounts.length ? Math.round(totalChars / wordCounts.length) : 0;
console.log(`Enhanced ${data.parts.length} PCB notes in ${OUT_DIR}`);
console.log(`Word counts: min=${Math.min(...wordCounts)}, max=${Math.max(...wordCounts)}, avg=${avg}, total=${totalChars}`);
