# 运行与部署

## 本地运行

```bash
npm run dev
```

默认地址是 `http://localhost:4173`。项目没有依赖安装和构建步骤，也可以直接运行：

```bash
node dev-server.mjs
```

不要通过双击 `index.html` 的 `file://` 地址打开，浏览器可能阻止 ES Modules 加载。

## 静态部署

部署时上传仓库根目录中网站需要的文件：

```text
index.html
src/
assets/
```

网站使用 Hash 路由，因此静态托管平台不需要额外配置 SPA 路由回退。服务器应为 `.js` 返回 JavaScript MIME、为 `.css` 返回 CSS MIME，并使用 UTF-8。

更完整的平台示例可参考历史文档 [`../plans/2026-09-02-v4-deploy-guide.md`](../plans/2026-09-02-v4-deploy-guide.md)。
