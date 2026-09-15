import test from 'node:test';
import assert from 'node:assert/strict';
import { renderWorkIndex } from '../../src/features/work/work-page.js';
import { renderWorkDetailPage } from '../../src/features/work/detail.js';
const project = { id: 'example', title: '真实项目', kind: 'PROJECT', publication: 'published', problem: '需要解决的问题', summary: '项目说明' };
test('project listing hides drafts and preserves reviewed history separately', () => {
  const html = renderWorkIndex({work:[project, {...project,id:'secret',title:'草稿标题',publication:'draft'}, {...project,id:'old',title:'历史项目',publication:'review'}]});
  assert.doesNotMatch(html,/草稿标题|projects\/secret/);
  assert.match(html,/projects\/example/);
  assert.match(html,/待核实的历史内容 · 1/);
  assert.match(html,/projects\/old/);
});
test('detail modules include only available sections and reject unsafe assets', () => {
  const html = renderWorkDetailPage({...project,screenshot:'javascript:alert(1)',repoUrl:'javascript:alert(1)'});
  assert.match(html,/id="project-problem"/);
  assert.doesNotMatch(html,/project-validation|project-reflection|javascript:|undefined/);
});

test('supplied project designs have working detail IDs and do not claim launch or user validation', async () => {
 const { designProjects } = await import('../../src/features/work/design-projects.js');
 const html = renderWorkIndex({work:[project]});
 for(const item of designProjects){
  assert.match(html,new RegExp('#/projects/'+item.id));
  const detail=renderWorkDetailPage(item);
  assert.match(detail,/尚未正式上线/);
  assert.match(detail,/验证计划/);
  assert.doesNotMatch(detail,/真实用户反馈|已验证|生成更稳定/);
 }
});
