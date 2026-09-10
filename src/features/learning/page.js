import { esc } from "../../shared/components/content-detail.js";
import { KINDS, learningItems, filterLearning } from "./model.js";
import { collections } from "./data.js";
export function learningRow(x) {
  return (
    '<a class="learning-row" href="' +
    esc(x.href) +
    '"><div class="learning-row-meta"><span>' +
    esc(KINDS[x.kind]) +
    "</span><time>" +
    esc(x.date || "") +
    '</time></div><div class="learning-row-copy"><h3>' +
    esc(x.title) +
    "</h3><p>" +
    esc(x.excerpt || "") +
    "</p><small>" +
    esc(x.category || "") +
    (x.publication === "review" ? " · 待核实" : "") +
    '</small></div><span class="learning-row-arrow" aria-hidden="true">↗</span></a>'
  );
}
export function renderLearningPage({
  notes = [],
  topics = [],
  params = new URLSearchParams(),
} = {}) {
  const includeReview = params.get("review") === "1",
    items = learningItems({ notes, topics, includeReview });
  const collection = collections.find((x) => x.id === params.get("collection"));
  const filters = {
    q: params.get("q") || "",
    category: params.get("category") || "",
    kind: KINDS[params.get("kind")] ? params.get("kind") : "ALL",
    collection,
  };
  const visible = filterLearning(items, filters);
  const categories = [
    ...new Set(items.map((x) => x.category).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "zh-CN"));
  const changeKind = (k) => {
    const query = new URLSearchParams(params);
    query.set("kind", k);
    return "#/learning?" + esc(query.toString());
  };
  const active = collections
    .map((c) => ({
      ...c,
      count: filterLearning(items, { collection: c }).length,
    }))
    .filter((c) => c.count);
  return (
    '<section class="learning-page site-container"><header class="learning-header"><p class="learning-eyebrow">LEARNING / 持续积累</p><h1>把学到的，慢慢变成自己的。</h1><p>从一个概念、一段笔记开始，留下理解、尝试和新的发现。</p><div class="learning-header-links"><a href="#/topics">全部知识索引 ↗</a><a href="#/reading">阅读与资料 ↗</a></div></header>' +
    (active.length
      ? '<section class="learning-collections" aria-label="学习专题">' +
        active
          .map(
            (c) =>
              '<a class="learning-collection" href="#/learning?collection=' +
              esc(c.id) +
              '"><div><p class="learning-eyebrow">正在整理 · ' +
              c.count +
              " 条记录</p><h2>" +
              esc(c.title) +
              "</h2><p>" +
              esc(c.description) +
              '</p></div><span aria-hidden="true">↗</span></a>',
          )
          .join("") +
        "</section>"
      : "") +
    '<section class="learning-browser"><div class="learning-browser-title"><h2>' +
    esc(collection?.title || "学习记录") +
    '</h2><a href="#/learning">清除筛选</a></div>' +
    '<form id="learning-search" class="learning-search" role="search"><label class="learning-query"><span>搜索记录</span><input name="q" type="search" placeholder="搜索概念、问题或关键词" value="' +
    esc(filters.q) +
    '"></label><label><span>主题</span><select name="category"><option value="">全部主题</option>' +
    categories
      .map(
        (c) =>
          "<option" +
          (c === filters.category ? " selected" : "") +
          ">" +
          esc(c) +
          "</option>",
      )
      .join("") +
    '</select></label><button type="submit" class="site-button">查找</button></form>' +
    '<nav class="learning-tabs" aria-label="记录类型">' +
    Object.entries(KINDS)
      .map(
        ([k, label]) =>
          '<a href="' +
          changeKind(k) +
          '"' +
          (filters.kind === k ? ' aria-current="page"' : "") +
          ">" +
          label +
          "<span>" +
          filterLearning(items, { ...filters, kind: k }).length +
          "</span></a>",
      )
      .join("") +
    "</nav>" +
    '<div class="learning-results" aria-live="polite"><p class="learning-count">' +
    visible.length +
    " 条记录" +
    (collection ? " · 专题筛选中" : "") +
    "</p>" +
    (visible.map(learningRow).join("") ||
      '<div class="learning-empty"><h3>没有找到匹配的记录</h3><p>换一个关键词，或清除筛选查看已有内容。</p><a href="#/learning">清除筛选 →</a></div>') +
    "</div>" +
    '<label class="learning-review-toggle"><input id="learning-review" type="checkbox"' +
    (includeReview ? " checked" : "") +
    "> 显示待核实的历史记录</label></section></section>"
  );
}
