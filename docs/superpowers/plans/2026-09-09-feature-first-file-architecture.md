# 栏目优先的文件架构实施计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在不改变现有功能、路由、内容和本地状态的前提下，将项目迁移为 `src/features/` 栏目聚合、`src/shared/` 公共能力集中，并同步所有项目说明文档。

**架构：** 每个网站栏目拥有自己的数据、索引页、详情页和专属样式，通过 `index.js` 公开必要接口。应用层只负责启动、Hash 路由与全局外壳；共享层只包含跨栏目复用的组件、纯函数、状态和站点级内容。迁移采用兼容出口和逐阶段验证，确保当前工作区中尚未提交的页面改动被原样保留。

**技术栈：** 原生 HTML、CSS、JavaScript ES Modules、Hash Router、localStorage、Node.js 内置 HTTP 与 `node:test`。

---

## 文件结构与职责

### 创建

- `src/main.js`：浏览器唯一入口，初始化 store、shell 和路由。
- `src/app/router.js`：Hash 解析、alias 归一化、路由匹配和页面元数据。
- `src/app/routes.js`：汇总栏目路由处理器。
- `src/app/shell.js`：全局 DOM 引用、导航、搜索、主题、Toast 与移动菜单。
- `src/features/<feature>/index.js`：每个栏目的唯一公开出口。
- `src/features/<feature>/data.js`：该栏目的唯一静态数据源。
- `src/features/<feature>/*-page.js`：该栏目的索引页或详情页。
- `src/features/<feature>/<feature>.css`：该栏目专属样式。
- `src/shared/components/`：跨栏目复用的展示组件及其样式。
- `src/shared/lib/`：搜索、进度、安全解析、HTML 转义等纯函数。
- `src/shared/store/index.js`：`pkl-v3-state` 的唯一读写入口。
- `src/shared/content/site.js`：站名、导航、页脚等全局内容。
- `src/styles/index.css`：唯一 CSS 入口。
- `src/styles/tokens.css`、`base.css`、`layout.css`：全局样式。
- `docs/README.md`：文档导航。
- `docs/product/*`、`docs/design/*`、`docs/engineering/*`：稳定的产品、设计和工程说明。
- `docs/guides/add-content.md`：新增内容速查。

### 修改

- `index.html`：CSS 和模块入口切换到 `src/`。
- `package.json`：语法检查改为自动扫描 `src/**/*.js`，测试保持 `node --test`。
- `README.md`：同步方案 C 目录、启动方式和常用修改入口。
- `dev-server.mjs`：保持根目录静态服务行为，只补充明确的 MIME 与路径验证（如现有实现已覆盖则不改）。
- `tests/**/*.test.js`：切换到新的公开入口并按 features/shared/content/integration 归类。
- `docs/superpowers/specs/2026-09-09-feature-first-file-architecture-design.md`：补齐现有 `workspace` 与 `about` 栏目。

### 删除（仅在无人引用并通过验证后）

- `js/`
- `styles.css`
- `styles/`
- 失效的兼容转发文件与空目录

## 迁移约束

- 现有未提交修改先作为迁移基线，不覆盖、不丢弃、不单独重写其视觉或文案。
- 保留 `pkl-v3-state`、所有字段名和用户数据合并逻辑。
- 保留全部现有 Hash 路由及 alias：`topic`、`lesson`、`papers`、`projects`、`playbooks`、`favorites`、`library-resources`。
- 保留全部静态内容对象的 `id` 和跨实体关联。
- 不添加构建工具、框架、运行时依赖、`public/` 或 `.env.example`。

### 任务 1：锁定迁移基线和架构边界

**文件：**
- 修改：`docs/superpowers/specs/2026-09-09-feature-first-file-architecture-design.md`
- 创建：`tests/integration/architecture.test.js`

- [ ] **步骤 1：记录当前验证基线**

运行：

