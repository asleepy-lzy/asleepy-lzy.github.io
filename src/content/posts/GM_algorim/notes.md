---
title: 梯度下降法
published: 2025-08-16
description: "Grandient Descent leaning note"
tags: [study, Convex Optimaization]
category: Study
draft: false
---



#  次梯度与梯度


## 支撑超平面

设 $C \subseteq \mathbb{R}^n$ 是一个凸集。如果存在一个超平面 $H$，使得：

* $H$ **包含某个边界点 $x_0 \in C$**
* 且 $H$ 的一侧包含整个集合 $C$

那么称 $H$ 是集合 $C$ 在点 $x_0$ 处的**支撑超平面（supporting hyperplane）**。

更具体地，如果存在一个向量 $g \in \mathbb{R}^n$，使得对所有 $x \in C$，有：

$$
\langle g, x - x_0 \rangle \le 0
$$

那么这个 $g$ 就是该支撑超平面的**法向量**，称为**支撑法向量（supporting normal vector）**。



## 次梯度（Subgradient）的定义

**定义**：若 $f$ 是凸函数，$g \in \mathbb{R}^n$ 满足：

$$
f(x) \ge f(x_0) + \langle g, x - x_0 \rangle, \quad \forall x
$$

则 $g$ 是 $f$ 在 $x\_0$ 处的一个**次梯度**。

所有满足该不等式的 $g$ 构成次梯度集合，记作：

$$
\partial f(x_0) = \{ g \in \mathbb{R}^n \mid f(x) \ge f(x_0) + \langle g, x - x_0 \rangle, \forall x \}
$$

* $g$ 就是支撑法向量；


---

## 梯度是次梯度的特例

如果函数 $f$ 在 $x_0$ 可导，那么唯一存在的梯度 $\nabla f(x\_0)$ 也满足上面的不等式，并且是唯一的。

因此：

$$
\text{若 } f \text{ 可导} \quad \Rightarrow \quad \partial f(x_0) = \{ \nabla f(x_0) \}
$$

换句话说，**梯度是可微函数下唯一的支撑法向量**。



# 步长选择
## 固定步长(Constant Stepsize）



### 基本定义与更新规则

在使用梯度下降或次梯度方法时，固定步长形式为：

$$
x_{k+1} = x_k - \alpha g_k
$$

其中：

* $\alpha > 0$：为固定不变的步长
* $g_k \in \partial f(x_k)$：为函数 $f$ 在 $x_k$ 处的梯度或次梯度

适用于 **凸优化或非光滑优化中的次梯度法**。

---

### 收敛性推导（凸函数）

设目标函数 $f: \mathbb{R}^n \to \mathbb{R}$ 是**凸函数**，且存在全局最优解 $x^* \in \arg\min f(x)$。

若 $f$ 的所有次梯度满足：

$$
\|g_k\| \le G, \quad \forall k
$$

我们希望分析：

$$
\min_{0 \le t < k} f(x_t) - f(x^*) \le ?
$$

### 推导过程：

考虑一次更新：

$$
\|x_{k+1} - x^*\|^2 = \|x_k - \alpha g_k - x^*\|^2 = \|x_k - x^*\|^2 - 2\alpha \langle g_k, x_k - x^* \rangle + \alpha^2 \|g_k\|^2
$$

由于 $f$ 是凸函数：

$$
f(x_k) - f(x^*) \le \langle g_k, x_k - x^* \rangle
$$

带入上式得：

$$
\|x_{k+1} - x^*\|^2 \le \|x_k - x^*\|^2 - 2\alpha (f(x_k) - f(x^*)) + \alpha^2 G^2
$$

两边求和得：

$$
\|x_{k+1} - x^*\|^2 \le \|x_0 - x^*\|^2 - 2\alpha \sum_{t=0}^{k} (f(x_t) - f(x^*)) + (k+1)\alpha^2 G^2
$$

整理得：

