/**
 * Topics 栏目 · 域映射与个人痕迹
 *
 * 术语正文统一保存在 data.js；本模块负责可独立测试的派生逻辑：
 *   - domainOf()      五航线 → 四知识域（蓝图 §7.1）
 *   - WHY_LOOKUP      「我为什么会查这个」个人痕迹（10 个高频词条）
 *   - usedInReverse() 「我在哪真正用过它」反向索引（从 notes/work/toolbox 派生）
 * 本文件只依赖本栏目的静态数据。
 */

import { lessons, categories, learningQuote } from './data.js';

/** 知识域配置（筛选 Tab 顺序即展示顺序） */
export const DOMAINS = [
  { id: 'all', label: '全部' },
  { id: 'ai', label: 'AI' },
  { id: 'product', label: 'Product' },
  { id: 'agent', label: 'Agent' },
  { id: 'engineering', label: 'Engineering' }
];

/** Agent 域白名单：从 AI 协作航线中单列（后续新增 MCP 等词条直接加入） */
const AGENT_TOPIC_IDS = new Set(['tool-calling', 'system-prompt']);

/**
 * 五航线 → 四知识域 映射
 * AI 协作 → ai（白名单除外）/ 产品设计 → product / 其余（前端·后端·工程实践）→ engineering
 */
export function domainOf(lesson) {
  if (AGENT_TOPIC_IDS.has(lesson.id)) return 'agent';
  if (lesson.category === 'AI 协作') return 'ai';
  if (lesson.category === '产品设计') return 'product';
  return 'engineering';
}

/** 「我为什么会查这个？」—— 第一人称个人痕迹（蓝图 §6.3 新增段） */
export const WHY_LOOKUP = {
  'hallucination': '评测 Agent 时它编造了一个不存在的接口，返回值却"看起来合理"。我需要搞清楚幻觉的触发机制，才能设计规则层拦截。',
  'context-window': 'Judge 的 Prompt 塞入评测规则 + 样例 + 被评文本后开始丢失前文要求。我需要知道容量的真实边界在哪里。',
  'token': '模型按 Token 计费，而中文的 Token 密度和英文完全不同——做评测成本估算时被教育过。',
  'tool-calling': 'Agent 要查数据库、发请求，但直接把权限交给模型太危险。我需要理解工具调用的受控边界。',
  'system-prompt': '同一个模型换一份系统提示词，评测得分差了 15%。我需要理解系统级指令的优先级机制。',
  'rag': '想让 Agent 回答业务私有知识，直接微调太重。检索增强是当时唯一可行的工程路径。',
  'git-workflow': '让 AI 直接改主分支代码，出错后无法回退。我需要一套能放心让 Agent 动手的分支纪律。',
  'testing-strategy': '自动化评测本质上就是给 AI 行为写测试。我需要把传统测试分层思想迁移到评测流水线上。',
  'api-contract': '前后端对接反复扯皮字段格式，后来发现本质是契约没定义清楚——这对设计 Judge 的输出 Schema 同样成立。',
  'state-management': '多步 Agent 流程中状态一乱，整条链路就断。界面状态管理的思路可以直接迁移到 Agent 状态机。'
};

/**
 * 「我在哪真正用过它？」—— 反向索引（蓝图 §6.3 新增段数据源）
 * 从 notes / work / toolbox 的 relatedTopics 自动派生，无需手工维护。
 */
export function usedInReverse(topicId, { notes = [], work = [], toolbox = [] } = {}) {
  const hits = [];
  notes.forEach((n) => {
    if ((n.relatedTopics || []).includes(topicId)) {
      hits.push({ type: 'note', typeLabel: 'NOTE', title: n.title, href: `#/notes/${n.id}` });
    }
  });
  work.forEach((w) => {
    if ((w.relatedTopics || []).includes(topicId)) {
      hits.push({ type: 'work', typeLabel: w.kindLabel || 'WORK', title: w.title, href: `#/work/${w.id}` });
    }
  });
  toolbox.forEach((t) => {
    if ((t.relatedTopics || []).includes(topicId)) {
      hits.push({ type: 'toolbox', typeLabel: t.typeLabel || 'TOOL', title: t.title, href: `#/toolbox/${t.id}` });
    }
  });
  return hits;
}

/** 全部词条 + 计算好的域（视图与筛选直接消费） */
export const topicsWithDomain = lessons.map((lesson) => ({
  ...lesson,
  domain: domainOf(lesson)
}));

export { lessons, categories, learningQuote };
