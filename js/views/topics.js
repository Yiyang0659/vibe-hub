/**
 * V4 视图层 · Topics 索引（views/topics.js）
 * 域分组行式索引（蓝图 §6.2）：放弃卡片网格，改为「域分组的行式清单」
 * + 即时过滤 + Hover Explain 浮层。渲染为纯字符串，事件在 mount 中绑定。
 */

import { DOMAINS } from '../content/topics.js';
import { searchLessons } from '../lib/search.js';

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

/** 单个术语行（消费 base.css 的 c-index-row） */
function topicRow(lesson, isCompletedFn) {
  const done = isCompletedFn(lesson.id);
  const explain = `${esc(lesson.excerpt)}||${(lesson.related || []).length}`;
  return `
    <a class="c-index-row t-row" href="#/topics/${esc(lesson.id)}"
       data-explain="${explain}">
      <div class="row-main">
        <h3 class="row-title">${esc(lesson.title)}${done ? ' <span class="t-done" aria-label="已掌握">✓</span>' : ''}</h3>
        <p class="row-desc">${esc(lesson.entryQuestion || lesson.excerpt)}</p>
      </div>
      <span class="row-aside">${esc(lesson.english || '')}<span class="row-arrow" aria-hidden="true">→</span></span>
    </a>`;
}

/** 域分组渲染（domain = 'all' 时按域分组，否则单组平铺） */
export function renderTopicGroups(topics, domain, isCompletedFn) {
  const visible = domain === 'all' ? DOMAINS.filter((d) => d.id !== 'all') : [DOMAINS.find((d) => d.id === domain)];
  return visible
    .map((d) => {
      const group = topics.filter((t) => t.domain === d.id);
      if (!group.length) return '';
      return `
        <div class="v-domain-group">
          <h3 class="c-timeline-year">${esc(d.label.toUpperCase())} <span>${group.length}</span></h3>
          <div class="v-rows">${group.map((t) => topicRow(t, isCompletedFn)).join('')}</div>
        </div>`;
    })
    .join('');
}

/** 页面静态骨架 */
export function renderTopicsIndex({ topics, params }) {
  const initialDomain = params.get('domain') || 'all';
  const countOf = (id) => (id === 'all' ? topics.length : topics.filter((t) => t.domain === id).length);

  return `
    <section class="topics-page page-view">
      <header class="v-section-head v-page-head">
        <div>
          <p class="c-eyebrow">02 TOPICS</p>
          <h1 class="v-page-title">我真正遇到并搞明白过的概念。</h1>
          <p class="v-page-sub">每个术语都包含定义、交互实验、误区与行动清单；带 <b>我为什么查它</b> 与 <b>我在哪用过它</b> 的个人痕迹。</p>
        </div>
      </header>

      <div class="v-filter-bar">
        <div class="category-tabs" role="tablist" aria-label="知识域筛选">
          ${DOMAINS.map((d) => `
            <button type="button" data-domain="${d.id}" class="${initialDomain === d.id ? 'is-active' : ''}">
              ${esc(d.label)} <span>${countOf(d.id)}</span>
            </button>`).join('')}
        </div>
        <label class="inline-search"><span aria-hidden="true">⌕</span>
          <input id="topic-search" type="search" placeholder="即时过滤：术语、英文或标签…" />
        </label>
      </div>

      <div id="topic-groups"></div>
    </section>
  `;
}

/** 事件绑定：域 Tab / 即时过滤 / Hover Explain */
export function mountTopicsIndex({ topics, initialDomain = 'all', isCompleted, onNoResult }) {
  let domain = initialDomain;
  let query = '';
  const container = document.querySelector('#topic-groups');

  const update = () => {
    const textMatches = new Set(
      searchLessons(topics, query, 'all', 'all').map((t) => t.id)
    );
    const filtered = topics.filter(
      (t) => (domain === 'all' || t.domain === domain) && (!query || textMatches.has(t.id))
    );
    container.innerHTML = filtered.length
      ? renderTopicGroups(filtered, domain, isCompleted)
      : `
        <div class="empty-state"><span>∅</span><h2>没有匹配的术语</h2>
          <p>没有找到“${esc(query)}”相关内容。可以换个词，或清空筛选。</p>
          <button type="button" id="clear-topic-filter">RESET FILTERS</button>
        </div>`;
    document.querySelector('#clear-topic-filter')?.addEventListener('click', () => {
      query = '';
      domain = 'all';
      document.querySelector('#topic-search').value = '';
      document.querySelectorAll('[data-domain]').forEach((b) => b.classList.toggle('is-active', b.dataset.domain === 'all'));
      update();
    });
  };

  document.querySelectorAll('[data-domain]').forEach((btn) => {
    btn.addEventListener('click', () => {
      domain = btn.dataset.domain;
      document.querySelectorAll('[data-domain]').forEach((b) => b.classList.toggle('is-active', b === btn));
      update();
    });
  });
  document.querySelector('#topic-search').addEventListener('input', (e) => {
    query = e.target.value;
    update();
  });

  // Hover Explain（蓝图 §8.2）：hover ≥150ms 弹出一句话解释
  let hoverTimer;
  let float = document.querySelector('#hover-explain');
  if (!float) {
    float = document.createElement('div');
    float.id = 'hover-explain';
    float.setAttribute('role', 'tooltip');
    document.body.appendChild(float);
  }
  container.addEventListener('mouseover', (e) => {
    const row = e.target.closest('[data-explain]');
    if (!row) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      const [desc, relatedCount] = row.dataset.explain.split('||');
      float.innerHTML = `
        <p class="he-label">一句话解释</p>
        <p class="he-desc">${desc}</p>
        <p class="he-meta">相关内容 ${relatedCount} 条 · 点击查看完整拆解与我在哪用过它</p>`;
      float.classList.add('is-visible');
    }, 150);
  });
  container.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-explain]')) {
      clearTimeout(hoverTimer);
      float.classList.remove('is-visible');
    }
  });

  update();
}
