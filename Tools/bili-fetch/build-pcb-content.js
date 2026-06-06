/**
 * Build pcb-knowledge.js and pcb-tutorial-detail.js for BV1At421h7Ui
 * Usage: node build-pcb-content.js
 */
const fs = require('fs');
const path = require('path');

const BV = 'BV1At421h7Ui';
const MASTER_BV = 'BV1m441157T7'; // 大师篇独立合集（嘉立创EDA使用教程关联推荐）
const COURSE_URL = 'https://pan.quark.cn/s/05650fad6466';
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', `${BV}-full.json`), 'utf8'));

function shortTitle(part) {
  return part
    .replace(/^【入门篇】\d+-/, '')
    .replace(/^【强化篇】\d+-/, '')
    .replace(/^开场白：/, '开场白-')
    .trim();
}

function getTheme(page) {
  if (page <= 2) return { id: 'intro', name: '课程导览', range: 'P01–P02' };
  if (page <= 8) return { id: 'circuit', name: '电路分析基础', range: 'P03–P08' };
  if (page <= 12) return { id: 'pcb_base', name: 'PCB设计基础', range: 'P09–P12' };
  if (page <= 17) return { id: 'eda', name: '嘉立创EDA操作', range: 'P13–P17' };
  if (page <= 24) return { id: 'mcu51', name: '51核心板实战', range: 'P18–P24' };
  return { id: 'usb_hub', name: 'USB拓展坞实战', range: 'P25–P29' };
}

const examTips = {
  1: 'PCB 设计全流程概览、入门篇/强化篇/大师篇学习路线、课程资料获取',
  2: '三篇课程结构、学习前置（高中物理+基本电脑操作）、配套资料用法',
  3: 'PCB 从单面板到 HDI 的演进、IPC 标准、国内 EDA 生态（嘉立创/JLC）',
  4: '电阻/电容/电感符号与实物、阻容串并联、RC 时间常数、去耦电容选型',
  5: '二极管整流/稳压、三极管开关与放大、MOS 管开关特性、ESD 保护管',
  6: 'Datasheet 结构、Absolute Maximum/电气特性表、封装页、选型决策树',
  7: '欧姆定律、基尔霍夫 KCL/KVL、戴维南/诺顿、叠加定理在原理图中的应用',
  8: '网络标号、电源树、模块分区阅读法、常见接口电路（UART/SPI/I2C）',
  9: 'PCB 四层结构（阻焊/丝印/铜箔/基材）、焊盘/过孔/铜皮、1oz 铜厚含义',
  10: '2/4 层叠层、信号层-地层配对、阻抗控制、嘉立创默认叠层参数',
  11: '原理图符号 vs PCB 封装、Footprint 焊盘编号、3D 模型、库管理',
  12: '需求→原理图→封装→布局→布线→DRC→Gerber 全流程、设计评审节点',
  13: 'lceda.cn 下载、专业版 vs 标准版、账号与工程云同步',
  14: '原理图/PCB 编辑器、左侧库面板、右侧属性、底部 DRC/网络、快捷键',
  15: '设计规则（线宽/间距/过孔）、栅格、单位 mil/mm、图纸尺寸与原点',
  16: '符号工具栏、引脚编号/类型、IEEE 规范、多部件符号、库保存路径',
  17: '焊盘编辑器、SMD/THT 封装、IPC-7351 焊盘、 courtyard 与丝印框',
  18: 'STC89C52、11.0592MHz 晶振、CH340G USB转串、AMS1117-3.3、复位电路',
  19: '5V→3.3V LDO、去耦电容布局原则、晶振负载电容计算、最小系统连线',
  20: 'LED/按键/排针、USB 接口、DRC 电气规则、未连接引脚、ERC 报错处理',
  21: '功能分区布局、晶振靠近 MCU、电源入口、去耦电容紧贴 VCC/GND、散热',
  22: '3W 原则、45°/蛇形走线、差分对等长、电源线加粗、回流路径最短',
  23: '顶层/底层布线、过孔扇出、GND 铺铜、电源分割、USB 差分 90Ω',
  24: '丝印位号规范、DRC 全项检查、钻孔表、Gerber+钻孔+坐标+BOM 导出',
  25: 'CH334R USB Hub、Type-C 接口、ESD、晶振、LDO、接口保护器件选型',
  26: 'USB2.0 Hub 拓扑、CC 电阻、差分对布线预留、电源分配、原理图模块化',
  27: 'USB 口靠边放置、Hub IC 居中、去耦电容环绕、差分对间距等长预留',
  28: 'USB DP/DM 差分 90Ω、等长匹配、过孔数量控制、地参考完整性',
  29: 'USB 板 DRC、阻焊桥检查、拼板说明、JLC 下单参数核对',
};

