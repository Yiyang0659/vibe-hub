# 想与做 · AI 产品与应用实践

一个围绕 AI、产品与工程实践的个人知识网站：展示做过的项目、写下的文章、理解过的术语，以及可以直接复用的方法和工具。

## 快速开始

```bash
npm run dev      # 本地网站：http://localhost:4173
npm test         # Node.js 单元与集成测试
npm run check    # 检查 src/ 下全部 JavaScript 语法
```

项目没有构建步骤和运行时依赖，浏览器直接加载 HTML、CSS 与 ES Modules。

## 文件架构

项目采用“栏目优先、公共能力集中”的结构：修改某个栏目时，优先进入对应的 `src/features/<栏目>/`。

```text
vibe-hub/
├── index.html              # 页面外壳和浏览器入口
├── src/
│   ├── main.js             # 最小浏览器入口
│   ├── app/                # 路由、页面元信息、全局外壳逻辑
│   ├── features/           # 按网站栏目聚合的内容与页面
│   ├── shared/             # 跨栏目复用的组件、逻辑、状态和站点文案
│   └── styles/             # 全局样式与唯一 CSS 入口
├── assets/                 # 网站实际使用的图片和其他静态资源
├── tests/                  # features/shared/content/integration 四类测试
├── scripts/                # 开发期检查脚本
├── docs/                   # 产品、设计、工程、研究与历史文档
└── design/                 # 线框图、设计参考和源文件（按需创建）
```

## 我想修改某项内容

| 目标 | 主要位置 |
| --- | --- |
| 改首页 | `src/features/home/` |
| 添加或修改术语 | `src/features/topics/data.js` |
| 添加文章 | `src/features/notes/data.js` |
| 添加阅读记录 | `src/features/reading/data.js` |
| 添加项目或实验 | `src/features/work/data.js` |
| 添加 Prompt、清单或模板 | `src/features/toolbox/data.js` |
| 添加收藏资源 | `src/features/library/data.js` |
| 改个人介绍 | `src/features/about/data.js` |
| 改站名、导航或全局文案 | `src/shared/content/site.js` |
| 改搜索或学习进度计算 | `src/shared/lib/` |
| 改收藏、主题和本地笔记状态 | `src/shared/store/` |
| 改全站颜色、字体和基础布局 | `src/styles/` |

具体字段和示例见 [`docs/guides/add-content.md`](docs/guides/add-content.md)。

## 结构规则

- 每个栏目从自己的 `index.js` 对外暴露数据和页面。
- 栏目之间不直接读取彼此的内部文件；跨栏目能力通过应用层组装。
- 被多个栏目复用的代码才进入 `src/shared/`。
- localStorage 只通过 `src/shared/store/` 访问，现有 key 保持为 `pkl-v3-state`。
- 全站 CSS 由 `src/styles/index.css` 统一加载。
- URL 继续使用 Hash 路由，旧地址 alias 保持兼容。

## 文档入口

完整文档索引见 [`docs/README.md`](docs/README.md)，常用文档包括：

- [`docs/product/project-brief.md`](docs/product/project-brief.md)：项目定位与范围
- [`docs/product/information-architecture.md`](docs/product/information-architecture.md)：网站内容和导航结构
- [`docs/design/design-spec.md`](docs/design/design-spec.md)：当前视觉规范
- [`docs/engineering/architecture.md`](docs/engineering/architecture.md)：代码架构和依赖规则
- [`docs/engineering/test-plan.md`](docs/engineering/test-plan.md)：测试范围与命令
- [`docs/engineering/deployment.md`](docs/engineering/deployment.md)：本地运行和部署
