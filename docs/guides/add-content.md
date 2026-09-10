# 新增内容指南

更新：2026-09-10。网站使用固定模板读取静态内容，普通新增记录不需要修改页面逻辑。

## 内容放在哪里

| 要做什么 | 修改文件 |
| --- | --- |
| 添加知识条目 | `src/features/topics/data.js` 中的 `coreLessons` 数组 |
| 添加笔记或成长记录 | `src/features/notes/entries.js` 的 `noteEntries` 数组 |
| 添加项目或小实验 | `src/features/work/entries.js` 的 `workEntries` 数组 |
| 添加脚本、插件、清单或模板 | `src/features/toolbox/entries.js` 的 `toolEntries` 数组 |
| 给已有内容建立专题 | `src/features/learning/data.js` 的 `collections` 数组 |
| 修改个人介绍 | `src/features/about/data.js` |

notes、work、toolbox 的 `data.js` 保留历史内容，并与 `entries.js` 中的公开内容汇总。历史内容当前标记为 `review`。确认后，将需要发布的条目移入 `entries.js` 并从历史数组移除原条目，保留原 ID，避免重复。

## 通用规则

- `id` 使用唯一的小写英文与连字符，发布后不要随意改动，否则原链接、关联和收藏会失效。
- `publication: 'published'` 表示公开；`draft` 不进入公开列表、搜索与详情；`review` 保留在历史内容入口，详情与搜索标明待核实。未填此字段时保持旧数据兼容，按公开处理，因此新草稿务必显式填写 `draft`。
- 草稿数据仍随静态 JS 文件发送到浏览器；这是展示状态，不是访问控制。私人信息应保存在站外或浏览器本地笔记中，不放进网站源文件。
- `date` 是首次发布日期，使用 YYYY-MM-DD。修订时填写 `updated`，不要为了置顶修改发布日期。
- `category` 采用已有主题名称，学习列表自动生成主题筛选。没有日期的旧知识条目不伪造日期，排在有发布日期的记录之后。
- 不填的可选部分不会生成空标题。数组不要求固定长度，不强制填写定量成果或“尚未想清楚的问题”。
- 下面都是填写格式示例，不代表已发生的个人经历。复制后换成真实内容。

## 知识条目：解释一个概念

```js
{
  id: 'my-concept',
  title: '概念名称',
  english: 'English name',
  category: '工程实践',
  publication: 'published',
  date: '2026-09-10',
  excerpt: '一句话摘要。',
  definition: '用自己的话解释这个概念。',
  example: '给出一个帮助理解的例子，假设例子需写明。',
  related: []
}
```

可以补充 `why`、`points`、`pitfalls`、`checklist`、`sourceUrl`。`question` 完全可选，提供时包含 `prompt`、`choices`、从 0 开始的 `answer` 和 `explanation`。练习仅选取有题目的条目。普通知识无需制作动画；现有带 `scenario` 的前端示例继续兼容。

知识详情中的“留下自己的理解”只保存在当前浏览器，不等于网站公开笔记。

## 笔记：记录一次理解或尝试

```js
{
  id: 'my-learning-note',
  title: '我遇到了什么问题',
  category: '建站记录',
  date: '2026-09-10',
  publication: 'published',
  oneLiner: '这次记录最重要的一句话。',
  question: '最初想弄清楚的问题。',
  myUnderstanding: '实际查阅、理解或尝试的过程。',
  myTake: '目前的结论，也可以是暂未解决及原因。',
  relatedTopics: ['component-thinking']
}
```

可选：`example`、`unresolved`、`nextSteps`、`sources`（文字来源说明数组）。将 `kind` 设为 `LOG`，同一模板就会作为成长记录呈现。成长记录建议写清原来的理解、触发变化的事情和现在的理解。

`#/learning` 是学习总览；已有 `#/notes` 和 `#/notes/:id` 链接继续有效。

## 工具：插件或脚本

```js
{
  id: 'my-plugin',
  title: '插件名称',
  type: 'PLUGIN',
  typeLabel: '插件',
  category: 'AI 工具',
  date: '2026-09-10',
  publication: 'published',
  problemSolved: '解决什么具体问题。',
  usage: '准备条件和实际使用步骤。',
  url: 'https://example.com/replace-with-real-repository',
  limitations: ['适用环境或当前已知限制。']
}
```

脚本使用 `type: 'SCRIPT'`；可选 `steps: [{title, detail}]`、`requiredInputs`、`example`、`sourceUrl`。已公开可用的插件/脚本需要真实获取入口与用法，不要求 Prompt 或 Checklist。还没有可用入口的探索，先写成项目或笔记。

本站已添加真实条目 `deepseek-harness-sync`，可参考它的填写方式。介绍来自用户指定的 GitHub README；本站未执行该工具的安装或同步测试。

## 工具：清单或提示词

```js
{
  id: 'my-checklist',
  title: '检查清单名称',
  type: 'CHECKLIST',
  category: '内容整理',
  publication: 'published',
  problemSolved: '这份清单帮助检查什么。',
  checklist: ['检查项一', '检查项二']
}
```

提示词或模板使用 `PROMPT` / `TEMPLATE` 类型，以 `promptTemplate` 保存正文，会自动出现复制按钮。清单勾选与重置保存在本地浏览器。

## 项目：记录正在发生的实践

```js
{
  id: 'my-experiment',
  title: '实践名称',
  kind: 'EXPERIMENT',
  statusLabel: '进行中',
  publication: 'published',
  problem: '想验证或解决什么。',
  solution: '实际尝试了什么。',
  result: '目前观察到的现象，不一定包含数字。',
  relatedTopics: ['testing-strategy']
}
```

类型还可使用 `PROJECT`、`PROTOTYPE`。可选 `summary`、`validation`（验证步骤数组）、`whatILearned`、`keyDecisions`、`screenshot`、`repoUrl`、`demoUrl`。进行中可以先填状态，之后补结果。

## 专题：引用已有内容

```js
{
  id: 'my-learning-collection',
  title: '专题名称',
  description: '围绕什么问题组织这些记录。',
  items: [
    { kind: 'CONCEPT', id: 'component-thinking' },
    { kind: 'NOTE', id: 'content-before-expansion' }
  ]
}
```

`kind` 与 ID 必须对应真实内容；成长记录使用 `LOG`。专题只是引用，不复制正文。目前首页使用第一个有内容的专题，后续条目自动进入专题列表。只有当已有内容具备明确学习顺序时，再讨论章节式路线。

关联字段支持 `relatedTopics`、`relatedNotes`、`relatedWork`、`relatedTools`、`relatedPapers`，保存 ID 数组。知识之间使用 `related`。只有真实相关时才添加，不要求每条记录都有完整实践链。

## 保存与验证

```bash
npm run check
npm test
```

刷新本地页面，确认新内容出现在相应列表、筛选和详情中；检查相关链接。首页数量与摘要自动读取公开内容，无需手动编辑统计数字。

原有阅读资料继续维护 `src/features/reading/data.js`，资料架维护 `src/features/library/data.js`；这两个栏目的原有模板与校验规则本轮保持不变。
