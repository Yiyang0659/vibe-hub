# 栏目优先的文件架构设计

## 1. 背景与目标

当前网站是无构建步骤、浏览器直接加载 ES Modules 的纯静态项目。功能已经覆盖首页、术语、笔记、阅读、实践、工具箱、资源库和收藏，但同一栏目所需的内容、视图、样式与测试分散在多个技术目录中；`js/app.js`、`js/lab-data.js` 和部分样式文件也承担了过多职责。

本次整理采用方案 C：**按网站栏目聚合，公共能力集中管理**。目标不是更换技术栈或改版，而是让维护者能从栏目名称直接找到相关内容，并在迁移期间保持现有页面、路由、数据与本地状态兼容。

成功标准：

- 修改一个栏目时，主要工作集中在 `src/features/<栏目>/`。
- 每类静态内容只有一个权威数据源，不再保留重复词库或混合数据文件。
- 应用入口只负责启动、路由与全局外壳，不再保存栏目详情页实现。
- 公共目录只接收确实被多个栏目复用的能力。
- 项目说明文档、目录索引和新增内容指南与实际文件结构一致。
- 迁移前后的 URL、可见功能、localStorage 数据和静态部署方式保持不变。

## 2. 设计原则

1. **栏目优先**：术语、笔记、阅读、实践、工具箱等各自形成一个可独立理解的功能目录。
2. **单一来源**：栏目数据只在该栏目 `data.js` 中定义，其他模块通过栏目公开入口读取。
3. **明确出口**：每个栏目通过 `index.js` 暴露数据、路由页面和必要的辅助函数，外部代码不跨层读取内部文件。
4. **有限共享**：只有被至少两个栏目使用且语义一致的组件、纯函数或状态逻辑才进入 `src/shared/`。
5. **单向依赖**：`main → app → features → shared`；`shared` 不反向依赖具体栏目，栏目之间不直接互相引用实现。
6. **无构建兼容**：继续使用原生 HTML、CSS、ES Modules、Hash 路由和 Node 内置测试，不引入 Vite、框架或运行时依赖。
7. **渐进迁移**：先建立新目录和兼容出口，再逐步切换引用，最后删除旧文件；每个阶段都必须通过语法检查和测试。

## 3. 目标目录

```text
vibe-hub/
├── README.md
├── index.html
├── package.json
├── dev-server.mjs
├── .gitignore
│
├── docs/
│   ├── README.md
│   ├── product/
│   │   ├── project-brief.md
│   │   ├── prd.md
│   │   ├── information-architecture.md
│   │   └── user-flow.md
│   ├── design/
│   │   └── design-spec.md
│   ├── engineering/
│   │   ├── architecture.md
│   │   ├── test-plan.md
│   │   └── deployment.md
│   ├── research/
│   ├── archive/
│   └── superpowers/
│       ├── specs/
│       └── plans/
│
├── design/
│   ├── wireframes/
│   ├── references/
│   └── source-files/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/
│   ├── main.js
│   ├── app/
│   │   ├── router.js
│   │   ├── routes.js
│   │   └── shell.js
│   ├── features/
│   │   ├── home/
│   │   ├── topics/
│   │   ├── notes/
│   │   ├── reading/
│   │   ├── work/
│   │   ├── toolbox/
│   │   ├── library/
│   │   ├── practice/
│   │   ├── saved/
│   │   ├── workspace/
│   │   └── about/
│   ├── shared/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── store/
│   │   └── content/
│   └── styles/
│       ├── index.css
│       ├── tokens.css
│       ├── base.css
│       └── layout.css
│
├── tests/
│   ├── features/
│   ├── shared/
│   ├── content/
│   └── integration/
│
└── scripts/
```

项目继续使用顶层 `assets/` 保存会随网站部署的图片、图标与字体。暂不引入 `public/`，因为当前没有构建工具替它执行复制或路径转换；`design/` 只保存线框图、设计参考和源文件，不作为运行时资源目录。

## 4. 栏目内部结构

栏目按实际复杂度选择文件，不为保持形式统一而创建空文件。完整栏目以术语为例：

```text
src/features/topics/
├── index.js                 # 栏目唯一公开出口
├── data.js                  # 全部术语、分类与栏目静态文案
├── model.js                 # 域映射、反向关联等纯逻辑
├── topics-page.js           # #/topics 索引页 render/mount
├── topic-detail-page.js     # #/topics/:id 详情页 render/mount
└── topics.css               # 术语索引与详情页专属样式
```

简单栏目可以只有 `index.js`、`data.js`、`page.js` 和 `style.css`。当一个文件没有独立职责时不继续拆分。

栏目公开入口遵循同一约定：

```js
export { topics } from './data.js';
export { topicRoutes } from './routes.js';
```

其他栏目或应用层只从 `features/topics/index.js` 导入，不直接读取 `data.js`、页面文件或样式实现。

## 5. 应用层与公共层边界

### `src/app/`

