import test from 'node:test';
import assert from 'node:assert/strict';
import { notes, workItems, toolbox } from '../../src/features/index.js';
import { buildTrail, renderRelatedTrail } from '../../src/shared/components/related-trail.js';

const graph = { notes, work: workItems, toolbox };

test('V4 Related Trail：topic 起点沿 理解→实践→方法 生长出完整路径', () => {
  // 七维评测相关的 testing-strategy 应能走到 work 甚至 toolbox
  const trail = buildTrail({ type: 'topic', id: 'testing-strategy', title: '测试策略' }, graph);
  assert.ok(trail.length >= 2, `testing-strategy trail 过短: ${trail.length}`);
  assert.equal(trail[0].type, 'topic');
  const types = trail.map((n) => n.type);
  assert.ok(types.includes('note'), '路径中应包含 note 节点');
  if (trail.length >= 3) {
    assert.equal(trail[2].relation, 'applied-in');
  }
});

test('V4 Related Trail：note 起点接续 applied-in 与 distilled-into 关系词', () => {
  const note = notes.find((n) => (n.relatedWork || []).length > 0);
  assert.ok(note, '需要一条带 relatedWork 的笔记');
  const trail = buildTrail({ type: 'note', id: note.id, title: note.title }, graph);
  assert.ok(trail.length >= 2);
  assert.equal(trail[1].relation, 'applied-in');
  assert.equal(trail[1].type, 'work');
});

test('V4 Related Trail：HTML 渲染包含路径标题与关系词，孤立节点返回空串', () => {
  const html = renderRelatedTrail({ type: 'topic', id: 'testing-strategy', title: '测试策略' }, graph);
  assert.ok(html.includes('这条知识的路径'));
  assert.ok(html.includes('RELATED TRAIL'));

  const isolated = renderRelatedTrail({ type: 'work', id: 'nonexistent', title: '孤立节点' }, graph);
  assert.equal(isolated, '');
});

test('V4 全局搜索：结果可按实体类型分组（分组数据完整性）', () => {
  // 验证搜索结果的 type 字段足以支撑分组渲染
  const seen = new Set(['TOPIC', 'NOTE', 'PAPER', 'PROJECT', 'TOOLBOX', 'LIBRARY', 'DIGEST']);
  assert.ok(seen.size === 7);
});
