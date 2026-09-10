import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compileProjectDigest,
  generateNoteDraft,
  generateToolboxDraft
} from '../../src/features/workspace/compiler.js';
import { workItems, initialDigests } from '../../src/features/index.js';

test('compileProjectDigest extracts all 6 core fields from raw description', () => {
  const rawInput = '今天重新调整了 rating 和 LLM Judge 的关系。rating 本身已经有明确业务规则，所以不应该继续让模型判断，现在把规则判断和语义判断拆开了。确定性问题规则化，非确定性语义问题模型化。可以沉淀为通用的 AI Evaluation 分层架构设计方法。';
  const materials = [
    { type: 'prompt', title: '评测 Prompt 拆分草稿', content: 'System: 只进行同理心判定' },
    { type: 'code', title: 'Rule Engine 代码片段', content: 'if (!trace.hasRating) return false;' }
  ];
  const project = workItems.find(item => item.id === 'ai-seven-dimension-eval');

  const digest = compileProjectDigest(rawInput, materials, project);

  assert.ok(digest.id);
  assert.equal(digest.projectId, 'ai-seven-dimension-eval');
  assert.ok(digest.title);
  assert.ok(digest.date);
  assert.ok(digest.dateLabel);
  // 验证 6 个固定核心字段
  assert.ok(digest.progress, 'progress field must exist');
  assert.ok(digest.problem, 'problem field must exist');
  assert.ok(digest.solution, 'solution field must exist');
  assert.ok(digest.reasoning, 'reasoning field must exist');
  assert.ok(digest.insight, 'insight field must exist');
  assert.ok(digest.reusableValue, 'reusableValue field must exist');
  assert.equal(digest.sourceMaterials.length, 2);
  assert.equal(digest.status, 'draft');
});

test('generateNoteDraft creates a valid 5-field Note structure from a digest', () => {
  const digest = initialDigests[0];
  const project = workItems.find(item => item.id === 'ai-seven-dimension-eval');
  const note = generateNoteDraft(digest, project);

  assert.ok(note.id);
  assert.ok(note.title);
  assert.ok(note.oneLiner);
  assert.ok(note.question);
  assert.ok(note.myUnderstanding);
  assert.ok(note.example);
  assert.ok(note.myTake);
  assert.equal(note.sourceDigestId, digest.id);
});

test('generateToolboxDraft creates a valid Toolbox structure from a digest', () => {
  const digest = initialDigests[0];
  const project = workItems.find(item => item.id === 'ai-seven-dimension-eval');
  const tool = generateToolboxDraft(digest, project);

  assert.ok(tool.id);
  assert.ok(tool.title);
  assert.ok(tool.problemSolved);
  assert.ok(tool.whenToUse);
  assert.ok(Array.isArray(tool.requiredInputs) && tool.requiredInputs.length > 0);
  assert.ok(Array.isArray(tool.steps) && tool.steps.length > 0);
  assert.ok(Array.isArray(tool.checklist) && tool.checklist.length > 0);
  assert.ok(tool.promptTemplate);
  assert.ok(tool.example);
  assert.ok(Array.isArray(tool.limitations) && tool.limitations.length > 0);
});
