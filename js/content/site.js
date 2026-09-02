/**
 * V4 内容层 · 站点元信息（site.js）
 * 小编辑站话术：克制、个人感、温暖。
 */

export const site = {
  name: 'AI Knowledge Lab',
  tagline: 'AI · Product · Engineering',

  // Hero：小比例作者主页，不是 Landing Page
  hero: {
    title: '把模糊问题，',
    titleAccent: '编译成清晰知识。',
    subtitle:
      '最近在研究 AI Evaluation、Agent、AI Product 和 Vibe Coding。\n这里记录一些我真正搞明白的东西，以及我正在做的项目。',
    links: [
      { label: '看看最近的笔记', href: '#/notes' },
      { label: '看看我做的东西', href: '#/work' }
    ]
  },

  // NOW / 最近在弄
  now: {
    label: '现在在弄什么',
    chips: ['AI Evaluation', 'Agent', 'AI Product', 'Vibe Coding', 'LLM Application']
  },

  // 轻量统计（放在 Hero 下方）
  stats: {
    label: '知识库',
    items: [
      { label: '术语', key: 'topics' },
      { label: '笔记', key: 'notes' },
      { label: '项目', key: 'work' },
      { label: '论文', key: 'papers' },
      { label: '工具', key: 'tools' },
      { label: '资源', key: 'library' }
    ]
  },

  // 页脚
  footerLinks: [
    { label: 'About', href: '#/about' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Email', href: 'mailto:developer@example.com' }
  ]
};
