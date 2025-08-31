---
title: 梯度下降法-动量类
published: 2025-08-31
description: "Grandient Descent leaning note"
tags: [study, Convex Optimaization]
category: Study
draft: false
---

# 原问题形式与统一记号

## 原问题（可统一覆盖下面几种算法）

* **无约束**：$\displaystyle \min_{x\in\mathbb{R}^n} f(x)$
* **带约束**：$\displaystyle \min_{x\in X} f(x)$，其中 $X\subseteq\mathbb{R}^n$ 闭且凸
  （带约束时，把每步的更新后加投影 $P_X(\cdot)$）

## 常用假设（按需启用）

* **L-光滑**：$\|\nabla f(x)-\nabla f(y)\|\le L\|x-y\|$
* **$\mu$-强凸**：$f(y)\ge f(x)+\nabla f(x)^\top(y-x)+\frac{\mu}{2}\|y-x\|^2$
* **随机/大数据**：有噪声梯度 $g_k\approx\nabla f(x_k)$ 且 $\mathbb{E}[g_k]=\nabla f(x_k)$

## 统一记号

* $x_k$：第 $k$ 次迭代变量
* $g_k$：$\nabla f(x_k)$（或次梯度）
* $\alpha$ / $\alpha_k$：**学习率/步长**（标量基准系数）
* $\beta,\beta_k$：**动量系数**（历史方向权重）
* $v_k,d_k$：动量“速度”/偏转方向
* $P_X$：到集合 $X$ 的投影（带约束时使用）

---

# 1) Heavy-Ball / Momentum（经典动量）

## 更新公式

无约束：

$$
\boxed{
\begin{aligned}
v_{k+1} &= \beta\,v_k + g_k,\\
x_{k+1} &= x_k - \alpha\,v_{k+1}.
\end{aligned}}
$$

带约束：$\;x_{k+1}=\;P_X\!\bigl(x_k-\alpha\,v_{k+1}\bigr)$。

## 参数都是什么意思？

* $\alpha>0$：**基准步长**（越大走得越快，但可能不稳）
* $\beta\in[0,1)$：**动量系数**（越大“惯性”越强，抑摆更好，但易震荡）
* $v_k$：**速度/动量向量**，是梯度的指数滑动平均（低通滤波）

## 适用假设与收敛

* 对 **L-光滑且 $\mu$-强凸** 的 $f$，存在 $(\alpha,\beta)$ 使 **线性收敛**。经典近似最优参数：

  $$
  \alpha^\star=\frac{4}{(\sqrt L+\sqrt\mu)^2},\qquad
  \beta^\star=\Bigl(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\Bigr)^{\!2},\quad \kappa=\frac{L}{\mu}.
  $$
* 不知道 $L,\mu$ 时：用**回溯线搜索**调 $\alpha$，$\beta$ 取 $0.8\sim0.95$。

## 调参实用建议

* 噪声梯度（SGD）下，“**有效步长**”近似 $\alpha/(1-\beta)$。$\beta$ 大时要把 $\alpha$ 适当减小。
* 看到**抖动/发散**：先降 $\alpha$，再小降 $\beta$。

---

# 2) NAG（Nesterov Accelerated Gradient，前瞻动量）

## 两种等价写法（任选其一）

**前瞻点写法（FISTA 风格）**

$$
\boxed{
\begin{aligned}
y_k &= x_k + \beta\,(x_k-x_{k-1}),\\
x_{k+1} &= P_X\!\bigl(y_k-\alpha\,\nabla f(y_k)\bigr).
\end{aligned}}
$$

**速度写法（深度学习常用）**

$$
\boxed{
\begin{aligned}
v_{k+1} &= \beta\,v_k + g_k,\\
x_{k+1} &= x_k - \alpha\bigl(\beta v_{k+1}+g_k\bigr).
\end{aligned}}
$$

## 参数含义

* $\alpha>0$：步长
* $\beta\in[0,1)$：动量系数（常取 0.9–0.99）
* $y_k$：**前瞻点**（先按历史方向“看一眼未来”再取梯度）

## 收敛与调度

* **凸光滑**：用 FISTA 调度

  $$
  t_{k+1}=\tfrac{1+\sqrt{1+4t_k^2}}{2},\quad
  \beta_k=\tfrac{t_k-1}{t_{k+1}},
  $$

  得到 **$O(1/k^2)$** 收敛率（无需强凸）。
* **强凸**：$\alpha\approx 1/L,\ \beta\approx \frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ 可达**线性收敛**。
* **自适应重启**（强推）：若 $f(x_{k+1})>f(x_k)$ 或
  $\langle x_{k+1}-x_k,\ x_k-x_{k-1}\rangle>0$，则把 $\beta$ 置 0（或 $t_k\!=\!1$）重启，震荡明显下降。

---

# 3) SGDM（Stochastic Gradient Descent with Momentum，随机动量）

## 目标场景

**期望风险最小化**：$\min_x \mathbb{E}_\xi[\ell(x;\xi)]$，只能拿到样本小批的**噪声梯度** $g_k$。

## 更新与参数

$$
\boxed{
\begin{aligned}
v_{k+1} &= \beta\,v_k + g_k(\text{mini-batch}),\\
x_{k+1} &= x_k - \alpha_k\,v_{k+1}.
\end{aligned}}
$$

