/**
 * utils.js —— Phase 2 迁移后仅保留 safeParse，其余逻辑已迁至 lib/*。
 * 保留 re-export 以兼容旧引用（app.js / tests）；Phase 3 清理时移除。
 */

export { normalizeText, searchLessons, searchAllEntities } from './lib/search.js';
export { calculateProgress, categoryProgress, getNextLesson } from './lib/progress.js';

export function safeParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}
