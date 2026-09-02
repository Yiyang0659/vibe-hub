/**
 * V4 视图层 · 首页（views/home.js）
 * 编辑部温暖首页：Hero + NOW + 笔记目录 + 非对称作品 + 主题索引 + 工具列表 + 页脚。
 * 不再使用大卡片墙和 Dashboard 统计，强调个人文字与作品感。
 */

import { site } from '../content/site.js';
import { topicsWithDomain } from '../content/topics.js';

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}.${day}`;
}

function readTime(text = '') {
  const mins = Math.max(1, Math.round(text.length / 450));
  return `${mins} min`;
}

/* ========== 1. Hero ========== */
function heroHtml() {
  const h = site.hero;
  return `
    <header class="h-hero">
      <p class="h-hero-kicker">${esc(site.name)} · ${esc(site.tagline)}</p>
      <h1 class="h-hero-title">
        ${esc(h.title)}<br>
        <em>${esc(h.titleAccent)}</em>
      </h1>
      <p class="h-hero-sub">${esc(h.subtitle).replace(/\n/g, '<br>')}</p>
      <div class="h-hero-links">
        ${h.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)} <span aria-hidden="true">→</span></a>`).join('')}
      </div>
    </header>`;
}

/* ========== 2. 轻量统计 + NOW ========== */
function statsNowHtml(counts) {
  const statLine = site.stats.items
    .map((s) => `${counts[s.key] || 0} ${esc(s.label)}`)
    .join(' · ');

  return `
    <section class="h-meta-band">
      <p class="h-statline">${statLine}</p>
      <div class="h-now">
        <span class="h-now-label">${esc(site.now.label)}</span>
        <div class="h-now-chips">
          ${site.now.chips.map((c) => `<span>${esc(c)}</span>`).join('')}
        </div>
      </div>
    </section>`;
}

/* ========== 3. 笔记目录 ========== */
function noteDirectory(notes) {
  if (!notes.length) return '';
  return `
    <section class="h-section">
      <div class="h-section-head">
        <h2>最近写下的</h2>
        <a href="#/notes">全部笔记 <span aria-hidden="true">→</span></a>
      </div>
      <ul class="h-article-list">
        ${notes.slice(0, 5).map((n) => `
          <li>
            <a class="h-article-row" href="#/notes/${esc(n.id)}">
              <time>${formatDate(n.date)}</time>
              <span class="h-article-title">${esc(n.title)}</span>
              <span class="h-article-meta">${[n.category, n.domain].filter(Boolean).join(' · ')} · ${readTime(n.body || n.oneLiner || '')}</span>
            </a>
          </li>`).join('')}
      </ul>
    </section>`;
}

/* ========== 4. 非对称作品展示 ========== */
function workMedia(w, featured) {
  if (w.screenshot) {
    return `<div class="h-work-media"><img src="${esc(w.screenshot)}" alt="${esc(w.title)} 项目截图" loading="lazy"></div>`;
  }
  return `<div class="h-work-media h-work-media--cover"><span>${esc((w.title || '?').slice(0, 1))}</span></div>`;
}

function workGallery(work) {
  if (!work.length) return '';
  const [featured, ...rest] = work;
  const cardInner = (w, featured = false) => `
    ${workMedia(w, featured)}
    <div class="h-work-body">
      <h3>${esc(w.title)}</h3>
      ${featured ? `<p>${esc(w.summary || w.problem || '')}</p>` : ''}
      <span class="h-work-meta">${esc(w.kindLabel || w.kind || '项目')} · ${esc(w.statusLabel || w.status || '')}</span>
      <span class="h-work-view">查看 <span aria-hidden="true">→</span></span>
    </div>`;
  return `
    <section class="h-section">
      <div class="h-section-head">
        <h2>最近做的</h2>
        <a href="#/work">全部项目 <span aria-hidden="true">→</span></a>
      </div>
      <div class="h-work-grid">
        <a class="h-work-card h-work-card--featured" href="#/work/${esc(featured.id)}">${cardInner(featured, true)}</a>
        ${rest.slice(0, 2).map((w) => `<a class="h-work-card" href="#/work/${esc(w.id)}">${cardInner(w)}</a>`).join('')}
      </div>
    </section>`;
}

