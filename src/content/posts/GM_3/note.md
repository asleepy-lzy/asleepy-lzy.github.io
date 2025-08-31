---
title: 梯度下降法-超参数学习
published: 2025-08-29
description: "Grandient Descent leaning note"
tags: [study, Convex Optimaization]
category: Study
draft: false
---


《Online Learning Rate Adaptation with Hypergradient Descent（HD）》

# 这篇论文要解决什么？

深度学习里几乎所有一阶优化器都离不开一个“全局学习率”α；即使是 AdaGrad/RMSProp/Adam 这类自适应法，也还要设一个初始的全局 α。作者要做的是：**在训练过程中，在线地（online）用目标函数对“学习率”本身的导数来更新学习率**，从而减少对手工调参 α₀ 的依赖。这个对超参数的导数被称为**超梯度（hypergradient）**。方法简单、泛化到多种优化器都只需极少改动。



$$
\theta_t=\theta_{t-1}-\alpha \nabla f(\theta_{t-1}).
$$

作者直接对**上一步的损失** $f(\theta_{t-1})$ 关于 **学习率 α** 求偏导（利用 $\theta_{t-1}=\theta_{t-2}-\alpha \nabla f(\theta_{t-2})$）：

$$
\frac{\partial f(\theta_{t-1})}{\partial \alpha}
= \nabla f(\theta_{t-1})^\top \frac{\partial\,(\theta_{t-2}-\alpha \nabla f(\theta_{t-2}))}{\partial\alpha}
= -\,\nabla f(\theta_{t-1})^\top \nabla f(\theta_{t-2}).
$$

于是用梯度下降在“学习率空间”里走一步：

$$
\alpha_t
= \alpha_{t-1} - \beta \,\frac{\partial f(\theta_{t-1})}{\partial \alpha}
= \alpha_{t-1} + \beta \,\nabla f(\theta_{t-1})^\top \nabla f(\theta_{t-2}),
$$

其中 $\beta$ 是“超学习率”。直觉：若相邻两次梯度**同向（点积>0）**，说明朝着好方向在走——增大 α；若**相反（点积<0）**，则减小 α，避免过冲。**只需保存上一轮梯度并做一个点积**，计算/内存开销极小。随后参数用最新 $\alpha_t$ 更新：$\theta_t=\theta_{t-1}-\alpha_t\nabla f(\theta_{t-1})$。

