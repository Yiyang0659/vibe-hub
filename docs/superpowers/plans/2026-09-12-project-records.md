# 项目档案与阶段记录实施

依据：用户已确认保留现有视觉的项目总览 + 最近实践记录长页，以及两个本地项目的实际内容。

1. work/entries.js：更新想与做并加入滑一叠的正式开发记录，保持稳定 ID。记录功能、决策、证据边界和阶段日志；不发布私人配置或未经证实的成绩。
2. work/design-projects.js：仅保留内容 Agent 方案，避免滑一叠双份数据。
3. work/journal.js：共享阶段记录摘要与展开渲染；详情 URL 用 record 参数定位，列表状态保留。
4. work/work-page.js、detail.js、runtime.js：保留首屏布局及卡片，移除重复 projectDepth，加入实践列表；详情补充完整数据，复用锚点交互。
5. work/records.css：局部样式、移动端、焦点和锚点偏移。
6. tests/features/project-records.test.js：校验真实/方案区分、记录链接、详情内容转义与无虚构发布声明。
7. npm run check、npm test；浏览器检查项目列表、两详情与记录定位。记录交付文档及填写规范。仅修改 vibe-hub 功能分支，不提交、合并或推送。
