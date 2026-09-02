import { categories, lessons } from './data.js';
import {
  currentFocus,
  aboutData,
  papers,
  notes,
  workItems,
  toolbox,
  library,
  initialDigests
} from './lab-data.js';
import {
  compileProjectDigest,
  generateNoteDraft,
  generateToolboxDraft
} from './compiler.js';
import {
  calculateProgress,
  categoryProgress,
  safeParse,
  searchLessons,
  searchAllEntities
} from './utils.js';
import { renderHomeView } from './views/home.js';
import { renderTopicsIndex, mountTopicsIndex } from './views/topics.js';
import { renderNotesTimeline } from './views/notes.js';
import { renderWorkIndex } from './views/work.js';
import { topicsWithDomain, WHY_LOOKUP } from './content/topics.js';
import { renderReadingIndex } from './views/reading.js';
import { renderToolboxIndex } from './views/toolbox.js';
import { renderLibraryIndex } from './views/library.js';

const storageKey = 'pkl-v3-state';

const defaultState = {
  completed: [],
  favorites: [],
  notes: {},
  lastViewed: null,
  theme: 'day',
  motionMode: 'trace',
  practiceAnswered: 0,
  practiceCorrect: 0,
  userNotes: [],
  userWork: [],
  userToolbox: [],
  userDigests: [],
  toolChecklist: {}
};

let state = loadState();
let practice = { index: 0, selected: null };
let toastTimer;
let captureMaterials = [];

const main = document.querySelector('#main-content');
const searchDialog = document.querySelector('#search-dialog');
const globalSearch = document.querySelector('#global-search');
const searchResults = document.querySelector('#search-results');
const captureDialog = document.querySelector('#capture-dialog');
const captureContainer = document.querySelector('#capture-dialog-container');
const themeToggle = document.querySelector('#theme-toggle');

