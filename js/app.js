import { categories, learningQuote, lessons } from './data.js';
import { calculateProgress, categoryProgress, getNextLesson, safeParse, searchLessons } from './utils.js';

const storageKey = 'learning-voyage-state-v1';
const defaultState = {
  completed: [],
  favorites: [],
  notes: {},
  lastViewed: null,
  theme: 'day',
  motionMode: 'trace',
  practiceAnswered: 0,
  practiceCorrect: 0
};

let state = loadState();
let practice = { index: 0, selected: null };
let toastTimer;
let sectionObserver;
let scenarioPlaybackTimer;

const main = document.querySelector('#main-content');
const searchDialog = document.querySelector('#search-dialog');
const globalSearch = document.querySelector('#global-search');
const searchResults = document.querySelector('#search-results');
const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-quick');

function loadState() {
  const saved = safeParse(localStorage.getItem(storageKey), {});
  return {
    ...defaultState,
    ...saved,
    completed: Array.isArray(saved.completed) ? saved.completed : [],
    favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
    notes: saved.notes && typeof saved.notes === 'object' ? saved.notes : {}
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateProgressUI();
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function categoryOf(name) {
  return categories.find((category) => category.id === name) || categories[0];
}

function lessonById(id) {
  return lessons.find((lesson) => lesson.id === id);
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  themeToggles.forEach((button) => {
    button.textContent = button.id === 'theme-toggle-quick'
      ? (theme === 'night' ? '日间' : '夜航')
      : (theme === 'night' ? '返回日间模式' : '切换夜航模式');
    button.setAttribute('aria-pressed', String(theme === 'night'));
    button.setAttribute('aria-label', theme === 'night' ? '返回日间模式' : '切换夜航模式');
  });
  saveState();
}

function updateProgressUI() {
  const progress = calculateProgress(lessons.length, state.completed);
  document.querySelector('#sidebar-progress').textContent = `${progress.percent}%`;
  document.querySelector('#sidebar-progress-bar').style.width = `${progress.percent}%`;
}

function isFavorite(id) {
  return state.favorites.includes(id);
}

function isCompleted(id) {
  return state.completed.includes(id);
}

function toggleFavorite(id) {
  state.favorites = isFavorite(id)
    ? state.favorites.filter((item) => item !== id)
    : [...state.favorites, id];
  saveState();
  showToast(isFavorite(id) ? '条目已保存' : '条目已移出保存列表');
}

function toggleCompleted(id) {
  state.completed = isCompleted(id)
    ? state.completed.filter((item) => item !== id)
    : [...state.completed, id];
  saveState();
  showToast(isCompleted(id) ? '模块状态：PASSED' : '模块状态：PENDING');
}

function lessonCard(lesson, index = 0) {
  const category = categoryOf(lesson.category);
  const complete = isCompleted(lesson.id);
  return `
    <article class="lesson-card reveal" style="--delay:${Math.min(index * 45, 270)}ms; --route-color:${category.accent}">
      <div class="lesson-card-top">
        <span class="route-code">${category.code} · ${escapeHTML(lesson.level)}</span>
        <button class="favorite-button ${isFavorite(lesson.id) ? 'is-active' : ''}" type="button" data-favorite="${lesson.id}" aria-label="${isFavorite(lesson.id) ? '取消收藏' : '收藏'} ${escapeHTML(lesson.title)}" aria-pressed="${isFavorite(lesson.id)}">${isFavorite(lesson.id) ? '◆' : '◇'}</button>
      </div>
      <a class="lesson-card-link" href="#/lesson/${lesson.id}">
        <span class="completion-mark ${complete ? 'is-done' : ''}" aria-label="${complete ? '已完成' : '未完成'}">${complete ? '✓' : String(index + 1).padStart(2, '0')}</span>
        <div>
          <p class="eyebrow">${escapeHTML(lesson.english)}</p>
          <h3>${escapeHTML(lesson.title)}</h3>
          <p>${escapeHTML(lesson.excerpt)}</p>
        </div>
      </a>
      <footer><span>${lesson.duration} 分钟</span><span>${lesson.tags.slice(0, 2).map(escapeHTML).join(' · ')}</span></footer>
    </article>`;
}

function renderHome() {
  const progress = calculateProgress(lessons.length, state.completed);
  const routes = categoryProgress(lessons, state.completed);
  const next = state.lastViewed && !isCompleted(state.lastViewed)
    ? lessonById(state.lastViewed)
    : getNextLesson(lessons, state.completed);
  const nextCategory = categoryOf(next.category);

  main.innerHTML = `
    <section class="home-page page-view">
      <div class="hero-grid">
        <div class="hero-copy reveal">
          <p class="chapter-label"><span>WORKSPACE</span> / OVERVIEW</p>
          <h1>把模糊问题，<br /><em>编译成清晰知识。</em></h1>
          <p class="hero-intro">理解术语、运行示例、通过测试。把每次和 AI 协作时遇到的问题，沉淀成可以复用的个人知识库。</p>
          <div class="hero-actions">
            <a class="primary-action" href="#/lesson/${next.id}">RUN NEXT MODULE <span>→</span></a>
            <a class="secondary-action" href="#/library">OPEN KNOWLEDGE BASE</a>
          </div>
        </div>
        <div class="system-monitor reveal" style="--delay:100ms" aria-label="总体学习进度 ${progress.percent}%">
          <header><span>learning-runtime</span><b><i></i> ONLINE</b></header>
          <div class="monitor-value"><strong>${String(progress.percent).padStart(2, '0')}</strong><span>%</span><small>KNOWLEDGE COVERAGE</small></div>
          <div class="monitor-bar"><i style="width:${progress.percent}%"></i></div>
          <ul><li><span>modules.passed</span><b>${String(progress.completed).padStart(2, '0')}</b></li><li><span>modules.pending</span><b>${String(progress.remaining).padStart(2, '0')}</b></li><li><span>storage.mode</span><b>LOCAL</b></li></ul>
          <code><span>›</span> index ready · ${lessons.length} modules loaded</code>
        </div>
      </div>

      <section class="continue-strip reveal" style="--delay:160ms; --route-color:${nextCategory.accent}">
        <div><span class="ink-label">NEXT MODULE</span><small>${nextCategory.code} / ${escapeHTML(next.category)}</small></div>
        <div class="continue-main"><p>${escapeHTML(next.english)}</p><h2>${escapeHTML(next.title)}</h2><span>${escapeHTML(next.excerpt)}</span></div>
        <div class="continue-time"><strong>${next.duration}</strong><span>分钟</span></div>
        <a href="#/lesson/${next.id}" aria-label="继续学习 ${escapeHTML(next.title)}">RUN →</a>
      </section>

      <div class="section-heading reveal">
        <div><p class="chapter-label"><span>MODULE GROUPS</span> KNOWLEDGE TREE</p><h2>选择今天要调试的领域</h2></div>
        <a href="#/library">查看全部 ${lessons.length} 个模块 →</a>
      </div>
      <div class="route-grid">
        ${categories.map((category, index) => {
          const route = routes[category.id] || { total: 0, completed: 0, percent: 0 };
          return `
            <a class="route-card reveal" style="--route-color:${category.accent}; --delay:${index * 55}ms" href="#/library?category=${encodeURIComponent(category.id)}">
              <div><span class="route-number">0${index + 1}</span><span class="route-code">${category.code}</span></div>
              <h3>${escapeHTML(category.title)}</h3>
              <p>${escapeHTML(category.subtitle)}</p>
              <footer><span>${route.completed} / ${route.total} 已完成</span><i><b style="width:${route.percent}%"></b></i></footer>
            </a>`;
        }).join('')}
      </div>

      <section class="deck-grid">
        <div class="recent-log reveal">
          <div class="section-heading compact"><div><p class="chapter-label">RECENT LOG</p><h2>最近访问的模块</h2></div></div>
          <div class="compact-list">
            ${lessons.slice(0, 4).map((lesson, index) => `
              <a href="#/lesson/${lesson.id}"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHTML(lesson.title)}</strong><small>${escapeHTML(lesson.category)} · ${lesson.duration} 分钟</small></div><b>${isCompleted(lesson.id) ? '已记录' : '待探索'}</b></a>
            `).join('')}
          </div>
        </div>
        <aside class="captain-note reveal" style="--delay:100ms">
          <span class="stamp">LAB NOTE</span>
          <blockquote>“${learningQuote}”</blockquote>
          <p>今天不必加载很多模块，只需真正理解一个概念，并在手上的项目里运行一次。</p>
          <a href="#/practice">RUN DAILY TEST →</a>
        </aside>
      </section>
    </section>`;
}

function renderLibrary(params) {
  const initialCategory = params.get('category') || 'all';
  const uniqueTagCount = new Set(lessons.flatMap((lesson) => lesson.tags || [])).size;
  const featuredTags = ['HTML', 'CSS', 'API', '数据库', 'Git', '上下文', '用户', '部署'];
  main.innerHTML = `
    <section class="library-page page-view">
      <header class="page-header reveal">
        <p class="chapter-label"><span>KNOWLEDGE BASE</span> / MODULE INDEX</p>
        <div><h1>理解术语，才能更精确地给机器下指令。</h1><p>按领域筛选，或搜索正在解决的问题。每个模块都包含定义、职责、互动实验、误区和可执行检查。</p></div>
      </header>
      <section class="term-index-stats reveal" aria-label="术语库概览">
        <div><span>TERM MODULES</span><strong>${lessons.length}</strong><small>个完整术语</small></div>
        <div><span>LEARNING ROUTES</span><strong>${categories.length}</strong><small>条学习路径</small></div>
        <div><span>SEARCH LABELS</span><strong>${uniqueTagCount}</strong><small>个检索标签</small></div>
        <p><b>INDEX EXPANDED</b> 每个术语都包含场景解释、误区、行动清单、关联概念与快速校准。</p>
      </section>
      <div class="library-toolbar reveal" style="--delay:80ms">
        <label class="inline-search"><span aria-hidden="true">⌕</span><input id="library-search" type="search" placeholder="搜索标题、英文名或标签…" /></label>
        <label>难度<select id="level-filter"><option value="all">全部</option><option value="入门">入门</option><option value="进阶">进阶</option></select></label>
      </div>
      <div class="category-tabs reveal" role="tablist" aria-label="知识分类">
        <button type="button" data-category="all" class="${initialCategory === 'all' ? 'is-active' : ''}">全部 <span>${lessons.length}</span></button>
        ${categories.map((category) => `<button type="button" data-category="${category.id}" class="${initialCategory === category.id ? 'is-active' : ''}">${category.title} <span>${lessons.filter((lesson) => lesson.category === category.id).length}</span></button>`).join('')}
      </div>
      <div class="term-quick-filter reveal" aria-label="热门术语标签"><span>QUICK LOOKUP</span>${featuredTags.map((tag) => `<button type="button" data-term-tag="${tag}">${tag}</button>`).join('')}</div>
      <div class="library-summary" id="library-summary"></div>
      <div class="lesson-grid" id="lesson-grid"></div>
    </section>`;

  let activeCategory = initialCategory;
  let query = '';
  let level = 'all';
  const grid = document.querySelector('#lesson-grid');
  const summary = document.querySelector('#library-summary');

  const update = () => {
    const results = searchLessons(lessons, query, activeCategory, level);
    summary.innerHTML = `<span>INDEX MATCHES</span><strong>${results.length}</strong><small>个结果</small>`;
    grid.innerHTML = results.length
      ? results.map(lessonCard).join('')
      : `<div class="empty-state"><span>∅</span><h2>没有匹配的模块</h2><p>没有找到“${escapeHTML(query)}”相关内容。可以换个词，或清空筛选返回完整索引。</p><button type="button" id="clear-library">RESET FILTERS</button></div>`;
    document.querySelector('#clear-library')?.addEventListener('click', () => {
      query = ''; level = 'all'; activeCategory = 'all';
      document.querySelector('#library-search').value = '';
      document.querySelector('#level-filter').value = 'all';
      document.querySelectorAll('[data-category]').forEach((button) => button.classList.toggle('is-active', button.dataset.category === 'all'));
      update();
    });
  };

  document.querySelector('#library-search').addEventListener('input', (event) => {
    query = event.target.value;
    document.querySelectorAll('[data-term-tag]').forEach((item) => item.classList.remove('is-active'));
    update();
  });
  document.querySelector('#level-filter').addEventListener('change', (event) => { level = event.target.value; update(); });
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach((item) => item.classList.toggle('is-active', item === button));
    update();
  }));
  document.querySelectorAll('[data-term-tag]').forEach((button) => button.addEventListener('click', () => {
    const isActive = button.classList.contains('is-active');
    query = isActive ? '' : button.dataset.termTag;
    document.querySelector('#library-search').value = query;
    document.querySelectorAll('[data-term-tag]').forEach((item) => item.classList.toggle('is-active', item === button && !isActive));
    update();
  }));
  update();
}

