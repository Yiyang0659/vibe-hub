export function createToolboxRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { renderToolbox, renderToolboxDetail };
}
