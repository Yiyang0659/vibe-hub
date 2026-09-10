import { renderWorkDetailPage } from "./detail.js";
import { entryRelations } from "../../shared/components/entry-relations.js";
export function createWorkRuntime(context) {
  const { main, getAllWork, workById, renderWorkIndex, renderNotFound } =
    context;
  function renderWork(filterKind = "ALL") {
    main.innerHTML = renderWorkIndex({ work: getAllWork(), filterKind });
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
    const work = workById(id);
    if (!work || work.publication === "draft") return renderNotFound();
    main.innerHTML = renderWorkDetailPage(work, entryRelations(work, context));
  }
  return { renderWork, renderWorkDetail };
}