const knowledgeSections = {
  1: `### 1. 为什么要学 PCB 设计

**印刷电路板**（Printed Circuit Board, PCB）是电子产品的「骨骼与血管」：元器件焊在焊盘上，铜箔走线传递电源与信号。会画 PCB，才能把「电路想法」变成可制造、可调试的实物。

本课程由 **Expert电子实验室（国一学长）** 主讲，使用 **嘉立创 EDA 专业版**（国产、免费、与嘉立创打板无缝衔接），面向**零基础**学员。

### 2. 课程三篇结构

| 篇章 | 分 P 范围 | 核心目标 |
|------|----------|----------|
| **入门篇** | P02–P12（对应课程 1–11 讲） | 电路基础 + PCB 概念 + 设计流程 |
| **强化篇** | P13–P29（对应课程 12–28 讲） | EDA 实操 + 51 核心板 + USB 拓展坞 |
| **大师篇** | 独立合集 | 高速/多层/复杂项目（见总览备注） |

### 3. 学习产出

学完本 BV 的 29 讲，你应能独立完成：
- 51 单片机最小系统板（电源、晶振、复位、USB 下载）
- USB 2.0 拓展坞（Hub 芯片、Type-C、差分布线）

### 4. 配套资料

课程资料（原理图工程、封装库、BOM）：[夸克网盘](${COURSE_URL})

建议：每讲完一集，用资料包中对应工程在嘉立创 EDA 中打开对照。

### 5. 工具链准备

- 电脑：Windows 10+（本课程演示环境）
- 软件：嘉立创 EDA 专业版（P13 详讲安装）
- 可选：万用表、电烙铁（焊接验证阶段）`,

  2: `### 1. 课程定位与受众

本课程假设你具备**高中物理**电学基础（电压、电流、电阻），会使用电脑，但**从未画过 PCB**。不讲深奥射频理论，重在**能画、能下单、能焊接调试**。

### 2. 三篇学习顺序

**不可跳过入门篇**：P04–P08 电路基础是读原理图的钥匙；P09–P12 PCB 概念是后面布局布线的语言。

**强化篇分两项目**：
1. **51 核心板**（P18–P24）：经典 8 位 MCU，电路简单，练熟全流程
2. **USB 拓展坞**（P25–P29）：接口电路 + 差分布线，进阶

**大师篇**：独立 BV，讲解多层板、高速信号等，本 BV 学完后再进入。

### 3. 推荐学习节奏

| 周次 | 内容 | 时间投入 |
|------|------|----------|
| 第 1 周 | P01–P08 电路基础 | 每天 1–2 集 |
| 第 2 周 | P09–P17 EDA 操作 | 边学边跟画 |
| 第 3–4 周 | P18–P24 51 板全流程 | 完成一块实物 |
| 第 5 周 | P25–P29 USB 板 | 进阶布线 |

### 4. 资料包使用方法

资料包内含：示例工程、封装库、BOM 表、原理图 PDF。建议流程：
1. 先看视频理解步骤
2. 暂停视频，在 EDA 中复现操作
3. 对比资料包工程查缺补漏

### 5. 嘉立创 EDA 专业版优势

- 国产自主，中文界面
- 与嘉立创 PCB/SMT 下单数据直连
- 专业版支持复杂规则、3D 预览、团队协作

### 6. 学前准备清单

| 项目 | 要求 | 备注 |
|------|------|------|
| 操作系统 | Windows 10+ | 课程演示环境 |
| 浏览器 | Chrome/Edge 最新版 | 在线版 EDA |
| 磁盘空间 | ≥ 2 GB | 客户端+工程 |
| 基础知识 | 高中物理电学 | 电压电流电阻 |
| 可选硬件 | 电烙铁+万用表 | P24 后焊接验证 |`,

  3: `### 1. PCB 诞生简史

**1950 年代**：电子管时代用点对点焊接，体积大、可靠性差。

**1960 年代**：印制电路技术成熟——在绝缘基板上腐蚀出铜箔走线，元器件穿孔焊接（**THT，通孔插件**）。

**1990 年代**：**SMT 表面贴装**成为主流，元器件变小、自动化贴片。

**2000 年代至今**：多层板、HDI（高密度互连）、柔性板、刚柔结合板普及；手机主板可达 10+ 层。

### 2. 关键里程碑

| 年代 | 技术 | 影响 |
|------|------|------|
| 1980s | 双层板普及 | 成本下降，消费电子爆发 |
| 1990s | 四层板 + SMT | 电脑主板复杂化 |
| 2000s | 无铅焊、RoHS | 环保法规驱动工艺变革 |
| 2010s | HDI + 微盲孔 | 智能手机超薄化 |
| 2020s | 国产 EDA 崛起 | 嘉立创、华大等降低入门门槛 |

### 3. 行业标准 IPC

**IPC**（Association Connecting Electronics Industries）制定 PCB 设计与可制造性标准：
- **IPC-2221**：通用 PCB 设计标准
- **IPC-7351**：焊盘图形标准（封装设计必查）
- **IPC-A-600**：PCB 验收标准

嘉立创默认工艺参数对齐 IPC Class 2（一般电子产品）。

### 4. 国内 EDA 与制造生态

**嘉立创**形成「EDA 设计 → PCB 打样 → SMT 贴片 → 元器件商城」闭环：
- 设计用嘉立创 EDA 专业版
- 下单用嘉立创 PCB（5 元 10 片促销）
- 元件用立创商城 LCSC

这是本课程选型的核心原因：**学完即可低成本打样验证**。

### 5. 从设计到实物流程预览

\`\`\`
需求分析 → 原理图 → 封装 → PCB布局 → 布线 → DRC → Gerber → 打样 → 焊接 → 调试
\`\`\`

后续 P12 会展开每一步；P18 起用真实项目走通。`,
};

