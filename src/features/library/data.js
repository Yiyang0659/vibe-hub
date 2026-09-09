export const library = [
  {
    id: 'lib-anthropic-prompt-guide',
    title: 'Anthropic Interactive Prompt Engineering Tutorial',
    type: 'WEBSITE',
    typeLabel: 'Website / 教程',
    url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
    author: 'Anthropic Team',
    tags: ['Prompt', 'Claude', '最佳实践'],
    whyRecommend: '业界公认质量最高的官方 Prompt 工程互动指南，体系化阐述了 XML 标签隔离、理由先行 (CoT) 与角色预设。',
    whatILearned: '从中吸收了使用 `<thinking>` 标签引导模型先思考再输出的模式，并将其应用在评测 Judge Prompt 设计中。'
  },
  {
    id: 'lib-vibe-hub',
    title: 'VibeHub / MDN Interactive Learning Architecture',
    type: 'WEBSITE',
    typeLabel: 'Website / 学习平台',
    url: 'https://developer.mozilla.org',
    author: 'Mozilla & Web Standards Community',
    tags: ['Web标准', '交互式学习', '文档设计'],
    whyRecommend: '将抽象枯燥的技术标准转化为场景化、步骤清晰、带可交互运行窗口的学习体验典范。',
    whatILearned: '借鉴了“一句话理解 → 职责 → 交互式 Lab → 误区 → 检查清单”的内容组织结构。'
  },
  {
    id: 'lib-openai-evals',
    title: 'OpenAI Evals Framework',
    type: 'GITHUB',
    typeLabel: 'GitHub / 开源工具',
    url: 'https://github.com/openai/evals',
    author: 'OpenAI',
    tags: ['评测', 'Benchmark', '开源工具'],
    whyRecommend: '业界标准的大模型能力自动化评测基准框架，支持 Model-graded 评估与定制化测试用例构建。',
    whatILearned: '理解了 Golden Dataset 标准化评测集的构建规范与 Match / FuzzyMatch 自动化评分流水线。'
  },
  {
    id: 'lib-model-context-protocol',
    title: 'Model Context Protocol (MCP) Official Specification',
    type: 'ARTICLE',
    typeLabel: 'Article / 规范标准',
    url: 'https://modelcontextprotocol.io',
    author: 'Anthropic & MCP Working Group',
    tags: ['MCP', '协议标准', 'Agent架构'],
    whyRecommend: '大模型与外部上下文、本地资源、执行工具解耦的最新通用协议规范，未来全行业 Agent 的基础设施。',
    whatILearned: '深入理解了 Client-Host-Server 三层架构与 Prompts / Resources / Tools 的职责分工。'
  },
  {
    id: 'lib-chip-huyen-ai-engineering',
    title: 'Building LLM Applications for Production',
    type: 'ARTICLE',
    typeLabel: 'Article / 深度好文',
    url: 'https://huyenchip.com/blog',
    author: 'Chip Huyen',
    tags: ['AI工程化', '生产落地', '系统设计'],
    whyRecommend: '深入浅出剖析大模型生产落地面临的延迟、成本、评测与数据飞轮等全链路硬核工程挑战。',
    whatILearned: '强化了“确定性问题用规则，非确定性语义用模型”的设计原则，奠定了评测系统的分层思想。'
  }
];
