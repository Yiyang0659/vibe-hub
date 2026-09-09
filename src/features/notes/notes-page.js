/**
 * Articles index — notes, selected concepts, and reading traces in one place.
 * The page is intentionally editorial rather than repository-like: one lead
 * story, a small set of reading modes, and a single continuous stream.
 */

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

const monthLabel = (date = '') => {
  const [, month, day] = date.split('-');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return month && day ? `${months[Number(month) - 1] || month} ${day}` : date;
};

function noteItem(note) {
  return {
    id: note.id,
    type: 'THOUGHT',
    typeLabel: '思考',
    marker: monthLabel(note.date),
    title: note.title,
    desc: note.oneLiner,
    meta: `${note.category} · ${note.duration || 5} MIN`,
    href: `#/notes/${note.id}`,
    sortKey: note.date || ''
  };
}

function topicItem(topic, index) {
  return {
    id: topic.id,
    type: 'CONCEPT',
    typeLabel: '概念',
    marker: 'TERM',
    title: topic.title,
    desc: topic.excerpt,
    meta: `${topic.english || topic.domain} · ${topic.duration || 6} MIN`,
    href: `#/topics/${topic.id}`,
    sortKey: `0000-${String(99 - index).padStart(2, '0')}`
  };
}

function paperItem(paper) {
  return {
    id: paper.id,
    type: 'READING',
    typeLabel: '阅读',
    marker: String(paper.year || 'READ'),
    title: paper.title,
    desc: paper.oneLiner,
    meta: `${paper.kindLabel || 'PAPER'} · ${paper.domain || 'AI'}`,
    href: `#/papers/${paper.id}`,
    sortKey: `${paper.year || '0000'}-01-01`
  };
}

function articleRow(item) {
  return `
    <a class="c-index-row article-row article-row--${item.type.toLowerCase()}" href="${esc(item.href)}">
      <span class="article-row-marker c-meta">${esc(item.marker)}</span>
      <div class="row-main">
        <p class="article-kind">${esc(item.typeLabel)} / ${esc(item.type)}</p>
        <h3 class="row-title">${esc(item.title)}</h3>
        <p class="row-desc">${esc(item.desc)}</p>
      </div>
      <span class="row-aside">${esc(item.meta)}<span class="row-arrow" aria-hidden="true">→</span></span>
    </a>`;
}

function renderArticleBrowser({ notes, topics, papers, filterKind }) {
  const leadId = [...notes].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]?.id;
  const thoughtItems = notes.map(noteItem).filter((item) => item.id !== leadId);
  const conceptItems = topics.map(topicItem);
  const readingItems = papers.map(paperItem);
  const mixed = [...thoughtItems, ...readingItems, ...conceptItems.slice(0, 6)]
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const byKind = {
    ALL: mixed,
    THOUGHT: thoughtItems,
    CONCEPT: conceptItems,
    READING: readingItems
  };
  const visible = byKind[filterKind] || mixed;
  const tabs = [
    ['ALL', '全部', notes.length + papers.length + topics.length],
    ['THOUGHT', '思考', notes.length],
    ['CONCEPT', '概念', topics.length],
    ['READING', '阅读', papers.length]
  ];

  return `
    <section class="article-browser" aria-live="polite">
      <div class="article-browser-head">
        <div>
          <p class="c-eyebrow">BROWSE / 浏览</p>
          <h2>${filterKind === 'ALL' ? '最近留下的内容' : tabs.find(([kind]) => kind === filterKind)?.[1] || '最近留下的内容'}</h2>
        </div>
        <div class="filter-tabs-row" role="tablist" aria-label="文章类型筛选">
          ${tabs.map(([kind, label, count]) => `
            <button type="button" class="tab-btn ${filterKind === kind ? 'is-active' : ''}" data-article-tab="${kind}" role="tab" aria-selected="${filterKind === kind}">
              ${label} <span>${count}</span>
            </button>`).join('')}
        </div>
      </div>
      <div class="v-rows article-rows">
        ${visible.map(articleRow).join('') || '<p class="v-empty">这一页还没有内容。</p>'}
      </div>
      ${filterKind === 'CONCEPT' || filterKind === 'ALL' ? `
        <a class="article-index-link" href="#/topics">
          <span>完整概念索引</span>
          <small>按 AI、产品、Agent 与工程分类查看全部词条</small>
          <b aria-hidden="true">→</b>
        </a>` : ''}
    </section>`;
}

export function renderArticlesIndex({ notes, topics, papers, filterKind = 'ALL' }) {
  const sortedNotes = [...notes].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const lead = sortedNotes[0];
  const latestYear = lead?.date?.slice(0, 4) || '—';

  return `
    <section class="notes-page articles-page page-view portfolio-index">
      <header class="v-section-head v-page-head v-page-hero article-page-hero">
        <div class="v-page-copy">
          <p class="c-eyebrow">WRITING / NOTES</p>
          <h1 class="v-page-title">写下我如何理解问题，<br>也记录它后来变成了什么。</h1>
          <p class="v-page-sub">从一个具体问题出发，经过阅读、验证和实践，留下目前仍然相信的判断。</p>
        </div>
        <dl class="v-page-facts" aria-label="内容概览">
          <div><dt>${notes.length}</dt><dd>篇思考</dd></div>
          <div><dt>${topics.length}</dt><dd>个重点概念</dd></div>
          <div><dt>${papers.length}</dt><dd>份阅读拆解</dd></div>
        </dl>
      </header>

      ${lead ? `
        <a class="article-feature" href="#/notes/${esc(lead.id)}">
          <div class="article-feature-index">
            <span>FEATURED</span>
            <b>${esc(latestYear)}</b>
          </div>
          <div class="article-feature-copy">
            <p>${esc(lead.category)} · ${esc(monthLabel(lead.date))}</p>
            <h2>${esc(lead.title)}</h2>
            <blockquote>${esc(lead.oneLiner)}</blockquote>
          </div>
          <span class="article-feature-arrow" aria-hidden="true">↗</span>
        </a>` : ''}

      ${renderArticleBrowser({ notes: sortedNotes, topics, papers, filterKind })}
    </section>`;
}

// Compatibility export for older imports.
export const renderNotesTimeline = renderArticlesIndex;
