export function normalizeText(value = '') {
  return String(value).trim().toLocaleLowerCase('zh-CN');
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

export function calculateProgress(total, completedIds = []) {
  if (!total) return { completed: 0, remaining: 0, percent: 0 };
  const completed = new Set(completedIds).size;
  return {
    completed,
    remaining: Math.max(total - completed, 0),
    percent: Math.min(Math.round((completed / total) * 100), 100)
  };
}

export function categoryProgress(lessons, completedIds = []) {
  const done = new Set(completedIds);
  return lessons.reduce((summary, lesson) => {
    const item = summary[lesson.category] || { total: 0, completed: 0, percent: 0 };
    item.total += 1;
    if (done.has(lesson.id)) item.completed += 1;
    item.percent = Math.round((item.completed / item.total) * 100);
    summary[lesson.category] = item;
    return summary;
  }, {});
}

export function getNextLesson(lessons, completedIds = []) {
  const done = new Set(completedIds);
  return lessons.find((lesson) => !done.has(lesson.id)) || lessons[0];
}

export function safeParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}
