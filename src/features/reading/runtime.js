export function createReadingRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { renderPapers, renderPaperDetail };
}
