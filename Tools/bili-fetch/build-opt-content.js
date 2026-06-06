/**
 * Generate opt-knowledge (ch1-ch16) + opt-tutorial-detail.js for BV1Kc411i7kJ
 * Usage: node build-opt-content.js
 */
const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, '..', 'BV1Kc411i7kJ-full.json');
const OUT = path.join(__dirname, 'content');
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

function shortTitle(part) {
  return part.replace(/^\d+\.\d+\s*/, '').trim();
}

function chapterOf(page) {
  if (page <= 5) return { num: 1, id: 'ch1', name: '第1章 绪论', range: 'P01–P05' };
  if (page <= 11) return { num: 2, id: 'ch2', name: '第2章 凸集', range: 'P06–P11' };
  if (page <= 16) return { num: 3, id: 'ch3', name: '第3章 凸函数', range: 'P12–P16' };
  if (page <= 22) return { num: 4, id: 'ch4', name: '第4章 凸优化问题', range: 'P17–P22' };
  if (page <= 25) return { num: 5, id: 'ch5', name: '第5章 对偶理论', range: 'P23–P25' };
  if (page <= 32) return { num: 6, id: 'ch6', name: '第6章 拉格朗日对偶', range: 'P26–P32' };
  if (page <= 39) return { num: 7, id: 'ch7', name: '第7章 最优性条件', range: 'P33–P39' };
  if (page <= 47) return { num: 8, id: 'ch8', name: '第8章 线搜索与梯度法', range: 'P40–P47' };
  if (page <= 52) return { num: 9, id: 'ch9', name: '第9章 次梯度法', range: 'P48–P52' };
  if (page <= 60) return { num: 10, id: 'ch10', name: '第10章 牛顿法与信赖域', range: 'P53–P60' };
  if (page <= 66) return { num: 11, id: 'ch11', name: '第11章 拟牛顿法', range: 'P61–P66' };
  if (page <= 72) return { num: 12, id: 'ch12', name: '第12章 邻近算子与投影', range: 'P67–P72' };
  if (page <= 77) return { num: 13, id: 'ch13', name: '第13章 近似点梯度法', range: 'P73–P77' };
  if (page <= 83) return { num: 14, id: 'ch14', name: '第14章 Nesterov与FISTA', range: 'P78–P83' };
  if (page <= 90) return { num: 15, id: 'ch15', name: '第15章 增广拉格朗日', range: 'P84–P90' };
  return { num: 16, id: 'ch16', name: '第16章 ADMM与DRS', range: 'P91–P101' };
}