$$
\frac{1}{k+1} \sum_{t=0}^{k} (f(x_t) - f(x^*)) \le \frac{\|x_0 - x^*\|^2}{2\alpha(k+1)} + \frac{\alpha G^2}{2}
$$

因此，平均函数值收敛至最优值附近，误差由步长控制：

$$
\min_{t < k} f(x_t) - f(x^*) \le \boxed{\frac{D^2}{2\alpha k} + \frac{\alpha G^2}{2}}
$$

* 其中 $D = \|x_0 - x^*\|$

---

### 收敛性总结

| 条件                           | 是否满足 |
| ---------------------------- | ---- |
| 凸函数（非光滑可用次梯度）                | ✅    |
| 梯度有界（$ \|g_k\| \le G $） | ✅    |
| 误差收敛到某一邻域                    | ✅    |
| **收敛到最优解**（即误差为 0）           | ❌    |

 **注意**：由于步长固定，最终会停留在距离最优值一定范围内的“误差球”中，**无法精确收敛到最优值**。


###  优点

| 优点         | 说明             |
| ---------- | -------------- |
| 简单实现       | 不需要每步重新计算步长    |
| 稳定性好       | 若取值合适，不易震荡     |


---

### 缺点（重点）

| 缺点            | 影响                                      |
| ------------- | --------------------------------------- |
| **不能收敛到最优值**  | 只到最优值附近的邻域      |
| 步长选得大 → 发散或震荡 | 不能用于非强凸或病态问题                            |
| 步长选得小 → 非常慢   | 整体迭代进展极慢，需大量轮数                          |



### 步长

* 对于 Lipschitz 连续的凸函数（\\( L \\) 为 Lipschitz 常数）：

$$
0 < \alpha < \frac{2}{L}
$$


## 衰减步长

**衰减步长**是指随着迭代次数 $k$ 增加，步长 $\alpha_k$ 逐渐减小趋近于零的方法。

典型形式：

$$
\alpha_k = \frac{c}{k},\quad \text{或更一般地：} \quad \alpha_k = \frac{c}{k^\beta},\quad \beta \in (0.5, 1]
$$

其中：

* $c > 0$：初始尺度因子；
* $\beta$：控制衰减速率。

---

### 收敛条件（Robbins-Monro 条件）

衰减步长满足以下两个条件可确保函数值收敛：

1. **无限大但总能进步**（保证不会“收得太快”）：

   $$
   \sum_{k=1}^\infty \alpha_k = \infty
   $$

2. **平方和有限**（保证振荡不至于爆炸）：

   $$
   \sum_{k=1}^\infty \alpha_k^2 < \infty
   $$

符合这两个条件的步长序列（例如 $\alpha_k = \frac{1}{k}$, $\alpha_k = \frac{1}{\sqrt{k}}$）可确保函数值收敛。


### 收敛性推导（凸函数 + 有界次梯度）

#### 假设：

* 函数 $f: \mathbb{R}^n \to \mathbb{R}$ 为凸函数
* 存在最优解 $x^* \in \arg\min f(x)$
* 每次迭代的次梯度 $g_k \in \partial f(x_k)$ 有界：

  $$
  \|g_k\| \leq G
  $$
* 使用衰减步长 $\alpha_k$

考虑如下更新：

$$
x_{k+1} = x_k - \alpha_k g_k
$$

使用欧几里得距离收缩展开：

$$
\|x_{k+1} - x^*\|^2 = \|x_k - x^*\|^2 - 2\alpha_k \langle g_k, x_k - x^* \rangle + \alpha_k^2 \|g_k\|^2
$$

由凸函数定义：

$$
f(x_k) - f(x^*) \leq \langle g_k, x_k - x^* \rangle
$$

代入得：

$$
2\alpha_k (f(x_k) - f(x^*)) \leq \|x_k - x^*\|^2 - \|x_{k+1} - x^*\|^2 + \alpha_k^2 G^2
$$

将不等式两边求和：

$$
2\sum_{k=1}^K \alpha_k (f(x_k) - f^*) \leq \|x_1 - x^*\|^2 + G^2 \sum_{k=1}^K \alpha_k^2
$$

