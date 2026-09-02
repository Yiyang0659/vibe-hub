/**
 * V4 视图层 · Notes 索引（views/notes.js）
 * 年份时间轴清单（蓝图 §6.4）：不卡片化 —— 日期 + 标题 + 一句话结论 + 元信息。
 * 详情页结构由 app.js 渲染（含 05 我还没想清楚什么 段）。
 */

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

const monthLabel = (date = '') => {
  const [, m, d] = date.split('-');
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return m && d ? `${MONTHS[Number(m) - 1] || m} ${d}` : date;
};

/** 按年分组的时间轴清单 */
export function renderNotesTimeline({ notes }) {
  const sorted = [...notes].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const years = [...new Set(sorted.map((n) => (n.date || '----').slice(0, 4)))];

  const groups = years
    .map((year) => {
      const group = sorted.filter((n) => (n.date || '').slice(0, 4) === year);
      return `
        <div class="v-timeline-group">
          <h2 class="c-timeline-year">${esc(year)}</h2>
          <div class="v-rows">
            ${group.map((note) => `
              <a class="c-index-row" href="#/notes/${esc(note.id)}">
                <span class="row-date c-meta">${esc(monthLabel(note.date))}</span>
                <div class="row-main">
                  <h3 class="row-title">${esc(note.title)}</h3>
                  ${note.oneLiner ? `<p class="row-desc">${esc(note.oneLiner)}</p>` : ''}
                </div>
                <span class="row-aside">${esc(note.category)} · ${note.duration || 5} MIN<span class="row-arrow" aria-hidden="true">→</span></span>
              </a>`).join('')}
          </div>
        </div>`;
    })
    .join('');

  return `
    <section class="notes-page page-view">
      <header class="v-section-head v-page-head">
        <div>
          <p class="c-eyebrow">03 NOTES</p>
          <h1 class="v-page-title">一些真正想明白之后留下来的东西。</h1>
          <p class="v-page-sub">不是长篇大论——问题、理解、例子、判断，外加一段"我还没想清楚什么"。300～1500 字刚好。</p>
        </div>
      </header>
      ${groups || '<p class="v-empty">还没有留下笔记。</p>'}
    </section>
  `;
}
