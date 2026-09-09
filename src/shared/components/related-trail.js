/**
 * V4 组件层 · Related Trail（components/related-trail.js）
 * 认知路径（蓝图 §8.3）：不是"推荐阅读"，而是这条知识在我这里如何生长——
 *   topic ─deepens→ note ─applied-in→ work ─distilled-into→ toolbox
 * 纯函数：输入起点实体与知识图谱，返回 HTML 字符串；节点不足 2 个时返回空串。
 */

const RELATION_LABEL = {
  prerequisite: '基础',
  deepens: '深入推导',
  'applied-in': '用于实践',
  'distilled-into': '沉淀为方法'
};

const TYPE_LABEL = { topic: 'TOPIC', note: 'NOTE', work: 'WORK', toolbox: 'TOOL' };
const TYPE_HREF = (node) =>
  node.type === 'topic' ? `#/topics/${node.id}`
  : node.type === 'note' ? `#/notes/${node.id}`
  : node.type === 'work' ? `#/work/${node.id}`
  : `#/toolbox/${node.id}`;

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

/** 沿「理解 → 实践 → 方法」方向取第一条真实关联 */
export function buildTrail(start, graph) {
  const nodes = [{ ...start, relation: null }];
  const first = (list) => (list && list[0]) || null;

  if (start.type === 'topic') {
    const note = first(graph.notes.filter((n) => (n.relatedTopics || []).includes(start.id)));
    if (!note) return nodes;
    nodes.push({ type: 'note', id: note.id, title: note.title, relation: 'deepens' });

    const work = first(
      graph.work.filter(
        (w) => (w.relatedNotes || []).includes(note.id) || (w.relatedTopics || []).includes(start.id)
      )
    );
    if (!work) return nodes;
    nodes.push({ type: 'work', id: work.id, title: work.title, relation: 'applied-in' });

    const tool =
      first(graph.toolbox.filter((t) => (work.relatedTools || []).includes(t.id))) ||
      first(graph.toolbox.filter((t) => (t.relatedTopics || []).includes(start.id)));
    if (tool) nodes.push({ type: 'toolbox', id: tool.id, title: tool.title, relation: 'distilled-into' });
  }

  if (start.type === 'note') {
    const work = first(graph.work.filter((w) => (w.relatedNotes || []).includes(start.id)));
    if (work) {
      nodes.push({ type: 'work', id: work.id, title: work.title, relation: 'applied-in' });
      const tool = first(graph.toolbox.filter((t) => (work.relatedTools || []).includes(t.id)));
      if (tool) nodes.push({ type: 'toolbox', id: tool.id, title: tool.title, relation: 'distilled-into' });
    }
  }

  if (start.type === 'work') {
    const tool = first(graph.toolbox.filter((t) => (start.relatedTools || []).includes(t.id)));
    if (tool) nodes.push({ type: 'toolbox', id: tool.id, title: tool.title, relation: 'distilled-into' });
  }

  return nodes;
}

export function renderRelatedTrail(start, graph) {
  const nodes = buildTrail(start, graph);
  if (nodes.length < 2) return '';

  const items = nodes
    .map((node, i) => {
      const head = node.relation
        ? `<li class="v-trail-hop" aria-hidden="true">↓ <span>${esc(RELATION_LABEL[node.relation] || '')}</span></li>`
        : '';
      const link =
        i === 0
          ? `<span class="v-trail-node is-current">${esc(node.title)}<i>${TYPE_LABEL[node.type]}</i></span>`
          : `<a class="v-trail-node" href="${esc(TYPE_HREF(node))}">${esc(node.title)}<i>${TYPE_LABEL[node.type]}</i></a>`;
      return head + `<li>${link}</li>`;
    })
    .join('');

  return `
    <section class="v-trail">
      <p class="c-eyebrow">RELATED TRAIL</p>
      <h2>这条知识的路径</h2>
      <ol class="v-trail-path">${items}</ol>
    </section>`;
}
