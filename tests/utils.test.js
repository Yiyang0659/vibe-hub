import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProgress, categoryProgress, getNextLesson, safeParse, searchLessons } from '../js/utils.js';

const lessons = [
  { id: 'state', title: '状态', english: 'State', aliases: ['UI 状态'], category: '前端航线', level: '入门', excerpt: '界面记住变化', definition: '', tags: ['交互'] },
  { id: 'prompt', title: '提示词结构', english: 'Prompt Structure', category: 'AI 协作', level: '进阶', excerpt: '写清目标', definition: '', tags: ['上下文'] }
];

test('searchLessons searches Chinese and English fields', () => {
  assert.deepEqual(searchLessons(lessons, 'state').map((item) => item.id), ['state']);
  assert.deepEqual(searchLessons(lessons, '上下文').map((item) => item.id), ['prompt']);
  assert.deepEqual(searchLessons(lessons, 'UI 状态').map((item) => item.id), ['state']);
});

test('searchLessons combines category and level filters', () => {
  assert.deepEqual(searchLessons(lessons, '', 'AI 协作', '进阶').map((item) => item.id), ['prompt']);
  assert.equal(searchLessons(lessons, '', '前端航线', '进阶').length, 0);
});

test('calculateProgress de-duplicates completed ids and rounds percent', () => {
  assert.deepEqual(calculateProgress(3, ['a', 'a', 'b']), { completed: 2, remaining: 1, percent: 67 });
  assert.deepEqual(calculateProgress(0, []), { completed: 0, remaining: 0, percent: 0 });
});

test('categoryProgress reports every route independently', () => {
  const result = categoryProgress(lessons, ['state']);
  assert.equal(result['前端航线'].percent, 100);
  assert.equal(result['AI 协作'].percent, 0);
});

test('getNextLesson and safeParse provide resilient defaults', () => {
  assert.equal(getNextLesson(lessons, ['state']).id, 'prompt');
  assert.deepEqual(safeParse('{broken', []), []);
});