// Generate remaining knowledge via template
function buildKnowledge(page, part) {
  if (knowledgeSections[page]) return knowledgeSections[page];

  const st = shortTitle(part);
  const th = getTheme(page);
  const exam = examTips[page] || st;

  const edaBlock = page >= 13 ? `
### 嘉立创 EDA 专业版操作要点

| 菜单/功能 | 路径 | 本集用途 |
|----------|------|----------|
| 设计规则 | 设计 → 设计规则 | 线宽、间距、过孔 |
| DRC | 工具 → DRC | 电气/间距检查 |
| 铺铜 | 放置 → 铺铜 | 地平面、电源 |
| 导出 Gerber | 制造 → 输出 Gerber | 打样文件 |
| 库管理 | 左侧库面板 | 符号/封装搜索与放置 |

快捷键建议：\`V\` 选择、\`W\` 连线、\`P\` 放置、\`G\` 栅格切换。` : '';

  const projectBlock = page >= 18 && page <= 24 ? `
### 51 单片机核心板工程要点

- **MCU**：STC89C52RC（51 内核，DIP-40 或 LQFP-44）
- **时钟**：11.0592 MHz 晶振 + 30pF 负载电容 ×2
- **复位**：10kΩ 上拉 + 10μF 电解 + 复位按键
- **电源**：USB 5V 输入 → AMS1117-3.3 → MCU VCC
- **去耦**：0.1μF 陶瓷电容紧靠 MCU 每对 VCC/GND
- **下载**：CH340G USB-UART，DTR 接 RST 实现自动下载` : '';

  const usbBlock = page >= 25 ? `
### USB 拓展坞工程要点

- **Hub IC**：CH334R（4 口 USB2.0 Hub）
- **接口**：USB Type-C（CC 下拉 5.1kΩ）
- **差分**：DP/DM 90Ω 阻抗，等长 ±5 mil
- **ESD**：USBLC6-2SC6 等 TVS 保护
- **电源**：5V 2A 输入，Hub 自供电或总线供电模式` : '';

  return `### 1. 本集主题：${st}

本集归属 **${th.name}**（${th.range}），是 Expert电子实验室嘉立创 EDA 保姆级课程的第 **P${String(page).padStart(2, '0')}** 集。

**实践/考试侧重**：${exam}

### 2. 核心知识框架

#### 2.1 概念定义

${getConceptText(page, st)}

#### 2.2 设计/分析步骤

${getStepsText(page, st)}

#### 2.3 元件选型要点

${getSelectionText(page)}

### 3. 硬件实操清单

${getHardwareChecklist(page)}

${edaBlock}
${projectBlock}
${usbBlock}

### 4. 与前后课程衔接

${getBridgeText(page, th)}

### 5. 常见参数速查

${getParamTable(page)}

### 6. 实操拓展与验收

${getPracticeExpand(page, st)}

> **学习提示**：本集建议打开课程资料包对应工程，在嘉立创 EDA 专业版中同步操作。遇到 DRC 报错先查「设计规则」与「网络标号」是否一致。`;
}

function getPracticeExpand(page, st) {
  const map = {
    1: '**今日行动**：浏览 [[BV1At421h7Ui-总览]] 与 [[思维导图]]，安装嘉立创 EDA 专业版（P13 详讲），从夸克盘下载资料包。**验收**：能说出入门/强化/大师三篇各学什么。',
    2: '**今日行动**：制定 4 周学习计划表，标记每天目标 P 编号。**验收**：能向他人介绍课程结构、资料包内容、所需软件与硬件。',
    7: '**练习**：任选一段简单串并联电路，用 KVL/KCL 列方程求电流。**验收**：能解释戴维南等效在「电源模块简化」中的作用。',
    8: '**练习**：打开资料包 51 原理图 PDF，按电源树→MCU→外围顺序标出 5 个模块。**验收**：看到网络标号 `VCC_3V3` 知道对应 3.3V 供电域。',
    10: '**练习**：在嘉立创下单页查看 2 层/4 层板工艺说明，记录默认铜厚与最小线宽。**验收**：能画出 4 层板叠层草图并标注各层作用。',
    11: '**练习**：在立创商城找一个 0603 电阻，对比其 Symbol 引脚数与 Footprint 焊盘数。**验收**：能解释「封装名不一致导致 PCB 焊盘错位」的原因。',
    12: '**练习**：用流程图写出你理解的 8 步设计流程，标注每步输入输出。**验收**：能说明为何「先 DRC 再 Gerber」不可颠倒。',
  };
  return map[page] || `**本集练习**：暂停视频，在笔记「Walkthrough」节逐步打勾；完成后用文末 3 道自测题检验。**验收标准**：能独立复述「${st}」3 个关键要点，并在 EDA 或草稿纸完成 1 项小练习。`;
}

