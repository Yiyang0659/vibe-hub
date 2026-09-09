import { categories, lessons } from './features/topics/index.js';
import {
  currentFocus,
  aboutData,
  papers,
  notes,
  workItems,
  toolbox,
  library,
  initialDigests
} from './features/index.js';
import {
  compileProjectDigest,
  generateNoteDraft,
  generateToolboxDraft
} from './features/workspace/compiler.js';
import {
  calculateProgress,
  categoryProgress,
  searchLessons,
  searchAllEntities
} from './shared/lib/index.js';
import { renderHomeView, mountHomeView, unmountHomeView } from './features/home/page.js';
import { renderTopicsIndex, mountTopicsIndex } from './features/topics/topics-page.js';
import { renderArticlesIndex } from './features/notes/notes-page.js';
import { renderWorkIndex } from './features/work/work-page.js';
import { topicsWithDomain, WHY_LOOKUP } from './features/topics/index.js';
import { renderReadingIndex } from './features/reading/reading-page.js';
import { renderToolboxIndex } from './features/toolbox/toolbox-page.js';
import { renderLibraryIndex } from './features/library/page.js';
import { renderRelatedTrail } from './shared/components/related-trail.js';
import { site } from './shared/content/site.js';
import { createStore } from './shared/store/index.js';
import { normalizeRouteName, parseHash } from './app/router.js';
import { applyPageMeta, updateActiveNavigation } from './app/shell.js';

const store = createStore({
  notes,
  workItems,
  toolbox,
  initialDigests,
  onSave: updateProgressUI
});

let state = store.getState();
let practice = { index: 0, selected: null };
let toastTimer;
let captureMaterials = [];
let searchCursor = 0;

const main = document.querySelector('#main-content');
const searchDialog = document.querySelector('#search-dialog');
const globalSearch = document.querySelector('#global-search');
const searchResults = document.querySelector('#search-results');
const captureDialog = document.querySelector('#capture-dialog');
const captureContainer = document.querySelector('#capture-dialog-container');
const themeToggle = document.querySelector('#theme-toggle');
const workspaceLauncher = document.querySelector('#workspace-launcher');
const siteHeader = document.querySelector('#site-header');
const siteMenuTrigger = document.querySelector('#site-menu-trigger');
const siteMobileMenu = document.querySelector('#site-mobile-menu');
const mobileSearchLauncher = document.querySelector('#mobile-search-launcher');
const backToTop = document.querySelector('#back-to-top');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function saveState() {
  store.save();
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

// 统一数据获取器 (内置 + 用户创建)
function getAllNotes() {
  return store.getAllNotes();
}

function getAllWork() {
  return store.getAllWork();
}

function getAllToolbox() {
  return store.getAllToolbox();
}

function getAllDigests() {
  return store.getAllDigests();
}

function topicById(id) {
  return lessons.find(l => l.id === id);
}

function noteById(id) {
  return getAllNotes().find(n => n.id === id);
}

function paperById(id) {
  return papers.find(p => p.id === id);
}

function workById(id) {
  return getAllWork().find(w => w.id === id);
}

function toolById(id) {
  return getAllToolbox().find(t => t.id === id);
}

function categoryOf(name) {
  return categories.find(c => c.id === name) || categories[0];
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function setTheme(theme) {
  const validTheme = theme === 'night' ? 'night' : 'day';
  state.theme = validTheme;
  document.documentElement.dataset.theme = validTheme;
  themeColorMeta?.setAttribute('content', validTheme === 'night' ? '#10141B' : '#F7F8FA');
  if (themeToggle) {
    themeToggle.textContent = validTheme === 'night' ? '☀' : '☾';
    themeToggle.setAttribute('aria-pressed', String(validTheme === 'night'));
    themeToggle.setAttribute('aria-label', validTheme === 'night' ? '切换为日间模式' : '切换为夜航模式');
    themeToggle.title = validTheme === 'night' ? '当前：夜航模式（点击切换日间）' : '当前：日间模式（点击切换夜航）';
  }
  saveState();
}

function updateProgressUI() {
  const progress = calculateProgress(lessons.length, state.completed);
  // 新版侧栏已移除进度条；保留函数兼容旧调用与详情页进度展示。
  return progress;
}

function isFavorite(id) {
  return state.favorites.includes(id);
}

function isCompleted(id) {
  return state.completed.includes(id);
}

function toggleFavorite(id) {
  state.favorites = isFavorite(id)
    ? state.favorites.filter(item => item !== id)
    : [...state.favorites, id];
  saveState();
  showToast(isFavorite(id) ? '已固定至工作区' : '已移出保存列表');
}

function toggleCompleted(id) {
  state.completed = isCompleted(id)
    ? state.completed.filter(item => item !== id)
    : [...state.completed, id];
  saveState();
  showToast(isCompleted(id) ? '术语状态：PASSED' : '术语状态：PENDING');
}

/* ==========================================================================
   01 HOME 首页 —— V4 编辑部长流（渲染逻辑见 js/views/home.js）
   ========================================================================== */
function renderHome() {
  main.innerHTML = renderHomeView({
    lessons,
    progress: calculateProgress(lessons.length, state.completed),
    notes: getAllNotes(),
    work: getAllWork(),
    toolbox: getAllToolbox(),
    papers,
    library,
    about: aboutData
  });
  attachHomeQuickCopy();
  mountHomeView();
}

function attachHomeQuickCopy() {
  document.querySelectorAll('[data-quick-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tool = toolById(btn.dataset.quickCopy);
      if (tool && tool.promptTemplate) {
        navigator.clipboard.writeText(tool.promptTemplate).then(() => {
          showToast(`已复制 ${tool.title} 模板！`);
        });
      }
    });
  });
}

/* ==========================================================================
   02 TOPICS 术语知识体系
   ========================================================================== */
function renderTopics(params) {
  main.innerHTML = renderTopicsIndex({ topics: topicsWithDomain, params });
  mountTopicsIndex({
    topics: topicsWithDomain,
    initialDomain: params.get('domain') || 'all',
    isCompleted
  });
}

