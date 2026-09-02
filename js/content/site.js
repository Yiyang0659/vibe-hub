/**
 * V4 内容层 · 站点元信息（site.js）
 * 纯数据：首页 Hero 文案 / Terminal 自我介绍 / NOW 卡 / 页脚链接。
 * 依赖方向：本文件不 import 任何模块。
 */

export const site = {
  name: 'AI Knowledge Lab',
  tagline: 'AI · Product · Building',

  // Hero：一句人话介绍 + 少量 CTA（蓝图 §6.1 第一屏）
  hero: {
    title: '我在 AI、产品和构建实践中，',
    titleAccent: '留下真正搞明白和真正做过的东西。',
    focusLine: ['AI Evaluation', 'Agent & Skills', 'AI Product'],
    ctas: [
      { label: '看看知识', href: '#/topics', solid: true },
      { label: '看看我做过的东西', href: '#/work' }
    ]
  },

  // MiniTerminal：人格化点缀，不承担数据展示
  terminal: {
    whoami: ['→ AI Product / Evaluation / Builder'],
    currently: ['→ AI Evaluation', '→ Agent & Skills', '→ Building with AI'],
    building: ['→ Personal Knowledge Lab', '→ Evaluation Workflow']
  },

  // NOW / 最近在弄：一句话 + 指向相关笔记
  now: {
    date: '2026.09',
    text:
      '现在主要在研究 Agent Evaluation。最近越来越觉得：评测设计本质上不是"让另一个模型打分"这么简单。',
    linkLabel: '相关笔记',
    linkHref: '#/notes/note-eval-rules-vs-judge'
  },

  // 页脚（About / 链接 / 覆盖率）
  footerLinks: [
    { label: 'About', href: '#/about' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Resume', href: '#/about' },
    { label: 'Email', href: 'mailto:developer@example.com' }
  ]
};