function getConceptText(page, st) {
  const map = {
    4: '**电阻**（Ω）：阻碍电流，分压分流。**电容**（F）：隔直通交，储能滤波，电源去耦。**电感**（H）：隔交通直，储能，电源滤波。阻容串联构成 RC 低通/高通；阻感 RL 电路时间常数 τ=L/R。',
    5: '**二极管**：单向导电，用于整流、防反接、ESD。**三极管（BJT）**：电流控制电流，作开关或放大。**场效应管（MOS）**：电压控制电流，开关速度快、驱动简单，现代数字电路主流。',
    6: '**Datasheet** 是元器件的「说明书」：Pin Definition（引脚）、Absolute Maximum Ratings（极限参数）、Recommended Operating Conditions（工作条件）、Typical Application（典型电路）、Package（封装尺寸）。',
    7: '**欧姆定律**：V=IR。**KCL**：节点电流代数和为零。**KVL**：回路电压代数和为零。**戴维南**：任意线性网络可等效为电压源+电阻。**叠加定理**：多电源分别作用时响应叠加。',
    8: '原理图用**符号**表示元件，**导线**表示电气连接（同网络标号即连通）。阅读顺序：电源树 → 主芯片 → 外围电路 → 接口。**模块化**：电源块、时钟块、复位块、通信块。',
    9: 'PCB 由**基材**（FR-4 玻璃纤维）、**铜箔层**（导电）、**阻焊层**（绿油，防焊）、**丝印层**（白字标识）组成。**焊盘**（Pad）用于焊接；**过孔**（Via）连接不同层；**铜皮**（Pour）提供低阻抗回流。',
    10: '**叠层**（Stackup）定义各铜层顺序与介质厚度。典型 2 层：Top 信号 + Bottom 信号/地。典型 4 层：Top 信号 / GND / Power / Bottom 信号。层间介质影响**阻抗**与**串扰**。',
    11: '**原理图符号**（Symbol）表达引脚逻辑功能；**PCB 封装**（Footprint）表达物理焊盘与尺寸。二者通过**封装名**绑定。焊盘编号必须与符号引脚编号一一对应，否则 DRC 报错或焊接失败。',
    12: '标准流程：**需求分析** → **原理图设计** → **封装确认** → **PCB 布局** → **布线** → **DRC 检查** → **丝印整理** → **Gerber 导出** → **打样** → **焊接调试**。每步设评审节点，避免错误传递到下游。',
    13: '嘉立创 EDA 专业版从 lceda.cn 下载，需注册账号。支持 Windows/macOS/Linux。工程文件云端同步，可团队协作。与标准版相比，专业版支持更复杂设计规则、3D 预览、更多层数。',
    14: '界面分区：**顶部菜单栏**（文件/编辑/设计/工具）、**左侧库与工程树**、**中央画布**（原理图或 PCB）、**右侧属性面板**、**底部状态栏**（坐标/网格/DRC 结果）。',
    15: '**设计规则**（Design Rules）定义：最小线宽、线间距、过孔孔径/焊盘、铜皮间距。**栅格**（Grid）辅助对齐，原理图常用 10mil，PCB 常用 5mil/1mil。**单位**建议 PCB 用 mil（1mil=0.0254mm）。',
    16: '绘制符号：定义引脚编号、名称、电气类型（输入/输出/电源/地）。遵循 IEEE 315 或国标 GB/T 4728。多部件符号（如 74HC00 四与非门）用 Part A/B/C/D 区分。',
    17: '封装绘制：在**焊盘编辑器**中定义焊盘形状（圆形/矩形/手指）、尺寸、钻孔。SMD 焊盘查 IPC-7351；THT 焊盘 = 孔径 + 环形焊盘。**丝印框**标示元件外形，**Courtyard** 定义占位区域。',
    18: '51 板核心器件：STC89C52（Flash 51）、11.0592MHz 晶振（串口波特率整除）、CH340G（USB 转 UART）、AMS1117-3.3（LDO 稳压）、USB Type-A 或 Mini/Micro 母座。',
    19: '电源树：VBUS 5V → AMS1117-IN → OUT 3.3V → MCU VCC。输入电容 10μF + 0.1μF；输出电容 10μF + 0.1μF。晶振靠近 XTAL 引脚，负载电容 15–33pF 按晶振规格计算：C_load = 2×(C_L - C_stray)。',
    20: '外围：LED+限流电阻（1kΩ）、按键上拉、排针 ISP/USB 接口。原理图完成后运行 **ERC**（电气规则检查）和 **DRC**：未连接网络、单节点网络、电源短路等。',
    21: '布局原则：**功能分区**（电源区/数字区/接口区）、**晶振紧靠 MCU**（<10mm）、**去耦电容紧贴 VCC 引脚**、**接口靠边**、**热源分散**。先放主芯片，再放大器件，最后放小电容电阻。',
    22: '布线三原则：**最短**（减小寄生参数）、**最直**（避免锐角，用 45° 或圆弧）、**最宽**（电源/地线加粗）。电源线 > 信号线宽度；模拟与数字地单点连接或完整地平面。',
    23: '51 板布线：顶层走信号，底层铺地。晶振下方不走线（避免耦合）。USB 差分若存在按 90Ω 控制。过孔扇出 BGA/QFP 密脚芯片。铺铜连接所有 GND 焊盘，降低回流阻抗。',
    24: '丝印：位号清晰不压在焊盘上，极性标识（电解电容+、LED 方向）。DRC 全部通过后再导出：**Gerber**（各层图形）、**钻孔文件**、**坐标文件**（SMT）、**BOM**（贴片）。嘉立创下单选层数、厚度、阻焊颜色。',
    25: 'USB Hub 选型：CH334R（4 端口 USB2.0，内置晶振）、CH340 可共用。Type-C 需 CC1/CC2 各 5.1kΩ 下拉（UFP 设备）。TVS 选 USBLC6 系列；保险丝或 PTC 过流保护。',
    26: 'Hub 拓扑：上游口 ← CH334 ← 4 下游口。每下游口独立电源分配与去耦。CC 配置决定 Type-C 角色。原理图分模块：电源、Hub 核心、Type-C×N、LED 指示。',
    27: 'USB 板布局：Type-C 座板边，ESD 紧靠连接器，Hub IC 居中，晶振靠近 XI/XO，各端口去耦 0.1μF+10μF。差分对相邻端口注意隔离，避免串扰。',
    28: 'USB2.0 差分阻抗 90Ω ±10%：线宽/间距/参考地距离由叠层决定。嘉立创 2 层板可用计算工具或经验值（约 6/6 mil）。等长：同一对 DP/DM 长度差 < 5 mil；组间可略差。',
    29: '终检：DRC 零错误、阻焊桥（SMD 相邻焊盘）、最小线宽/孔径符合嘉立创工艺（6/6 mil 常规）。导出后 Gerber 查看器复核各层。下单备注：板厚 1.6mm、铜厚 1oz、阻焊绿色。',
  };
  return map[page] || `围绕「${st}」建立概念—操作—验证三层理解，结合课程资料包中的示例工程对照学习。`;
}

