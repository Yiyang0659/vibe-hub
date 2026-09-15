export const routeMeta = {
  home: { title: '首页', description: '关于 AI 产品、Agent 与应用工程的项目、文章和实用工具。' },
  work: { title: '项目', description: '真正动手做过或验证过的 AI 产品、原型与实验。' },
  notes: { title: '学习', description: '从项目与阅读中留下的 AI 产品、Agent 和工程思考。' },
  topics: { title: '术语', description: '用产品与实践视角解释 AI、Agent 和应用工程中的关键概念。' },
  reading: { title: '阅读', description: '影响当前实践判断的论文、文章与阅读笔记。' },
  toolbox: { title: '工具', description: '可以直接带走复用的 AI 工作方法、清单与模板。' },
  library: { title: '资料架', description: '值得再次打开的文章、网站、开源仓库与工具。' },
  practice: { title: '练习', description: '用短问题快速校准对 AI 产品与工程概念的理解。' },
  saved: { title: '已保存', description: '固定下来、近期需要反复使用的内容。' },
  about: { title: '关于', description: '了解我如何在复杂的 AI 能力与真实产品之间做翻译与实现。' },
  'not-found': { title: '页面未找到', description: '这个页面暂时不存在。' }
};

export function pageMeta(routeName, site) {
  const meta = routeMeta[routeName] || routeMeta['not-found'];
  return {
    title: routeName === 'home' ? `${site.name} — ${site.tagline}` : `${meta.title} · ${site.name}`,
    description: meta.description
  };
}
