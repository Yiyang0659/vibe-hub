export function createAboutRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { renderAbout };
}
