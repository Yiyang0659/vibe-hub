import { seriesDefinitions, knowledgeTitle } from './knowledge-data.js';
import { esc } from './support.js';
import { icon } from '../learning/home-sections.js';

const intros = {
 knowledge: {label:'知识 / Knowledge', title:['把没弄懂的问题，','整理成可反复查阅的知识。'], description:'记录学习 AI、产品与开发时遇到的概念与方法。需要时查清一个术语，也可以沿着系列目录，从基础开始把知识连起来。', action:'浏览知识目录', target:'knowledge-catalog', panel:'从一个问题，找到一条学习路径', symbol:'book', steps:['查清概念','串起知识','回到实践'], cards:[['file','术语知识','按方向与二级分类整理，用名称或关键词找到需要的概念。'],['layers','系列学习','沿着主题和章节逐步阅读，让零散的知识有一条清晰的路径。']], foot:'先理解一个概念，再多走一步。'},
 thinking: {label:'思考 / Thinking', title:['把理解、判断和复盘，','写成自己的思考。'], description:'留下一次学习中的疑问、一段实践后的判断，以及还在变化的想法。记录当时为什么这样想，也给之后的自己留下重新审视的空间。', action:'阅读思考记录', target:'thinking-catalog', panel:'让想法有来处，也有下一步', symbol:'file', steps:['问题与观察','判断与尝试','复盘与修正'], cards:[['book','随笔与观察','从日常学习和产品体验出发，写下自己的理解与疑问。'],['refresh','分析与复盘','关注选择的理由、实践的结果，以及下一次可以改进的地方。']], foot:'写下来，是为了下一次想得更清楚。'},
 resources: {label:'资源 / Resources', title:['把有用的方法和工具，','留给下一次使用。'], description:'把实践中用过的工具、检查清单、提示词和参考资料整理在一起。按用途查找，先了解适用场景，再决定怎样用在自己的问题里。', action:'浏览资源目录', target:'resource-catalog', panel:'从找到资料，到真正用起来', symbol:'grid', steps:['明确用途','查看方法','带回实践'], cards:[['code','工具与方法','工具、脚本、清单与提示词，附上用途和使用说明。'],['link','参考资料','值得回看的文档与网站，保留来源，方便继续深入。']], foot:'资源不必很多，重要的是下次找得到、用得上。'},
 about: {label:'关于 / About', title:['我在学习 AI，','也在把它做成真实的东西。'], description:'我是“想与做”，正在学习 AI、产品与开发。这里是我的个人学习记录平台：把遇到的问题、动手做过的项目，以及实践后的复盘认真留下来。', action:'了解我的记录方式', target:'about-methods', panel:'想与做的书桌', symbol:'book', steps:['理解问题','动手尝试','记录复盘'], cards:[['bulb','我在关注','AI 如何工作，产品怎样解决问题，以及想法如何成为真实的东西。'],['layers','我在实践','持续整理这个学习网站，也通过滑一叠等项目检验自己的理解。']], foot:'把问题摆上桌，把想法一点点做出来。'}
};
function previewCard(item, kind) {
 const href=item.href || `#/${kind==='knowledge'?'topics':'notes'}/${encodeURIComponent(item.id)}`;
 return `<a class="ci-preview-card" href="${esc(href)}" ${item.external?'target="_blank" rel="noopener noreferrer"':''}>${icon(item.icon|| (kind==='knowledge'?'book':'file'))}<div><small>${esc(item.category||'学习记录')}</small><h3>${esc(kind==='knowledge'?knowledgeTitle(item):item.title)}</h3><p>${esc(item.summary||item.oneLiner||item.excerpt||item.definition||'')}</p></div><span aria-hidden="true">→</span></a>`;
}
export function renderColumnIntro(kind, items=[]) {
 const c=intros[kind];
 if(!c)return '';
 const about=kind==='about';
 const routes={knowledge:'#/topics',thinking:'#/learning?kind=NOTE',resources:'#/toolbox'};
 const filters={knowledge:['AI','产品','前端','后端','设计风格'],thinking:['随笔','产品分析','实践复盘'],resources:['工具与脚本','清单与模板','提示词','外部资料']};
 const side=about?`<section class="ci-focus"><p class="ci-eyebrow">CURRENT FOCUS · 持续实践</p><h2>现在我在做什么</h2><ul><li>持续整理想与做的学习记录</li><li>改进滑一叠的小程序体验</li><li>把实践中的方法沉淀成知识与资源</li></ul><div class="ci-focus-foot">${icon('layers')}<span>想法 → 实践 → 真实的东西</span></div></section>`:`<div class="ci-discovery"><form data-ci-search="${routes[kind]}"><label>${icon('search')}<input type="search" aria-label="搜索${kind==='knowledge'?'知识':kind==='thinking'?'思考':'资源'}目录" placeholder="${kind==='knowledge'?'搜索：RAG / MVP / Agent / PRD …':kind==='thinking'?'搜索文章、产品分析、实践复盘 …':'搜索工具、清单、提示词 …'}" name="q"></label><button type="submit">搜索</button></form><nav aria-label="${c.label}快捷分类">${filters[kind].map(f=>`<a href="${routes[kind]}${routes[kind].includes('?')?'&':'?'}category=${encodeURIComponent(f)}">${f}</a>`).join('')}</nav><p class="ci-margin-note">${c.foot}</p></div>`;
 const selected=items.slice(0,kind==='knowledge'?6:3);
 const preview=about?`<div class="ci-about-cards">${[['cube','我在关注什么','AI、产品实践与个人知识系统。'],['refresh','我怎么做事','理解问题 → 动手实践 → 验证结果 → 复盘沉淀。'],['book','为什么做这个网站','把零散学习与项目经验，慢慢变成能复用的个人系统。']].map(([i,t,d])=>`<article>${icon(i)}<h3>${t}</h3><p>${d}</p></article>`).join('')}</div>`:`<div class="ci-overview"><section class="ci-preview"><header><h2>${kind==='knowledge'?'从这些知识开始':kind==='thinking'?'最近的思考':'值得回看的资源'}</h2><a href="#${c.target}" data-column-scroll="${c.target}">浏览完整目录 ↓</a></header><div class="ci-preview-grid" data-ci-kind="${kind}">${selected.map(item=>previewCard(item,kind)).join('')||'<p>内容正在整理，可在下方目录继续浏览。</p>'}</div>${kind==='knowledge'?`<div class="ci-series"><header><h2>系列学习</h2><a href="#/topics?view=series">全部系列 →</a></header><div>${seriesDefinitions.slice(0,2).map(s=>`<a href="#/topics/${encodeURIComponent(s.id)}">${icon('layers')}<section><h3>${esc(s.title)}</h3><small>${s.chapters.length} 章 · 持续整理</small></section><span>→</span></a>`).join('')}</div></div>`:''}</section><aside class="ci-guide"><h2>在这里你会看到</h2>${c.cards.map(([i,t,d])=>`<div>${icon(i)}<section><h3>${t}</h3><p>${d}</p></section></div>`).join('')}<p class="ci-guide-foot">${c.foot}</p></aside></div>`;
 return `<section class="ci-hero" aria-labelledby="${kind}-intro-title"><div class="ci-top"><header class="ci-copy"><p class="ci-label"><span aria-hidden="true">●</span>${c.label}</p><h1 id="${kind}-intro-title">${c.title.map(esc).join('<br>')}</h1><p class="ci-description">${esc(c.description)}</p>${about?`<a class="site-button ci-action" href="#${c.target}" data-column-scroll="${c.target}">${c.action} ↓</a>`:''}</header>${side}</div>${preview}<p class="ci-signature">THINK · BUILD · SHARE · GROW <span>想与做，和更好的可能性在一起。</span></p></section>`;
}
export function mountColumnIntro(root) {
 root.querySelectorAll('[data-ci-search]').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  const base=form.dataset.ciSearch;
  const query=new FormData(form).get('q').trim();
  location.hash=base+(base.includes('?')?'&':'?')+'q='+encodeURIComponent(query);
 }));
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 // Explicit category/search links are shortcuts to the catalog, not a new introduction.
 if(root.dataset?.restoreCatalog !== 'true' && ['q','category','view','subcategory'].some(key=>params.get(key))) {
  const first=root.querySelector('[data-column-scroll]');
  if(first)requestAnimationFrame(()=>root.querySelector('#'+first.dataset.columnScroll)?.scrollIntoView({block:'start',behavior:'instant'}));
 }
 root.querySelectorAll('[data-column-scroll]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  const target=root.querySelector('#'+link.dataset.columnScroll);
  if(!target)return;
  target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
  target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }));
}
