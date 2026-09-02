# V4 项目文件分布架构

> 配套蓝图：[2026-09-02-v4-editorial-lab-blueprint.md](./2026-09-02-v4-editorial-lab-blueprint.md)
> 组织原则：**分层清晰 + 内容即数据 + 名称对位** —— 每类修改只有一个明确去处，新文件该放哪不需要思考。

---

## 一、总览：五层架构

```text
入口(index.html) → 视图(views) → 组件(components) ─┬→ 逻辑(lib)
                                                  ├→ 状态(store)
                                                  └→ 内容(content)
```

依赖只能**从上往下**单向流动，这是整个架构唯一的硬规则：

| 层 | 目录 | 职责 | 允许 import | 禁止 |
| :--- | :--- | :--- | :--- | :--- |
| 内容层 | `js/content/` | 纯数据实体，全站文案与内容 | **什么都不 import** | 出现 DOM/HTML 字符串、任何逻辑 |
| 状态层 | `js/store/` | localStorage 读写、迁移、订阅 | `lib/` | import views / components |
| 逻辑层 | `js/lib/` | 纯函数：搜索、进度、编译、校验 | `content/` | 操作 DOM、import views |
| 组件层 | `js/components/` | 可复用渲染函数（返回 HTML 字符串） | `lib/`（需要时） | import views、读取全局状态 |
| 视图层 | `js/views/` | 一个路由一个文件：拼装组件 + 绑定事件 | 全部下层 | 互相 import |

> 为什么不用 `src/`：本项目无构建步骤，浏览器直接加载模块，现有 `js/` 命名即约定俗成的无构建项目主流做法；保留 `js/` 避免全量改写 import 路径。同理保留 hash 路由（部署时无需任何 404 配置）。

---

## 二、目标目录树（完整版）

