import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, usedInReverse } from '../../src/features/topics/index.js';
import { notes, workItems, papers, toolbox } from '../../src/features/index.js';

const topicIds = new Set(lessons.map((l) => l.id));
const noteIds = new Set(notes.map((n) => n.id));
const paperIds = new Set(papers.map((p) => p.id));
const workIds = new Set(workItems.map((w) => w.id));
const toolIds = new Set(toolbox.map((t) => t.id));

function assertSubset(list, pool, label, sourceId) {
  (list || []).forEach((id) => {
    assert.ok(pool.has(id), `${label} 死链: ${sourceId} → ${id}`);
  });
}

test('V4 关联网络：notes 的 related* 引用全部真实存在（无死链）', () => {
  notes.forEach((n) => {
    assertSubset(n.relatedTopics, topicIds, 'note.relatedTopics', n.id);
    assertSubset(n.relatedPapers, paperIds, 'note.relatedPapers', n.id);
    assertSubset(n.relatedWork, workIds, 'note.relatedWork', n.id);
  });
});

test('V4 关联网络：work 的 related* 引用全部真实存在（无死链）', () => {
  workItems.forEach((w) => {
    assertSubset(w.relatedTopics, topicIds, 'work.relatedTopics', w.id);
    assertSubset(w.relatedNotes, noteIds, 'work.relatedNotes', w.id);
    assertSubset(w.relatedTools, toolIds, 'work.relatedTools', w.id);
  });
});

test('V4 关联网络：toolbox 的 relatedTopics 引用全部真实存在（无死链）', () => {
  toolbox.forEach((t) => {
    assertSubset(t.relatedTopics, topicIds, 'toolbox.relatedTopics', t.id);
  });
});

test('V4 关联网络：topics 的 related 引用全部指向真实词条（无死链）', () => {
  lessons.forEach((l) => {
    assertSubset(l.related, topicIds, 'topic.related', l.id);
  });
});

test('V4 关联网络：UsedIn 反向索引能命中至少一个七维评测相关词条', () => {
  const hits = usedInReverse('testing-strategy', { notes, work: workItems, toolbox });
  assert.ok(hits.length >= 1, 'testing-strategy 应至少被一条 note/work/tool 引用');
});
