import { isPublished } from "../../shared/content/validation.js";
export const KINDS = {
  ALL: "全部",
  CONCEPT: "知识",
  NOTE: "笔记",
  LOG: "成长记录",
};
export function learningItems({
  notes = [],
  topics = [],
  includeReview = false,
} = {}) {
  const visible = (x) =>
    x.publication !== "draft" && (includeReview || isPublished(x));
  return [
    ...notes
      .filter(visible)
      .map((x) => ({
        ...x,
        kind: x.kind === "LOG" ? "LOG" : "NOTE",
        excerpt: x.oneLiner || x.myTake || x.myUnderstanding,
        href: "#/notes/" + encodeURIComponent(x.id),
      })),
    ...topics
      .filter(visible)
      .map((x) => ({
        ...x,
        kind: "CONCEPT",
        href: "#/topics/" + encodeURIComponent(x.id),
      })),
  ].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
export function filterLearning(
  items,
  { q = "", category = "", kind = "ALL", collection } = {},
) {
  const words = q.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(
    (x) =>
      (kind === "ALL" || x.kind === kind) &&
      (!category || x.category === category) &&
      (!collection ||
        collection.items.some((r) => r.id === x.id && r.kind === x.kind)) &&
      words.every((w) =>
        [x.title, x.english, x.excerpt, x.category, ...(x.tags || [])]
          .join(" ")
          .toLocaleLowerCase()
          .includes(w),
      ),
  );
}