function getStepsText(page, st) {
  if (page >= 18) {
    return `1. 打开课程资料工程或新建工程\n2. 按本集主题完成对应设计步骤\n3. 运行 DRC/ERC 并修复全部告警\n4. 与资料包参考工程 diff 对照\n5. 记录参数（线宽、过孔、电容值）备查`;
  }
  if (page >= 13) {
    return `1. 启动嘉立创 EDA 专业版，打开/新建工程\n2. 按视频步骤定位菜单项（设计/放置/工具）\n3. 修改参数后在画布验证效果\n4. 保存工程并同步云端\n5. 截图关键界面存入 Obsidian 笔记`;
  }
  return `1. 阅读本集「核心知识框架」\n2. 观看视频对应段落（见对照表）\n3. 用自测题检验理解\n4. 在下一集实操前完成 Checklist`;
}

function getSelectionText(page) {
  const map = {
    4: '电阻：0603/0805 贴片或 1/4W 直插；精度 1% 通用。电容：0.1μF 去耦选 X7R 陶瓷；电解注意耐压 ≥ 2× 工作电压。电感：电源滤波选屏蔽电感，注意饱和电流。',
    5: '二极管：1N4148 开关、1N4007 整流、SS34 肖特基（低压降）。三极管：2N3904 NPN 通用。MOS：2N7002 小信号 N 沟道，逻辑电平驱动。',
    6: '选型顺序：电气参数 → 封装 → 供货/价格 → 参考设计。立创商城搜索型号，对比库存与数据手册一致性。',
    18: 'MCU：STC89C52RC-35I（工业级温度）。LDO：AMS1117-3.3 SOT-223。CH340G SSOP-20。晶振：11.0592MHz HC-49S 或 3225 贴片。',
    25: 'CH334R QFN-24；Type-C 16P 沉板座；USBLC6-2SC6 SOT-23-6；27MHz 无源晶振（Hub 内置时可外置备用）。',
  };
  return map[page] || '优先选立创商城有货、嘉立创 EDA 库内置封装的型号，缩短设计周期。';
}

function getHardwareChecklist(page) {
  if (page >= 23) return '- [ ] 完成本集布线/导出操作\n- [ ] DRC 零错误截图存档\n- [ ] 核对 BOM 与商城料号\n- [ ] 记录线宽/过孔/铜厚参数';
  if (page >= 18) return '- [ ] 在 EDA 中打开 51/USB 工程\n- [ ] 完成本集原理图或 PCB 步骤\n- [ ] ERC/DRC 检查\n- [ ] 与资料包工程对比';
  if (page >= 13) return '- [ ] 安装/打开嘉立创 EDA 专业版\n- [ ] 跟随视频完成菜单操作\n- [ ] 保存工程文件\n- [ ] 试快捷键 V/W/P';
  return '- [ ] 通读本集笔记\n- [ ] 对照视频 1 遍\n- [ ] 完成自测题\n- [ ] 预习下一集主题';
}

