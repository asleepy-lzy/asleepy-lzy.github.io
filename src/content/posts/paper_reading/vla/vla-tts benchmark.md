---
title: vla-tts benchmark
published: 2026-03-23
description: 
tags: [study, llm , rl]
category: study
draft: true
---
## Benchmark × Paper

| Benchmark                             | [P1] RoboMonkey | [P2] MG-Select | [P3] VLA-Reasoner | [P4] VLAPS | [P5] AtomicVLA | [P6] TT-VLA | [P7] TACO | [P8] V-GPS |
| ------------------------------------- | --------------: | -------------: | ----------------: | ---------: | -------------: | ----------: | --------: | ---------: |
| SIMPLER / SIMPLER-WidowX / SimplerEnv |               ✅ |              ✅ |                 ✅ |            |                |             |         ✅ |          ✅ |
| LIBERO                                |               ✅ |              ✅ |                 ✅ |          ✅ |              ✅ |             |         ✅ |            |
| LIBERO-Long                           |               ✅ |              ✅ |                 ✅ |            |              ✅ |             |           |            |
| RoboCasa                              |                 |              ✅ |                   |            |                |             |           |            |
| CALVIN                                |                 |                |                   |            |              ✅ |             |           |            |
| PolaRiS                               |                 |                |                   |            |                |             |           |            |
| RoboTwin2.0                           |                 |                |                   |            |                |             |         ✅ |            |
| Robotwin                              |                 |                |                   |            |                |             |         ✅ |            |
| Real-world / physical robot           |               ✅ |              ✅ |                 ✅ |            |              ✅ |           ✅ |         ✅ |          ✅ |


## References

- **[P1]** [RoboMonkey: Scaling Test-Time Sampling and Verification for Vision-Language-Action Models](https://arxiv.org/abs/2506.17811)
- **[P2]** [Verifier-free Test-Time Sampling for Vision-Language-Action Models](https://arxiv.org/abs/2510.05681)
- **[P3]** [VLA-Reasoner: Empowering Vision-Language-Action Models with Reasoning via Online Monte Carlo Tree Search](https://arxiv.org/abs/2509.22643)
- **[P4]** [Improving Pre-Trained Vision-Language-Action Policies with Model-Based Search](https://arxiv.org/abs/2508.12211)
- **[P5]** [AtomicVLA: Unlocking the Potential of Atomic Skill Learning in Robots](https://arxiv.org/abs/2603.07648)
- **[P6]** [On-the-Fly VLA Adaptation via Test-Time Reinforcement Learning](https://arxiv.org/abs/2601.06748)
- **[P7]** [Steering Vision-Language-Action Models as Anti-Exploration: A Test-Time Scaling Approach](https://arxiv.org/abs/2512.02834)
- **[P8]** [Steering Your Generalists: Improving Robotic Foundation Models via Value Guidance](https://arxiv.org/abs/2410.13816)

## LIBERO
LIBERO 是一个面向 **robot knowledge transfer** 的 manipulation benchmark，核心关注模型能否将已学习的 **declarative knowledge**（如 object identity、spatial relationship、goal understanding）与 **procedural knowledge**（如 grasp、move、place、action sequence）迁移到新任务中。它包含 130 个任务，并划分为 **LIBERO-Spatial、LIBERO-Object、LIBERO-Goal、LIBERO-100** 四个 task suites，其中前 3 个通过 **controlled distribution shifts** 分别评测 spatial、object 和 goal 三类 transfer，LIBERO-100 则用于评测更复杂的 **entangled knowledge transfer**。因此，LIBERO 特别适合用于评测 **multitask learning、lifelong learning、generalization**，以及 **planning / world model / MCTS** 等方法在 **long-horizon manipulation** 场景中的迁移能力。
![[Pasted image 20260319141305.png]]
- **LIBERO 官网**：[LIBERO Project Page](https://libero-project.github.io/main.html)

- **LIBERO GitHub**：[LIBERO GitHub](https://github.com/Lifelong-Robot-Learning/LIBERO)


## **SIMPLER / SIMPLER-WidowX / SimplerEnv** 
**SIMPLER / SIMPLER-WidowX / SimplerEnv** 可视为同一条以 **WidowX** 精细操作任务为核心的 benchmark 家族，主要用于评测机器人策略在 **fine-grained manipulation** 场景中的动作精度、鲁棒性以及 **real-to-sim** 相关性。其典型任务包括 _Spoon on Towel_、_Carrot on Plate_、_Eggplant in Basket_ 和 _Block / Stack Cubes_ 等，这类任务虽然单步长度不一定很长，但对 grasping、placement、collision avoidance 和视觉泛化都较为敏感。因此，这一 benchmark 家族特别适合用于评测 **action-level VLA-TTS** 方法，例如 **sampling、verifier、reranking** 等测试时策略，观察额外 test-time compute 是否能转化为更高的操作精度与任务成功率。需要说明的是，不同论文中对该 benchmark 的命名略有差异：RoboMonkey 使用 **SIMPLER**，MG-Select 使用 **SIMPLER-WidowX**，VLA-Reasoner 使用 **SimplerEnv**，但三者在机器人平台、代表性任务和评测目标上高度重合，因此在综述中常可归纳为同一 benchmark family。
![[Pasted image 20260319141852.png]]

- **SIMPLER 官网**：[SIMPLER: Evaluating Real-World Robot Manipulation Policies in Simulation](https://simpler-env.github.io/)

- **SIMPLER GitHub**：[SimplerEnv GitHub](https://github.com/simpler-env/SimplerEnv)