记平均函数值：

$$
f^{\text{avg}}_K := \frac{\sum_{k=1}^K \alpha_k f(x_k)}{\sum_{k=1}^K \alpha_k}
$$

结合 Jensen 不等式得到：

$$
f^{\text{avg}}_K - f^* \leq \frac{\|x_1 - x^*\|^2 + G^2 \sum_{k=1}^K \alpha_k^2}{2 \sum_{k=1}^K \alpha_k}
$$

由于：

* 分母发散（由 $\sum \alpha_k = \infty$）
* 分子有界（由 $\sum \alpha_k^2 < \infty$）

得：

$$
f^{\text{avg}}_K \to f^*, \quad \text{即平均函数值收敛}
$$


###  优点

* 简单易实现
* 不依赖目标函数值或 Lipschitz 常数

###  缺点

* 收敛速度慢，尤其是后期精度提升困难
* 需要手动调节超参数（起始步长、衰减率）


## Polyak步长
### 论文
Polyak, B. T. (1969). Minimization of unsmooth functionals. USSR Computational Mathematics and Mathematical Physics, 9(3), 14–29.
### 算法
我们希望最小化一个凸函数 $f: \mathbb{R}^n \to \mathbb{R}$：

$$
\min_{x \in \mathbb{R}^n} f(x)
$$

设：

* 最优解存在，最优值记为 $f^*$
* 当前迭代点为 $x\_k$，取次梯度 $g_k \in \partial f(x_k)$
* 使用 Polyak 步长：

  $$
  \alpha_k = \frac{f(x_k) - f^*}{\|g_k\|^2}
  $$


## Level-based Polyak stepsize（目标层次法）

### 论文
Liu A, Bragin M A, Chen X, Guan X. Accelerating level-value adjustment for the Polyak stepsize[J]. arXiv preprint arXiv:2311.18255, 2025.

---

### Path-based level adjustment（路径式校正）


* **level 的构造**：在第 $k$ 次迭代，用“迄今最好值”减一个正偏移量来当作 $f^\star$ 的估计：

  $$
  \bar f_k \;=\; f_{\min}(k) \;-\; \delta_k,\quad \delta_k>0,
  $$

  其中 $f_{\min}(k)=\min_{0\le i\le k} f(x_i)$；步长按 Polyak 公式的“替代版”

  $$
  s_k=\frac{\gamma\,(f(x_k)-\bar f_k)}{\|g_k\|^2},\;0<\gamma<\bar\gamma<2.
  $$

  文中对 path-based 的概述明确指出：$\bar f_k$ 由“最好目标值”加上正参数 $\delta_k$ 的**偏移**构成（本质上比最好值再低一点，避免步长为零）。
* **振荡/停滞的判据**：若目标值“下降不足”，且**解路径长度**超过阈值 $B$（预先给定），就认为当前 $\bar f_k$ 过低导致步长偏大，于是**减小 $\delta_k$**（把 level 调高一些），以抑制震荡并恢复下降。



* **优点**：直观、落地简单；通过“最好值—偏移”构造 level，结合“路径过长 + 下降不足”触发调节，容易在工程里实现。
* **不足**：依赖问题相关的**超参数选择**（初始 $\delta_0$、路径长度阈值 $B$ 等），对性能影响大、问题相关性强；需要调参。

---

#### Decision-guided level adjustment（SDD/MDD，决策引导校正）




## **Volume Algorithm（VA）步长**

---
### 论文

Barahona F, Anbil R. The volume algorithm: producing primal solutions with a subgradient method[J]. Mathematical Programming, Series A, 2000, 87(3): 385-399. DOI:10.1007/s101070000134.
### 定义

* 线性规划（经 Dantzig–Wolfe 变换后的主问题）等价的**对偶**为

  $$
  \max_{z,\ \pi}\ z \quad \text{s.t.}\ z+\pi(A g_i-b)\le c g_i\quad(\forall i)
  $$
