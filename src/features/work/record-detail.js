import { esc, action, relatedLinks } from '../../shared/components/content-detail.js';
import { safeHref } from '../../shared/content/validation.js';
import { icon } from '../learning/home-sections.js';
import { columnTail } from '../columns/pages.js';
import { projectMeta } from './presentation.js';
import { renderProjectJournal } from './journal.js';

const paragraph = (text, className = '') => text?.trim()
  ? `<p${className ? ` class="${className}"` : ''}>${esc(text)}</p>` : '';
const list = items => items?.length
  ? `<ul class="pr-text-list">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';

function visual(w) {
  const src = safeHref(w.screenshot);
  if (src) return `<figure class="pr-evidence-visual"><img src="${esc(src)}" alt="${esc(w.title)}项目界面"><figcaption>${esc(w.coverCaption || '项目界面')}</figcaption></figure>`;
  const paths = w.visualPaths || (w.modules || []).slice(0, 2);
  if (!paths.length && !w.visualOutcome) return '';
  return `<figure class="pr-evidence-visual pr-process-visual"><div class="pc-window-dots" aria-hidden="true">● ● ●</div><h2>${icon('layers')}${esc(w.title)} · 创作路径</h2>
    ${paths.length ? `<div class="pr-two-paths">${paths.map(([title,description],i) => `<div>${icon(i ? 'file' : 'layers')}<h3>${esc(title)}</h3>${paragraph(description)}</div>`).join('')}</div>` : ''}
    ${paragraph(w.visualOutcome, 'pr-process-end')}<figcaption>${esc(w.coverCaption || '项目结构示意 · 非运行截图')}</figcaption></figure>`;
}

export function renderProjectRecord(w, related = []) {
  const modules = w.modules?.length ? `<div class="pc-structure">${w.modules.map(([title,desc],i) => `<div>${icon(['book','layers','bulb','link'][i % 4])}<strong>${esc(title)}</strong><small>${esc(desc)}</small></div>`).join('')}</div>` : '';
  const steps = w.flow?.length ? `<ol class="pc-steps">${w.flow.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '';
  const challenge = w.challenge?.trim() ? `<h3>遇到的卡点</h3>${paragraph(w.challenge)}` : '';
  // The chapter links and sections share the same data, so missing content never leaves a dead anchor.
  const sections = [
    {id:'problem', title:'为什么做', symbol:'bulb', size:'', body:paragraph(w.problem)},
    {id:'solution', title:'当前可以做什么', nav:'当前能力', symbol:'layers', size:'pc-wide', body:paragraph(w.solution) + modules},
    {id:'decisions', title:'关键选择', symbol:'grid', body:list(w.keyDecisions)},
    {id:'flow', title:'推进路径', symbol:'tree', body:steps + challenge},
    {id:'journal', title:'阶段记录', size:'pr-full', body:w.journal?.length ? `<p>记录关键节点、实际行动与尚未解决的问题。点击记录展开。</p>${renderProjectJournal(w.journal)}` : ''},
    {id:'validation', title:'验证与结果', symbol:'refresh', body:list(w.validation) + paragraph(w.result, 'pr-result')},
    {id:'reflection', title:'复盘与下一步', symbol:'book', body:(w.whatILearned?.trim() ? `<blockquote>${esc(w.whatILearned)}</blockquote>` : '') + list(w.nextSteps)},
    {id:'technology', title:'实现方式', size:'pr-full', body:list(w.technologies)}
  ].filter(section => section.body);
  const cover = visual(w);
  const relatedContent = relatedLinks(related);
  const roles = [w.role ? `<p><strong>我的参与：</strong>${esc(w.role)}</p>` : '', w.aiCollaboration ? `<p><strong>AI 协作：</strong>${esc(w.aiCollaboration)}</p>` : ''].join('');
  return `<article class="projects-page pc-page cl-page pr-detail site-container">
    <div class="pc-detail-hero${cover ? '' : ' pr-hero-text-only'}"><header><p class="hp-label">项目 / ${esc(w.title)}</p><h1>${esc(w.title)}</h1>
      ${w.subtitle ? `<h2>${esc(w.subtitle)}</h2>` : ''}${paragraph(w.summary, 'project-summary')}${projectMeta(w)}${paragraph(w.time, 'pc-design-note')}
      ${roles ? `<div class="pr-roles">${roles}</div>` : ''}
      <div class="pc-actions">${sections.length ? `<a class="site-button project-button" href="#project-${sections[0].id}" data-project-section="project-${sections[0].id}">阅读项目过程 ↓</a>` : ''}<a class="site-button pc-secondary" href="#/projects">返回项目列表 →</a>${action('查看仓库',w.repoUrl)}</div>
    </header>${cover}</div>
    ${sections.length ? `<nav class="pr-section-nav" aria-label="项目章节">${sections.map(s => `<a href="#project-${s.id}" data-project-section="project-${s.id}">${s.nav || s.title}</a>`).join('')}</nav>` : ''}
    <div class="pc-module-grid">${sections.map(s => `<section class="pc-module ${s.size ?? 'pc-half'}" id="project-${s.id}"><h2>${icon(s.symbol || 'file')}${s.title}</h2>${s.body}</section>`).join('')}
      ${relatedContent ? `<div class="pc-module pr-full pr-related" id="project-related">${relatedContent}</div>` : ''}
    </div>${paragraph(w.date ? `内容依据本地项目及状态文档整理 · 更新于 ${w.date} · 阶段结果不代表全部场景已验证` : '', 'pr-updated')}${columnTail}
  </article>`;
}
