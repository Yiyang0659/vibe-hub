/**
 * V4 视图层 · Reading 索引（views/reading.js）
 * 论文与好文章合并（蓝图 §6.6）：类型筛选 + 行式清单。
 * 每行突出「我记住的第一件事」与笔记状态（已写笔记 / 未写）。
 * 论文拆解详情由 app.js 渲染（结构已符合 §6.7）。
 */

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

/** Reading 行：类型 + 年份 + 标题 + 我记住的 + 笔记状态 */
function readingRow(item) {
  const hasNote = (item.relatedNotes || []).length > 0;
  return `
    <a class="c-index-row" href="#/papers/${esc(item.id)}">
      <span class="row-date c-meta">${esc(item.year || '')}</span>
      <div class="row-main">
        <p class="c-eyebrow">${esc(item.kindLabel || 'PAPER')} · ${esc(item.domain || '')}</p>
        <h3 class="row-title">${esc(item.title)}</h3>
        <p class="row-desc">我记住的：${esc((item.myTake && item.myTake[0]) || item.oneLiner)}</p>
      </div>
      <span class="row-aside">${hasNote ? '<b class="v-note-flag">已写笔记</b>' : '未写笔记'}<span class="row-arrow" aria-hidden="true">→</span></span>
    </a>`;
}

/** Reading 索引：类型筛选 + 行式清单 */
export function renderReadingIndex({ items, filterKind = 'ALL' }) {
  const KIND_LABEL = { PAPER: 'Paper', ARTICLE: 'Article', REPORT: 'Report', BOOK: 'Book' };
  const kinds = [...new Set(items.map((i) => i.kindLabel || 'PAPER'))];
  const filtered = filterKind === 'ALL' ? items : items.filter((i) => (i.kindLabel || 'PAPER') === filterKind);
  const countOf = (kind) => (kind === 'ALL' ? items.length : items.filter((i) => (i.kindLabel || 'PAPER') === kind).length);

  return `
    <section class="papers-page page-view">
      <header class="v-section-head v-page-head">
        <div>
          <p class="c-eyebrow">04 READING</p>
          <h1 class="v-page-title">读过的论文和值得留下的文章。</h1>
          <p class="v-page-sub">不做论文收藏夹，也不做全文翻译——每条只保留「为什么我读」和「我记住了什么」。</p>
        </div>
      </header>

      <div class="filter-tabs-row">
        <button type="button" class="tab-btn ${filterKind === 'ALL' ? 'is-active' : ''}" data-reading-tab="ALL">全部 (${countOf('ALL')})</button>
        ${kinds.map((k) => `<button type="button" class="tab-btn ${filterKind === k ? 'is-active' : ''}" data-reading-tab="${esc(k)}">${KIND_LABEL[k] || k} (${countOf(k)})</button>`).join('')}
      </div>

      <div class="v-rows">${filtered.map(readingRow).join('')}</div>
    </section>
  `;
}
