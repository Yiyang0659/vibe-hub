import { renderLearningPage } from "../learning/page.js";
import { renderNote } from "./detail.js";
import { entryRelations } from "../../shared/components/entry-relations.js";
export function createNotesRuntime(context) {
  const { main, getAllNotes, topicsWithDomain, noteById, renderNotFound } =
    context;
  function renderNotes(params = new URLSearchParams()) {
    main.innerHTML = renderLearningPage({
      notes: getAllNotes(),
      topics: topicsWithDomain,
      params,
    });
    main
      .querySelector("#learning-search")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const query = new URLSearchParams(params);
        for (const key of ["q", "category"]) {
          const value = String(values.get(key) || "").trim();
          if (value) query.set(key, value);
          else query.delete(key);
        }
        location.hash = "#/learning?" + query.toString();
      });
    main
      .querySelector("#learning-review")
      ?.addEventListener("change", (event) => {
        const query = new URLSearchParams(params);
        if (event.target.checked) query.set("review", "1");
        else query.delete("review");
        location.hash = "#/learning?" + query;
      });
  }
  function renderNoteDetail(id) {
    const note = noteById(id);
    if (!note || note.publication === "draft") return renderNotFound();
    main.innerHTML = renderNote(note, entryRelations(note, context));
  }
  return { renderNotes, renderNoteDetail };
}