```text
vibe-hub/
├── index.html                     # 唯一 HTML：app-shell 骨架 + sidebar 导航 + 搜索/捕获 dialog
├── package.json                   # npm run dev / test / check
├── README.md                      # 项目是什么 + 快速开始 + 结构图（新人入口）
├── .gitignore
│
├── assets/                        # ── 原样部署的静态资源
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-cover.png               # 1200×630 分享卡
│   └── resume.pdf                 # 页脚 Resume 直链
│
├── js/
│   ├── main.js                    # ★ 唯一入口：创建 store → 注册路由 → 绑定全局事件(/、主题、toast)
│   ├── router.js                  # 路由表 [{pattern, view, alias}] + hashchange 监听
│   │
│   ├── content/                   # ── 内容层：全站要改的"字"都在这里
│   │   ├── site.js                #    站名 / Hero 文案 / Terminal 台词 / About / 页脚链接
│   │   ├── topics.js              #    术语实体（data.js + expanded-data.js 合并而来）
│   │   ├── notes.js               #    笔记（含 unresolved 必填）
│   │   ├── reading.js             #    论文与文章（memorized 必须恰好 3 条）
│   │   ├── work.js                #    项目 / 原型 / 实验
│   │   ├── toolbox.js             #    Prompt / Workflow / Checklist / Template
│   │   ├── library.js             #    资源库（whySaved 必填）
│   │   └── practice.js            #    题库（运行时也从 topics.question 兜底生成）
│   │
│   ├── views/                     # ── 视图层：文件名 = 路由名
│   │   ├── home.js                #    #/home        编辑长流首页
│   │   ├── topics.js              #    #/topics      域分组行式索引
│   │   ├── topic-detail.js        #    #/topics/:id
│   │   ├── notes.js               #    #/notes       年份时间轴
│   │   ├── note-detail.js         #    #/notes/:id
│   │   ├── reading.js             #    #/reading     四类型筛选
│   │   ├── reading-detail.js      #    #/reading/:id
│   │   ├── work.js                #    #/work        重点卡 + 行条目
│   │   ├── work-detail.js         #    #/work/:id    Problem-first 模板
│   │   ├── toolbox.js             #    #/toolbox     按问题分组
│   │   ├── tool-detail.js         #    #/toolbox/:id
│   │   ├── library.js             #    #/library     单页清单
│   │   ├── practice.js            #    #/practice
│   │   ├── saved.js               #    #/saved       按类型分组
│   │   ├── about.js               #    #/about
│   │   └── not-found.js           #    兜底 404 视图
│   │
│   ├── components/                # ── 组件层：跨视图复用，纯函数 render
│   │   ├── index-row.js           #    行式清单条目（topics/work/library 通用）
│   │   ├── timeline-list.js       #    时间轴清单（notes/reading 通用）
│   │   ├── split-pair.js          #    首页 3:2 双栏容器
│   │   ├── terminal.js            #    MiniTerminal
│   │   ├── related-trail.js       #    认知路径（relation 排序）
│   │   ├── hover-explain.js       #    术语悬浮解释浮层
│   │   ├── toc.js                 #    长文目录（IntersectionObserver）
│   │   ├── quiz.js                #    Quick Check / Practice 共用答题块
│   │   └── lab/                   #    Interactive Lab（核心资产，独立子目录）
│   │       ├── interactive-lab.js     # 节点图 + 步骤控制
│   │       └── templates.js           # 三种动效模式模板
│   │
│   ├── lib/                       # ── 逻辑层：与 DOM 无关的纯函数
│   │   ├── search.js              #    全实体搜索（原 utils.searchAllEntities）
│   │   ├── progress.js            #    覆盖率 / 分类进度 / 下一课推荐
│   │   ├── date.js                #    日期格式化（SEP 02 / 2026.09）
│   │   ├── compiler.js            #    快速记录 → 6 字段 Digest → Note/Tool 草稿
│   │   └── schema.js              #    发布门槛校验（测试与 dev 控制台警告共用）
│   │
│   └── store/                     # ── 状态层：localStorage 唯一读写口
│       ├── index.js               #    createStore / 版本迁移 / 导入导出
│       ├── favorites.js           #    统一收藏（topic/note/reading/tool 四类）
│       ├── local-notes.js         #    词条页"我的笔记"
│       └── theme.js               #    日间/夜航
│
├── styles/                        # ── 样式：token 先行，与 js 层对位
│   ├── tokens.css                 # ★ 全站设计变量（双主题）—— 改色改字只动这里
│   ├── base.css                   #    reset / 排版 / 清单行 / 分隔线 / 引用块
│   ├── layout.css                 #    shell / sidebar / header / 栅格 / 断点
│   ├── components/                #    与 js/components 一一对应
│   │   ├── lists.css              #    index-row + timeline-list
│   │   ├── terminal.css
│   │   ├── related-trail.css
│   │   ├── quiz.css
│   │   ├── lab.css
│   │   └── dialogs.css            #    搜索 / 快速记录浮层 + toast
│   └── views/                     #    页面独有样式（克制，能进 base 的不进这里）
│       ├── home.css
│       └── detail.css             #    各详情页共享的正文排版
│
├── tests/                         # ── 与 js/ 结构镜像，node --test 直跑
│   ├── content/
│   │   ├── schema.test.js         #    发布门槛强校验（whySaved/unresolved/memorized=3…）
│   │   ├── related-links.test.js  #    related 死链与 relation 枚举校验
│   │   └── topics.test.js         #    id 唯一性 / quiz answer 合法性
│   ├── lib/
│   │   ├── search.test.js
│   │   ├── compiler.test.js
│   │   └── progress.test.js
│   ├── store/
│   │   └── store.test.js
│   └── router.test.js             #    alias 重定向与 404 兜底
│
├── scripts/                       # ── 开发期小工具（node 直跑，无依赖）
│   └── check-content.js           #    一键内容预检：缺字段/死链/对比度提示
│
└── docs/
    ├── plans/                     #    方案文档（日期前缀惯例，本文件所在处）
    └── guides/
        ├── add-content.md         #    如何加一篇笔记/术语/工具（最常用指南）
        ├── add-page.md            #    如何加一个新路由页面
        └── deploy.md              #    部署速查（指向 plans/2026-09-02-v4-deploy-guide.md）
```

---

## 三、修改场景速查表（记住这张表就够了）

| 我想要… | 去哪里 | 顺带动什么 |
| :--- | :--- | :--- |
| 改首页的自我介绍 / Terminal 台词 / About | `js/content/site.js` | 无 |
| 加一篇笔记 | `js/content/notes.js` 追加一个对象 | 无（索引自动出现） |
| 加一个术语 | `js/content/topics.js` | 补 `entryQuestion` 才会进首页"从问题开始" |
| 加一篇论文/文章 | `js/content/reading.js` | `memorized` 必须恰好 3 条 |
| 加一个项目/实验 | `js/content/work.js` | 想上首页就标 `featured: true` |
| 加一个 Prompt/Checklist | `js/content/toolbox.js` | `solves` 写成一个问题 |
| 加一条资源 | `js/content/library.js` | `whySaved` 必填 |
| 改全站配色 / 字体 / 间距 | `styles/tokens.css` | **只动这一个文件** |
| 改导航顺序/名称 | `index.html` sidebar 区 | 新页面才需要同步 `js/router.js` |
| 加一个全新页面 | `js/views/xxx.js` → `js/router.js` 注册 → `styles/views/xxx.css`(可选) | index.html 不用动 |
| 加一个复用交互组件 | `js/components/xxx.js` + `styles/components/xxx.css` | 由 views 引入 |
| 改搜索行为 | `js/lib/search.js` | 结果分组在 `main.js`/搜索 dialog |
| 改收藏/笔记的存储 | `js/store/*.js` | 别绕过 store 直接碰 localStorage |