* **定价/拉格朗日子问题**：给定对偶 $\pi$，解

  $$
  \min_{x}\ z=(c-\pi A)x+\pi b\quad\text{s.t. } Dx=e,\ x\ge0
  $$

  得到 $x$ 与 $z$。**次梯度**为 $v=b-Ax$。

---

### 算法变量

* $\pi$：当前对偶向量；$\bar\pi$：近来“最好”的对偶；
* $x$：本轮子问题的解；$\bar x$：**体积中心**（历史解的凸组合）；
* $z$：本轮对偶值（子问题目标值）；$\bar z$：至今最大对偶值；
* $v=b-A\bar x$：以体积中心计算的次梯度；
* $\alpha\in(0,1]$：更新体积中心的权重；$\,f\in(0,2)$：步长系数；
* $\mathrm{UB}$：当前最好**原可行上界**；$\varepsilon>0$：数值保护。

---
### 算法流程
#### 初始化

1. 取初始 $\bar\pi$；解一次子问题(6)得 $\bar x,\ \bar z$。
2. 设置：$\pi\leftarrow\bar\pi$，$\ v\leftarrow b-A\bar x$，$\ f\in(0,2)$（如 $f=1$），$\ \alpha_{\max}\approx 0.1$。
3. 若有原可行解则设 $\mathrm{UB}$；否则 $\mathrm{UB} \leftarrow +\infty$。

---

#### 主循环（每轮包含“次迭代 + 可能的主更新”）

###### 1) 用体积中心的次梯度计算步长（原文式(7)）

$$
s \;=\; f\ \frac{\mathrm{UB}-\bar z}{\|v\|_2^2+\varepsilon}
$$

> 说明：若有不等式约束且对偶需 $\pi\ge0$，更新后需对 $\pi$ 做**非负投影**。

###### 2) 对偶试探更新

$$
\pi^{\text{trial}} \leftarrow \operatorname{Proj}_{\pi\ge0}\big(\bar\pi + s\,v\big)
$$

###### 3) 解子问题(6)

* 用 $\pi^{\text{trial}}$ 解(6)，得 $x^{\text{trial}},\ z^{\text{trial}}$。

###### 4) 体积中心（凸组合）更新

* 令 $v^{\text{trial}}=b-Ax^{\text{trial}}$，$ \bar v=b-A\bar x$。
* 计算

  $$
  \alpha_{\text{opt}}=\arg\min_{\alpha\in\mathbb R}\big\|\alpha v^{\text{trial}}+(1-\alpha)\bar v\big\|_2
  $$

  若 $\alpha_{\text{opt}}<0$，取 $\alpha=\alpha_{\max}/10$；否则 $\alpha=\min\{\alpha_{\text{opt}},\alpha_{\max}\}$。
* 更新体积中心：

  $$
  \bar x \leftarrow \alpha\,x^{\text{trial}}+(1-\alpha)\,\bar x
  $$

##### 5) “主更新”判定

* 若 $z^{\text{trial}}>\bar z$（**找到更好的对偶值**）：

  $$
  \bar\pi\leftarrow \pi^{\text{trial}},\quad \bar z\leftarrow z^{\text{trial}}
  $$

  （称为一次 **major iteration**）
* 否则只完成一次 **minor iteration**（不刷新 $\bar\pi,\bar z$）。

###### 6) 步长系数 $f$ 的自适应

* 定义 $d = v^{\text{trial}}\cdot(b-Ax^{\text{trial}})$。
* **分类**：

  * $z^{\text{trial}}>\bar z$ 且 $d\ge0$：**GREEN**（步长合理）→ $f\leftarrow1.1\,f$。
  * $z^{\text{trial}}>\bar z$ 且 $d<0$：**YELLOW**（略偏大）→ $f$ 不变。
  * 否则：**RED**（无改进）→ 记录连续 RED 计数；若达 20 次，则 $f\leftarrow 0.66\,f$、计数清零。
* 同时可设置 $s$ 和 $\alpha$ 的上下界裁剪，避免数值爆炸/停滞。