function getBridgeText(page, th) {
  const prev = page > 1 ? `承接 P${String(page - 1).padStart(2, '0')} 内容，` : '作为 ';
  const next = page < 29 ? `为 P${String(page + 1).padStart(2, '0')} 铺垫。` : '完成强化篇全部实战。';
  return `${prev}${th.name}模块核心环节，${next}大师篇（独立合集）将进阶高速与多层设计。`;
}

function getParamTable(page) {
  const tables = {
    4: '| 元件 | 典型符号 | 常用单位 | 贴片封装 |\n|------|----------|----------|----------|\n| 电阻 | R | Ω/kΩ | 0603/0805 |\n| 电容 | C | pF/nF/μF | 0603/0805 |\n| 电感 | L | nH/μH | 0805/1210 |',
    9: '| 层 | 材料 | 作用 |\n|----|------|------|\n| 丝印 | 油墨 | 位号/标识 |\n| 阻焊 | 绿油 | 防焊 |\n| 铜箔 | 铜 | 走线/铺铜 |\n| 基材 | FR-4 | 机械支撑 |',
    10: '| 层数 | 典型结构 | 适用 |\n|------|----------|------|\n| 2 层 | Top+Bottom | 入门/简单板 |\n| 4 层 | Sig-GND-PWR-Sig | MCU/接口板 |\n| 6 层+ | 高速/密集 | 大师篇 |',
    15: '| 规则项 | 嘉立创常规 | 备注 |\n|--------|------------|------|\n| 最小线宽 | 6 mil | 更低需加价 |\n| 线间距 | 6 mil | |\n| 过孔 | 0.3/0.6 mm | 孔/焊盘 |',
    22: '| 网络类型 | 建议线宽 | 备注 |\n|----------|----------|------|\n| 电源 5V/3.3V | 20–40 mil | 按电流 |\n| 信号 | 8–10 mil | 默认 |\n| USB 差分 | 按阻抗 | 90Ω |',
  };
  return tables[page] || '| 参数 | 典型值 | 说明 |\n|------|--------|------|\n| 板厚 | 1.6 mm | 常用 |\n| 铜厚 | 1 oz | 35μm |';
}

function buildDetail(page, part, prevPart, nextPart) {
  const th = getTheme(page);
  const exam = examTips[page] || shortTitle(part);
  const st = shortTitle(part);
  const prev = prevPart ? shortTitle(prevPart) : null;
  const next = nextPart ? shortTitle(nextPart) : null;
  const total = data.parts.length;

  const analogies = {
    intro: 'PCB 设计像**城市规划**：原理图是功能分区图纸，布局是用地规划，布线是道路网络，DRC 是消防验收。',
    circuit: '电路基础像**学字母再组词**：电阻电容是字母，RC 电路是单词，原理图是文章。',
    pcb_base: 'PCB 叠层像**三明治**：每层有分工，信号层是馅料，地平面是面包片夹住 EMI。',
    eda: '嘉立创 EDA 像**国产 Photoshop**：图层=铜层，画笔=走线，滤镜=DRC 检查。',
    mcu51: '51 核心板像**电子入门驾照**：电路简单、资料多、焊完能亮灯能下载程序。',
    usb_hub: 'USB 拓展坞像**高速公路枢纽**：差分对是快车道，要等长、少弯道、少收费站（过孔）。',
  };

  const mermaidMap = {
    1: 'flowchart LR\n  A[入门篇] --> B[强化篇]\n  B --> C[大师篇]\n  C --> D[独立项目]',
    4: 'flowchart TB\n  R[电阻] --> RC[RC电路]\n  C[电容] --> RC\n  L[电感] --> RL[RL电路]',
    8: 'flowchart TB\n  PWR[电源树] --> MCU[主芯片]\n  MCU --> IO[接口电路]\n  MCU --> CLK[时钟复位]',
    9: 'flowchart TB\n  TOP[顶层铜] --> CORE[FR4基材]\n  BOT[底层铜] --> CORE\n  TOP --> MASK[阻焊]\n  MASK --> SILK[丝印]',
    12: 'flowchart LR\n  REQ[需求] --> SCH[原理图]\n  SCH --> PCB[布局布线]\n  PCB --> DRC[DRC]\n  DRC --> GER[Gerber]',
    14: 'flowchart TB\n  MENU[菜单栏] --> CANVAS[画布]\n  LIB[库面板] --> CANVAS\n  CANVAS --> PROP[属性面板]',
    19: 'flowchart LR\n  USB[5V] --> LDO[AMS1117]\n  LDO --> MCU[STC89C52]\n  XTAL[晶振] --> MCU',
    22: 'flowchart TB\n  W1[最短] --> ROUTE[布线原则]\n  W2[最直] --> ROUTE\n  W3[最宽] --> ROUTE',
    26: 'flowchart TB\n  TPC[Type-C] --> HUB[CH334R]\n  HUB --> P1[端口1]\n  HUB --> P2[端口2]',
    28: 'flowchart LR\n  DP[DP] --- DM[DM]\n  DP --> Z[90Ω阻抗]\n  DM --> Z\n  Z --> LEN[等长匹配]',
  };

  return {
    position: `**模块**：${th.name}（${th.range}）· 系列第 **P${String(page).padStart(2, '0')}/${total}** 集。\n\n${prev ? `**建议前置**：学完「${prev}」再读本集。` : '**系列起点**：建议先浏览 [[BV1At421h7Ui-总览]]。'}\n\n${next ? `**建议后续**：继续「${next}」。` : '**强化篇终点**：可进入大师篇独立合集进阶。'}\n\n主线：电路基础(P03–P08) → PCB概念(P09–P12) → EDA操作(P13–P17) → 51板(P18–P24) → USB板(P25–P29)。`,
    quickSummary: `**${st}** 是本课程关键一讲。读完应能：① 复述核心概念与参数；② 在嘉立创 EDA 中完成对应操作；③ 通过自测题检验。侧重：**${exam}**。`,
    zeroBaseIntro: `本节「${st}」属于 **${th.name}**。国一学长课程强调**动手跟画**，本笔记补齐文字细节与菜单路径，便于暂停视频时查阅。\n\n第一遍：理解概念框架；第二遍：打开 EDA 跟操作；第三遍：对照资料包工程查缺补漏。`,
    analogy: analogies[th.id] || analogies.eda,
    walkthrough: buildWalkthrough(page, st),
    misconceptions: buildMisconceptions(page, th),
    quiz: buildQuiz(page, st, exam),
    checklist: buildChecklist(page, th),
    furtherReading: buildReading(page, th),
    mermaid: mermaidMap[page] || `flowchart TD\n  IN[输入] --> P${page}[${st}]\n  P${page} --> OUT[PCB产出]`,
    extraDetail: buildExtra(page, st),
    videoMap: buildVideoMap(st, page),
  };
}

