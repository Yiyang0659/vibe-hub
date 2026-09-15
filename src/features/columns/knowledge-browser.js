import {renderTermCard} from './term-preview.js';
import {bilingualText} from '../../app/language.js';
import { renderColumnIntro } from './intro.js';
import { terminologyCategories, terminologyGroups } from '../topics/glossary.js';
import { seriesDefinitions, categoryFor, knowledgeTitle } from './knowledge-data.js';
import { isPublished } from '../../shared/content/validation.js';
import { esc } from './support.js';
import { icon } from '../learning/home-sections.js';

export function termGroups(topics, query = '', category = '') {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const terms = topics.filter(t => isPublished(t) && !t.course && (!category || categoryFor(t) === category) && words.every(w => bilingualText([t.title,t.english,t.definition,t.excerpt,...(t.aliases||[])]).toLowerCase().includes(w)));
  return terminologyCategories.flatMap(c => {
    const items = terms.filter(t => categoryFor(t) === c);
    const groups = [...new Set([...(terminologyGroups[c] || []),...items.map(t => t.subcategory || '站内补充')])];
    return groups.map(g => ({category:c, title:g, items:items.filter(t => (t.subcategory || '站内补充') === g)})).filter(g => g.items.length);
  });
}
export function renderKnowledgeBrowser(topics, params = new URLSearchParams()) {
  const series = params.get('view') === 'series' || params.get('category') === '系列' || params.get('type') === '系列';
  return `<section class="kb-page site-container">${renderColumnIntro('knowledge', topics.filter(t=>isPublished(t)&&!t.course).sort((a,b)=>['rag','mvp','user-flow','api','mcp','prompt-context'].includes(b.id)-['rag','mvp','user-flow','api','mcp','prompt-context'].includes(a.id)))}<header class="kb-heading" id="knowledge-catalog"><h2>知识目录</h2><p>查清一个概念，或沿着一个主题系统学习。</p></header><div class="kb-toolbar"><nav aria-label="知识内容类型"><a href="#/topics" ${!series?'aria-current="page"':''}>术语知识</a><a href="#/topics?view=series" ${series?'aria-current="page"':''}>系列学习</a></nav><label class="kb-search">${icon('search')}<input type="search" id="kb-search" aria-label="${series?'搜索系列':'搜索术语'}" placeholder="${series?'搜索系列名称或主题':'搜索术语名称或关键词'}"></label>${!series?'<button id="kb-favorites" class="kb-favorites" aria-pressed="false">只看收藏</button>':''}</div>${series?`<p>沿着完整路径，把零散知识连成一次实践。</p><div class="kb-series" id="kb-results"></div>`:`<nav class="kb-categories" aria-label="术语分类">${terminologyCategories.map((c,i)=>`<button data-kb-category="${esc(c)}">${icon(['code','layers','cube','file','layers','tree','code','book'][i])}<span>${esc(c)}</span><small>${topics.filter(t=>isPublished(t)&&!t.course&&categoryFor(t)===c).length}</small></button>`).join('')}</nav><div class="kb-layout"><aside class="kb-sidebar"><nav class="kb-subnav" id="kb-subcategories" aria-label="二级分类"></nav></aside><div class="kb-catalog"><div class="kb-result-heading"><h2 id="kb-title">前端</h2><span id="kb-count" role="status"></span><button id="kb-clear">清除搜索</button></div><p class="kb-hint">选择左侧分组，或向下浏览当前分类。</p><div id="kb-results"></div></div></div>`}<p class="kb-source">术语目录参考 VibeHub；正文与实践章节由本站整理。学习记录保存在当前浏览器。</p></section>`;
}
// Select the most recent heading to cross the reading line below the fixed header.
export function activeKnowledgeGroup(tops, readingLine) {
  if (!tops.length) return -1;
  let index=0;
  tops.forEach((top,i)=>{if(top<=readingLine)index=i;});
  return index;
}

