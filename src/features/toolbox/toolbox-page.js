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

  const toolHtml = tools.map((tool, index) => `
    <article class="c-index-row v-tool-row">
      <div class="row-main">
        <p class="v-tool-card-meta"><span>0${index + 1}</span>${esc(tool.category || 'GENERAL')}</p>
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
    </article>`).join('');

  return `
    <section class="toolbox-page page-view portfolio-index">
      <header class="v-section-head v-page-head v-page-hero">
        <div class="v-page-copy">
          <p class="c-eyebrow">06 TOOLBOX</p>
          <h1 class="v-page-title">我实际用过，而且还会再次使用的方法。</h1>
          <p class="v-page-sub">不按技术分类，按问题组织——每一行都是我曾经真实遇到过的问题，以及我为此沉淀的工具。</p>
        </div>
        <dl class="v-page-facts" aria-label="工具概览">
          <div><dt>${tools.length}</dt><dd>可用工具</dd></div>
          <div><dt>${groups.length}</dt><dd>问题方向</dd></div>
          <div><dt>复用</dt><dd>选择标准</dd></div>
        </dl>
      </header>
      <div class="v-tool-grid">${toolHtml || '<p class="v-empty">工具沉淀整理中。</p>'}</div>
    </section>
  `;
}