function buildWalkthrough(page, st) {
  if (page >= 18 && page <= 24) {
    return `**Walkthrough：51 核心板本集操作**\n\n1. 打开资料包 51 工程（嘉立创 EDA 专业版）\n2. 定位本集对应页面（原理图/PCB）\n3. 按视频步骤复现：${st}\n4. 运行 DRC，记录报错类型与修复方法\n5. 截图保存关键界面到 Obsidian`;
  }
  if (page >= 25) {
    return `**Walkthrough：USB 拓展坞本集操作**\n\n1. 打开 USB Hub 工程\n2. 本集任务：${st}\n3. 重点关注差分对与电源分配\n4. DRC 零错误后导出预览 Gerber\n5. 核对 Type-C CC 电阻与 Hub 供电模式`;
  }
  if (page >= 13) {
    return `**Walkthrough：嘉立创 EDA 界面操作**\n\n1. 启动专业版，登录账号\n2. 菜单路径：设计 → 设计规则（或本集主题菜单）\n3. 修改参数，观察画布变化\n4. 快捷键练习：V 选择、W 连线、Delete 删除\n5. 保存工程到云端`;
  }
  return `**Walkthrough：理论到实践**\n\n1. 阅读本集「详细讲解」建立概念\n2. 观看视频前 40% 确认定义\n3. 用自测题 1/3 检验理解\n4. 在下一集 EDA 课程中落地操作\n5. 整理术语表到 Obsidian`;
}

function buildMisconceptions(page, th) {
  const common = [
    '**「看懂原理图 = 会画 PCB」**：还需封装、布局、布线、DRC、工艺规则，本课程 P13 起系统训练。',
    '**「仿真通过就不用 DRC」**：DRC 检查制造规则，仿真检查电气功能，二者互补。',
    '**「地线随便连」**：高频/USB 项目地回流路径决定信号质量，需完整地平面。',
  ];
  const extra = {
    4: '**「电容越大越好」**：去耦电容需按频段搭配（0.1μF + 10μF），过大电容影响上电速度。',
    10: '**「层数越多越好」**：2 层板能完成的入门项目不必强行 4 层，成本和工艺复杂度上升。',
    17: '**「封装能画小就好」**：焊盘必须满足 IPC-7351，过小导致焊接不良。',
    22: '**「90° 直角走线一定不行」**：低频入门板影响小，但好习惯从 45° 开始；高速板必须避免。',
    28: '**「差分等长 = 绝对等长」**：USB2.0 允许 ±5 mil 对内误差，过度蛇形增加寄生电容。',
  };
  const list = [...common.slice(0, 2), extra[page] || common[2], common[2]].map((m, i) => `${i + 1}. ${m}`).join('\n');
  return list;
}

