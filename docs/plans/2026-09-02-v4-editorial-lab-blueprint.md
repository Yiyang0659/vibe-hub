# AI Knowledge & Practice Lab — V4 编辑部混合版完整蓝图

> 分支：`feature/v4-editorial-lab` ｜ 基线：`d662127`（V3 能力档案库检查点）
> 定位一句话：**一个看起来像真实个人长期维护的 AI 知识实验室，同时能明确证明"我真正理解过、研究过、做过什么"。**
> 组合公式：**Jarod 的页面节奏 + 张赫的问题优先表达 + 现有 VibeHub 式 Topic 交互。**

---

## 目录

1. [定位与设计原则](#一定位与设计原则)
2. [三个参考来源的取舍矩阵](#二三个参考来源的取舍矩阵)
3. [现状代码审计（基于真实代码）](#三现状代码审计基于真实代码)
4. [信息架构 V4：导航与路由](#四信息架构-v4导航与路由)
5. [视觉语言系统：Editorial Developer Lab](#五视觉语言系统editorial-developer-lab)
6. [页面布局与组件规格（逐页线框）](#六页面布局与组件规格逐页线框)
7. [数据模型与内容规范](#七数据模型与内容规范)
8. [交互系统规格（仅保留 6 个）](#八交互系统规格仅保留-6-个)
9. [响应式与栅格](#九响应式与栅格)
10. [实施路线图（Phase 0–4）](#十实施路线图phase-04)
11. [部署与上线](#十一部署与上线)
12. [不做清单 / 风险与对策](#十二不做清单--风险与对策)

---

## 一、定位与设计原则

### 1.1 网站要回答的四个问题

访客（尤其是面试官）在 5 分钟内应该能得出四个结论：

```text
TOPICS   → 我懂什么（知识宽度）
NOTES    → 我怎么理解（思考深度）
READING  → 我研究过什么（输入质量）
WORK     → 我真正做过什么（实践证据）
TOOLBOX  → 我沉淀了什么方法（复用价值）
LIBRARY  → 我持续关注什么（长期主义）
```

### 1.2 第一性原则：不是 Dashboard，是编辑部

当前站点（V3）的观感是「AI SaaS 监控面板」：到处是 ONLINE 状态灯、KPI 百分比、同宽同高的卡片网格。V4 要把观感切换为「个人长期维护的编辑出版物」：

| 维度 | V3 现状（要去掉） | V4 目标（要建立） |
| :--- | :--- | :--- |
| 首页第一屏 | 大 Hero + CAPABILITY INDEX + 统计大字 | 一句人话自我介绍 + 2 个 CTA + 小型 Terminal |
| 信息密度 | 卡片网格，每个模块同宽同高 | 编辑长流，主次分明，重要内容占大版面 |
| 状态噪音 | `ONLINE / RUNTIME / LOCAL DATA` 遍地 | 只在 Terminal 与页脚出现，作为人格化点缀 |
| 内容单元 | 复杂产品卡（多层边框、徽章） | **时间 + 标题 + 一句话 + 元信息** 的清单行 |
| 项目表达 | 按技术栈罗列 | **先讲问题，再讲方案与结果** |
| 中英文 | 双语标题重复堆叠 | 中文为主，英文只做 Monospace 小标签 |

### 1.3 视觉配比（硬性约束）

```text
60%  编辑出版物阅读感 —— 衬线大标题、纸质底色、清单式内容
25%  Developer / Terminal —— 等宽字体标签、$ 命令行点缀、路径隐喻
15%  实验性交互 —— Interactive Lab、Quick Check、Hover Explain
```

任何新组件如果让三者的比例偏离这个区间（比如又造出一个 KPI 卡），就不应该合入。

### 1.4 五条评审红线（每个 PR 自查）

1. 页面上不允许出现两个功能相同但样式不同的"卡片系统"；
2. 任何列表项禁止超过 3 层视觉嵌套（边框套边框套边框）；
3. 首页从上往下读，必须像一个"人在说话"，而不是一个系统在汇报；
4. 每条内容必须有"人的痕迹"字段（我为什么查/我还没想清楚/为什么值得留下）；
5. 移动端不允许出现横向滚动，正文宽度不随窗口无限拉伸。

---

## 二、三个参考来源的取舍矩阵

### 2.1 从 Jarod（jarods.dev）借什么

| 借鉴点 | 具体落到本站的做法 | 放弃的部分 |
| :--- | :--- | :--- |
| 首页第一屏 = 人话 + CTA + Terminal | Hero 改为一句介绍 + 两个按钮 + 右侧 `~/about — zsh` 小终端 | Terminal 不承担数据展示功能（不放进度、不放统计） |
| 文章列表 = 时间 + 标题 + 摘要 + 阅读时长 | NOTES 页做成按年分组的编辑清单，不做卡片网格 | 不做"按标签聚合的笔记矩阵" |
| 项目/工具用紧凑列表 | LIBRARY、WORK 第二梯队用「名称 + 一句话 + 箭头」行式布局 | 不给每个资源做独立大卡片 |
| 个人语言贯穿全站 | 所有板块标题用第一人称短句（"最近在弄""我做过"） | 不写长篇自传式文案 |

### 2.2 从张赫（zhanghe.dev）借什么

| 借鉴点 | 具体落到本站的做法 | 放弃的部分 |
| :--- | :--- | :--- |
| Problem-first 叙事 | WORK 详情页第一屏先写"解决什么问题"，技术栈放最后 | 不做简历式"背景/职责/技术/成果"四段论 |
| 工具按"解决什么"组织 | TOOLBOX 每条以问题为标题（"模型输出突然变差时，从哪里开始排查？"） | 不用 "Prompt 001 / Skill 002" 编号式命名 |
| 每个作品有使用场景与结果 | WORK 模板强制 `PROBLEM / RESULT / WHAT I LEARNED` 字段 | 不做产品功能九宫格 |

### 2.3 从现有 VibeHub 式站点保留什么

| 保留点 | 原因 | V4 的调整 |
| :--- | :--- | :--- |
| Interactive Lab（多步交互仿真） | 这是全站最有辨识度的模块，直接证明"不是搬运" | 视觉降噪：去掉外层仪表框，保留节点图与步骤控制 |
| Quick Check 单题测验 | 低成本证明"理解过" | 保持，但去掉 PASSED/FAILED 的重工业配色 |
| Topic 12 段结构 | 知识密度高 | 新增两个个人化字段：`whyLookup`（我为什么查）、`usedIn`（我在哪用过） |
| 全局搜索 `/` | 已实现且好用 | 数据源扩到全实体，结果按类型分组（已有基础） |
| 收藏 / Practice / 夜间模式 | 已实现且稳定 | 全部保留为辅助功能，导航降级到分隔线下方 |

---

## 三、现状代码审计（基于真实代码）

> 审计基线：`feature/v4-editorial-lab @ d662127`，共约 5010 行（不含生成数据展开）。

### 3.1 文件级现状

| 文件 | 规模 | 内容 | V4 处置 |
| :--- | :--- | :--- | :--- |
| `index.html` | 107 行 | app-shell：sidebar（品牌/导航/覆盖率/快速记录）+ topbar（搜索/日期/主题）+ `main#main-content` + search-dialog + capture-dialog + toast | **重构**：侧栏导航按 V4 顺序重排；覆盖率模块降级；新增 Terminal 挂载点 |
| `js/app.js` | 1819 行 | hash 路由 + 10 个页面渲染函数 + 全部事件绑定 | **拆分**：按页面拆成 `js/views/*.js`，router 收敛为 ≤120 行的注册表 |
| `js/data.js` | 292 行 | 5 个分类（前端/后端/AI 协作/产品设计/工程实践）+ 60 个 core lessons | **保留**，改名为 `js/content/topics-core.js` |
| `js/expanded-data.js` | 508 行 | 扩展词条 | **保留**，并入 `js/content/topics.js` |
| `js/lab-data.js` | 719 行 | V3 实体：papers / notes / workItems / toolbox / library / currentFocus / aboutData / initialDigests | **拆分**：按实体拆到 `js/content/` 下六个文件 |
| `js/projects-data.js` | 411 行 | V2 遗留：initialProjects / initialDigests / initialResearch / initialPlaybooks | **删除**（内容已并入 lab-data，删除前跑测试确认无引用） |
| `js/compiler.js` | 140 行 | 快速记录 → 6 字段 Digest → Note/Toolbox 草稿 | **保留**，仅更新引用路径 |
| `js/utils.js` | 253 行 | searchLessons / searchAllEntities / calculateProgress 等 | **保留**，searchAllEntities 的数据源注入改为显式传参 |
| `styles.css` | 761 行（92KB 压缩长行） | 双主题变量 + 全部组件样式 | **重构**：拆为 `styles/tokens.css` + `styles/base.css` + `styles/components/*.css`；V4 新视觉 token 全部进 tokens.css |
| `tests/*.test.js` | 5 个文件，14 用例全绿 | 数据完整性 / 搜索 / 编译器 / 集成流 | **保留**，每 Phase 追加对应测试 |

### 3.2 路由现状 → V4 路由

| 现有路由（V3） | V4 路由 | 说明 |
| :--- | :--- | :--- |
| `#/home` | `#/home` | 内容全部重写 |
| `#/topics`、`#/topic/:id`、`#/lesson/:id` | `#/topics`、`#/topics/:id` | 旧 id 路由做 301 式重定向（router 内 alias 表） |
| `#/notes` | `#/notes` | 索引改为时间轴清单，详情新增"我还没想清楚"段 |
| `#/papers` | `#/reading`（filter=PAPER） | Papers 与好文章合并；`#/papers` 保留 alias |
| `#/work`、`#/projects` | `#/work`、`#/work/:id` | 详情重写为 Problem-first 模板；`#/projects` alias |
| `#/toolbox`、`#/playbooks` | `#/toolbox`、`#/toolbox/:id` | 索引按"解决什么问题"分组 |
| `#/library-resources` | `#/library` | `#/library?id=x` 旧参数式路由 alias |
| `#/practice` | `#/practice` | 保留 |
| `#/saved`、`#/favorites` | `#/saved` | 按类型分组展示 |
| `#/about` | `#/about` | 内容精简 |
| —（无） | `#/work/:id` 下相关 Trail 区块 | 新增 Related Trail 组件（详见 §8.3） |

### 3.3 需要删除的"仪表盘残留"清单

在 `styles.css` / `app.js` 中定位到的 V3 元素，V4 中明确移除或降级：

- [ ] 侧栏 `TOPIC COVERAGE` 百分比大字 → 降级为页脚一行小字；
- [ ] 侧栏 `LOCAL RUNTIME ONLINE` 状态灯 → 移入 Terminal 组件，仅首页出现；
- [ ] 首页 System Monitor 大数字看板 → 替换为 Terminal + Now 卡；
- [ ] 首页 5 张同宽航线卡网格 → 改为 5 行"领域清单行"；
- [ ] `PASSED / FAILED` 工业色块 → 改为墨绿/朱红细线标记；
- [ ] 双语重复大标题 → 中文衬线主标题 + 英文等宽 eyebrow 单行。

---

## 四、信息架构 V4：导航与路由

### 4.1 侧栏导航（桌面 ≥1024px）

```text
┌──────────────────────────┐
│  AI KNOWLEDGE LAB        │   ← 品牌：衬线粗体，副行 `AI · Product · Building`
│  AI · Product · Building │
├──────────────────────────┤
│  01  首页       HOME     │
│  02  术语       TOPICS   │
│  03  笔记       NOTES    │
│  04  阅读       READING  │
│  05  实践       WORK     │
│  06  工具箱     TOOLBOX  │
│  07  资源库     LIBRARY  │
├──────────────────────────┤
│      测试运行   PRACTICE │   ← 辅助区：弱化字号
│      已保存     SAVED    │
│      关于       ABOUT    │
├──────────────────────────┤
│  ⌘ 搜索（/）    夜航 ◐   │
└──────────────────────────┘
```

规则：
- 主导航 7 项，每项 = 序号（等宽小字）+ 中文名（衬线）+ 英文 eyebrow；
- 辅助区（Practice/Saved/About）与主区用细分隔线隔开，视觉权重降低；
- 当前项高亮方式：左侧 2px 朱红竖线 + 加粗，不再用整块底色反转。

### 4.2 URL 规范

```text
#/home
#/topics?domain=ai          # 索引，domain ∈ ai|product|agent|engineering
#/topics/:id                # 详情
#/notes                     # 索引（按年分组）
#/notes/:id                 # 详情
#/reading?filter=paper      # 索引，filter ∈ all|paper|article|report|book
#/reading/:id               # 详情
#/work?kind=project         # 索引，kind ∈ all|project|prototype|experiment
#/work/:id                  # 详情（三种 kind 共用模板，字段按需隐藏）
#/toolbox?tag=evaluation    # 索引，按问题分组
#/toolbox/:id               # 详情
#/library                   # 单页清单
#/practice                  # 测试运行
#/saved                     # 已保存（按类型分组）
#/about                     # 关于
```

Router 实现：`app.js` 收敛为一个路由表对象 `{ pattern, view, alias }`，每个 view 是 `js/views/` 下独立的纯函数模块，签名统一 `render(params) => string` + `mount(params)` 绑定事件。

---

## 五、视觉语言系统：Editorial Developer Lab

### 5.1 设计 Token（写入 `styles/tokens.css`）

#### 色彩

```css
:root, [data-theme="day"] {
  /* 纸面 —— 暖白纸张，接近印刷品 */
  --paper:        #f7f4ec;   /* 页面底 */
  --paper-deep:   #efeadf;   /* 区块底 */
  --paper-light:  #fdfcf8;   /* 浮层/卡片底 */

  /* 墨色 */
  --ink:          #1a1d1c;   /* 正文 */
  --ink-soft:     #5a5f5b;   /* 次要文字 */
  --ink-faint:    #9a9e97;   /* 元信息 */

  /* 强调 —— 只允许这一个强调色承担"可点击/重点" */
  --vermilion:    #c8442c;   /* 朱红：链接、当前项、关键标记 */

  /* 知识域功能色（仅作 2px 线与标签底，禁止大面积使用） */
  --domain-ai:         #2f7d6d;   /* 青绿  AI */
  --domain-product:    #3d6ba8;   /* 蓝    Product */
  --domain-agent:      #7b5ea7;   /* 紫    Agent */
  --domain-engineering:#b0722d;   /* 赭黄  Engineering */

  --line:         #ddd6c8;   /* 常规线 */
  --line-strong:  #b8b0a0;   /* 强线 */
}

[data-theme="night"] {
  --paper: #101613;  --paper-deep: #0b100e;  --paper-light: #18201c;
  --ink: #e6e1d4;    --ink-soft: #a8a89a;    --ink-faint: #6f7268;
  --vermilion: #e06a50;
  /* domain 色在暗色下整体提亮 12% */
  --line: #2a322d;   --line-strong: #3c4640;
}
```

色彩使用纪律：
- 强调色全站只有一个（朱红），知识域四色只出现在：卡顶 2px 线、eyebrow 标签、进度线，三种场景；
- 禁止出现彩色底大块、渐变、彩色阴影；
- 暗色主题不是"反色"，是同一套编辑排版换纸：对比度按 WCAG AA 校验（正文 ≥ 7:1，次要 ≥ 4.5:1）。

#### 字体

```css
--serif: "方正书宋_GBK", "Songti SC", "STSong", "Noto Serif SC", serif;
   /* 用途：中文正文与所有标题 */
--sans: "霞鹜文楷", "LXGW WenKai", "Microsoft YaHei", sans-serif;
   /* 用途：UI 控件、表单、按钮 */
--mono: "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace;
   /* 用途：eyebrow 标签、Terminal、序号、日期、代码 */
```

#### 字号阶梯（正文型页面）

```text
--fs-display:  clamp(30px, 4vw, 44px) / 1.25   衬线   首页主标题
--fs-h1:       30px / 1.3                       衬线   页面标题
--fs-h2:       21px / 1.4                       衬线   区块标题
--fs-h3:       16px / 1.5                       衬线   列表项标题
--fs-body:     15px / 1.9                       衬线   正文（行高是重点，1.9 起步）
--fs-meta:     12px / 1.5                       等宽   日期/时长/序号
--fs-eyebrow:  11px / 1.4  letter-spacing .14em 等宽   类型标签
```

#### 间距与栅格

```text
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 24px  --space-6: 32px  --space-7: 48px  --space-8: 72px
区块纵向间距：至少 --space-7；列表行高：≥ --space-5（紧凑清单也保持呼吸感）
```

### 5.2 组件形态规范

| 组件 | V4 形态 | 禁止 |
| :--- | :--- | :--- |
| 内容清单行 | `[日期 mono] 标题(衬线h3) — 一句话(soft) [元信息]`，hover 时标题变朱红并右移箭头 | 边框盒、阴影、徽章堆叠 |
| 主内容卡（仅 WORK 重点项使用） | 顶部 2px 域色线 + 单边框 + 纸色底，内部纯排版 | 圆角 > 4px、彩色投影 |
| eyebrow 标签 | `NOTE · AI EVALUATION · 6 MIN`，等宽 11px，域色文字或 1px 边框 | 彩色实底胶囊 |
| 按钮 | 文本按钮（默认）/ 细边框按钮（次级）/ 墨底反白按钮（主 CTA，全站每页 ≤1 个） | 渐变按钮、彩色按钮 |
| 分隔 | 细线 + 居中菱形符号 `◆`（继承现有纸感语言） | 粗黑分割条 |
| Terminal | 纸深底 + 等宽字 + `$` 前缀，无窗口红黄绿灯装饰 | 拟物 mac 窗口框 |
| 引用/结论块 | 左侧 2px 朱红线 + 衬线斜体 | 灰底引用框 |

### 5.3 页面骨架尺寸

```text
桌面：Sidebar 232px 固定 ｜ Main max-width 1040px，左右 padding 48px
正文型页面（Note/Reading/Topic）：Article 列 720px + 右侧 TOC 200px（sticky）
移动端：Header 56px 吸顶 + 抽屉导航；正文 100% - 32px padding
```

---

## 六、页面布局与组件规格（逐页线框）

### 6.1 HOME —— 编辑长流（7 屏）

```text
┌────────────────────────────────────────────────────────────┐
│ HERO                                                        │
│ AI · PRODUCT · BUILDING                    ~/about — zsh    │
│                                            $ whoami         │
│ 我在 AI、产品和构建实践中，                 → Evaluation /   │
│ 留下真正搞明白和真正做过的东西。              Agent / Builder │
│                                            $ currently      │
│ 最近主要在弄：AI Evaluation · Agent ·       → Agent Eval    │
│ AI Product                                 → Knowledge Lab  │
│                                            $ building       │
│ [看看知识 →]  [看看我做过的东西 →]           → PKL · Eval Flow│
├────────────────────────────────────────────────────────────┤
│ NOW / 最近在弄                                    2026.09   │
│ 现在主要在研究 Agent Evaluation。最近越来越觉得：            │
│ 评测设计本质上不是"让另一个模型打分"这么简单。    [相关笔记 →]│
├─────────────────────────────┬──────────────────────────────┤
│ 最近搞明白                   │ 最近做的东西                  │
│ NOTE · 6 min                 │ PROJECT · AI EVALUATION      │
│ 为什么规则明确的 Evaluation   │ 七维能力自动评测系统          │
│ 不应该完全交给 LLM？          │ Rule → Judge → Result        │
│ [读 →]                       │ [看 →]                       │
├─────────────────────────────┴──────────────────────────────┤
│ 从问题开始                                        全部知识 →│
│ AI 为什么总会瞎编？            → Hallucination              │
│ 怎么判断模型评得准不准？        → LLM Judge                  │
│ Agent 为什么需要 MCP？         → MCP                        │
│ AI 把代码改坏了怎么回退？       → Git 工作流                 │
├────────────────────────────────────────────────────────────┤
│ 我做过 / 验证过的东西                            全部实践 →  │
│ 01  七维能力自动评测系统 —— 确定性规则与 Judge 怎样分工？     │
│ 02  Personal Knowledge Lab —— 用 AI 协助建知识库             │
│ 03  Few-Shot 对 Judge 方差的影响 —— EXPERIMENT              │
├────────────────────────────────────────────────────────────┤
│ 最近留下的笔记                                              │
│ 09.02  为什么很多 AI 产品最后变成 Chat UI？                  │
│ 08.31  Web App Manifest 到底是不是 App？                    │
│ 08.29  MCP 和 REST API 最大区别是什么？                     │
├─────────────────────────────┬──────────────────────────────┤
│ 最近读过                     │ 工具箱                        │
│ PAPER  ReAct                 │ Evaluation Checklist          │
│ PAPER  Attention Is All…     │ Prompt Debug Flow             │
│ ARTICLE Agent 认知架构       │ GitHub Analysis Prompt        │
├─────────────────────────────┴──────────────────────────────┤
│ 值得留下的资料                                              │
│ VibeHub —— 用真实问题解释技术概念                            │
│ Anthropic Docs —— Evaluation 设计的第一手参考               │
├────────────────────────────────────────────────────────────┤
│ 页脚：About · GitHub · Resume · Email · 已学 42/60 · 夜航   │
└────────────────────────────────────────────────────────────┘
```

组件与数据绑定：

| 区块 | 组件 | 数据源 | 空状态 |
| :--- | :--- | :--- | :--- |
| Hero | `HomeHero` + `MiniTerminal` | `aboutData.hero` / `aboutData.terminal` | Terminal 固定内容，无空态 |
| Now | `NowCard` | `currentFocus[0]`（含 date + 相关笔记 id） | 无内容则整屏隐藏 |
| 最近搞明白/做的东西 | `SplitPair`（2 列不等宽 3:2） | notes 按 date 取 1 + workItems 取 featured 1 | 各自占满整行 |
| 从问题开始 | `QuestionIndex` | topics 中 `entryQuestion` 字段，取 4–6 条 | 隐藏 |
| 做过/验证过 | `WorkIndexList` | workItems 排序取 3（Project 优先，Experiment 补位） | 隐藏 |
| 最近笔记 | `NotesTimeline`（compact） | notes 按 date 取 3 | 隐藏 |
| 读过/工具箱 | `SplitPair` | papers+articles 取 3 / toolbox 取 3 | 隐藏 |
| 资料库 | `LibraryLines` | library 取 2–3 | 隐藏 |

原则：**每个区块都是可独立隐藏的**，内容不够时不渲染骨架占位。

### 6.2 TOPICS 索引

```text
TOPICS
我真正遇到并搞明白过的概念。

[ 全部 ] [ AI ] [ Product ] [ Agent ] [ Engineering ]     ⌕ 站内过滤

AI EVALUATION ─────────────────────────────────────────
LLM Judge        让一个模型判断另一个模型的输出靠谱吗？      用过 1 · 相关 3
Precision        我判断正确的内容，到底有多少是真的？        用过 1
Recall           应该找出来的东西，到底漏掉了多少？          —
Ground Truth     评测到底拿什么作为"标准答案"？              —

AGENT ────────────────────────────────────────────────
MCP              模型怎么安全地拿到外部工具和数据？          用过 2
ReAct            推理和行动为什么要交替进行？                —
```

规格：
- 放弃卡片网格，改为**域分组的行式清单**（与 §6.1「从问题开始」同构）；
- 每行：术语（衬线 16px）+ 一句话问题（12px soft）+ 右侧 `用过 n` 小标记（来自 `usedIn` 字段）；
- 筛选器只保留 domain 一个维度 + 一个即时过滤输入框（复用现有 `searchLessons`）；
- Hover 行 → 触发 Hover Explain 浮层（§8.2）。

### 6.3 TOPIC 详情（保留现有骨架 + 2 个新增段）

沿用现有 12 段结构（一句话理解 → 用户原声 → 定义 → 职责 → Interactive Lab → Runbook → 误区 → 清单 → Quick Check → 关联），**新增**：

```text
05.5  我为什么会查这个？     ← whyLookup 字段（2–4 句，第一人称）
07.5  我在哪真正用过它？     ← usedIn[] 渲染为 work/toolbox 链接行
```

这两段用「纸深底 + 左 2px 朱红线」的引用块形态，与专业定义段形成视觉区隔 —— 这是去掉"AI 百科感"的关键。

### 6.4 NOTES 索引（时间轴清单，不卡片化）

```text
NOTES
一些真正想明白之后留下来的东西。

2026 ──────────────────────────────────────────────
SEP 02   为什么规则明确的 AI Evaluation 不应该完全交给 LLM？
         我现在倾向于认为：规则能覆盖的判断，交给模型反而是引入噪声。
         AI EVALUATION · 6 MIN                              →

AUG 31   Web App Manifest 到底是不是一个 App？
         WEB · 5 MIN                                        →

AUG 29   MCP 和 REST API 最大区别是什么？
         AGENT · 7 MIN                                      →

2025 ──────────────────────────────────────────────
（按年分组，同年内倒序）
```

规格：年份用等宽大写 + 细线；每条 = 日期（mono）+ 标题（衬线）+ 一句话结论（可选）+ 域标签与时长（mono）+ 箭头；无卡片边框，hover 仅标题变色。

### 6.5 NOTE 详情

```text
NOTE 023 · AI EVALUATION · 2026.09.02 · 6 MIN

为什么规则明确的 AI Evaluation 不应该完全交给 LLM？

一句话结论：规则能覆盖的判断交给模型，是用不确定性替代确定性。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━（细线+◆）
01 为什么我会想到这个问题    （2–4 段内文）
02 我现在的理解             （内文，可含 1 张示意）
03 一个真实例子             （内文或小代码块）
04 我现在的判断             （引用块形态）
05 我还没想清楚什么          （开放段——必须有，允许写"没想清楚"本身）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RELATED TOPICS   LLM Judge · Precision · Ground Truth
RELATED READING  LLM-as-a-Judge
USED IN WORK     七维能力自动评测系统
```

### 6.6 READING 索引

```text
READING
读过的论文和值得留下的文章。

[ 全部 ] [ PAPER ] [ ARTICLE ] [ REPORT ] [ BOOK ]

PAPER   2022   ReAct: Synergizing Reasoning and Acting
               我记住的三件事：推理与行动交替 / 思考轨迹可观察 / 失败可归因
               AGENT · 已写笔记 →

PAPER   2017   Attention Is All You Need
               PRODUCT · 未写笔记
```

规格：类型 + 年份 + 标题 + 一行"我记住的" + 状态标记（已写笔记/未写）；不显示摘要全文。

### 6.7 READING 详情（论文拆解模板）

```text
PAPER · 2022 · YAO ET AL.

ReAct: Synergizing Reasoning and Acting

为什么我读它 ─────────────────────────
（2–3 句，第一人称动机）

我只记住三件事 ───────────────────────
01 ……
02 ……
03 ……

它怎么工作 / 为什么重要 / 对 AI 产品的启发
（三段内文，每段 ≤5 句）

RELATED   Agent · Tool Calling · Chain of Thought
[论文原文 →]（外链）   [相关笔记 →]（如有）
```

### 6.8 WORK 索引

```text
WORK
我真正动手做过或验证过的东西。

[ 全部 ] [ PROJECT ] [ PROTOTYPE ] [ EXPERIMENT ]

01 / PROJECT ─────────────────────────────（重点项：大版面卡）
   七维能力自动评测系统
   怎么降低人工评测成本，同时保持业务规则与
   模型语义判断的一致性？
   ─────────────────────
   Rule Engine → Structured Result → LLM Judge → Evaluation
   我的角色：Evaluation Design / Prompt / Workflow
   [查看完整项目 →]

02 / PROJECT ─────────────────────────────
   Personal Knowledge Lab —— 用 AI 协助建立自己的知识实践库
   [查看 →]

03 / EXPERIMENT ──────────────────────────（小条目行）
   Few-Shot 数量对 LLM Judge 评分方差的影响 —— 方差 ↓38%
04 / EXPERIMENT ──────────────────────────
   Prompt 约束对 JSON Schema 遵循率的影响 —— 87% → 99%
```

规格：重点 Project 独占大卡（最多 2 个），其余一律压缩为行条目；行条目带结果数字（experiment 必须有可量化结果）。

### 6.9 WORK 详情（Problem-first Case Study 模板）

```text
PROJECT · AI EVALUATION · 2026.03 – 至今

七维能力自动评测系统

一句话：通过业务规则和 LLM Judge 分层，建立自动化能力评测流程。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
01 问题          为什么要做？（3–5 句 + 触发场景）
02 我怎么拆       架构图（文本流程图或 SVG）+ 各层职责
03 最关键的决定   为什么 rating 不交给 LLM？（决策 + 理由 + 放弃的方案）
04 实际遇到的问题  Recall Fail / Schema Fail / Hallucination（问题→对策表）
05 最终方案       落地架构与工作流
06 我学到了什么   提炼成 2–3 条可迁移认识
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RELATED TOPICS   LLM Judge · Precision · Recall
RELATED NOTES    为什么规则明确的评测不该完全交给 LLM？
USED TOOLS       AI Evaluation Checklist
```

### 6.10 TOOLBOX 索引（按问题分组）

```text
TOOLBOX
我实际用过，而且还会再次使用的方法。

AI EVALUATION ─────────────────────────────
怎么快速检查一个 AI 功能是否真的可以上线？
AI Evaluation Checklist        CHECKLIST · V1.2          [打开]

PROMPTING ─────────────────────────────────
模型输出突然变差时，从哪里开始排查？
Prompt Debug Flow              WORKFLOW                  [打开]

研究一个陌生 GitHub 项目从哪里下手？
GitHub Project Analysis        PROMPT                    [复制]
```

规格：分组按问题域而非技术类型；每行 = 问题标题（衬线）+ 工具名 + 类型与版本（mono）+ 动作；详情页含 `解决什么/什么时候用/输入/步骤/Checklist/Prompt（可复制）/示例/局限` 八段，Checklist 在页内可勾选并持久化。

### 6.11 LIBRARY（单页紧凑清单）

```text
LIBRARY
我觉得值得留下的资料。

WEBSITE ──────────────────────────────────
VibeHub          用真实问题解释技术概念
                 留下理由：术语→场景→Demo 的内容组织方式值得借鉴。

ARTICLE ──────────────────────────────────
……               （同构：一句话 + 留下理由）

GITHUB / TOOL ────────────────────────────
……
```

规格：与 Jarod 的 tools 列表同构 —— 名称 + 一句话 + 留下理由；**强制 `whySaved` 字段**，缺失就不允许发布（由测试保证）。

### 6.12 辅助页

- **PRACTICE**：沿用现有刷题流，视觉按 §5.2 降噪；战绩改为页首一行小字。
- **SAVED**：按 `TOPICS / NOTES / READING / TOOLS` 四组分栏计数 + 行清单；沿用现有收藏 store，扩展实体类型。
- **ABOUT**：单屏：现在关注什么（4 个标签）/ 这个 Lab 记录什么（5 行）/ 链接（GitHub · Resume · Email）。
- **搜索浮层**：结果按 `TOPICS / NOTES / READING / WORK / TOOLBOX / LIBRARY` 分组，每组 ≤3 条，域色 eyebrow。

---

## 七、数据模型与内容规范

### 7.1 实体 Schema（`js/content/` 下按文件拆分）

```javascript
// site.js
export const site = {
  name: 'AI Knowledge Lab',
  tagline: 'AI · Product · Building',
  about: { focus: [], labRecords: [], links: [] },
  terminal: { whoami: [], currently: [], building: [] }
};

// topics.js（合并 data.js + expanded-data.js，60+ 条）
Topic {
  id, title, english, aliases[], domain,        // domain: ai|product|agent|engineering
  level, duration,
  entryQuestion,          // ← 新增：从问题开始的那句话
  userSays, definition, why, points[], boundary,
  whyLookup,              // ← 新增：我为什么会查这个
  usedIn: [{ type: 'work'|'toolbox'|'note', id, note }],  // ← 新增
  scenario, pitfalls[], checklist[], question, agentPrompt,
  references[], related[] // related 支持 topic/note/reading/work/toolbox 混合
}

// notes.js
Note { id, title, date, domain, minutes, oneLiner,
  origin,        // 01 为什么想到
  understanding, // 02 我现在的理解
  example,       // 03 真实例子
  take,          // 04 我现在的判断
  unresolved,    // 05 我还没想清楚什么 ← 必填
  related[] }

// reading.js
Reading { id, kind,            // paper|article|report|book
  title, authors, year, sourceUrl, domain, minutes,
  whyRead,                      // 为什么我读 ← 必填
  memorized: [3 items],         // 我只记住三件事
  howItWorks, whyItMatters, productView,
  noteId,                       // 关联笔记
  related[] }

// work.js
WorkItem { id, kind,           // project|prototype|experiment
  title, status, domain, period, featured,   // featured → 首页/索引大卡
  oneLiner, problem,            // ← Problem-first 必填
  solution, keyDecisions[], challenges[], result,  // experiment: setup/result(量化)/insight
  learned, role, links[],
  related[] }

// toolbox.js
Tool { id, category, solves,   // solves = 它解决什么问题 ← 作为行标题
  title, type,                 // prompt|workflow|checklist|template|cheatsheet
  version, whenToUse, inputs, steps[], checklist[],
  promptTemplate, example, limitations, related[] }

// library.js
LibraryItem { id, type,        // article|website|github|tool|course|newsletter
  title, url, oneLiner,
  whySaved }                    // ← 必填，测试校验
```

### 7.2 Related 网络约定（Related Trail 的数据基础）

- `related[]` 统一为 `{ type, id, relation }`，`relation ∈ prerequisite|deepens|applied-in|distilled-into`；
- 前端渲染 Related Trail 时按 relation 排序成路径：`prerequisite → deepens → applied-in → distilled-into`；
- 数据测试新增校验：所有 related 引用的 id 必须存在（防止死链），且 relation 枚举合法。

### 7.3 发布门槛（写入 CONTRIBUTING 区段 + 测试）

| 类型 | 发布门槛（测试强校验） |
| :--- | :--- |
| Topic | whyLookup 非空；usedIn 或 related 至少 1 条 |
| Note | unresolved 非空（允许写"还没想清楚 X"） |
| Reading | whyRead 非空；memorized 恰好 3 条 |
| Work | problem 非空；experiment.result 必须含数字 |
| Tool | solves 非空；promptTemplate 或 checklist 至少其一 |
| Library | whySaved 非空 |

### 7.4 文件迁移映射

```text
js/data.js + js/expanded-data.js  →  js/content/topics.js（含 domain 映射：前端航线→engineering 等）
js/lab-data.js                    →  js/content/{site,notes,reading,work,toolbox,library}.js
js/projects-data.js               →  删除（initialResearch/initialPlaybooks 中的有效内容并入 work/toolbox）
js/compiler.js                    →  保留，import 路径更新
styles.css                        →  styles/{tokens,base}.css + styles/components/*.css（按页面拆）
js/app.js                         →  js/router.js + js/views/{home,topics,notes,reading,work,toolbox,library,practice,saved,about}.js
```

---

## 八、交互系统规格（仅保留 6 个）

### 8.1 Global Search `/`（升级现有实现）

- 快捷键：非输入态按 `/` 或 `Cmd/Ctrl+K` 呼出；
- 数据源：全实体（注入 topics/notes/reading/work/toolbox/library）；
- 结果分组显示，每组头部 = 域色 eyebrow，每组 ≤3 条 + 「全部 n 条 →」；
- 键盘：↑↓ 切换，Enter 跳转，Esc 关闭（现有行为保留）。

### 8.2 Hover Explain（新增，仅 TOPICS 行）

- 触发：topics 索引行 hover ≥150ms；
- 浮层内容：一句话定义 + `用过：{work 名}` + `相关：2 个术语`；
- 定位：行右侧弹卡，宽 320px，纸光底 + 细边框；
- 移动端禁用（改为行内展开第二行）。

### 8.3 Related Trail（新增，详情页底部）

```text
这条知识的路径 ─────────────────────
LLM Judge（topic）
  ↓ deepens
为什么规则明确的评测不该完全交给 LLM（note）
  ↓ applied-in
七维能力自动评测系统（work）
  ↓ distilled-into
AI Evaluation Checklist（toolbox）
```

- 形态：垂直路径 + 箭头 + 关系词（mono 小字）；
- 每个节点可点击跳转，当前页节点高亮不可点；
- 无路径数据时整块不渲染。

### 8.4 Page TOC（长文页）

- 触发条件：详情页正文 > 6 个章节；
- 桌面：右侧 sticky 200px，滚动高亮当前节（现有 IntersectionObserver 逻辑迁移复用）；
- 移动端：文章顶部折叠为一行「目录 ▾」。

### 8.5 Filter（只做三个维度）

- Domain（topics/notes/work 共用枚举 ai|product|agent|engineering）；
- Type（reading: paper|article|report|book；work: project|prototype|experiment）；
- 即时文本过滤（索引页一个输入框，300ms debounce）；
- 禁止再增加第三种筛选维度。

### 8.6 Save（全类型统一收藏）

- 每个详情页标题行一个 `◇/◆` 切换（复用现有 favorite store 与 toast）；
- SAVED 页按类型分四组显示计数与清单；
- 收藏数据迁移：旧 `favorites[]`（topic id）自动标记 `type: 'topic'`。

### 8.7 Interactive Lab / Quick Check（保留降噪）

- Lab 保留三模式切换与步骤控制，但外壳从"仪表框"改为"纸面区块 + 细线"；
- Quick Check 去掉 PASSED/FAILED 色块，改为墨绿 ✓ / 朱红 × 内联标记；
- 自动演示计时器、键盘可访问性（现有）不变。

---

## 九、响应式与栅格

| 断点 | 布局 |
| :--- | :--- |
| ≥1280px | Sidebar 232px + Main 1040px；详情页 Article 720 + TOC 200 |
| 1024–1279px | Sidebar 232px + Main 自适应（padding 32px）；TOC 收进文章顶折叠 |
| 768–1023px | Sidebar → 吸顶 Header 56px + 汉堡抽屉；Main 100% |
| <768px | 同上；正文 padding 16px；字号阶梯整体 -1 档；首页 SplitPair 全部改单列堆叠 |

移动端不做底部 Tab 栏（本站是阅读型，不是工具型）—— 抽屉导航承担全部跳转。

---

## 十、实施路线图（Phase 0–4）

> 每个 Phase 结束时：`npm run check && npm test` 全绿 + 手工过一遍该 Phase 验收清单，独立 commit。

### Phase 0 —— 基线与设计 Token（0.5 天）✅
- [x] 新建分支 `feature/v4-editorial-lab`，提交 V3 检查点 `d662127`；
- [x] 写入本蓝图、部署指南与文件架构文档（`2026-09-02-v4-file-architecture.md`）；
- [x] 建 `styles/tokens.css`（§5.1 全部变量 + 域色/字号阶梯/间距/布局尺度/动效/z-index 层级表）+ `styles/base.css`（12 组 c-*/u-* 原语 + 全站 prefers-reduced-motion 兜底）；
- [x] `index.html` 加载顺序：legacy styles.css → tokens → base（过渡期共存，token 层拥有变量最终决定权）；
- [x] 目录骨架：`assets/ js/{content,views,components,lib,store} styles/{components,views} tests/{content,lib,store} scripts/ docs/guides/`；
- 验收结果：新旧类名零碰撞；token 值与 legacy 1:1 对齐 = 零视觉突变；后续换肤只改 tokens.css。

### Phase 1 —— 首页去仪表盘化（1 天）✅
- [x] `views/home.js` 重写（app.js 1819 → 1686 行，首页委托给视图模块）：Hero（人话 + 2 CTA）+ MiniTerminal（whoami/currently/building）+ NOW 卡；
- [x] 移除 System Monitor 大数字、CAPABILITY INDEX、`LOCAL RUNTIME ONLINE` 状态灯、✦ focus 芯片与航线卡百分比；
- [x] 「从问题开始」（6 个词条注入 `entryQuestion`）与「我做过 / 验证过的东西」（PROJECT → PROTOTYPE → EXPERIMENT 排序行式清单）上线；
- [x] 侧栏导航重排 §4.1：7 主导航（中文为主）+ PERSONAL TOOLS 辅助区（含 About）；覆盖率降级为侧栏底部一行小字；路由 alias `#/reading → papers 视图`、`#/library → 资源库索引` 同步启用；
- [x] `js/content/site.js`（Hero/Terminal/Now/页脚文案）+ `styles/views/home.css`（900px 双栏堆叠）；
- 验收结果：视图空跑断言 0 仪表盘残留、11 个区块齐全；`npm run check && npm test` 14/14 全绿；服务器产物验证通过。

### Phase 2 —— 三大核心模板（2 天）
- [ ] 数据迁移：`content/topics.js`（含 domain 重映射 + entryQuestion/whyLookup/usedIn 字段，先给 10 个高频词条补个人痕迹字段，其余允许空由测试标记 warning）；
- [ ] `views/topics.js`：域分组行式索引 + Hover Explain；Topic 详情插入 §6.3 两个新段；
- [ ] `views/notes.js`：时间轴索引 + 新详情模板（unresolved 段必填）；
- [ ] `views/work.js`：Problem-first 索引（重点卡 + 行条目）+ Case Study 详情模板；
- [ ] 路由 alias：`#/papers→#/reading`、`#/projects→#/work`、旧 lesson id → 新 topic id；
- [ ] 测试：schema 校验（§7.3 发布门槛）+ related 死链检查 + 路由 alias 快照；
- 验收：Topics/Notes/Work 三页在双主题、三断点下逐页人工过检。

### Phase 3 —— Reading / Toolbox / Library（1 天）
- [ ] `views/reading.js`：四类型筛选索引 + 论文拆解详情（memorized=3 强校验）；
- [ ] `views/toolbox.js`：按问题分组索引 + 八段详情（页内可勾选 checklist 持久化 + 复制 Prompt）；
- [ ] `views/library.js`：单页清单（whySaved 必填）；
- [ ] 删除 `projects-data.js` 与全部死代码；
- 验收：六个内容模块的索引/详情形态一致性走查（同一清单行组件复用）。

### Phase 4 —— 跨内容体验与收尾（1 天）
- [ ] 搜索升级为分组式全实体结果（§8.1）；
- [ ] Related Trail 组件 + 三个详情页接入；
- [ ] SAVED 按类型分组；ABOUT 精简版上线；
- [ ] 性能与 SEO：`<title>/description/OG` 按路由更新、favicon、`prefers-reduced-motion` 全覆盖、Lighthouse ≥ 95；
- [ ] 全站文案走查（去掉残留的"航线/控制台/模块"等课程话术 → 统一为 Lab 话术）；
- 验收：`npm test` 全绿（预计 ≥30 用例）；移动端 375px 全页走查无横向滚动。

### 工作量合计：约 5.5 个工作日（可按 Phase 独立交付与回滚）。

---

## 十一、部署与上线

详见 [2026-09-02-v4-deploy-guide.md](./2026-09-02-v4-deploy-guide.md)，要点：

- 产物为纯静态文件（index.html + js + styles），无构建步骤、无运行时依赖；
- 目标方案 A：自有服务器 + Nginx（含 gzip、静态缓存、SPA fallback 配置全文）；
- 备选方案 B：GitHub Pages / Cloudflare Pages，push 即发布；
- 上线前 checklist：HTTPS、404 fallback、OG 图、统计（可选 Plausible）。

---

## 十二、不做清单 / 风险与对策

### 12.1 继续不做

社区/评论/点赞/排行榜/积分、用户发布、复杂 CMS、实时协作、通用 AI Chat、全文检索引擎（Meilisearch 等）、数据库（localStorage 足够）、前端框架重写（原生 ES Modules 保留）。

### 12.2 风险与对策

| 风险 | 影响 | 对策 |
| :--- | :--- | :--- |
| 个人痕迹字段（whyLookup 等）内容供给不足，新增段落变空壳 | 又变成"AI 百科" | 测试强校验 + 先补 10 个高频词条打样；允许后续按访问频率补写 |
| 数据拆分迁移引入回归 | 页面白屏/死链 | 迁移在独立 commit 完成；alias 表 + related 死链测试兜底；`#/lesson/:id` 旧链接保持可用 |
| styles.css 拆分期间新旧样式冲突 | 视觉混乱 | tokens 先行、旧文件暂时共存；每个组件迁移后立即删除旧对应段落，PR 粒度小 |
| "个人项目数量少"导致 WORK 单薄 | 能力证明不足 | Work 索引允许 Experiment 小条目补位（本蓝图 §6.8）；首页区块可独立隐藏 |
| 双主题色彩对比度不达标 | 可访问性 | tokens.css 定稿时跑一遍对比度脚本，AA 为底线 |
