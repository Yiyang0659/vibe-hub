# AI Knowledge & Practice Lab

> 一个围绕 AI、产品与工程实践的个人知识实验室：记录真正搞明白的知识、读过的重要内容、做过的实验与项目，以及能复用的方法。

**核心证明链**：知识基础（Topics）→ 理解思考（Notes）→ 研究输入（Reading）→ 实践验证（Work）→ 方法沉淀（Toolbox）→ 持续关注（Library）。

---

## 快速开始

```bash
npm run dev      # 本地开发服务 http://localhost:4173
npm test         # 单元/集成测试（node --test）
npm run check    # 全部源码语法检查
```

无构建步骤、零运行时依赖 —— 浏览器直接加载 ES Modules，整站即为纯静态文件，可直接部署到任何静态服务器。

## 一分钟看懂代码结构

```text
index.html            唯一 HTML 入口（app-shell + 导航 + 浮层）
js/
  main.js             入口：store + 路由 + 全局事件
  router.js           hash 路由表（含旧链接 alias）
  content/            ★ 全站内容数据（加笔记/术语/项目都改这里）
  views/              每个路由一个文件（render + mount）
  components/         跨页面复用组件（清单行/时间轴/Terminal/Lab…）
  lib/                纯函数（搜索/进度/编译/校验）
  store/              localStorage 唯一读写口（收藏/笔记/主题）
styles/
  tokens.css          ★ 全站设计变量（改色改字只动这里）
  base.css / layout.css / components/ / views/
tests/                与 js/ 目录镜像
docs/plans/           方案文档（V4 蓝图、文件架构、部署指南）
```

依赖方向单向：`views → components/lib/store → content`，`content/` 是纯数据、不 import 任何东西。

## 文档索引

| 文档 | 内容 |
| :--- | :--- |
| [docs/plans/2026-09-02-v4-editorial-lab-blueprint.md](docs/plans/2026-09-02-v4-editorial-lab-blueprint.md) | V4 总蓝图：定位、视觉系统、逐页线框、数据模型、实施路线 |
| [docs/plans/2026-09-02-v4-file-architecture.md](docs/plans/2026-09-02-v4-file-architecture.md) | 文件分布架构 + 「我想改 X 去哪里」速查表 |
| [docs/plans/2026-09-02-v4-deploy-guide.md](docs/plans/2026-09-02-v4-deploy-guide.md) | 部署上线：Nginx 配置全文 / GitHub Pages / Cloudflare Pages |

## 分支

- `main` — 生产分支（V4 合入后）
- `feature/v4-editorial-lab` — V4「编辑部混合版」重构进行中