function loadState() {
  const saved = safeParse(localStorage.getItem(storageKey), {}) || {};
  return {
    ...defaultState,
    ...saved,
    completed: Array.isArray(saved.completed) ? saved.completed : [],
    favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
    notes: saved.notes && typeof saved.notes === 'object' ? saved.notes : {},
    userNotes: Array.isArray(saved.userNotes) ? saved.userNotes : [],
    userWork: Array.isArray(saved.userWork) ? saved.userWork : [],
    userToolbox: Array.isArray(saved.userToolbox) ? saved.userToolbox : [],
    userDigests: Array.isArray(saved.userDigests) ? saved.userDigests : [],
    toolChecklist: saved.toolChecklist && typeof saved.toolChecklist === 'object' ? saved.toolChecklist : {}
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateProgressUI();
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

// 统一数据获取器 (内置 + 用户创建)
function getAllNotes() {
  const userMap = new Map(state.userNotes.map(n => [n.id, n]));
  const list = notes.map(n => userMap.get(n.id) || n);
  state.userNotes.forEach(n => {
    if (!list.some(item => item.id === n.id)) list.unshift(n);
  });
  return list;
}

function getAllWork() {
  const userMap = new Map(state.userWork.map(w => [w.id, w]));
  const list = workItems.map(w => userMap.get(w.id) || w);
  state.userWork.forEach(w => {
    if (!list.some(item => item.id === w.id)) list.unshift(w);
  });
  return list;
}

function getAllToolbox() {
  const userMap = new Map(state.userToolbox.map(t => [t.id, t]));
  const list = toolbox.map(t => userMap.get(t.id) || t);
  state.userToolbox.forEach(t => {
    if (!list.some(item => item.id === t.id)) list.unshift(t);
  });
  return list;
}

function getAllDigests() {
  const userMap = new Map(state.userDigests.map(d => [d.id, d]));
  const list = initialDigests.map(d => userMap.get(d.id) || d);
  state.userDigests.forEach(d => {
    if (!list.some(item => item.id === d.id)) list.unshift(d);
  });
  return list;
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
  if (themeToggle) {
    themeToggle.textContent = validTheme === 'night' ? '日间' : '夜航';
    themeToggle.setAttribute('aria-pressed', String(validTheme === 'night'));
    themeToggle.setAttribute('aria-label', validTheme === 'night' ? '切换为日间模式' : '切换为夜航模式');
    themeToggle.title = validTheme === 'night' ? '当前：夜航模式（点击切换日间）' : '当前：日间模式（点击切换夜航）';
  }
  saveState();
}

function updateProgressUI() {
  const progress = calculateProgress(lessons.length, state.completed);
  const el = document.querySelector('#sidebar-progress');
  const bar = document.querySelector('#sidebar-progress-bar');
  if (el) el.textContent = `${progress.percent}%`;
  if (bar) bar.style.width = `${progress.percent}%`;
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
    library
  });
  attachHomeQuickCopy();
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

  main.innerHTML = `
    <article class="lesson-page page-view" style="--route-color:${cat.accent}">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/topics">02 术语知识库</a>
        <span>/</span>
        <a href="#/topics?category=${encodeURIComponent(lesson.category)}">${escapeHTML(lesson.category)}</a>
        <span>/</span>
        <strong>${escapeHTML(lesson.title)}</strong>
      </nav>

      <header class="lesson-hero reveal">
        <div class="lesson-index">
          <span>${cat.code}</span>
          <b>${String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</b>
        </div>
        <div>
          <p class="eyebrow">${escapeHTML(lesson.english)} · ${escapeHTML(lesson.level)} · ${lesson.duration} 分钟</p>
          <h1>${escapeHTML(lesson.title)}</h1>
          ${lesson.aliases?.length ? `<p class="alias-line"><span>AKA</span> ${lesson.aliases.map(escapeHTML).join(' / ')}</p>` : ''}
          <p class="lesson-lead">${escapeHTML(lesson.excerpt)}</p>
          <div class="tag-row">${lesson.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div>
        </div>
        <button class="favorite-seal ${isFavorite(id) ? 'is-active' : ''}" type="button" data-favorite="${id}">
          <span>${isFavorite(id) ? '已固定' : '固定条目'}</span><b>${isFavorite(id) ? '◆' : '◇'}</b>
        </button>
      </header>

      <div class="lesson-layout">
        <aside class="lesson-toc reveal" aria-label="本页章节">
          <span>ON THIS PAGE</span>
          <a class="is-active" href="#/topics/${id}" data-scroll-target="sec-def">01 术语定义</a>
          <a href="#/topics/${id}" data-scroll-target="sec-why">02 核心职责</a>
          ${WHY_LOOKUP[id] ? `<a href="#/topics/${id}" data-scroll-target="sec-lookup">02.5 我为什么查它</a>` : ''}
          ${lesson.scenario ? `<a href="#/topics/${id}" data-scroll-target="sec-lab">03 交互实验</a>` : ''}
          <a href="#/topics/${id}" data-scroll-target="sec-exp">04 真实场景</a>
          <a href="#/topics/${id}" data-scroll-target="sec-pit">05 常见误区</a>
          <a href="#/topics/${id}" data-scroll-target="sec-chk">06 行动清单</a>
          <a href="#/topics/${id}" data-scroll-target="sec-chk2">07 快速校准</a>
          <a href="#/topics/${id}" data-scroll-target="sec-rel">08 关联网络</a>
          <a href="#/topics/${id}" data-scroll-target="sec-note">09 本地笔记</a>
        </aside>

        <div class="lesson-content">
          <!-- 01 一句话理解与专业定义 -->
          <section id="sec-def" class="content-section reveal">
            <p class="section-no">01 / DEFINITION & USER INTENT</p>
            <h2>术语说明与理解</h2>
            ${lesson.userSays ? `<div class="user-says"><span>你可能会怎么问</span><p>${escapeHTML(lesson.userSays)}</p></div>` : ''}
            <p class="definition-copy">${escapeHTML(lesson.definition)}</p>
          </section>

          <!-- 02 核心职责 -->
          <section id="sec-why" class="content-section reveal">
            <p class="section-no">02 / RESPONSIBILITY & WHY IT MATTERS</p>
            <h2>为什么重要 · 核心职责</h2>
            <p>${escapeHTML(lesson.why)}</p>
            <div class="key-points">
              ${lesson.points.map((pt, i) => `<div><span>0${i + 1}</span><p>${escapeHTML(pt)}</p></div>`).join('')}
            </div>
          </section>

          ${WHY_LOOKUP[id] ? `
          <section id="sec-lookup" class="content-section reveal">
            <p class="section-no">02.5 / WHY I LOOKED IT UP</p>
            <h2>我为什么会查这个？</h2>
            <div class="c-callout">${escapeHTML(WHY_LOOKUP[id])}</div>
          </section>` : ''}

          <!-- 03 交互实验 -->
          ${lesson.scenario ? scenarioMarkup(lesson) : ''}

          <!-- 04 真实场景 -->
          <section id="sec-exp" class="content-section reveal">
            <p class="section-no">04 / APPLICATION & RUNBOOK</p>
            <h2>放进真实任务里</h2>
            <div class="field-note">
              <span>RUNBOOK EXAMPLE</span>
              <p>${escapeHTML(lesson.example)}</p>
            </div>
          </section>

          <!-- 05 常见误区 -->
          <section id="sec-pit" class="content-section reveal">
            <p class="section-no">05 / PITFALLS & FAILURE MODES</p>
            <h2>常见误区与避坑</h2>
            <ul class="pitfall-list">
              ${lesson.pitfalls.map(p => `<li><span>×</span>${escapeHTML(p)}</li>`).join('')}
            </ul>
          </section>

          <!-- 06 行动清单 -->
          <section id="sec-chk" class="content-section reveal">
            <p class="section-no">06 / CHECKLIST</p>
            <h2>行动清单</h2>
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

          <!-- 07 快速校准 -->
          <section id="sec-chk2" class="quick-check reveal">
            <span class="ink-label">快速校准</span>
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

          <!-- 08 关联网络 (Related Notes / Work / Topics) -->
          <section id="sec-rel" class="content-section reveal">
            <p class="section-no">08 / KNOWLEDGE GRAPH & EVIDENCE</p>
            <h2>关联知识网络与实践证据</h2>
            <div class="knowledge-graph-box">
              ${relatedNotes.length ? `
                <div class="rel-group">
                  <strong>RELATED NOTES (关联思考):</strong>
                  ${relatedNotes.map(n => `<a href="#/notes/${n.id}" class="rel-chip note">📝 ${escapeHTML(n.title)}</a>`).join('')}
                </div>
              ` : ''}
              ${relatedWork.length ? `
                <div class="rel-group">
                  <strong>USED IN WORK (实践项目/实验):</strong>
                  ${relatedWork.map(w => `<a href="#/work/${w.id}" class="rel-chip work">🚀 ${escapeHTML(w.title)}</a>`).join('')}
                </div>
              ` : ''}
              ${relatedTools.length ? `
                <div class="rel-group">
                  <strong>USED IN TOOLS (沉淀为工具):</strong>
                  ${relatedTools.map(t => `<a href="#/toolbox/${t.id}" class="rel-chip tool">🛠 ${escapeHTML(t.title)}</a>`).join('')}
                </div>
              ` : ''}
              ${relatedLessons.length ? `
                <div class="rel-group">
                  <strong>RELATED TOPICS (关联概念):</strong>
                  ${relatedLessons.map(l => `<a href="#/topics/${l.id}" class="rel-chip topic">✦ ${escapeHTML(l.title)}</a>`).join('')}
                </div>
              ` : ''}
            </div>
          </section>

          <!-- 09 本地笔记 -->
          <section id="sec-note" class="content-section note-section reveal">
            <p class="section-no">09 / LOCAL NOTES</p>
            <h2>我的调试与学习笔记</h2>
            <textarea id="lesson-note" rows="5" placeholder="写下你的理解、疑问或实验想法…">${escapeHTML(state.notes[id] || '')}</textarea>
            <div>
              <span id="note-status">${state.notes[id] ? '已有本地记录' : '尚未记录'}</span>
              <button class="secondary-action" id="save-note" type="button">SAVE NOTE</button>
            </div>
          </section>
        </div>
      </div>

      <section class="lesson-finish reveal">
        <div>
          <span>MODULE STATUS</span>
          <h2>${isCompleted(id) ? '这个术语模块已经通过。' : '完成学习与实验后，更新掌握状态。'}</h2>
          <p>完成状态将同步至全局能力索引与控制台进度。</p>
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
      <p class="section-no">03 / INTERACTIVE RUNTIME LAB</p>
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
function renderNotes() {
  main.innerHTML = renderNotesTimeline({ notes: getAllNotes() });
}

function renderNoteDetail(id) {
  const note = noteById(id);
  if (!note) return renderNotFound();

  const relatedTopics = (note.relatedTopics || []).map(topicById).filter(Boolean);
  const relatedPapers = (note.relatedPapers || []).map(paperById).filter(Boolean);
  const relatedWork = (note.relatedWork || []).map(workById).filter(Boolean);

  main.innerHTML = `
    <article class="note-detail-page page-view">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/notes">03 思考笔记</a>
        <span>/</span>
        <strong>${escapeHTML(note.title)}</strong>
      </nav>

      <header class="page-header reveal">
        <p class="chapter-label"><span>NOTE</span> / ${escapeHTML(note.category)} · ${escapeHTML(note.date)}</p>
        <h1 style="margin:6px 0 14px; font:700 28px/1.25 var(--serif);">${escapeHTML(note.title)}</h1>
        <div class="judgment-banner" style="margin:0;">
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
    <article class="paper-detail-page page-view">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/papers">04 论文拆解</a>
        <span>/</span>
        <strong>${escapeHTML(paper.title)}</strong>
      </nav>

      <header class="page-header reveal">
        <p class="chapter-label"><span>PAPER DECONSTRUCTION</span> / ${escapeHTML(paper.domain)} · ${paper.year}</p>
        <h1 style="margin:6px 0 4px; font:700 28px/1.25 var(--serif);">${escapeHTML(paper.title)}</h1>
        <p style="color:var(--ink-faint); margin:0 0 14px; font-size:13.5px;">${escapeHTML(paper.chineseTitle)} · <i>${escapeHTML(paper.authors)}</i></p>
        
        <div class="judgment-banner" style="margin:0;">
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
  document.querySelectorAll('[data-work-tab]').forEach(btn => {
    btn.addEventListener('click', () => renderWork(btn.dataset.workTab));
  });
}

