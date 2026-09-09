export function createNotesRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { renderNotes, renderNoteDetail };
}