const EXAM_TIPS = {
  1: '最优化定义、建模三要素、与机器学习关系、课程路线图',
  2: '标准形式 min f(x) s.t. g_i(x)≤0, h_j(x)=0、可行域、最优解/局部解',
  3: '回归/分类/压缩感知/SDP 建模实例、变量与约束识别',
  4: '全局/局部最优、驻点、可行方向、收敛速度 O(·) 记号',
  5: 'LLM 辅助证明、形式化验证工具、数学写作规范',
  6: 'ℓ_p 范数、对偶范数、Cauchy-Schwarz、Hölder 不等式',
  7: '凸集定义 λx+(1-λ)y∈C、仿射/凸组合',
  8: '超平面、多面体、椭球、二阶锥、半定锥、norm ball',
  9: '交集/仿射映射/笛卡尔积保凸、透视函数、 inf 卷积',
  10: '广义不等式、锥 K、对偶锥 K*、最小/最大元',
  11: '对偶锥性质、分离定理、极锥、法锥',
  12: '梯度 ∇f、Hessian ∇²f、Taylor 展开、Lipschitz 梯度',
  13: '凸函数一阶/二阶判定、Jensen 不等式、强凸 μ',
  14: '凸函数闭性、水平集凸、共轭函数预告',
  15: '复合保凸、pointwise max、部分最小化',
  16: '拟凸/伪凸/对数凸、广义凸函数',
  17: '标准凸优化形式、Slater 可解性、等价变换',
  18: 'LP 单纯形法思路、对偶 LP、标准形',
  19: 'SOCP 形式 ‖Ax+b‖≤c^Tx+d、鲁棒优化建模',
  20: 'SDP min tr(CX) s.t. A(X)=b, X⪰0、Schur 补',
  21: 'SDP 对偶、内点法、MaxCut/PCA 松弛',
  22: 'CVX/Mosek/Gurobi、AMPL/Julia JuMP 建模',
  23: 'LP 对偶、弱/强对偶、互补松弛',
  24: 'SDP 对偶、对偶间隙、内点法多项式复杂度',
  25: 'SOCP 对偶、二阶锥对偶范数',
  26: 'Lagrangian L(x,λ,ν)、对偶函数 g(λ,ν)',
  27: 'LP 对偶推导、影子价格、灵敏度',
  28: 'LP 对偶经济解释、运输/分配实例',
  29: 'SDP 对偶、半定松弛对偶界',
  30: 'SDP 对偶实例、MaxCut 对偶',
  31: 'Slater 条件、强对偶充要、严格可行性',
  32: '凸问题 KKT：∇f+∑λ_i∇g_i+∑ν_j∇h_j=0、互补松弛',
  33: 'Weierstrass 定理、coercive、水平集有界',
  34: '无约束 FONC ∇f(x*)=0、SONC ∇²f⪰0',
  35: '切锥 T_C(x)、几何最优性 x* 为可行方向最小点',
  36: '线性化可行锥 F(x*,ξ)、LICQ 下与切锥关系',
  37: 'Farkas 引理、Gordan 二择一、KKT 代数推导',
  38: 'LICQ/MFCQ/Slater/CQ 约束品性比较',
  39: '一般约束 NLP 一阶/二阶必要条件',
  40: '线搜索框架、下降方向、全局/局部收敛',
  41: 'Armijo 充分下降、Wolfe 曲率条件',
  42: '强 Wolfe、回溯/插值线搜索',
  43: 'Zoutendijk 定理、梯度相关收敛性',
  44: 'GD x_{k+1}=x_k-α_k∇f、L-光滑收敛 O(1/k)',
  45: 'GD 强凸线性收敛 (1-μ/L)^k、条件数 κ',
  46: 'GD 非凸收敛到驻点、PL 条件',
  47: 'BB 步长 s_k^Ty_k/y_k^Ty_k、非单调线搜索',
  48: '次梯度 ∂f(x)、支撑超平面、非光滑点',
  49: '次微分闭凸、单调性、强凸次梯度',
  50: '次梯度计算：max/min/|·|/范数/复合规则',
  51: '次梯度最优性 0∈∂f(x*)+N_C(x*)、对偶',
  52: '次梯度法 x_{k+1}=x_k-α_k g_k、O(1/√k) 收敛',
  53: 'Newton x_{k+1}=x_k-[∇²f]^{-1}∇f、二次收敛',
  54: '非精确 Newton、阻尼 Newton、Cholesky 修正',
  55: '信赖域 min m_k(p) s.t. ‖p‖≤Δ_k、ratio ρ_k',
  56: 'Dogleg、Cauchy 点、子问题精确解',
  57: '信赖域子问题 Hard case、特征值修正',
  58: '截断 CG 解 trust-region 子问题',
  59: 'Cauchy 点计算、Steihaug-CG',
  60: '信赖域全局收敛到一阶驻点',
  61: '割线方程 B_{k+1}s_k=y_k、秩一/秩二更新',
  62: 'BFGS/DFP 公式、正定性保持、Sherman-Morrison',
  63: '拟牛顿全局收敛、超线性收敛条件',
  64: 'L-BFGS two-loop recursion、m 对存储',
  65: 'L-BFGS 大规模 ML 训练、批处理',
  66: 'Gauss-Newton、LM 法、非线性最小二乘',
  67: '闭函数、共轭 f*、Fenchel-Young 等式',
  68: 'prox_λf(x)=argmin f(u)+1/2λ‖u-x‖²、Moreau 分解',
  69: 'prox 可分离、ℓ1/ℓ2/指示函数 prox 闭式',
  70: '投影 P_C(x)、欧氏/加权投影',
  71: '多面体/二阶锥/半定锥投影',
  72: 'prox 与投影关系、Bregman prox',
  73: 'prox-gradient x_{k+1}=prox_{αg}(x_k-α∇f) ISTA',
  74: 'LASSO/稀疏逻辑回归/矩阵补全应用',
  75: 'ISTA O(1/k) 收敛、函数值下降',
  76: '非凸 prox、镜像下降 MD、Bregman 散度',
  77: 'FISTA 惯性、条件梯度 Frank-Wolfe',
  78: 'Nesterov 1983 加速 O(1/k²)、光滑凸',
  79: 'FISTA 算法、ISTA+动量 t_{k+1}=(1+√(1+4t_k²))/2',
  80: 'FISTA 收敛证明框架、函数值 O(1/k²)',
  81: 'FISTA 强凸/复合目标扩展',
  82: '第二类 Nesterov、坐标下降加速',
  83: 'LASSO/Logistic/SDP 加速实例',
  84: '二次罚 Q(x,ρ)=f(x)+ρ/2‖h(x)‖²、病态性',
  85: '罚函数收敛、ρ→∞ 极限',
  86: 'ALM L_A(x,λ,ρ)=f+λ^Th+ρ/2‖h‖²、乘子更新',
  87: 'ALM 收敛性、KKT 极限点',
  88: '不等式约束 ALM、ADMM 前身',
  89: '凸 ALM 对偶收敛、半光滑 Newton',
  90: 'Basis Pursuit ALM/ADMM 建模',
  91: 'ADMM 三步分裂、x/z/u 更新、可分离结构',
  92: 'ADMM KKT 残差、原始/对偶可行性',
  93: '过松弛、自适应 ρ、线性化 ADMM',
  94: 'LASSO/SDP 的 ADMM 分裂',
  95: '稀疏逆协方差 Graphical Lasso ADMM',
  96: 'RPCA 低秩+稀疏 ADMM',
  97: 'TV 去噪 ADMM、图像恢复',
  98: '分布式 ADMM、一致性约束',
  99: '非凸 ADMM 实践与理论局限',
  100: 'DRS Douglas-Rachford 分裂、与 ADMM 等价',
  101: 'DRS 收敛、Monotone operator、课程总结',
};

