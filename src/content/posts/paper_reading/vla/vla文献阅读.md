---
title: vla-tts文献综述
published: 2026-01-20
description: "vla-tts 相关文献综述"
tags: [study, llm , rl]
category: study
draft: true
---

### 文章列表

$\pi_{0}$: A Vision-Language-Action Flow Model for  General Robot Control:
$\pi_{0.5}$: a Vision-Language-Action Model with  Open-World Generalization
Fine-Tuning Vision-Language-Action Models:  Optimizing Speed and Success
OpenVLA: An Open-Source Vision-Language-Action Model
WMPO: World Model-based Policy Optimization for Vision-Language-Action Models


---
# VLA 论文复习笔记

## 1. 总体脉络

这五篇论文可以看成 VLA 的五个推进方向：

- **OpenVLA**：开源、可复现的通用 VLA 基线
    
- **$\pi_0$**：连续动作生成，解决高频与灵巧控制
    
- **$\pi_{0.5}$**：开放世界泛化，强调异质数据联合训练
    
- **OFT**：优化 VLA 的微调方式，提高速度与成功率
    
- **WMPO**：引入 world model 与 RL，使 VLA 具备自我改进能力
    

VLA 的统一形式可以写成：

$$  
a_t \sim \pi_\theta(a_t \mid o_t, l)  
$$

其中：

- $o_t$：图像、机器人状态等观测
    
- $l$：语言指令
    
- $a_t$：机器人动作
    

若一次输出一个动作块，则为：

$$  
A_t = [a_t, a_{t+1}, \dots, a_{t+H-1}], \quad  
A_t \sim \pi_\theta(A_t \mid o_t, l)  
$$

不同论文的差异主要体现在三个层面：

- 动作表示：离散 token 或连续 action
    
- 训练方式：imitation learning、fine-tuning 或 RL
    
- 泛化方式：多任务泛化、开放世界泛化、自我修正
    

---

## 2. OpenVLA

### 2.1 目标

OpenVLA 关注的是构建一个**开源、可复现、可微调的 VLA 基线**。模型基于 Llama 2，并结合 DINOv2 与 SigLIP 视觉编码器，在约 97 万条机器人 demonstrations 上训练。

### 2.2 方法

OpenVLA 采用**离散动作 token 化**。连续动作被分桶离散化，每个动作维度被映射为 token，然后用 next-token prediction 训练策略：

$$  
\pi_\theta(a_t \mid o_t, l)  
\Rightarrow  
\pi_\theta(\text{action tokens} \mid o_t, l)  
$$

训练目标本质上是 token 级别的交叉熵损失。

### 2.3 特点

- 开源，适合社区复现与扩展
    
- 可进行参数高效微调
    
- 属于 **token-based VLA** 路线
    
- 动作离散化带来控制精度和高频控制上的限制
    

---

## 3. $\pi_0$

### 3.1 目标

$\pi_0$ 关注的是：**动作不应被强行离散化，机器人控制应直接建模连续动作分布**。它基于 PaliGemma，使用大规模多机器人数据训练，并强调高频、灵巧、长时程控制。

### 3.2 方法

$\pi_0$ 的核心结构可以写成：

$$  
\text{VLM backbone} + \text{action expert} + \text{flow matching head}  
$$

它不再生成离散 token，而是通过 conditional flow matching 学习连续动作块的分布。若记加噪后的动作块为 $A_t^\tau$，则模型学习条件向量场：

$$  
v_\theta(A_t^\tau, o_t, l, \tau)  
$$

目标是把 noisy action chunk 逐步推回真实动作分布。

### 3.3 特点

- 属于 **continuous-action VLA**
    
- 支持 action chunking
    
- 适合高频和灵巧控制
    
- 与 token-based 方法相比，更贴近机器人控制本质
    

---

## 4. $\pi_{0.5}$

### 4.1 目标

$\pi_{0.5}$ 的重点从“连续动作建模”进一步推进到**开放世界泛化**。目标是在训练未见过的家庭环境、物体和长时程任务中保持较强表现。

### 4.2 方法

$\pi_{0.5}$ 延续 $\pi_0$ 的基本 VLA 思路，但重点放在 **heterogeneous co-training**。训练中联合使用：

- 多机器人操作数据
    
- 高层语义监督
    
- web 图像与语言数据
    
- 目标检测与定位数据
    
- semantic subtask prediction
    
- 低层动作监督
    

