import { esc } from "../../shared/components/content-detail.js";
import { isPublished } from "../../shared/content/validation.js";
export function renderWorkIndex({ work = [], filterKind = "ALL" } = {}) {
  const published = work.filter(isPublished);
  const visible = published.filter(
    (x) => filterKind === "ALL" || x.kind === filterKind,
  );
  const kinds = {
    ALL: "全部",
    PROJECT: "项目",
    PROTOTYPE: "原型",
    EXPERIMENT: "小实验",
  };
  const history = work.filter((x) => x.publication === "review");
  return (
    '<section class="learning-page site-container"><header class="learning-header"><p class="learning-eyebrow">WORK / 动手实践</p><h1>把想法做一点，<br>也把过程留下来。</h1><p>记录做过的项目、小实验，以及还在推进的尝试。</p></header><div class="v-work-browser"><nav class="learning-tabs" aria-label="实践类型">' +
    Object.entries(kinds)
      .map(
        ([k, l]) =>
          '<button class="entry-reset" type="button" data-work-tab="' +
          k +
          '" aria-pressed="' +
          (filterKind === k) +
          '">' +
          l +
          " · " +
          published.filter((x) => k === "ALL" || x.kind === k).length +
          "</button>",
      )
      .join("") +
    '</nav><div class="practice-grid" style="margin-top:28px">' +
    visible
      .map(
        (x) =>
          '<a class="practice-card" href="#/work/' +
          esc(x.id) +
          '"><p class="learning-eyebrow">' +
          esc(x.statusLabel || kinds[x.kind]) +
          "</p><h2>" +
          esc(x.title) +
          "</h2><p>" +
          esc(x.summary || x.problem) +
          "</p><span>查看实践记录 →</span></a>",
      )
      .join("") +
    "</div>" +
    (!visible.length
      ? '<p class="learning-empty">这个分类还没有公开记录，先看看其他实践。</p>'
      : "") +
    "</div>" +
    (history.length
      ? '<details class="learning-archive"><summary>待核实的历史内容 · ' +
        history.length +
        "</summary><p>原有记录保留在这里，经历与结果尚待确认。</p>" +
        history
          .map(
            (x) =>
              '<a href="#/work/' + esc(x.id) + '">' + esc(x.title) + " ↗</a>",
          )
          .join("") +
        "</details>"
      : "") +
    "</section>"
  );
}
