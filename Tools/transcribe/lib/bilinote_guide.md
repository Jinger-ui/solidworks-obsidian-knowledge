# BiliNote 半自动逐字转写流程

当本地 Whisper 环境不足，或需要更高质量中文转写时，可用 [BiliNote](https://www.bilinote.app) 生成逐字稿后导入本仓库。

## 步骤

1. 打开 https://www.bilinote.app ，粘贴 B 站链接，例如：
   `https://www.bilibili.com/video/BV1ser5BDESU?p=1`
2. 等待 BiliNote 生成笔记/转写（可导出 Markdown 或 JSON）。
3. 将导出文件放到：
   `Downloads/transcripts/{BV号}/bilinote/P01.md` 或 `P01.json`
4. 运行导入合并：

```powershell
.\Tools\transcribe\transcribe.ps1 -Bvid BV1ser5BDESU -Part 1 -Engine bilinote -ImportPath "Downloads\transcripts\BV1ser5BDESU\bilinote\P01.md"
```

## 支持的导入格式

| 格式 | 说明 |
|------|------|
| `.srt` / `.vtt` | 标准字幕，直接解析时间戳 |
| `.txt` | 纯文本，无时间戳（合并为无时间戳列表） |
| `.json` | B 站字幕 JSON（`body[].from/to/content`）或 BiliNote 类似结构 |
| `.md` | Markdown；提取 `- **[mm:ss]** 文本` 或纯段落 |

## 与 Obsidian 的衔接

合并后会在对应分 P 笔记中写入 `## 逐字转写`，并更新 frontmatter：

- `transcript_status: 已转写`
- `transcript_engine: bilinote`
