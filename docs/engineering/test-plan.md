# 测试计划

## 自动化测试

```bash
npm run check
npm test
```

没有可用 npm 时，可使用同一 Node.js 运行：

```bash
node scripts/check-js.mjs
node --test
```

## 测试分层

- `tests/features/`：栏目数据和栏目专属逻辑。
- `tests/shared/`：搜索、进度、状态和其他公共能力。
- `tests/content/`：跨栏目 schema、稳定 ID 与关联死链。
- `tests/integration/`：架构契约、路由兼容和快速记录工作流。

## 发布前回归

1. 所有 JavaScript 语法检查通过。
2. 自动化测试 0 失败。
3. 首页、项目、文章、工具、术语详情、工作台、已保存和关于页面可以打开。
4. 全局搜索、主题切换、收藏、术语状态和个人笔记可以使用。
5. 刷新后 localStorage 数据仍然存在。
6. 桌面和移动宽度下导航可用，无明显横向溢出。
