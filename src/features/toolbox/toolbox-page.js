import { esc } from "../../shared/components/content-detail.js";
import { isPublished } from "../../shared/content/validation.js";
export function renderToolboxIndex({ tools = [] } = {}) {
  const published = tools.filter(isPublished),
    history = tools.filter((x) => x.publication === "review");
  return (
    '<section class="learning-page site-container"><header class="learning-header"><p class="learning-eyebrow">TOOLBOX / 留着再用</p><h1>解决一个小问题，<br>留下一件顺手的工具。</h1><p>插件、脚本、提示词和检查清单。先看用途，再选择适合当前问题的工具。</p></header><div class="practice-grid">' +
    published
      .map(
        (x) =>
          '<article class="practice-card"><p class="learning-eyebrow">' +
          esc(x.typeLabel || x.type) +
          "</p><h2>" +
          esc(x.title) +
          "</h2><p>" +
          esc(x.problemSolved) +
          '</p><span><a href="#/toolbox/' +
          esc(x.id) +
          '">查看使用方法 ↗</a>' +
          (x.promptTemplate
            ? ' · <button class="entry-reset" type="button" data-quick-copy="' +
              esc(x.id) +
              '">复制内容</button>'
            : "") +
          "</span></article>",
      )
      .join("") +
    "</div>" +
    (!published.length
      ? '<p class="learning-empty">工具还在整理中。</p>'
      : "") +
    (history.length
      ? '<details class="learning-archive"><summary>待核实的历史内容 · ' +
        history.length +
        "</summary><p>原有方法记录保留在这里，案例与结果尚待确认。</p>" +
        history
          .map(
            (x) =>
              '<a href="#/toolbox/' +
              esc(x.id) +
              '">' +
              esc(x.title) +
              " ↗</a>",
          )
          .join("") +
        "</details>"
      : "") +
    "</section>"
  );
}
