# 新增内容指南

所有静态内容按栏目维护。添加内容时保留唯一、稳定、使用小写连字符的 `id`，并运行 `npm test` 检查字段和关联。

## 添加术语

位置：`src/features/topics/data.js`

```js
{
  id: 'context-engineering',
  title: '上下文工程',
  english: 'Context Engineering',
  category: 'AI 协作',
  level: '进阶',
  tags: ['上下文', 'Agent'],
  excerpt: '为模型组织完成任务所需的信息和约束。',
  definition: '这里填写清晰定义。',
  why: '这里解释为什么重要。',
  points: ['关键点一', '关键点二'],
  example: '这里填写真实例子。',
  pitfalls: ['常见误区'],
  checklist: ['可以执行的检查项'],
  related: ['system-prompt'],
  question: {
    prompt: '检查理解的问题',
    choices: ['选项 A', '选项 B', '选项 C'],
    answer: 0,
    explanation: '解释正确答案。'
  }
}
```

## 添加文章

位置：`src/features/notes/data.js`

复制一个现有对象并修改内容。`id`、`title`、`oneLiner`、`question`、`myUnderstanding`、`example`、`myTake` 和 `unresolved` 是当前发布校验关注的字段。关联术语使用 `relatedTopics: ['topic-id']`。

## 添加阅读记录

位置：`src/features/reading/data.js`

论文类内容的 `myTake` 必须恰好包含三条真正需要记住的判断。使用 `relatedTopics`、`relatedNotes` 和 `relatedWork` 保存关联 ID。

## 添加项目或实验

位置：`src/features/work/data.js`

每个项目必须有 `problem`。类型为 `EXPERIMENT` 时，`result` 需要包含可验证的数字结果。想在首页重点展示时沿用现有对象的 featured 配置。

## 添加工具

位置：`src/features/toolbox/data.js`

每个工具必须说明 `problemSolved`，并至少提供 `promptTemplate` 或 `checklist` 中的一种。关联术语写入 `relatedTopics`。

## 添加资料

位置：`src/features/library/data.js`

资料需要写清 `whyRecommend`，说明它为什么值得以后再次打开，而不是只保存标题和链接。

## 添加完成后

```bash
npm run check
npm test
```

如果新增了关联 ID，重点查看 `tests/content/related-links.test.js`；如果新增或修改了必填字段，重点查看 `tests/content/schema.test.js`。
