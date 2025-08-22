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

## 假设：

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


### Polyak步长

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