```powershell
node --test
Get-ChildItem js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

预期：33 个测试通过，所有 JavaScript 语法检查退出码为 0。

- [ ] **步骤 2：编写目录契约测试并确认失败**

创建 `tests/integration/architecture.test.js`，检查 `src/main.js`、每个 `src/features/*/index.js`、`src/styles/index.css` 和稳定文档入口存在，同时检查浏览器入口不再引用 `js/app.js` 与旧样式路径。

核心断言：

```js
assert.equal(existsSync('src/main.js'), true);
assert.equal(existsSync('src/features/topics/index.js'), true);
assert.equal(existsSync('src/features/workspace/index.js'), true);
assert.doesNotMatch(readFileSync('index.html', 'utf8'), /\.\/js\/app\.js/);
```

运行：`node --test tests/integration/architecture.test.js`

预期：FAIL，原因是 `src/main.js` 尚不存在。

- [ ] **步骤 3：补齐设计规格中的现有栏目**

在目标树和迁移映射中加入 `workspace/` 与 `about/`，避免迁移时遗漏当前有效路由。

- [ ] **步骤 4：提交基线契约**

```powershell
git add docs/superpowers/specs/2026-09-09-feature-first-file-architecture-design.md tests/integration/architecture.test.js
git commit -m "test: define feature-first architecture contract"
```

### 任务 2：拆分并迁移栏目数据

**文件：**
- 创建：`src/features/topics/data.js`
- 创建：`src/features/topics/model.js`
- 创建：`src/features/home/data.js`
- 创建：`src/features/about/data.js`
- 创建：`src/features/notes/data.js`
- 创建：`src/features/reading/data.js`
- 创建：`src/features/work/data.js`
- 创建：`src/features/toolbox/data.js`
- 创建：`src/features/library/data.js`
- 创建：`src/features/workspace/data.js`
- 创建：各栏目 `index.js`
- 测试：`tests/content/schema.test.js`
- 测试：`tests/content/related-links.test.js`

- [ ] **步骤 1：先把内容测试切到目标公开接口并确认失败**

示例：

```js
import { topics } from '../../src/features/topics/index.js';
import { notes } from '../../src/features/notes/index.js';
import { workItems } from '../../src/features/work/index.js';
```

运行：`node --test tests/content/schema.test.js tests/content/related-links.test.js`

预期：FAIL，错误为目标模块不存在。

- [ ] **步骤 2：将术语合并为单一数据源**

把 `js/data.js` 的分类、核心术语和 `js/expanded-data.js` 的扩展术语合并到 `src/features/topics/data.js`，对外统一导出：

```js
export const categories = [/* 保留现有对象 */];
export const topics = [/* 核心术语与扩展术语，顺序和 id 不变 */];
export const lessons = topics;
export const learningQuote = '真正的理解不是记住名词，而是能在出错时知道该检查哪里。';
```

把 `domainOf`、`WHY_LOOKUP`、`usedInReverse` 和 `topicsWithDomain` 移到 `model.js`，`index.js` 统一转出。

- [ ] **步骤 3：按实体拆分 `lab-data.js`**

保持对象内容和顺序不变，分别迁移：

```text
currentFocus   → features/home/data.js
aboutData      → features/about/data.js
papers         → features/reading/data.js
notes          → features/notes/data.js
workItems      → features/work/data.js
toolbox        → features/toolbox/data.js
library        → features/library/data.js
initialDigests → features/workspace/data.js
```

- [ ] **步骤 4：运行内容和全量测试**

运行：`node --test tests/content tests/data.test.js tests/integration.test.js`

预期：所有内容完整性、关联关系、术语唯一性和工作流测试通过。

- [ ] **步骤 5：提交栏目数据迁移**

```powershell
git add src/features tests/content tests/data.test.js tests/integration.test.js
git commit -m "refactor: group content data by feature"
```

### 任务 3：迁移共享逻辑、组件与状态

**文件：**
- 创建：`src/shared/lib/search.js`
- 创建：`src/shared/lib/progress.js`
- 创建：`src/shared/lib/safe.js`
- 创建：`src/shared/lib/html.js`
- 创建：`src/features/workspace/compiler.js`
- 创建：`src/shared/components/related-trail.js`
- 创建：`src/shared/store/index.js`
- 创建：`src/shared/content/site.js`
- 测试：`tests/shared/*.test.js`

- [ ] **步骤 1：先迁移测试 import 并确认目标模块缺失**

将 `tests/utils.test.js`、`tests/compiler.test.js` 和关联路径测试改为导入目标模块。

运行：`node --test tests/utils.test.js tests/compiler.test.js tests/content/related-trail.test.js`

预期：FAIL，错误为 `src/shared` 或 `src/features/workspace/compiler.js` 不存在。

- [ ] **步骤 2：迁移纯函数和编译器**

保持现有函数签名：

```js
export { normalizeText, searchLessons, searchAllEntities } from './search.js';
export { calculateProgress, categoryProgress, getNextLesson } from './progress.js';
export { safeParse } from './safe.js';
export { escapeHTML } from './html.js';
```

`compileProjectDigest`、`generateNoteDraft`、`generateToolboxDraft` 迁入工作台栏目，因为只服务快速捕获工作流。

- [ ] **步骤 3：建立唯一 store**

把默认状态、加载、保存和内置内容与用户内容合并逻辑移入 `src/shared/store/index.js`。公开接口：

```js
export const storageKey = 'pkl-v3-state';
export function createStore({ notes, workItems, toolbox, initialDigests }) { /* 保留兼容逻辑 */ }
```

store 返回 `getState()`、`save()`、`getAllNotes()`、`getAllWork()`、`getAllToolbox()` 和 `getAllDigests()`；所有 localStorage 读写只存在于该文件。

- [ ] **步骤 4：迁移站点内容和关联路径组件**

将当前工作区里的 `js/content/site.js` 与 `js/components/related-trail.js` 原样迁移到目标路径，调整 import，不修改用户文案。

- [ ] **步骤 5：运行共享层测试并提交**

运行：`node --test tests/utils.test.js tests/compiler.test.js tests/content/related-trail.test.js`

预期：全部通过。

```powershell
git add src/shared src/features/workspace tests
git commit -m "refactor: centralize shared services and store"
```

### 任务 4：迁移栏目页面与详情页

**文件：**
- 创建或修改：`src/features/home/page.js`
- 创建或修改：`src/features/topics/topics-page.js`
- 创建或修改：`src/features/topics/topic-detail-page.js`
- 创建或修改：`src/features/notes/notes-page.js`
- 创建或修改：`src/features/notes/note-detail-page.js`
- 创建或修改：`src/features/reading/reading-page.js`
- 创建或修改：`src/features/reading/reading-detail-page.js`
- 创建或修改：`src/features/work/work-page.js`
- 创建或修改：`src/features/work/work-detail-page.js`
- 创建或修改：`src/features/toolbox/toolbox-page.js`
- 创建或修改：`src/features/toolbox/toolbox-detail-page.js`
- 创建或修改：`src/features/library/page.js`
- 创建或修改：`src/features/about/page.js`
- 创建或修改：`src/features/practice/page.js`
- 创建或修改：`src/features/saved/page.js`
- 创建或修改：`src/features/workspace/page.js`

- [ ] **步骤 1：为路由页面定义统一契约测试**

每个栏目 `index.js` 至少公开一个路由页面函数，纯渲染页面遵循：

```js
export function render(context) { return '<section>...</section>'; }
export function mount(context) { return () => {}; }
```

事件较少的页面允许只实现 `render`。测试检查所有公开的 `render*` 对最小合法上下文返回字符串。

- [ ] **步骤 2：迁移现有独立视图**

将 `js/views/*.js` 移入对应栏目，原样保留当前未提交的首页、文章、实践和工具页面修改，只调整 import 路径和导出名称。

- [ ] **步骤 3：从 `app.js` 提取详情页**

按栏目移动 `renderTopicDetail`、`renderNoteDetail`、`renderPaperDetail`、`renderWorkDetail`、`renderToolboxDetail`，通过 `context` 接收数据、store、`showToast` 和 DOM 挂载点，不直接导入其他栏目内部文件。

- [ ] **步骤 4：提取其余栏目页面**

移动 `renderLibrary`、`renderAbout`、`renderWorkspace`、`renderPractice`、`renderSaved`、快速捕获审核页和必要事件绑定。跨栏目数据由路由上下文注入。

- [ ] **步骤 5：运行页面契约和全量测试并提交**

运行：`node --test`

预期：全部通过。

```powershell
git add src/features tests
git commit -m "refactor: colocate pages with website features"
```

### 任务 5：建立应用入口、路由与全局外壳

**文件：**
- 创建：`src/app/router.js`
- 创建：`src/app/routes.js`
- 创建：`src/app/shell.js`
- 创建：`src/main.js`
- 测试：`tests/integration/router.test.js`

- [ ] **步骤 1：编写路由 alias 与 404 测试**

核心测试：

```js
assert.deepEqual(parseHash('#/topics/frontend'), { routeName: 'topics', id: 'frontend', query: '' });
assert.equal(normalizeRouteName('projects'), 'work');
assert.equal(normalizeRouteName('favorites'), 'saved');
assert.equal(normalizeRouteName('missing'), 'not-found');
```

运行：`node --test tests/integration/router.test.js`

预期：FAIL，路由模块尚不存在。

- [ ] **步骤 2：实现纯路由模块**

`router.js` 公开 `parseHash`、`normalizeRouteName`、`createRouter`。alias 表集中定义，不在视图中判断旧路由名。

- [ ] **步骤 3：建立 routes 汇总与 shell**

`routes.js` 从每个栏目公开入口导入页面处理器；`shell.js` 管理全局搜索、主题、导航、Toast、菜单、滚动 UI 与 SEO meta 更新。

- [ ] **步骤 4：建立轻量 `main.js`**

`main.js` 只完成数据集汇总、store 初始化、shell 初始化和 router 启动。目标不超过 250 行，不包含栏目 HTML 模板。

- [ ] **步骤 5：运行路由测试和语法检查并提交**

运行：`node --test tests/integration/router.test.js && node --check src/main.js`

预期：全部通过。

```powershell
git add src/app src/main.js tests/integration/router.test.js
git commit -m "refactor: separate application shell and router"
```

### 任务 6：迁移并聚合样式

**文件：**
- 创建：`src/styles/index.css`
- 创建：`src/styles/tokens.css`
- 创建：`src/styles/base.css`
- 创建：`src/styles/layout.css`
- 创建：各栏目 `*.css`
- 创建：共享组件 `*.css`
- 修改：`index.html`

- [ ] **步骤 1：迁移全局样式且保留声明顺序**

将 token、基础排版、布局与遗留全局规则移动到 `src/styles/`。`index.css` 的导入顺序必须与当前 `<link>` 顺序等价，避免层叠结果改变。

- [ ] **步骤 2：迁移首页和共享组件样式**

把当前修改后的 `styles/views/home.css` 移至 `features/home/home.css`；将 hover explain、related trail、搜索和对话框样式移动到实际所有者目录。

- [ ] **步骤 3：按明确段落拆分索引和详情页样式**

依据现有注释边界，把栏目专属规则移入栏目 CSS；跨栏目使用的 `.portfolio-index`、`.portfolio-detail` 和通用页头保留在 `src/styles/layout.css`。保持选择器文本与先后顺序，不进行视觉重写。

- [ ] **步骤 4：建立唯一 CSS 入口并切换 HTML**

`src/styles/index.css` 使用 `@import` 明确列出全局、共享和栏目 CSS。`index.html` 只保留字体链接与：

```html
<link rel="stylesheet" href="./src/styles/index.css" />
<script type="module" src="./src/main.js"></script>
```

- [ ] **步骤 5：验证本地 HTTP 资源并提交**

启动：`node dev-server.mjs`

检查 `/`、`/src/main.js`、`/src/styles/index.css` 及每个 `@import` 返回 200。

```powershell
git add index.html src/styles src/features src/shared
git commit -m "refactor: colocate and aggregate website styles"
```

### 任务 7：迁移测试、清理旧目录并更新命令

**文件：**
- 修改：`package.json`
- 移动：`tests/*.test.js` 到目标分类
- 删除：`js/`、`styles.css`、`styles/`

- [ ] **步骤 1：把测试按被测对象归类**

```text
tests/data.test.js                    → tests/features/topics.test.js
tests/compiler.test.js                → tests/features/workspace.test.js
tests/utils.test.js                   → tests/shared/lib.test.js
tests/content/*                       → 保留 tests/content/*
tests/integration.test.js             → tests/integration/workflow.test.js
```

调整所有 import，只从栏目 `index.js` 或共享模块公开入口读取。

- [ ] **步骤 2：更新语法检查脚本**

在 `scripts/check-js.mjs` 递归扫描 `src/` 下 `.js` 文件并逐个调用 `node --check`；`package.json` 使用：

```json
"check": "node scripts/check-js.mjs"
```

- [ ] **步骤 3：确认旧目录已经无人引用**

运行：

```powershell
rg -n "(?:\.\/|\.\.\/)js/|styles/|styles\.css|lab-data|expanded-data" index.html src tests package.json README.md docs
```

预期：除归档文档的历史描述外，运行代码和稳定文档没有旧路径引用。

- [ ] **步骤 4：删除旧代码并验证**

只删除已确认无人引用的 `js/`、`styles.css` 和 `styles/`。随后运行：

```powershell
node scripts/check-js.mjs
node --test
```

预期：语法检查退出码 0，全部测试通过。

- [ ] **步骤 5：提交清理**

```powershell
git add package.json scripts tests js styles styles.css
git commit -m "refactor: remove legacy source layout"
```

### 任务 8：同步项目说明和文档目录

**文件：**
- 修改：`README.md`
- 创建：`docs/README.md`
- 创建：`docs/product/project-brief.md`
- 创建：`docs/product/information-architecture.md`
- 创建：`docs/design/design-spec.md`
- 创建：`docs/engineering/architecture.md`
- 创建：`docs/engineering/test-plan.md`
- 创建：`docs/engineering/deployment.md`
- 创建：`docs/guides/add-content.md`

- [ ] **步骤 1：重写根 README 的目录与速查**

README 必须包含：项目定位、快速开始、方案 C 核心目录树、栏目速查、依赖规则、测试命令和文档入口。

- [ ] **步骤 2：建立文档索引和稳定说明**

`docs/README.md` 列出稳定文档、研究资料、实施规格和历史计划。稳定文档不重复历史方案全文，而是链接到权威位置。

- [ ] **步骤 3：编写新增内容指南**

用具体路径和最小对象示例说明如何添加术语、文章、阅读、项目、工具与资料，并注明对应 schema 测试。

- [ ] **步骤 4：运行文档路径检查**

用 Node 脚本读取 Markdown 相对链接并确认目标存在；运行架构契约测试确认 README 描述的关键目录真实存在。

- [ ] **步骤 5：提交文档同步**

```powershell
git add README.md docs
git commit -m "docs: synchronize feature-first project guide"
```

### 任务 9：最终回归验证

**文件：**
- 修改：仅修复验证阶段发现的问题

- [ ] **步骤 1：运行完整自动化验证**

```powershell
node scripts/check-js.mjs
node --test
git diff --check
```

预期：语法检查退出码 0；测试 0 fail；差异无空白错误。

- [ ] **步骤 2：运行本地服务验证关键资源**

启动 `node dev-server.mjs`，确认以下地址返回 200：

```text
http://localhost:4173/
http://localhost:4173/src/main.js
http://localhost:4173/src/styles/index.css
```

- [ ] **步骤 3：浏览器验收主要路由**

逐一访问 `#/home`、`#/topics`、一个术语详情、`#/notes`、`#/work`、`#/toolbox`、`#/workspace`、`#/saved` 和 `#/about`。确认无控制台模块加载错误，搜索、主题切换、收藏和本地状态仍可使用。

- [ ] **步骤 4：核对迁移结果**

确认 `src/main.js` 不含栏目 HTML 模板，每个栏目从自己的 `index.js` 对外暴露能力，运行代码无旧目录引用，README 与 `docs/engineering/architecture.md` 的目录树和真实文件一致。
