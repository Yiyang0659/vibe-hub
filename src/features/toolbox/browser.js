import { renderColumnIntro } from '../columns/intro.js';
import { esc } from '../columns/support.js';
import { resourceCatalog } from '../columns/depth.js';
import { filterCatalog } from '../columns/explore.js';
import { icon } from '../learning/home-sections.js';
export const resourceTypes = ['工具与脚本', '清单与模板', '提示词', '外部资料'];
export function resourcesForBrowser(tools, library) {
  return resourceCatalog(tools, library).map(item => {
    const type = tools.find(t => t.id === item.id)?.type;
    const category = item.external ? '外部资料' : type === 'PROMPT' ? '提示词' : ['CHECKLIST','TEMPLATE','WORKFLOW'].includes(type) ? '清单与模板' : '工具与脚本';
    const action = item.external ? '访问原站 ↗' : type === 'CHECKLIST' ? '打开清单 →' : type === 'PROMPT' ? '查看提示词 →' : ['TEMPLATE','WORKFLOW'].includes(type) ? '查看使用方法 →' : '查看使用说明 →';
    return {...item, category, action};
  });
}
export function resourceCard(item) {
  return `<a class="rb-card" href="${esc(item.href)}" ${item.external?'target="_blank" rel="noopener noreferrer"':''}><div class="rb-card-content">${icon(item.icon)}<div><small>${esc(item.category)}</small><h2>${esc(item.title)}</h2><p>${esc(item.summary || '')}</p></div></div><span class="rb-action">${esc(item.action)}${item.external?'<span class="rb-sr-only">（新标签页）</span>':''}</span></a>`;
}
export function renderResourceBrowser(items=[]) {
  return `<section class="rb-page site-container">${renderColumnIntro('resources', items)}<header class="kb-heading" id="resource-catalog"><h2>资源目录</h2><p>把值得反复使用的工具、清单和资料，放在容易找到的地方。</p></header><div class="rb-toolbar"><nav aria-label="资源分类">${['全部',...resourceTypes].map((type,i)=>`<button type="button" data-rb-type="${i?type:''}" aria-pressed="${!i}">${type}</button>`).join('')}</nav><label class="rb-search">${icon('search')}<input id="rb-search" type="search" aria-label="搜索资源" placeholder="搜索资源名称或用途"></label></div><div class="rb-summary"><span id="rb-count" role="status"></span><button id="rb-reset" hidden>清除筛选</button></div><div class="rb-grid" id="rb-results"></div><footer class="rb-footer">外部资料将在新标签页打开。</footer></section>`;
}
export function mountResourceBrowser(root, items, params = new URLSearchParams()) {
  const input = root.querySelector('#rb-search');
  const legacy = {'工具':'工具与脚本','清单':'清单与模板','Prompt':'提示词','网站':'外部资料','开源':'外部资料'};
  let type = legacy[params.get('category')] || params.get('category') || '';
  if (!resourceTypes.includes(type)) type = '';
  input.value = params.get('q') || '';
  const update = () => {
    const found = filterCatalog(items,input.value,type);
    root.querySelector('#rb-count').textContent = `共 ${found.length} 个资源`;
    root.querySelector('#rb-reset').hidden = !type && !input.value;
    root.querySelectorAll('[data-rb-type]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.rbType===type)));
    root.querySelector('#rb-results').innerHTML = found.length ? found.map(resourceCard).join('') : '<p class="rb-empty">没有符合条件的资源。试试其他关键词，或清除筛选查看全部内容。</p>';
    const query = new URLSearchParams();
    if(type)query.set('category',type);
    if(input.value.trim())query.set('q',input.value.trim());
    history.replaceState(null,'','#/toolbox'+(query.size?'?'+query:''));
  };
  root.querySelectorAll('[data-rb-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.rbType;update();}));
  input.addEventListener('input',update);
  root.querySelector('#rb-reset').addEventListener('click',()=>{type='';input.value='';update();input.focus();});
  update();
}