function renderTopicDetail(id) {
  const lesson = topicById(id);
  if (!lesson) return renderNotFound();
  const cat = categoryOf(lesson.category);
  state.lastViewed = id;
  saveState();

  const relatedLessons = lesson.related.map(topicById).filter(Boolean);
  const relatedNotes = getAllNotes().filter(n => (n.relatedTopics || []).includes(id));
  const relatedWork = getAllWork().filter(w => (w.relatedTopics || []).includes(id));
  const relatedTools = getAllToolbox().filter(t => (t.relatedTopics || []).includes(id));
  const trailGraph = { notes: getAllNotes(), work: getAllWork(), toolbox: getAllToolbox() };

  main.innerHTML = `
    <article class="lesson-page page-view portfolio-detail concept-detail" style="--route-color:${cat.accent}">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/notes">文章</a>
        <span>/</span>
        <a href="#/topics">概念索引</a>
        <span>/</span>
        <strong>${escapeHTML(lesson.title)}</strong>
      </nav>

      <header class="concept-hero detail-hero reveal">
        <div class="concept-hero-main">
          <p class="chapter-label"><span>CONCEPT ${String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</span> / ${escapeHTML(lesson.category)}</p>
          <h1 class="detail-title">${escapeHTML(lesson.title)}</h1>
          <p class="detail-meta">${escapeHTML(lesson.english)}${lesson.aliases?.length ? ` · AKA ${lesson.aliases.map(escapeHTML).join(' / ')}` : ''}</p>
          <p class="concept-lead">${escapeHTML(lesson.excerpt)}</p>
          <div class="tag-row concept-tags">${lesson.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div>
        </div>
        <div class="concept-hero-side">
          <dl class="concept-facts">
            <div><dt>理解成本</dt><dd>${lesson.duration} 分钟</dd></div>
            <div><dt>当前层级</dt><dd>${escapeHTML(lesson.level)}</dd></div>
            <div><dt>所属方向</dt><dd>${escapeHTML(lesson.category)}</dd></div>
          </dl>
          <button class="favorite-seal concept-pin ${isFavorite(id) ? 'is-active' : ''}" type="button" data-favorite="${id}">
            <span>${isFavorite(id) ? '已收藏' : '收藏这个概念'}</span><b>${isFavorite(id) ? '◆' : '◇'}</b>
          </button>
        </div>
      </header>

      <div class="lesson-layout concept-layout">
        <aside class="lesson-toc concept-toc reveal" aria-label="本页章节">
          <span>ON THIS PAGE</span>
          <a class="is-active" href="#/topics/${id}" data-scroll-target="sec-lookup">01 从哪里遇到它</a>
          <a href="#/topics/${id}" data-scroll-target="sec-def">02 一句话理解</a>
          <a href="#/topics/${id}" data-scroll-target="sec-why">03 为什么重要</a>
          <a href="#/topics/${id}" data-scroll-target="sec-used">04 在哪里用过</a>
          ${lesson.scenario ? `<a href="#/topics/${id}" data-scroll-target="sec-lab">05 看它如何工作</a>` : ''}
          <a href="#/topics/${id}" data-scroll-target="sec-exp">${lesson.scenario ? '06' : '05'} 真实例子</a>
          <a href="#/topics/${id}" data-scroll-target="sec-pit">${lesson.scenario ? '07' : '06'} 容易误解什么</a>
          <a href="#/topics/${id}" data-scroll-target="sec-chk">${lesson.scenario ? '08' : '07'} 下次怎么做</a>
          <a href="#/topics/${id}" data-scroll-target="sec-chk2">${lesson.scenario ? '09' : '08'} 快速校准</a>
          <a href="#/topics/${id}" data-scroll-target="sec-note">${lesson.scenario ? '10' : '09'} 留下笔记</a>
        </aside>

        <div class="lesson-content concept-content">
          <section id="sec-lookup" class="content-section concept-origin reveal">
            <p class="section-no">01 / WHY THIS CAME UP</p>
            <h2>我从哪里遇到它？</h2>
            <p>${escapeHTML(WHY_LOOKUP[id] || `我通常会在这个问题出现时回到这个概念：${lesson.userSays || lesson.why}`)}</p>
          </section>

          <section id="sec-def" class="content-section reveal">
            <p class="section-no">02 / A WORKING DEFINITION</p>
            <h2>先用一句话理解</h2>
            <p class="concept-definition-copy">${escapeHTML(lesson.definition)}</p>
            ${lesson.userSays ? `<div class="user-says"><span>它通常以这个问题出现</span><p>${escapeHTML(lesson.userSays)}</p></div>` : ''}
          </section>

          <section id="sec-why" class="content-section reveal">
            <p class="section-no">03 / WHY IT MATTERS</p>
            <h2>为什么值得理解？</h2>
            <p>${escapeHTML(lesson.why)}</p>
            <div class="key-points">
              ${lesson.points.map((pt, i) => `<div><span>0${i + 1}</span><p>${escapeHTML(pt)}</p></div>`).join('')}
            </div>
          </section>

          <section id="sec-used" class="content-section reveal">
            <p class="section-no">04 / WHERE IT BECAME USEFUL</p>
            <h2>它后来出现在哪里？</h2>
            <div class="concept-evidence-list">
              ${relatedWork.map(w => `<a href="#/work/${w.id}"><span>PROJECT</span><strong>${escapeHTML(w.title)}</strong><b>↗</b></a>`).join('')}
              ${relatedNotes.map(n => `<a href="#/notes/${n.id}"><span>THOUGHT</span><strong>${escapeHTML(n.title)}</strong><b>↗</b></a>`).join('')}
              ${relatedTools.map(t => `<a href="#/toolbox/${t.id}"><span>TOOL</span><strong>${escapeHTML(t.title)}</strong><b>↗</b></a>`).join('')}
              ${relatedLessons.slice(0, 4).map(l => `<a href="#/topics/${l.id}"><span>CONCEPT</span><strong>${escapeHTML(l.title)}</strong><b>→</b></a>`).join('')}
            </div>
          </section>

          ${lesson.scenario ? scenarioMarkup(lesson) : ''}

          <section id="sec-exp" class="content-section reveal">
            <p class="section-no">${lesson.scenario ? '06' : '05'} / A REAL EXAMPLE</p>
            <h2>放进一个真实任务里</h2>
            <div class="field-note">
              <p>${escapeHTML(lesson.example)}</p>
            </div>
          </section>

          <section id="sec-pit" class="content-section reveal">
            <p class="section-no">${lesson.scenario ? '07' : '06'} / WHAT IT IS NOT</p>
            <h2>最容易误解什么？</h2>
            <ul class="pitfall-list">
              ${lesson.pitfalls.map(p => `<li><span>×</span>${escapeHTML(p)}</li>`).join('')}
            </ul>
          </section>

          <section id="sec-chk" class="content-section reveal">
            <p class="section-no">${lesson.scenario ? '08' : '07'} / NEXT TIME</p>
            <h2>下次遇到它，我会怎么做？</h2>
            <div class="action-list">
              ${lesson.checklist.map((item, i) => `
                <label>
                  <input type="checkbox" />
                  <span>${escapeHTML(item)}</span>
                  <b>0${i + 1}</b>
                </label>
              `).join('')}
            </div>
          </section>

          <section id="sec-chk2" class="quick-check reveal">
            <span class="ink-label">${lesson.scenario ? '09' : '08'} / QUICK CHECK</span>
            <h2>${escapeHTML(lesson.question.prompt)}</h2>
            <div class="mini-choices">
              ${lesson.question.choices.map((c, i) => `
                <button type="button" data-mini-answer="${i}">
                  <span>${String.fromCharCode(65 + i)}</span>${escapeHTML(c)}
                </button>
              `).join('')}
            </div>
            <p class="mini-feedback" id="mini-feedback" aria-live="polite"></p>
          </section>

          <section id="sec-note" class="content-section note-section reveal">
            <p class="section-no">${lesson.scenario ? '10' : '09'} / LEAVE A NOTE</p>
            <h2>留下一段自己的理解</h2>
            <textarea id="lesson-note" rows="5" placeholder="写下理解、疑问或下一次验证的想法…">${escapeHTML(state.notes[id] || '')}</textarea>
            <div>
              <span id="note-status">${state.notes[id] ? '已有本地记录' : '尚未记录'}</span>
              <button class="secondary-action" id="save-note" type="button">保存这段笔记</button>
            </div>
          </section>
        </div>
      </div>

      ${renderRelatedTrail({ type: 'topic', id, title: lesson.title }, trailGraph)}

      <section class="lesson-finish reveal">
        <div>
          <span>TOPIC STATUS</span>
          <h2>${isCompleted(id) ? '这个术语已经学完。' : '学完定义、实验与检查清单后，标记一下。'}</h2>
          <p>进度只保存在本地，与你的学习节奏无关，与展示无关。</p>
        </div>
        <button class="primary-action ${isCompleted(id) ? 'is-complete' : ''}" id="complete-topic" type="button">
          ${isCompleted(id) ? '✓ 已掌握 · 点击撤销' : '标记为已掌握 →'}
        </button>
      </section>
    </article>
  `;

  // 绑定滚动 TOC
  const tocLinks = [...document.querySelectorAll('.lesson-toc [data-scroll-target]')];
  tocLinks.forEach(link => link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(link.dataset.scrollTarget);
    if (!target) return;
    tocLinks.forEach(l => l.classList.toggle('is-active', l === link));
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  document.querySelector('#complete-topic')?.addEventListener('click', () => {
    toggleCompleted(id);
    renderTopicDetail(id);
  });

  document.querySelector('#save-note')?.addEventListener('click', () => {
    const note = document.querySelector('#lesson-note').value.trim();
    if (note) state.notes[id] = note;
    else delete state.notes[id];
    saveState();
    showToast('笔记已保存');
    document.querySelector('#note-status').textContent = note ? '已有本地记录' : '尚未记录';
  });

  document.querySelectorAll('[data-mini-answer]').forEach(button => {
    button.addEventListener('click', () => {
      const selected = Number(button.dataset.miniAnswer);
      const isRight = selected === lesson.question.answer;
      document.querySelectorAll('[data-mini-answer]').forEach((item, idx) => {
        item.classList.toggle('is-correct', idx === lesson.question.answer);
        item.classList.toggle('is-wrong', idx === selected && !isRight);
      });
      const feedback = document.querySelector('#mini-feedback');
      feedback.textContent = `${isRight ? '✓ 校准正确。' : '× 需要复盘。'}${lesson.question.explanation}`;
      feedback.className = `mini-feedback ${isRight ? 'is-correct' : 'is-wrong'}`;
    });
  });
}

function scenarioMarkup(lesson) {
  if (!lesson.scenario) return '';
  const steps = lesson.scenario.steps;
  return `
    <section id="sec-lab" class="content-section scenario-section reveal">
      <p class="section-no">05 / HOW IT WORKS</p>
      <h2>${escapeHTML(lesson.scenario.title)}</h2>
      <p>${escapeHTML(lesson.scenario.description)}</p>
      <div class="runtime-window" data-motion="${escapeHTML(state.motionMode || 'trace')}" data-step="1">
        <header><div><i></i><i></i><i></i></div><code>flow-runtime.spec</code><span>RUNNING</span></header>
        <div class="runtime-canvas">
          <section class="runtime-node" data-runtime-panel="browser">
            <small>FRONTEND · CLIENT</small><strong>app.local</strong>
            <label>Input<input value="Action" readonly /></label>
          </section>
          <section class="runtime-node api-node" data-runtime-panel="api">
            <small>API / CONTRACT</small><strong>PATCH /api/resource</strong><code>{ status: 'ok' }</code>
          </section>
          <section class="runtime-node" data-runtime-panel="backend">
            <small>BACKEND / AGENT</small><strong>runtime engine</strong><ul><li>Context ready?</li><li>Rule verified?</li></ul>
          </section>
          <section class="runtime-node" data-runtime-panel="database">
            <small>STORAGE / MEMORY</small><strong>records</strong><code>#1 synced</code>
          </section>
        </div>
        <div class="runtime-readout">
          <span id="scenario-count">01 / ${String(steps.length).padStart(2, '0')}</span>
          <div>
            <small id="scenario-owner">${escapeHTML(steps[0].owner)}</small>
            <strong id="scenario-title">${escapeHTML(steps[0].title)}</strong>
            <p id="scenario-description">${escapeHTML(steps[0].description)}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ==========================================================================
   03 NOTES 笔记 / 思考 (轻量高密度 5 结构)
   ========================================================================== */
function renderNotes(filterKind = 'ALL') {
  const personalTopics = topicsWithDomain.filter((topic) => WHY_LOOKUP[topic.id]);
  main.innerHTML = renderArticlesIndex({
    notes: getAllNotes(),
    topics: personalTopics,
    papers,
    filterKind
  });
  mountArticleFilters();
}

function mountArticleFilters() {
  document.querySelectorAll('[data-article-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('is-active')) return;
      const template = document.createElement('template');
      const personalTopics = topicsWithDomain.filter((topic) => WHY_LOOKUP[topic.id]);
      template.innerHTML = renderArticlesIndex({
        notes: getAllNotes(),
        topics: personalTopics,
        papers,
        filterKind: button.dataset.articleTab
      });
      const nextBrowser = template.content.querySelector('.article-browser');
      const currentBrowser = document.querySelector('.article-browser');
      if (!nextBrowser || !currentBrowser) return;
      currentBrowser.replaceWith(nextBrowser);
      nextBrowser.animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)' }
      );
      mountArticleFilters();
    });
  });
}

function renderNoteDetail(id) {
  const note = noteById(id);
  if (!note) return renderNotFound();

  const relatedTopics = (note.relatedTopics || []).map(topicById).filter(Boolean);
  const relatedPapers = (note.relatedPapers || []).map(paperById).filter(Boolean);
  const relatedWork = (note.relatedWork || []).map(workById).filter(Boolean);

  main.innerHTML = `
    <article class="note-detail-page page-view portfolio-detail">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/notes">文章</a>
        <span>/</span>
        <span>思考</span>
        <span>/</span>
        <strong>${escapeHTML(note.title)}</strong>
      </nav>

      <header class="page-header detail-hero reveal">
        <p class="chapter-label"><span>NOTE</span> / ${escapeHTML(note.category)} · ${escapeHTML(note.date)}</p>
        <h1 class="detail-title">${escapeHTML(note.title)}</h1>
        <div class="judgment-banner detail-lead-card">
          <strong>CORE PERSPECTIVE · 核心结论</strong>
          <p>${escapeHTML(note.oneLiner)}</p>
        </div>
      </header>

      <div class="case-study-grid">
        <!-- 01 QUESTION -->
        <section class="case-study-block reveal">
          <p class="section-no">01 / THE QUESTION</p>
          <h3>我原本在想什么问题？</h3>
          <p style="font-size:15px; font-weight:600;">${escapeHTML(note.question)}</p>
        </section>

        <!-- 02 MY UNDERSTANDING -->
        <section class="case-study-block reveal">
          <p class="section-no">02 / MY UNDERSTANDING</p>
          <h3>我现在怎么理解？</h3>
          <p>${escapeHTML(note.myUnderstanding)}</p>
        </section>

        <!-- 03 EXAMPLE -->
        <section class="case-study-block reveal">
          <p class="section-no">03 / REAL-WORLD EXAMPLE</p>
          <h3>用一个真实例子说明</h3>
          <div class="field-note">
            <p>${escapeHTML(note.example)}</p>
          </div>
        </section>

        <!-- 04 MY TAKE -->
        <section class="case-study-block reveal">
          <p class="section-no">04 / MY TAKE & CONCLUSION</p>
          <h3>我最后的判断是什么？</h3>
          <p style="font-weight:600; color:var(--pine);">${escapeHTML(note.myTake)}</p>
        </section>

          <!-- 05 UNRESOLVED · 我还没想清楚什么 -->
          <section class="case-study-block reveal">
            <p class="section-no">05 / UNRESOLVED</p>
            <h3>我还没想清楚什么？</h3>
            <p style="color: var(--ink-soft);">${escapeHTML(note.unresolved || '还没有记录——这说明这个问题我还没真正想透。')}</p>
          </section>
      </div>

      <!-- 05 RELATED -->
      ${renderRelatedTrail(
        { type: 'note', id: note.id, title: note.title },
        { notes: getAllNotes(), work: getAllWork(), toolbox: getAllToolbox() }
      )}

      <footer class="lesson-finish reveal" style="margin-top:35px;">
        <div>
          <span>RELATED CONNECTIONS</span>
          <h2>相关术语、论文与项目实践</h2>
          <div class="knowledge-graph-box" style="margin-top:10px;">
            ${relatedTopics.map(t => `<a href="#/topics/${t.id}" class="rel-chip topic">✦ ${escapeHTML(t.title)}</a>`).join('')}
            ${relatedPapers.map(p => `<a href="#/papers/${p.id}" class="rel-chip paper">📄 ${escapeHTML(p.title)}</a>`).join('')}
            ${relatedWork.map(w => `<a href="#/work/${w.id}" class="rel-chip work">🚀 ${escapeHTML(w.title)}</a>`).join('')}
          </div>
        </div>
      </footer>
    </article>
  `;
}

/* ==========================================================================
   04 PAPERS 论文拆解 (产品与实践视角)
   ========================================================================== */
function renderPapers(filterKind = 'ALL') {
  main.innerHTML = renderReadingIndex({ items: papers, filterKind });
  document.querySelectorAll('[data-reading-tab]').forEach(btn => {
    btn.addEventListener('click', () => renderPapers(btn.dataset.readingTab));
  });
}

function renderPaperDetail(id) {
  const paper = paperById(id);
  if (!paper) return renderNotFound();

  const relatedTopics = (paper.relatedTopics || []).map(topicById).filter(Boolean);

  main.innerHTML = `
    <article class="paper-detail-page page-view portfolio-detail">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/notes">文章</a>
        <span>/</span>
        <span>阅读</span>
        <span>/</span>
        <strong>${escapeHTML(paper.title)}</strong>
      </nav>

      <header class="page-header detail-hero reveal">
        <p class="chapter-label"><span>PAPER DECONSTRUCTION</span> / ${escapeHTML(paper.domain)} · ${paper.year}</p>
        <h1 class="detail-title">${escapeHTML(paper.title)}</h1>
        <p class="detail-meta">${escapeHTML(paper.chineseTitle)} · <i>${escapeHTML(paper.authors)}</i></p>

        <div class="judgment-banner detail-lead-card">
          <strong>ONE-LINER · 一句话理解</strong>
          <p>${escapeHTML(paper.oneLiner)}</p>
        </div>
      </header>

      <div class="case-study-grid">
        <!-- 01 PROBLEM -->
        <section class="case-study-block reveal">
          <p class="section-no">01 / THE PROBLEM</p>
          <h3>它试图解决什么问题？</h3>
          <p>${escapeHTML(paper.problem)}</p>
        </section>

        <!-- 02 CORE IDEA -->
        <section class="case-study-block reveal">
          <p class="section-no">02 / CORE INNOVATION</p>
          <h3>核心创新是什么？</h3>
          <p>${escapeHTML(paper.coreIdea)}</p>
        </section>

        <!-- 03 HOW IT WORKS -->
        <section class="case-study-block reveal">
          <p class="section-no">03 / MECHANISM</p>
          <h3>怎么实现？核心机制</h3>
          <p>${escapeHTML(paper.howItWorks)}</p>
        </section>

        <!-- 04 WHY IT MATTERS -->
        <section class="case-study-block reveal">
          <p class="section-no">04 / SIGNIFICANCE</p>
          <h3>为什么重要？</h3>
          <p>${escapeHTML(paper.whyItMatters)}</p>
        </section>

        <!-- 05 MY TAKE (Top 3) -->
        <section class="case-study-block reveal">
          <p class="section-no">05 / MY TAKE</p>
          <h3>我认为最重要的 3 件事</h3>
          <ul>
            ${paper.myTake.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
          </ul>
        </section>

        <!-- 06 PRODUCT VIEW -->
        <section class="case-study-block reveal">
          <p class="section-no">06 / PRODUCT & PRACTICE IMPLICATIONS</p>
          <h3>对 AI 产品与实际应用有什么启发？</h3>
          <ul>
            ${paper.productView.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
          </ul>
        </section>
      </div>

      <footer class="lesson-finish reveal" style="margin-top:35px;">
        <div>
          <span>RELATED TOPICS & PAPERS</span>
          <h2>相关知识点与原文链接</h2>
          <div class="knowledge-graph-box" style="margin-top:10px;">
            ${relatedTopics.map(t => `<a href="#/topics/${t.id}" class="rel-chip topic">✦ ${escapeHTML(t.title)}</a>`).join('')}
            ${paper.sourceUrl ? `<a href="${paper.sourceUrl}" target="_blank" rel="noreferrer" class="rel-chip paper">↗ 原文论文链接</a>` : ''}
          </div>
        </div>
      </footer>
    </article>
  `;
}

/* ==========================================================================
   05 WORK 项目 / 原型 / 实验 (Projects, Prototypes, Experiments)
   ========================================================================== */
function renderWork(filterKind = 'ALL') {
  main.innerHTML = renderWorkIndex({ work: getAllWork(), filterKind });
  mountWorkFilters();
}

function mountWorkFilters() {
  document.querySelectorAll('[data-work-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      const template = document.createElement('template');
      template.innerHTML = renderWorkIndex({ work: getAllWork(), filterKind: btn.dataset.workTab });
      const nextBrowser = template.content.querySelector('.v-work-browser');
      const currentBrowser = document.querySelector('.v-work-browser');
      if (!nextBrowser || !currentBrowser) return;
      currentBrowser.replaceWith(nextBrowser);
      nextBrowser.animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)' }
      );
      mountWorkFilters();
    });
  });
}

function renderWorkDetail(id) {
  const work = workById(id);
  if (!work) return renderNotFound();

  const relatedTopics = (work.relatedTopics || []).map(topicById).filter(Boolean);
  const relatedNotes = (work.relatedNotes || []).map(noteById).filter(Boolean);

  main.innerHTML = `
    <article class="work-detail-page page-view portfolio-detail">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/work">05 项目与实验</a>
        <span>/</span>
        <strong>${escapeHTML(work.title)}</strong>
      </nav>

      <header class="page-header detail-hero detail-hero--work reveal">
        <div class="detail-hero-copy">
          <p class="chapter-label"><span>${work.kindLabel}</span> / ${escapeHTML(work.domain)}</p>
          <h1 class="detail-title">${escapeHTML(work.title)}</h1>
          <p class="detail-meta">${escapeHTML(work.english || '')}</p>
          <p class="detail-summary">${escapeHTML(work.summary)}</p>
        </div>
        <dl class="detail-facts">
          <div><dt>状态</dt><dd>${escapeHTML(work.statusLabel)}</dd></div>
          <div><dt>时间</dt><dd>${escapeHTML(work.time)}</dd></div>
          <div><dt>职责</dt><dd>${escapeHTML(work.role || '独立完成')}</dd></div>
        </dl>
      </header>

      ${work.highlights?.length ? `
        <dl class="project-proof-strip reveal" aria-label="项目关键成果">
          ${work.highlights.map((item) => `
            <div><dt>${escapeHTML(item.value)}</dt><dd>${escapeHTML(item.label)}</dd></div>
          `).join('')}
        </dl>
      ` : ''}

      ${work.kind === 'PROJECT' ? `
        <section class="project-brief reveal" aria-labelledby="project-brief-title">
          <header>
            <p>READ THIS FIRST</p>
            <h2 id="project-brief-title">30 秒看懂这个项目</h2>
          </header>
          <div>
            <article><span>问题</span><p>${escapeHTML(work.problem)}</p></article>
            <article><span>关键判断</span><p>${escapeHTML(work.keyDecisions?.[0] || work.solution)}</p></article>
            <article><span>结果</span><p>${escapeHTML(work.result)}</p></article>
          </div>
        </section>
      ` : ''}

      ${work.screenshot ? `
        <figure class="detail-cover reveal">
          <img src="${escapeHTML(work.screenshot)}" alt="${escapeHTML(work.title)}界面截图" loading="eager">
        </figure>
      ` : ''}

      ${work.kind === 'PROJECT' ? `
        <!-- 完整 Project 结构 -->
        <div class="case-study-grid">
          <section class="case-study-block reveal">
            <p class="section-no">01 / THE PROBLEM</p>
            <h3>解决什么问题？</h3>
            <p>${escapeHTML(work.problem)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">02 / MY ROLE</p>
            <h3>我的职责</h3>
            <p style="font-weight:600;">${escapeHTML(work.role)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">03 / SOLUTION</p>
            <h3>整体方案与架构</h3>
            <p>${escapeHTML(work.solution)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">04 / KEY DECISIONS</p>
            <h3>关键设计决策</h3>
            <ul>
              ${(work.keyDecisions || []).map(d => `<li>${escapeHTML(d)}</li>`).join('')}
            </ul>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">05 / HARDEST CHALLENGE</p>
            <h3>最难的问题与攻坚</h3>
            <p>${escapeHTML(work.challenge)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">06 / RESULT</p>
            <h3>最后做到了什么？成果与收益</h3>
            <p style="font-weight:600; color:var(--pine);">${escapeHTML(work.result)}</p>
          </section>

          <div class="judgment-banner reveal">
            <strong>07 / WHAT I LEARNED · 获得的认识</strong>
            <p>${escapeHTML(work.whatILearned)}</p>
          </div>
        </div>
      ` : work.kind === 'EXPERIMENT' ? `
        <!-- Experiment 实验结构 (Question -> Setup -> Result -> Insight) -->
        <div class="case-study-grid">
          <section class="case-study-block reveal">
            <p class="section-no">01 / QUESTION</p>
            <h3>要验证什么？</h3>
            <p style="font-size:15px; font-weight:600;">${escapeHTML(work.problem)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">02 / SETUP</p>
            <h3>怎么测？实验设计</h3>
            <p>${escapeHTML(work.solution)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">03 / RESULT</p>
            <h3>结果怎么样？数据与发现</h3>
            <p style="font-weight:600; color:var(--pine);">${escapeHTML(work.result)}</p>
          </section>

          <div class="judgment-banner reveal">
            <strong>04 / INSIGHT · 说明了什么</strong>
            <p>${escapeHTML(work.whatILearned)}</p>
          </div>
        </div>
      ` : `
        <!-- Prototype 原型结构 -->
        <div class="case-study-grid">
          <section class="case-study-block reveal">
            <p class="section-no">01 / GOAL</p>
            <h3>验证目标</h3>
            <p>${escapeHTML(work.problem)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">02 / ARCHITECTURE</p>
            <h3>原型设计与实现</h3>
            <p>${escapeHTML(work.solution)}</p>
          </section>

          <section class="case-study-block reveal">
            <p class="section-no">03 / RESULT</p>
            <h3>验证结论</h3>
            <p style="font-weight:600; color:var(--pine);">${escapeHTML(work.result)}</p>
          </section>

          <div class="judgment-banner reveal">
            <strong>04 / TAKEAWAYS · 经验沉淀</strong>
            <p>${escapeHTML(work.whatILearned)}</p>
          </div>
        </div>
      `}

      ${renderRelatedTrail(
        { type: 'work', id: work.id, title: work.title, relatedTools: work.relatedTools },
        { notes: getAllNotes(), work: getAllWork(), toolbox: getAllToolbox() }
      )}

      <footer class="lesson-finish reveal" style="margin-top:35px;">
        <div>
          <span>RELATED CONNECTIONS</span>
          <h2>关联术语与相关思考</h2>
          <div class="knowledge-graph-box" style="margin-top:10px;">
            ${relatedTopics.map(t => `<a href="#/topics/${t.id}" class="rel-chip topic">✦ ${escapeHTML(t.title)}</a>`).join('')}
            ${relatedNotes.map(n => `<a href="#/notes/${n.id}" class="rel-chip note">📝 ${escapeHTML(n.title)}</a>`).join('')}
          </div>
        </div>
      </footer>
    </article>
  `;
}

/* ==========================================================================
   06 TOOLBOX 工具箱 (Prompt / Skill / Workflow / Checklist / Template)
   ========================================================================== */
function renderToolbox() {
  main.innerHTML = renderToolboxIndex({ tools: getAllToolbox() });
  attachHomeQuickCopy();
}

function renderToolboxDetail(id) {
  const tool = toolById(id);
  if (!tool) return renderNotFound();

  main.innerHTML = `
    <article class="toolbox-detail-page page-view portfolio-detail">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/toolbox">06 工具箱</a>
        <span>/</span>
        <strong>${escapeHTML(tool.title)}</strong>
      </nav>

      <header class="page-header detail-hero reveal">
        <p class="chapter-label"><span>${tool.typeLabel}</span> / ${escapeHTML(tool.category)}</p>
        <h1 class="detail-title">${escapeHTML(tool.title)}</h1>
        <p class="detail-summary">${escapeHTML(tool.subtitle || '')}</p>
      </header>

      <div class="case-study-grid">
        <!-- 01 解决什么问题 -->
        <section class="case-study-block reveal">
          <p class="section-no">01 / PURPOSE</p>
          <h3>解决什么问题？</h3>
          <p>${escapeHTML(tool.problemSolved)}</p>
        </section>

        <!-- 02 什么时候使用 -->
        <section class="case-study-block reveal">
          <p class="section-no">02 / WHEN TO USE</p>
          <h3>什么时候使用？</h3>
          <p>${escapeHTML(tool.whenToUse)}</p>
        </section>

        <!-- 03 需要什么输入 -->
        <section class="case-study-block reveal">
          <p class="section-no">03 / REQUIRED INPUTS</p>
          <h3>需要什么输入材料？</h3>
          <ul>
            ${(tool.requiredInputs || []).map(item => `<li>${escapeHTML(item)}</li>`).join('')}
          </ul>
        </section>

        <!-- 04 WORKFLOW 步骤 -->
        ${tool.steps && tool.steps.length ? `
          <section class="case-study-block reveal">
            <p class="section-no">04 / WORKFLOW STEPS</p>
            <h3>操作流程</h3>
            <div class="playbook-steps">
              ${tool.steps.map(s => `
                <div class="playbook-step-card">
                  <h4>Step 0${s.step}：${escapeHTML(s.title)}</h4>
                  <p>${escapeHTML(s.detail)}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- 05 CHECKLIST -->
        ${tool.checklist && tool.checklist.length ? `
          <section class="case-study-block reveal">
            <p class="section-no">05 / CHECKLIST</p>
            <h3>Checklist 检查清单</h3>
            <div class="action-list">
              ${tool.checklist.map((item, idx) => `
                <label>
                  <input type="checkbox" data-tool-check="${tool.id}:${idx}" ${(state.toolChecklist[tool.id] || []).includes(idx) ? 'checked' : ''} />
                  <span>${escapeHTML(item)}</span>
                  <b>0${idx + 1}</b>
                </label>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- 06 PROMPT / TEMPLATE (带一键复制) -->
        ${tool.promptTemplate ? `
          <section class="reveal">
            <div class="prompt-template-container">
              <div class="prompt-template-header">
                <span>PROMPT / CODE TEMPLATE</span>
                <button type="button" class="btn-copy-template" id="btn-copy-full-template">一键复制模板</button>
              </div>
              <div class="prompt-template-content" id="full-template-text">${escapeHTML(tool.promptTemplate)}</div>
            </div>
          </section>
        ` : ''}

        <!-- 07 完整案例 -->
        <section class="case-study-block reveal">
          <p class="section-no">07 / EXAMPLE</p>
          <h3>完整应用案例</h3>
          <p>${escapeHTML(tool.example)}</p>
        </section>

        <!-- 08 避坑与局限 -->
        <section class="case-study-block reveal">
          <p class="section-no">08 / LIMITATIONS</p>
          <h3>注意事项与局限</h3>
          <ul class="pitfall-list">
            ${(tool.limitations || []).map(l => `<li><span>×</span>${escapeHTML(l)}</li>`).join('')}
          </ul>
        </section>
      </div>
    </article>
  `;

  document.querySelector('#btn-copy-full-template')?.addEventListener('click', () => {
    const text = document.querySelector('#full-template-text')?.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      showToast('模板已复制到剪贴板！');
    });
  });

  // Checklist 勾选状态持久化（localStorage）
  document.querySelectorAll('[data-tool-check]').forEach(box => {
    box.addEventListener('change', () => {
      const [toolId, idx] = box.dataset.toolCheck.split(':');
      const done = new Set(state.toolChecklist[toolId] || []);
      if (box.checked) done.add(Number(idx));
      else done.delete(Number(idx));
      state.toolChecklist[toolId] = [...done];
      saveState();
    });
  });
}

/* ==========================================================================
   07 LIBRARY 精选资源库 (Articles, Websites, GitHub, Tools)
   ========================================================================== */
function renderLibrary() {
  main.innerHTML = renderLibraryIndex({ items: library });
}

function renderAbout() {
  const projects = getAllWork().filter((item) => item.kind === 'PROJECT').slice(0, 3);
  const capabilityEvidence = [
    '#/work/wepictool-ai-image',
    '#/work/ai-seven-dimension-eval',
    '#/work/proto-mcp-tool-client',
    '#/work/personal-knowledge-lab'
  ];

  main.innerHTML = `
    <article class="about-page page-view portfolio-index portfolio-about">
      <header class="v-page-head v-page-hero about-hero reveal">
        <div class="v-page-copy">
          <p class="c-eyebrow">ABOUT / 关于</p>
          <h1 class="v-page-title">${aboutData.name}</h1>
          <p class="v-page-sub"><strong>${aboutData.subtitle}。</strong>${aboutData.tagline}</p>
          <div class="about-hero-actions">
            <a class="c-btn c-btn--solid" href="#/work/ai-seven-dimension-eval">查看代表项目 <span>→</span></a>
            <a class="c-btn" href="#/notes">读最近的文章</a>
          </div>
        </div>
        <aside class="about-current-card">
          <div class="about-current-head"><span><i></i> CURRENTLY</span><b>2026</b></div>
          <p>${escapeHTML(aboutData.now)}</p>
          <div class="about-current-tags"><span>AI Evaluation</span><span>Agent</span><span>Product</span></div>
        </aside>
      </header>

      <dl class="about-proof-bar reveal" aria-label="内容与实践概览">
        <div><dt>${projects.length}</dt><dd>个完整项目</dd></div>
        <div><dt>${getAllNotes().length}</dt><dd>篇实践思考</dd></div>
        <div><dt>${getAllToolbox().length}</dt><dd>套复用方法</dd></div>
        <div><dt>0 → 1</dt><dd>独立设计与实现</dd></div>
      </dl>

      <div class="about-content-grid">
        <section class="about-section about-section--work reveal">
          <div class="about-section-head">
            <div><p class="section-no">01 / SELECTED WORK</p><h3>先看能证明这些判断的项目</h3></div>
            <a href="#/work">查看全部项目 →</a>
          </div>
          <div class="about-work-grid">
            ${projects.map((project, index) => `
              <a class="about-work-card ${index === 0 ? 'is-featured' : ''}" href="#/work/${project.id}">
                <p><span>0${index + 1}</span>${escapeHTML(project.domain)}</p>
                <h4>${escapeHTML(project.title)}</h4>
                <blockquote>${escapeHTML(project.problem)}</blockquote>
                <footer><small>结果</small><strong>${escapeHTML(project.result)}</strong><b>↗</b></footer>
              </a>
            `).join('')}
          </div>
        </section>

        <section class="about-section about-section--focus reveal">
          <p class="section-no">02 / WHAT I CAN DO</p>
          <h3>我更擅长处理的四类问题</h3>
          <div class="about-focus-grid">
            ${aboutData.focusAreas.map((f, index) => `
              <div class="about-focus-card">
                <span>0${index + 1}</span>
                <h4>${escapeHTML(f.title)}</h4>
                <p>${escapeHTML(f.desc)}</p>
                <a href="${capabilityEvidence[index]}">查看对应实践 →</a>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="about-section about-section--method reveal">
          <p class="section-no">03 / HOW I WORK</p>
          <h3>我通常怎样把一个想法推进下去</h3>
          <ul class="about-method-list">
            ${aboutData.labMission.map((m, index) => `<li><span>0${index + 1}</span><p>${escapeHTML(m)}</p></li>`).join('')}
          </ul>
        </section>

        <section class="about-section about-section--links reveal">
          <p class="section-no">04 / KEEP EXPLORING</p>
          <h3>如果还想继续了解</h3>
          <p class="about-links-note">这里暂时只保留真实可访问的内容入口。个人联系方式与代码仓库准备好后，再接入公开链接。</p>
          <div class="about-links-row">
            ${aboutData.links.map(l => `<a href="${l.url}">${escapeHTML(l.label)} <span>→</span></a>`).join('')}
          </div>
        </section>
      </div>
    </article>
  `;
}

function renderWorkspace() {
  const progress = calculateProgress(lessons.length, state.completed);
  const savedCount = state.favorites.length;
  const practiceAccuracy = state.practiceAnswered
    ? Math.round((state.practiceCorrect / state.practiceAnswered) * 100)
    : 0;

  main.innerHTML = `
    <article class="workspace-page page-view">
      <header class="workspace-hero reveal">
        <div>
          <p class="c-eyebrow">PERSONAL / WORKBENCH</p>
          <h1>留给日常使用的<br />几个入口。</h1>
          <p>公开页面负责展示，这里负责记录、复习和整理。所有个人状态只保存在当前浏览器。</p>
        </div>
        <aside class="workspace-local-note">
          <span><i></i> LOCAL MODE</span>
          <strong>${String(savedCount).padStart(2, '0')}</strong>
          <p>项内容已固定</p>
        </aside>
      </header>

      <section class="workspace-grid reveal" aria-label="个人工作台功能">
        <button class="workspace-card workspace-card--capture" type="button" data-open-capture>
          <span class="workspace-card-index">01 / CAPTURE</span>
          <i aria-hidden="true">＋</i>
          <h2>随手记录</h2>
          <p>先留下一个问题、判断或材料，之后再整理成文章、项目或工具。</p>
          <b>打开记录器 →</b>
        </button>
        <a class="workspace-card" href="#/saved">
          <span class="workspace-card-index">02 / SAVED</span>
          <i aria-hidden="true">◆</i>
          <h2>已固定</h2>
          <p>把近期真正会反复使用的术语、文章、项目和方法集中到一处。</p>
          <b>${savedCount} 项内容 →</b>
        </a>
        <a class="workspace-card" href="#/practice">
          <span class="workspace-card-index">03 / PRACTICE</span>
          <i aria-hidden="true">✓</i>
          <h2>快速校准</h2>
          <p>用短问题检验理解边界，不把“看过”误认为“已经掌握”。</p>
          <b>${state.practiceAnswered ? `当前正确率 ${practiceAccuracy}%` : '开始第一组练习'} →</b>
        </a>
        <a class="workspace-card" href="#/library">
          <span class="workspace-card-index">04 / LIBRARY</span>
          <i aria-hidden="true">↗</i>
          <h2>资料架</h2>
          <p>收纳值得回看的文章、网站、仓库和工具，并写下它具体好在哪里。</p>
          <b>${library.length} 条资料 →</b>
        </a>
      </section>

      <footer class="workspace-progress reveal">
        <div><span>LEARNING PROGRESS</span><strong>${progress.completed} / ${lessons.length}</strong></div>
        <div class="workspace-progress-track"><i style="width:${progress.percent}%"></i></div>
        <a href="#/topics">继续浏览术语 →</a>
      </footer>
    </article>
  `;

  document.querySelector('[data-open-capture]')?.addEventListener('click', openQuickCaptureModal);
}

/* ==========================================================================
   09 PRACTICE & SAVED 辅助工具
   ========================================================================== */
function renderPractice() {
  const current = lessons[practice.index % lessons.length];
  const cat = categoryOf(current.category);
  const answered = practice.selected !== null;
  const isCorrect = practice.selected === current.question.answer;

  main.innerHTML = `
    <section class="practice-page page-view">
      <header class="page-header reveal">
        <p class="chapter-label"><span>PRACTICE</span> / SELF CHECK</p>
        <div>
          <h1>在真实判断中，检验理解边界。</h1>
          <p>每天运行几组技术与产品测试，校准你的直觉与边界认知。</p>
        </div>
      </header>

      <div class="practice-board reveal" style="--route-color:${cat.accent}">
        <div class="practice-stats">
          <span>PROGRESS</span><strong>${String((practice.index % lessons.length) + 1).padStart(2, '0')} / ${String(lessons.length).padStart(2, '0')}</strong>
          <span>ACCURACY</span><strong>${state.practiceAnswered ? Math.round((state.practiceCorrect / state.practiceAnswered) * 100) : 0}%</strong>
        </div>
        <div class="practice-question">
          <p class="eyebrow">${cat.code} · ${escapeHTML(current.category)} · ${escapeHTML(current.title)}</p>
          <h2>${escapeHTML(current.question.prompt)}</h2>
          <div class="practice-choices">
            ${current.question.choices.map((choice, index) => `
              <button type="button" data-practice-choice="${index}" class="${answered ? (index === current.question.answer ? 'is-correct' : index === practice.selected ? 'is-wrong' : '') : ''}" ${answered ? 'disabled' : ''}>
                <span>${String.fromCharCode(65 + index)}</span>
                <p>${escapeHTML(choice)}</p>
              </button>
            `).join('')}
          </div>
          ${answered ? `
            <div class="answer-explanation reveal">
              <span>${isCorrect ? '✓ 校准通过' : '× 需要复盘'}</span>
              <p>${escapeHTML(current.question.explanation)}</p>
              <button class="primary-action" id="next-question" type="button">NEXT QUESTION →</button>
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll('[data-practice-choice]').forEach(button => {
    button.addEventListener('click', () => {
      practice.selected = Number(button.dataset.practiceChoice);
      state.practiceAnswered += 1;
      if (practice.selected === current.question.answer) state.practiceCorrect += 1;
      saveState();
      renderPractice();
    });
  });

  document.querySelector('#next-question')?.addEventListener('click', () => {
    practice = { index: practice.index + 1, selected: null };
    renderPractice();
  });
}

function resolveFavorite(id) {
  const topic = topicById(id);
  if (topic) return { id, type: 'TOPICS', label: '术语', title: topic.title, desc: topic.excerpt, href: `#/topics/${topic.id}` };
  const note = noteById(id);
  if (note) return { id, type: 'NOTES', label: '笔记', title: note.title, desc: note.oneLiner, href: `#/notes/${note.id}` };
  const work = workById(id);
  if (work) return { id, type: 'WORK', label: '实践', title: work.title, desc: work.summary, href: `#/work/${work.id}` };
  const tool = toolById(id);
  if (tool) return { id, type: 'TOOLS', label: '工具', title: tool.title, desc: tool.problemSolved, href: `#/toolbox/${tool.id}` };
  const paper = paperById(id);
  if (paper) return { id, type: 'READING', label: '阅读', title: paper.title, desc: paper.oneLiner, href: `#/papers/${paper.id}` };
  return null;
}

function renderSaved() {
  const resolved = state.favorites.map(resolveFavorite).filter(Boolean);
  const groupOrder = ['TOPICS', 'NOTES', 'READING', 'WORK', 'TOOLS'];
  const groups = groupOrder.filter((g) => resolved.some((r) => r.type === g));

  const groupsHtml = groups.map((g) => {
    const items = resolved.filter((r) => r.type === g);
    return `
      <div class="v-domain-group">
        <h3 class="c-timeline-year">${g} <span>${items.length}</span></h3>
        <div class="v-rows">
          ${items.map((r) => `
            <div class="c-index-row">
              <div class="row-main">
                <h3 class="row-title"><a href="${r.href}">${escapeHTML(r.title)}</a></h3>
                ${r.desc ? `<p class="row-desc">${escapeHTML(r.desc)}</p>` : ''}
              </div>
              <span class="row-aside">
                <span class="c-meta">${r.label}</span>
                <button type="button" class="favorite-button is-active" data-favorite="${r.id}" aria-label="取消固定 ${escapeHTML(r.title)}">◆</button>
              </span>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');

  main.innerHTML = `
    <section class="favorites-page page-view">
      <header class="v-section-head v-page-head">
        <div>
          <p class="c-eyebrow">SAVED</p>
          <h1 class="v-page-title">固定下来，反复使用的内容。</h1>
          <p class="v-page-sub">只留正在影响当前项目、或近期需要重点复习的条目——按类型分组，保存在本地。</p>
        </div>
      </header>

      ${resolved.length ? groupsHtml : `
        <div class="empty-state">
          <span>◇</span>
          <h2>还没有固定任何条目</h2>
          <p>浏览术语、笔记、实践与工具时，点击详情页的菱形按钮即可固定。</p>
          <a class="c-btn c-btn--solid" href="#/topics">去逛逛术语 →</a>
        </div>
      `}
    </section>
  `;
}

function renderNotFound() {
  main.innerHTML = `
    <section class="not-found page-view">
      <span>404</span>
      <h1>这枚坐标不在海图上</h1>
      <p>地址可能已经调整，或者该知识条目正在编译中。</p>
      <a class="primary-action" href="#/home">返回首页 →</a>
    </section>
  `;
}

/* ==========================================================================
   GLOBAL SEARCH 2.0 (全域跨分类 6 大实体检索)
   ========================================================================== */
function updateGlobalSearch() {
  const dataset = {
    lessons,
    notes: getAllNotes(),
    papers,
    projects: getAllWork(),
    toolbox: getAllToolbox(),
    library,
    digests: getAllDigests()
  };

  const query = globalSearch.value.trim();
  const results = searchAllEntities(dataset, query);
  const byType = new Map();
  results.forEach((item) => {
    if (!byType.has(item.type)) {
      byType.set(item.type, []);
    }
    byType.get(item.type).push(item);
  });

  const typeOrder = ['PROJECT', 'NOTE', 'TOPIC', 'PAPER', 'TOOLBOX', 'DIGEST', 'LIBRARY'];
  const typeLabel = {
    PROJECT: '项目',
    NOTE: '思考',
    TOPIC: '概念',
    PAPER: '阅读',
    TOOLBOX: '工具',
    DIGEST: '项目记录',
    LIBRARY: '资源'
  };
  const groups = typeOrder.filter((type) => byType.has(type));

  const rowHtml = (item) => `
    <a href="${item.url}" data-search-result class="sg-row sg-row--${item.type.toLowerCase()}">
      <span class="sg-type">${typeLabel[item.type] || item.type}</span>
      <span class="sg-main">
        <span class="sg-title">${escapeHTML(item.title)}</span>
        <span class="sg-desc">${escapeHTML([item.english, item.excerpt].filter(Boolean).join(' · '))}</span>
      </span>
      <b class="sg-arrow" aria-hidden="true">→</b>
    </a>`;

  if (!query) {
    const latestNote = [...getAllNotes()].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
    const featuredWork = getAllWork().find((item) => item.kind === 'PROJECT') || getAllWork()[0];
    const featuredTool = getAllToolbox()[0];
    const starters = [
      featuredWork && { type: '项目', title: featuredWork.title, desc: featuredWork.summary, url: `#/work/${featuredWork.id}` },
      latestNote && { type: '思考', title: latestNote.title, desc: latestNote.oneLiner, url: `#/notes/${latestNote.id}` },
      featuredTool && { type: '工具', title: featuredTool.title, desc: featuredTool.subtitle, url: `#/toolbox/${featuredTool.id}` }
    ].filter(Boolean);

    searchResults.innerHTML = `
      <div class="search-discovery">
        <section class="search-suggestions">
          <p class="c-eyebrow">TRY A QUESTION / 试着搜索</p>
          <div>
            ${['Agent 评测', 'RAG', 'MCP', '界面状态'].map((suggestion) => `<button type="button" data-search-suggestion="${suggestion}">${suggestion}<span>↗</span></button>`).join('')}
          </div>
        </section>
        <section class="search-starters">
          <p class="c-eyebrow">START HERE / 或从这里开始</p>
          ${starters.map((item) => `
            <a href="${item.url}" data-search-result>
              <span>${item.type}</span>
              <strong>${escapeHTML(item.title)}</strong>
              <small>${escapeHTML(item.desc || '')}</small>
              <b aria-hidden="true">→</b>
            </a>`).join('')}
        </section>
      </div>`;
  } else if (results.length) {
    searchResults.innerHTML = `
      <div class="search-result-summary"><span>“${escapeHTML(query)}”</span><b>${results.length} 条结果</b></div>
      ${groups.map((type) => `
        <section class="sg-group">
          <header><p class="c-eyebrow">${typeLabel[type] || type} / ${type}</p><span>${byType.get(type).length}</span></header>
          ${byType.get(type).slice(0, 4).map(rowHtml).join('')}
          ${byType.get(type).length > 4 ? `<p class="sg-more">还有 ${byType.get(type).length - 4} 条匹配内容，尝试输入更具体的词。</p>` : ''}
        </section>`).join('')}`;
  } else {
    searchResults.innerHTML = `
      <div class="search-empty">
        <span>NO RESULT</span>
        <strong>暂时没有找到“${escapeHTML(query)}”</strong>
        <p>换一个更短的关键词，或者试试 Agent、RAG、MCP、评测、Prompt。</p>
        <button type="button" data-search-clear>清空后重新搜索</button>
      </div>`;
  }

  document.querySelectorAll('[data-search-suggestion]').forEach((button) => {
    button.addEventListener('click', () => {
      globalSearch.value = button.dataset.searchSuggestion;
      updateGlobalSearch();
      globalSearch.focus();
    });
  });

  document.querySelector('[data-search-clear]')?.addEventListener('click', () => {
    globalSearch.value = '';
    updateGlobalSearch();
    globalSearch.focus();
  });

  document.querySelectorAll('[data-search-result]').forEach(link => {
    link.addEventListener('click', () => searchDialog.close());
  });

  searchCursor = 0;
  if (query) selectSearchResult(0);
}

function selectSearchResult(index) {
  const links = [...searchResults.querySelectorAll('[data-search-result]')];
  if (!links.length) return;
  searchCursor = (index + links.length) % links.length;
  links.forEach((link, current) => link.classList.toggle('is-selected', current === searchCursor));
  links[searchCursor].scrollIntoView({ block: 'nearest' });
}

/* ==========================================================================
   QUICK CAPTURE & AI CONTENT COMPILER DIALOG
   ========================================================================== */
function openQuickCaptureModal() {
  const projects = getAllWork().filter(w => w.kind === 'PROJECT');
  captureMaterials = [];

  const presets = [
    {
      title: 'AI 评测分层推进',
      text: '重新梳理了确定性规则引擎与模型语义判断的职责分工，将两者完全解耦。确定性规则由代码执行，主观同理心由 LLM Judge 进行二元断言。确定性问题规则化，非确定性语义问题模型化。'
    },
    {
      title: '移动端异步出图优化',
      text: '优化了慢速图像生成任务的端到端调用流，由同步阻塞改为异步任务状态机轮询。慢速生成式 AI 任务体验的核心在于状态管理与心理预期管理。'
    },
    {
      title: '个人知识库架构收口',
      text: '完成了 Personal Knowledge Lab V3.0 的知识档案库升级。平时只维护随手记录与真实项目，AI 自动提炼 6 核心字段，沉淀出 Topics、Notes、Work 与 Toolbox。'
    }
  ];

  captureContainer.innerHTML = `
    <div class="capture-header">
      <h2>＋ 快速记录项目推进 / 思考 (AI Content Compiler)</h2>
      <button type="button" id="btn-close-capture" aria-label="关闭">✕</button>
    </div>
    <div class="capture-body">
      <div class="capture-input-card">
        <label for="capture-raw-text">这次有什么推进、思考或实验发现？（随手描述即可……）</label>
        <textarea id="capture-raw-text" class="capture-textarea" placeholder="例如：今天重新调整了 rating 和 LLM Judge 的关系。rating 本身已经有明确业务规则，所以不应该继续让模型判断，现在把规则判断和语义判断拆开了……"></textarea>

        <div class="capture-presets-row">
          <span>快速填入示例：</span>
          ${presets.map((pr, idx) => `<button type="button" class="preset-chip" data-preset-idx="${idx}">${escapeHTML(pr.title)}</button>`).join('')}
        </div>

        <div class="capture-action-row">
          <span style="font-size:12px; color:var(--ink-faint);">AI 将严格按 10 大原则提炼 6 个固定核心字段并评估升级价值</span>
          <button class="btn-compiler-analyze" type="button" id="btn-run-compiler">
            <span>AI ANALYZE 智能提炼</span> →
          </button>
        </div>
      </div>
    </div>
  `;

  captureDialog.showModal();

  document.querySelector('#btn-close-capture')?.addEventListener('click', () => captureDialog.close());

  document.querySelectorAll('[data-preset-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = presets[Number(btn.dataset.presetIdx)];
      if (p) document.querySelector('#capture-raw-text').value = p.text;
    });
  });

  document.querySelector('#btn-run-compiler')?.addEventListener('click', () => {
    const rawText = document.querySelector('#capture-raw-text').value.trim();
    if (!rawText) {
      alert('请至少输入一段推进描述！');
      return;
    }
    const compiled = compileProjectDigest(rawText, captureMaterials, projects[0] || {});
    renderDigestReviewView(compiled);
  });
}

function renderDigestReviewView(draft) {
  captureContainer.innerHTML = `
    <div class="capture-header">
      <h2>提炼卡审核确认 (Review Workbench)</h2>
      <button type="button" id="btn-close-capture">✕</button>
    </div>
    <div class="capture-body">
      <div class="review-workbench">
        <p style="color:var(--ink-faint); font-size:12px; margin:0 0 16px;">
          AI 已经提取出 6 个核心字段并评估了升级价值。你可以进行微调并选择沉淀方向：
        </p>

        <div class="review-field-group">
          <label>标题</label>
          <input id="edit-title" class="review-input" value="${escapeHTML(draft.title)}" />
        </div>

        <div class="review-field-group">
          <label>1. 本次做了什么 (Progress)</label>
          <textarea id="edit-progress" class="review-textarea">${escapeHTML(draft.progress)}</textarea>
        </div>

        <div class="review-field-group">
          <label>2. 遇到什么关键问题 (Problem)</label>
          <textarea id="edit-problem" class="review-textarea">${escapeHTML(draft.problem)}</textarea>
        </div>

        <div class="review-field-group">
          <label>3. 最终怎么解决 (Solution)</label>
          <textarea id="edit-solution" class="review-textarea">${escapeHTML(draft.solution)}</textarea>
        </div>

        <div class="review-field-group">
          <label>4. 核心认识 (Insight)</label>
          <textarea id="edit-insight" class="review-textarea">${escapeHTML(draft.insight)}</textarea>
        </div>

        <div class="review-field-group">
          <label>5. 可复用价值 (Reusable Value)</label>
          <textarea id="edit-reusable" class="review-textarea">${escapeHTML(draft.reusableValue)}</textarea>
        </div>

        <div class="review-actions-bar">
          <div>
            <button class="btn-confirm-save" type="button" id="btn-save-note">沉淀为 Note 思考卡片 →</button>
            <button class="secondary-action" type="button" id="btn-save-tool" style="margin-left:8px;">沉淀为 Toolbox 工具 →</button>
          </div>
          <button class="text-button" type="button" id="btn-save-only-digest" style="font-size:12px;">仅作为项目推进保存</button>
        </div>
      </div>
    </div>
  `;

  document.querySelector('#btn-close-capture')?.addEventListener('click', () => captureDialog.close());

  const getUpdated = () => ({
    ...draft,
    title: document.querySelector('#edit-title').value.trim(),
    progress: document.querySelector('#edit-progress').value.trim(),
    problem: document.querySelector('#edit-problem').value.trim(),
    solution: document.querySelector('#edit-solution').value.trim(),
    insight: document.querySelector('#edit-insight').value.trim(),
    reusableValue: document.querySelector('#edit-reusable').value.trim()
  });

  document.querySelector('#btn-save-note')?.addEventListener('click', () => {
    const finalDraft = getUpdated();
    const noteDraft = generateNoteDraft(finalDraft);
    state.userNotes.unshift(noteDraft);
    state.userDigests.unshift(finalDraft);
    saveState();
    captureDialog.close();
    showToast('已成功沉淀为 Note 思考卡片！');
    location.hash = `#/notes/${noteDraft.id}`;
  });

  document.querySelector('#btn-save-tool')?.addEventListener('click', () => {
    const finalDraft = getUpdated();
    const toolDraft = generateToolboxDraft(finalDraft);
    state.userToolbox.unshift(toolDraft);
    state.userDigests.unshift(finalDraft);
    saveState();
    captureDialog.close();
    showToast('已成功沉淀为 Toolbox 方法！');
    location.hash = `#/toolbox/${toolDraft.id}`;
  });

  document.querySelector('#btn-save-only-digest')?.addEventListener('click', () => {
    const finalDraft = getUpdated();
    state.userDigests.unshift(finalDraft);
    saveState();
    captureDialog.close();
    showToast('推进记录已保存！');
    location.hash = '#/work';
  });
}

/* ==========================================================================
   ROUTER & MAIN DISPATCHER
   ========================================================================== */
function closeSiteMenu() {
  siteHeader?.classList.remove('is-menu-open');
  document.body.classList.remove('has-site-menu');
  siteMenuTrigger?.setAttribute('aria-expanded', 'false');
  siteMenuTrigger?.setAttribute('aria-label', '打开导航菜单');
  siteMobileMenu?.setAttribute('aria-hidden', 'true');
}

function toggleSiteMenu() {
  const open = !siteHeader?.classList.contains('is-menu-open');
  siteHeader?.classList.toggle('is-menu-open', open);
  document.body.classList.toggle('has-site-menu', open);
  siteMenuTrigger?.setAttribute('aria-expanded', String(open));
  siteMenuTrigger?.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  siteMobileMenu?.setAttribute('aria-hidden', String(!open));
}

function route() {
  const { routeName, id, query } = parseHash(location.hash);
  const normalizedRoute = normalizeRouteName(routeName);
  const params = new URLSearchParams(query);

  unmountHomeView();
  document.body.classList.toggle('is-home-route', routeName === 'home');
  workspaceLauncher?.classList.toggle('is-active', routeName === 'workspace');
  if (routeName === 'workspace') workspaceLauncher?.setAttribute('aria-current', 'page');
  else workspaceLauncher?.removeAttribute('aria-current');

  updateActiveNavigation(normalizedRoute);

  if (routeName === 'home') renderHome();
  else if (routeName === 'topics' || routeName === 'topic' || routeName === 'lesson') {
    if (!id) renderTopics(params);
    else renderTopicDetail(id);
  }
  else if (routeName === 'notes') {
    if (!id) renderNotes();
    else renderNoteDetail(id);
  }
  else if (routeName === 'papers' || routeName === 'reading') {
    if (!id) renderPapers();
    else renderPaperDetail(id);
  }
  else if (routeName === 'work' || routeName === 'projects') {
    if (!id) renderWork();
    else renderWorkDetail(id);
  }
  else if (routeName === 'toolbox' || routeName === 'playbooks') {
    if (!id) renderToolbox();
    else renderToolboxDetail(id);
  }
  else if (routeName === 'library-resources' || routeName === 'library') {
    renderLibrary(params.get('type') || 'ALL');
  }
  else if (routeName === 'practice') renderPractice();
  else if (routeName === 'saved' || routeName === 'favorites') renderSaved();
  else if (routeName === 'workspace') renderWorkspace();
  else if (routeName === 'about') renderAbout();
  else renderNotFound();

  const routeMeta = {
    home: { title: `${site.name} — ${site.tagline}`, description: '关于 AI 产品、Agent 与应用工程的项目、文章和实用工具。' },
    work: { title: `项目 · ${site.name}`, description: '真正动手做过或验证过的 AI 产品、原型与实验。' },
    projects: { title: `项目 · ${site.name}`, description: '真正动手做过或验证过的 AI 产品、原型与实验。' },
    notes: { title: `文章 · ${site.name}`, description: '从项目与阅读中留下的 AI 产品、Agent 和工程思考。' },
    topics: { title: `术语 · ${site.name}`, description: '用产品与实践视角解释 AI、Agent 和应用工程中的关键概念。' },
    topic: { title: `术语 · ${site.name}`, description: '用产品与实践视角解释 AI、Agent 和应用工程中的关键概念。' },
    lesson: { title: `术语 · ${site.name}`, description: '用产品与实践视角解释 AI、Agent 和应用工程中的关键概念。' },
    papers: { title: `阅读 · ${site.name}`, description: '影响当前实践判断的论文、文章与阅读笔记。' },
    reading: { title: `阅读 · ${site.name}`, description: '影响当前实践判断的论文、文章与阅读笔记。' },
    toolbox: { title: `工具 · ${site.name}`, description: '可以直接带走复用的 AI 工作方法、清单与模板。' },
    playbooks: { title: `工具 · ${site.name}`, description: '可以直接带走复用的 AI 工作方法、清单与模板。' },
    library: { title: `资料架 · ${site.name}`, description: '值得再次打开的文章、网站、开源仓库与工具。' },
    'library-resources': { title: `资料架 · ${site.name}`, description: '值得再次打开的文章、网站、开源仓库与工具。' },
    practice: { title: `练习 · ${site.name}`, description: '用短问题快速校准对 AI 产品与工程概念的理解。' },
    saved: { title: `已保存 · ${site.name}`, description: '固定下来、近期需要反复使用的内容。' },
    favorites: { title: `已保存 · ${site.name}`, description: '固定下来、近期需要反复使用的内容。' },
    workspace: { title: `个人工作台 · ${site.name}`, description: '用于随手记录、复习、收藏和整理的个人工作台。' },
    about: { title: `关于 · ${site.name}`, description: '了解我如何在复杂的 AI 能力与真实产品之间做翻译与实现。' }
  };
  const detail =
    (routeName === 'topics' || routeName === 'topic' || routeName === 'lesson') && id ? topicById(id)
    : routeName === 'notes' && id ? noteById(id)
    : (routeName === 'work' || routeName === 'projects') && id ? workById(id)
    : (routeName === 'papers' || routeName === 'reading') && id ? paperById(id)
    : (routeName === 'toolbox' || routeName === 'playbooks') && id ? toolById(id)
    : null;
  const detailDescription = detail && (detail.excerpt || detail.oneLiner || detail.summary || detail.problemSolved || detail.problem);
  const meta = detail
    ? { title: `${detail.title} · ${site.name}`, description: detailDescription || routeMeta[routeName]?.description }
    : routeMeta[routeName] || { title: `页面未找到 · ${site.name}`, description: '这个页面暂时不存在。' };
  applyPageMeta(meta);

  closeSiteMenu();
  main.setAttribute('aria-busy', 'false');
  main.classList.remove('is-route-leaving', 'is-route-entering');
  void main.offsetWidth;
  main.classList.add('is-route-entering');
  window.setTimeout(() => main.classList.remove('is-route-entering'), 520);
  window.scrollTo({ top: 0, behavior: 'instant' });
  main.focus({ preventScroll: true });
}

// 快速捕获入口

document.querySelector('#topbar-quick-capture')?.addEventListener('click', openQuickCaptureModal);
workspaceLauncher?.addEventListener('click', () => {
  location.hash = '#/workspace';
});

// 全局搜索弹窗
function openGlobalSearch() {
  closeSiteMenu();
  searchDialog.showModal();
  globalSearch.value = '';
  updateGlobalSearch();
  setTimeout(() => globalSearch.focus(), 0);
}

document.querySelector('#search-launcher')?.addEventListener('click', openGlobalSearch);
mobileSearchLauncher?.addEventListener('click', openGlobalSearch);
globalSearch.addEventListener('input', updateGlobalSearch);
globalSearch.addEventListener('keydown', (event) => {
  if (event.isComposing) return;
  const links = [...searchResults.querySelectorAll('[data-search-result]')];
  const selected = links.findIndex((link) => link.classList.contains('is-selected'));
  if (event.key === 'ArrowDown' && links.length) {
    event.preventDefault();
    selectSearchResult(selected < 0 ? 0 : selected + 1);
  } else if (event.key === 'ArrowUp' && links.length) {
    event.preventDefault();
    selectSearchResult(selected < 0 ? links.length - 1 : selected - 1);
  } else if (event.key === 'Enter' && links.length) {
    event.preventDefault();
    links[selected < 0 ? 0 : selected].click();
  }
});

// 主题切换
themeToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  const nextTheme = state.theme === 'night' ? 'day' : 'night';
  const animateTheme = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (animateTheme) document.documentElement.classList.add('is-theme-switching');
  setTheme(nextTheme);
  if (animateTheme) window.setTimeout(() => document.documentElement.classList.remove('is-theme-switching'), 420);
  showToast(nextTheme === 'night' ? '已切换至夜航模式' : '已切换至日间模式');
});

siteMenuTrigger?.addEventListener('click', toggleSiteMenu);
document.querySelectorAll('#site-mobile-menu a').forEach((link) => link.addEventListener('click', closeSiteMenu));

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

document.querySelector('#site-footer-year').textContent = `© ${new Date().getFullYear()} ${site.name}`;

let scrollFrame = 0;
function updateScrollChrome() {
  scrollFrame = 0;
  const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(100, Math.max(0, (window.scrollY / scrollRange) * 100));
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
  siteHeader?.querySelector('.zh-nav')?.style.setProperty('--page-progress', `${progress}%`);
  backToTop?.classList.toggle('is-visible', window.scrollY > Math.min(640, window.innerHeight * .72));
}

window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollChrome);
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeSiteMenu();
  updateScrollChrome();
});

// 快捷键 /
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSiteMenu();
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    document.querySelector('#search-launcher')?.click();
  }
});