const CHAPTER_FORMULAS = {
  1: [
    '$$\\min_{x\\in\\mathbb{R}^n} f(x) \\quad \\text{s.t.} \\quad g_i(x)\\le 0,\\; h_j(x)=0$$',
    '$$x^*\\in\\arg\\min\\{f(x): x\\in\\mathcal{F}\\},\\quad \\mathcal{F}=\\{x: g_i(x)\\le 0, h_j(x)=0\\}$$',
  ],
  2: [
    '$$\\|x\\|_p = \\left(\\sum_i |x_i|^p\\right)^{1/p},\\quad \\|x\\|_* = \\sup_{\\|y\\|_p\\le 1} y^\\top x$$',
    '$$C \\text{ 凸 } \\Leftrightarrow \\forall x,y\\in C,\\; \\theta\\in[0,1],\\; \\theta x+(1-\\theta)y\\in C$$',
  ],
  3: [
    '$$f \\text{ 凸 } \\Leftrightarrow f(y)\\ge f(x)+\\nabla f(x)^\\top(y-x)$$',
    '$$\\nabla^2 f(x)\\succeq 0 \\;(\\forall x) \\Rightarrow f \\text{ 凸}$$',
  ],
  4: [
    '$$\\min c^\\top x \\;\\text{s.t.}\\; Ax=b,\\; x\\ge 0 \\quad (\\text{LP})$$',
    '$$\\min \\langle C,X\\rangle \\;\\text{s.t.}\\; \\mathcal{A}(X)=b,\\; X\\succeq 0 \\quad (\\text{SDP})$$',
  ],
  5: [
    '$$d^*=\\max_{\\lambda\\ge 0,\\nu} \\inf_x L(x,\\lambda,\\nu),\\quad L=f+\\sum\\lambda_i g_i+\\sum\\nu_j h_j$$',
    '$$p^*\\ge d^* \\quad (\\text{弱对偶})$$',
  ],
  6: [
    '$$\\nabla f(x^*)+\\sum_i \\lambda_i^*\\nabla g_i(x^*)+\\sum_j \\nu_j^*\\nabla h_j(x^*)=0$$',
    '$$\\lambda_i^* g_i(x^*)=0,\\; i=1,\\ldots,m$$',
  ],
  7: [
    '$$\\nabla f(x^*)=0 \\quad (\\text{无约束 FONC})$$',
    '$$\\text{Farkas: } \\{Ax=0, x\\ge 0\\}=\\{0\\}\\Leftrightarrow \\exists y: A^\\top y>0$$',
  ],
  8: [
    '$$x_{k+1}=x_k-\\alpha_k \\nabla f(x_k),\\quad f(x_{k+1})\\le f(x_k)+c\\alpha_k \\nabla f^\\top d_k$$',
    '$$\\|x_{k+1}-x^*\\|\\le \\left(1-\\frac{\\mu}{L}\\right)^k \\|x_0-x^*\\| \\quad (\\text{强凸 GD})$$',
  ],
  9: [
    '$$g\\in\\partial f(x) \\Leftrightarrow f(y)\\ge f(x)+g^\\top(y-x),\\;\\forall y$$',
    '$$x_{k+1}=x_k-\\alpha_k g_k,\\; g_k\\in\\partial f(x_k)$$',
  ],
  10: [
    '$$x_{k+1}=x_k-[\\nabla^2 f(x_k)]^{-1}\\nabla f(x_k)$$',
    '$$\\min_p m_k(p)=f(x_k)+\\nabla f^\\top p+\\tfrac12 p^\\top B_k p,\\; \\|p\\|\\le\\Delta_k$$',
  ],
  11: [
    '$$B_{k+1}s_k=y_k,\\quad B_{k+1}=B_k-\\frac{B_k s_k s_k^\\top B_k}{s_k^\\top B_k s_k}+\\frac{y_k y_k^\\top}{y_k^\\top s_k}$$',
  ],
  12: [
    '$$\\mathrm{prox}_{\\lambda f}(x)=\\arg\\min_u f(u)+\\frac{1}{2\\lambda}\\|u-x\\|^2$$',
    '$$P_C(x)=\\arg\\min_{y\\in C}\\|y-x\\|^2$$',
  ],
  13: [
    '$$x_{k+1}=\\mathrm{prox}_{\\alpha g}(x_k-\\alpha\\nabla f(x_k))$$',
  ],
  14: [
    '$$t_{k+1}=\\frac{1+\\sqrt{1+4t_k^2}}{2},\\; y_k=x_k+\\frac{t_k-1}{t_{k+1}}(x_k-x_{k-1})$$',
    '$$f(x_k)-f^*=O(1/k^2) \\quad (\\text{Nesterov 光滑凸})$$',
  ],
  15: [
    '$$L_\\rho(x,\\lambda)=f(x)+\\lambda^\\top h(x)+\\frac{\\rho}{2}\\|h(x)\\|^2$$',
  ],
  16: [
    '$$x^{k+1}=\\arg\\min_x L_\\rho(x,z^k,u^k),\\; z^{k+1}=\\arg\\min_z L_\\rho(x^{k+1},z,u^k),\\; u^{k+1}=u^k+\\rho(x^{k+1}-z^{k+1})$$',
  ],
};

