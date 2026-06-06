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

function countChars(text) {
  return text.replace(/\s/g, '').length;
}

let totalChars = 0;

data.parts.forEach((p, idx) => {
  const fn = fileNames[idx];
  const content = knowledge[p.page];
  if (!content) return;
  totalChars += countChars(content);

  const prev = idx > 0 ? fileNames[idx - 1] : null;
  const next = idx < data.parts.length - 1 ? fileNames[idx + 1] : null;
  const nav = [
    `← [[${BV}-总览]]`,
    prev ? `← [[${prev}]]` : '',
    next ? `下一篇 → [[${next}]]` : '',
  ].filter(Boolean).join(' | ');

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
word_count: ${countChars(content)}
---

# P${String(p.page).padStart(2, '0')} ${titles[idx]}

${nav}

## 视频信息

| 项目 | 内容 |
|------|------|
| 分集 | ${p.part} |
| 时长 | ${p.duration_fmt.replace(/(\d+)分(\d+)秒/, '$1 分 $2 秒')} |
| 链接 | [B 站 P${p.page}](https://www.bilibili.com/video/${BV}?p=${p.page}) |
| 内容来源 | 知识点增强（教程流程梳理，非逐字转写） |

## 核心要点

1. **本 P 定位**：${titles[idx]}——系列第 ${p.page}/6 步
2. **前置依赖**：${idx === 0 ? '无，系列起点' : `需完成 P0${idx}（[[${fileNames[idx - 1]}]]）`}
3. **产出物**：${['结构化读图与建模思路', 'SolidWorks API 运行环境', '参数 JSON 与 API 映射验证', '参数化零件脚本', '复杂件与标准件库', '装配体与最终保存'][idx]}
4. **学习建议**：结合下方详细笔记理解流程，再对照视频看 UP 具体操作

## 详细笔记

> 以下内容基于机械 AI + SolidWorks 自动化通用实践撰写，对应 UP 分 P 主题。**非逐字转写**。

${content}

## 关键术语

| 术语 | 说明 |
|------|------|
| COM API | SolidWorks 自动化接口，Python/C# 通过 win32com 调用 |
| 特征树 | SolidWorks 建模操作历史，API 按序添加特征 |
| 参数化 | 驱动尺寸控制几何，供 AI/API 修改 |
| 配合 | 装配体中约束零件相对位置的关系 |

## 与后续分 P 的衔接

${prev ? `- ← [[${prev}]]` : '- 系列起点'}
${next ? `- → [[${next}]]` : '- 系列终点'}

## 来源说明

- ✅ B 站官方元数据（\`Tools/${BV}-full.json\`）
- ✅ 分 P 首帧封面
- ✅ **知识点增强**（约 ${countChars(content)} 字，${DATE}）
- ⏳ 逐字转写：API 无外挂字幕；可选 Whisper 后续补充

## 关键截图

![[../../06-资源附件/video-notes-images/${p.cover_local}|B站首帧 P${String(p.page).padStart(2, '0')}]]
`;
  fs.writeFileSync(path.join(OUT_DIR, `${fn}.md`), md, 'utf8');
});

console.log(`Enhanced ${data.parts.length} SolidWorks notes, ~${totalChars} chars total`);