- `router.js`：Hash 解析、路由匹配、404 与旧链接重定向。
- `routes.js`：汇总各栏目的路由定义，不实现栏目页面。
- `shell.js`：侧栏、全局搜索、主题切换、Toast 和页面挂载点。

### `src/shared/`

- `components/`：多个栏目共用的行式条目、时间轴、关联路径和对话框。
- `lib/`：搜索、进度、日期、编译、转义与内容校验等纯函数。
- `store/`：localStorage 的唯一访问入口，包括版本迁移、收藏、学习状态、个人笔记和主题。
- `content/`：站名、导航、页脚和全局文案等跨栏目的静态内容。

共享模块接收数据作为参数，不主动导入具体栏目。跨栏目搜索由 `app/routes.js` 或 `main.js` 汇总各栏目的公开数据后传给共享搜索函数。

## 6. 样式组织

全局样式保留在 `src/styles/`：

- `tokens.css`：颜色、字体、间距、阴影和主题变量。
- `base.css`：reset、基础排版和通用 HTML 元素。
- `layout.css`：应用外壳、侧栏、内容区与响应式断点。
- `index.css`：唯一 CSS 入口，通过 `@import` 载入全局样式、共享组件样式和各栏目样式。

栏目专属 CSS 与栏目代码放在一起，例如 `features/topics/topics.css`。共享组件的 CSS 与组件放在 `shared/components/`，再由 `styles/index.css` 统一导入。`index.html` 最终只链接一个样式入口。

## 7. 文档组织与同步规则

- 根 `README.md` 只保留项目定位、快速启动、核心目录树和常用修改入口。
- `docs/README.md` 是文档索引，解释 product、design、engineering、research 与 archive 的用途。
- 当前有效的产品、设计、工程和部署信息从历史计划中提炼到稳定文档。
- 已完成、已被替代或只用于追溯的日期型方案移入 `docs/archive/`，不删除历史内容。
- 新增 `docs/engineering/architecture.md`，记录实际目录、依赖方向和栏目模板。
- 新增内容指南应明确回答“加一个术语／笔记／项目／工具应该修改哪里”。
- 每次目录发生变化时，同一提交内同步根 README、文档索引与架构文档，避免说明和代码分离。

## 8. 测试与兼容要求

测试目录按被测对象组织：

- `tests/features/`：栏目数据、筛选、页面渲染和栏目内部逻辑。
- `tests/shared/`：搜索、进度、store、编译器等公共能力。
- `tests/content/`：跨栏目 ID、关联关系和发布字段校验。
- `tests/integration/`：路由、全局搜索、收藏与主要页面导航。

迁移不得改变：

- 现有 Hash URL 与旧链接 alias。
- localStorage key、数据结构与迁移结果。
- 术语、笔记、阅读、项目、工具箱和资源库的内容。
- 页面可见交互、主题和静态部署路径。

每阶段至少运行 `npm run check` 和 `npm test`。由于本机可能没有可直接调用的 npm，也允许使用项目所需的 Node 可执行文件直接运行等价的 `node --check` 与 `node --test`。

## 9. 现有文件迁移映射

| 现有位置 | 目标位置 |
| --- | --- |
| `js/data.js`、`js/expanded-data.js`、`js/content/topics.js` | `src/features/topics/` |
| `js/lab-data.js` | 按实体拆到 `src/features/home|about|notes|reading|work|toolbox|library|workspace/` |
| `js/views/*.js` | 对应的 `src/features/<栏目>/` |
| `js/app.js` | `src/main.js`、`src/app/` 与各栏目详情页 |
| `js/components/*` | `src/shared/components/`，或仅由一个栏目使用时移入该栏目 |
| `js/lib/*`、`js/compiler.js`、`js/utils.js` | `src/shared/lib/`，移除兼容转发层 |
| `styles/tokens.css`、`styles/base.css` | `src/styles/` |
| `styles/views/*` | 拆到对应 `src/features/<栏目>/` |
| `styles/components/*` | 与组件共同迁移到 `src/shared/components/` |
| `tests/*` | 按 features/shared/content/integration 重新归类 |

## 10. 实施顺序

1. 建立稳定文档索引与目标目录说明，不移动运行代码。
2. 拆分静态内容数据，并通过临时兼容出口保持旧 import 可用。
3. 建立 `src/shared/`，迁移纯函数、共享组件和状态访问。
4. 按栏目逐个迁移索引页、详情页和专属样式。
5. 将剩余入口逻辑拆为 `main.js` 与 `app/`，切换 `index.html`。
6. 迁移和补齐测试，确认路由、内容和本地状态兼容。
7. 删除已经无人引用的旧文件与兼容出口，同步全部说明文档。

每一步只处理一种边界，避免一次性移动全部文件后难以定位回归。

## 11. 非目标

- 不引入 React、Vue、Vite、TypeScript 或后端服务。
- 不改变视觉设计、页面文案或现有功能。
- 不新增 `public/`、`.env.example` 或没有实际用途的占位目录。
- 不删除历史方案和研究资料，只重新建立稳定入口与归档边界。
- 不为了追求小文件而拆分已经职责清楚的简单模块。
