# 详情页还原交付 · 2026-09-11

按照本轮 15 张参考图，按项目、知识、思考、关于顺序扩展。保留首页和六项导航的现有样式，沿用 1216px 容器、响应式边距、共享字体和卡片规范。资料中的资源栏目没有独立详情参考，本轮未另行重构。

## 查看入口

| 栏目 | 页面 | 本地地址 |
| --- | --- | --- |
| 项目 | 列表 | http://localhost:4173/#/projects |
| 项目 | AI Learning OS | http://localhost:4173/#/projects/learning-site |
| 项目 | 滑一叠 | http://localhost:4173/#/projects/hua-yi-die |
| 项目 | 内容系统 Agent | http://localhost:4173/#/projects/content-agent |
| 知识 | 栏目首页 | http://localhost:4173/#/learning?kind=CONCEPT |
| 知识 | 全部内容 | http://localhost:4173/#/topics |
| 知识 | MVP 详情 | http://localhost:4173/#/topics/mvp |
| 知识 | 产品系列 | http://localhost:4173/#/topics/series-product |
| 知识 | Agent 系列 | http://localhost:4173/#/topics/series-agent |
| 思考 | 栏目首页 | http://localhost:4173/#/learning?kind=NOTE |
| 思考 | 文章阅读 | http://localhost:4173/#/notes/ai-collaboration |
| 思考 | 产品拆解 | http://localhost:4173/#/notes/vibehub-structure |
| 思考 | 对比分析 | http://localhost:4173/#/notes/website-comparison |
| 关于 | 栏目首页 | http://localhost:4173/#/about |
| 关于 | 关于我 | http://localhost:4173/#/about/me |
| 关于 | 现在在做什么 | http://localhost:4173/#/about/now |

思考列表的其余选题也已连接到独立文章草稿页。

## 布局与交互
- 项目：界面展示 / 小程序展示 / 工作流三种视觉；结构、过程与验证模块；补充记录可展开。
- 知识：搜索、分类、排序和每页 9 条分页；三栏阅读模板保留收藏、已读、本地笔记和自测。原本含交互实验的知识条目继续保留原有实验页面，避免丢失功能。非实验条目使用新阅读模板。
- 系列：按真实已有条目链接章节，缺少内容的章节标为待整理并可展开说明，没有伪造阅读进度。
- 思考：文章、拆解和对比表三种模板，页内目录和相关内容可跳转。文案按设计稿整理为明确标记的草稿，不声称已完成产品调研或发布。
- 关于：新增 About Me 和 Now，入口在关于首页和两页之间互相连接。联系方式仅使用真实 GitHub 和站内链接。

## 资源说明
项目的系统界面和小程序视觉使用本轮用户提供的设计图局部展示，明确标为“界面设计方案”，不是实际产品运行截图。Agent 流程、页面布局、卡片、目录和表格均由 HTML/CSS 实现。

## 验证
75 个源文件语法检查通过；76 项自动测试通过。浏览器核对 1435×983 和 390×844。验证搜索、分页、系列过滤、收藏切换、知识页内目录。移动端对比表局部横向滚动，页面无横向溢出。截图位于 output/playwright/detail-*.png。
