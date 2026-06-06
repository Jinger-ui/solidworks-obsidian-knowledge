/** Princeton ECE524 强化学习理论基础 P01-P22 知识点 */
module.exports = {
  1: `### 1. 马尔可夫决策过程（MDP）的形式化

**马尔可夫决策过程**（Markov Decision Process, MDP）是强化学习的数学基础，五元组记为 $(\\mathcal{S}, \\mathcal{A}, P, r, \\gamma)$：

| 符号 | 含义 |
|------|------|
| $\\mathcal{S}$ | 状态空间 |
| $\\mathcal{A}$ | 动作空间（可依赖状态：$\\mathcal{A}(s)$） |
| $P(s'|s,a)$ | 转移概率，满足马尔可夫性：未来只依赖当前 $(s,a)$ |
| $r(s,a)$ 或 $r(s,a,s')$ | 即时奖励 |
| $\\gamma \\in [0,1)$ | 折扣因子，权衡即时与长期回报 |

**马尔可夫性**：$P(s_{t+1}|s_t,a_t,s_{t-1},\\ldots)=P(s_{t+1}|s_t,a_t)$。这使「当前状态」成为充分统计量，无需完整历史。

### 2. 策略与轨迹

**策略** $\\pi$ 是从状态到动作分布的映射：$\\pi(a|s)=P(a_t=a|s_t=s)$。

- **确定性策略**：$a=\\pi(s)$
- **随机策略**：在探索或博弈中常见

在策略 $\\pi$ 下，系统产生**轨迹** $\\tau=(s_0,a_0,r_0,s_1,a_1,\\ldots)$。初始状态 $s_0$ 可能来自分布 $\\mu_0$。

### 3. 回报与价值函数

**有限步回报**：$G_t=\\sum_{k=0}^{H-1}\\gamma^k r_{t+k}$（$H$ 为 horizon）。

**无限折扣回报**：$G_t=\\sum_{k=0}^{\\infty}\\gamma^k r_{t+k}$（需 $\\gamma<1$ 且奖励有界以保证收敛）。

**状态价值函数**：
$$V^\\pi(s)=\\mathbb{E}_\\pi\\left[\\sum_{t=0}^{\\infty}\\gamma^t r(s_t,a_t)\\mid s_0=s\\right]$$

**动作价值函数（Q 函数）**：
$$Q^\\pi(s,a)=\\mathbb{E}_\\pi\\left[\\sum_{t=0}^{\\infty}\\gamma^t r(s_t,a_t)\\mid s_0=s,a_0=a\\right]$$

关系：$V^\\pi(s)=\\sum_a\\pi(a|s)Q^\\pi(s,a)$，$Q^\\pi(s,a)=r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)V^\\pi(s')$。

### 4. 最优策略

**最优价值**：$V^*(s)=\\sup_\\pi V^\\pi(s)$，$Q^*(s,a)=\\sup_\\pi Q^\\pi(s,a)$。

若存在策略 $\\pi^*$ 使 $V^{\\pi^*}(s)=V^*(s)$ 对所有 $s$ 成立，则称 $\\pi^*$ 为**最优策略**。有限 MDP 在折扣设定下最优策略存在（至少为确定性策略）。

### 5. 建模实例

**网格世界**：机器人格子移动，撞墙不动，到达目标得 +1。状态=坐标，动作=上下左右。

**库存管理**：状态=库存量，动作=订货量，奖励=销售利润−持有成本−缺货惩罚。

建模要点：状态要**可观测且马尔可夫**；奖励要反映真实目标；$\\gamma$ 反映决策时间尺度。

### 6. 与后续课程衔接

P02 将导出 Bellman 方程；P03 在已知 $P,r$ 时做**规划**（动态规划）；P07 起讨论**未知模型**下的探索与学习。`,

  2: `### 1. Bellman 期望方程

对任意策略 $\\pi$，价值函数满足**递归关系**（Bellman expectation equation）：

$$V^\\pi(s)=\\sum_a\\pi(a|s)\\left[r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)V^\\pi(s')\\right]$$

矩阵形式：$V^\\pi=r^\\pi+\\gamma P^\\pi V^\\pi$，即 $(I-\\gamma P^\\pi)V^\\pi=r^\\pi$。当 $\\gamma<1$ 且 $|S|$ 有限时，$V^\\pi$ 唯一且可写为 $V^\\pi=(I-\\gamma P^\\pi)^{-1}r^\\pi$。

Q 函数形式：
$$Q^\\pi(s,a)=r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)\\sum_{a'}\\pi(a'|s')Q^\\pi(s',a')$$

### 2. Bellman 最优方程

最优价值满足**Bellman optimality equation**：

$$V^*(s)=\\max_a\\left[r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)V^*(s')\\right]$$

$$Q^*(s,a)=r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)\\max_{a'}Q^*(s',a')$$

这是**非线性**方程组（因 $\\max$），但仍是压缩映射，存在唯一不动点 $V^*$。

### 3. 最优策略的构造

**贪婪策略**（greedy w.r.t. $Q$）：
$$\\pi^*(s)=\\arg\\max_a Q^*(s,a)$$

在有限 MDP 中，对 $Q^*$ 贪婪即得最优确定性策略。

### 4. 压缩映射与收敛

定义 Bellman 算子 $(\\mathcal{T}^\\pi V)(s)=r^\\pi(s)+\\gamma P^\\pi V(s)$。则 $\\|\\mathcal{T}^\\pi V-\\mathcal{T}^\\pi U\\|_\\infty\\le\\gamma\\|V-U\\|_\\infty$，为 $\\gamma$-**压缩**。由 Banach 不动点定理，迭代 $V_{k+1}=\\mathcal{T}^\\pi V_k$ 收敛到 $V^\\pi$。

最优算子 $\\mathcal{T}^*$ 同理，支撑值迭代（P03）。

### 5. 优势函数与 TD 误差

**优势函数**：$A^\\pi(s,a)=Q^\\pi(s,a)-V^\\pi(s)$，衡量动作相对平均水平的优劣。

**TD 误差**（时序差分）：$\\delta_t=r_t+\\gamma V(s_{t+1})-V(s_t)$，是 Bellman 残差的无偏样本，连接 P03 规划与后续 RL 算法。

### 6. 证明思路（考试向）

证明 $V^\\pi$ 满足 Bellman 期望方程：对轨迹期望做一步展开，利用马尔可夫性与全期望公式。最优方程：对任意 $\\pi$ 有 $V^\\pi\\le V^*$，且存在 $\\pi^*$ 达到等号。`,

  3: `### 1. 规划问题设定

**规划**（Planning）：在 MDP 模型 $(P,r)$ **已知**时，求最优策略或 $V^*$。与**学习**（Learning）相对——后者需从交互数据估计模型或价值。

本讲核心算法：**值迭代**（Value Iteration, VI）、**策略迭代**（Policy Iteration, PI）、**截断式动态规划**。

### 2. 值迭代（Value Iteration）

反复应用 Bellman 最优算子：
$$V_{k+1}(s)=\\max_a\\left[r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)V_k(s')\\right]$$

**收敛性**：$\\|V_{k+1}-V^*\\|_\\infty\\le\\gamma\\|V_k-V^*\\|_\\infty$，线性速率 $\\gamma$。实践中当 $\\|V_{k+1}-V_k\\|_\\infty<\\epsilon$ 停止。

**策略提取**：收敛后 $\\pi(s)=\\arg\\max_a[r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)V(s')]$。

### 3. 策略迭代（Policy Iteration）

交替两步直至策略不变：

1. **策略评估**：解 $(I-\\gamma P^\\pi)V^\\pi=r^\\pi$（或迭代至收敛）
2. **策略改进**：$\\pi'(s)=\\arg\\max_a Q^{\\pi}(s,a)$

**策略改进定理**：若 $\\pi'$ 对 $V^\\pi$ 贪婪，则 $V^{\\pi'}\\ge V^\\pi$（分量-wise），严格不等除非 $\\pi$ 已最优。

**有限性**：有限 MDP 上策略空间有限，PI 在有限步内收敛到最优（通常远少于 $|S|^{|A|}$ 次迭代）。

### 4. 复杂度与比较

| 算法 | 每轮代价 | 迭代次数 | 备注 |
|------|----------|----------|------|
| VI | $O(|S|^2|A|)$ | $O(\\log(1/\\epsilon)/\\log(1/\\gamma))$ | 实现简单 |
| PI | 评估 $O(|S|^3)$ 或迭代 | 通常很少 | 中小规模极快 |

**Modified PI**：评估只做 $m$ 步 Bellman 更新再改进，折中 VI 与 PI。

### 5. 截断 horizon 与折扣

有限步 $H$ 时可用向后归纳（backward induction）。折扣 $\\gamma$ 等价于以概率 $1-\\gamma$ 每步终止的随机 horizon，连接 episodic 与 continuing 任务。

### 6. 从规划到 RL

真实 RL 中 $P,r$ 未知，**蒙特卡洛**与 **TD 学习**可看作用样本近似 Bellman 备份。P07 起在**无模型**且需**探索**时，样本效率成为核心（regret 分析）。`,

  4: `### 1. 为什么 RL 理论需要集中不等式

强化学习是**随机过程上的优化**：奖励、转移、策略采样都是随机的。要证明算法以高概率接近最优，必须控制**经验均值与期望的偏差**——集中不等式（Concentration Inequalities）是 P05 鞅方法、P08 UCB、P10–P11 下界证明的基础工具。

### 2. 马尔可夫不等式

若 $X\\ge 0$ 且 $\\mathbb{E}[X]=\\mu$，则对 $t>0$：
$$P(X\\ge t)\\le\\frac{\\mu}{t}$$

弱但仅需一阶矩，常作第一步放缩。

### 3. Chebyshev 与 Hoeffding

**Chebyshev**：$P(|X-\\mu|\\ge t)\\le\\mathrm{Var}(X)/t^2$。

**Hoeffding**（有界独立和）：设 $X_i\\in[a_i,b_i]$ 独立，$S=\\sum X_i$，则
$$P(S-\\mathbb{E}[S]\\ge t)\\le\\exp\\left(-\\frac{2t^2}{\\sum(b_i-a_i)^2}\\right)$$

对称界对 $S-\\mathbb{E}[S]\\le -t$ 同样成立。RL 中用于有界奖励的回报估计。

### 4. Chernoff / Bernstein 界

**Chernoff**：独立 Bernoulli 或 sub-Gaussian 和的尾概率指数衰减。

**Bernstein**：同时利用方差与有界性，样本量 $n$ 大时更紧：
$$P\\left(\\left|\\frac{1}{n}\\sum X_i-\\mu\\right|\\ge\\epsilon\\right)\\le 2\\exp\\left(-\\frac{n\\epsilon^2}{2\\sigma^2+2M\\epsilon/3}\\right)$$

### 5. Union Bound 与置信区间

对 $K$ 个事件同时成立：$P(\\cup E_i)\\le\\sum P(E_i)$。在 MAB 中应对 $K$ 个臂的均值估计同时成立，导致 **$\\sqrt{\\log K}$** 或 **$\\log K$** 因子（见 P08 UCB  bonus）。

**置信上界**构造：以 $\\hat{\\mu}+c\\sqrt{\\log(1/\\delta)/n}$ 作为真均值以概率 $1-\\delta$ 的上界——UCB 算法核心。

### 6. 在 RL 中的典型用法

- 估计 $Q(s,a)$ 或模型 $\\hat{P}(\\cdot|s,a)$ 的误差界
- 证明探索算法 $O(\\sqrt{T})$ 或 $O(\\log T)$ regret
- 样本复杂度：达到 $\\epsilon$-最优所需交互步数

下一讲 P05 将引入**鞅**（Martingale），处理**非独立**但适应滤下的随机和（如 RL 轨迹中的增量）。`,

  5: `### 1. 鞅的定义

随机过程 $\\{M_t\\}_{t\\ge 0}$ 关于滤 $\\{\\mathcal{F}_t\\}$ 是**鞅**，若：

1. $M_t$ 可积
2. $\\mathbb{E}[M_{t+1}|\\mathcal{F}_t]=M_t$（条件期望不变）

**直观**：公平博弈——给定历史，下一步期望增量为零。RL 中 TD 误差在适当条件下近似鞅差分序列。

**上鞅/下鞅**：分别对应超公平/亚公平博弈。

### 2. 停时与可选停时定理

**停时** $\\tau$：是否在时刻 $t$ 停止仅依赖 $\\mathcal{F}_t$。可选停时定理（OST）：在条件下 $\\mathbb{E}[M_\\tau]=\\mathbb{E}[M_0]$。

用于分析「何时停止探索」、episodic 终止时刻的期望。

### 3. Azuma-Hoeffding 不等式

若 $\\{M_t\\}$ 是鞅且 $|M_{t+1}-M_t|\\le c_t$ a.s.，则
$$P(M_T-M_0\\ge t)\\le\\exp\\left(-\\frac{t^2}{2\\sum_{i=0}^{T-1}c_i^2}\\right)$$

适用于**有界鞅差分**，比独立 Hoeffding 更弱假设（允许依赖，只要鞅结构成立）。

### 4. Freedman 不等式

结合方差信息的鞅集中界，样本依赖结构下常比 Azuma 更紧。在分析 stochastic approximation 与 TD 学习稳定性时出现。

### 5. 鞅在 RL 证明中的角色

**Regret 分解**：将累积 regret 写为鞅 + 可预测增量之和，鞅部分用集中界控制。

**UCB/乐观主义**：构造「乐观价值」过程，证明其不超过真最优值（上鞅性质）或低估可控。

**自归一化界**：如 Bernstein 型鞅界，$\\sum \\epsilon_t$ 的方差随数据自适应——大状态空间分析（P13–P17）的关键。

### 6. 与 P04 的关系

| 工具 | 适用结构 |
|------|----------|
| Hoeffding/Chernoff | 独立或 sub-Gaussian 和 |
| Azuma/Freedman | 鞅差分、自适应采样 |
| Union bound | 多臂/多状态同时置信 |

掌握鞅语言后，P08 UCB 的 regret 证明、P11 MDP 下界中的信息论论证将更易跟进。`,

  6: `### 1. 生成模型回顾

**生成模型**学习数据分布 $p(x)$ 或条件分布 $p(x|z)$。经典方法：GMM、HMM、变分自编码器（VAE）、扩散模型、自回归 Transformer（GPT 类）。

**与 RL 的交叉**：策略可视为条件生成 $\\pi(a|s)$；世界模型学习 $p(s'|s,a)$ 用于**模型-based RL**；模仿学习用生成模型拟合专家分布。

### 2. 最大似然与 EM

**MLE**：$\\hat{\\theta}=\\arg\\max_\\theta\\sum_i\\log p_\\theta(x_i)$。

**EM 算法**（隐变量 $z$）：E 步算 $Q(\\theta|\\theta^{old})=\\mathbb{E}_{z|x,\\theta^{old}}[\\log p(x,z|\\theta)]$；M 步最大化 $Q$。HMM、GMM 训练标准流程。

### 3. 变分推断

后验 $p(z|x)$ 难算时，引入 $q_\\phi(z|x)$ 最小化 $\\mathrm{KL}(q\\|p(\\cdot|x))$，等价最大化 **ELBO**：
$$\\mathcal{L}(\\phi,\\theta)=\\mathbb{E}_{q_\\phi}[\\log p_\\theta(x|z)]-\\mathrm{KL}(q_\\phi(z|x)\\|p(z))$$

VAE 用神经网络参数化 $q, p$，重参数化技巧使梯度可回传。

### 4. 扩散模型（概念）

前向加噪 $q(x_t|x_{t-1})$，学习反向去噪 $p_\\theta(x_{t-1}|x_t)$。采样从噪声逐步生成数据。ChatGPT/多模态时代，**生成式 AI** 与 RLHF（人类反馈强化学习）结合：用 RL 优化生成策略以符合偏好。

### 5. 生成模型 → RL 的桥梁

| 方向 | 说明 |
|------|------|
| Model-based RL | 学 $p(s'|s,a)$，在模型内规划 |
| 策略参数化 | $\\pi_\\theta(a|s)$ 为条件密度（高斯、分类） |
| RLHF | 奖励模型 + PPO 微调 LLM |
| 世界模型 | Dreamer 等：潜空间生成 + 想象 rollout |

### 6. 本讲在课程中的位置

ECE524 在探索理论（P07–P11）前插入生成模型，强调现代 ML（深度学习、生成式 AI）与 RL 理论对话。后续函数逼近（P13–P17）将用**神经网络**作 $V,Q$ 的 approximator，与生成模型共享优化与泛化议题。`,

  7: `### 1. 探索–利用困境

智能体必须在**利用**（选当前估计最优动作）与**探索**（试未知动作以改善估计）间权衡。纯贪婪可能永远错过最优臂（MAB）或次优状态（MDP）。

**Regret**（遗憾）：$\\mathrm{Regret}(T)=T\\mu^*-\\sum_{t=1}^T r_t$，或相对最优策略的累积差距。目标：证明 $\\mathrm{Regret}(T)=\\tilde{O}(\\sqrt{T})$ 或更好。

### 2. 已知模型 vs 未知模型

P03 **规划**假设 $P,r$ 已知；**RL** 需在线交互估计。探索策略分类：

- **随机探索**：$\\epsilon$-greedy，简单但样本效率低
- **乐观主义**：乐观面对不确定性（UCB、R-Max）
- **信息导向**：最大化信息增益（较少用于大规模）
- **Thompson 采样**：贝叶斯后验采样

### 3. 表格 MDP 中的探索

**R-Max**：对访问不足 $(s,a)$ 乐观设 $r=R_{\\max}$，$P$ 指向高价值未访问状态，激励探索。

**乐观初始化**：$Q(s,a)$ 初值设高，早期自然探索。

**PAC 框架**：以概率 $1-\\delta$ 在多项式步内找到 $\\epsilon$-最优策略。

### 4. 样本复杂度

达到 $(\\epsilon,\\delta)$-PAC 所需步数 $T(\\epsilon,\\delta,S,A)$。下界（P11）与上界（UCBVI 等）刻画**本质难度**。

### 5. 与 MAB 的关系

**多臂老虎机**（P08）：无状态，$K$ 个臂，每臂奖励分布未知。MDP 可视为「有状态的多臂」——状态转移耦合时间步，分析更难（P09、P11）。

### 6. 学习路径

P08 详述 UCB 与 MAB regret；P09 推广到 RL；P10–P11 给出**下界**证明探索无法更快。`,

  8: `### 1. 多臂老虎机（MAB）形式化

$K$ 个臂，臂 $i$ 奖励 $X_{i,t}\\sim\\nu_i$，均值 $\\mu_i$。每步选臂 $I_t$，观测 $r_t=X_{I_t,t}$。目标：最小化 regret
$$\\mathrm{Regret}(T)=T\\max_i\\mu_i-\\mathbb{E}\\left[\\sum_{t=1}^T r_t\\right]$$

**最优**：$\\mu^*=\\max_i\\mu_i$，最优臂 $i^*$。

### 2. 探索策略

**均匀探索**：每臂 $\\Theta(T/K)$ 次，regret $\\Theta(T)$，仅作 baseline。

**$\\epsilon$-greedy**：以 $\\epsilon$ 随机，$1-\\epsilon$ 选 $\\hat{\\mu}$ 最大臂；需 $\\epsilon_t\\to 0$ 且 $\\sum\\epsilon_t=\\infty$ 才渐近最优，regret 次优。

**Elimination**：维护活跃臂集，剔除显著次优臂。

### 3. UCB1 算法

选臂 $I_t=\\arg\\max_i\\left(\\hat{\\mu}_i+\\sqrt{\\frac{2\\log t}{N_i(t)}}\\right)$，$N_i(t)$ 为臂 $i$ 被拉次数。

**直觉**：**置信上界**（Upper Confidence Bound）——乐观估计 + 不确定性 bonus $\\propto 1/\\sqrt{N_i}$。

**Regret 界**（有界奖励）：$\\mathrm{Regret}(T)=O(\\sqrt{KT\\log T})$，问题依赖最优 $O(\\sqrt{KT\\log T})$ 量级。

### 4. 证明 sketch

1. 用 Hoeffding（P04）构造 $\\hat{\\mu}_i$ 的置信区间
2. Union bound 对所有臂、所有 $t$ 同时成立（或 peeling）
3. 次优臂被拉当且仅当 UCB 超过 $\\mu^*$，概率随 $N_i$ 指数衰减
4. 期望拉次 $\\mathbb{E}[N_i(T)]=O(\\log T/\\Delta_i^2)$，$\\Delta_i=\\mu^*-\\mu_i$

### 5. 变体

- **UCB-V**：用方差改进 bonus
- **KL-UCB**：Bernoulli 臂用 KL 散度界，渐近最优
- **Thompson Sampling**：$O(\\sqrt{KT\\log T})$ 问题依赖界

### 6. 通向 RL（P09）

MAB 无状态；RL 中每状态面临「臂集合」$\\mathcal{A}(s)$，且动作影响未来状态——需**乐观 Q 值**或**计数-based bonus** 在状态–动作对上。`,

  9: `### 1. RL 中的探索问题

在未知 MDP 中，智能体需学习 $Q^*$ 或 $\\pi^*$。与 MAB 不同：**动作改变状态分布**，错误探索的后果会传播（credit assignment + non-stationarity of data）。

**Episodic vs Continuing**：episodic 每回合重置，regret 常按回合数 $K$ 计；continuing 按步数 $T$ 计。

### 2. 乐观主义原则

**Optimism in the Face of Uncertainty**：对不确定的 $(s,a)$ 使用**乐观**价值估计，优先访问可能最优的区域。

**UCBVI / UCB-H**：在值迭代形式上加 bonus $b(s,a)\\propto\\sqrt{\\log(SAT)/N(s,a)}$，得 $\\tilde{O}(\\sqrt{H^3 SAT})$ regret（$H$ 为 episode 长度）。

**R-Max / UCRL**：对少见 $(s,a)$ 设乐观模型，多项式 PAC 样本复杂度。

### 3. 探索 bonus 设计

| 方法 | Bonus 形式 | 特点 |
|------|------------|------|
| 计数 | $1/\\sqrt{N(s,a)}$ | 简单，大状态空间难扩展 |
| 不确定性 | 基于模型置信区间宽度 | UCRL2 |
| 随机 | 随机网络 distillation | 深度 RL 启发式 |

### 4. Regret 定义（MDP）

$$\\mathrm{Regret}(K)=\\sum_{k=1}^K\\left(V^*(s_1^k)-V^{\\pi_k}(s_1^k)\\right)$$

目标 $\\tilde{O}(\\sqrt{K})$ 或 $\\tilde{O}(\\sqrt{T})$。与 P11 下界匹配（至多差 $\\log$ 因子）。

### 5. 与规划（P03）对比

规划用精确 Bellman 备份；RL 用**样本备份** + **探索**。样本效率 = 达到相同 $\\epsilon$ 最优所需交互量，是 RL 理论核心指标。

### 6. 实践联系

Deep Q-Network 用 $\\epsilon$-greedy；Rainbow 等加 prioritized replay。理论 UCB 类方法在表格/小离散空间可证；连续/大空间需函数逼近（P13–P17）重新处理探索。`,

  10: `### 1. 为何需要下界

上界（UCB regret $O(\\sqrt{KT\\log T})$）说明算法**足够好**。下界证明**任何**算法在 worst-case 或 problem-dependent 意义下不能更快——刻画问题**本质难度**，指导算法设计是否最优。

### 2. MAB 问题依赖下界

对 $K$ 臂、次优间隙 $\\Delta_i=\\mu^*-\\mu_i$，任何算法满足：
$$\\liminf_{T\\to\\infty}\\frac{\\mathrm{Regret}(T)}{\\log T}\\ge\\sum_{i:\\Delta_i>0}\\frac{\\Delta_i}{\\mathrm{KL}(\\nu_i\\|\\nu^*)}$$

（Lai-Robbins 型；Bernoulli 臂有闭式）。说明 **$\\log T$ 因子不可省**（问题依赖意义）。

### 3. Minimax 下界

存在分布族使任何算法的 regret 至少 $\\Omega(\\sqrt{KT})$（有限 $T$）。证明常用：

1. **假设检验**：区分「某臂最优」与「另一臂最优」需足够样本
2. **Le Cam / Fano**：减少到二元假设，用 KL 或总变差距离
3. **随机化 adversary**：对手在 hard 实例上随机选参数

### 4. 证明框架（Fano 不等式）

设 $\\mathcal{H}$ 为 $M$ 个假设，算法观测 $T$ 步数据。若 $\\mathrm{KL}(P_i\\|P_j)\\le\\alpha$，则错误概率下界 $\\ge 1-\\frac{\\alpha+\\log 2}{\\log M}$。选 $M$ 个「相近」奖励分布，使算法无法快速识别最优臂 → $\\sqrt{T}$  regret。

### 5. 与 UCB 上界对照

| 量纲 | 上界 (UCB1) | 下界 |
|------|-------------|------|
| 问题依赖 | $O(\\sum \\log T/\\Delta_i)$ | $\\Omega(\\sum \\log T/\\Delta_i)$ |
| Minimax | $O(\\sqrt{KT\\log T})$ | $\\Omega(\\sqrt{KT})$ |

UCB 在 minimax 意义下几乎最优（差 $\\log$ 因子）。

### 6. 过渡到 MDP（P11）

MAB 是 MDP 退化（单状态）。MDP 下界引入 **$S,A,H$**（或直径 $D$），证明 $\\Omega(\\sqrt{H^2 SAT})$ 或 $\\Omega(\\sqrt{D^2 AT})$ 类结果，与 UCBVI 上界呼应。`,

  11: `### 1. MDP Regret 下界设定

Episodic MDP：$H$ 步回合，$S$ 状态，$A$ 动作，初始 $s_1$ 固定或从 $\\mu$ 采样。$K$ 个 episode 的累积 regret 下界常表为 $\\Omega(\\sqrt{H^2 SAK})$ 或含 $\\log$ 因子。

**直径 $D$**：在任意策略下从任意状态到任意状态的最短期望步数上界，影响 regret 与 sample complexity。

### 2. 信息论论证

智能体每步至多获得 $O(\\log A)$ bit 关于最优动作的信息（观测奖励+转移）。要在 $S$ 个状态各识别最优需 $\\Omega(SA)$ 量级「信息预算」，累积 $K$ 步 → regret 至少 $\\Omega(\\sqrt{SAK})$ 量级（启发式；严格证明用 change-of-measure）。

### 3. Change-of-Measure 技巧

构造两个 MDP $M_1,M_2$：转移/奖励仅在某 $(s,a)$ 略有不同，最优策略随之不同。若算法 $T$ 步内 regret 小，则无法区分 $M_1$ vs $M_2$ → KL 散度约束 → $T$ 必须足够大。

### 4. 与上界算法匹配

**UCBVI、Euler、UCB-H** 等达到 $\\tilde{O}(\\sqrt{H^2 SAK})$ regret，与下界差 $\\tilde{O}(\\sqrt{H\\log S})$ 等 polylog 因子，称 **minimax optimal**（近最优）。

### 5. PAC 样本复杂度下界

找到 $\\epsilon$-最优策略所需样本 $\\Omega(SA/\\epsilon^2)$（依赖参数化）。与 R-Max、UCRL 上界多项式样本对应。

### 6. 课程意义

P08–P09 给出**可证好的算法**；P10–P11 证明**不能更好**（在 worst case）。完整理解 RL 探索 = 上界算法 + 下界 + 问题结构（gap、 diameter）如何改善常数。`,

  12: `### 1. 离线强化学习（Offline RL / Batch RL）

**设定**：给定固定数据集 $\\mathcal{D}=\\{(s,a,r,s')\\}$，由**行为策略** $\\pi_b$（可能未知）收集，**不再**与环境交互。目标：学出策略 $\\pi$ 使 $V^\\pi$ 接近 $V^*$。

**动机**：医疗、自动驾驶、推荐——仅历史日志，在线探索成本高或危险。

### 2. 分布偏移（Distributional Shift）

训练数据覆盖 $(s,a)$ 由 $\\pi_b$ 决定；部署时 $\\pi$ 可能访问 **OOD**（out-of-distribution）$(s,a)$，$Q$ 估计外推误差爆炸——**外推误差**是 offline RL 核心难点。

**支撑集**：$\\mathrm{supp}(\\pi)\\subseteq\\mathrm{supp}(\\pi_b)$ 时较安全；否则需保守方法。

### 3. 主要方法

| 方法 | 思想 |
|------|------|
| BC | 行为克隆，模仿 $\\pi_b$，无 reward 利用 |
| CQL | 惩罚 OOD 动作的 Q 值，保守估计 |
| IQL | 期望分位数回归，避免查询 OOD 动作 |
| BCQ | 仅允许接近行为策略的动作 |
| MOReL | 学惩罚模型，未知区域低 reward |

### 4. 理论议题

**Coverage 条件**：$\\frac{d^{\\pi^*}(s,a)}{d^{\\pi_b}(s,a)}\\le C$（ concentrability）时部分算法可证 PAC。无 coverage 则 information-theoretically impossible。

**Off-policy evaluation (OPE)**：用 $\\mathcal{D}$ 估计 $V^\\pi$，重要性采样 $\\frac{\\pi(a|s)}{\\pi_b(a|s)}$ 方差大，需 doubly robust 等。

### 5. 与在线 RL 对比

| | 在线 RL | 离线 RL |
|---|---------|---------|
| 数据 | 自适应采集 | 固定 batch |
| 探索 | 必须 | 无（靠数据覆盖） |
| 主要误差 | 样本效率 | 分布偏移 |

### 6. 实践注意

数据集质量 > 算法选择；记录行为策略 log prob 利于 OPE；安全关键领域优先保守算法 + 人类在环验证。`,

  13: `### 1. 维度灾难

表格方法存储 $Q(s,a)$ 需 $O(SA)$ 空间，每 $(s,a)$ 需足够访问次数——当 $S$ 指数级（如 $n$ 位二进制向量 $S=2^n$）不可行。

**大状态空间**：连续控制、棋类、机器人、Atari（像素输入）。需**泛化**：相似状态相似价值。

### 2. 函数逼近

用参数化 $V_\\theta(s)$ 或 $Q_\\theta(s,a)$，$\\theta\\in\\mathbb{R}^d$，$d\\ll SA$。

常见架构：
- **线性**：$V_\\theta(s)=\\phi(s)^\\top\\theta$，$\\phi$ 为手工或稀疏特征
- **核方法**：RKHS 中的表示
- **神经网络**：Deep RL，非线性但理论分析难

### 3. 线性 MDP 假设

若存在已知特征 $\\phi(s,a)\\in\\mathbb{R}^d$ 使
$$P(s'|s,a)=\\phi(s,a)^\\top\\mu(s'),\\quad r(s,a)=\\phi(s,a)^\\top w$$
则 $Q^*$ 对 $\\phi$ **线性**，可多项式样本学习——ECE524 理论分析常用此结构。

### 4. 样本复杂度目标

以 $d$ 替代 $S$：达到 $\\epsilon$-最优需 $\\mathrm{poly}(d,H,1/\\epsilon,\\log|\\mathcal{A}|)$ 样本，而非 $\\mathrm{poly}(S)$。

### 5. 探索再临

大空间中**计数**不可行，需**基于不确定性的 bonus**（eluder dimension、置信集）——P15、P17 主题。

### 6. 与 P14 LSVI 衔接

**Least-Squares Value Iteration** 在已知特征或线性 MDP 下，用岭回归估计 Bellman 备份，是理解 deep RL 之前最重要的可证算法之一。`,

  14: `### 1. 最小二乘值迭代（LSVI）

在 episodic linear MDP 中，设 $Q_h^*(s,a)=\\phi(s,a)^\\top w_h^*$。Bellman 最优给出监督信号：
$$w_h \\approx \\arg\\min_w \\sum_{(s,a,r,s')\\in\\mathcal{D}_h}\\left(r+\\max_{a'}Q_{h+1}(s',a')-\\phi(s,a)^\\top w\\right)^2$$

**LSVI-UCB**：每阶段 $h$ 用岭回归估 $w_h$，并对 $Q_h$ 加 **UCB bonus** $\\beta\\|\\phi(s,a)\\|_{\\Lambda^{-1}}$ 促进探索。

### 2. 算法流程（episodic $H$）

对每个 episode $k=1,\\ldots,K$：
1. 从 $h=H$ 到 $1$ 反向：用累积数据 $\\mathcal{D}_h$ 做岭回归得 $\\hat{w}_h$
2. $Q_h(s,a)=\\min\\{\\phi^\\top\\hat{w}_h+\\beta\\|\\phi(s,a)\\|_{\\Lambda_h^{-1}}, H-h+1\\}$（clip）
3. 执行 $\\pi_k$：$\\pi_h(s)=\\arg\\max_a Q_h(s,a)$，收集转移加入 $\\mathcal{D}$

### 3. Regret 界

在 linear MDP 假设下，LSVI-UCB 达 $\\tilde{O}(\\sqrt{d^3 H^3 K})$ regret（常数依赖特征维度 $d$、回合长 $H$）。**不依赖 $S$**，突破表格下界对 $S$ 的依赖。

### 4. 岭回归与置信集

$\\Lambda_h=\\sum \\phi_i\\phi_i^\\top+\\lambda I$，$\\hat{w}_h=\\Lambda_h^{-1}\\sum \\phi_i y_i$。置信界：$|\\phi^\\top(\\hat{w}-w^*)|\\le\\beta\\|\\phi\\|_{\\Lambda^{-1}}$（P04–P05 集中不等式 + 线性结构）。

### 5. 与深度 RL

Deep Q-Network 可视为非线性 $Q_\\theta$，无 $\\sqrt{K}$ 保证；LSVI 提供**可证** baseline。研究 gap：何时 NN 继承 linear 结构的样本效率？

### 6. 实现要点

特征设计 $\\phi(s,a)$ 决定性能；归一化 $\\phi$；$\\beta$ 理论常数常过大，需调参；episodic 重置简化分析，continuing 需折扣或 mixing 假设。`,

  15: `### 1. 大状态空间中的探索挑战

表格 UCB 依赖 $N(s,a)$ 计数；当 $S$ 巨大或连续时，绝大多数 $(s,a)$ **永不重复访问**——需用**函数空间上的不确定性**度量。

**Eluder dimension** $d_E$：函数类 $\\mathcal{F}$ 上衡量「一次探测能消除多少不确定性」的组合维度，替代 $|S|$ 出现在 regret 界中。

### 2. 乐观主义 + 函数逼近

**Optimistic LSVI / OPPO**：在 $Q_\\theta$ 上加与特征范数相关的 bonus。

**Randomized value functions**：Posterior sampling for RL（PSRL）——从后验采样 MDP，理论上有 $\\tilde{O}(\\sqrt{H^2 d K})$ 类界（线性高斯模型）。

### 3. 覆盖与探索度量

**State-action coverage**：行为是否覆盖最优策略常访问区域。

**Information gain**：选择最大化 epistemic uncertainty 的动作（计算贵）。

### 4. 深度探索 vs 浅层探索

$\\epsilon$-greedy 仅在当前状态随机——**浅层**。**深度探索**规划多步以到达 informative 状态（如 R-Max 在模型空间、count-based in latent space）。

### 5. 与 P14 关系

LSVI-UCB 已在大但**线性结构**下可证；本讲强调当 $|S|$ 形式上无限时，**bonus 设计**与**复杂度度量**（$d$, $d_E$）如何进入 regret。

### 6. 开放问题

连续控制、视觉输入下的 tight regret 界；与 model-based（学 $P$ 再规划）样本效率比较；Safe exploration 约束下的大空间算法。`,

  16: `### 1. 一般函数逼近设定

$Q^*$ 或 $V^*$ 属于函数类 $\\mathcal{F}=\\{f_\\theta:\\theta\\in\\Theta\\}$（NN、核、随机特征）。目标：从交互数据学 $\\hat{f}\\approx Q^*$。

**挑战**：Bellman 备份 $\\mathcal{T}Q$ 可能**不在** $\\mathcal{F}$ 内（**近似误差** / inherent Bellman error）。

### 2. Bellman 误差与投影

定义 **Bellman residual**：$(\\mathcal{T}Q)(s,a)-Q(s,a)$。Fitted Q-Iteration (FQI)：$Q_{k+1}=\\Pi_\\mathcal{F}(\\mathcal{T}Q_k)$，$\\Pi_\\mathcal{F}$ 为投影到 $\\mathcal{F}$ 的回归。

**Inherent error**：$\\inf_{Q\\in\\mathcal{F}}\\|Q-Q^*\\|$ 下界，算法无法超越。

### 3. 过估计与 Deadly Triad

Sutton：**函数逼近 + 自举 + 离策略** 可导致发散（Q-learning with NN）。Deep RL 用 target network、experience replay 启发式稳定。

### 4. 理论进展（概述）

- **Linear**：LSVI-UCB、GOLF 等 $\\sqrt{K}$ regret
- **General $\\mathcal{F}$**：用 **Bellman rank**、**eluder dim**、**covering number** 刻画样本复杂度
- **Neural tangent kernel**  regime：宽网络近似线性，可迁移部分界

### 5. 离线 + 函数逼近

CQL、IQL 等在 $\\mathcal{F}$ 上保守优化，避免 OOD 动作 Q 过高（P12 延伸）。

### 6. 工程与理论 gap

实践中 PPO、SAC 等 SOTA；理论多针对 tabular/linear。读文献时区分：**假设**（linear MDP、realizability）、**结论**（regret vs PAC）、**常数**是否可部署。`,

  17: `### 1. 一般函数逼近下的探索

当 $Q\\in\\mathcal{F}$ 非线性（如 NN），UCB bonus 需定义在**参数空间**或**函数空间**：

- **置信集** $\\mathcal{F}_t=\\{f\\in\\mathcal{F}:\\|f-\\hat{f}_t\\|_\\mathcal{D}\\le\\beta\\}$，选 optimistic $f\\in\\mathcal{F}_t$
- **Thompson sampling**：从后验 over $\\theta$ 采样 $Q_\\theta$

### 2. Eluder Dimension 再述

序列 $z_1,\\ldots,z_n$，$z$ 是 $(s,a)$ 或 $\\phi(s,a)$。$z_i$ **eluder** 先前点若：存在 $f,f'\\in\\mathcal{F}$，在前点一致、在 $z_i$ 差异大。$d_E$ 大 → 需更多探索。

**Regret**：$\\tilde{O}(\\sqrt{d_E H^3 K})$ 类结果（依赖具体算法 FALCON+、GOLF 等）。

### 3. Reward-free vs Reward-aware

**Reward-free exploration**：先探索覆盖状态，后任意 reward 可快速规划——样本复杂度与 $S$ 或 $d$ 相关。

**Reward-aware**：直接优化 regret，更样本高效当 reward 已知结构。

### 4. 与 P15 对比

P15 偏 linear / 大 $S$ 结构；本讲 **general $\\mathcal{F}$** 的复杂度参数与算法（GOLF：global optimism + local regression）。

### 5. 实践启发

**Ensemble / disagreement**：多 Q 网络分歧作 uncertainty proxy（Bootstrapped DQN）。**Intrinsic motivation**：预测误差、计数在潜空间——工程近似 eluder 思想。

### 6. 课程小结（模块）

P13–P17 完成「大状态 + 函数逼近 + 探索」理论链：从 linear MDP（可证）到 general $\\mathcal{F}$（部分可证），为理解现代 deep RL 提供数学语言。`,

  18: `### 1. 多智能体强化学习（MARL）

$N$ 个智能体，联合状态 $s$，各选动作 $a_i$，环境转移 $P(s'|s,a_1,\\ldots,a_N)$，各得奖励 $r_i$（可能不同）。

**挑战**：
- **非平稳性**：从 agent $i$ 视角，环境含其他 agent 策略，随训练变化
- **信用分配**：团队 reward 如何归因
- **均衡**：多个 agent 同时学习，收敛到何种解？

### 2. 设定分类

| 类型 | 奖励 | 例 |
|------|------|-----|
| 完全合作 | 共享 $r$ | 团队机器人 |
| 完全竞争 | zero-sum | 围棋、乒乓球 |
| 一般和 | 任意 $r_i$ | 交通、拍卖 |

### 3. 解概念

**纳什均衡**（NE）：无 agent 单方面偏离可增 reward。

**相关均衡**（CE）：可通过公共信号相关策略。

**Stackelberg**：leader 先动，follower 最佳响应。

MARL 算法目标常是**学习 NE** 或 **Pareto 最优**（合作）。

### 4. 独立学习（IQL）

各 agent 独立 Q-learning，把 others 当环境——简单但不收敛 guarantee（一般和）。

**Centralized training decentralized execution (CTDE)**：训练时用全局信息，执行时仅局部观测——MADDPG、QMIX。

### 5. 与博弈论衔接

P19–P20 用博弈论工具分析**零和**与**一般和**矩阵/扩展式博弈，MARL 是「重复/随机扩展式博弈 + 学习动力学」。

### 6. 应用

自动驾驶交互、多无人机、游戏 AI（Dota、StarCraft）、LLM 多 agent 协作。理论仍弱于单 agent RL，active research area。`,

  19: `### 1. 两玩家零和博弈

玩家 1 选 $x\\in\\mathcal{X}$，玩家 2 选 $y\\in\\mathcal{Y}$，效用 $u_1(x,y)=-u_2(x,y)$（零和）。**矩阵博弈**：有限 $\\mathcal{X},\\mathcal{Y}$， payoff 矩阵 $A$。

**混合策略**：$\\sigma_1\\in\\Delta(\\mathcal{X})$，期望效用 $\\sigma_1^\\top A\\sigma_2$。

### 2. Minimax 定理（von Neumann）

$$\max_{\\sigma_1}\\min_{\\sigma_2}\\sigma_1^\\top A\\sigma_2=\\min_{\\sigma_2}\\max_{\\sigma_1}\\sigma_1^\\top A\\sigma_2=v^*$$

存在**纳什均衡**（混合策略），值 $v^*$ 称为博弈值。

### 3. 求解方法

- **线性规划**：求 NE 可化为 LP
- **Fictitious play / no-regret**：若两玩家都用 no-regret 学习，平均策略收敛到 NE（零和）
- **Counterfactual regret minimization (CFR)**：扑克等不完全信息扩展博弈

### 4. RL 视角

**Self-play**：agent 与自身副本对弈，策略迭代类似 policy iteration in zero-sum Markov game。

**Minimax-Q**：学 $Q^*(s,a_1,a_2)$，$\\pi_1^*(s)=\\arg\\max_{a_1}\\min_{a_2}Q^*(s,a_1,a_2)$。

**AlphaGo / AlphaZero**：MCTS + 神经网络，自博弈生成数据。

### 5. Regret 与均衡

若 player 1 的 external regret 为 $R(T)$，平均策略 $\\bar{\\sigma}_1$ 满足 $\\min_{\\sigma_2}\\bar{\\sigma}_1^\\top A\\sigma_2\\ge v^*-R(T)/T$——**no-regret ⇒ 近似 NE**。

### 6. 与 P20 区别

零和存在唯一博弈值（混合 NE 可能多个但值同）；**一般和**多 NE、社会困境，分析更复杂。`,

  20: `### 1. 多人一般和博弈

$n$ 玩家，策略 $a_i$，效用 $u_i(a_1,\\ldots,a_n)$。**无**统一零和结构，NE 可能：

- **多个**（Coordination game 两个 NE）
- **效率低**（Prisoner's dilemma：唯一 NE 非 Pareto 最优）
- **纯策略 NE 可能不存在**（需混合策略，Nash 1950）

### 2. 纳什均衡存在性

有限玩家、有限纯策略空间 → 混合策略 NE **存在**（Brouwer / Kakutani 不动点）。计算 NE 是 PPAD-hard（一般和）。

### 3. 学习动力学

| 动力学 | 行为 |
|--------|------|
| Best response | 可能周期、不收敛 |
| Fictitious play | 零和收敛；一般和不一定 |
| No-regret | 平均策略 → coarse correlated equilibrium |
| Policy gradient MARL | 局部收敛到 NE？一般无保证 |

### 4. 社会最优 vs 均衡

**Price of anarchy**：最坏 NE 社会 welfare / 最优 welfare。

**Mechanism design**：设计规则使 selfish NE = 社会最优（拍卖、VCG）。

### 5. MARL 算法（一般和）

**MADDPG**：集中 critic、分散 actor。

**Independent PPO**：各训各的，工程可用理论弱。

**Correlated equilibrium learning**：公共 random signal 协调。

### 6. 与 RL 课程整合

单 agent RL 求 $V^*$；MARL 求 **equilibrium 集合** 中之一。P19 零和有 clean minimax；本讲强调**多解、效率、计算难**，解释为何 MARL 理论仍开放。`,

  21: `### 1. 部分可观测 MDP（POMDP）

智能体**不能**直接观测 $s$，仅得观测 $o\\in\\mathcal{O}$，由 $O(o|s,a)$ 生成。**信念状态** $b(s)=P(s|h_t)$ 为历史 $h_t$ 下对状态的分布。

POMDP 七元组：$(\\mathcal{S},\\mathcal{A},P,r,\\mathcal{O},O,\\gamma)$。

### 2. 信念 MDP

在 belief $b$ 上，POMDP 可转化为** belief MDP**（连续状态 $|S|$ 维单纯形），但 $|S|$ 大时仍难解。

**更新**（Bayes）：
$$b'(s')\\propto O(o|s',a)\\sum_s P(s'|s,a)b(s)$$

**价值**：$V^*(b)$ 为 convex（分段线性），最优策略 $\\pi^*(a|b)$ 为 belief 的函数。

### 3. 求解方法

- **精确**：对小型 POMDP 用 Sondik 算法、point-based value iteration
- **近似**：POMCP（蒙特卡洛树搜索 + particle belief）
- **Recurrent policy**：$a_t=\\pi(o_t)$ 或 $\\pi(o_{t-k:t})$，忽略长期记忆——**suboptimal** 但常用（LSTM policy）

### 4. 可观测性等级

| 类型 | 说明 |
|------|------|
| Fully observable MDP | POMDP 特例，$O$ 确定 |
| Block MDP | 观测确定 latent state（理论友好） |
| Dec-POMDP | 多 agent 各私有观测 |

### 5. 与 LLM / 部分观测

对话中「真实用户意图」不可观测，历史文本为 $o$；RLHF 在 latent preference 下优化——POMDP 视角有用。

### 6. P22 预告

信念规划复杂度、近似算法误差界、与 memory（RNN/Transformer）的关系；Dec-POMDP 与 MARL 交叉。`,

  22: `### 1. POMDP 规划复杂度

有限 POMDP 精确求解 **PSPACE-complete**（比 MDP 的 P 更难）。Belief 空间连续，值函数 $V(b)$ 为 PWLC（piecewise linear convex），#vertices 可指数增长。

**有限 horizon $H$**：动态规划在 belief 单纯形上反向归纳，复杂度指数于 $H$ 与 $|S|$。

### 2. Point-Based Value Iteration (PBVI)

仅在**可达 belief 点集** $B$ 上备份，避免整个单纯形。选 $b$ 扩展：simulate 动作/观测，加新 belief 到 $B$。

**SARSOP** 等：基于可达空间的采样规划。

### 3. POMCP 与粒子滤波

用 particle filter 近似 $b$，MCTS 在 belief tree 上搜索。**无**全局最优保证，大规模 POMDP 实用。

### 4. 记忆与策略类

**Memoryless**：$\\pi(a|o)$，仅当前观测——机器人、Atari 常用，可能严重次优。

**Finite memory**：$\\pi(a|o_{t-L:t})$，LSTM/Transformer 隐式记忆。

**理论**：存在 POMDP 需无限记忆才最优；$k$-memory 近似误差可分析（部分结果）。

### 5. Dec-POMDP 简述

多 agent 各私有观测，联合策略最大化团队 reward。比单 agent POMDP 更难（NEXP-complete）。**CTDE** 与 **communication** 可缓解：有限带宽下共享 belief 片段。

### 6. 课程总结

ECE524 从 MDP（P01）→ Bellman/规划 → 概率工具 → 探索/regret → 离线 → 函数逼近 → 博弈 → **POMDP** 完成闭环：

- **已知模型**：动态规划
- **未知模型在线**：regret minimization + UCB 类
- **未知模型离线**：保守 + coverage
- **大状态**：linear/general 函数逼近
- **多 agent**：均衡概念
- **部分观测**：belief + 近似规划

继续学习：Szepesvári *Algorithms for RL*、Agarwal et al. *RL: Theory and Algorithms*、Chi Jin 课程主页习题与论文列表。`,
};