* $\alpha_k$：可常数，也可用**学习率日程**（余弦退火、OneCycle、分段衰减等）
* $\beta$：默认 0.9 很鲁棒；大模型可 0.95–0.99（同步降低 $\alpha_k$）

## 实操建议

* **Warm-up** 前几轮从小到大线性升 $\alpha_k$，再退火；稳定且能用更大峰值 LR。
* 批量、归一化、正则都会改变最佳 $(\alpha,\beta)$；遇到发散先减 $\alpha$。

---

# 4) Deflected Subgradient（偏转/动量式次梯度，非光滑/对偶友好）

## 原问题与动机

当 $f$ **非光滑**（或你在做**拉格朗日对偶**）时，普通动量/NAG 的理论不直接适配。**偏转法**用“梯度-历史方向的凸组合”消除“锯齿摇摆”。

## 更新公式（投影版）

$$
\boxed{
\begin{aligned}
d_0 &= g_0,\\
d_{k+1} &= (1-\theta_k)\,g_{k+1}+\theta_k\,d_k,\quad \theta_k\in[0,\theta_{\max})\subset(0,1),\\
x_{k+1} &= P_X\!\Bigl(x_k-s_k\cdot \frac{d_k}{\|d_k\|}\Bigr).
\end{aligned}}
$$

## 参数都是什么意思？

* $\theta_k$：**偏转/动量权重**（经验取常数 $0.3\sim0.7$）
* $d_k$：**偏转方向**（兼顾当前次梯度与历史方向）
* $s_k$：**步长**。可选：

  * **衰减式**：$s_k\downarrow$ 且 $\sum s_k=\infty,\ \sum s_k^2<\infty$
  * **Polyak 式（基于 gap）**：$s_k=\frac{f(x_k)-f^\star}{\|g_k\|^2}$（$f^\star$ 不知时用 **Level-based/PSVD/SDD** 自动调 level）
  * 带预条件时把 $\|g_k\|^2$ 换成 $\langle g_k, D_k g_k\rangle$

## 重启规则（很关键）

若 $\langle d_k, g_k\rangle\le 0$（偏转方向与梯度“顶牛”），就**重启**：设 $d_k\leftarrow g_k$。这能显著稳住非光滑拐角处的振荡。

## 收敛与适用

* 对凸非光滑问题，配**衰减式步长**得标准 $O(1/\sqrt{k})$ 级别；
* 实务中与 **Level-based Polyak（PSVD/SDD）** 结合尤其稳（你前面用的就是这条线）。

---

# 5) （扩展）Adam / NAdam 属“动量 + 自适应缩放”

> 虽然你问“动量类”，但工程上常把 **Adam/AdamW/NAdam** 也算动量家族的现代分支：在动量（$m_t$）外，再用平方梯度的滑动平均 $v_t$ 做**逐坐标缩放**。
> **Adam**：

$$
\begin{aligned}
m_t&=\beta_1 m_{t-1}+(1-\beta_1)g_t,\quad
v_t=\beta_2 v_{t-1}+(1-\beta_2)g_t\odot g_t,\\
\hat m_t&=\frac{m_t}{1-\beta_1^t},\quad \hat v_t=\frac{v_t}{1-\beta_2^t},\quad
x_{t+1}=x_t-\alpha\frac{\hat m_t}{\sqrt{\hat v_t}+\varepsilon}.
\end{aligned}
$$

* 典型：$\beta_1=0.9,\ \beta_2=0.999,\ \varepsilon=10^{-8}$。
* **AdamW**：把权重衰减与梯度更新解耦，泛化更好。
* **NAdam**：把 Nesterov 前瞻思想嵌进 $m_t$。

---

# 6) 选型与调参对照表（简）

| 场景         | 推荐                                              | 步长/参数                                       |
| ---------- | ----------------------------------------------- | ------------------------------------------- |
| 光滑凸（要好理论）  | **NAG**（FISTA 调度）                               | $\alpha\approx 1/L,\ \beta_k$ 用 FISTA；或回溯线搜 |
| 强凸 & 条件数适中 | **HB** 或 **NAG**                                | 用上面公式或网格选 $(\alpha,\beta)$                  |
| 非光滑/对偶     | **Deflected** +（**Level-based Polyak/PSVD** 步长） | $\theta\in[0.3,0.7]$，重启；步长用 level/gap       |
| 随机/深度学习    | **SGDM** 或 **Adam/AdamW**                       | $\beta=0.9$（SGDM），配余弦/OneCycle；Adam 用默认即可起步 |

---

# 7) 常见坑与排障

* **震荡**：降 $\alpha$；仍抖 → 降 $\beta$ 或用 NAG 的**重启**。
* **走不动（步子太小）**：升 $\alpha$ 或升 $\beta$（同时小降 $\alpha$ 保稳定）；加**预条件**（如 RMSProp/Adam 的对角缩放）。
* **约束投影贵**：考虑**镜像/对偶平均**（Bregman 距离）版本的动量。
* **尺度差异大**：配**对角预条件** $D_k$（把更新写成 $x_{k+1}=P_X(x_k-\alpha D_k \cdot \text{direction})$）。

---

如果你愿意，我可以把你正在用的 **“偏转次梯度 + PSVD 步长 +（可选）对角预条件”** 写成一段可直接落地的伪代码/代码骨架，并根据你的问题规模给出默认 $(\theta,\alpha/\gamma,\beta)$ 与窗口、触发阈值。
