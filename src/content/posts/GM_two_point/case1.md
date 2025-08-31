---
title: 梯度下降法-两点启发式
published: 2025-08-29
description: "Grandient Descent leaning note"
tags: [study, Convex Optimaization]
category: Study
draft: false
---

## 出现背景


> **梯度的变化 =（沿两点连线的“平均 Hessian”）× 位移**
> 也就是
>
> $$
> y_k:=\nabla f(x_k)-\nabla f(x_{k-1})
> \;=\;\Big(\int_{0}^{1}\nabla^2 f\big(x_{k-1}+t\,s_k\big)\,dt\Big)\,s_k,
> $$
>
> 其中 $s_k:=x_k-x_{k-1}$。


   设一条从 $x_{k-1}$ 到 $x_k$ 的线：

$$
x(t)=x_{k-1}+t\,s_k,\quad t\in[0,1],\qquad s_k=x_k-x_{k-1}.
$$

定义一元向量函数

$$
\psi(t):=\nabla f\big(x(t)\big).
$$

$$
\psi(1)-\psi(0)=\int_0^1 \psi'(t)\,dt.
$$


$$
\psi'(t)=\nabla^2 f\big(x(t)\big)\,\underbrace{x'(t)}_{=\,s_k}
\;=\;\nabla^2 f\big(x_{k-1}+t\,s_k\big)\,s_k.
$$

代回去就得到

$$
\nabla f(x_k)-\nabla f(x_{k-1})
=\psi(1)-\psi(0)=\int_0^1 \nabla^2 f\big(x_{k-1}+t\,s_k\big)\,s_k\,dt
=\Big(\int_0^1 \nabla^2 f(\cdot)\,dt\Big)s_k.
$$


   记

$$
\overline H_k:=\int_0^1 \nabla^2 f\big(x_{k-1}+t\,s_k\big)\,dt,
$$

于是

$$
y_k=\nabla f(x_k)-\nabla f(x_{k-1})=\overline H_k\,s_k.
$$

两点启发式核心是想要用一个标量模拟$\overline H_k$


## 推导过程

**目标**：用极少信息估计“局部曲率尺度”（步长≈曲率的倒数），但我们拿不到 Hessian $H=\nabla^2 f$。


$$
y_k
=\Big(\int_0^1\nabla^2 f(x_{k-1}+t\,s_k)\,dt\Big)\,s_k
=: \overline H_k\,s_k
\quad\text{（“平均 Hessian 的作用”）}.
$$

这就是**割线关系**。拟牛顿法会用某个矩阵 $B_k\approx H$（或其逆 $M_k\approx H^{-1}$）满足

$$
B_k\,s_k\approx y_k\quad\text{或}\quad M_k\,y_k\approx s_k.
$$

“两点启发式”做了**极简近似**：把矩阵退化为**标量乘$I$**，然后用最小二乘拟合割线。

* 近似 Hessian：$B_k=\frac{1}{\alpha_k}I$。解

  $$
  \min_{\alpha>0}\Big\|\tfrac{1}{\alpha}s_k-y_k\Big\|^2
  \ \Longrightarrow\ 
  \frac{\partial}{\partial(1/\alpha)}\| (1/\alpha)s_k-y_k\|^2=0
  $$

  得

  $$
  \boxed{\ \alpha_k^{\text{BB1}}=\frac{s_k^\top s_k}{\,s_k^\top y_k\,}\ }.
  $$

  含义：$\frac{s_k^\top y_k}{s_k^\top s_k}$ 是沿 $s_k$ 的“平均曲率”（Rayleigh 商），其**倒数**就是步长。

* 近似逆 Hessian：$M_k=\alpha_k I$。解

  $$
  \min_{\alpha>0}\|\,\alpha y_k-s_k\|^2
  \ \Longrightarrow\
  \boxed{\ \alpha_k^{\text{BB2}}=\frac{s_k^\top y_k}{\,y_k^\top y_k\,}\ }.
  $$

这两条就是**Barzilai–Borwein 两点步长**。只用到两次迭代点的差分 $(s_k,y_k)$，因此叫**两点启发式**。


