import { entryPage, section } from "../../shared/components/content-detail.js";
export function renderNote(n, related = []) {
  const log = n.kind === "LOG";
  return entryPage({
    item: n,
    label: log ? "成长记录" : "学习笔记",
    back: "#/learning",
    backLabel: "学习",
    summary: n.oneLiner,
    body:
      section(log ? "变化从哪里开始" : "遇到的问题", n.question) +
      section(log ? "现在的理解" : "理解与尝试", n.myUnderstanding) +
      section("例子与观察", n.example) +
      section("目前的结论", n.myTake) +
      section("仍待验证", n.unresolved) +
      section("下一步", n.nextSteps) +
      section("参考来源", n.sources),
    related,
  });
}
