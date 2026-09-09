export const initialDigests = [
  {
    id: 'digest-eval-01',
    projectId: 'ai-seven-dimension-eval',
    title: '规则引擎与 LLM Judge 分层架构设计',
    date: '2026-09-01',
    dateLabel: 'SEP 01',
    progress: '重新设计规则引擎与 LLM Judge 的职责边界，将评测流水线拆分为确定性规则层与语义判定层。',
    problem: '确定性业务规则（如必填字段存在性、状态码、禁止词匹配）与模型主观打分混在一个 Prompt 中，造成 LLM 频繁出现标准冲突、低级逻辑误判以及打分不稳定。',
    solution: 'rating 及确定性格式校验 → 独立 Rule Engine 执行；文本语义质量与同理心 → 单独送入 LLM Judge。',
    reasoning: '规则引擎具备绝对确定性、低成本与毫秒级延迟；大模型判断擅长发散与主观理解。两者各司其职，避免了用大模型去算代码即可 100% 确定计算的内容。',
    insight: '确定性问题规则化，非确定性语义问题模型化。',
    reusableValue: '可沉淀为通用的 AI Evaluation 分层架构设计方法与规则引擎编写规范。',
    sourceMaterials: [
      { id: 'mat-1', type: 'prompt', title: '旧版混合评测 Prompt 样例', content: 'System: 请同时判断 Agent 是否返回了 rating(1-5)、是否包含了用户姓名，以及态度是否诚恳礼貌，综合给出一个 0-100 的分数。' },
      { id: 'mat-2', type: 'code', title: '分层校验中间件伪代码', content: 'const ruleResult = runDeterministicRules(trace);\nif (!ruleResult.passed) return { score: 0, reason: ruleResult.error };\nconst judgeResult = await runLlmJudge(trace, dimensionSchema);' }
    ],
    relatedKnowledge: ['system-prompt', 'acceptance-criteria', 'testing-strategy'],
    suggestedNote: {
      id: 'note-eval-rules-vs-judge',
      title: '为什么规则明确的 AI Evaluation 不应该完全交给 LLM？'
    },
    suggestedTool: {
      id: 'tool-ai-eval-rule-design',
      title: 'AI Evaluation 规则设计与分层评测 Workflow'
    },
    status: 'confirmed'
  },
  {
    id: 'digest-eval-02',
    projectId: 'ai-seven-dimension-eval',
    title: 'LLM Judge Prompt 字段级拆分与二元判定改造',
    date: '2026-08-28',
    dateLabel: 'AUG 28',
    progress: '将原有单次 0-10 分主观综合打分，重构为 7 个维度的独立 0/1 二元判定（Binary Assertion），并强制要求 CoT 证据先于判定。',
    problem: '0-10 分制存在严重的分数漂移问题（今天 7 分明天 8 分），评测人员无法对中间分数达成共识，且无法自动化回归。',
    solution: '每个评测维度只回答 Yes/No，Prompt 输出强制采用 JSON Schema：{ evidence: string, reasoning: string, passed: boolean }。',
    reasoning: '二元判定降低了模型的判断熵，消除打分尺度不一致；证据先于结论可以显著减少大模型的偏见先验。',
    insight: '评测指标越原子化，LLM 判断的一致性越高。',
    reusableValue: '二元判定与理由先行 Prompt 模板可复用于各类 LLM 质检与安全审核场景。',
    sourceMaterials: [
      { id: 'mat-3', type: 'doc', title: '七维评测指标二元化定义表', content: '1. 意图覆盖 2. 事实真实 3. 边界拒绝 4. 逻辑连贯 5. 格式完备 6. 引导得当 7. 语气同理' }
    ],
    relatedKnowledge: ['system-prompt', 'testing-strategy'],
    status: 'confirmed'
  },
  {
    id: 'digest-pkl-01',
    projectId: 'personal-knowledge-lab',
    title: '内容生产与内容展示解耦：V2.0/V3.0 核心闭环收口',
    date: '2026-09-01',
    dateLabel: 'SEP 01',
    progress: '重构 Personal Knowledge Lab 顶层架构，确立“个人能力档案库”定位与 Topics/Notes/Papers/Work/Toolbox/Library 6 大分类。',
    problem: '过去需要分别手动写长文，日常维护心智负担重；必须解耦日常捕获与公开展示。',
    solution: '日常只维护真实项目与原始材料；通过 AI Content Compiler 提取 6 个固定核心字段生成 Project Digest；再按需升级为公开成果。',
    reasoning: '知识应当是实践的副产物，而不是额外负担。将输入压缩到最小（单一输入框），由 AI 承担结构化整理，用户负责最终把关。',
    insight: '做事情才是主干，整理知识是伴生流水线。',
    reusableValue: '个人知识管理与自动化编译体系方法论。',
    sourceMaterials: [
      { id: 'mat-5', type: 'doc', title: 'Personal Knowledge Lab V3.0 规划方案', content: 'DO -> CAPTURE -> AI DISTILL -> REVIEW -> PUBLISH' }
    ],
    relatedKnowledge: ['component-thinking', 'state-management'],
    status: 'confirmed'
  }
];
