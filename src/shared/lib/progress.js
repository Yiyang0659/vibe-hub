/**
 * V4 逻辑层 · 学习进度（lib/progress.js）
 * 从 utils.js 迁移（Phase 2）；纯函数，无 DOM 依赖。
 */

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
