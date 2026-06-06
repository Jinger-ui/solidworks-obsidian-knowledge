# SolidWorks 知识库工作区

SolidWorks 学习与 Obsidian 笔记仓库，包含 B 站视频笔记工具脚本与 Vault 目录结构。

## 目录说明

| 路径 | 用途 |
|------|------|
| `Vault/` | Obsidian 知识库（安装/打开时选择此文件夹） |
| `Tools/` | bilibili-obsidian-notes、bili-fetch 等本地工具 |
| `Projects/` | SolidWorks 模型与工程文件 |
| `Downloads/` | 临时下载与抓取产物（体积大的安装包不纳入 Git） |

## 快速开始

1. 克隆本仓库后，在 Obsidian 中选择 **打开文件夹作为库**，指向仓库内的 `Vault`。
2. 若本机已注册同名库，可运行 `打开知识库.bat` 或 `打开知识库.ps1`（`obsidian://open?vault=solidworks`）。
3. 视频笔记可配合 [bilinote.app](https://www.bilinote.app) 或 `Tools/bilibili-obsidian-notes` 脚本，输出到 `Vault/01-视频笔记/` 等目录。

## Vault 结构（概要）

- `00-Inbox` — 待整理
- `01-视频笔记` — 课程与视频 Markdown
- `02-SolidWorks` — SolidWorks 相关笔记
- `03-CAD与图纸` — CAD/图纸笔记
- `04-插件脚本` — 插件与脚本笔记
- `05-项目实践` — 项目记录
- `06-资源附件` — 图片等附件
- `Templates` — 笔记模板

大文件（如 Obsidian 安装包、嵌入式 Python 包）已在 `.gitignore` 中排除，需在本机自行下载。

## 逐字转写

将 B 站分 P 转为带时间戳逐字稿并写入 Obsidian 笔记 `## 逐字转写` 章节。

```batch
逐字转写.bat check                              REM 检测 ffmpeg / Python / Whisper
逐字转写.bat init                               REM 为三门课程笔记添加占位章节
逐字转写.bat BV1ser5BDESU 1 auto                REM 转写数据要素 P01
```

- 工具目录：`Tools/transcribe/`（详见其中 [README.md](Tools/transcribe/README.md)）
- 引擎：`auto`（先 B 站字幕 API，无则 Whisper）、`whisper`、`bilinote`（导入 BiliNote 导出）
- 输出：`Downloads/transcripts/{BV号}/P01.srt` + Vault 笔记更新
- 无外挂字幕的课程需安装 **ffmpeg** + `pip install -r Tools/transcribe/requirements.txt`

## 推送到 GitHub

本地已 `git init` 并完成首次提交。推送需先登录 GitHub：

```powershell
D:\solidworks\Tools\gh\gh.exe auth login
```

登录后双击 `push-to-github.bat`，或执行 `push-to-github.ps1`，将自动创建公开仓库 `solidworks-obsidian-knowledge` 并推送。