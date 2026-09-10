import {
  entryPage,
  section,
  esc,
  action,
} from "../../shared/components/content-detail.js";
import { safeHref } from "../../shared/content/validation.js";
export function renderWorkDetailPage(w, related = []) {
  return entryPage({
    item: w,
    label: w.kind === "EXPERIMENT" ? "小实验" : "项目与实践",
    back: "#/work",
    backLabel: "项目",
    summary: w.summary,
    body:
      section("当前状态", w.statusLabel) +
      (safeHref(w.screenshot)
        ? '<figure class="entry-cover"><img src="' +
          esc(w.screenshot) +
          '" alt="' +
          esc(w.title) +
          '界面" loading="lazy"></figure>'
        : "") +
      section("为什么做", w.problem) +
      section("做了什么", w.solution) +
      section("我的参与", w.role) +
      section("关键选择", w.keyDecisions) +
      section("遇到的问题", w.challenge) +
      section("如何验证", w.validation) +
      section("目前结果", w.result) +
      section("复盘与认识", w.whatILearned) +
      action("查看演示", w.demoUrl) +
      action("查看仓库", w.repoUrl),
    related,
  });
}
