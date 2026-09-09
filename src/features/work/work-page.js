/**
 * V4 视图层 · Work 索引（views/work.js）
 * Problem-first（蓝图 §6.8）：重点 PROJECT 独占大卡（c-card，先讲问题），
 * 其余一律压缩为行条目；Experiment 行条目展示可量化结果。
 * 详情页结构由 app.js 渲染（PROJECT/PROTOTYPE/EXPERIMENT 三模板，已达标）。
 */

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

const KIND_ORDER = { PROJECT: 0, PROTOTYPE: 1, EXPERIMENT: 2 };

/** Work 索引：重点卡 + 行条目 */
export function renderWorkIndex({ work, filterKind = 'ALL' }) {
  const order = { PROJECT: 0, PROTOTYPE: 1, EXPERIMENT: 2 };
  const sorted = [...work].sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9));
  const filtered = filterKind === 'ALL' ? sorted : sorted.filter((w) => w.kind === filterKind);
  const countOf = (kind) => (kind === 'ALL' ? work.length : work.filter((w) => w.kind === kind).length);
  const KIND_LABEL = { PROJECT: '完整项目', PROTOTYPE: '快速原型', EXPERIMENT: '实验验证' };

  const [feature, ...rest] = filtered;
  const featureHtml = feature
    ? `
      <article class="c-card v-work-feature">
        <p class="c-eyebrow">${String(1).padStart(2, '0')} / ${esc(feature.kind)} · ${esc(feature.statusLabel || '')}</p>
        <h2 class="card-title">${esc(feature.title)}</h2>
        <p class="v-work-question">${esc(feature.problem || feature.summary)}</p>
        ${feature.solution ? `<p class="v-work-flow">${esc(feature.solution)}</p>` : ''}
        <div class="v-work-foot">
          <span class="c-meta">${esc(feature.role || feature.time || '')}</span>
          <a class="c-arrow-link" href="#/work/${esc(feature.id)}">查看完整项目 <span class="row-arrow" aria-hidden="true">→</span></a>
        </div>
      </article>`
    : '';

  const rowsHtml = rest
    .map((w, i) => {
      const isExperiment = w.kind === 'EXPERIMENT';
      return `
        <a class="c-index-row" href="#/work/${esc(w.id)}">
          <span class="row-date c-meta">${String(i + 2).padStart(2, '0')} / ${esc(w.kind)}</span>
          <div class="row-main">
            <h3 class="row-title">${esc(w.title)}</h3>
            <p class="row-desc">${esc(isExperiment ? w.result || w.summary : w.summary)}</p>
          </div>
          <span class="row-aside">${esc(w.statusLabel || '')}<span class="row-arrow" aria-hidden="true">→</span></span>
        </a>`;
    })
    .join('');

  return `
    <section class="work-page page-view portfolio-index">
      <header class="v-section-head v-page-head v-page-hero">
        <div class="v-page-copy">
          <p class="c-eyebrow">05 WORK</p>
          <h1 class="v-page-title">我真正动手做过或验证过的东西。</h1>
          <p class="v-page-sub">完整项目讲清楚"先讲问题，再讲方案"；小实验只要有明确的问题、验证过程和可量化结果，同样值得留下来。</p>
        </div>
        <dl class="v-page-facts" aria-label="项目概览">
          <div><dt>${countOf('ALL')}</dt><dd>全部实践</dd></div>
          <div><dt>${countOf('PROJECT')}</dt><dd>完整项目</dd></div>
          <div><dt>持续</dt><dd>当前状态</dd></div>
        </dl>
      </header>

      <div class="v-work-browser">
        <div class="filter-tabs-row" aria-label="项目类型筛选">
          ${['ALL', 'PROJECT', 'PROTOTYPE', 'EXPERIMENT'].map((kind) => `
            <button type="button" class="tab-btn ${filterKind === kind ? 'is-active' : ''}" data-work-tab="${kind}">
              ${kind === 'ALL' ? '全部' : KIND_LABEL[kind]} <span>${countOf(kind)}</span>
            </button>`).join('')}
        </div>

        ${featureHtml}
        <div class="v-rows v-work-rows">${rowsHtml}</div>
      </div>
    </section>
  `;
}
