# Dev Lab Term Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将“前端”术语及其互动保存流程接入网站，并完成深色开发实验室视觉改造。

**Architecture:** 在现有 lesson 数据上增加可选的 `scenario`、`boundary`、`agentPrompt` 和 `references` 字段。详情渲染器根据字段生成通用实验组件；页面状态只保存当前步骤和当前答案，不污染持久化学习状态。

**Tech Stack:** 原生 HTML、CSS、JavaScript ES Modules、Node.js node:test。

---

### Task 1: 扩展术语数据

**Files:** Modify `js/data.js`。

写入 Frontend 完整内容、六步流程、边界、问题、提示词和外部参考。

### Task 2: 实现互动模板

**Files:** Modify `js/app.js`。

新增流程实验渲染、步骤切换、答案反馈、复制提示词与引用列表。

### Task 3: 重构视觉系统

**Files:** Modify `index.html`, `styles.css`, `js/app.js`。

调整品牌、导航和页面文案；应用深色实验室变量、IDE 导航、终端面板、网格背景和响应式布局。

### Task 4: 验收

**Files:** Verify all project files。

运行 `npm test`、`npm run check`，并在桌面和 360px 移动视口验证详情交互与全站布局。

