import { categories, lessons, createTopicsRuntime } from '../features/topics/index.js';
import {
  currentFocus,
  aboutData,
  papers,
  notes,
  workItems,
  toolbox,
  library,
  initialDigests
} from '../features/index.js';
import {
  compileProjectDigest,
  generateNoteDraft,
  generateToolboxDraft
} from '../features/workspace/compiler.js';
import {
  calculateProgress,
  categoryProgress,
  searchLessons,
  searchAllEntities
} from '../shared/lib/index.js';
import { renderHomeView, mountHomeView, unmountHomeView } from '../features/home/page.js';
import { renderTopicsIndex, mountTopicsIndex } from '../features/topics/topics-page.js';
import { renderArticlesIndex } from '../features/notes/notes-page.js';
import { renderWorkIndex } from '../features/work/work-page.js';
import { topicsWithDomain, WHY_LOOKUP } from '../features/topics/index.js';
import { renderReadingIndex } from '../features/reading/reading-page.js';
import { renderToolboxIndex } from '../features/toolbox/toolbox-page.js';
import { renderLibraryIndex } from '../features/library/page.js';
import { renderRelatedTrail } from '../shared/components/related-trail.js';
import { site } from '../shared/content/site.js';
import { createStore } from '../shared/store/index.js';
import { normalizeRouteName, parseHash } from './router.js';
import { applyPageMeta, updateActiveNavigation } from './shell.js';
import { createNotesRuntime } from '../features/notes/index.js';
import { createReadingRuntime } from '../features/reading/index.js';
import { createWorkRuntime } from '../features/work/index.js';
import { createToolboxRuntime } from '../features/toolbox/index.js';
import { createLibraryRuntime } from '../features/library/index.js';
import { createAboutRuntime } from '../features/about/index.js';
import { createWorkspaceRuntime } from '../features/workspace/index.js';
import { createPracticeRuntime } from '../features/practice/index.js';
import { createSavedRuntime } from '../features/saved/index.js';

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
const featureContext = {
  main,
  state,
  practice,
  lessons,
  topicsWithDomain,
  WHY_LOOKUP,
  papers,
  library,
  aboutData,
  getAllNotes,
  getAllWork,
  getAllToolbox,
  getAllDigests,
  topicById,
  noteById,
  paperById,
  workById,
  toolById,
  categoryOf,
  showToast,
  saveState,
  isFavorite,
  isCompleted,
  toggleCompleted,
  renderTopicsIndex,
  mountTopicsIndex,
  renderArticlesIndex,
  renderReadingIndex,
  renderWorkIndex,
  renderToolboxIndex,
  renderLibraryIndex,
  renderRelatedTrail,
  escapeHTML,
  openQuickCaptureModal,
  calculateProgress
};

const { renderTopics, renderTopicDetail } = createTopicsRuntime(featureContext);
const { renderNotes, renderNoteDetail } = createNotesRuntime(featureContext);
const { renderPapers, renderPaperDetail } = createReadingRuntime(featureContext);
const { renderWork, renderWorkDetail } = createWorkRuntime(featureContext);
const { renderToolbox, renderToolboxDetail } = createToolboxRuntime(featureContext);
const { renderLibrary } = createLibraryRuntime(featureContext);
const { renderAbout } = createAboutRuntime(featureContext);
const { renderWorkspace } = createWorkspaceRuntime(featureContext);
const { renderPractice } = createPracticeRuntime(featureContext);
const { resolveFavorite, renderSaved } = createSavedRuntime(featureContext);

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