function buildQuiz(page, st, exam) {
  return `1. **本集核心考点？**  \n   **答**：${exam}。\n\n2. **本集属于哪个模块？**  \n   **答**：${getTheme(page).name}（${getTheme(page).range}）。\n\n3. **嘉立创 EDA 相关菜单？**  \n   **答**：见「详细讲解」EDA 操作表；本集重点为 ${st} 对应菜单项。\n\n4. **一项实操验收标准？**  \n   **答**：${page >= 13 ? 'DRC/ERC 无错误，工程可保存打开' : '能口述核心概念并完成自测'}。\n\n5. **30 分钟复习计划？**  \n   **答**：速览 + 图解 + Walkthrough 跟做一遍 + 自测 Q1/Q3。`;
}

function buildChecklist(page, th) {
  if (page >= 13) {
    return `- [ ] 打开嘉立创 EDA 专业版并登录\n- [ ] 完成本集 Walkthrough 步骤\n- [ ] 运行 DRC/ERC 并截图\n- [ ] 下载/打开[课程资料](${COURSE_URL})\n- [ ] 记录 1 个仍不懂的菜单项`;
  }
  return `- [ ] 通读笔记「详细讲解」\n- [ ] 对照视频确认 1 处演示细节\n- [ ] 完成 3 道自测题\n- [ ] 预习下一集主题\n- [ ] 在 Obsidian 更新学习进度`;
}

function buildReading(page, th) {
  const base = `- [嘉立创 EDA 专业版文档](https://prodocs.lceda.cn/)\n- [立创商城](https://www.szlcsc.com/)\n- [课程资料夸克盘](${COURSE_URL})\n`;
  const extra = {
    circuit: '- 《模拟电子技术基础》电阻电容电感章节\n- 元件数据手册阅读指南（本课程 P06）',
    pcb_base: '- IPC-2221 设计标准导读\n- 嘉立创 PCB 工艺说明',
    eda: '- 嘉立创 EDA 专业版快捷键列表\n- IPC-7351 焊盘标准',
    mcu51: '- STC89C52 数据手册\n- CH340G 应用笔记',
    usb_hub: '- USB 2.0 规范摘要\n- CH334R 数据手册与参考设计',
  };
  return base + (extra[th.id] || '- 本系列前后分 P 交叉引用');
}

function buildExtra(page, st) {
  const edaTip = page >= 13
    ? '**EDA 技巧**：原理图与 PCB 使用同一工程；修改封装后务必「更新 PCB」同步；规则修改后全板 DRC 复检。'
    : '**预习 EDA**：P13 前可先行注册 lceda.cn 账号，熟悉浏览器/客户端安装方式，减少上手摩擦。';
  return `### 深化理解（${st}）\n\n**工程经验**：入门板优先 2 层 1.6mm 1oz 工艺，线宽线距 6/6 mil，成本低、嘉立创免费打样友好。电源网络线宽按电流估算：1A 约需 20–40 mil（视铜厚与温升）。\n\n${edaTip}\n\n**与大师篇衔接**：本 BV 强化篇完成后，可学习大师篇合集（[${MASTER_BV}](https://www.bilibili.com/video/${MASTER_BV})）中的高速、多层与复杂项目设计。\n\n**资料同步**：每集操作与[夸克资料包](${COURSE_URL})工程编号对应，建议 Obsidian 记录每版 DRC 截图与 BOM 变更。`;
}

function buildVideoMap(st, page) {
  const p = data.parts.find((x) => x.page === page);
  const dur = p ? p.duration_fmt : '本集';
  return `| 视频段落（约） | 预期演示内容 | 笔记对应章节 |
|-------------|------------|------------|
| 开篇 0%–15% | 本集目标与回顾 | 本节位置、3 分钟速览 |
| 前段 15%–40% | 核心概念/原理图讲解 | 零基础导读、详细讲解 |
| 中段 40%–70% | EDA 实操演示 | 图解、Walkthrough |
| 后段 70%–90% | 易错点、参数总结 | 常见误区、Checklist |
| 收尾 90%–100% | 总结与下集预告 | 延伸阅读、自测题 |

> 本集总时长约 **${dur}**。视频含内嵌中文字幕，API 无外挂字幕轨；以画面操作为主对照。`;
}

// Build knowledge object
const knowledge = {};
const tutorialDetail = {};
data.parts.forEach((p, idx) => {
  knowledge[p.page] = buildKnowledge(p.page, p.part);
  tutorialDetail[p.page] = buildDetail(
    p.page,
    p.part,
    idx > 0 ? data.parts[idx - 1].part : null,
    idx < data.parts.length - 1 ? data.parts[idx + 1].part : null
  );
});

const knowledgeOut = `/** Expert电子实验室 嘉立创EDA PCB课程 P01-P29 知识点 */\nmodule.exports = ${JSON.stringify(knowledge, null, 2)};\n`;
const detailOut = `/** BV1At421h7Ui 教程级深化 */\nmodule.exports = ${JSON.stringify(tutorialDetail, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, 'content', 'pcb-knowledge.js'), knowledgeOut, 'utf8');
fs.writeFileSync(path.join(__dirname, 'content', 'pcb-tutorial-detail.js'), detailOut, 'utf8');
console.log(`Built pcb-knowledge.js (${Object.keys(knowledge).length} pages)`);
console.log(`Built pcb-tutorial-detail.js (${Object.keys(tutorialDetail).length} pages)`);
