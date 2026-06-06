---
title: 视频笔记索引
tags: [MOC, 视频笔记]
updated: 2026-06-06
---

# 视频笔记知识地图

## SolidWorks + AI 自动化

- [[BV1Yo5D6TEVk-总览]]
  - [[P01-图纸阅读与建模思路]]
  - [[P02-环境自动化准备]]
  - [[P03-API调用与参数确认]]
  - [[P04-参数化零件建模]]
  - [[P05-装配体标准件生成]]
  - [[P06-装配尝试与保存收尾]]
  - [[思维导图]]

## DSP 数字信号处理（西电教材配套）

- [[BV127411M7BU-总览]]（44 分 P，约 9h15m）
  - 第 1 章 离散信号与系统：[[P01-绪论]] → [[P09-模拟信号数字化]]
  - 第 2 章 z 变换：[[P10-序列傅里叶变换]] → [[P21-频响特性的几何确定法]]
  - 第 3 章 DFT：[[P22-离散傅里叶变换的定义]] → [[P28-频率域采样定理]]
  - 第 4 章 FFT：[[P29-时域抽取的基2FFT算法原理及运算流图]] · [[P30-频域抽取的基2-FFT算法原理及运算流图]]
  - 第 5 章 系统结构：[[P31-离散时间系统的模拟及基本原理]] → [[P33-信号流图]]
  - 第 6 章 IIR：[[P34-巴特沃斯模拟低通滤波器设计]] → [[P40-IIR滤波器的基本网络结构]]
  - 第 7 章 FIR：[[P41-FIR滤波器的基本原理]] → [[P44-频率采样法设计FIR滤波器]]
  - [[思维导图]]

## 进度

### SolidWorks

- [x] 拉取 B 站 API 元数据（`Tools/bilibili_api_data.json`）
- [x] 安装 bilibili-obsidian-notes + Node 抓取脚本（`Tools/bili-fetch/`）
- [x] P01–P06 写入结构化笔记（元数据增强，status: 已生成）
- [x] 更新总览与思维导图
- [x] 分 P 首帧封面截图（6 张，见 `06-资源附件/video-notes-images/`）
- [ ] Whisper 逐字转写（需 Python 3.9+、ffmpeg、约 3h 音频处理）
- [ ] 操作界面关键帧截图（需 ffmpeg + bilibili-obsidian-notes）

### DSP

- [x] 拉取 B 站 API 元数据（`Tools/BV127411M7BU-full.json`）
- [x] P01–P44 写入结构化笔记（元数据增强，status: 已生成）
- [x] 更新总览与思维导图
- [x] 分 P 封面（44 张，见 `06-资源附件/video-notes-images/BV127411M7BU-P*-cover.jpg`）
- [ ] Whisper 逐字转写（约 9h 音频，需 Python 3.9+、ffmpeg）
