export function createPracticeRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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

  return { renderPractice };
}