/* ========== 5. 主题索引 ========== */
function topicIndex(lessons) {
  const mapped = lessons.map((l) => topicsWithDomain.find((t) => t.id === l.id) || l);
  const groups = [
    { id: 'ai', name: 'AI', filter: (l) => l.domain === 'ai' },
    { id: 'product', name: 'Product', filter: (l) => l.domain === 'product' },
    { id: 'agent', name: 'Agent', filter: (l) => l.domain === 'agent' },
    { id: 'engineering', name: 'Engineering', filter: (l) => l.domain === 'engineering' }
  ];

  const columns = groups
    .map((g) => {
      const items = mapped.filter(g.filter);
      if (!items.length) return '';
      return `
        <div class="h-topic-col">
          <h3 class="h-topic-domain">${esc(g.name)}</h3>
          <ul>
            ${items.slice(0, 6).map((l) => `
              <li>
                <a href="#/topics/${esc(l.id)}"><span>${esc(l.title)}</span></a>
              </li>`).join('')}
          </ul>
        </div>`;
    })
    .join('');

  return `
    <section class="h-section">
      <div class="h-section-head">
        <h2>最近搞明白的</h2>
        <a href="#/topics">全部术语 <span aria-hidden="true">→</span></a>
      </div>
      <div class="h-topic-grid">${columns}</div>
    </section>`;
}

/* ========== 6. 工具箱 ========== */
function toolboxList(tools) {
  if (!tools.length) return '';
  return `
    <section class="h-section">
      <div class="h-section-head">
        <h2>常用工具箱</h2>
        <a href="#/toolbox">全部工具 <span aria-hidden="true">→</span></a>
      </div>
      <ul class="h-tool-list">
        ${tools.slice(0, 5).map((t, i) => `
          <li class="h-tool-row">
            <span class="h-tool-no">${String(i + 1).padStart(2, '0')}</span>
            <span class="h-tool-type">${esc(t.typeLabel || t.type || 'TOOL')}</span>
            <span class="h-tool-name">${esc(t.title)}</span>
            <span class="h-tool-desc">${esc(t.problemSolved || t.subtitle || '')}</span>
            <span class="h-tool-actions">
              ${t.promptTemplate ? `<button type="button" class="h-tool-action" data-quick-copy="${esc(t.id)}">Copy</button>` : ''}
              <a class="h-tool-action" href="#/toolbox/${esc(t.id)}">Open</a>
            </span>
          </li>`).join('')}
      </ul>
    </section>`;
}

/* ========== 7. 页脚 ========== */
function footerHtml() {
  const links = site.footerLinks
    .map((l) => `<a href="${esc(l.href)}"${l.href.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>${esc(l.label)}</a>`)
    .join('<span class="h-foot-sep">·</span>');
  return `
    <footer class="h-foot">
      <div class="h-foot-links">${links}</div>
      <p class="h-foot-copy">© ${new Date().getFullYear()} ${esc(site.name)}. Built slowly, with curiosity & AI.</p>
    </footer>`;
}

/* ========== 视图入口 ========== */
export function renderHomeView(ctx) {
  const counts = {
    topics: ctx.lessons?.length || 0,
    notes: ctx.notes?.length || 0,
    work: ctx.work?.length || 0,
    papers: ctx.papers?.length || 0,
    tools: ctx.toolbox?.length || 0,
    library: ctx.library?.length || 0
  };

  return `
    <article class="home-view page-view">
      ${heroHtml()}
      ${statsNowHtml(counts)}
      ${noteDirectory(ctx.notes || [])}
      ${workGallery(ctx.work || [])}
      ${topicIndex(ctx.lessons || [])}
      ${toolboxList(ctx.toolbox || [])}
      ${footerHtml()}
    </article>`;
}
