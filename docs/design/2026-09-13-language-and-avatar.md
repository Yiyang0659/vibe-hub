# 统一头像与全站中英文切换

## 本次交付

- 全站导航头像使用首页的 `assets/hero/person-hero.png`，移除知识、思考、资源、关于页的符号替换规则。
- 移除个人工作台按钮、页面渲染器、页面样式与路由注册。旧 `#/workspace` 显示不存在页面；共享的数据与编译逻辑保留，避免破坏学习记录功能。
- 原按钮位置改成 `EN / 中`：按钮显示目标语言，中文点击 EN 切换英文，英文点击中恢复中文。
- 语言偏好保存在当前浏览器 `site-language`，刷新、切换栏目或主题后继续保留。切换语言不更改当前路径、滚动位置和表单内容。
- 首页、栏目、文章、术语与实践章节、项目详情、资源正文加入英文文本包。代码、截图及用户输入保留原始内容。
- 知识、思考、资源和全局搜索同时索引中英文文本，筛选与内容 ID 继续使用稳定原始值。

## 翻译来源与质量边界

`src/shared/content/english.js` 包含约 3,700 段本地生成的机器译文。使用 Argos Translate 的中英模型，在本机生成后作为静态文本发布；访问者不需要安装模型，浏览时不发送正文至翻译服务。

`src/app/language.js` 保存人工校正的导航、栏目介绍、三篇当前笔记及部分项目与术语译文，并优先于机器译文。正文已具备英文覆盖，但所有机器译文尚未逐句人工校对；新增重要文章或项目应继续校正措辞。

参考：[Argos Translate 官方使用说明](https://argos-translate.readthedocs.io/en/latest/source/examples.html)。按钮视觉调研参考 [Lucide 的轻量线性图标风格](https://lucide.dev/)，最终采用更直接的 EN / 中文字标识，沿用导航按钮尺寸。

## 后续内容维护

中文仍是原始内容。新增条目时同步补齐英文；测试会检查内置正文的译文覆盖。生成工具位于 `scripts/i18n/`，Python 环境需要 `argostranslate` 和 zh → en 模型（本次使用版本 1.11.0）。

```sh
node scripts/i18n/collect-content.mjs /tmp/vibe-source.json
node scripts/i18n/render-content.mjs /tmp/vibe-pages.html
python scripts/i18n/merge-corpus.py /tmp/vibe-source.json /tmp/vibe-corpus.json /tmp/vibe-pages.html index.html
python scripts/i18n/translate-offline.py /tmp/vibe-corpus.json /tmp/vibe-english.json
node scripts/i18n/package-english.mjs /tmp/vibe-english.json
npm test
```

生成器保留目标 JSON 中已有翻译，只补充新文本。发布前检查术语与项目名称，必要时在人工校正词典中覆盖。字典修改不需要改页面模板。

## 验证结果

- `npm run check`：92 个源文件语法检查通过。
- `npm test`：107 项通过，含内置正文英文覆盖、英文搜索、工作台路由移除和头像样式回归检查。
- 浏览器逐栏确认六个入口均显示同一头像；工作台旧地址返回 404。
- 1082px 桌面和 390px 手机预览通过，英文无横向溢出。
- 验证语言往返、刷新持久化、与日夜主题独立切换，以及英文搜索后切回中文仍保留同一结果。
- 本次未提交、推送或合并主分支。
