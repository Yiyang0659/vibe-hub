# Learning Voyage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一套可直接本地运行、信息完整且拥有原创“学习航海日志”风格的个人学习网站。

**Architecture:** 使用原生 HTML、CSS 与 ES Modules 构建单页应用，通过 hash 路由切换首页、知识库、详情、收藏和练习视图。课程数据与纯逻辑分离，用户状态持久化到 localStorage，并由视图层集中渲染。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Node.js 内置 HTTP Server 与 node:test。

---

### Task 1: 建立应用骨架

**Files:**
- Create: `index.html`
- Create: `package.json`
- Create: `dev-server.mjs`

**Steps:** 建立语义化页面容器、静态资源入口和本地服务器；运行 `npm run check` 验证脚本入口。

### Task 2: 建立知识数据与纯逻辑

**Files:**
- Create: `js/data.js`
- Create: `js/utils.js`
- Create: `tests/utils.test.js`

**Steps:** 编写课程分类、完整详情和练习数据；先写搜索与统计测试，再实现对应纯函数；运行 `npm test`，期望全部通过。

### Task 3: 实现视图与持久化交互

**Files:**
- Create: `js/app.js`

**Steps:** 实现 hash 路由、搜索、筛选、收藏、完成状态、笔记与练习；用空状态和安全默认值处理无效路由或存储数据。

### Task 4: 构建视觉系统

**Files:**
- Create: `styles.css`

**Steps:** 实现纸张质感、航线背景、响应式布局、排版、卡片、进度、详情和练习状态；加入键盘焦点和 reduced-motion 规则。

### Task 5: 完整验收

**Files:**
- Verify: all project files

**Steps:** 运行 `npm test` 与 `npm run check`；启动本地服务器，在桌面与移动视口检查主要页面，修复所有明显布局或交互问题。

