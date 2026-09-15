import { designProjects } from "./design-projects.js";
import { renderWorkDetailPage } from "./detail.js";
import { entryRelations } from "../../shared/components/entry-relations.js";
export function createWorkRuntime(context) {
  const { main, getAllWork, workById, renderWorkIndex, renderNotFound } =
    context;
  function bindSections() {
    main.querySelectorAll('[data-project-section]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const target = main.querySelector('#' + link.dataset.projectSection);
      target?.scrollIntoView({ behavior: globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
    }));
  }
  function renderWork(filterKind = "ALL") {
    const returningFromDetail = !!main.querySelector('.pr-detail, .ds-project');
    main.innerHTML = renderWorkIndex({ work: getAllWork(), filterKind });
    bindSections();
    // Store the listing position only when opening one of its project records.
    main.querySelectorAll('a[href^="#/projects/"]').forEach(link => link.addEventListener('click', () => {
      try { sessionStorage.setItem('project-list-position', String(scrollY)); } catch {}
    }));
    try {
      const saved = sessionStorage.getItem('project-list-position');
      const y = saved === null ? NaN : Number(saved);
      if (returningFromDetail && Number.isFinite(y) && y >= 0) requestAnimationFrame(() => scrollTo({top:y,behavior:'instant'}));
    } catch {}
    main.querySelectorAll("[data-work-tab]").forEach((btn) =>
      btn.addEventListener("click", () => {
        renderWork(btn.dataset.workTab);
        main
          .querySelector('[data-work-tab="' + btn.dataset.workTab + '"]')
          ?.focus();
      }),
    );
  }
  function renderWorkDetail(id) {
    const work = workById(id) || designProjects.find(x => x.id === id);
    if (!work || work.publication === "draft") return renderNotFound();
    main.innerHTML = renderWorkDetailPage(work, entryRelations(work, context));
    bindSections();
    const requested = new URLSearchParams(location.hash.split('?')[1] || '').get('record');
    if (requested && work.journal?.some(r => r.id === requested)) {
      const record = [...main.querySelectorAll('.pr-record')].find(element => element.id === 'record-' + requested);
      if (record) { record.open = true; requestAnimationFrame(() => {record.scrollIntoView({block:'start',behavior:'instant'});record.querySelector('summary')?.focus({preventScroll:true});}); }
    }
  }
  return { renderWork, renderWorkDetail };
}
