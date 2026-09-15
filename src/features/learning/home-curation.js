// Homepage editorial previews. Unwritten items stay local previews, not published entries.
export const knowledgeSelection = [
 {id:'rag', title:'RAG 是什么？', category:'AI', meta:'AI · 知识', summary:'为什么模型需要外部知识检索？', icon:'file',tone:'green'},
 {id:'mvp', title:'MVP 是什么？', category:'产品', meta:'Product · 知识', summary:'最小可行产品到底“最小”什么？',icon:'cube'},
 {id:'user-flow', title:'User Flow 是什么？', category:'产品', meta:'Product · 知识', summary:'它和 IA、Sitemap 有什么区别？',icon:'tree'},
 {id:'api', title:'API 是什么？', category:'开发', meta:'Development · 知识', summary:'前后端如何真正连接起来？',icon:'code',tone:'green'}
];
export const seriesSelection = [
 {title:'从 0 到 1 做一个产品',category:'产品',meta:'Product · 系列规划',summary:'从想法到落地，记录完整的产品实践过程。',icon:'book'},
 {title:'从 Prompt 到 Agent Workflow',category:'AI',meta:'AI · 系列规划',summary:'从基础概念到实际搭建，梳理 AI Agent 的学习路径。',icon:'layers'}
];
export const thinkingSelection = [
 {title:'为什么我不再把开发全部交给 AI',category:'方法',summary:'从最初直接让 AI 生成产品，到先明确问题、结构和验证方式。这篇文章计划记录我在建站过程中，对 AI 协作方式的理解变化。',icon:'file'},
 {title:'VibeHub 的知识结构，有哪些值得借鉴？',category:'拆解',meta:'产品拆解',summary:'整理对内容分类、知识关联和阅读路径的观察。',icon:'file'},
 {title:'从 Prompt 到 Workflow，我的理解发生了什么变化？',category:'观点',meta:'方法思考',summary:'记录从单次提问到连续工作流程的理解变化。',icon:'bulb',tone:'green'},
 {title:'一个首页为什么不能有太多按钮？',category:'观点',meta:'产品思考',summary:'结合这个网站的首页调整，整理行动入口与信息层级的取舍。',icon:'file',tone:'purple'},
 {title:'做项目时，我越来越重视复盘这一步',category:'笔记',meta:'复盘',summary:'把尝试和结果留作下一次判断的依据。',icon:'refresh',tone:'green'}
];
export const resourceSelection = [
 {title:'Project Brief Prompt',category:'Prompt',meta:'Prompt',summary:'把模糊想法快速整理成 Brief。',icon:'file',body:'请根据我的产品想法，整理：目标用户、具体问题、核心价值、最小范围、非目标、待验证假设。缺少信息时先列出问题，不要编造用户研究或结果。'},
 {title:'MVP Scope Canvas',category:'工具',meta:'模板',summary:'帮助判断 P0 / P1 / P2。',icon:'grid',tone:'green',body:'核心假设：\n目标用户与场景：\nP0（验证假设必须有）：\nP1（验证后再完善）：\nP2（暂缓）：\n验证方式与通过标准：'},
 {title:'Claude Code Skill',category:'Skill',meta:'Skill',summary:'辅助代码组织和开发流程。',icon:'code',tone:'purple',body:'待选定具体 Skill 后补充来源、适用场景、使用方法与限制。',planned:true},
 {title:'VibeHub',category:'网站',meta:'Website',summary:'一个值得参考的知识结构网站。',icon:'link',body:'设计参考中提到的知识网站。具体链接待补充，避免与本项目或 MDN 混淆。',planned:true},
 {title:'Project Retro Template',category:'工具',meta:'模板',summary:'项目结束后快速复盘。',icon:'file',tone:'gold',body:'原目标：\n实际完成：\n关键决策及原因：\n观察到的结果：\n未验证的判断：\n下一次保留、改变与停止的事情：'},
 {title:'常用 AI 工具清单',category:'工具',meta:'Tools',summary:'记录日常工作中会反复使用的工具。',icon:'cube',tone:'green',body:'工具名称 / 使用场景 / 来源链接 / 使用限制 / 最近验证时间。\n\n当前已有工具：DeepSeek Harness Sync。更多工具随实际使用补充。'}
];
