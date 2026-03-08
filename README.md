# Gomoku Game

一个基于 Vue 3、Vite 与 Element Plus 构建的网页版五子棋项目。

## 项目简介

本项目实现了一个 15 × 15 的五子棋对局界面，支持双人轮流落子、胜负判断、对局状态展示与一键重新开始，适合作为前端交互练习与小游戏项目示例。

## 主要功能

- 15 × 15 标准棋盘展示
- 黑白双方轮流落子
- 已落子位置禁止重复点击
- 支持横向、纵向、主对角线、副对角线五连判胜
- 展示当前执子方、对局状态与落子总数
- 支持重新开始新对局

## 技术栈

- Vue 3
- Vite
- Element Plus

## 本地运行

```bash
npm install
npm run dev
```

## 构建生产版本

```bash
npm run build
```

## 目录说明

```text
gomoku-game/
├─ src/
│  ├─ App.vue        # 五子棋主要界面与对局逻辑
│  ├─ main.js        # 应用入口
│  └─ style.css      # 全局样式
├─ index.html        # 页面入口
├─ package.json      # 项目依赖与脚本
└─ README.md         # 项目说明
```

## 适用场景

- Vue 3 前端项目练习
- 小型棋类网页游戏示例
- 组件化界面与基础交互逻辑演示
