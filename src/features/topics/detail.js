import { renderKnowledgeDetail } from '../columns/knowledge.js';
export const renderKnowledge = renderKnowledgeDetail;
import {
  entryPage,
  section,
  esc,
  action,
} from "../../shared/components/content-detail.js";
export function renderLegacyKnowledge(
  item,
  { related = [], note = "", completed = false, favorite = false } = {},
) {
  const quiz = item.question;
  const check = quiz?.choices?.length
    ? '<section class="entry-section"><h2>' +
      esc(quiz.prompt) +
      '</h2><div class="mini-choices">' +
      quiz.choices
        .map(
          (c, i) =>
            '<button type="button" data-mini-answer="' +
            i +
            '">' +
            esc(c) +
            "</button>",
        )
        .join("") +
      '</div><p id="mini-feedback" aria-live="polite"></p></section>'
    : "";
  const personal =
    '<section class="entry-section"><h2>留下自己的理解</h2><label for="lesson-note" class="entry-hint">只保存在当前浏览器，便于下次回看。</label><textarea id="lesson-note" rows="4" class="entry-local-note">' +
    esc(note) +
    '</textarea><span id="note-status">' +
    (note ? "已有本地记录" : "尚未记录") +
    '</span><button class="entry-reset" id="save-note" type="button">保存笔记</button></section><button type="button" class="site-button entry-action" id="complete-topic">' +
    (completed ? "已读 · 点击撤销" : "标记已读") +
    '</button><button type="button" class="site-button entry-action" data-favorite="' +
    esc(item.id) +
    '">' +
    (favorite ? "已收藏 · 点击取消" : "收藏这个概念") +
    "</button>";
  return entryPage({
    item,
    label: "知识 · " + (item.english || item.category || ""),
    back: "#/learning",
    backLabel: "学习",
    summary: item.excerpt,
    body:
      section("我的理解", item.definition) +
      section("为什么有用", item.why) +
      section("要点", item.points) +
      section("一个例子", item.example) +
      section("容易混淆的地方", item.pitfalls) +
      section("下次可以检查", item.checklist) +
      action("参考来源", item.sourceUrl) +
      check +
      personal,
    related,
  });
}