---

## 四、命名与书写约定

1. **文件名 = 身份**：视图文件名等于路由名（`work.js` ↔ `#/work`），详情页加 `-detail` 后缀；内容文件名 = 实体复数（`notes.js` 导出 `notes`）。
2. **每个 content 对象必须有 `id`**，全站 related 引用一律用 `{ type, id, relation }`，不允许直接内嵌 HTML。
3. **视图模块统一签名**：`export function render(params) → html string` + `export function mount(params)`（绑事件）。router 只认这两个名字。
4. **组件禁止有副作用**：只接收数据返回字符串；事件绑定一律在视图层 `mount` 中完成。
5. **样式类名前缀**：组件 `c-`（`c-index-row`）、布局 `l-`、页面 `v-`、工具类 `u-`；避免全局污染，也方便一眼判断样式来源。
6. **import 相对路径速记**：
   - views 里 → `../content/notes.js`、`../components/index-row.js`、`../lib/search.js`、`../store/favorites.js`
   - components 里 → `../lib/date.js`
   - tests 里 → `../js/lib/search.js`（与源码目录镜像对位）

---

## 五、从现状到目标：迁移映射

> 迁移按蓝图 Phase 0–4 执行，每步一个独立 commit，`npm run check && npm test` 全绿再进下一步。

| 现状 | 去向 | Phase |
| :--- | :--- | :--- |
| `index.html`（107 行） | 保留骨架，sidebar 重排 + `<link>` 改指 `styles/` | 0 |
| `styles.css`（单文件 761 行） | 拆为 `styles/{tokens,base,layout}.css` + `components/` + `views/`，旧文件逐步清空后删除 | 0–3 |
| `js/app.js`（1819 行） | 拆为 `main.js` + `router.js` + `views/*`（每页一个）+ `components/*` | 1–4 |
| `js/data.js` + `js/expanded-data.js` | 合并为 `js/content/topics.js`（category→domain 重映射） | 2 |
| `js/lab-data.js`（719 行） | 拆为 `content/{site,notes,reading,work,toolbox,library}.js` | 2–3 |
| `js/projects-data.js`（411 行，V2 遗留） | **删除**，有效内容并入 `work.js`/`toolbox.js` | 3 |
| `js/compiler.js` | 移至 `js/lib/compiler.js`，仅改引用 | 3 |
| `js/utils.js`（253 行） | 拆为 `lib/{search,progress,date}.js` | 2 |
| `tests/*` | 迁入镜像目录 + 新增 schema/related 校验 | 2–3 |
| `dev-server.mjs` | 保留原位（只服务根目录，新增目录自动覆盖） | — |

过渡期兼容策略：拆分期间旧 `styles.css` 与新 `styles/` 短暂共存，每迁移完一个组件立即删除旧文件中对应段落，避免双源。

---

## 六、反模式红线（Code Review 自查）

- ❌ 在 `content/` 里写 HTML 字符串或 `document.` —— 内容层必须能被测试直接 import；
- ❌ 视图之间互相 import —— 复用下沉到 `components/`；
- ❌ 绕过 `store/` 直接读写 localStorage —— 迁移与备份会失效；
- ❌ 一个 view 文件超过 300 行 —— 说明该拆组件；
- ❌ 新增第四种筛选维度、第二个强调色、第二种卡片样式 —— 违反蓝图 §5/§8；
- ❌ 在组件里判断路由 —— 组件只对数据负责。

---

## 七、为什么是这套组织方式（对照主流实践）

| 主流实践 | 本项目对应 | 取舍理由 |
| :--- | :--- | :--- |
| Next.js/Astro 的「页面路由即文件」 | `views/` 文件名 = 路由名 | 无框架也能获得同样的"找文件直觉" |
| Content-driven 站的内容/代码分离（Astro Content、Hugo content） | `js/content/` 纯数据层 | 写内容不碰逻辑，测内容不启浏览器 |
| React 生态 components/hooks/lib 分层 | `components/ + lib/ + store/` | 同样的单向依赖，复杂度封顶可控 |
| 样式 token 先行（design tokens） | `styles/tokens.css` 唯一变量源 | 双主题与"一个强调色"纪律靠它落地 |
| 测试目录镜像源码目录（Go/Rust 惯例） | `tests/` 与 `js/` 同构 | 看路径即知测试对象 |