---
## Bundle / Level method stepsizing
### 论文
Lemaréchal C, Nemirovskii A, Nesterov Y. New variants of bundle methods[J]. Mathematical Programming, 1995, 69: 111–147.
### 要解决的问题

最小化**凸且可非光滑**的 $f:\mathbb{R}^n\to\mathbb{R}$。梯度可能不存在，但**次梯度**存在。

---
### 算法流程

#### 1) Bundle（切平面集合）

在若干历史点 $x_i$ 处取到次梯度 $g_i\in\partial f(x_i)$ 与函数值 $f(x_i)$。用它们组成**切平面模型**（下界）：

$$
m_k(x)=\max_{i\in\mathcal B_k}\ \big\{\, f(x_i)+ g_i^\top(x-x_i)\,\big\}\ \le\ f(x).
$$

这给了一个“**分段线性下界**”。

#### 2) 近端项（prox，稳定器）

单靠 $m_k$ 会不够稳定。在模型上加一个二次近端项来**稳住迭代中心** $\bar x_k$：

$$
\min_x\ m_k(x)+\tfrac{\rho_k}{2}\,\|x-\bar x_k\|^2.
$$

$\rho_k>0$ 越大，步子越小（更稳）；越小，步子越大（更激进）。**这就是步长控制的核心旋钮**。

#### 3) Level 思想（用“水平集”卡住模型）

维护**上界** $U_k=\min_{j\le k} f(x_j)$ 与**模型最优值** $M_k=\min_x m_k(x)$。选一个**水平**：

$$
L_k \;=\; U_k - \theta\big(U_k - M_k\big),\quad \theta\in(0,1),
$$

即把“当前**间隙**” $U_k-M_k$ 按比例压一截。然后解“**投影到水平集**”的近端子问题（典型两种等价形式其一）：

$$
x_k^{\mathrm{trial}}
=\arg\min_{x}\ \tfrac12\|x-\bar x_k\|^2
\quad\text{s.t.}\quad m_k(x)\le L_k.
$$

直觉：不能一味地追求模型最小，而是**在能把下界推到 $L_k$ 的同时**，尽量离当前中心不远。

---

#### 严重步 / 空步（serious / null）

* **严重步（serious step）**：如果试探点让真实函数值有“足够”改进，就**接受它作为新中心**

  $$
  \bar x_{k+1}=x_k^{\mathrm{trial}},\quad U_{k+1}=f(\bar x_{k+1}),
  $$

  并把 $\rho$ 适当**减小**（允许更大步）。
* **空步（null step）**：改进不够，就**保留中心不动** $\bar x_{k+1}=\bar x_k$，仅把 $x_k^{\mathrm{trial}}$ 处的信息（$f, g$）**加入 bundle**，并把 $\rho$ 适当**增大**（更稳）。

判据常用“**足够实际下降**”相对**模型预测下降**（下面给范式）。

---

#### 步长

* 在**经典 bundle**里，“步长”不是一串显式 $\alpha_k$，而是由**近端权重 $\rho_k$** 与（在 level 法中）**水平参数 $\theta$** **共同决定**：

  * **$\rho_k$ 大→步子小、保守；$\rho_k$ 小→步子大、激进。**
  * **$\theta$** 决定**压缩 gap 的力度**：$\theta$ 大→更“贪心”地拉近到上界，可能步子相对激进；$\theta$ 小→保守。
* 严重/空步规则就是**自适应调节 $\rho_k$** 与**刷新 bundle**、更新 $U_k$、$L_k$ 的机制，本质上就是一种**稳定化的步长调度**。

---

#### 迭代流程

**输入**：当前中心 $\bar x_k$、bundle $\mathcal B_k$、$\rho_k\in[\rho_{\min},\rho_{\max}]$、窗口参数 $\theta\in(0,1)$、足够下降率 $\gamma\in(0,1)$。