其关键思想是：单一机器人 imitation data 不足以支撑开放世界泛化，必须引入跨模态、跨任务、跨监督源的数据联合训练。

### 4.3 特点

- 属于 **open-world generalization** 路线
    
- 强调多源异质数据联合训练
    
- 泛化能力不只依赖更多机器人数据，也依赖更广的语义监督与感知监督
    

---

## 5. OFT

## 5.1 目标

OFT（Optimizing Speed and Success）关注的问题是：**已有 VLA 如何更高效地 fine-tune 到新任务，同时兼顾速度与成功率**。论文以 OpenVLA 为主要基础模型，系统研究动作解码方式、动作表示和训练目标对性能的影响。

### 5.2 方法

OFT 的核心 recipe 包括三点：

- parallel decoding
    
- action chunking
    
- continuous action representation + $L_1$ regression
    

训练损失写为：

$$  
\mathcal{L}_{L_1} = |\hat{A}_t - A_t|_1  
$$

也就是说，它不再坚持原始 token-based autoregressive decoding，而改为一次并行预测整个动作块，并用连续动作回归进行监督。

### 5.3 特点

- 属于 **fine-tuning recipe optimization** 路线
    
- 表明很多性能差异来自 adaptation recipe，而不只是 base model
    
- 在高容量 VLA 上，简单的连续动作回归可以达到接近 diffusion fine-tuning 的效果，同时速度显著更快
    

---

## 6. WMPO

### 6.1 目标

WMPO 关注的是：**仅靠 imitation learning 学到的 VLA 往往不够稳健，缺乏失败恢复与自我修正能力**。真实环境中的 on-policy RL 又代价很高，因此 WMPO 提出使用 world model 在 imagined environment 中进行策略优化。

### 6.2 方法

WMPO 的总体流程可以写成：

$$  
\text{real data} \rightarrow \text{world model} \rightarrow \text{imagined rollouts} \rightarrow \text{policy optimization}  
$$

它先用真实轨迹训练 world model，再在 imagined environment 中 rollout 大量轨迹，最后通过 on-policy RL 更新 VLA policy。论文强调的是 **pixel-based prediction**，而不是只在 latent space 中闭门滚动，以便 imagined trajectory 与 VLA 使用的视觉特征更对齐。

### 6.3 特点

- 属于 **VLA + world model + RL** 路线
    
- 提升 sample efficiency
    
- 支持 self-correction 与 lifelong learning
    
- 将 VLA 从“模仿 demonstration”推进到“在想象中试错优化”
    

---

## 7. 横向比较

|论文|核心问题|方法关键词|路线|
|---|---|---|---|
|OpenVLA|如何构建开源、可复现的通用 VLA|action tokenization, Llama 2, fine-tuning|开源基线|
|$\pi_0$|如何实现高频、灵巧的连续控制|flow matching, continuous action, action chunking|连续动作建模|
|$\pi_{0.5}$|如何实现开放世界泛化|heterogeneous co-training, semantic supervision|开放世界泛化|
|OFT|如何提高 VLA 微调的速度与成功率|parallel decoding, $L_1$ regression, continuous actions|后训练优化|
|WMPO|如何让 VLA 具备自我修正与持续提升能力|world model, imagined rollout, on-policy RL|自我改进 / RL|

---

## 8. 统一理解

这五篇论文分别对应 VLA 的不同短板：

- **OpenVLA**：解决开源与复现问题
    
- **$\pi_0$**：解决动作离散化导致的控制瓶颈
    
- **$\pi_{0.5}$**：解决开放环境中的泛化问题
    
- **OFT**：解决已有 VLA 的适配效率问题
    
- **WMPO**：解决 imitation learning 上限与缺乏自我改进的问题
    

整体发展主线可概括为：

$$  
\text{open-source baseline}  
\rightarrow  
\text{continuous action modeling}  
\rightarrow  
\text{open-world generalization}  
\rightarrow  
\text{efficient adaptation}  
\rightarrow  
\text{world-model-based self-improvement}  
$$

更长期的趋势可以写成：

$$  
\text{strong VLM backbone}  
+  
\text{continuous action head}  
+  
\text{heterogeneous co-training}  
+  
\text{efficient fine-tuning recipe}  
+  
\text{world model RL}  
$$

即未来更强的 embodied foundation model 很可能是这些路线的融合，而不是单一路线的胜出。这个判断是基于上述几篇论文所推进的方向做出的综合归纳。

---
