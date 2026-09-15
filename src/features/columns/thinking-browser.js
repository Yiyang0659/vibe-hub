import {bilingualText} from '../../app/language.js';
import { renderColumnIntro } from './intro.js';
import {esc,safeText} from './support.js';
import {isPublished,safeHref} from '../../shared/content/validation.js';
import {icon} from '../learning/home-sections.js';
export const thinkingTypes=['随笔','产品分析','实践复盘'];
export function thinkingType(n){return n.kind==='LOG'||/复盘/.test(n.category||'')?'实践复盘':/分析|拆解/.test(n.category||'')?'产品分析':'随笔';}
export function findThinking(notes,q='',type=''){
 const words=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return notes.filter(isPublished).filter(n=>(!type||thinkingType(n)===type)&&words.every(w=>bilingualText([n.title,n.oneLiner,n.category,...thinkingSections(n).map(section=>section[2])]).toLowerCase().includes(w))).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
}
export function renderThinkingBrowser(notes=[]){return `<section class="tb-page site-container">${renderColumnIntro('thinking', findThinking(notes))}<header class="kb-heading" id="thinking-catalog"><h2>思考记录</h2><p>留下学习中的判断、实践后的复盘，以及还在变化的想法。</p></header><div class="kb-toolbar"><nav aria-label="思考分类">${['全部',...thinkingTypes].map((t,i)=>`<button data-tb-type="${i?t:''}" aria-pressed="${!i}">${t}</button>`).join('')}</nav><label class="kb-search">${icon('search')}<input type="search" aria-label="搜索文章" id="tb-search" placeholder="搜索文章标题或内容"></label></div><div class="tb-list-heading"><span id="tb-count" role="status"></span><button id="tb-clear" hidden>清除筛选</button></div><div id="tb-list" class="tb-list"></div><footer class="tb-footer">想与做 · 记录、实践、持续成长</footer></section>`;}
export function mountThinkingBrowser(root,notes,params=new URLSearchParams()){
 let type=params.get('category')||'';if(!thinkingTypes.includes(type))type='';
 const input=root.querySelector('#tb-search');input.value=params.get('q')||'';
 const update=(save=true)=>{
 const found=findThinking(notes,input.value,type);
 root.querySelector('#tb-count').textContent=`${found.length} 篇记录`;
 root.querySelector('#tb-clear').hidden=!type&&!input.value;
 root.querySelectorAll('[data-tb-type]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tbType===type)));
 root.querySelector('#tb-list').innerHTML=found.map(n=>`<a class="tb-row" href="#/notes/${encodeURIComponent(n.id)}"><div class="tb-meta">${n.date?`<time datetime="${esc(n.date)}">${esc(n.date)}</time>`:''}<span>${thinkingType(n)}</span></div><div><h2>${esc(n.title)}</h2><p>${esc(n.oneLiner||'')}</p></div><span class="tb-arrow" aria-hidden="true">→</span></a>`).join('')||'<p class="tb-empty">没有找到符合条件的文章。可以清除筛选，浏览已有记录。</p>';
 if(save){const q=new URLSearchParams({kind:'NOTE'});if(type)q.set('category',type);if(input.value.trim())q.set('q',input.value.trim());history.replaceState(null,'','#/learning?'+q);}
 };
 input.addEventListener('input',()=>update());root.querySelectorAll('[data-tb-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.tbType;update();}));
 root.querySelector('#tb-clear').addEventListener('click',()=>{type='';input.value='';update();input.focus();});
 root.querySelector('#tb-list').addEventListener('click',e=>{if(e.target.closest('a'))try{sessionStorage.setItem('thinking-return',JSON.stringify({hash:location.hash,y:scrollY}));}catch{}});
 update(false);
 try{const prev=JSON.parse(sessionStorage.getItem('thinking-return')||'null');if(root.dataset?.restoreCatalog === 'true' && prev?.hash===location.hash)requestAnimationFrame(()=>scrollTo({top:prev.y,behavior:'instant'}));}catch{}
}
export function thinkingSections(n){return [['question','遇到的问题',n.question],['understanding','理解与尝试',n.myUnderstanding],['example','例子与观察',n.example],['take','目前的结论',n.myTake],['unresolved','仍待验证',n.unresolved],['next','下一步',n.nextSteps],['sources','参考来源',n.sources]].filter(x=>x[2]&&(!Array.isArray(x[2])||x[2].length));}
export function renderThinkingReading(n,related=[]){const sections=thinkingSections(n);return `<article class="tb-page tb-reading site-container"><div class="tb-reading-grid"><div class="tb-article"><header><nav aria-label="面包屑"><a href="#/learning?kind=NOTE" data-tb-back>思考</a> / ${thinkingType(n)}</nav><h1>${esc(n.title)}</h1>${n.date?`<time datetime="${esc(n.date)}">${esc(n.date)}</time>`:''}<p class="tb-lead">${esc(n.oneLiner||'')}</p></header>${sections.map(([id,title,value])=>`<section id="tb-${id}" class="${id==='take'?'tb-take':''}"><h2>${title}</h2>${safeText(value)}</section>`).join('')}${related.length?`<section><h2>相关内容</h2><div class="tb-related">${related.filter(r=>safeHref(r.href)).slice(0,4).map(r=>`<a href="${esc(safeHref(r.href))}"><span>${esc(r.label)} · ${esc(r.title)}</span><span>→</span></a>`).join('')}</div></section>`:''}<a class="tb-back" data-tb-back href="#/learning?kind=NOTE">← 返回思考列表</a></div><aside class="tb-toc"><h2>${icon('file')}本文目录</h2><nav aria-label="本文目录">${sections.map(([id,t],i)=>`<a href="#/notes/${encodeURIComponent(n.id)}" data-tb-scroll="tb-${id}"><span>${String(i+1).padStart(2,'0')}</span>${t}</a>`).join('')}</nav></aside></div></article>`;}
export function mountThinkingReading(root){root.querySelectorAll('[data-tb-scroll]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const target=root.querySelector('#'+a.dataset.tbScroll);target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});root.querySelectorAll('[data-tb-scroll]').forEach(x=>x.setAttribute('aria-current',x===a?'location':'false'));}));try{const prev=JSON.parse(sessionStorage.getItem('thinking-return')||'null');if(prev?.hash?.startsWith('#/learning?')&&new URLSearchParams(prev.hash.split('?')[1]).get('kind')==='NOTE')root.querySelectorAll('[data-tb-back]').forEach(a=>a.setAttribute('href',prev.hash));}catch{}}
