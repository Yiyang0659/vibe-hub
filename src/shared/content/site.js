/**
 * V4 内容层 · 站点元信息（site.js）
 * 小编辑站话术：克制、个人感、温暖。
 */

export const site = {
  name: '想与做',
  tagline: 'AI · Product · Engineering',

  // Hero：小比例作者主页，不是 Landing Page
  hero: {
    title: '想明白，',
    titleAccent: '再做出来。',
    subtitle:
      '最近在研究 Agent 如何完成任务，也在尝试把读到的方法，\n变成能运行、能验证的小东西。',
    links: [
      { label: '看看最近做的', href: '#home-work' },
      { label: '读一篇文章', href: '#home-writing' }
    ]
  },

  // NOW / 最近在弄
  now: {
    label: '现在',
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
    { label: 'Work', href: '#/work' },
    { label: 'Writing', href: '#/notes' },
    { label: 'About', href: '#/about' }
  ]
};
