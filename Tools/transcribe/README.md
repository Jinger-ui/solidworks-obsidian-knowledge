# 逐字转写流水线

将 B 站分 P 视频转为带时间戳的逐字稿，输出 SRT/TXT，并合并到 Obsidian `Vault/01-视频笔记/` 对应笔记的 `## 逐字转写` 章节。

## 快速开始

```powershell
# 环境检测
D:\solidworks\逐字转写.bat check

# 为三门课程批量添加「逐字转写」占位（首次一次）
D:\solidworks\逐字转写.bat init

# 转写单集（推荐 auto：先 B 站字幕 API，无则 Whisper）
D:\solidworks\逐字转写.bat BV1ser5BDESU 1 auto

# 或 PowerShell
.\Tools\transcribe\transcribe.ps1 -Bvid BV1ser5BDESU -Part 1 -Engine auto
```

## 引擎说明

| 引擎 | 说明 |
|------|------|
| `auto` | 先调 B 站字幕 API；无字幕则下载音频 + faster-whisper |
| `whisper` | 强制本地 Whisper（需 ffmpeg + faster-whisper） |
| `bilinote` | 生成 BiliNote 操作指引；用 `-ImportPath` 导入导出文件 |
| `bilibili` | 仅尝试 B 站字幕 API |

## 输出位置

```
Downloads/transcripts/{BV号}/P01.srt
Downloads/transcripts/{BV号}/P01.txt
Downloads/transcripts/audio/{BV号}-P01.wav   # Whisper 用，可删
Downloads/whisper-models/                    # 模型缓存（不提交 Git）
```

Vault 笔记 frontmatter 会更新：

- `transcript_status: 已转写|待转写|部分`
- `transcript_engine: whisper|bilibili_api|bilinote|...`

## 环境依赖

### 必需

- **Python 3.10+**（推荐独立安装；`Tools/python311` 若缺少 `Lib` 目录则不可用）
- 本项目脚本（无需额外 API Key）

### Whisper 转写（无 B 站字幕时）

1. **ffmpeg**（音频转码）
   ```powershell
   winget install Gyan.FFmpeg
   # 或 choco install ffmpeg
   ```
2. **Python 包**
   ```powershell
   python -m pip install -r D:\solidworks\Tools\transcribe\requirements.txt
   ```
3. **音频下载**（二选一）
   - [BBDown](https://github.com/nilaoda/BBDown) → 放到 `Tools/BBDown.exe`
   - 或 `pip install yt-dlp`

首次 Whisper 会从 Hugging Face 下载 `small` 模型（约 500MB）到 `Downloads/whisper-models`。

### BiliNote 补充

见 [`lib/bilinote_guide.md`](lib/bilinote_guide.md)。

## 配置

复制 `config.example.json` 为 `config.json` 并按需修改 BV 号、模型、路径。

## 子命令

```powershell
python Tools/transcribe/transcribe.py check
python Tools/transcribe/transcribe.py init-vault
python Tools/transcribe/transcribe.py demo-merge --bvid BV1ser5BDESU --part 1
python Tools/transcribe/transcribe.py run --bvid BV1ser5BDESU --parts 1-3 --engine auto
python Tools/transcribe/transcribe.py run --bvid BV1ser5BDESU --part 1 --engine bilinote --import-path Downloads/transcripts/BV1ser5BDESU/bilinote/P01.md
```

## 已支持课程

| BV 号 | 课程目录 | 分 P |
|-------|----------|------|
| BV1ser5BDESU | 数据要素技术 | 47 |
| BV127411M7BU | DSP数字信号处理 | 44 |
| BV1Yo5D6TEVk | SolidWorks-AI自动化 | 6 |

## 故障排除

| 现象 | 处理 |
|------|------|
| `未找到 ffmpeg` | 安装 ffmpeg 并加入 PATH，重启终端 |
| `faster-whisper 未安装` | `pip install -r requirements.txt` |
| `B 站 API 无字幕` | 本仓库三门课多为内嵌配音无外挂轨，需 Whisper 或 BiliNote |
| `BBDown/yt-dlp 均不可用` | 安装其一到 PATH 或 `Tools/BBDown.exe` |
| Python 3.6 过旧 | 安装 Python 3.11+，不要用 Anaconda 3.6 |
