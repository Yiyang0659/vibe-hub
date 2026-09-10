# 个人学习网站实现计划

目标：保留首页视觉，将文章升级为学习入口，提供可扩展的知识、笔记、实践、插件与清单模板。
架构：沿用静态 ES modules 和栏目目录；学习聚合层只引用既有实体，不复制正文；旧 notes 链接兼容。
技术栈：HTML、CSS、原生 JavaScript、Node test。
执行方式：当前会话内联执行，使用 executing-plans、test-driven-development；隔离目录 vibe-hub-learning。

- [x] 1. tests/features/learning.test.js：先验证查询、类型与主题组合筛选、草稿隔离、专题链接和空态。src/features/learning/model.js、page.js、data.js 实现聚合与渲染；notes/runtime.js 接入查询参数；app/router.js 将 learning 别名映射 notes，shell 和导航保持选中。
- [x] 2. tests/features/content-templates.test.js：验证最小笔记不输出空段、插件无需提示词可展示安全访问链接、进行中实践无需数字；shared/content/validation.js 和 shared/components/content-detail.js 提供校验与正文组件；notes/work/toolbox 的 runtime 使用各自 detail.js 模板，保持清单持久化与复制。
- [x] 3. home/page.js 和 learning/home-sections.js：更新入口、真实统计、主题与最近记录、实践摘要；learning/learning.css 继承当前 tokens，适配窄屏和深色。测试零内容不会生成虚假数量、待核实内容不会进入首页。
- [x] 4. 原有 notes/work/toolbox 条目保留，标记待核实，公开首屏优先使用本次对话和本站可核实材料。增加短笔记、进行中本站项目、可用发布检查清单；插件信息等待用户补充，模板通过测试验证，不虚构用户插件。更新内容指南，提供逐类型可复制样例和发布说明。
- [x] 5. npm test、npm run check、git diff --check；浏览器检查首页、学习筛选搜索、详情、清单、404、手机与深色；修复发现问题。完成后将已验证变更同步当前用户工作目录，保留已有未提交文档。

验证命令：node --test tests/features/learning.test.js tests/features/content-templates.test.js（先观察缺失能力导致失败，再实现至通过）；npm test（完整回归）；npm run check（语法）。
新增内容写入 data.js，publication 可为 published / draft / review；未标记的旧用户本地记录保持兼容。公开内容需通过对应 validateContent 检查。

实施结果：学习页、轻量详情模板、真实统计、待核实内容入口和第一批内容均已实现。用户提供 deepseek-harness-sync 仓库，已作为配置同步脚本收录。内容文件采用 entries.js。自动化 64 项测试通过，67 个源码文件语法检查通过；浏览器复查与当前目录同步见交付记录。
