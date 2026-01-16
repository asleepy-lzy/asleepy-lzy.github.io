---
title: Convex Optimaization study-1
published: 2025-08-16
description: "Convex Optimaization study-1"
tags: [study, Convex Optimaization]
category: Study
draft: false
---

## Mathematical optimization
$$
\begin{aligned}
&\text{minimize}&& f_0(x)\\
&\text{subject to}&& f_i(x)\le 0,\quad i=1,\dots,m\\
& && Ax=b
\end{aligned}
$$
要点：
- 变量：$x\in\mathbb{R}^n$。
- 等式约束为线性：$Ax=b$。
- 不等式约束由函数 $f_i$ 给出，要求 $f_0,\dots,f_m$ 都是凸函数。
- 凸函数的定义（等价表述）：对任意$x,y$ 和 $\theta\in[0,1]$，
  $$
  f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y).
  $$
  直观上，凸函数具有“向上”的非负曲率。
- 重要性质：凸优化的问题中，任何局部最优解都是全局最优解；如果目标是严格凸的则解唯一。
- 常见例子：二次优化（Hessian 为半正定）、线性规划等均为凸问题。

## Convex sets
**line** through $x_1$,$x_2$ : all points of form $x = \theta x_1+(1-\theta)x_2$,with $\theta \in \mathbb{R}$

**affine set** :contains the line through any two distinct points in the set 

**convex set** :
contains line segment between any two points in the set 
$$
x_1,x_2 \in \mathbb C, \quad 0\le\theta\le1 \quad \implies \theta x_1 + (1-\theta)x_2 \in C
$$

**convex combination** of $x_1,\dots,x_k$: any point $x$ of the form 
$$
x=\theta_{1}x_1+\theta_{2}x_2+\dots+\theta_{k}x_k
$$
with $\theta_{1}+\theta_{2}+\dots+\theta_{k}=1,\quad\theta_{i}\ge 0$


**hyperplane**: set of the form $\{x \mid a^{T} x=b\}$,with $a \neq 0$

**halfspace**: set of the form $\{x \mid a^{T} x\le b\}$,with $a \neq 0$

**(Euclidean) ball** with center $x_c$ and radius $r$:
$$
B(x_c, r) = \{ x \mid \|x - x_c\|_2 \leq r \} = \{ x_c + r u \mid \|u\|_2 \leq 1 \}
$$

**ellipsoid**: set of the form
$$
\{ x \mid (x - x_c)^T P^{-1} (x - x_c) \leq 1 \}
$$
with $P \in \mathbb{S}_{++}^n$ (i.e., $P$ symmetric positive definite).


**polyhedron**: solution set of finitely many linear inequalities and equalities
$$
\{ x \mid Ax \leq b,\; Cx = d \}
$$
其中 $A \in \mathbb{R}^{m \times n}$，$C \in \mathbb{R}^{p \times n}$，$\leq$ 表示分量不等式。

- 是有限个半空间和超平面的交集
- 若无等式约束，$a_i^T$ 是 $A$ 的行

**convex cone**: set that contains all conic combinations of points in the set

