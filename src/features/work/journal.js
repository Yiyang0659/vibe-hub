import { esc } from '../../shared/components/content-detail.js';
export const recordHref = (project, record) => `#/projects/${encodeURIComponent(project)}?record=${encodeURIComponent(record)}`;
export function recentProjectRecords(projects) {
  return projects.flatMap(project => (project.journal || []).map(record => ({...record,projectId:project.id,projectTitle:project.title}))).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
}
export function renderRecentRecords(projects) {
  const records=recentProjectRecords(projects);
  if(!records.length)return '';
  return `<section class="pr-recent" id="project-records"><p class="hp-label">PRACTICE NOTES / 实践记录</p><h2>最近的实践记录</h2><p>项目在慢慢推进，我也把过程中的选择、卡点和新认识留下来。</p><div class="pr-journal-list">${records.map(r=>`<a class="pr-journal-row" href="${recordHref(r.projectId,r.id)}"><time datetime="${esc(r.date)}">${esc(r.date.replaceAll('-','.'))}</time><div><div class="pr-record-tags"><span>${esc(r.projectTitle)}</span><small>${esc(r.type)}</small></div><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p></div><span class="pr-read">阅读记录 →</span></a>`).join('')}</div><small class="pr-journal-footnote">每条记录都连接到对应项目，完整背景与过程留在项目详情中。</small></section>`;
}
export function renderProjectJournal(records=[]) {
 return records.map(r=>`<details class="pr-record" id="record-${esc(r.id)}"><summary><time datetime="${esc(r.date)}">${esc(r.date)}</time><span><small>${esc(r.type)}</small><strong>${esc(r.title)}</strong><span>${esc(r.summary)}</span></span><span class="pr-expand" aria-hidden="true">＋</span></summary><dl>${[['目标',r.goal],['行动',r.action],['结果与证据',r.evidence],['认识与边界',r.reflection]].filter(([,v])=>v).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></details>`).join('');
}
