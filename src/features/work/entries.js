export const workEntries = [
  {
    id: "learning-site",
    title: "想与做 · 个人学习网站",
    kind: "PROJECT",
    kindLabel: "进行中的项目",
    statusLabel: "持续建设",
    domain: "AI 与个人学习",
    time: "2026.09 — 至今",
    date: "2026-09-10",
    publication: "published",
    summary: "把知识、学习笔记和小工具整理到一个能够持续维护的个人网站里。",
    problem:
      "学习材料散落在不同地方，新增内容时又容易被页面设计和前端调整打断。",
    solution:
      "保留个人首页，以学习总览连接知识与笔记，通过独立的项目和工具页面记录实践与复用方式。",
    keyDecisions: [
      "首页保持个人表达，学习内容有清晰入口。",
      "同一内容只维护一份，专题与首页通过关联引用。",
      "按内容类型展示必要部分，允许记录尚在进行的尝试。",
    ],
    validation: [
      "检查导航、筛选、搜索与内容链接。",
      "用短笔记、插件和检查清单验证不同模板。",
      "在桌面和手机宽度下检查可读性与操作。",
    ],
    result:
      "首页与基础导航已经建立；本轮继续完善学习入口、详情模板和内容维护方式。",
    relatedTopics: ["component-thinking", "state-management", "git-workflow"],
    relatedNotes: ["why-record-learning", "content-before-expansion"],
    relatedTools: ["content-publish-checklist"],
  },
];
