export const papers = [
  {
    id: 'paper-attention-is-all-you-need',
    title: 'Attention Is All You Need',
    chineseTitle: '注意力机制就是你所需要的一切',
    authors: 'Vaswani et al. (Google Brain & Google Research)',
    year: '2017',
    sourceUrl: 'https://arxiv.org/abs/1706.03762',
    domain: 'Transformer & Model Architecture',
    oneLiner: '彻底放弃 RNN 循环时序与卷积，仅凭 Self-Attention 机制实现高并行、长距离依赖建模，奠定了现代所有大模型的基础。',
    problem: '在此之前，RNN/LSTM 必须按时间步序列串行处理文本，无法利用 GPU 大规模并行加速，且在处理超过百字的长文本时极易发生梯度消失与遗忘。',
    coreIdea: '提出了 Multi-Head Self-Attention（多头自注意力）与 Position-wise Feed-Forward 网络组合的 Transformer 架构，引入位置编码 (Positional Encoding) 弥补时序信息。',
    howItWorks: 'Self-Attention 本质是让句子中的每个词（Query）同时去和所有其他词（Key）计算相关度权重，并将相关词的信息（Value）加权聚合到当前词中。Multi-Head 则是让模型从语法、指代、语义等多个独立视角同时观察上下文。',
    whyItMatters: '没有 Transformer 就没有今天的 GPT、Claude 和 Gemini。它将自然语言处理从串行工程带入了大规模 GPU 并行与 Scaling Law 时代。',
    myTake: [
      '1. 抛弃循环时序，利用矩阵乘法实现 GPU 算力利用率的最大化。',
      '2. Multi-Head 机制提供了多维度的语义注意力聚合空间。',
      '3. 注意力矩阵的平方复杂度 O(N^2) 决定了当前长上下文的硬件与成本边界。'
    ],
    productView: [
      '由于能够完全并行训练，使得模型参数量从几千万跃升至千亿级别成为可能。',
      'Context Window（上下文窗口）受制于注意力计算复杂度，理解这一点有助于理解大模型长文本的计费与延迟瓶颈。',
      'AI 产品经理不需要推导矩阵公式，但必须理解：模型对上下文的“注意力”是有选择性的，关键指令放在最前或最后更容易被捕捉（Lost in the Middle 现象根源）。'
    ],
    relatedTopics: ['token', 'context-window', 'prompt-context'],
    relatedNotes: ['note-eval-rules-vs-judge']
  },
  {
    id: 'paper-react-reasoning-and-acting',
    title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    chineseTitle: 'ReAct: 协同大语言模型的推理与行动',
    authors: 'Yao et al. (Princeton & Google Brain)',
    year: '2023',
    sourceUrl: 'https://arxiv.org/abs/2210.03629',
    domain: 'AI Agent & Tool Calling',
    oneLiner: '将大模型的“内部思维推理 (Thought)”与“外部工具调用行动 (Action)”以及“环境反馈观察 (Observation)”交替编排，让 Agent 具备解决复杂多步任务的能力。',
    problem: '单纯推理（如 CoT 思维链）无法获取外部实时信息且容易产生逻辑幻觉；单纯行动（直接调 API）缺乏规划与异常纠错能力。',
    coreIdea: '确立了 Thought → Action → Action Input → Observation 的循环范式，使模型可以在行动前制定计划、在观察到错误结果后自主修正。',
    howItWorks: '就像人类在排查 Bug：先思考“为什么报错”（Thought），然后执行一条搜索或命令（Action），看到终端输出或网页内容（Observation），再根据新信息思考下一步。',
    whyItMatters: '打破了大模型“闭门造车”的静态局限，是现代所有自主 Agent、工具调用与复杂工作流的通用理论基石。',
    myTake: [
      '1. 显式推理轨迹 (Thought) 能大幅降低工具调用的盲目性与误触发。',
      '2. 环境观察 (Observation) 充当了模型对抗自身幻觉的物理世界锚点。',
      '3. Agent 的稳定性很大程度上取决于每一步 Observation 的结构化清晰度。'
    ],
    productView: [
      '现代 AI Agent（如 AutoGPT、Manus、Cursor Composer、评测工作流）的核心调度引擎基本都衍生自 ReAct 范式。',
      '在设计 Agent 产品时，必须在 UI 上向用户暴露 Thought 与 Observation 的过程状态，否则黑盒等待 30 秒会带来极差的用户体验。',
      'ReAct 的步数上限（Max Steps）与死循环熔断是 Agent 产品上线前必须配置的安全兜底。'
    ],
    relatedTopics: ['tool-calling', 'system-prompt', 'acceptance-criteria'],
    relatedNotes: ['note-mcp-vs-rest-api']
  },
  {
    id: 'paper-rag-for-knowledge-intensive-nlp',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    chineseTitle: '检索增强生成：面向知识密集型任务的 RAG 范式',
    authors: 'Lewis et al. (Facebook AI Research & NYU)',
    year: '2020',
    sourceUrl: 'https://arxiv.org/abs/2005.11401',
    domain: 'RAG & Knowledge Bases',
    oneLiner: '将预训练模型的“参数化记忆”与外部文档索引的“非参数化检索”结合，低成本解决大模型知识滞后与幻觉问题。',
    problem: '大模型在预训练后权重固定，无法感知私有数据或最新信息；若直接微调 (Fine-tuning) 成本高昂且容易遗忘旧知识。',
    coreIdea: '提出了通过稠密向量检索器 (Dense Retriever) 检索 Top-K 相关文本块，拼接至 Prompt 提示词上下文后由生成模型生成回答的端到端范式。',
    howItWorks: '让模型从“闭卷考试”变成“开卷考试”：用户提问时，系统先去企业资料库翻书找到最相关的 3 段参考文字，再让模型根据这 3 段内容组织回答。',
    whyItMatters: '彻底改变了企业级 AI 应用的落地范式，使私有数据与开源大模型的高效安全结合成为标准实践。',
    myTake: [
      '1. 检索与生成分离，解耦了静态模型推理能力与动态业务知识库。',
      '2. 相比微调，RAG 具有零训练成本、实时更新与强可溯源性的优势。',
      '3. RAG 系统的主要瓶颈在检索召回精度与上下文拼接策略。'
    ],
    productView: [
      'RAG 是目前企业级落地性价比最高、数据隐私安全性最好的 AI 方案。',
      'RAG 系统的上限取决于检索召回质量（Garbage in, Garbage out），分块切分 (Chunking) 与重排 (Rerank) 往往比更换大模型更立竿见影。',
      '产品界面必须明确标注引用来源（Citations），这是建立用户对 AI 答案信任感的核心设计。'
    ],
    relatedTopics: ['rag', 'context-window', 'hallucination'],
    relatedNotes: ['note-why-chat-ui-trap']
  },
  {
    id: 'paper-constitutional-ai',
    title: 'Constitutional AI: Harmlessness from AI Feedback (RLAIF)',
    chineseTitle: '宪政 AI：基于 AI 反馈实现自监督对齐与安全过滤',
    authors: 'Bai et al. (Anthropic)',
    year: '2022',
    sourceUrl: 'https://arxiv.org/abs/2212.08073',
    domain: 'AI Safety & Alignment',
    oneLiner: '使用一组明确编写的原则规范（宪法 Constitution）引导模型对自身的输出进行自我反思、批判和修改，用 AI 反馈替代高昂的人工标注 (RLHF)。',
    problem: '传统强化学习 (RLHF) 依赖大量人工标注员对有害内容打标，成本极其高昂，且标注员容易产生心理疲劳或引入个人主观偏见。',
    coreIdea: '通过两阶段流程（监督学习自我修正 + 依据宪法原则打分的 RLAIF 偏好模型训练），实现完全无需人工介入的自主安全对齐。',
    howItWorks: '给模型颁布一套《行为准则》（例如：不偏袒、不协助危险行为、语气客观诚恳），当模型写出不合规草稿时，强制它对照准则挑刺并重写。',
    whyItMatters: '证明了自然语言规则可直接作为模型自我进化的约束，为 LLM-as-a-Judge 与自动化评测提供了坚实的理论支撑。',
    myTake: [
      '1. 自然语言原则可以作为强化学习的高效奖励信号。',
      '2. 自我批评与迭代重写 (Critique & Revise) 能显著提升输出质量。',
      '3. 规则透明度使得模型的价值对齐具备可解释性与可调整性。'
    ],
    productView: [
      '证明了“规则约束”在大模型对齐中的巨大威力，启发了产品设计中的 System Prompt 行为宪法规范。',
      '在自动化质量评测中，LLM Judge 的打分标准就是一种微缩版的 Constitutional AI。',
      '让模型有据可依比单纯要求它“做个好助手”稳定得多。'
    ],
    relatedTopics: ['system-prompt', 'acceptance-criteria', 'testing-strategy'],
    relatedNotes: ['note-eval-rules-vs-judge']
  }
];
