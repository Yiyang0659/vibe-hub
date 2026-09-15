import {esc} from './support.js';
import {knowledgeTitle} from './knowledge-data.js';

// Static teaching sketches. No controls or animations run inside directory links.
export function termPreview(item){
 let content;
 const id=item.id;
 if(id==='button')content='<span class="tp-button">保存</span><span class="tp-outline">取消</span>';
 else if(id==='switch')content='<span class="tp-switch"></span><span class="tp-switch tp-off"></span>';
 else if(id==='input')content='<span class="tp-input">输入内容 <b>│</b></span>';
 else if(id==='modal')content='<span class="tp-modal"><b>确认操作</b><i></i><span class="tp-button">确认</span></span>';
 else if(/color/.test(id))content='<span class="tp-swatch"></span><span class="tp-swatch"></span><span class="tp-swatch"></span>';
 else if(/font|typography/.test(id))content='<span class="tp-type">Aa <b>Aa</b> <i>Aa</i></span>';
 else if(/grid|flex/.test(id))content=`<span class="tp-boxes ${/flex/.test(id)?'tp-flex':''}">${'<i></i>'.repeat(6)}</span>`;
 else if(id==='api'||id==='rag')content=`<span class="tp-flow">${(id==='api'?['请求','接口','响应']:['问题','检索','回答']).map(esc).join(' → ')}</span>`;
 else content=`<span class="tp-concept"><b>${esc(item.english||knowledgeTitle(item))}</b><span>${esc(item.subcategory||item.knowledgeCategory||item.category||'')}</span><i></i></span>`;
 return `<div class="term-preview" aria-hidden="true">${content}</div>`;
}
export function renderTermCard(item,favorite=false){
 return `<article class="kb-term-card"><button type="button" class="kb-save ${favorite?'is-active':''}" data-favorite="${esc(item.id)}" aria-pressed="${favorite}" aria-label="${favorite?'取消收藏':'收藏'}：${esc(knowledgeTitle(item))}">${favorite?'★':'☆'}</button><a href="#/topics/${encodeURIComponent(item.id)}"><h3>${esc(knowledgeTitle(item))}</h3><small>${esc(item.english||'')}</small><p>${esc(item.excerpt||item.definition||'')}</p>${termPreview(item)}</a></article>`;
}
