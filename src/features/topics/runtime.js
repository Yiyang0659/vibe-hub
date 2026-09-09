export function createTopicsRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

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
  const trailGraph = { notes: getAllNotes(), work: getAllWork(), toolbox: getAllToolbox() };

  main.innerHTML = `
    <article class="lesson-page page-view portfolio-detail concept-detail" style="--route-color:${cat.accent}">
      <nav class="breadcrumb reveal" aria-label="面包屑">
        <a href="#/notes">文章</a>
        <span>/</span>
        <a href="#/topics">概念索引</a>
        <span>/</span>
        <strong>${escapeHTML(lesson.title)}</strong>
      </nav>

      <header class="concept-hero detail-hero reveal">
        <div class="concept-hero-main">
          <p class="chapter-label"><span>CONCEPT ${String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</span> / ${escapeHTML(lesson.category)}</p>
          <h1 class="detail-title">${escapeHTML(lesson.title)}</h1>
          <p class="detail-meta">${escapeHTML(lesson.english)}${lesson.aliases?.length ? ` · AKA ${lesson.aliases.map(escapeHTML).join(' / ')}` : ''}</p>
          <p class="concept-lead">${escapeHTML(lesson.excerpt)}</p>
          <div class="tag-row concept-tags">${lesson.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div>
        </div>
        <div class="concept-hero-side">
          <dl class="concept-facts">
            <div><dt>理解成本</dt><dd>${lesson.duration} 分钟</dd></div>
            <div><dt>当前层级</dt><dd>${escapeHTML(lesson.level)}</dd></div>
            <div><dt>所属方向</dt><dd>${escapeHTML(lesson.category)}</dd></div>
          </dl>
          <button class="favorite-seal concept-pin ${isFavorite(id) ? 'is-active' : ''}" type="button" data-favorite="${id}">
            <span>${isFavorite(id) ? '已收藏' : '收藏这个概念'}</span><b>${isFavorite(id) ? '◆' : '◇'}</b>
          </button>
        </div>
      </header>

      <div class="lesson-layout concept-layout">
        <aside class="lesson-toc concept-toc reveal" aria-label="本页章节">
          <span>ON THIS PAGE</span>
          <a class="is-active" href="#/topics/${id}" data-scroll-target="sec-lookup">01 从哪里遇到它</a>
          <a href="#/topics/${id}" data-scroll-target="sec-def">02 一句话理解</a>
          <a href="#/topics/${id}" data-scroll-target="sec-why">03 为什么重要</a>
          <a href="#/topics/${id}" data-scroll-target="sec-used">04 在哪里用过</a>
          ${lesson.scenario ? `<a href="#/topics/${id}" data-scroll-target="sec-lab">05 看它如何工作</a>` : ''}
          <a href="#/topics/${id}" data-scroll-target="sec-exp">${lesson.scenario ? '06' : '05'} 真实例子</a>
          <a href="#/topics/${id}" data-scroll-target="sec-pit">${lesson.scenario ? '07' : '06'} 容易误解什么</a>
          <a href="#/topics/${id}" data-scroll-target="sec-chk">${lesson.scenario ? '08' : '07'} 下次怎么做</a>
          <a href="#/topics/${id}" data-scroll-target="sec-chk2">${lesson.scenario ? '09' : '08'} 快速校准</a>
          <a href="#/topics/${id}" data-scroll-target="sec-note">${lesson.scenario ? '10' : '09'} 留下笔记</a>
        </aside>

        <div class="lesson-content concept-content">
          <section id="sec-lookup" class="content-section concept-origin reveal">
            <p class="section-no">01 / WHY THIS CAME UP</p>
            <h2>我从哪里遇到它？</h2>
            <p>${escapeHTML(WHY_LOOKUP[id] || `我通常会在这个问题出现时回到这个概念：${lesson.userSays || lesson.why}`)}</p>
          </section>

          <section id="sec-def" class="content-section reveal">
            <p class="section-no">02 / A WORKING DEFINITION</p>
            <h2>先用一句话理解</h2>
            <p class="concept-definition-copy">${escapeHTML(lesson.definition)}</p>
            ${lesson.userSays ? `<div class="user-says"><span>它通常以这个问题出现</span><p>${escapeHTML(lesson.userSays)}</p></div>` : ''}
          </section>

          <section id="sec-why" class="content-section reveal">
            <p class="section-no">03 / WHY IT MATTERS</p>
            <h2>为什么值得理解？</h2>
            <p>${escapeHTML(lesson.why)}</p>
            <div class="key-points">
              ${lesson.points.map((pt, i) => `<div><span>0${i + 1}</span><p>${escapeHTML(pt)}</p></div>`).join('')}
            </div>
          </section>

          <section id="sec-used" class="content-section reveal">
            <p class="section-no">04 / WHERE IT BECAME USEFUL</p>
            <h2>它后来出现在哪里？</h2>
            <div class="concept-evidence-list">
              ${relatedWork.map(w => `<a href="#/work/${w.id}"><span>PROJECT</span><strong>${escapeHTML(w.title)}</strong><b>↗</b></a>`).join('')}
              ${relatedNotes.map(n => `<a href="#/notes/${n.id}"><span>THOUGHT</span><strong>${escapeHTML(n.title)}</strong><b>↗</b></a>`).join('')}
              ${relatedTools.map(t => `<a href="#/toolbox/${t.id}"><span>TOOL</span><strong>${escapeHTML(t.title)}</strong><b>↗</b></a>`).join('')}
              ${relatedLessons.slice(0, 4).map(l => `<a href="#/topics/${l.id}"><span>CONCEPT</span><strong>${escapeHTML(l.title)}</strong><b>→</b></a>`).join('')}
            </div>
          </section>

          ${lesson.scenario ? scenarioMarkup(lesson) : ''}

          <section id="sec-exp" class="content-section reveal">
            <p class="section-no">${lesson.scenario ? '06' : '05'} / A REAL EXAMPLE</p>
            <h2>放进一个真实任务里</h2>
            <div class="field-note">
              <p>${escapeHTML(lesson.example)}</p>
            </div>
          </section>

          <section id="sec-pit" class="content-section reveal">
            <p class="section-no">${lesson.scenario ? '07' : '06'} / WHAT IT IS NOT</p>
            <h2>最容易误解什么？</h2>
            <ul class="pitfall-list">
              ${lesson.pitfalls.map(p => `<li><span>×</span>${escapeHTML(p)}</li>`).join('')}
            </ul>
          </section>

          <section id="sec-chk" class="content-section reveal">
            <p class="section-no">${lesson.scenario ? '08' : '07'} / NEXT TIME</p>
            <h2>下次遇到它，我会怎么做？</h2>
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

          <section id="sec-chk2" class="quick-check reveal">
            <span class="ink-label">${lesson.scenario ? '09' : '08'} / QUICK CHECK</span>
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

          <section id="sec-note" class="content-section note-section reveal">
            <p class="section-no">${lesson.scenario ? '10' : '09'} / LEAVE A NOTE</p>
            <h2>留下一段自己的理解</h2>
            <textarea id="lesson-note" rows="5" placeholder="写下理解、疑问或下一次验证的想法…">${escapeHTML(state.notes[id] || '')}</textarea>
            <div>
              <span id="note-status">${state.notes[id] ? '已有本地记录' : '尚未记录'}</span>
              <button class="secondary-action" id="save-note" type="button">保存这段笔记</button>
            </div>
          </section>
        </div>
      </div>

      ${renderRelatedTrail({ type: 'topic', id, title: lesson.title }, trailGraph)}

      <section class="lesson-finish reveal">
        <div>
          <span>TOPIC STATUS</span>
          <h2>${isCompleted(id) ? '这个术语已经学完。' : '学完定义、实验与检查清单后，标记一下。'}</h2>
          <p>进度只保存在本地，与你的学习节奏无关，与展示无关。</p>
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
      <p class="section-no">05 / HOW IT WORKS</p>
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

  return { renderTopics, renderTopicDetail };
}
