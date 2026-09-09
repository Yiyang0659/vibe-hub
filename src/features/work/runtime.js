export function createWorkRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { renderWork, renderWorkDetail };
}