document.addEventListener('click', (event) => {
  if (siteHeader?.classList.contains('is-menu-open') && !event.target.closest('#site-header')) {
    closeSiteMenu();
  }
  const link = event.target.closest('a[href^="#/"]');
  if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const nextHash = link.getAttribute('href');
  if (!nextHash || nextHash === location.hash) return;
  event.preventDefault();
  main.setAttribute('aria-busy', 'true');
  main.classList.add('is-route-leaving');
  window.setTimeout(() => {
    location.hash = nextHash;
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120);
});

// 全局收藏处理
document.addEventListener('click', (e) => {
  const favBtn = e.target.closest('[data-favorite]');
  if (!favBtn) return;
  e.preventDefault();
  const id = favBtn.dataset.favorite;
  toggleFavorite(id);
  if (location.hash.includes('/saved') || location.hash.includes('/favorites')) {
    renderSaved();
  } else if (location.hash.includes('/topics/')) {
    renderTopicDetail(id);
  } else {
    favBtn.classList.toggle('is-active', isFavorite(id));
    favBtn.textContent = isFavorite(id) ? '◆' : '◇';
  }
});

window.addEventListener('hashchange', route);

// 初始化启动
setTheme(state.theme || 'day');
updateProgressUI();
route();
updateScrollChrome();