1. **构模**：用 $\mathcal B_k$ 建 $m_k(x)$；（可先解一次“prox 模型最小化”拿 $M_k$）
2. **设水平**：$L_k = U_k - \theta(U_k - M_k)$。
3. **求试点**（Level 投影）：

   $$
   x_k^{\mathrm{trial}}=\arg\min_x \tfrac12\|x-\bar x_k\|^2\ \ \text{s.t.}\ \ m_k(x)\le L_k.
   $$

   这通常转化为**小型 QP**/二阶锥问题（模型是“max of lines”）。
4. **评估**：计算 $f(x_k^{\mathrm{trial}})$ 与次梯度 $g_k^{\mathrm{trial}}$。
   记**预测改进** $\mathrm{pred}_k := U_k - L_k = \theta(U_k-M_k)$（或用 $m_k(\bar x_k)-m_k(x_k^{\mathrm{trial}})$）。
5. **判据（严重 or 空步）**：

   * 若

     $$
     f(x_k^{\mathrm{trial}}) \le U_k - \gamma\,\mathrm{pred}_k,
     $$

     **严重步**：$\bar x_{k+1}=x_k^{\mathrm{trial}}$, $U_{k+1}=f(\bar x_{k+1})$，
     并令 $\rho_{k+1} \leftarrow \max(\rho_{\min},\ \tau_{\downarrow}\rho_k)$（如 $\tau_{\downarrow}=0.5$）。
   * 否则 **空步**：$\bar x_{k+1}=\bar x_k$，把 $(x_k^{\mathrm{trial}}, g_k^{\mathrm{trial}}, f(x_k^{\mathrm{trial}}))$ **加入 bundle**，并令 $\rho_{k+1}\leftarrow \min(\rho_{\max},\ \tau_{\uparrow}\rho_k)$（如 $\tau_{\uparrow}=2$）。
6. **收敛判据**：间隙小 $U_k-M_k\le \varepsilon$，或 $\|x_{k+1}-\bar x_k\|$ 很小，或水平难再推进。




## Barzilai–Borwein（BB）步长

### 论文
Barzilai, J., & Borwein, J. M. (1988). Two-point step size gradient methods. IMA Journal of Numerical Analysis, 8(1), 141–148. https://doi.org/10.1093/imanum/8.1.141
### 定义
$$
\min_{x\in\mathbb R^n} f(x),\quad f\in C^1,\ \nabla f \text{ 可计算}.
$$


设

$$
s_k=x_k-x_{k-1},\qquad y_k=g_k-g_{k-1},\qquad g_k=\nabla f(x_k).
$$

* **BB1（更激进）**：$\displaystyle \alpha_{k+1}=\frac{s_k^\top s_k}{s_k^\top y_k}$
* **BB2（更保守）**：$\displaystyle \alpha_{k+1}=\frac{s_k^\top y_k}{y_k^\top y_k}$

更新：$\displaystyle x_{k+1}=x_k-\alpha_k\,g_k$。

> 工程常用：**BB1/BB2 交替**，并对步长做区间护栏 $\alpha\in[\alpha_{\min},\alpha_{\max}]$。

---

### 算法流程

**输入**：起点 $x_0$，初始步长 $\alpha_0>0$，窗口 $M$（如 10），Armijo 常数 $c\in(0,1)$（如 $10^{-4}$），缩步因子 $\tau\in(0,1)$（如 0.5），步长护栏 $[\alpha_{\min},\alpha_{\max}]$（如 $[10^{-8},10^{8}]$），变体 `variant ∈ {BB1, BB2, alt}`。
**初始化**：$g_0=\nabla f(x_0)$，$f_0=f(x_0)$，$k=0$。

**迭代**（k = 0,1,2,…）：

1. **停机检查**：若 $\|g_k\|\le \varepsilon\cdot\max(1,\|x_k\|)$，停止。
2. **试探更新**（当前步长 $\alpha_k$）：

   $$
   x_{k+1}^{\text{trial}}=x_k-\alpha_k\,g_k,\qquad f_{k+1}^{\text{trial}}=f(x_{k+1}^{\text{trial}}).
   $$
