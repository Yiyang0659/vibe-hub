import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../../src/features/topics/index.js';

test('every lesson has a stable unique id and valid quiz answer', () => {
  assert.ok(lessons.length >= 60);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
  const knownIds = new Set(lessons.map((lesson) => lesson.id));
  lessons.forEach((lesson) => {
    assert.ok(lesson.id);
    assert.ok(lesson.title);
    assert.ok(lesson.definition);
    if (lesson.question) {
      assert.ok(Number.isInteger(lesson.question.answer) && lesson.question.answer >= 0);
      assert.ok(lesson.question.answer < lesson.question.choices.length);
    }
    (lesson.related || []).forEach((id) => assert.ok(knownIds.has(id), `${lesson.id} references missing lesson ${id}`));
  });
});

test('expanded glossary covers every learning route', () => {
  const counts = lessons.reduce((result, lesson) => {
    result[lesson.category] = (result[lesson.category] || 0) + 1;
    return result;
  }, {});
  const minimums = {
    '前端航线': 16,
    '后端航线': 15,
    'AI 协作': 9,
    '产品设计': 8,
    '工程实践': 12
  };
  for (const [category, count] of Object.entries(minimums)) assert.ok(counts[category] >= count);
});

test('Frontend module contains the complete interactive save flow', () => {
  const frontend = lessons.find((lesson) => lesson.id === 'frontend');
  assert.ok(frontend);
  assert.equal(frontend.scenario.steps.length, 6);
  assert.deepEqual(
    frontend.scenario.steps.map((step, index) => step.focus ? index + 1 : null).filter(Boolean),
    [1, 2, 6]
  );
  assert.equal(frontend.references.length, 2);
  assert.match(frontend.agentPrompt, /它有没有正确处理保存请求/);
});
