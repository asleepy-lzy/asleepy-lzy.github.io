---
title: Polyak步长
published: 2025-08-31
description: "Grandient Descent leaning note"
tags: [study, Convex Optimaization]
category: Study
draft: false
---
# MDD
## 问题形式

### 原问题（Primal）

$$
\begin{aligned}
\min_{\{(x_i,y_i)\}_{i=1}^I}\quad 
& \sum_{i=1}^I \big((c_i^{x})^\top x_i + (c_i^{y})^\top y_i\big) \\
\text{s.t.}\quad 
& \sum_{i=1}^I A_i^{x}\,x_i\;+\;\sum_{i=1}^I A_i^{y}\,y_i\;-\;b \;=\; 0,\\
& \{x_i,y_i\}\in \mathcal{F}_i,\ \ i=1,\ldots,I.
\end{aligned}
$$



### 拉格朗日对偶（Dual）

放松耦合约束后，对偶最大化问题：

$$
\max_{\lambda\in\mathbb{R}^m}\ q(\lambda),
$$

其中

$$
q(\lambda)\;=\;\min_{(x,y)}\ \Big\{\,L(x,y,\lambda)\ :\ \{x_i,y_i\}\in\mathcal{F}_i,\ i=1,\ldots,I\,\Big\},
$$

拉格朗日函数为

$$
L(x,y,\lambda)\;=\;\sum_{i=1}^I (c_i^{x})^\top x_i\;+\;\sum_{i=1}^I (c_i^{y})^\top y_i\;+\;
\lambda^\top\!\Big(\sum_{i=1}^I A_i^{x}x_i+\sum_{i=1}^I A_i^{y}y_i-b\Big).
$$

对每个子系统 $i$：

$$
\min_{x_i,y_i}\ \ (c_i^{x})^\top x_i + (c_i^{y})^\top y_i + \lambda^\top\!\big(A_i^{x}x_i + A_i^{y}y_i\big)
\quad \text{s.t. } \{x_i,y_i\}\in\mathcal{F}_i.
$$

这是对偶函数内层极小的分解形式。&#x20;

## 算法流程
### 核心循环（min 问题，等式耦合）

**记号**
$L(x,y,\lambda)=\sum_{i=1}^I (c_i^{x})^\top x_i+(c_i^{y})^\top y_i+\lambda^\top\!\Big(\sum_i A_i^{x}x_i+\sum_i A_i^{y}y_i-b\Big)$
$g_k:=\sum_i A_i^{x}\tilde x_{i,k}+\sum_i A_i^{y}\tilde y_{i,k}-b$（对偶函数在 $\lambda_k$ 的次梯度）
当前 **level（对偶最优值上估）** 记为 $q_j$，安全因子 $\zeta\in(0,1)$，$\gamma\in(0,1)$。

**初始化**：给 $\lambda_0$，设 $q_0=+\infty$（或启发式上估），令 $q_{\max}=-\infty$，阶段计数 $j=0$。

**for $k=0,1,2,\dots$**
在 $\lambda_k$ 下解松弛/子问题，得 $(\tilde x_k,\tilde y_k)$，并尽量满足

$$
L(\tilde x_k,\tilde y_k,\lambda_k)\ \le\ L(\tilde x_{k-1},\tilde y_{k-1},\lambda_k)\quad(\text{代理最优性}).
$$

2\)（步长，Level-Polyak）

$$
\boxed{\ s_k=\zeta\,\gamma\;\frac{\,q_j-L(\tilde x_k,\tilde y_k,\lambda_k)\,}{\|g_k\|^2}\ }
\qquad(\text{若分母为 }0\text{ 则可提前终止})
$$

3\)（**$\lambda$** 的更新公式）

$$
\boxed{\ \lambda_{k+1}=\lambda_k+s_k\,g_k\ }
$$


4\)（统计用于下一次上调 level 的候选值）

$$
q_{\text{cand},k}\;=\;\frac{s_k}{\gamma}\,\|g_k\|^2+L(\tilde x_k,\tilde y_k,\lambda_k),\qquad
q_{\max}\leftarrow\max\{q_{\max},\ q_{\text{cand},k}\}.
$$

5\)（MDD 触发检测，滑窗在线判定）
把

$$
2(\lambda-\lambda_t)^\top g_t\ \ge\ s_t\|g_t\|^2,\quad t\in\text{当前阶段窗口}
$$

逐条加入，检查是否**存在**某 $\lambda$ 使这些不等式全成立（LP 可行性）。

* 若**不可行** ⇒ **上调 level**：$q_{j+1}\leftarrow q_{\max}$，清空 $q_{\max}=-\infty$，阶段号 $j\leftarrow j+1$，窗口重置；
* 若可行 ⇒ 继续追加下一步约束与迭代。

6\)（停止条件，任取其一）

