import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../../js/data.js';
import { notes, workItems, papers, toolbox, library } from '../../js/lab-data.js';
import { WHY_LOOKUP, topicsWithDomain, domainOf } from '../../js/content/topics.js';

test('V4 发布门槛：每条 Note 的 unresolved（我还没想清楚什么）非空', () => {
  notes.forEach((note) => {
    assert.ok(note.unresolved && note.unresolved.trim().length >= 10, `note ${note.id} 缺少 unresolved`);
  });
});

test('V4 发布门槛：每条 Work 的 problem 非空（Problem-first）', () => {
  workItems.forEach((w) => {
    assert.ok(w.problem && w.problem.trim().length >= 10, `work ${w.id} 缺少 problem`);
  });
});

test('V4 发布门槛：EXPERIMENT 的 result 必须包含可量化数字', () => {
  workItems
    .filter((w) => w.kind === 'EXPERIMENT')
    .forEach((w) => {
      assert.ok(/\d/.test(w.result || ''), `experiment ${w.id} 的 result 缺少量化数字`);
    });
});

test('V4 发布门槛：PAPER 的 myTake（我只记住三件事）恰好 3 条', () => {
  papers.forEach((p) => {
    assert.ok(Array.isArray(p.myTake) && p.myTake.length === 3, `paper ${p.id} myTake 必须 3 条`);
  });
});

test('V4 发布门槛：TOOL 的 problemSolved 非空（它解决什么问题）', () => {
  toolbox.forEach((t) => {
    assert.ok((t.problemSolved || '').trim().length >= 6, `tool ${t.id} 缺少 problemSolved`);
  });
});

test('V4 发布门槛：TOOL 至少提供 promptTemplate 或 checklist 之一（可复用性）', () => {
  toolbox.forEach((t) => {
    const hasTemplate = (t.promptTemplate || '').trim().length > 0;
    const hasChecklist = Array.isArray(t.checklist) && t.checklist.length > 0;
    assert.ok(hasTemplate || hasChecklist, `tool ${t.id} 既无模板也无清单，不可复用`);
  });
});

test('V4 发布门槛：LIBRARY 的 whyRecommend（为什么值得留下）非空', () => {
  library.forEach((item) => {
    assert.ok((item.whyRecommend || '').trim().length >= 6, `library ${item.id} 缺少 whyRecommend`);
  });
});

test('V4 个人痕迹：10 个高频词条配有 whyLookup，且 id 全部真实存在', () => {
  const ids = new Set(lessons.map((l) => l.id));
  assert.ok(Object.keys(WHY_LOOKUP).length >= 10);
  Object.keys(WHY_LOOKUP).forEach((id) => {
    assert.ok(ids.has(id), `WHY_LOOKUP 引用了不存在的 topic id: ${id}`);
  });
});

test('V4 域映射：每个词条都能映射到四个知识域之一', () => {
  const VALID = new Set(['ai', 'product', 'agent', 'engineering']);
  topicsWithDomain.forEach((t) => {
    assert.ok(VALID.has(t.domain), `topic ${t.id} 的 domain 非法: ${t.domain}`);
  });
  // agent 白名单词条确实落在 agent 域
  assert.equal(domainOf({ id: 'tool-calling', category: 'AI 协作' }), 'agent');
  assert.equal(domainOf({ id: 'system-prompt', category: 'AI 协作' }), 'agent');
  assert.equal(domainOf({ id: 'rag', category: 'AI 协作' }), 'ai');
  assert.equal(domainOf({ id: 'user-problem', category: '产品设计' }), 'product');
  assert.equal(domainOf({ id: 'git-workflow', category: '工程实践' }), 'engineering');
});

test('V4 从问题开始：至少 6 个词条配有 entryQuestion', () => {
  const withQuestion = lessons.filter((l) => l.entryQuestion);
  assert.ok(withQuestion.length >= 6, `entryQuestion 覆盖不足: ${withQuestion.length}`);
});
