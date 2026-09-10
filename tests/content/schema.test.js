import {validateContent} from '../../src/shared/content/validation.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, WHY_LOOKUP, topicsWithDomain, domainOf } from '../../src/features/topics/index.js';
import { notes, workItems, papers, toolbox, library } from '../../src/features/index.js';

test('笔记按轻量内容结构校验', () => notes.forEach(n => assert.deepEqual(validateContent('note',n),[],n.id)));

test('V4 发布门槛：每条 Work 的 problem 非空（Problem-first）', () => {
  workItems.forEach((w) => {
    assert.ok(w.problem && w.problem.trim().length > 0, `work ${w.id} 缺少 problem`);
  });
});

test('项目支持进行中状态和定性观察', () => workItems.forEach(w => assert.deepEqual(validateContent('work',w),[],w.id)));

test('V4 发布门槛：PAPER 的 myTake（我只记住三件事）恰好 3 条', () => {
  papers.forEach((p) => {
    assert.ok(Array.isArray(p.myTake) && p.myTake.length === 3, `paper ${p.id} myTake 必须 3 条`);
  });
});

test('V4 发布门槛：TOOL 的 problemSolved 非空（它解决什么问题）', () => {
  toolbox.forEach((t) => {
    assert.ok((t.problemSolved || '').trim().length > 0, `tool ${t.id} 缺少 problemSolved`);
  });
});

test('工具按脚本和可复用正文分别校验', () => toolbox.forEach(t => assert.deepEqual(validateContent('tool',t),[],t.id)));

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
