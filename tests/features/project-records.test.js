import test from 'node:test';
import assert from 'node:assert/strict';
import { workEntries } from '../../src/features/work/entries.js';
import { designProjects } from '../../src/features/work/design-projects.js';
import { renderWorkIndex } from '../../src/features/work/work-page.js';
import { renderWorkDetailPage } from '../../src/features/work/detail.js';
import { recentProjectRecords, renderProjectJournal, recordHref } from '../../src/features/work/journal.js';

test('project index separates local development records from design exploration without duplicates', () => {
 const all=[...workEntries,...designProjects];
 assert.equal(new Set(all.map(x=>x.id)).size,all.length);
 assert.equal(workEntries.length,3);
 assert.equal(designProjects.length,1);
 const html=renderWorkIndex({work:workEntries});
 for(const title of ['想与做','滑一叠','深夜清醒 · AwakeKeeper','内容系统 Agent','最近的实践记录']) assert.ok(html.includes(title));
 assert.doesNotMatch(html,/pc-record-strip|id="project-stories"/);
 assert.match(html,/方案探索/);
});

test('every recent practice record opens an existing project and disclosure', () => {
 const records=recentProjectRecords(workEntries);
 assert.equal(records.length,5);
 for(const record of records) {
  const project=workEntries.find(x=>x.id===record.projectId);
  assert.ok(project);
  assert.match(renderWorkDetailPage(project),new RegExp(`id="record-${record.id}"`));
  assert.ok(renderWorkIndex({work:workEntries}).includes(recordHref(project.id,record.id)));
 }
 assert.deepEqual(records.map(x=>x.date),records.map(x=>x.date).sort().reverse());
});

test('journal text is escaped and recent records are capped at five',()=>{
 const record={id:'safe',date:'2026-09-12',title:'<script>test</script>',summary:'<img src=x>',goal:'<b>x</b>',evidence:'test'};
 const html=renderProjectJournal([record]);
 assert.doesNotMatch(html,/<script>|<img|<b>/);
 assert.match(html,/&lt;script&gt;/);
 assert.equal(recentProjectRecords([{id:'p',title:'P',journal:Array.from({length:8},(_,i)=>({...record,id:`r-${i}`}))}]).length,5);
});

test('local project details preserve evidence boundaries and do not fabricate access links',()=>{
 const hua=workEntries.find(x=>x.id==='hua-yi-die');
 const html=renderWorkDetailPage(hua);
 assert.match(html,/小程序尚未发布/);
 assert.match(html,/本次网站整理未重跑/);
 assert.match(html,/非运行截图/);
 assert.doesNotMatch(html,/查看演示|查看仓库/);
 assert.match(renderWorkDetailPage(workEntries[0]),/非当前运行截图/);
});

test('new projects without screenshots do not inherit another project visual',()=>{
 const entry={...workEntries[0],id:'new-project',title:'新项目',screenshot:undefined,coverCaption:undefined,journal:[],aiCollaboration:undefined};
 const html=renderWorkDetailPage(entry);
 assert.match(html,/新项目 · 创作路径/);
 assert.doesNotMatch(html,/滑一叠|project-journal|AI 协作：/);
});

test('a partial project hides missing sections and only links to rendered chapters', () => {
 const html=renderWorkDetailPage({id:'small-project',title:'小实验',statusLabel:'探索中',solution:'先验证一个问题。',journal:[]});
 assert.match(html,/id="project-solution"/);
 assert.doesNotMatch(html,/id="project-(problem|decisions|flow|journal|validation|reflection|technology)"/);
 assert.doesNotMatch(html,/遇到的卡点|pr-process-visual|<blockquote><\/blockquote>/);
 for(const [,target] of html.matchAll(/data-project-section="([^"]+)"/g)) assert.ok(html.includes(`id="${target}"`));
 assert.match(html,/pr-hero-text-only/);
});

test('related content has one heading and hides the panel for unsafe links', () => {
 const html=renderWorkDetailPage(workEntries[0],[{title:'相关知识',href:'#/topics/example'}]);
 const related=html.split('id="project-related"')[1].split('</aside>')[0];
 assert.equal([...related.matchAll(/<h2/g)].length,1);
 assert.doesNotMatch(renderWorkDetailPage(workEntries[0],[{title:'无效',href:'javascript:alert(1)'}]),/id="project-related"/);
});