const CHAPTER_ANALOGIES = {
  1: '最优化像**登山找最低点**：目标函数是海拔，约束是围栏；算法是下山策略，理论保证「会不会走到谷底」。',
  2: '凸集像**没有凹坑的碗沿**：任意两点连线都在集合内；范数是**测量步长**的尺子，不同范数偏好不同方向稀疏。',
  3: '凸函数像**向上开口的碗**：局部最低点即全局最低；Hessian 是碗口曲率，梯度指向最陡上升方向。',
  4: 'LP/SOCP/SDP 像**不同精度的模具**：线性最简单，锥规划表达鲁棒/半定松弛，是现代 ML 理论工具箱。',
  5: '对偶像**影子价格**：约束紧不紧决定乘子大小；强对偶成立时，原问题与对偶问题最优值相等。',
  6: 'KKT 像**平衡木上的静止**：梯度被约束「推」到零，互补松弛说「不紧的约束不产生力」。',
  7: '最优性条件像**交通法规**：一阶条件禁止「还能下降」的方向；约束品性保证法规可执行。',
  8: '线搜索像**试探步长**：先找下降方向，再决定走多远；Wolfe 条件防止步长过小或过大。',
  9: '次梯度像**折线角点的「斜率范围」**：在不可微点，多个超平面支撑函数图像。',
  10: 'Newton 像**用二次曲面近似山谷**；信赖域像**限制每步只在可信范围内近似**。',
  11: '拟牛顿像**记住最近几步的曲率**，不必每步算 Hessian；BFGS 是工程中最成功的近似。',
  12: 'prox 像**带正则的投影**：先做梯度步，再「软阈值」拉回可行；投影是硬约束版。',
  13: 'prox-gradient 把**光滑部分梯度下降**与**非光滑 prox** 交替，LASSO 的标准解法。',
  14: 'Nesterov 加速像**惯性下山**：前一步的动量帮你「抄近路」，从 O(1/k) 跳到 O(1/k²)。',
  15: '增广拉格朗日像**软约束弹簧**：违反约束要罚，乘子更新拉紧弹簧直到满足 KKT。',
  16: 'ADMM 像**分工协作**：x 块与 z 块各解各的子问题，u 块协调一致性；适合分布式与稀疏结构。',
};

