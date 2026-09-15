import { renderThinkingBrowser, mountThinkingBrowser, renderThinkingReading, mountThinkingReading } from '../columns/thinking-browser.js';
import { renderKnowledgeBrowser, mountKnowledgeBrowser } from '../columns/knowledge-browser.js';
import { mountExplore, knowledgeCatalog } from '../columns/explore.js';
import { thinkingCatalog } from '../columns/depth.js';
import { renderThinkingDetail, mountDetailScroll, thinkingArticles } from '../columns/thinking-details.js';
import { renderKnowledgeColumn, renderThinkingColumn } from '../columns/pages.js';
import { mountHomePreviews } from '../learning/home-sections.js';
import { renderLearningPage } from "../learning/page.js";
import { renderNote } from "./detail.js";
import { entryRelations } from "../../shared/components/entry-relations.js";
export function createNotesRuntime(context) {
  const { main, getAllNotes, topicsWithDomain, noteById, renderNotFound } =
    context;
  function renderNotes(params = new URLSearchParams()) {
    if (params.get("kind") === "CONCEPT" && !params.has("review")) {
      main.innerHTML = renderKnowledgeBrowser(topicsWithDomain, params);
      mountKnowledgeBrowser(main, topicsWithDomain, params);
      return;
    }
    if (params.get("kind") === "NOTE" && !params.has("review")) {
      main.innerHTML = renderThinkingBrowser(getAllNotes());
      mountThinkingBrowser(main, getAllNotes(), params);
      return;
    }
    if (["CONCEPT", "NOTE"].includes(params.get("kind")) && !params.has("review")) {
      main.innerHTML = params.get("kind") === "CONCEPT" ? renderKnowledgeColumn(topicsWithDomain) : renderThinkingColumn(getAllNotes());
      mountHomePreviews(main);
      mountExplore(main, params.get("kind") === "CONCEPT" ? knowledgeCatalog(topicsWithDomain) : thinkingCatalog(getAllNotes()), params);
      return;
    }
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
    if (thinkingArticles.some(x=>x.id===id)) { main.innerHTML = renderThinkingDetail(id); mountDetailScroll(main); return; }
    const note = noteById(id);
    if (!note || note.publication === "draft") return renderNotFound();
    main.innerHTML = renderThinkingReading(note, entryRelations(note, context));
    mountThinkingReading(main);
  }
  return { renderNotes, renderNoteDetail };
}
