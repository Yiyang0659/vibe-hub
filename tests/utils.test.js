import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProgress, categoryProgress, getNextLesson, safeParse, searchLessons, searchAllEntities } from '../js/utils.js';

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

test('searchAllEntities searches across Topics, Notes, Papers, Work, Toolbox, and Library', () => {
  const dataset = {
    lessons: [{ id: 'llm-judge', title: 'LLM Judge', english: 'LLM Judge', definition: '模型打分', excerpt: '模型打分', category: 'AI 协作', tags: ['评测'] }],
    notes: [{ id: 'note-1', title: '为什么 AI Evaluation 需要规则分层', category: 'AI Evaluation', summary: '评测架构探究', question: '', myPerspective: '', conclusion: '' }],
    papers: [{ id: 'paper-1', title: 'Constitutional AI', chineseTitle: '宪政 AI', authors: 'Anthropic', domain: 'AI Safety', oneLiner: '通过规则自对齐', problemSolved: '', coreInnovation: '' }],
    projects: [{ id: 'work-1', title: '七维能力自动评测', english: 'Auto Eval', summary: '自动化评测平台', domain: 'AI Evaluation', typeLabel: '完整项目' }],
    toolbox: [{ id: 'tool-1', title: 'AI Evaluation 规则设计方法', subtitle: '分层评测实战', category: 'AI Evaluation', typeLabel: 'Workflow', whenToUse: '' }],
    library: [{ id: 'lib-1', title: 'OpenAI Evals', categoryLabel: '开源工具', author: 'OpenAI', whyRecommend: '自动化评测标准', whatILearned: '', tags: [] }],
    digests: [{ id: 'dig-1', projectId: 'work-1', title: '规则引擎与 LLM Judge 分层', progress: '优化了评测', problem: '', solution: '', reasoning: '', insight: '', reusableValue: '' }]
  };

  const results = searchAllEntities(dataset, 'evaluation');
  assert.ok(results.some(r => r.type === 'NOTE'));
  assert.ok(results.some(r => r.type === 'PROJECT'));
  assert.ok(results.some(r => r.type === 'TOOLBOX'));

  const judgeResults = searchAllEntities(dataset, 'Judge');
  assert.ok(judgeResults.some(r => r.type === 'TOPIC'));
  assert.ok(judgeResults.some(r => r.type === 'DIGEST'));

  const paperResults = searchAllEntities(dataset, 'Constitutional');
  assert.ok(paperResults.some(r => r.type === 'PAPER'));

  const libResults = searchAllEntities(dataset, 'Evals');
  assert.ok(libResults.some(r => r.type === 'LIBRARY'));
});