* 相对间隙：$\dfrac{UB-q(\lambda_k)}{UB}\le\varepsilon$（$UB$ 为当前最好可行解值）；
* 步长/梯度足够小或迭代/时间上限到达。

**输出**：最佳对偶下界 $\max_\tau q(\lambda_\tau)$ 与最好可行上界 $UB$。

---

### 核心——“界”的更新和检测

#### MDD

给定上次 level 调整时刻 $k_j$ 与窗口长度 $n_j$，判定是否**存在** $\lambda\in\mathbb{R}^m$ 使得


$$
\exists\,\lambda\in\mathbb{R}^m\ \text{s.t.}\ 
\left\{
\begin{aligned}
\|\lambda-\lambda_{k_j+1}\|_2 &\le \|\lambda-\lambda_{k_j}\|_2,\\
\|\lambda-\lambda_{k_j+2}\|_2 &\le \|\lambda-\lambda_{k_j+1}\|_2,\\
&\ \vdots\\
\|\lambda-\lambda_{k_j+n_j}\|_2 &\le \|\lambda-\lambda_{k_j+n_j-1}\|_2.
\end{aligned}
\right.
$$


把更新式 $\lambda_{t+1}=\lambda_t+s_t g_t$ 代入并展开，就得到线性不等式组：
$$
\exists\,\lambda\in\mathbb{R}^m\ \text{s.t.}\ 
\left\{
\begin{aligned}
2(\lambda-\lambda_{k_j})^\top g_{k_j} &\ge s_{k_j}\,\|g_{k_j}\|^2,\\
2(\lambda-\lambda_{k_j+1})^\top g_{k_j+1} &\ge s_{k_j+1}\,\|g_{k_j+1}\|^2,\\
&\ \vdots\\
2(\lambda-\lambda_{k_j+n_j-1})^\top g_{k_j+n_j-1} &\ge s_{k_j+n_j-1}\,\|g_{k_j+n_j-1}\|^2.
\end{aligned}
\right.
$$

若上式不等式组**不可行**，则窗口内必有某步 $\kappa$ 的步长违反了 Polyak 上界（式 (16)），这触发 level 更新。


因此 MDD 可作为**LP 可行性检查**逐步在线求解。

#### 由 MDD 触发的 level 更新
MDD 不可行 ⇒ 至少有一步**违反**上界

当窗口的 MDD 判**不可行**时，意味着存在某个 $\kappa$ 使 (C) 被**违反**：

$$
s_\kappa\ \ge\ \gamma\,\frac{q^\star-L_\kappa}{\|g_\kappa\|^2}.
$$


$$
\boxed{\ q^\star\ \le\ \underbrace{\frac{1}{\gamma}\,s_\kappa\|g_\kappa\|^2+L_\kappa}_{=:~U_\kappa}\ } 
$$

这就是**一步产生的“候选新上界”**。
为了稳妥，取窗口里所有候选的**最大值**作为新 level：

$$
\boxed{\ q_{j+1}=\max_{\kappa\in\text{窗口}} U_\kappa\ } \tag{F}
$$

这样保证 $q^\star\le q_{j+1}$，且自然有 $q_{j+1}\le q_j$（level 单调下降）。


把 $q_j$ 作为**新的 level**（它严格大于 $(\lambda^*)$ 的上估）。之后步长用

$$
s_k=\zeta\,\gamma\,\frac{\,q_j-L(\tilde x_k,\tilde y_k,\lambda_k)\,}{\|g_k\|^2},\quad \zeta<1,
\tag{21}
$$

> 说明：因为“有一步过大 ⇒ 存在 $\kappa$ 使 $q^\star\le U_\kappa$”，而 $q_{\max}\ge U_\kappa$，故更新后依然有 $q^\star\le q_{j+1}$。同时 $q_{j+1}\le q_j$，所以 level **单调不增**，步长随之变小更稳。





# PSADLA

好的。下面把你上传论文的**第 2.1 节**（Polyak 步长的“违例检测器”与 level 调整）核心内容按条目写出来，并给出原文公式编号。

## PSVD

## 关键引理

* **引理 2.1（步长过大的判别）**
  若在 $x_k$ 处的次梯度为 $g_k$，且步长 $s_k$ **不满足**不等式

  $$
  g_k^\top x^\star \;\le\; g_k^\top x_k \;-\; \frac{1}{\bar\gamma}\, s_k \,\|g_k\|^2, \tag{10}
  $$

  （其中 $x^\star\in X^\star$），则必有

  $$
  s_k \;>\; \bar\gamma\; \frac{f(x_k)-f^\star}{\|g_k\|^2}. \tag{11}
  $$

  换言之，(10) 被违反就意味着步长超过了 $\bar\gamma (f(x_k)-f^\star)/\|g_k\|^2$。

* **引理 2.2（由“违例”构造更紧的 level）**
  若第 $k$ 次迭代采用基于 level $\bar f_k$ 的 Polyak 步长（式(7)），且 (10) 被违反，则可更新出**更紧**的 level：

  $$
  \bar f' \;=\; \frac{\gamma}{\bar\gamma}\,\bar f_k \;+\; \Big(1-\frac{\gamma}{\bar\gamma}\Big) f(x_k), \tag{13}
  $$

  并且满足

  $$
  \bar f_k \;<\; \bar f' \;<\; f^\star. \tag{14}
  $$


## PSVD 约束可行性问题与 level 更新

* **定理 2.3（PSVD 与触发规则）**
  在一次 level 固定的阶段 $k(j),\ldots,k(j)+\eta$ 上，建立下面的**线性**可行性判定问题（决策变量 $x\in\mathbb R^n$）：

  $$
  \left\{
  \begin{aligned}
  g_{k(j)}^\top x &\le g_{k(j)}^\top x_{k(j)}-\frac{1}{\bar\gamma}s_{k(j)}\|g_{k(j)}\|^2,\\
  g_{k(j)+1}^\top x &\le g_{k(j)+1}^\top x_{k(j)+1}-\frac{1}{\bar\gamma}s_{k(j)+1}\|g_{k(j)+1}\|^2,\\
  &\ \vdots\\
  g_{k(j)+\eta}^\top x &\le g_{k(j)+\eta}^\top x_{k(j)+\eta}-\frac{1}{\bar\gamma}s_{k(j)+\eta}\|g_{k(j)+\eta}\|^2.
  \end{aligned}\right. \tag{17}
  $$

  若 (17) **不可行**，则存在 $\kappa\in\{k(j),\ldots,k(j)+\eta\}$ 使

  $$
  s_\kappa \;>\; \bar\gamma\;\frac{f(x_\kappa)-f^\star}{\|g_\kappa\|^2}, \tag{18}
  $$

  因而可把 level 更新为

  $$
  \boxed{\;\bar f' \;=\; \frac{\gamma}{\bar\gamma}\,\bar f_{k(j)+\eta} \;+\; \Big(1-\frac{\gamma}{\bar\gamma}\Big)\min_{\kappa\in\{k(j),\ldots,k(j)+\eta\}} f(x_\kappa)\;}, \tag{19}
  $$

  并保证

  $$
  \bar f_{k(j)+\eta} \;<\; \bar f' \;<\; f^\star. \tag{20}
  $$

  这给出了**触发条件**（PSVD 不可行）与**level 更新公式**。

* **补充**：可把任何 $x^\star$ 满足的线性不等式加入 (17) 以增强检测（例如对对偶变量有 $x\ge0$ 时可加入该约束）。


## PSADLA完整算法流程

**输入**：初始点 $x_0$、初始 level $ \bar f_0<f^\star$，参数 $0<\gamma<\bar\gamma<2$。初始化 $k=0$。

**循环（直到满足停机条件）**：

1. **次梯度更新**
   计算次梯度 $g_k\in\partial f(x_k)$，取 Polyak-level 步长

$$
s_k \;=\; \gamma\,\frac{f(x_k)-\bar f_k}{\|g_k\|^2},
$$

并做投影步：

$$
x_{k+1}\;=\;P_X\!\bigl(x_k - s_k\,g_k\bigr).
$$

（步长公式见式(7)；这两行就是算法 Step 2。） &#x20;

2. **PSVD 触发器维护（线性可行性判定）**
   把一条“半空间”约束加入 PSVD 系统：

$$
g_k^\top x \;\le\; g_k^\top x_k \;-\; \frac{1}{\bar\gamma}\,s_k\,\|g_k\|^2,
$$

并与窗口内历史迭代的同类约束联立（这组线性不等式就是式(17)）。若 PSVD **可行**，保持 level 不变：$\bar f_{k+1}=\bar f_k$；若 **不可行**，进入第 3) 步做 level 更新并清空这些约束。 &#x20;

3. **Level 动态调整（由“违例”构造更紧 level）**
   当 PSVD 不可行时，按文中给出的**凸组合**公式更新：

$$
\boxed{\ \bar f' \;=\; \frac{\gamma}{\bar\gamma}\,\bar f_{k(j)+\eta}\;+\;\Bigl(1-\frac{\gamma}{\bar\gamma}\Bigr)\,
\min_{\kappa\in\{k(j),\dots,k(j)+\eta\}} f(x_\kappa)\ },
$$

并保证
$\bar f_{k(j)+\eta}<\bar f'<f^\star$。更新后清空 PSVD 约束、继续迭代。 （对应式(19)–(20) 与算法 Step 3；其构造来自引理 2.1–2.2。）  &#x20;

4. **停机判据**
   若满足其一则停：
   $\min_{\kappa\le k} f(x_\kappa)-\bar f_k<\varsigma$（best-so-far 与 level 的差足够小）；或达到迭代/时限上限。否则 $k\!\leftarrow\!k+1$ 回到 1)。 （算法 Step 4。）&#x20;

---