export function mountKnowledgeBrowser(root, topics, params = new URLSearchParams(), {isFavorite=()=>false} = {}) {
  let onlyFavorites=params.get("favorites")==="1";
  const input=root.querySelector('#kb-search'), results=root.querySelector('#kb-results');
  const series=params.get('view')==='series'||params.get('category')==='系列'||params.get('type')==='系列';
  let category=({'Agent':'AI','开发':'前端','设计':'设计风格'}[params.get('category')]||params.get('category'))||'';
  if(!terminologyCategories.includes(category)) category=terminologyCategories[0];
  input.value=params.get('q')||'';
  let frame=0;
  const syncPosition=()=>{
    frame=0;
    if(series||!results.isConnected)return;
    const groups=[...results.querySelectorAll('.kb-group')];
    const headerBottom=document.querySelector('#site-header')?.getBoundingClientRect().bottom||90;
    const active=groups[activeKnowledgeGroup(groups.map(g=>g.getBoundingClientRect().top),headerBottom+36)];
    const buttons=[...root.querySelectorAll('[data-kb-scroll]')];
    const current=buttons.find(b=>b.dataset.kbScroll===active?.id);
    if(current?.getAttribute('aria-current')==='location')return;
    buttons.forEach(b=>{if(b===current)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current');});
    // Scroll only the rail, never the document, when a long category exceeds the viewport.
    const rail=root.querySelector('.kb-sidebar');
    if(current&&rail&&window.matchMedia('(min-width: 601px)').matches){
      const box=current.getBoundingClientRect(), bounds=rail.getBoundingClientRect();
      if(box.top<bounds.top+12)rail.scrollTop+=box.top-bounds.top-12;
      else if(box.bottom>bounds.bottom-12)rail.scrollTop+=box.bottom-bounds.bottom+12;
    }
  };
  const schedulePosition=()=>{if(!frame)frame=requestAnimationFrame(syncPosition);};
  if(!series){
    window.addEventListener('scroll',schedulePosition,{passive:true});
    window.addEventListener('resize',schedulePosition);
    const lifecycle=new MutationObserver(()=>{
      if(results.isConnected)return;
      window.removeEventListener('scroll',schedulePosition);
      window.removeEventListener('resize',schedulePosition);
      cancelAnimationFrame(frame);root.removeEventListener('knowledge-favorite-changed',onFavorite);lifecycle.disconnect();
    });
    lifecycle.observe(root,{childList:true});
  }
  const update=(save=true)=>{
    if(series){
      const q=input.value.trim().toLowerCase();
      const found=seriesDefinitions.filter(s=>bilingualText([s.title,s.summary,s.category]).toLowerCase().includes(q));
      results.innerHTML=found.map(s=>`<a class="kb-series-card" href="#/topics/${esc(s.id)}">${icon(s.icon||'book')}<h2>${esc(s.title)}</h2><p>${esc(s.summary)}</p><footer><span>${s.chapters.length} 章 · 持续整理</span><strong>查看系列 →</strong></footer></a>`).join('')||'<p role="status">没有找到系列，请尝试其他关键词。</p>';
    }else{
      const groups=termGroups(onlyFavorites?topics.filter(t=>isFavorite(t.id)):topics,input.value,category);
      root.querySelector("#kb-favorites").setAttribute("aria-pressed",String(onlyFavorites));
      root.querySelector('#kb-title').textContent=category;
      root.querySelector('#kb-count').textContent=`${groups.reduce((n,g)=>n+g.items.length,0)} 条术语`;
      root.querySelector('#kb-clear').hidden=!input.value;
      root.querySelectorAll('[data-kb-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kbCategory===category)));
      const subnav=root.querySelector('#kb-subcategories');
      subnav.innerHTML=groups.map((g,i)=>`<button data-kb-scroll="kb-group-${i}"><span>${esc(g.title)}</span><small>${g.items.length}</small></button>`).join('')||'<p>没有匹配分组</p>';
      results.innerHTML=groups.map((g,i)=>`<section class="kb-group" id="kb-group-${i}" data-group-title="${esc(g.title)}"><h4>${esc(g.title)}</h4><div class="kb-terms">${g.items.map(t=>renderTermCard(t,isFavorite(t.id))).join('')}</div></section>`).join('')||'<p class="kb-empty">当前分类没有匹配内容，请更换分类、清除搜索或关闭收藏筛选。</p>';
    }
    schedulePosition();
    if(save){const q=new URLSearchParams();if(series)q.set('view','series');if(onlyFavorites)q.set('favorites','1');if(category&&!series)q.set('category',category);if(input.value.trim())q.set('q',input.value.trim());history.replaceState(null,'','#/topics'+(q.size?'?'+q:''));}
  };
  input.addEventListener('input',()=>update());
  root.querySelector('#kb-favorites')?.addEventListener('click',()=>{onlyFavorites=!onlyFavorites;update();});
  const onFavorite=()=>{if(results.isConnected)update();};
  root.addEventListener('knowledge-favorite-changed',onFavorite);
  root.querySelectorAll('[data-kb-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.kbCategory;update();}));
  root.querySelector('#kb-clear')?.addEventListener('click',()=>{input.value='';update();input.focus();});
  root.querySelector('#kb-subcategories')?.addEventListener('click',e=>{
    const b=e.target.closest('[data-kb-scroll]');if(!b)return;
    root.querySelector('#'+b.dataset.kbScroll)?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  root.addEventListener('click', e => {
    if(e.target.closest('a[href^="#/topics/"]')) {
      try { sessionStorage.setItem('knowledge-return', JSON.stringify({hash:location.hash,y:window.scrollY})); } catch {}
    }
  });
  update(false);
  try {
    const previous=JSON.parse(sessionStorage.getItem('knowledge-return')||'null');
    if(root.dataset?.restoreCatalog === 'true' && previous?.hash===location.hash) requestAnimationFrame(()=>window.scrollTo({top:previous.y,behavior:'instant'}));
  } catch {}

  if(params.get('subcategory')) [...root.querySelectorAll('[data-group-title]')].find(x=>x.dataset.groupTitle===params.get('subcategory'))?.scrollIntoView({block:'start'});
}

export function seriesSidebar(item){
  const series=seriesDefinitions.find(s=>s.chapters.some(c=>c[2]===item.id));
  if(!series)return '';
  return `<nav aria-label="系列章节" class="kb-chapter-nav"><a href="#/topics?view=series">← 全部系列</a><h2>${esc(series.title)}</h2><small>系列目录 · ${series.chapters.length} 章</small>${series.chapters.map(([t,,id],i)=>`<a href="#/topics/${esc(id)}" ${id===item.id?'aria-current="page"':''}><span>${String(i+1).padStart(2,'0')}</span>${esc(t)}</a>`).join('')}</nav>`;
}
