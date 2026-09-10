export const noteEntries = [
  {
    id: "why-record-learning",
    title: "为什么把学习过程留在这里",
    category: "建站记录",
    date: "2026-09-10",
    publication: "published",
    oneLiner: "从术语、短笔记和小工具开始，让网站跟着真实积累一起成长。",
    question: "项目和成熟文章还不多时，这个网站应该记录什么？",
    myUnderstanding:
      "现阶段可以先留下学习中遇到的概念、自己的总结，以及已经整理的小插件。首页保留个人表达，内容从真实的问题和尝试开始积累。",
    myTake:
      "先让记录、整理和回看变得方便，项目与成体系的文章随着实践逐渐增加。",
    relatedWork: ["learning-site"],
    relatedTopics: ["component-thinking"],
  },
  {
    id: "content-before-expansion",
    title: "先确定记录的形式，再慢慢填充内容",
    category: "建站记录",
    date: "2026-09-10",
    publication: "published",
    oneLiner:
      "给不同内容一个稳定的展示方式，减少每次新增记录时调整页面的成本。",
    question: "新增知识、笔记或工具时，怎样避免反复修改页面布局？",
    myUnderstanding:
      "知识解释一个概念，笔记记录理解过程，项目汇总实践，工具提供复用入口。为每种内容保留必要字段，额外材料按需要出现，列表和首页从同一份内容读取摘要。",
    myTake: "先用少量真实材料验证模板是否好填，再逐步增加记录。",
    relatedTopics: ["component-thinking", "state-management"],
    relatedWork: ["learning-site"],
    relatedTools: ["content-publish-checklist"],
  },
  {
    id: "learning-site-direction",
    kind: "LOG",
    title: "把学习记录放回网站的中心",
    category: "建站记录",
    date: "2026-09-10",
    publication: "published",
    oneLiner: "保留个人首页，也为还在形成的理解留出位置。",
    question:
      "讨论网站内容时，发现现有页面更强调完整项目和成熟文章，而眼下主要在积累术语、总结与小插件。",
    myUnderstanding:
      "网站可以同时呈现个人方向和学习过程。短记录也有独立的价值，不必等内容足够完整才开始整理。",
    myTake: "本轮确定以学习和实践记录为内容主线，保持已有个人网站的视觉方向。",
    relatedNotes: ["why-record-learning", "content-before-expansion"],
  },
];
