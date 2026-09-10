import { safeHref } from "../content/validation.js";
export const esc = (value = "") =>
  String(value ?? "").replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
export function section(title, value) {
  if (!value || (Array.isArray(value) && !value.length)) return "";
  return (
    '<section class="entry-section"><h2>' +
    esc(title) +
    "</h2>" +
    (Array.isArray(value)
      ? "<ul>" + value.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>"
      : "<p>" + esc(value) + "</p>") +
    "</section>"
  );
}
export function action(label, href) {
  const url = safeHref(href);
  return url
    ? '<a class="site-button entry-action" href="' +
        esc(url) +
        '"' +
        (/^https?:/.test(url)
          ? ' target="_blank" rel="noopener noreferrer"'
          : "") +
        ">" +
        esc(label) +
        " ↗</a>"
    : "";
}
export function relatedLinks(items = []) {
  const links = items
    .filter((x) => x?.title && safeHref(x.href))
    .map(
      (x) =>
        '<a href="' +
        esc(x.href) +
        '"><span>' +
        esc(x.label || "相关内容") +
        "</span><strong>" +
        esc(x.title) +
        '</strong><b aria-hidden="true">→</b></a>',
    );
  return links.length
    ? '<aside class="entry-related"><h2>沿着这条记录继续</h2>' +
        links.join("") +
        "</aside>"
    : "";
}
export function entryPage({
  item,
  label,
  back,
  backLabel,
  summary,
  body,
  related = [],
}) {
  return (
    '<article class="learning-entry site-container"><nav class="entry-breadcrumb" aria-label="面包屑"><a href="' +
    back +
    '">' +
    backLabel +
    "</a><span>/</span><span>" +
    esc(label) +
    '</span></nav><header class="entry-header"><p class="learning-eyebrow">' +
    esc(label) +
    (item.date ? " · " + esc(item.date) : "") +
    (item.updated && item.updated !== item.date
      ? " · 更新于 " + esc(item.updated)
      : "") +
    "</p><h1>" +
    esc(item.title) +
    "</h1>" +
    (summary ? '<p class="entry-summary">' + esc(summary) + "</p>" : "") +
    (item.publication === "review"
      ? '<p class="entry-review">历史内容 · 待核实：其中的经历与结果尚未确认。</p>'
      : "") +
    '</header><div class="entry-body">' +
    body +
    relatedLinks(related) +
    "</div></article>"
  );
}