function renderWorkDetail(id) {
  const work = workById(id);
  if (!work) return renderNotFound();

  const relatedTopics = (work.relatedTopics || []).map(topicById).filter(Boolean);
  const relatedNotes = (work.relatedNotes || []).map(noteById).filter(Boolean);

  main.innerHTML = `
    <article class="work-detail-page page-view">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/work">05 项目与实验</a>
        <span>/</span>
        <strong>${escapeHTML(work.title)}</strong>
      </nav>

      <header class="page-header reveal">
        <p class="chapter-label"><span>${work.kindLabel}</span> / ${escapeHTML(work.domain)} · ${escapeHTML(work.statusLabel)}</p>
        <h1 style="margin:6px 0 4px; font:700 28px/1.25 var(--serif);">${escapeHTML(work.title)}</h1>
        <p style="color:var(--ink-faint); margin:0 0 14px; font-size:13.5px;">${escapeHTML(work.english || '')} · ${escapeHTML(work.time)}</p>
        <p style="margin:0 0 16px; font-size:15px; color:var(--ink-soft);">${escapeHTML(work.summary)}</p>
      </header>

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
    <article class="toolbox-detail-page page-view">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/toolbox">06 工具箱</a>
        <span>/</span>
        <strong>${escapeHTML(tool.title)}</strong>
      </nav>

      <header class="page-header reveal">
        <p class="chapter-label"><span>${tool.typeLabel}</span> / ${escapeHTML(tool.category)}</p>
        <h1 style="margin:6px 0 4px; font:700 28px/1.25 var(--serif);">${escapeHTML(tool.title)}</h1>
        <p style="margin:0 0 14px; font-size:15px; color:var(--ink-soft);">${escapeHTML(tool.subtitle || '')}</p>
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
  main.innerHTML = `
    <article class="about-page page-view">
      <header class="page-header reveal">
        <p class="chapter-label"><span>ABOUT</span> / 个人能力档案与实验室说明</p>
        <h1>${aboutData.name}</h1>
        <p style="font-size:16px; color:var(--ink-soft);">${aboutData.subtitle} · <em>${aboutData.tagline}</em></p>
      </header>

      <div class="case-study-grid">
        <!-- 重点专注领域 -->
        <section class="case-study-block reveal">
          <p class="section-no">01 / CURRENT FOCUS</p>
          <h3>我目前主要关注与探索的领域</h3>
          <div class="about-focus-grid">
            ${aboutData.focusAreas.map(f => `
              <div class="about-focus-card">
                <h4>✦ ${escapeHTML(f.title)}</h4>
                <p>${escapeHTML(f.desc)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 实验室记录什么 -->
        <section class="case-study-block reveal">
          <p class="section-no">02 / LAB MISSION</p>
          <h3>这个 Lab 记录什么？</h3>
          <ul style="font-size:14.5px; line-height:1.8;">
            ${aboutData.labMission.map(m => `<li><b>${escapeHTML(m)}</b></li>`).join('')}
          </ul>
        </section>

        <!-- 联系方式与链接 -->
        <section class="case-study-block reveal">
          <p class="section-no">03 / CONTACT & PROFILES</p>
          <h3>外部链接与联系</h3>
          <div class="about-links-row">
            ${aboutData.links.map(l => `<a href="${l.url}" class="primary-action" style="min-height:36px;">${escapeHTML(l.label)} ↗</a>`).join('')}
          </div>
        </section>
      </div>
    </article>
  `;
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
        <p class="chapter-label"><span>PRACTICE</span> / TESTING RUNTIME</p>
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

function renderSaved() {
  const favorites = lessons.filter(lesson => state.favorites.includes(lesson.id));

  main.innerHTML = `
    <section class="favorites-page page-view">
      <header class="page-header reveal">
        <p class="chapter-label"><span>SAVED</span> / PINNED WORKSPACE</p>
        <div>
          <h1>把真正重要的知识与工具，固定在工作区。</h1>
          <p>只留下正在影响当前项目或近期需要重点复习的模块。</p>
        </div>
      </header>

      <div class="favorites-summary reveal">
        <span class="stamp">PINNED</span>
        <div><strong>${favorites.length}</strong><p>个已固定条目</p></div>
        <p>${favorites.length ? '这些条目已保存在本地，可随时点击详情页取消。' : '当前暂无固定条目，可在浏览时点击菱形按钮添加。'}</p>
      </div>

      ${favorites.length ? `<div class="lesson-grid">${favorites.map(topicCard).join('')}</div>` : `
        <div class="empty-state">
          <span>◇</span>
          <h2>工作区暂无条目</h2>
          <p>前往术语库或思考模块，将关键内容固定在此。</p>
          <a class="primary-action" href="#/topics">BROWSE TOPICS →</a>
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
      <a class="primary-action" href="#/home">返回控制台 →</a>
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

  const results = searchAllEntities(dataset, globalSearch.value).slice(0, 10);
  searchResults.innerHTML = results.length
    ? results.map(item => `
        <a href="${item.url}" data-search-result style="display:flex; align-items:flex-start; gap:12px; padding:12px 14px; border-bottom:1px solid var(--line);">
          <span class="entity-badge" style="background:${item.badgeColor || '#45e0bf'}; color:#080d12;">${item.type}</span>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:14px; color:var(--ink);">${escapeHTML(item.title)}</div>
            <div style="font-size:12px; color:var(--ink-soft); margin-top:2px;">${escapeHTML(item.english)} · ${escapeHTML(item.excerpt)}</div>
          </div>
          <b style="color:var(--ink-faint);">↗</b>
        </a>
      `).join('')
    : `<div class="search-empty"><strong>未找到匹配内容</strong><p>可尝试检索：Agent、RAG、MCP、Attention、评测、Prompt 或工具名。</p></div>`;

  document.querySelectorAll('[data-search-result]').forEach(link => {
    link.addEventListener('click', () => searchDialog.close());
  });
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
function updateActiveNav(route) {
  document.querySelectorAll('[data-route]').forEach(link => {
    link.classList.toggle('is-active', link.dataset.route === route);
  });
}

function route() {
  const raw = location.hash.replace(/^#\/?/, '') || 'home';
  const [path, query = ''] = raw.split('?');
  const params = new URLSearchParams(query);
  const parts = path.split('/');
  const [routeName, id] = parts;

  updateActiveNav(
    routeName === 'topic' || routeName === 'lesson'
      ? 'topics'
      : routeName === 'projects'
      ? 'work'
      : routeName === 'playbooks'
      ? 'toolbox'
      : routeName === 'library-resources'
      ? 'library'
      : routeName === 'favorites'
      ? 'saved'
      : routeName
  );

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
  else if (routeName === 'about') renderAbout();
  else renderNotFound();

  window.scrollTo({ top: 0, behavior: 'instant' });
  main.focus({ preventScroll: true });
}

// 快速捕获入口
document.querySelector('#sidebar-quick-capture')?.addEventListener('click', openQuickCaptureModal);
document.querySelector('#topbar-quick-capture')?.addEventListener('click', openQuickCaptureModal);

// 全局搜索弹窗
document.querySelector('#search-launcher')?.addEventListener('click', () => {
  searchDialog.showModal();
  globalSearch.value = '';
  updateGlobalSearch();
  setTimeout(() => globalSearch.focus(), 0);
});
globalSearch.addEventListener('input', updateGlobalSearch);

// 主题切换
themeToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  const nextTheme = state.theme === 'night' ? 'day' : 'night';
  setTheme(nextTheme);
  showToast(nextTheme === 'night' ? '已切换至夜航模式' : '已切换至日间模式');
});

// 快捷键 /
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    document.querySelector('#search-launcher')?.click();
  }
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

document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());

// 初始化启动
setTheme(state.theme || 'day');
updateProgressUI();
route();
