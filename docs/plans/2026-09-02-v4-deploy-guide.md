# V4 部署与上线指南

> 配套蓝图：[2026-09-02-v4-editorial-lab-blueprint.md](./2026-09-02-v4-editorial-lab-blueprint.md)
> 适用版本：`feature/v4-editorial-lab` 分支（纯静态站点，无构建步骤、无运行时依赖）

---

## 1. 产物说明

整站就是仓库根目录的静态文件：

```text
index.html          入口（唯一 HTML）
js/                 ES Modules（含 content/ 数据）
styles/             CSS（tokens / base / components）
assets/             favicon、OG 图、字体（如有）
dev-server.mjs      仅本地开发用，不部署
tests/              仅开发用，不部署
```

本地验证部署产物：

```bash
npm run dev          # http://localhost:4173
npm run check && npm test
```

---

## 2. 方案 A：自有服务器 + Nginx（推荐，配独立域名）

### 2.1 服务器准备

- 一台任意云主机（1C1G 足够，纯静态）；域名一条 A 记录指向服务器 IP；
- 安装 Nginx 与 certbot（HTTPS）。

### 2.2 目录约定

```bash
sudo mkdir -p /var/www/knowledge-lab
# 部署 = 把仓库文件同步进去（排除开发文件）
rsync -av --delete \
  --exclude '.git' --exclude 'tests' --exclude 'node_modules' \
  --exclude 'dev-server.mjs' --exclude '.worktrees' --exclude 'docs' \
  ./ user@server:/var/www/knowledge-lab/
```

### 2.3 Nginx 配置（可直接使用）

```nginx
# /etc/nginx/sites-available/knowledge-lab
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    root /var/www/knowledge-lab;
    index index.html;

    # gzip
    gzip on;
    gzip_comp_level 6;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # 静态资源长缓存（文件名不变，缓存窗口保守设 7 天，后续可加指纹）
    location ~* \.(css|js|woff2|png|svg)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # HTML 不缓存，保证更新即达
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # SPA fallback：所有未知路径回首页（hash 路由其实只用 /，这是保险）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    error_page 404 /index.html;
}
```

启用并签发证书：

```bash
sudo ln -s /etc/nginx/sites-available/knowledge-lab /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

### 2.4 更新流程

```bash
git push origin feature/v4-editorial-lab
# 服务器上：
cd /var/www && git clone <repo> knowledge-lab-src   # 首次
cd knowledge-lab-src && git pull
rsync -av --delete --exclude '.git' --exclude 'tests' --exclude 'docs' \
  knowledge-lab-src/ /var/www/knowledge-lab/
```

---

## 3. 方案 B：GitHub Pages（最快上线，5 分钟）

1. 仓库 Settings → Pages → Source 选 `feature/v4-editorial-lab` 分支 `/ (root)`；
2. 因为是 hash 路由（`#/...`），**无需任何 404 处理**，直接可用；
3. 访问地址：`https://<username>.github.io/vibe-hub/`；
4. 若绑定自定义域名：仓库根添加 `CNAME` 文件 + DNS CNAME 记录。

## 4. 方案 C：Cloudflare Pages（免费 CDN + 自动 HTTPS）

1. Cloudflare Dashboard → Pages → Connect to Git → 选仓库与分支；
2. 构建命令留空，输出目录 `/`（根目录）；
3. 每次 push 自动部署，全球 CDN，自带 `_headers` 支持可配置缓存。

---

## 5. 上线前 Checklist

| 项 | 说明 | 状态 |
| :--- | :--- | :--- |
| SEO 基础 | `index.html` 的 `<title>` / `meta description` / `<html lang="zh-CN">` | Phase 4 处理 |
| OG 分享卡 | `og:title / og:description / og:image`（1200×630 一张即可） | 待办 |
| Favicon | 32/180 两尺寸 + `apple-touch-icon` | 待办 |
| 404 | hash 路由天然免疫；Nginx 已配 fallback | 配置已给 |
| HTTPS | certbot（方案 A）/ 平台自带（B/C） | 按方案 |
| 可访问性 | 双主题对比度 AA、`prefers-reduced-motion`、键盘可达 | Phase 4 验收 |
| 性能 | Lighthouse Performance ≥ 95（全站 < 300KB gzip） | Phase 4 验收 |
| 统计（可选） | Plausible / Umami 一行 script，不用 GA | 可选 |
| 备份 | GitHub 仓库即备份；服务器数据无状态 | 天然满足 |

---

## 6. 域名与品牌建议（可选执行）

- 站名固定为 **AI Knowledge Lab**（蓝图 §7.1 `site.name`），域名可考虑 `yourname.dev` / `yourname.ai`；
- 页脚固定四链接：About · GitHub · Resume · Email（Resume 指向 PDF 静态文件放入 `assets/`）；
- 上线后把 V4 分支合入 `main`，此后 `main` 即生产分支，功能开发走 `feature/*` 分支。
