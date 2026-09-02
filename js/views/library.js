/**
 * V4 视图层 · Library 索引（views/library.js）
 * 紧凑精选清单（蓝图 §6.11）：名称 + 一句话 + 留下理由（whySaved 必填）。
 * 不做收藏夹式的卡片墙——每条资源必须说明「为什么值得我留下」。
 */

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

const TYPE_LABEL = { WEBSITE: 'Website', ARTICLE: 'Article', GITHUB: 'GitHub', TOOL: 'Tool', COURSE: 'Course', NEWSLETTER: 'Newsletter' };

/** 按类型分组的精选清单 */
export function renderLibraryIndex({ items }) {
  const types = [...new Set(items.map((i) => i.type || 'WEBSITE'))];

  const groupHtml = types
    .map((type) => {
      const group = items.filter((i) => (i.type || 'WEBSITE') === type);
      return `
        <div class="v-domain-group">
          <h3 class="c-timeline-year">${esc((TYPE_LABEL[type] || type).toUpperCase())} <span>${group.length}</span></h3>
          <div class="v-rows">
            ${group.map((item) => `
              <a class="c-index-row" href="${esc(item.url)}" target="_blank" rel="noreferrer">
                <div class="row-main">
                  <h3 class="row-title">${esc(item.title)} <span class="v-ext" aria-hidden="true">↗</span></h3>
                  <p class="row-desc">${esc(item.whyRecommend)}</p>
                  ${item.whatILearned ? `<p class="row-desc v-lib-learned">我从中借鉴：${esc(item.whatILearned)}</p>` : ''}
                </div>
                <span class="row-aside">${esc(item.author || '')}</span>
              </a>`).join('')}
          </div>
        </div>`;
    })
    .join('');

  return `
    <section class="library-resources-page page-view">
      <header class="v-section-head v-page-head">
        <div>
          <p class="c-eyebrow">07 LIBRARY</p>
          <h1 class="v-page-title">我觉得值得留下的资料。</h1>
          <p class="v-page-sub">拒绝无脑收藏——每一条都必须回答「为什么值得留下」和「我从中借鉴了什么」。</p>
        </div>
      </header>
      ${groupHtml || '<p class="v-empty">还没有留下资料。</p>'}
    </section>
  `;
}
