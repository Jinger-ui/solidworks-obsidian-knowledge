/**
 * Generate tutorial detail objects for Princeton ECE524 RL course
 * Usage: node build-rl-tutorial-detail.js
 */
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'BV1r6cjeCEkW-full.json'), 'utf8'));

function shortTitle(part) {
  return part.replace(/^【\d+】\s*/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function theme(page) {
  if (page <= 3) return { name: 'MDP与动态规划', range: 'P01–P03' };
  if (page <= 5) return { name: '概率工具与集中不等式', range: 'P04–P05' };
  if (page === 6) return { name: '生成模型', range: 'P06' };
  if (page <= 11) return { name: '探索与Regret理论', range: 'P07–P11' };
  if (page === 12) return { name: '离线强化学习', range: 'P12' };
  if (page <= 17) return { name: '大状态空间与函数逼近', range: 'P13–P17' };
  if (page <= 20) return { name: '多智能体与博弈论', range: 'P18–P20' };
  return { name: '部分可观测RL', range: 'P21–P22' };
}

const examTips = {
  1: 'MDP 五元组、马尔可夫性、V^π/Q^π 定义、最优策略存在性',
  2: 'Bellman 期望/最优方程、压缩映射、贪婪最优策略构造',
  3: '值迭代与策略迭代、策略改进定理、VI/PI 复杂度',
  4: 'Hoeffding/Chernoff/Bernstein、Union bound、置信区间构造',
  5: '鞅定义、Azuma-Hoeffding、RL regret 分解中的鞅',
  6: 'MLE/EM/VAE、生成模型与 model-based RL/RLHF 联系',
  7: '探索-利用、regret 定义、R-Max/乐观主义、PAC 框架',
  8: 'MAB 形式化、UCB1 算法与 O(√KT log T) regret 证明思路',
  9: 'MDP 探索、UCBVI/R-Max、episodic regret 定义',
  10: 'MAB 问题依赖/minimax 下界、Fano/Le Cam 证明框架',
  11: 'MDP regret 下界、change-of-measure、与 UCBVI 上界对照',
  12: 'Offline RL、分布偏移、CQL/IQL/BCQ、coverage 条件',
  13: '维度灾难、线性 MDP、函数逼近、eluder dimension 预告',
  14: 'LSVI-UCB 算法、岭回归置信界、O(√d³H³K) regret',
  15: '大状态探索、eluder dim、PSRL、深度 vs 浅层探索',
  16: 'Bellman 误差、FQI、Deadly Triad、Bellman rank',
  17: '一般 F 上 UCB/Thompson、GOLF、reward-free exploration',
  18: 'MARL 设定、非平稳性、NE/CTDE、IQL 局限',
  19: '零和矩阵博弈、minimax 定理、no-regret→NE、CFR',
  20: '一般和 NE 多解、PoA、MADDPG、均衡计算复杂度',
  21: 'POMDP 七元组、belief 更新、belief MDP、POMCP',
  22: 'POMDP PSPACE 复杂度、PBVI/POMCP、Dec-POMDP、课程总结',
};

function buildDetail(page, part, prevPart, nextPart) {
  const th = theme(page);
  const exam = examTips[page] || '对照课程讲义与 Agarwal 教材';
  const st = shortTitle(part);
  const prev = prevPart ? shortTitle(prevPart) : null;
  const next = nextPart ? shortTitle(nextPart) : null;
  const total = data.parts.length;

  const mermaidMap = {
    1: `flowchart LR\n  S[状态 s] --> A[动作 a]\n  A --> P[转移 P(s'|s,a)]\n  P --> R[奖励 r]\n  R --> S\n  PI[策略 π(a|s)] --> A`,
    2: `flowchart TB\n  V[V^π 期望方程] --> Tπ[算子 T^π 压缩]\n  Vstar[V* 最优方程] --> Tstar[T* 算子]\n  Tstar --> Greedy[贪婪得 π*]`,
    3: `flowchart LR\n  VI[值迭代] --> Vstar[V*]\n  PI[策略迭代] --> Eval[策略评估]\n  Eval --> Improve[策略改进]\n  Improve --> PI`,
    8: `flowchart TB\n  UCB[UCB1] --> Bonus[μ̂ + √(2log t/N)]\n  Bonus --> Pull[选最大 UCB 臂]\n  Pull --> Reg[Regret O(√KT log T)]`,
    12: `flowchart LR\n  D[固定数据集 D] --> Shift[分布偏移]\n  Shift --> CQL[保守 Q 学习]\n  CQL --> Pi[部署策略 π]`,
    14: `flowchart TB\n  Phi[特征 φ(s,a)] --> Ridge[岭回归 w_h]\n  Ridge --> Bonus[UCB bonus]\n  Bonus --> Q[Q_h(s,a)]`,
    19: `flowchart LR\n  P1[玩家1 max] --> G[博弈值 v*]\n  P2[玩家2 min] --> G\n  G --> NE[纳什均衡]`,
    21: `flowchart TB\n  S[隐状态 s] --> O[观测 o]\n  O --> B[信念 b(s)]\n  B --> Pol[π(a|b)]\n  Pol --> A[动作 a]`,
  };

  return {
    position: `**模块**：${th.name}（${th.range}）· 系列第 **P${String(page).padStart(2, '0')}/${total}** 集。\n\n${prev ? `**建议前置**：[[P${String(page - 1).padStart(2, '0')}-${prev.replace(/[\\/:*?"<>|]/g, '')}]]——建立本集所需背景。` : '**系列起点**：建议先浏览 [[BV1r6cjeCEkW-总览]] 把握 22 讲路线图。'}\n\n${next ? `**建议后续**：[[P${String(page + 1).padStart(2, '0')}-${next.replace(/[\\/:*?"<>|]/g, '')}]]——在本集能力之上继续深入。` : '**系列终点**：回顾 [[思维导图]] 做全课复盘与自测。'}\n\n依赖主线：MDP/Bellman(P01–P03) → 概率工具(P04–P05) → 探索(P07–P11) → 离线(P12) → 函数逼近(P13–P17) → 博弈(P18–P20) → POMDP(P21–P22)。`,
    quickSummary: `**${st}** 是 Princeton ECE524 强化学习理论核心一讲。读完本节你应能：① 复述核心定义与定理；② 说明在探索/逼近/博弈链条中的位置；③ 完成一道典型推导或算法步骤。考试/面试侧重：**${exam}**。`,
    zeroBaseIntro: `本节「${st}」属于 **${th.name}**。Princeton **Chi Jin** 课程强调**可证明的样本复杂度与 regret**，而非仅算法启发式。即便未看视频，也应先建立「定义 → 算法/定理 → 证明 sketch → 与前后讲衔接」四层结构。\n\n第一遍盯住：本讲**解决什么问题**？**关键假设**（表格/线性 MDP/零和等）是什么？**结论的量级**（$\\sqrt{T}$、$d$ 依赖等）？第二遍对照课程讲义 PDF 补全证明细节。`,
    analogy: page <= 3
      ? 'MDP 像**带随机性的棋局规则**：状态是局面，动作是着法，奖励是胜负信号；Bellman 方程是「当前局面价值 = 即时收益 + 折扣后续最优价值」。'
      : page <= 5
        ? '集中不等式像**质检抽样**：有限样本均值离真值多远有概率界；鞅像**公平赌场**，给定历史下一步期望不赚不亏——RL 轨迹分析的基础。'
        : page <= 11
          ? '探索像**查字典**：不确定的词（臂/状态-动作）要多查几次；UCB 像「乐观估计 + 查得越少 bonus 越大」，逼你试不确定项。'
          : page <= 17
            ? '函数逼近像**用模板拟合地形**：不必记住每块砖（每个状态），用特征/神经网络泛化；但要防「模板在没数据处乱猜」（OOD）。'
            : page <= 20
              ? '多 agent 博弈像**交通路口**：每人自私选路可能全体变慢（NE 非最优）；零和像围棋，一人赢即一人输。'
              : 'POMDP 像**雾中开车**：看不见真实位置（状态），只有 GPS 漂移（观测），要在心里维护「可能在哪」的概率地图（belief）。',
    walkthrough: page <= 3
      ? `**Walkthrough：网格世界 MDP 手算**\n\n1. 定义 $S=\\{1,2,3\\}$（左、中、右），$A=\\{\\mathrm{L},\\mathrm{R}\\}$，目标在 3。\n2. 写 $P(s'|s,a)$：撞墙则 $s'=s$。\n3. 设 $\\gamma=0.9$，$r=1$ 仅 $s=3$。\n4. 对策略「总是向右」算 $V^\\pi$：解 Bellman 线性方程。\n5. 值迭代一步：$V_1(s)=\\max_a[r+\\gamma\\sum P V_0]$，观察收敛方向。`
      : page <= 5
        ? `**Walkthrough：Hoeffding 用于 MAB 置信界**\n\n1. 臂 $i$ 有界奖励 $[0,1]$，$n$ 次样本均值 $\\hat{\\mu}_i$。\n2. 令 $\\delta=0.05$，Hoeffding 得 $P(|\\hat{\\mu}_i-\\mu_i|\\ge\\epsilon)\\le 2e^{-2n\\epsilon^2}$。\n3. 令 RHS=$\\delta/K$，解 $\\epsilon=\\sqrt{\\log(2K/\\delta)/(2n)}$。\n4. 这就是 UCB bonus 的来源（P08）。\n5. 用 union bound 同时对所有臂成立。`
        : page <= 11
          ? `**Walkthrough：UCB1 一轮决策**\n\n1. $t=10$，臂 1: $\\hat{\\mu}_1=0.6,N_1=5$；臂 2: $\\hat{\\mu}_2=0.5,N_2=3$。\n2. UCB$_1=0.6+\\sqrt{2\\log 10/5}\\approx 0.6+0.96$。\n3. UCB$_2=0.5+\\sqrt{2\\log 10/3}\\approx 0.5+1.24$ → 选臂 2（探索 bonus 大）。\n4. 观测 $r_t$，更新 $\\hat{\\mu}_2,N_2$。\n5. 重复；证明次优臂期望拉次 $O(\\log T/\\Delta^2)$。`
          : page === 12
            ? `**Walkthrough：离线数据集诊断**\n\n1. 统计 $\\mathcal{D}$ 中 $(s,a)$ 覆盖：哪些状态动作 $<\\epsilon$ 频率？\n2. 估计行为策略 $\\hat{\\pi}_b(a|s)$（若未记录）。\n3. 训练 BC 基线，看验证集 imitation loss。\n4. 训练 CQL/IQL，比较 OOD 动作 Q 值是否被压低。\n5. OPE 用 importance sampling 粗估 $V^\\pi$，检查方差是否爆炸。`
            : page <= 17
              ? `**Walkthrough：Linear MDP 上 LSVI 一步**\n\n1. 给定 $\\phi(s,a)\\in\\mathbb{R}^d$，累积数据 $\\mathcal{D}_h$。\n2. 构造 $\\Lambda=\\sum\\phi\\phi^\\top+\\lambda I$，$\\hat{w}=\\Lambda^{-1}\\sum\\phi y$。\n3. $Q(s,a)=\\min\\{\\phi^\\top\\hat{w}+\\beta\\|\\phi\\|_{\\Lambda^{-1}},H-h+1\\}$。\n4. $\\pi_h(s)=\\arg\\max_a Q(s,a)$， rollout 收集新数据。\n5. 反向 $h=H\\ldots 1$ 重复；regret 界 $\\tilde{O}(\\sqrt{d^3H^3K})$。`
              : page <= 20
                ? `**Walkthrough：2×2 零和矩阵博弈**\n\n1. Payoff $A=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$（匹配硬币）。\n2. Minimax：P1 max min = P2 min max = 0.5。\n3. NE：双方各 0.5 混合。\n4. 若 P1 用 $(0.6,0.4)$，P2 best response 可 exploit。\n5. No-regret 学习平均策略收敛到 NE（P19 定理）。`
                : `**Walkthrough：Tiger POMDP 信念更新**\n\n1. 状态：虎左/虎右；动作：听、开左、开右。\n2. 听：得观测（左/右响）更新 $b$。\n3. $b(\\mathrm{tiger\\_left})=0.85$ 时开右期望 reward 高。\n4. 对比 memoryless $\\pi(a|o)$ 与 $\\pi(a|b)$ 性能差。\n5. POMCP 用粒子近似 $b$ 规划。`,
    misconceptions: `1. **「Q-learning 总能收敛」**：需表格+适当学习率；函数逼近+离策略可能发散（Deadly Triad）。\n2. **「探索就是多随机」**：$\\epsilon$-greedy 无 $\\sqrt{T}$ regret 保证；UCB/乐观主义才有理论界。\n3. **「离线 RL = 在线 RL 少交互」**：核心难在分布偏移，不是样本少而已。\n4. **「POMDP 用 LSTM 就等价最优 belief」**：记忆策略一般次优；belief 规划是理论最优基准。`,
    quiz: `1. **本讲核心考点？**  \n   **答**：${exam}。\n\n2. **本讲在 22 讲中的模块？**  \n   **答**：${th.name}（${th.range}）。\n\n3. **关键假设是什么？**  \n   **答**：${page <= 3 ? '有限 MDP、折扣 γ<1' : page <= 11 ? '有界奖励、episodic 或 stationary' : page <= 17 ? '线性 MDP 或函数类 F  realizability' : page <= 20 ? '有限玩家/动作、零和或一般和' : '有限 POMDP 或 belief 可计算'}。\n\n4. **与上/下讲关系？**  \n   **答**：${prev ? `承接「${prev}」` : '课程起点'}；${next ? `铺垫「${next}」` : '课程总结'}。\n\n5. **30 分钟复习计划？**  \n   **答**：速览 + 图解 + Walkthrough 手算一遍 + 自测 Q1/Q3。`,
    checklist: page <= 5
      ? `- [ ] 手推本讲 1 个核心方程（Bellman/Hoeffding/Azuma）\n- [ ] 对照 [Chi Jin 课程主页](https://sites.google.com/view/cjin/teaching/ece524) 讲义\n- [ ] 完成 Agarwal *RL: Theory and Algorithms* 对应章节习题 1 道\n- [ ] 在 Obsidian 画本讲概念图\n- [ ] 向同学 2 分钟口述本讲定理`
      : page <= 11
        ? `- [ ] 实现 UCB1 或 $\\epsilon$-greedy 在 Bernoulli MAB 上仿真\n- [ ] 绘制 regret 随 $T$ 对数图，与 $\\sqrt{T}$ 对照\n- [ ] 阅读 UCB 原始论文或 Agarwal 第 7–9 章\n- [ ] 完成 Walkthrough 数值例子\n- [ ] 总结「上界算法 vs 下界」各 1 条`
        : page <= 17
          ? `- [ ] 阅读 LSVI-UCB 原论文 Algorithm 1\n- [ ] 理解 ridge regression 置信界推导\n- [ ] 对比 tabular UCB 与 LSVI-UCB 复杂度（$S$ vs $d$）\n- [ ] 思考 deep RL 缺乏 regret 保证的原因\n- [ ] 完成 3 道自测题`
          : `- [ ] 解一个 2×2 矩阵博弈 NE\n- [ ] 阅读 POMDP 经典 Tiger/Labyrinth 例子\n- [ ] 了解 Dec-POMDP 与 CTDE 区别\n- [ ] 复盘 22 讲知识地图\n- [ ] 选 1 篇 Chi Jin 论文精读摘要`,
    furtherReading: page <= 3
      ? '- Sutton & Barto *Reinforcement Learning* Ch.3–4\n- Agarwal et al. *RL: Theory and Algorithms* Ch.1–2\n- [ECE524 课程主页](https://sites.google.com/view/cjin/teaching/ece524)'
      : page <= 5
        ? '- Vershynin *High-Dimensional Probability* 集中不等式章节\n- Agarwal Ch.2–3\n- MIT 6.436J 概率论复习'
        : page <= 11
          ? '- Lattimore & Szepesvári *Bandit Algorithms*\n- Agarwal Ch.7–9 (UCB/regret)\n- Auer et al. UCB1 原始论文'
          : page === 12
            ? '- Levine et al. Offline RL tutorial\n- Agarwal Ch.13\n- CQL / IQL 原论文'
            : page <= 17
              ? '- Jin et al. LSVI-UCB (ICML 2020)\n- Agarwal Ch.10–12\n- Russo & Van Roy eluder dimension'
              : '- Osborne & Rubinstein *Course in Game Theory*\n- Kaelbling et al. POMDP survey\n- Agarwal Ch.14–15 + MARL 综述',
    mermaid: mermaidMap[page] || `flowchart TD\n  IN[本讲输入] --> CORE[${st}]\n  CORE --> OUT[理论结论/算法]\n  CORE --> NEXT[衔接后续模块]`,
    extraDetail: page === 22
      ? `### 全课知识地图复盘\n\n| 模块 | 讲次 | 核心输出 |\n|------|------|----------|\n| MDP/规划 | P01–P03 | Bellman、VI/PI |\n| 概率 | P04–P05 | Hoeffding、鞅 |\n| 探索 | P07–P11 | UCB、regret 上下界 |\n| 离线 | P12 | coverage、保守 Q |\n| 逼近 | P13–P17 | LSVI-UCB、eluder |\n| 博弈 | P18–P20 | NE、minimax |\n| POMDP | P21–P22 | belief、POMCP |\n\n建议期末复习：每模块闭卷写 1 个定理陈述 + 1 个算法伪代码。`
      : `### 深化理解（${st}）\n\n**证明技巧**：本讲典型用 ${page <= 5 ? '压缩映射/集中不等式' : page <= 11 ? 'confidence bound + union bound + regret 分解' : page <= 17 ? '岭回归线性结构 + optimism' : '均衡存在性/复杂度归约'}。\n\n**与深度 RL 关系**：理论结果多针对 tabular/linear；PPO/DQN 等工程方法缺乏同样强的 regret 保证，但直觉（探索 bonus、target network 稳定）与理论平行。\n\n**作业建议**：从 [课程主页](https://sites.google.com/view/cjin/teaching/ece524) 下载 homework，将本笔记 Walkthrough 与 official solution 对照。`,
  };
}

const detailObj = {};
data.parts.forEach((p, idx) => {
  const prev = idx > 0 ? data.parts[idx - 1].part : null;
  const next = idx < data.parts.length - 1 ? data.parts[idx + 1].part : null;
  detailObj[p.page] = buildDetail(p.page, p.part, prev, next);
});

function serializeDetailModule(obj) {
  const keys = Object.keys(obj).sort((a, b) => Number(a) - Number(b));
  const parts = keys.map((k) => {
    const inner = Object.entries(obj[k])
      .map(([field, val]) => `    ${field}: ${JSON.stringify(val)},`)
      .join('\n');
    return `  ${k}: {\n${inner}\n  },`;
  });
  return `/** Princeton ECE524 RL 教程级深化 - build-rl-tutorial-detail.js */\nmodule.exports = {\n${parts.join('\n')}\n};\n`;
}

fs.writeFileSync(
  path.join(__dirname, 'content', 'rl-tutorial-detail.js'),
  serializeDetailModule(detailObj),
  'utf8'
);
console.log(`Wrote rl-tutorial-detail.js (${Object.keys(detailObj).length} pages)`);
