---
title: Linux(美化)
published: 2026-01-16
description: "linux美化记录"
tags: [study, play]
category: Play
draft: false
---



寒假期间对 Linux 桌面（ubuntu。04，GNOME46）进行了一次彻底的美化和效率改造。以下是最终达成的效果清单及关键配置工具，主要涵盖了锁屏、窗口管理、终端环境及开发工具。

## 1. 桌面环境与外观 (GNOME)

### GDM 锁屏 (Login Screen)
为了让开机登录界面与进入系统后的主题保持一致，修改了 GDM 的背景和主题，告别枯燥的默认灰色。

### GNOME 扩展 (Extensions)
使用 `gnome-extensions` 管理器配置了以下核心插件，提升视觉效果和交互体验：
* **Blur My Shell**: 给 Shell 界面（如概览、顶栏）添加毛玻璃模糊效果，质感提升显著。
* **Dash2Dock Animated**: 让 Dock 栏拥有更流畅的动效。
* **Tiling Window Management**:
    * *方案 A*: **PaperWM** (横向卷轴式窗口管理，像翻书一样浏览窗口)
    * *方案 B*: **Forge** (提供类似 i3/Sway 的平铺窗口体验)
    * *(注：目前根据使用场景在两者间切换)*

### 全局配色：Catppuccin
全系统采用 **[Catppuccin (猫布丁)](https://github.com/catppuccin)** 主题配色。
* 应用范围：GTK 主题、终端、编辑器、Shell，浏览器。
* 风格特点：低饱和度粉彩配色，护眼且现代。

## 2. 终端与 Shell 环境

### WezTerm + Fish Shell
放弃了系统自带终端，转向了 GPU 加速的 **WezTerm**，配合 **Fish Shell** 使用。
* **美化**: 使用了 Catppuccin 配色方案。
* **lsd**: 替代传统的 `ls` 命令，带有图标支持，文件列表一目了然。
* **Prompt**: 配置了 Starship 或 Fish 自带的高亮与补全功能。

### 字体配置
* **主字体**: JetBrains Mono (专为开发者设计，连字效果优秀)。


## 3. 开发效率工具

### LazyVim
基于 Neovim 的预配置发行版。
* 开箱即用，配置了 LSP、Treesitter 和自动补全。
* 启动速度极快，完全替代了臃肿的 IDE 用于日常脚本和配置修改。

### Rofi
替代 GNOME 默认的 Application Launcher。
* 配置了快捷键呼出。
* 不仅可以启动应用，还能快速切换窗口、搜索文件，配合自定义主题与整体桌面风格完美融合。

## 4. 系统工具与输入法

### Fcitx5
安装了 Fcitx5 输入法框架。
* 配置了 Rime (雾凇拼音) 或其他中文词库。
* 解决了 Wayland/X11 下的输入法兼容性问题，打字体验丝滑。

---

> **后记**
> 这一套配置折腾下来，既满足了视觉上的“强迫症”，也通过平铺窗口管理和键盘主导的工具链（Neovim, WezTerm, Rofi）极大提升了操作效率。