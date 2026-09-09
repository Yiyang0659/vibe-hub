/**
 * V4 逻辑层 · 检索（lib/search.js）
 * 从 utils.js 迁移（Phase 2）；纯函数，无 DOM 依赖。
 */

export function normalizeText(value = '') {
  return String(value).trim().toLocaleLowerCase('zh-CN');
}

function matchesQuery(haystack, keyword) {
  return keyword.split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
}

export function searchLessons(lessons, query = '', category = 'all', level = 'all') {
  const keyword = normalizeText(query);
  return lessons.filter((lesson) => {
    const matchesCategory = category === 'all' || lesson.category === category;
    const matchesLevel = level === 'all' || lesson.level === level;
    const haystack = normalizeText([
      lesson.title,
      lesson.english,
      lesson.excerpt,
      lesson.definition,
      lesson.category,
      ...(lesson.aliases || []),
      ...(lesson.tags || [])
    ].join(' '));
    return matchesCategory && matchesLevel && (!keyword || haystack.includes(keyword));
  });
}

/**
 * Global Search 2.0: 跨全站 6 大核心实体检索
 * 支持检索 Topics, Notes, Papers, Projects & Experiments, Toolbox, Library, Digests
 */
export function searchAllEntities({
  lessons = [],
  notes = [],
  papers = [],
  projects = [],
  toolbox = [],
  library = [],
  digests = []
}, query = '') {
  const keyword = normalizeText(query);
  if (!keyword) return [];

  const results = [];

  // 1. Topics (术语知识)
  lessons.forEach((lesson) => {
    const haystack = normalizeText([
      lesson.title,
      lesson.english,
      lesson.excerpt,
      lesson.definition,
      lesson.category,
      ...(lesson.aliases || []),
      ...(lesson.tags || [])
    ].join(' '));
    if (matchesQuery(haystack, keyword)) {
      results.push({
        type: 'TOPIC',
        typeLabel: '术语知识',
        badgeColor: '#45e0bf',
        id: lesson.id,
        title: lesson.title,
        english: lesson.english,
        excerpt: lesson.excerpt || lesson.definition,
        url: `#/topics/${lesson.id}`
      });
    }
  });

  // 2. Notes (思考与知识沉淀)
  notes.forEach((note) => {
    const haystack = normalizeText([
      note.title,
      note.category,
      note.summary,
      note.question,
      note.oneLiner,
      note.myUnderstanding,
      note.myTake,
      note.myPerspective,
      note.conclusion,
      note.unresolved
    ].join(' '));
    if (matchesQuery(haystack, keyword)) {
      results.push({
        type: 'NOTE',
        typeLabel: '思考沉淀',
        badgeColor: '#f2b84b',
        id: note.id,
        title: note.title,
        english: note.category,
        excerpt: note.oneLiner || note.summary || note.myPerspective,
        url: `#/notes/${note.id}`
      });
    }
  });

  // 3. Papers (论文拆解)
  papers.forEach((paper) => {
    const haystack = normalizeText([
      paper.title,
      paper.chineseTitle,
      paper.authors,
      paper.domain,
      paper.oneLiner,
      paper.problemSolved,
      paper.coreInnovation,
      ...(paper.top3Takeaways || [])
    ].join(' '));
    if (matchesQuery(haystack, keyword)) {
      results.push({
        type: 'PAPER',
        typeLabel: '论文拆解',
        badgeColor: '#58a6ff',
        id: paper.id,
        title: paper.title,
        english: paper.chineseTitle || paper.domain,
        excerpt: paper.oneLiner,
        url: `#/papers/${paper.id}`
      });
    }
  });

  // 4. Projects & Experiments (项目与实验)
  projects.forEach((proj) => {
    const haystack = normalizeText([
      proj.title,
      proj.english,
      proj.summary,
      proj.domain,
      proj.typeLabel,
      proj.problem || '',
      proj.solution || '',
      proj.role || '',
      proj.result || '',
      proj.objective || '',
      proj.findings || '',
      proj.keyTakeaway || ''
    ].join(' '));
    if (matchesQuery(haystack, keyword)) {
      results.push({
        type: 'PROJECT',
        typeLabel: proj.typeLabel || '项目/实验',
        badgeColor: '#d06b4c',
        id: proj.id,
        title: proj.title,
        english: proj.english || proj.domain,
        excerpt: proj.summary || proj.findings,
        url: `#/projects/${proj.id}`
      });
    }
  });

  // 5. Toolbox (工具箱 / Playbook / Prompt / Checklist)
  toolbox.forEach((tool) => {
    const haystack = normalizeText([
      tool.title,
      tool.subtitle,
      tool.typeLabel,
      tool.category,
      tool.whenToUse,
      tool.problemSolved,
      tool.howToUse,
      tool.example,
      tool.promptTemplate || '',
      tool.caseStudy || '',
      ...(tool.checklist || []),
      ...(tool.pitfalls || [])
    ].join(' '));
    if (matchesQuery(haystack, keyword)) {
      results.push({
        type: 'TOOLBOX',
        typeLabel: tool.typeLabel || '工具方法',
        badgeColor: '#ff7aa8',
        id: tool.id,
        title: tool.title,
        english: tool.subtitle || tool.category,
        excerpt: tool.subtitle || tool.whenToUse,
        url: `#/toolbox/${tool.id}`
      });
    }
  });

  // 6. Library (精选资源库)
  library.forEach((item) => {
    const haystack = normalizeText([
      item.title,
      item.categoryLabel,
      item.author,
      item.whyRecommend,
      item.whatILearned,
      ...(item.tags || [])
    ].join(' '));
    if (matchesQuery(haystack, keyword)) {
      results.push({
        type: 'LIBRARY',
        typeLabel: item.categoryLabel || '精选资源',
        badgeColor: '#a8b3c2',
        id: item.id,
        title: item.title,
        english: `${item.author} · ${item.categoryLabel}`,
        excerpt: item.whyRecommend,
        url: `#/library-resources?id=${item.id}`
      });
    }
  });

  // 7. Digests (项目节点沉淀)
  digests.forEach((d) => {
    const haystack = normalizeText([
      d.title,
      d.progress,
      d.problem,
      d.solution,
      d.reasoning,
      d.insight,
      d.reusableValue
    ].join(' '));
    if (matchesQuery(haystack, keyword)) {
      results.push({
        type: 'DIGEST',
        typeLabel: '项目沉淀',
        badgeColor: '#20c997',
        id: d.id,
        title: d.title,
        english: `${d.dateLabel || d.date} · 关键节点`,
        excerpt: `${d.progress} 💡 ${d.insight}`,
        url: `#/projects/${d.projectId}?digest=${d.id}`
      });
    }
  });

  return results;
}