3.  **梯度与差分**：
   $g_{k+1}=\nabla f(x_{k+1})$，$s_k=x_{k+1}-x_k$，$y_k=g_{k+1}-g_k$。
4.  **计算下一步长 $\alpha_{k+1}$**：

   * 若 `variant=BB1`：$\displaystyle \alpha_{k+1}=\frac{s_k^\top s_k}{s_k^\top y_k}$
   * 若 `variant=BB2`：$\displaystyle \alpha_{k+1}=\frac{s_k^\top y_k}{y_k^\top y_k}$
5.   **推进**：$k\leftarrow k+1$，回到步骤 1。

---


## Deflected subgradient stepsize

### 算法：Deflected Subgradient

**问题**：$\min_{x\in\mathbb{R}^n} f(x)$，取任意 $g_k\in\partial f(x_k)$。

**输入**：起点 $x_0$，步长序列 $\{\alpha_k>0\}$（外部给定），动量系数 $\beta\in[0,1)$（或给定序列 $\{\beta_k\}$）。

**初始化**：设 $p_{-1}=0$。

**循环 $k=0,1,2,\dots$**：

1. 取次梯度 $g_k\in\partial f(x_k)$。
2. **动量方向**

   $$
   p_k \;=\;(1-\beta)\,g_k \;+\; \beta_k\,p_{k-1}.
   $$

   （可选同义形式：$p_k=-g_k+\beta_k(x_k-x_{k-1})$）
3. **更新**

   $$
   x_{k+1} \;=\; x_k \;+\; \alpha_k\,p_k.
   $$
4. $k\leftarrow k+1$ 继续，直至达到你的停止条件（如迭代上限或 $\|g_k\|$ 足够小）。

### 目的
用惯性把“只看当前次梯度”的生硬走法，变成更平滑、方向更一致的走法，从而在非光滑/狭长谷地里少走回头路、少抖动，通常更快更稳。



## Two-point heuristic stepsize

### 论文：
Carrabs F, Gaudioso M, Miglionico G. A two-point heuristic to calculate the stepsize in subgradient method with application to a network design problem[J]. EURO Journal on Computational Optimization, 2024, 12: 100092–100106. DOI:10.1016/j.ejco.2024.100092.

### 方法核心：NSBB 两点步长（Nonsmooth Barzilai–Borwein）

* 从 BB 方法回顾出发：用两次迭代间的信息近似 Hessian（或其逆），得到经典 BB 步长公式 $\alpha_k=\frac{\|\delta_k\|^2}{\delta_k^\top \gamma_k}$。
* 论文提出：构造二次差值模型

  $$
  h_k(d)=\tfrac12\,u_k\,d^\top d+g_k^\top d
  $$

  并令它在 $d_{k-1}=-\delta_k$ 处等于真实差值 $f(x_{k-1})-f(x_k)$，于是得到

  $$
  u_k=\frac{2\big(f(x_{k-1})-f(x_k)+g_k^\top\delta_k\big)}{\|\delta_k\|^2},\quad
  x_{k+1}=x_k-\frac{1}{u_k}\,g_k .
  $$

  在**严格凸二次**情形下，$\frac{1}{u_k}$ 与 BB 的 $\alpha_k$ 完全一致。
* 写成次梯度法常用的标量序列 $t_k$ 形式：

  $$
  \alpha_k=t_k\|g_k\|,\quad
  t_k=\frac{\|\delta_k\|^2\|g_k\|}{2\big(f(x_{k-1})-f(x_k)+g_k^\top\delta_k\big)} ,
  $$

  并对 $t_k$ 施加安全上下界 $t_m<t_k<t_M$。
* **NSBB 基本算法**（三步）：初始化两点 $x_0,x_1$ 与 $t_m,t_M,k_{\max}$；每次在 $x_k$ 处计算 $f,g_k$ 与 $t_k$ 并截断到区间；更新
  $x_{k+1}=x_k-\frac{t_k}{\|g_k\|}\,g_k$
  并做终止判定。