function scenarioMarkup(lesson) {
  if (!lesson.scenario) return '';
  const steps = lesson.scenario.steps;
  return `
    <section id="scenario" class="content-section scenario-section reveal">
      <p class="section-no">03 / INTERACTIVE LAB</p>
      <h2>${escapeHTML(lesson.scenario.title)}</h2>
      <p>${escapeHTML(lesson.scenario.description)}</p>
      <div class="runtime-window" data-motion="${escapeHTML(state.motionMode || 'trace')}" data-step="1" data-active-panel="browser" style="--flow-x:12%">
        <header><div><i></i><i></i><i></i></div><code>save-flow.spec</code><span>RUNNING</span></header>
        <div class="motion-switcher" role="group" aria-label="互动实验动画版本">
          <span><b>MOTION PROFILE</b><small>选择你喜欢的动效语言</small></span>
          <button type="button" data-motion-mode="trace" aria-pressed="${state.motionMode === 'trace'}"><i>01</i> 信号轨道</button>
          <button type="button" data-motion-mode="scan" aria-pressed="${state.motionMode === 'scan'}"><i>02</i> 诊断聚焦</button>
          <button type="button" data-motion-mode="packet" aria-pressed="${state.motionMode === 'packet'}"><i>03</i> 数据包传输</button>
        </div>
        <div class="runtime-canvas">
          <div class="runtime-motion-layer" aria-hidden="true"><i></i><b></b><span></span></div>
          <section class="runtime-node" data-runtime-panel="browser">
            <small>FRONTEND · BROWSER</small><strong>app.local/profile</strong>
            <label>显示名称<input value="Aiko" readonly /></label><button type="button" tabindex="-1">保存</button>
          </section>
          <span class="runtime-arrow" aria-hidden="true"><i></i><b>→</b></span>
          <section class="runtime-node api-node" data-runtime-panel="api"><small>API · CONTRACT</small><strong><b>PATCH</b> /api/profile</strong><code>{ name: 'Aiko' }</code><span>status · body</span></section>
          <span class="runtime-arrow" aria-hidden="true"><i></i><b>→</b></span>
          <section class="runtime-node" data-runtime-panel="backend"><small>BACKEND</small><strong>request handler</strong><ul><li>身份有效？</li><li>名称合规？</li><li>允许修改？</li></ul></section>
          <span class="runtime-arrow" aria-hidden="true"><i></i><b>→</b></span>
          <section class="runtime-node" data-runtime-panel="database"><small>DATABASE</small><strong>profiles</strong><code>7  Aiko  just now</code></section>
        </div>
        <div class="runtime-readout" aria-live="polite">
          <span id="scenario-count">01 / ${String(steps.length).padStart(2, '0')}</span>
          <div><small id="scenario-owner">${escapeHTML(steps[0].owner)}</small><strong id="scenario-title">${escapeHTML(steps[0].title)}</strong><p id="scenario-description">${escapeHTML(steps[0].description)}</p></div>
          <div class="runtime-controls"><button type="button" id="scenario-play" aria-pressed="false">▶ 自动演示</button><button type="button" id="scenario-prev" disabled>← 上一步</button><button type="button" id="scenario-next">下一步 →</button></div>
        </div>
        <div class="runtime-timeline" role="list" aria-label="保存流程步骤">
          ${steps.map((step, index) => `<button type="button" role="listitem" data-scenario-step="${index}" class="${index === 0 ? 'is-active' : ''} ${step.focus ? 'is-focus' : ''}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHTML(step.title)}</strong><small>${escapeHTML(step.owner)}${step.focus ? ' · 本页重点' : ''}</small></button>`).join('')}
        </div>
      </div>
    </section>`;
}

function renderLesson(id) {
  clearInterval(scenarioPlaybackTimer);
  const lesson = lessonById(id);
  if (!lesson) return renderNotFound();
  const category = categoryOf(lesson.category);
  state.lastViewed = id;
  saveState();
  const related = lesson.related.map(lessonById).filter(Boolean);

  main.innerHTML = `
    <article class="lesson-page page-view" style="--route-color:${category.accent}">
      <nav class="breadcrumb reveal" aria-label="面包屑"><a href="#/library">知识索引</a><span>/</span><a href="#/library?category=${encodeURIComponent(lesson.category)}">${escapeHTML(lesson.category)}</a><span>/</span><strong>${escapeHTML(lesson.title)}</strong></nav>
      <header class="lesson-hero reveal">
        <div class="lesson-index"><span>${category.code}</span><b>${String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</b></div>
        <div><p class="eyebrow">${escapeHTML(lesson.english)} · ${escapeHTML(lesson.level)} · ${lesson.duration} 分钟</p><h1>${escapeHTML(lesson.title)}</h1>${lesson.aliases?.length ? `<p class="alias-line"><span>AKA</span> ${lesson.aliases.map(escapeHTML).join(' / ')}</p>` : ''}<p class="lesson-lead">${escapeHTML(lesson.excerpt)}</p><div class="tag-row">${lesson.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join('')}</div></div>
        <button class="favorite-seal ${isFavorite(id) ? 'is-active' : ''}" type="button" data-favorite="${id}" aria-pressed="${isFavorite(id)}"><span>${isFavorite(id) ? '已收藏' : '保存条目'}</span><b>${isFavorite(id) ? '◆' : '◇'}</b></button>
      </header>

      <div class="lesson-layout">
        <aside class="lesson-toc reveal" aria-label="本页章节">
          <span>ON THIS PAGE</span>
          <a class="is-active" href="#/lesson/${id}" data-scroll-target="definition" aria-current="location">术语说明</a><a href="#/lesson/${id}" data-scroll-target="why">核心职责</a>${lesson.scenario ? `<a href="#/lesson/${id}" data-scroll-target="scenario">互动实验</a>` : ''}<a href="#/lesson/${id}" data-scroll-target="practice-example">实践示例</a><a href="#/lesson/${id}" data-scroll-target="pitfalls">常见误区</a><a href="#/lesson/${id}" data-scroll-target="checklist">行动清单</a><a href="#/lesson/${id}" data-scroll-target="quick-check">快速校准</a><a href="#/lesson/${id}" data-scroll-target="notes">我的笔记</a>
        </aside>
        <div class="lesson-content">
          <section id="definition" class="content-section reveal"><p class="section-no">01 / DEFINITION</p><h2>术语说明</h2>${lesson.userSays ? `<div class="user-says"><span>你可能会说</span><p>${escapeHTML(lesson.userSays)}</p></div>` : ''}<p class="definition-copy">${escapeHTML(lesson.definition)}</p></section>
          <section id="why" class="content-section reveal"><p class="section-no">02 / RESPONSIBILITY</p><h2>它负责什么</h2><p>${escapeHTML(lesson.why)}</p><div class="key-points">${lesson.points.map((point, index) => `<div><span>0${index + 1}</span><p>${escapeHTML(point)}</p></div>`).join('')}</div></section>
          ${scenarioMarkup(lesson)}
          ${lesson.boundary ? `<aside class="boundary-alert reveal"><span>!</span><div><strong>重要边界</strong><p>${escapeHTML(lesson.boundary)}</p></div></aside>` : ''}
          <section id="practice-example" class="content-section reveal"><p class="section-no">04 / APPLICATION</p><h2>放进真实任务里</h2><div class="field-note"><span>RUNBOOK</span><p>${escapeHTML(lesson.example)}</p></div></section>
          <section id="pitfalls" class="content-section reveal"><p class="section-no">04 / 避险</p><h2>常见误区</h2><ul class="pitfall-list">${lesson.pitfalls.map((item) => `<li><span>×</span>${escapeHTML(item)}</li>`).join('')}</ul></section>
          <section id="checklist" class="content-section reveal"><p class="section-no">05 / 检查</p><h2>行动清单</h2><div class="action-list">${lesson.checklist.map((item, index) => `<label><input type="checkbox" /><span>${escapeHTML(item)}</span><b>0${index + 1}</b></label>`).join('')}</div></section>
          <section id="quick-check" class="quick-check reveal"><span class="ink-label">快速校准</span><h2>${escapeHTML(lesson.question.prompt)}</h2><div class="mini-choices">${lesson.question.choices.map((choice, index) => `<button type="button" data-mini-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${escapeHTML(choice)}</button>`).join('')}</div><p class="mini-feedback" id="mini-feedback" aria-live="polite"></p></section>
          ${lesson.agentPrompt ? `<section class="agent-prompt reveal"><header><div><span>AGENT_PROMPT.md</span><small>READY TO COPY</small></div><button type="button" id="copy-agent-prompt">复制提示词</button></header><blockquote>${escapeHTML(lesson.agentPrompt)}</blockquote><p id="copy-status" aria-live="polite"></p></section>` : ''}
          ${lesson.references?.length ? `<section class="content-section references-section reveal"><p class="section-no">07 / REFERENCES</p><h2>延伸阅读 · 权威出处</h2><div>${lesson.references.map((reference) => `<a href="${escapeHTML(reference.url)}" target="_blank" rel="noreferrer"><span>↗</span><strong>${escapeHTML(reference.title)}</strong><small>${escapeHTML(reference.publisher)}</small></a>`).join('')}</div></section>` : ''}
          <section id="notes" class="content-section note-section reveal"><p class="section-no">08 / LOCAL NOTES</p><h2>我的调试笔记</h2><p>写下自己的理解、例子或待验证问题。内容只保存在当前浏览器。</p><textarea id="lesson-note" rows="6" placeholder="我真正理解的是……\n下次要在这个场景里测试……">${escapeHTML(state.notes[id] || '')}</textarea><div><span id="note-status">${state.notes[id] ? '已有本地记录' : '尚未记录'}</span><button class="secondary-action" id="save-note" type="button">SAVE NOTE</button></div></section>
        </div>
      </div>

      <section class="lesson-finish reveal">
        <div><span>MODULE STATUS</span><h2>${isCompleted(id) ? '这个模块已经通过。' : '完成实验后，更新模块状态。'}</h2><p>完成状态会影响控制台进度和下一项推荐。</p></div>
        <button class="primary-action ${isCompleted(id) ? 'is-complete' : ''}" id="complete-lesson" type="button">${isCompleted(id) ? '✓ 已完成 · 点击撤销' : '标记为已学完 →'}</button>
      </section>

      <section class="related-section reveal"><div class="section-heading compact"><div><p class="chapter-label">NEXT MODULES</p><h2>继续调试相关概念</h2></div></div><div class="lesson-grid">${related.map(lessonCard).join('')}</div></section>
    </article>`;

  const tocLinks = [...document.querySelectorAll('.lesson-toc [data-scroll-target]')];
  const setActiveTocLink = (targetId) => {
    tocLinks.forEach((link) => {
      const isActive = link.dataset.scrollTarget === targetId;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  tocLinks.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.getElementById(link.dataset.scrollTarget);
    if (!target) return;
    setActiveTocLink(target.id);
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }));
  sectionObserver?.disconnect();
  if ('IntersectionObserver' in window) {
    sectionObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting);
      if (visibleSection) setActiveTocLink(visibleSection.target.id);
    }, { rootMargin: '-96px 0px -64% 0px', threshold: 0 });
    tocLinks.forEach((link) => {
      const section = document.getElementById(link.dataset.scrollTarget);
      if (section) sectionObserver.observe(section);
    });
  }

  document.querySelector('#save-note').addEventListener('click', () => {
    state.notes[id] = document.querySelector('#lesson-note').value.trim();
    saveState();
    document.querySelector('#note-status').textContent = state.notes[id] ? '刚刚已保存到本地' : '空笔记未保留';
    showToast('笔记已安全留在本地');
  });
  document.querySelector('#complete-lesson').addEventListener('click', () => { toggleCompleted(id); renderLesson(id); });
  if (lesson.scenario) {
    let activeStep = 0;
    let isPlaying = false;
    const runtime = document.querySelector('.runtime-window');
    const playButton = document.querySelector('#scenario-play');
    const panelPositions = { browser: '12%', api: '39%', backend: '66%', database: '91%' };
    const restartMotion = () => {
      runtime.classList.remove('is-step-changing');
      requestAnimationFrame(() => runtime.classList.add('is-step-changing'));
    };
    const stopPlayback = () => {
      clearInterval(scenarioPlaybackTimer);
      isPlaying = false;
      playButton.textContent = '▶ 自动演示';
      playButton.setAttribute('aria-pressed', 'false');
    };
    const updateScenario = () => {
      const step = lesson.scenario.steps[activeStep];
      document.querySelector('#scenario-count').textContent = `${String(activeStep + 1).padStart(2, '0')} / ${String(lesson.scenario.steps.length).padStart(2, '0')}`;
      document.querySelector('#scenario-owner').textContent = `${step.owner}${step.focus ? ' · 本页重点' : ''}`;
      document.querySelector('#scenario-title').textContent = step.title;
      document.querySelector('#scenario-description').textContent = step.description;
      document.querySelector('#scenario-prev').disabled = activeStep === 0;
      document.querySelector('#scenario-next').disabled = activeStep === lesson.scenario.steps.length - 1;
      document.querySelectorAll('[data-scenario-step]').forEach((button, index) => button.classList.toggle('is-active', index === activeStep));
      document.querySelectorAll('[data-runtime-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.runtimePanel === step.panel));
      runtime.dataset.step = String(activeStep + 1);
      runtime.dataset.activePanel = step.panel;
      runtime.style.setProperty('--flow-x', panelPositions[step.panel]);
      restartMotion();
    };
    document.querySelectorAll('[data-motion-mode]').forEach((button) => button.addEventListener('click', () => {
      state.motionMode = button.dataset.motionMode;
      runtime.dataset.motion = state.motionMode;
      document.querySelectorAll('[data-motion-mode]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      saveState();
      restartMotion();
    }));
    document.querySelectorAll('[data-scenario-step]').forEach((button) => button.addEventListener('click', () => { stopPlayback(); activeStep = Number(button.dataset.scenarioStep); updateScenario(); }));
    document.querySelector('#scenario-prev').addEventListener('click', () => { stopPlayback(); activeStep = Math.max(activeStep - 1, 0); updateScenario(); });
    document.querySelector('#scenario-next').addEventListener('click', () => { stopPlayback(); activeStep = Math.min(activeStep + 1, lesson.scenario.steps.length - 1); updateScenario(); });
    playButton.addEventListener('click', () => {
      if (isPlaying) return stopPlayback();
      if (activeStep === lesson.scenario.steps.length - 1) activeStep = 0;
      isPlaying = true;
      playButton.textContent = 'Ⅱ 暂停演示';
      playButton.setAttribute('aria-pressed', 'true');
      updateScenario();
      scenarioPlaybackTimer = setInterval(() => {
        if (activeStep >= lesson.scenario.steps.length - 1) return stopPlayback();
        activeStep += 1;
        updateScenario();
      }, 1400);
    });
    updateScenario();
  }
  document.querySelector('#copy-agent-prompt')?.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(lesson.agentPrompt);
      status.textContent = '已复制，可以直接发送给 AI Agent。';
      showToast('提示词已复制');
    } catch {
      status.textContent = '复制失败，请手动选中上方文字。';
    }
  });
  document.querySelectorAll('[data-mini-answer]').forEach((button) => button.addEventListener('click', () => {
    const answer = Number(button.dataset.miniAnswer);
    document.querySelectorAll('[data-mini-answer]').forEach((item) => {
      item.disabled = true;
      item.classList.toggle('is-correct', Number(item.dataset.miniAnswer) === lesson.question.answer);
      item.classList.toggle('is-wrong', item === button && answer !== lesson.question.answer);
    });
    const feedback = document.querySelector('#mini-feedback');
    feedback.innerHTML = `<strong>${answer === lesson.question.answer ? '判断准确。' : '再校准一下。'}</strong> ${escapeHTML(lesson.question.explanation)}`;
  }));
}

function renderPractice() {
  const lesson = lessons[practice.index % lessons.length];
  const answered = practice.selected !== null;
  main.innerHTML = `
    <section class="practice-page page-view">
      <header class="practice-header reveal"><div><p class="chapter-label"><span>TEST RUNNER</span> / DAILY SPEC</p><h1>先做判断，<br />再查看测试结果。</h1></div><div class="practice-stats"><span>TEST RESULTS</span><strong>${state.practiceCorrect}<small> / ${state.practiceAnswered}</small></strong><p>passed / total</p></div></header>
      <div class="practice-board reveal" style="--delay:80ms">
        <div class="practice-meta"><span>题目 ${String((practice.index % lessons.length) + 1).padStart(2, '0')}</span><span>${escapeHTML(lesson.category)} · ${escapeHTML(lesson.title)}</span></div>
        <h2>${escapeHTML(lesson.question.prompt)}</h2>
        <div class="practice-choices">
          ${lesson.question.choices.map((choice, index) => `<button type="button" data-practice-answer="${index}" ${answered ? 'disabled' : ''} class="${answered && index === lesson.question.answer ? 'is-correct' : ''} ${answered && index === practice.selected && index !== lesson.question.answer ? 'is-wrong' : ''}"><span>${String.fromCharCode(65 + index)}</span><p>${escapeHTML(choice)}</p><b>${answered && index === lesson.question.answer ? '正确方向' : answered && index === practice.selected ? '需要校准' : '选择'}</b></button>`).join('')}
        </div>
        ${answered ? `<div class="answer-explanation"><span>${practice.selected === lesson.question.answer ? '✓' : '!'}</span><div><strong>${practice.selected === lesson.question.answer ? 'TEST PASSED' : 'TEST FAILED'}</strong><p>${escapeHTML(lesson.question.explanation)}</p></div><button type="button" id="next-question">RUN NEXT →</button></div>` : '<p class="practice-hint">选择你认为最准确的一项。运行后会显示断言解释，不只告诉你对错。</p>'}
      </div>
      <aside class="practice-footer-note reveal"><span>TEST PRINCIPLE</span><p>好的练习不是考生僻名词，而是训练你在真实任务里做出更清晰的判断。</p><a href="#/lesson/${lesson.id}">OPEN MODULE →</a></aside>
    </section>`;

  document.querySelectorAll('[data-practice-answer]').forEach((button) => button.addEventListener('click', () => {
    practice.selected = Number(button.dataset.practiceAnswer);
    state.practiceAnswered += 1;
    if (practice.selected === lesson.question.answer) state.practiceCorrect += 1;
    saveState();
    renderPractice();
  }));
  document.querySelector('#next-question')?.addEventListener('click', () => {
    practice = { index: practice.index + 1, selected: null };
    renderPractice();
  });
}

function renderFavorites() {
  const favorites = lessons.filter((lesson) => state.favorites.includes(lesson.id));
  main.innerHTML = `
    <section class="favorites-page page-view">
      <header class="page-header reveal"><p class="chapter-label"><span>SAVED</span> / PINNED MODULES</p><div><h1>把真正有用的知识，固定在工作区。</h1><p>保存不是囤积。只留下正在影响当前项目的模块，定期回看并转化成实际操作。</p></div></header>
      <div class="favorites-summary reveal"><span class="stamp">LOCAL INDEX</span><div><strong>${favorites.length}</strong><p>个已保存模块</p></div><p>${favorites.length ? '这些条目保存在当前浏览器，可随时从详情页移除。' : '保存列表为空。浏览知识索引时，点击菱形按钮即可加入。'}</p></div>
      ${favorites.length ? `<div class="lesson-grid">${favorites.map(lessonCard).join('')}</div>` : `<div class="empty-state"><span>◇</span><h2>没有保存的模块</h2><p>先去知识索引寻找与你当前问题最相关的内容。</p><a href="#/library">OPEN KNOWLEDGE BASE →</a></div>`}
    </section>`;
}

function renderNotFound() {
  main.innerHTML = `<section class="not-found page-view"><span>404</span><h1>这枚坐标不在海图上</h1><p>地址可能已经改变，或者这条知识航线尚未开放。</p><a class="primary-action" href="#/home">返回今日甲板 →</a></section>`;
}

function updateActiveNav(route) {
  document.querySelectorAll('[data-route]').forEach((link) => link.classList.toggle('is-active', link.dataset.route === route));
}

function route() {
  clearInterval(scenarioPlaybackTimer);
  const raw = location.hash.replace(/^#\/?/, '') || 'home';
  const [path, query = ''] = raw.split('?');
  const [routeName, id] = path.split('/');
  updateActiveNav(routeName === 'lesson' ? 'library' : routeName);
  if (routeName === 'home') renderHome();
  else if (routeName === 'library') renderLibrary(new URLSearchParams(query));
  else if (routeName === 'lesson') renderLesson(id);
  else if (routeName === 'practice') renderPractice();
  else if (routeName === 'favorites') renderFavorites();
  else renderNotFound();
  window.scrollTo({ top: 0, behavior: 'instant' });
  main.focus({ preventScroll: true });
}

function updateGlobalSearch() {
  const results = searchLessons(lessons, globalSearch.value).slice(0, 8);
  searchResults.innerHTML = results.length
    ? results.map((lesson) => `<a href="#/lesson/${lesson.id}" data-search-result><span>${categoryOf(lesson.category).code}</span><div><strong>${escapeHTML(lesson.title)}</strong><small>${escapeHTML(lesson.english)} · ${escapeHTML(lesson.excerpt)}</small></div><b>↗</b></a>`).join('')
    : `<div class="search-empty"><strong>没有找到对应坐标</strong><p>试试更短的词，例如“状态”“测试”或“用户”。</p></div>`;
  document.querySelectorAll('[data-search-result]').forEach((link) => link.addEventListener('click', () => searchDialog.close()));
}

document.addEventListener('click', (event) => {
  const favorite = event.target.closest('[data-favorite]');
  if (!favorite) return;
  event.preventDefault();
  toggleFavorite(favorite.dataset.favorite);
  const routeName = location.hash.includes('/favorites') ? 'favorites' : location.hash.includes('/lesson/') ? 'lesson' : location.hash.includes('/library') ? 'library' : 'home';
  if (routeName === 'favorites') renderFavorites();
  if (routeName === 'lesson') renderLesson(favorite.dataset.favorite);
  if (routeName === 'library') {
    favorite.classList.toggle('is-active', isFavorite(favorite.dataset.favorite));
    favorite.textContent = isFavorite(favorite.dataset.favorite) ? '◆' : '◇';
    favorite.setAttribute('aria-pressed', String(isFavorite(favorite.dataset.favorite)));
  }
});

document.querySelector('#search-launcher').addEventListener('click', () => {
  searchDialog.showModal();
  globalSearch.value = '';
  updateGlobalSearch();
  setTimeout(() => globalSearch.focus(), 0);
});
globalSearch.addEventListener('input', updateGlobalSearch);
themeToggles.forEach((button) => button.addEventListener('click', () => setTheme(state.theme === 'day' ? 'night' : 'day')));
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    document.querySelector('#search-launcher').click();
  }
});
window.addEventListener('hashchange', route);

document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
document.documentElement.dataset.theme = state.theme;
themeToggles.forEach((button) => {
  button.textContent = button.id === 'theme-toggle-quick'
    ? (state.theme === 'night' ? '日间' : '夜航')
    : (state.theme === 'night' ? '返回日间模式' : '切换夜航模式');
  button.setAttribute('aria-pressed', String(state.theme === 'night'));
  button.setAttribute('aria-label', state.theme === 'night' ? '返回日间模式' : '切换夜航模式');
});
updateProgressUI();
route();
