export function createSavedRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { resolveFavorite, renderSaved };
}
