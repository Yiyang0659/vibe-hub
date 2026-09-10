import { renderTool } from "./detail.js";
import { entryRelations } from "../../shared/components/entry-relations.js";
export function createToolboxRuntime(context) {
  const {
    main,
    state,
    getAllToolbox,
    toolById,
    renderToolboxIndex,
    renderNotFound,
    showToast,
    saveState,
  } = context;
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("已复制到剪贴板");
    } catch {
      showToast("复制失败，请选中正文手动复制");
    }
  }
  function renderToolbox() {
    main.innerHTML = renderToolboxIndex({ tools: getAllToolbox() });
    main
      .querySelectorAll("[data-quick-copy]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          copy(toolById(btn.dataset.quickCopy)?.promptTemplate || ""),
        ),
      );
  }
  function renderToolboxDetail(id) {
    const tool = toolById(id);
    if (!tool || tool.publication === "draft") return renderNotFound();
    state.toolChecklist ||= {};
    main.innerHTML = renderTool(tool, {
      checked: state.toolChecklist[id] || [],
      related: entryRelations(tool, context),
    });
    main
      .querySelector("#btn-copy-full-template")
      ?.addEventListener("click", () => copy(tool.promptTemplate));
    main.querySelectorAll("[data-tool-check]").forEach((box) =>
      box.addEventListener("change", () => {
        const index = Number(box.dataset.toolCheck.split(":").pop());
        const done = new Set(state.toolChecklist[id] || []);
        if (box.checked) done.add(index);
        else done.delete(index);
        state.toolChecklist[id] = [...done];
        saveState();
      }),
    );
    main
      .querySelector("#reset-tool-checklist")
      ?.addEventListener("click", () => {
        state.toolChecklist[id] = [];
        saveState();
        main.querySelectorAll("[data-tool-check]").forEach((box) => {
          box.checked = false;
        });
        showToast("已重置清单");
      });
  }
  return { renderToolbox, renderToolboxDetail };
}
