/**
 * V4 视图层 · 首页（views/home.js）
 * 编辑部长流（蓝图 §6.1）：Hero + MiniTerminal → NOW → SplitPair →
 * 从问题开始 → 做过/验证过 → 最近笔记 → 读过/工具箱 → 资料库 → 页脚。
 *
 * 架构约定：本模块只做「数据 → HTML 字符串」的纯渲染；
 * 状态合并（getAllNotes 等）由 app.js 作为组合根传入 ctx；
 * 事件绑定（data-quick-copy 等）沿用 app.js 的全局委托。
 */

import { site } from '../content/site.js';

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

/* ---- 局部小组件 ---- */

const terminalLines = (lines) =>
  lines.map((line) => `<span class="t-line">${esc(line)}</span>`).join('');

function miniTerminal() {
  const t = site.terminal;
  return `
    <div class="c-terminal v-hero-terminal" aria-label="终端自我介绍">
      <span class="t-line t-muted">~/about — zsh</span>
      <span class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">whoami</span></span>
      ${terminalLines(t.whoami)}
      <span class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">currently</span></span>
      ${terminalLines(t.currently)}
      <span class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">building</span></span>
      ${terminalLines(t.building)}
      <span class="t-line"><span class="t-prompt">$</span> <span class="t-cursor" aria-hidden="true">▌</span></span>
    </div>`;
}

function splitPair({ leftLabel, leftHtml, rightLabel, rightHtml }) {
  return `
    <div class="v-split">
      <div class="v-split-col">
        <h2 class="v-split-label">${esc(leftLabel)}</h2>
        ${leftHtml}
      </div>
      <div class="v-split-col">
        <h2 class="v-split-label">${esc(rightLabel)}</h2>
        ${rightHtml}
      </div>
    </div>`;
}

/* 行式清单条目（消费 styles/base.css 的 c-index-row） */
function row({ date, title, desc, href, aside, label }) {
  const inner = `
    ${date ? `<span class="row-date c-meta">${esc(date)}</span>` : ''}
    <div class="row-main">
      ${label ? `<p class="c-eyebrow">${esc(label)}</p>` : ''}
      <h3 class="row-title">${esc(title)}</h3>
      ${desc ? `<p class="row-desc">${esc(desc)}</p>` : ''}
    </div>
    <span class="row-aside">${aside ? esc(aside) : ''}<span class="row-arrow" aria-hidden="true">→</span></span>`;
  return href
    ? `<a class="c-index-row" href="${esc(href)}">${inner}</a>`
    : `<div class="c-index-row">${inner}</div>`;
}

const sectionHead = (label, title, linkHtml = '') => `
  <div class="v-section-head">
    <div>
      <p class="c-eyebrow">${esc(label)}</p>
      <h2>${esc(title)}</h2>
    </div>
    ${linkHtml}
  </div>`;

/* ---- 各区块 ---- */

function heroHtml() {
  const h = site.hero;
  return `
    <header class="v-hero">
      <div class="v-hero-copy">
        <p class="c-eyebrow">${esc(site.name)} · ${esc(site.tagline)}</p>
        <h1 class="v-hero-title">${esc(h.title)}<br /><em>${esc(h.titleAccent)}</em></h1>
        <p class="v-hero-sub">最近主要在弄：${h.focusLine.map((f) => `<b>${esc(f)}</b>`).join(' · ')}</p>
        <div class="v-hero-actions">
          ${h.ctas.map((c) => `<a class="c-btn ${c.solid ? 'c-btn--solid' : ''}" href="${esc(c.href)}">${esc(c.label)} <span aria-hidden="true">→</span></a>`).join('')}
        </div>
      </div>
      ${miniTerminal()}
    </header>`;
}

function nowHtml() {
  const now = site.now;
  return `
    <section class="v-now">
      <p class="c-eyebrow">NOW / 最近在弄</p>
      <p class="v-now-text">${esc(now.text)}</p>
      <div class="v-now-meta">
        <span class="c-meta">${esc(now.date)}</span>
        <a class="c-arrow-link" href="${esc(now.href || now.linkHref)}">${esc(now.linkLabel)} <span class="row-arrow" aria-hidden="true">→</span></a>
      </div>
    </section>`;
}

function pairHtml({ notes, work }) {
  const latestNote = notes[0];
  const featuredWork = work.find((w) => w.kind === 'PROJECT') || work[0];

  const noteHtml = latestNote
    ? row({
        label: `NOTE · ${latestNote.duration || 5} MIN`,
        title: latestNote.title,
        desc: latestNote.oneLiner || latestNote.question,
        href: `#/notes/${latestNote.id}`,
        aside: ''
      })
    : `<p class="v-empty">最近还没有留下笔记。</p>`;

  const workHtml = featuredWork
    ? row({
        label: `${featuredWork.kind} · ${featuredWork.statusLabel || ''}`,
        title: featuredWork.title,
        desc: featuredWork.summary,
        href: `#/work/${featuredWork.id}`,
        aside: ''
      })
    : `<p class="v-empty">项目沉淀整理中。</p>`;

  return splitPair({
    leftLabel: '最近搞明白',
    leftHtml: noteHtml,
    rightLabel: '最近做的东西',
    rightHtml: workHtml
  });
}

