/**
 * V4 视图层 · Toolbox 索引（views/toolbox.js）
 * 按问题域分组（蓝图 §6.10）：每一行首先回答「它帮我解决什么？」。
 * 行结构 = 问题标题（衬线）+ 工具名与类型（mono）+ 复制/打开 动作。
 * 八段详情与 checklist 持久化由 app.js 渲染。
 */

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

/** 按问题域（category）分组的行式清单 */
export function renderToolboxIndex({ tools }) {
  const groups = [...new Set(tools.map((t) => t.category || 'GENERAL'))];

  const groupHtml = groups
    .map((cat) => {
      const group = tools.filter((t) => (t.category || 'GENERAL') === cat);
      return `
        <div class="v-domain-group">
          <h3 class="c-timeline-year">${esc(cat.toUpperCase())}</h3>
          <div class="v-rows">
            ${group.map((tool) => `
              <div class="c-index-row v-tool-row">
                <div class="row-main">
                  <h3 class="row-title">${esc(tool.problemSolved || tool.subtitle || tool.title)}</h3>
                  <p class="row-desc">
                    <b class="v-tool-name">${esc(tool.title)}</b>
                    <span class="c-eyebrow">${esc(tool.typeLabel || tool.type || 'TOOL')}</span>
                  </p>
                </div>
                <span class="row-aside v-tool-actions">
                  ${tool.promptTemplate ? `<button type="button" class="c-btn c-btn--text" data-quick-copy="${esc(tool.id)}">复制</button>` : ''}
                  <a class="c-arrow-link" href="#/toolbox/${esc(tool.id)}">打开 <span class="row-arrow" aria-hidden="true">→</span></a>
                </span>
              </div>`).join('')}
          </div>
        </div>`;
    })
    .join('');

  return `
    <section class="toolbox-page page-view">
      <header class="v-section-head v-page-head">
        <div>
          <p class="c-eyebrow">06 TOOLBOX</p>
          <h1 class="v-page-title">我实际用过，而且还会再次使用的方法。</h1>
          <p class="v-page-sub">不按技术分类，按问题组织——每一行都是我曾经真实遇到过的问题，以及我为此沉淀的工具。</p>
        </div>
      </header>
      ${groupHtml || '<p class="v-empty">工具沉淀整理中。</p>'}
    </section>
  `;
}
