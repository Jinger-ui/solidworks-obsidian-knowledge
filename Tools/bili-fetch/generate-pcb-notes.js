/**
 * Generate Obsidian skeleton notes for BV1At421h7Ui PCB course
 * Usage: node generate-pcb-notes.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1At421h7Ui';
const JSON_FILE = path.join(__dirname, '..', `${BV}-full.json`);
const OUT_DIR = path.join(__dirname, '..', '..', 'Vault', '01-视频笔记', 'PCB设计嘉立创EDA');
const COURSE_URL = 'https://pan.quark.cn/s/05650fad6466';
const DATE = '2026-06-06';

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
tags: [PCB, PCB设计, 嘉立创EDA, 视频笔记, ${theme.id}, 保姆级教学]
duration: "${p.duration_fmt.replace('分', 'm').replace('秒', 's')}"
cid: ${p.cid}
created: ${DATE}
updated: ${DATE}
tool: "bilibili-obsidian-notes 工作流 + B站 API + Node 抓取"
status: 已生成
source_type: 元数据增强
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
| 内容来源 | 元数据骨架（待 enhance-pcb-notes.js 教程级增强） |

## 核心要点

1. **本 P 主题**：${st}
2. **模块定位**：${theme.name}
3. **学习建议**：先读总览，再按 P 顺序学习；P13 起需安装嘉立创 EDA 专业版跟画

## 大纲

- ⏳ 待 \`enhance-pcb-notes.js\` 教程级增强
- 模块：${theme.name}
- 主题：${p.part}

## 逐字转写

> ⏳ **待转写**（\`transcript_status: 待转写\`）
>
> B 站 API 无外挂字幕轨。可使用 \`Tools/transcribe/\` 下 Whisper/BiliNote 工作流后续补充。

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

// Overview skeleton
const indexRows = data.parts.map((p, idx) => {
  const fn = fileNames[idx];
  const st = shortTitle(p.part);
  return `| P${String(p.page).padStart(2, '0')} | ${st} | ${p.duration_fmt.replace('分', 'm').replace('秒', 's')} | — | [[${fn}]] |`;
}).join('\n');

const overviewMd = `---
title: "${data.title}"
source: "https://www.bilibili.com/video/${BV}"
up: "${data.up}"
tags: [PCB, PCB设计, 嘉立创EDA, 视频笔记, MOC, 保姆级教学]
duration: "${fmtDurationHms(data.total_duration_sec)}"
created: ${DATE}
updated: ${DATE}
tool: "B站 API + bilibili-obsidian-notes 工作流"
status: 已生成
course_materials: "${COURSE_URL}"
---

# ${data.title}

> **Expert电子实验室（国一学长）** 嘉立创 EDA 专业版 PCB 保姆级教程，共 **${data.parts.length}** 分 P（约 ${fmtDurationHms(data.total_duration_sec)}）。入门篇 + 强化篇；**大师篇**为独立合集。

## 课程资料

[夸克网盘](${COURSE_URL})

## 分 P 索引

| 分 P | 标题 | 时长 | 字数 | 笔记 |
|------|------|------|------|------|
${indexRows}

## 关联

- API：\`Tools/${BV}-full.json\`
- 生成：\`Tools/bili-fetch/generate-pcb-notes.js\`
- 增强：\`Tools/bili-fetch/enhance-pcb-notes.js\`
`;
fs.writeFileSync(path.join(OUT_DIR, `${BV}-总览.md`), overviewMd, 'utf8');
console.log(`Generated ${data.parts.length} skeleton notes + overview in ${OUT_DIR}`);
