import { esc } from "../../shared/components/content-detail.js";
import { isPublished } from "../../shared/content/validation.js";
import { collections } from "./data.js";
import { learningItems, filterLearning } from "./model.js";
import { learningRow } from "./page.js";
export function homeLearningSections(ctx) {
  const items = learningItems({ notes: ctx.notes, topics: ctx.lessons });
  const collection = collections.find(
    (c) => filterLearning(items, { collection: c }).length,
  );
  const recent = items.filter((x) => x.kind !== "LOG").slice(0, 5);
  const log = items.find((x) => x.kind === "LOG");
  const builds = [
    ...(ctx.toolbox || [])
      .filter(isPublished)
      .map((x) => ({
        ...x,
        label:
          x.type === "SCRIPT"
            ? "脚本工具"
            : x.type === "PLUGIN"
              ? "插件"
              : "工具与方法",
        desc: x.problemSolved,
        href: "#/toolbox/" + x.id,
      })),
    ...(ctx.work || [])
      .filter(isPublished)
      .map((x) => ({
        ...x,
        label: x.statusLabel || "实践",
        desc: x.summary || x.problem,
        href: "#/work/" + x.id,
      })),
  ].slice(0, 4);
  return (
    (collection
      ? '<section class="zh-section"><div class="zh-container"><p class="learning-eyebrow">CURRENTLY LEARNING</p><div class="home-learning-intro"><h2>正在学习，也正在尝试。</h2><a href="#/learning">全部学习记录 →</a></div><a class="learning-collection" href="#/learning?collection=' +
        esc(collection.id) +
        '"><div><p class="learning-eyebrow">持续整理 · ' +
        filterLearning(items, { collection }).length +
        " 条记录</p><h3>" +
        esc(collection.title) +
        "</h3><p>" +
        esc(collection.description) +
        '</p></div><span aria-hidden="true">↗</span></a></div></section>'
      : "") +
    (recent.length
      ? '<section class="zh-section"><div class="zh-container"><p class="learning-eyebrow">RECENT NOTES</p><div class="home-learning-intro"><h2>最近留下的理解。</h2><a href="#/learning">浏览全部 →</a></div><div class="home-learning-list">' +
        recent.map(learningRow).join("") +
        "</div></div></section>"
      : "") +
    (builds.length
      ? '<section class="zh-section"><div class="zh-container"><p class="learning-eyebrow">MADE & MAKING</p><div class="home-learning-intro"><h2>动手做过，留着再用。</h2><a href="#/toolbox">打开工具箱 →</a></div><div class="home-build-grid">' +
        builds
          .map(
            (x) =>
              '<a class="home-build-card" href="' +
              esc(x.href) +
              '"><p class="learning-eyebrow">' +
              esc(x.label) +
              "</p><h3>" +
              esc(x.title) +
              "</h3><p>" +
              esc(x.desc) +
              "</p><span>查看记录 ↗</span></a>",
          )
          .join("") +
        "</div></div></section>"
      : "") +
    (log
      ? '<section class="zh-section"><div class="zh-container"><a class="home-learning-log" href="' +
        esc(log.href) +
        '"><p class="learning-eyebrow">最近的变化 · ' +
        esc(log.date) +
        "</p><h2>" +
        esc(log.title) +
        "</h2><p>" +
        esc(log.excerpt) +
        "</p><span>读这条成长记录 →</span></a></div></section>"
      : "")
  );
}
