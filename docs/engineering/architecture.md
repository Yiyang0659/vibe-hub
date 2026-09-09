# 代码架构

## 总体结构

```text
index.html
  → src/main.js
    → src/app/
    → src/features/
      → src/shared/
```

项目采用栏目优先的混合架构。`features/` 负责“网站有什么”，`shared/` 负责“多个栏目共同怎么做”，`app/` 负责“如何启动和导航”。

## 栏目目录

```text
src/features/topics/
├── index.js          # 唯一公开入口
├── data.js           # 全部术语数据
├── model.js          # 域映射与关联逻辑
└── topics-page.js    # 术语索引页
```

简单栏目不强制拥有全部文件。没有独立职责的空文件不会被创建。

## 依赖规则

- `main.js` 可以导入 `app/`、各栏目公开入口和 `shared/`。
- `app/` 可以汇总栏目公开入口，但不读取栏目内部文件。
- 栏目可以导入 `shared/`，不能直接导入其他栏目的内部实现。
- `shared/` 不导入具体栏目；搜索等跨栏目逻辑通过参数接收数据。
- 所有 localStorage 访问集中在 `shared/store/index.js`。

## 当前入口

- JavaScript：`src/main.js`
- CSS：`src/styles/index.css`
- 本地状态 key：`pkl-v3-state`
- 路由形式：`#/route/:id`

`src/main.js` 当前仍承担部分旧详情页的组合与事件调度。新增内容已经全部归入栏目数据文件；后续抽取详情页时，应把模板与事件一起移动到对应栏目，并通过上下文接收 store 和跨栏目数据。

## 路由兼容

标准路由由 `src/app/router.js` 解析。以下旧名称继续映射到现有栏目：

```text
topic / lesson        → topics
papers                → reading
projects              → work
playbooks             → toolbox
favorites             → saved
library-resources     → library
```
