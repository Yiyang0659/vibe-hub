export function createWorkspaceRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { renderWorkspace };
}
