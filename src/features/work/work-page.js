import { renderRecentRecords } from './journal.js';
import { icon } from '../learning/home-sections.js';
import { windowSketch, columnTail } from '../columns/pages.js';
import { esc } from '../../shared/components/content-detail.js';
import { isPublished } from '../../shared/content/validation.js';
import { designProjects } from './design-projects.js';
export function renderWorkIndex({work=[],filterKind='ALL'}={}) {
 const actual=work.filter(isPublished);
 const all=[...actual,...designProjects.filter(x=>!work.some(w=>w.id===x.id))];
 const visible=all.filter(x=>filterKind==='ALL'||x.kind===filterKind);
 const history=work.filter(x=>x.publication==='review');
 return `<section class="projects-page pc-page cl-page cl-projects site-container"><div class="pc-index-hero"><header class="projects-heading"><p class="hp-label">项目 / Projects</p><h1>把想法做成真正<br>可以使用的项目。</h1><p>记录 AI、产品与开发中的实践，<br>留下问题、取舍、验证与阶段思考。</p><div class="pc-actions"><a class="site-button project-button" href="#project-records" data-project-section="project-records">查看项目记录 ↓</a></div></header><div><div class="pc-stats"><div>${icon('cube','green')}<strong>${all.length}</strong><span>个项目记录</span><small>从想法到实践</small></div><div>${icon('file')}<strong>${actual.length}</strong><span>个开发实践</span><small>动手构建与验证</small></div><div>${icon('code','green')}<strong>${all.filter(x=>x.designOnly).length}</strong><span>个方案探索</span><small>寻找更好的可能性</small></div></div><div class="cl-project-art"><p>“每一次实践，<br>都留下下一次的起点。”</p>${windowSketch()}</div></div></div>
 <div class="pc-project-grid" id="pc-projects">${visible.map((x,i)=>`<article class="pc-project-card"><header>${icon(['book','layers','code'][i%3],i===1?'blue':'green')}<div><h2>${esc(x.displayTitle||x.title)}</h2><p>${esc(x.subtitle||x.domain||'实践记录')}</p></div></header><div class="project-meta"><span class="project-status">${esc(x.statusLabel||'持续记录')}</span></div><p>${esc(x.summary||x.problem)}</p><div class="pr-card-facts"><p>◎ <strong>实践重点：</strong>${esc(x.practiceFocus||'实践记录')}</p><p>↗ <strong>${x.designOnly?'当前状态':'最近进展'}：</strong>${esc(x.latestUpdate||'持续整理')}</p></div><a href="#/projects/${encodeURIComponent(x.id)}">${x.designOnly?'查看方案记录':'查看项目过程'} →</a><span class="cl-project-card-art art-${i}" aria-hidden="true"><img src="./assets/columns/projects-reference.png" alt=""></span></article>`).join('')}</div>
 ${!visible.length?'<p class="learning-empty">暂时没有匹配的项目。</p>':''}<p class="pr-divider">项目记录结果，也记录选择与变化。</p>${renderRecentRecords(visible)}${history.length?`<details class="learning-archive"><summary>待核实的历史内容 · ${history.length}</summary>${history.map(x=>`<a href="#/projects/${encodeURIComponent(x.id)}">${esc(x.title)}</a>`).join('')}</details>`:''}${columnTail}</section>`;
}