function questionsHtml({ lessons }) {
  const rows = lessons
    .filter((l) => l.entryQuestion)
    .slice(0, 6)
    .map((l) =>
      row({
        title: l.entryQuestion,
        desc: `→ ${l.title} · ${l.english || ''}`,
        href: `#/topics/${l.id}`,
        aside: ''
      })
    )
    .join('');
  return `
    <section class="v-section">
      ${sectionHead('从问题开始', '知识从真实问题长出来', `<a class="c-arrow-link" href="#/topics">全部知识 <span class="row-arrow" aria-hidden="true">→</span></a>`)}
      <div class="v-rows">${rows}</div>
    </section>`;
}

function workHtml({ work }) {
  const order = { PROJECT: 0, PROTOTYPE: 1, EXPERIMENT: 2 };
  const rows = [...work]
    .sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9))
    .slice(0, 3)
    .map((w, i) =>
      row({
        label: `${String(i + 1).padStart(2, '0')} / ${w.kind}`,
        title: w.title,
        desc: w.summary,
        href: `#/work/${w.id}`,
        aside: w.statusLabel || ''
      })
    )
    .join('');
  return `
    <section class="v-section">
      ${sectionHead('我做过 / 验证过的东西', 'Projects · Prototypes · Experiments', `<a class="c-arrow-link" href="#/work">全部实践 <span class="row-arrow" aria-hidden="true">→</span></a>`)}
      <div class="v-rows">${rows}</div>
    </section>`;
}

function recentNotesHtml({ notes }) {
  const rows = notes
    .slice(0, 3)
    .map((n) =>
      row({
        date: (n.date || '').slice(5).replace('-', '.'),
        title: n.title,
        href: `#/notes/${n.id}`,
        aside: `${n.duration || 5} min`
      })
    )
    .join('');
  return `
    <section class="v-section">
      ${sectionHead('最近留下的笔记', 'Notes', `<a class="c-arrow-link" href="#/notes">全部笔记 <span class="row-arrow" aria-hidden="true">→</span></a>`)}
      <div class="v-rows">${rows}</div>
    </section>`;
}

function readingToolsHtml({ papers, toolbox }) {
  const readingRows = papers
    .slice(0, 3)
    .map((p) =>
      row({
        label: p.kindLabel || 'PAPER',
        title: p.title,
        href: `#/papers/${p.id}`,
        aside: p.year || ''
      })
    )
    .join('');
  const toolRows = toolbox
    .slice(0, 3)
    .map((t) =>
      row({
        label: t.typeLabel || 'TOOL',
        title: t.title,
        desc: t.problemSolved,
        href: `#/toolbox/${t.id}`,
        aside: ''
      })
    )
    .join('');
  return splitPair({
    leftLabel: '最近读过',
    leftHtml: `<div class="v-rows v-rows--tight">${readingRows}</div><a class="c-arrow-link" href="#/reading">全部阅读 <span class="row-arrow" aria-hidden="true">→</span></a>`,
    rightLabel: '工具箱',
    rightHtml: `<div class="v-rows v-rows--tight">${toolRows}</div><a class="c-arrow-link" href="#/toolbox">进入工具箱 <span class="row-arrow" aria-hidden="true">→</span></a>`
  });
}

function libraryHtml({ library }) {
  const rows = library
    .slice(0, 3)
    .map((item) =>
      row({
        label: item.typeLabel || item.type,
        title: item.title,
        desc: item.whyRecommend || item.whySaved,
        href: item.url && item.url.startsWith('#') ? item.url : '#/library',
        aside: ''
      })
    )
    .join('');
  return `
    <section class="v-section">
      ${sectionHead('值得留下的资料', 'Curated Library', `<a class="c-arrow-link" href="#/library">全部资料 <span class="row-arrow" aria-hidden="true">→</span></a>`)}
      <div class="v-rows">${rows}</div>
    </section>`;
}

function footerHtml({ progress, lessons }) {
  const links = site.footerLinks
    .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
    .join('<span aria-hidden="true">·</span>');
  return `
    <footer class="v-home-foot">
      <div>${links}</div>
      <p class="c-meta">已学 ${progress.completed} / ${lessons.length} · 本站由我长期维护，缓慢生长。</p>
    </footer>`;
}

/* ---- 视图入口：ctx = { lessons, routes, progress, notes, work, toolbox, papers, library, currentFocus } ---- */

export function renderHomeView(ctx) {
  return `
    <section class="home-view page-view">
      ${heroHtml()}
      ${nowHtml()}
      ${pairHtml({ notes: ctx.notes, work: ctx.work })}
      ${questionsHtml({ lessons: ctx.lessons })}
      ${workHtml({ work: ctx.work })}
      ${recentNotesHtml({ notes: ctx.notes })}
      ${readingToolsHtml({ papers: ctx.papers, toolbox: ctx.toolbox })}
      ${libraryHtml({ library: ctx.library })}
      ${footerHtml({ progress: ctx.progress, lessons: ctx.lessons })}
    </section>`;
}