function buildKnowledge(page, part) {
  const st = shortTitle(part);
  const ch = chapterOf(page);
  const exam = EXAM_TIPS[page] || st;
  const formulas = CHAPTER_FORMULAS[ch.num] || [];
  const prev = page > 1 ? shortTitle(data.parts[page - 2].part) : null;
  const next = page < data.parts.length ? shortTitle(data.parts[page].part) : null;

  const sections = [
    `### 1. 本讲主题：${st}`,
    '',
    `本讲属于**文再文《最优化：建模、算法与理论》** ${ch.name}（${ch.range}），对应 B 站分 P **${part}**。`,
    '',
    `**考试/面试侧重**：${exam}。`,
    '',
    '### 2. 核心定义与定理',
    '',
    `在 ${ch.name} 框架下，「${st}」建立以下主干：`,
    '',
    `- **问题背景**：最优化在机器学习（训练损失最小化）、运筹调度、控制与信号处理中统一为「在约束下最小化目标」。`,
    `- **数学对象**：明确变量 $x\\in\\mathbb{R}^n$、目标 $f$、约束 $g_i,h_j$ 或算法迭代 $\\{x_k\\}$ 的语义。`,
    `- **关键判定**：区分存在性、最优性（一阶/二阶/KKT）、收敛性（速率与假设）。`,
    '',
    '### 3. 核心公式',
    '',
    ...formulas.map((f) => `${f}\n`),
    '',
    '### 4. 算法流程（若适用）',
    '',
    page >= 40 && page <= 52
      ? `1. 选初始点 $x_0$；$k=0,1,2,\\ldots$\n2. 计算搜索方向 $d_k$（负梯度/Newton/次梯度）\n3. 线搜索求步长 $\\alpha_k$ 满足 Armijo/Wolfe\n4. 更新 $x_{k+1}=x_k+\\alpha_k d_k$\n5. 停机：$\\|\\nabla f(x_k)\\|\\le\\varepsilon$ 或 $|f(x_{k+1})-f(x_k)|$ 充分小`
      : page >= 53 && page <= 66
        ? `1. 初始化 $x_0,B_0\\succ 0$（或 $\\Delta_0$ 信赖域半径）\n2. 解子问题得步长 $p_k$（Newton/Trust-region/QN）\n3. 线搜索或 ratio 测试接受步长\n4. 更新 $x_{k+1}$ 与 $B_{k+1}$（BFGS）或 $\\Delta_{k+1}$\n5. 检验收敛到 KKT 或梯度范数`
        : page >= 73 && page <= 83
          ? `1. 分裂 $F(x)=f(x)+g(x)$，$f$ 光滑、$g$  prox 友好\n2. ISTA/FISTA：梯度步 + prox\n3. FISTA 加动量系数 $(t_k-1)/t_{k+1}$\n4. 监控目标值与稀疏度/约束残差\n5. 调参：$\\alpha=1/L$，$L$ 为 Lipschitz 常数`
          : page >= 84
            ? `1. 构造增广拉格朗日或 ADMM 分裂\n2. 交替更新原始变量、辅助变量、对偶乘子\n3. 自适应调整罚参数 $\\rho$\n4. 监控原始/对偶残差\n5. 输出满足 KKT 容差的解`
            : `1. 建立数学模型（目标+约束）\n2. 判定问题类（凸/非凸、LP/SOCP/SDP）\n3. 写出最优性条件或对偶\n4. 选择算法（内点/一阶/分裂）\n5. 分析复杂度与收敛`,
    '',
    '### 5. 典型例题思路',
    '',
    `- **建模题**：从文字描述识别 $x,f,g$；例如 LASSO：$\\min\\frac12\\|Ax-b\\|^2+\\lambda\\|x\\|_1$。`,
    `- **判定题**：验证集合/函数凸性，或写 KKT 系统。`,
    `- **算法题**：手算 1–2 步 GD/Newton/prox，说明步长选择。`,
    '',
    '### 6. 与机器学习/深度学习的联系',
    '',
    ch.num <= 4
      ? '- 训练神经网络 = 非凸随机优化；理解凸子问题有助于分析 SGD、Adam 的收敛直觉。\n- LP/SOCP/SDP 用于鲁棒优化、半定松弛、MaxCut 近似。'
      : ch.num <= 8
        ? '- 梯度下降/线搜索是 SGD 的理论原型；强凸与 PL 条件对应 overparametrized 网络的隐式正则。\n- 条件数 $\\kappa=L/\\mu$ 决定收敛速度，与学习率选择直接相关。'
        : ch.num <= 14
          ? '- LASSO/FISTA 用于稀疏特征选择；prox 算子对应 ReLU、max-pool 等非光滑结构。\n- Nesterov 动量启发 SGD with momentum、Adam 的加速思想。'
          : '- ADMM 用于分布式 ML、联邦学习中的共识优化；增广拉格朗日用于约束神经网络训练（投影/罚方法）。',
    '',
    '### 7. 与前后讲衔接',
    '',
    prev ? `- **前置**：「${prev}」提供本讲所需概念。` : '- **前置**：系列起点，建议先读总览。',
    next ? `- **后续**：「${next}」将在本讲基础上深入。` : '- **后续**：全课总结，建议复盘思维导图。',
    '',
    '### 8. 复习要点',
    '',
    `1. 闭卷写出 ${ch.name} 与本讲相关的 2–3 个定义或定理。`,
    `2. 独立完成一道与「${st}」相关的计算或证明 sketch。`,
    `3. 对照教材 ${ch.name} 习题，标注易错点。`,
  ];

  return sections.join('\n');
}

