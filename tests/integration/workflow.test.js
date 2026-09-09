import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, categories } from '../../src/features/topics/index.js';
import {
  papers,
  notes,
  workItems,
  toolbox,
  library,
  initialDigests,
  aboutData
} from '../../src/features/index.js';
import {
  compileProjectDigest,
  generateNoteDraft,
  generateToolboxDraft
} from '../../src/features/workspace/compiler.js';
import { searchAllEntities } from '../../src/shared/lib/index.js';

test('V3 Full Capability Repository Dataset integrity', () => {
  // Topics (术语)
  assert.ok(lessons.length >= 40, 'Should have at least 40 topic modules');
  assert.equal(categories.length, 5, 'Should have 5 core knowledge domains');

  // Notes (思考)
  assert.ok(notes.length >= 4, 'Should have at least 4 note pieces');
  notes.forEach(n => {
    assert.ok(n.id && n.title && n.oneLiner && n.question && n.myUnderstanding && n.example && n.myTake);
  });

  // Papers (论文)
  assert.ok(papers.length >= 4, 'Should have at least 4 paper deconstructions');
  papers.forEach(p => {
    assert.ok(p.id && p.title && p.oneLiner && p.problem && p.coreIdea && p.howItWorks && p.whyItMatters && p.myTake && p.productView);
  });

  // Work (项目/原型/实验)
  assert.ok(workItems.length >= 5, 'Should have at least 5 work items');
  const kinds = new Set(workItems.map(w => w.kind));
  assert.ok(kinds.has('PROJECT'));
  assert.ok(kinds.has('PROTOTYPE'));
  assert.ok(kinds.has('EXPERIMENT'));

  // Toolbox (工具箱)
  assert.ok(toolbox.length >= 4, 'Should have at least 4 toolbox items');
  toolbox.forEach(t => {
    assert.ok(t.id && t.title && t.problemSolved && t.whenToUse && t.promptTemplate);
  });

  // Library (精选资源)
  assert.ok(library.length >= 4, 'Should have at least 4 library items');
  library.forEach(l => {
    assert.ok(l.id && l.title && l.whyRecommend && l.whatILearned);
  });

  // About (关于)
  assert.ok(aboutData.name && aboutData.focusAreas.length > 0 && aboutData.labMission.length > 0);
});

test('End-to-end workflow: CAPTURE -> AI DISTILL -> REVIEW -> UPGRADE TO NOTE / TOOLBOX', () => {
  const rawInput = '优化了慢速图像生成任务的端到端调用流，由同步阻塞改为异步任务状态机轮询。慢速生成式 AI 任务体验的核心在于状态管理与心理预期管理。';
  const materials = [{ type: 'code', title: '异步轮询状态机代码', content: 'const pollStatus = async () => {}' }];
  const project = workItems[0];

  // 1. AI 编译
  const digest = compileProjectDigest(rawInput, materials, project);
  assert.equal(digest.status, 'draft');
  assert.ok(digest.progress);
  assert.ok(digest.problem);
  assert.ok(digest.solution);
  assert.ok(digest.insight);

  // 2. 升级为 Note 思考卡片
  const noteDraft = generateNoteDraft(digest, project);
  assert.ok(noteDraft.id.startsWith('note-'));
  assert.ok(noteDraft.title);
  assert.ok(noteDraft.myUnderstanding);

  // 3. 升级为 Toolbox 工具
  const toolDraft = generateToolboxDraft(digest, project);
  assert.ok(toolDraft.id.startsWith('tool-'));
  assert.ok(toolDraft.promptTemplate);

  // 4. 全局检索验证
  const searchHits = searchAllEntities({
    lessons,
    notes: [...notes, noteDraft],
    papers,
    projects: workItems,
    toolbox: [...toolbox, toolDraft],
    library,
    digests: [...initialDigests, digest]
  }, '异步');

  assert.ok(searchHits.length > 0, 'Search should find newly generated entities');
});
