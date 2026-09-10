import { isPublished } from "../content/validation.js";
export function entryRelations(item, ctx) {
  const groups = [
    ["relatedTopics", ctx.topicById, "topics", "知识"],
    ["relatedNotes", ctx.noteById, "notes", "笔记"],
    ["relatedWork", ctx.workById, "work", "实践"],
    ["relatedTools", ctx.toolById, "toolbox", "工具"],
    ["relatedPapers", ctx.paperById, "reading", "阅读"],
  ];
  return groups.flatMap(([field, lookup, route, label]) =>
    (item[field] || [])
      .map((id) => lookup?.(id))
      .filter((x) => x && isPublished(x))
      .map((x) => ({
        title: x.title,
        href: "#/" + route + "/" + encodeURIComponent(x.id),
        label,
      })),
  );
}