function sanitizeLink(part, page) {
  let name = part
    .replace(/^\d+\.\d+\s*/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[（）()【】\[\]]/g, '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[———]/g, '-')
    .replace(/：/g, '-')
    .replace(/\s+/g, '')
    .trim();
  if (!name || name.length > 45) {
    name = part.replace(/^\d+\.\d+\s*/, '').replace(/[\\/:*?"<>|（）()【】\[\]]/g, '').slice(0, 45);
  }
  return `P${String(page).padStart(2, '0')}-${name || `分P${page}`}`;
}

function buildDetail(page, part, prevPart, nextPart) {
  const ch = chapterOf(page);
  const st = shortTitle(part);
  const exam = EXAM_TIPS[page] || st;
  const total = data.parts.length;
  const prev = prevPart ? shortTitle(prevPart) : null;
  const next = nextPart ? shortTitle(nextPart) : null;
  const prevLink = page > 1 ? sanitizeLink(prevPart, page - 1) : null;
  const nextLink = page < total ? sanitizeLink(nextPart, page + 1) : null;

  const mermaidByCh = {
    1: 'flowchart LR\n  Model[建模] --> Theory[理论]\n  Theory --> Algo[算法]\n  Algo --> App[ML/运筹应用]',
    2: 'flowchart TB\n  Norm[范数] --> ConvSet[凸集]\n  ConvSet --> Ops[保凸运算]\n  Ops --> DualCone[对偶锥]',
    3: 'flowchart LR\n  Grad[梯度/Hessian] --> ConvFn[凸函数]\n  ConvFn --> Preserve[保凸运算]',
    4: 'flowchart TB\n  CVX[凸优化] --> LP[LP]\n  CVX --> SOCP[SOCP]\n  CVX --> SDP[SDP]',
    5: 'flowchart LR\n  Primal[原问题 p*] --> Dual[对偶 d*]\n  Dual --> Strong[强对偶条件]',
    6: 'flowchart TB\n  Lag[Lagrangian] --> KKT[KKT]\n  Slater[Slater] --> Strong',
    7: 'flowchart LR\n  Exist[存在性] --> FONC[一阶条件]\n  FONC --> KKT2[约束KKT]',
    8: 'flowchart TB\n  LS[线搜索] --> GD[梯度下降]\n  GD --> Conv[收敛率]',
    9: 'flowchart LR\n  Subgrad[次梯度] --> SubgradM[次梯度法]',
    10: 'flowchart TB\n  Newton[Newton] --> TR[信赖域]\n  TR --> Global[全局收敛]',
    11: 'flowchart LR\n  Secant[割线方程] --> BFGS[BFGS]\n  BFGS --> LBFGS[L-BFGS]',
    12: 'flowchart TB\n  Conj[共轭] --> Prox[prox]\n  Prox --> Proj[投影]',
    13: 'flowchart LR\n  PG[prox-gradient] --> ISTA[ISTA]\n  ISTA --> Mirror[镜像下降]',
    14: 'flowchart TB\n  Nest[Nesterov] --> FISTA[FISTA]\n  FISTA --> Rate[O1/k2]',
    15: 'flowchart LR\n  Penalty[罚函数] --> ALM[增广拉格朗日]\n  ALM --> BP[基追踪]',
    16: 'flowchart TB\n  ADMM[ADMM] --> Apps[应用]\n  ADMM --> DRS[DRS]',
  };

  return {
    position: `**模块**：${ch.name}（${ch.range}）· 系列第 **P${String(page).padStart(2, '0')}/${total}** 集。\n\n${prevLink ? `**建议前置**：[[${prevLink}]]——建立本集所需背景。` : '**系列起点**：建议先浏览 [[BV1Kc411i7kJ-总览]] 把握 101 讲路线图。'}\n\n${nextLink ? `**建议后续**：[[${nextLink}]]——在本集能力之上继续深入。` : '**系列终点**：回顾 [[思维导图]] 做全课复盘与自测。'}\n\n依赖主线：绪论→凸集/凸函数→凸优化与对偶→KKT→一阶/二阶法→prox/FISTA→增广拉格朗日→ADMM/DRS。`,
    quickSummary: `**${st}** 是北大文再文最优化课程核心一讲。读完本节你应能：① 复述核心定义与定理；② 说明在 16 章知识体系中的位置；③ 完成一道典型推导或算法步骤。考试/面试侧重：**${exam}**。`,
    zeroBaseIntro: `本节「${st}」属于 **${ch.name}**。文再文课程强调**建模—理论—算法**三位一体，与教材《最优化：建模、算法与理论》同步。即便未看视频，也应先建立「定义 → 定理/算法 → 收敛分析 → 与前后讲衔接」四层结构。\n\n第一遍盯住：本讲**解决什么问题**？**关键假设**（凸性、光滑性、Lipschitz、CQ）是什么？**算法复杂度/收敛率**如何表述？第二遍对照教材例题补全证明细节。`,
    analogy: CHAPTER_ANALOGIES[ch.num],
    walkthrough: page <= 5
      ? `**Walkthrough：LASSO 建模识别**\n\n1. 数据 $A\\in\\mathbb{R}^{m\\times n}, b\\in\\mathbb{R}^m$，变量 $x$ 为系数。\n2. 最小二乘 $\\min\\|Ax-b\\|_2^2$ 无稀疏性 → 加 $\\lambda\\|x\\|_1$。\n3. 识别：$f(x)=\\frac12\\|Ax-b\\|_2^2$ 光滑凸，$g(x)=\\lambda\\|x\\|_1$ 非光滑凸。\n4. 后续可用 prox-gradient/FISTA/ADMM 求解。\n5. 对照本讲主题「${st}」在链条中的位置。`
      : page <= 16
        ? `**Walkthrough：凸性判定**\n\n1. 给定 $f(x)=-\\log(1-e^{a^\\top x})$ 或 $f(x)=\\|Ax-b\\|_2^2$。\n2. 算 $\\nabla f,\\nabla^2 f$。\n3. 检查 $\\nabla^2 f\\succeq 0$ 或 $f(\\theta x+(1-\\theta)y)\\le\\theta f(x)+(1-\\theta)f(y)$。\n4. 约束 $g(x)=\\|x\\|_2-1\\le 0$ 的集合是否凸。\n5. 写结论并引用定理编号。`
        : page <= 32
          ? `**Walkthrough：写 KKT 系统**\n\n1. 问题 $\\min f(x)$ s.t. $g(x)\\le 0, h(x)=0$。\n2. 构造 $L=f+\\sum\\lambda_i g_i+\\sum\\nu_j h_j$。\n3. 列 $\\nabla_x L=0$，$h=0$，$\\lambda\\ge 0$，$\\lambda_i g_i=0$。\n4. 验证 Slater/LICQ 是否满足。\n5. 对比对偶问题变量与含义。`
          : page <= 47
            ? `**Walkthrough：梯度下降一步**\n\n1. $f(x)=\\frac12 x^\\top Q x - b^\\top x$，$Q\\succ 0$。\n2. $\\nabla f=Qx-b$，Lipschitz $L=\\lambda_{\\max}(Q)$。\n3. 步长 $\\alpha=1/L$，$x_{k+1}=x_k-\\alpha\\nabla f$。\n4. 算 $\\|x_{k+1}-x^*\\|/\\|x_k-x^*\\|$ 验证收缩比 $1-\\mu/L$。\n5. 与线搜索 Armijo 对比。`
            : page <= 60
              ? `**Walkthrough：Newton vs 信赖域**\n\n1. 从 $x_k$ 算 $g_k=\\nabla f, H_k=\\nabla^2 f$。\n2. Newton 步 $p=-H_k^{-1}g_k$；若 $H_k$ 不定则修正。\n3. TR 子问题 $\\min m_k(p)$ s.t. $\\|p\\|\\le\\Delta$。\n4. ratio $\\rho=f(x_k+p)-f(x_k)/m_k(0)-m_k(p)$ 决定 $\\Delta$ 调整。\n5. 比较全局收敛保证。`
              : page <= 72
                ? `**Walkthrough：ℓ1 prox 软阈值**\n\n1. $g(x)=\\lambda\\|x\\|_1$，prox$_\\alpha g$ 逐分量。\n2. $S_\\lambda(z)=\\mathrm{sign}(z)\\max(|z|-\\lambda,0)$。\n3. ISTA：$x_{k+1}=S_{\\alpha\\lambda}(x_k-\\alpha A^\\top(Ax_k-b))$。\n4. 观察稀疏模式出现迭代次数。\n5. 调 $\\alpha=1/L$，$L=\\|A\\|_2^2$。`
                : page <= 83
                  ? `**Walkthrough：FISTA 迭代**\n\n1. 初始化 $t_1=1, x_0=y_0$。\n2. $x_{k+1}=\\mathrm{prox}_{\\alpha g}(y_k-\\alpha\\nabla f(y_k))$。\n3. $t_{k+1}=(1+\\sqrt{1+4t_k^2})/2$。\n4. $y_{k+1}=x_{k+1}+\\frac{t_k-1}{t_{k+1}}(x_{k+1}-x_k)$。\n5. 绘制 $f(x_k)-f^*$ 与 $O(1/k^2)$ 参考线。`
                  : `**Walkthrough：ADMM for LASSO**\n\n1. 分裂 $x=z$，约束 $x-z=0$。\n2. x-更新：解 $(A^\\top A+\\rho I)x=A^\\top b+\\rho(z-u)$。\n3. z-更新：软阈值 $z=S_{\\lambda/\\rho}(x+u)$。\n4. u-更新：$u=u+x-z$。\n5. 监控 $\\|x-z\\|$ 与目标值。`,
    misconceptions: `1. **「凸优化 = 所有优化问题」**：深度学习损失一般非凸；凸理论提供可解性与下界基准。\n2. **「KKT 总是充要」**：需凸问题+约束品性；非凸只有必要条件。\n3. **「Newton 总是更快」**：每步 $O(n^3)$ 且需正定 Hessian；大规模用 L-BFGS/一阶法。\n4. **「ADMM 一定收敛到全局最优」**：凸问题有理论；非凸仅实践有效，需监控残差。\n5. **「步长越大越好」**：违反 Armijo 可能不下降；光滑问题 $\\alpha>2/L$ 可发散。`,
    quiz: `1. **本讲核心考点？**  \n   **答**：${exam}。\n\n2. **本讲在 101 讲中的模块？**  \n   **答**：${ch.name}（${ch.range}）。\n\n3. **关键假设是什么？**  \n   **答**：${ch.num <= 4 ? '凸集/凸函数/问题形式正确识别' : ch.num <= 7 ? '约束品性（Slater/LICQ）与可微性' : ch.num <= 11 ? 'f 光滑或 Lipschitz，Hessian 近似正定' : 'f 与 g 可分裂，prox 可高效计算'}。\n\n4. **与上/下讲关系？**  \n   **答**：${prev ? `承接「${prev}」` : '课程起点'}；${next ? `铺垫「${next}」` : '课程总结'}。\n\n5. **30 分钟复习计划？**  \n   **答**：速览 + 图解 + Walkthrough 手算一遍 + 自测 Q1/Q3。`,
    checklist: `- [ ] 手推本讲 1 个核心公式或算法迭代式\n- [ ] 对照教材 ${ch.name} 完成 1 道习题\n- [ ] 用 CVXPY/MATLAB 复现 1 个最小例子\n- [ ] 在 Obsidian 画本讲概念图\n- [ ] 向同学 2 分钟口述本讲定理`,
    furtherReading: `- 文再文《最优化：建模、算法与理论》${ch.name}\n- Boyd & Vandenberghe *Convex Optimization* 对应章节\n- Nocedal & Wright *Numerical Optimization*\n- [华文慕课北大最优化课程](https://www.bilibili.com/video/BV1Kc411i7kJ)`,
    mermaid: mermaidByCh[ch.num] || `flowchart TD\n  IN[本讲输入] --> CORE[${st}]\n  CORE --> OUT[理论/算法结论]`,
    extraDetail: page === 101
      ? `### 全课知识地图复盘\n\n| 模块 | 讲次 | 核心输出 |\n|------|------|----------|\n| 绪论 | P01–P05 | 建模、基本概念 |\n| 凸集/函数 | P06–P16 | 凸性判定 |\n| 凸优化/对偶 | P17–P32 | LP/SOCP/SDP、KKT |\n| 最优性 | P33–P39 | Farkas、CQ |\n| 一阶/二阶 | P40–P66 | GD、Newton、BFGS |\n| prox/FISTA | P67–P83 | 稀疏优化加速 |\n| ALM/ADMM | P84–P101 | 分裂与分布式 |\n\n建议期末复习：每章闭卷写 1 个定理 + 1 个算法伪代码。`
      : `### 深化理解（${st}）\n\n**证明技巧**：本讲典型用 ${ch.num <= 4 ? '凸性不等式/Jensen' : ch.num <= 7 ? '分离超平面/Farkas' : ch.num <= 11 ? '下降引理/Zoutendijk' : '不动点/单调算子'}。\n\n**工程选型**：${ch.num >= 16 ? '结构大规模用 ADMM；光滑无约束用 L-BFGS；非光滑复合用 FISTA。' : ch.num >= 8 ? '大规模稀疏：FISTA/ADMM；中小规模高精度：内点法/Newton。' : '先判定凸性，再选建模形式（SOCP/SDP 松弛）。'}\n\n**作业建议**：对照教材例题，将 Walkthrough 步骤与 official solution 逐步对齐。`,
    videoMap: `| 视频段落（约） | 预期内容 | 笔记章节 |\n|-------------|---------|----------|\n| 开篇 0%–15% | 本讲目标、章节位置 | 本节位置、速览 |\n| 前段 15%–40% | 定义、定理陈述 | 零基础导读、详细讲解 |\n| 中段 40%–70% | 证明 sketch、例题 | 图解、Walkthrough |\n| 后段 70%–90% | 算法演示、易错点 | 误区、Checklist |\n| 收尾 90%–100% | 总结、延伸 | 延伸阅读、自测题 |\n\n> 本集主题「${st}」。API 无外挂字幕，以分 P 标题与板书对齐。`,
  };
}

// Generate chapter knowledge files
const byChapter = {};
data.parts.forEach((p) => {
  const ch = chapterOf(p.page);
  if (!byChapter[ch.id]) byChapter[ch.id] = { meta: ch, pages: {} };
  byChapter[ch.id].pages[p.page] = buildKnowledge(p.page, p.part);
});

Object.entries(byChapter).forEach(([id, { meta, pages }]) => {
  const keys = Object.keys(pages).sort((a, b) => Number(a) - Number(b));
  const lines = keys.map((k) => {
    const v = pages[k].replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    return `  ${k}: \`${v}\`,`;
  });
  const content = `/** ${meta.name} - build-opt-content.js */\nmodule.exports = {\n${lines.join('\n')}\n};\n`;
  fs.writeFileSync(path.join(OUT, `opt-${id}.js`), content, 'utf8');
  console.log(`Wrote opt-${id}.js (${keys.length} pages)`);
});

// opt-knowledge.js index
const chIds = Object.keys(byChapter).sort();
const assignParts = chIds.map((id) => `  require('./opt-${id}')`).join(',\n');
fs.writeFileSync(
  path.join(OUT, 'opt-knowledge.js'),
  `/** Merge all opt-knowledge chapters */\nmodule.exports = Object.assign(\n  {},\n${assignParts}\n);\n`,
  'utf8'
);
console.log('Wrote opt-knowledge.js');

// tutorial detail
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
  return `/** 北大文再文最优化 - build-opt-content.js */\nmodule.exports = {\n${parts.join('\n')}\n};\n`;
}

fs.writeFileSync(path.join(OUT, 'opt-tutorial-detail.js'), serializeDetailModule(detailObj), 'utf8');
console.log(`Wrote opt-tutorial-detail.js (${Object.keys(detailObj).length} pages)`);
