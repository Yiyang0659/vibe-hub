import {
  entryPage,
  section,
  esc,
  action,
} from "../../shared/components/content-detail.js";
export function renderTool(t, { checked = [], related = [] } = {}) {
  const types = {
    PLUGIN: "插件",
    SCRIPT: "脚本",
    CHECKLIST: "检查清单",
    PROMPT: "提示词",
    TEMPLATE: "模板",
    WORKFLOW: "工作流程",
  };
  return entryPage({
    item: t,
    label: types[t.type] || t.typeLabel || "工具",
    back: "#/toolbox",
    backLabel: "工具",
    summary: t.subtitle,
    body:
      section("解决什么问题", t.problemSolved) +
      section("什么时候使用", t.whenToUse) +
      section("使用方法", t.usage) +
      action("获取 / 打开工具", t.url) +
      section("需要准备", t.requiredInputs) +
      (t.steps?.length
        ? '<section class="entry-section"><h2>操作步骤</h2><ol>' +
          t.steps
            .map(
              (s) =>
                "<li><strong>" +
                esc(s.title) +
                "</strong><p>" +
                esc(s.detail) +
                "</p></li>",
            )
            .join("") +
          "</ol></section>"
        : "") +
      (t.checklist?.length
        ? '<section class="entry-section"><h2>检查清单</h2><p class="entry-hint">勾选进度保存在当前浏览器。</p><div class="entry-checklist">' +
          t.checklist
            .map(
              (c, i) =>
                '<label><input type="checkbox" data-tool-check="' +
                esc(t.id) +
                ":" +
                i +
                '"' +
                (checked.includes(i) ? " checked" : "") +
                "><span>" +
                esc(c) +
                "</span></label>",
            )
            .join("") +
          '</div><button class="entry-reset" id="reset-tool-checklist" type="button">重置清单</button></section>'
        : "") +
      (t.promptTemplate
        ? '<section class="entry-section"><div class="learning-browser-title"><h2>可复用正文</h2><button class="site-button" id="btn-copy-full-template" type="button">复制内容</button></div><pre class="entry-template" id="full-template-text">' +
          esc(t.promptTemplate) +
          "</pre></section>"
        : "") +
      section("使用示例", t.example) +
      section("限制与注意事项", t.limitations) +
      action("参考仓库说明", t.sourceUrl),
    related,
  });
}
