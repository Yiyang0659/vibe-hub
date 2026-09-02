/**
 * AI Content Compiler
 * 遵循 10 大原则，从无序原始记录中提取事实、压缩信息并提炼核心结构
 */

export function compileProjectDigest(rawText = '', materials = [], project = {}) {
  const cleanRaw = rawText.trim();
  const titleMatch = cleanRaw.split(/[。！？\n]/)[0] || '项目推进关键节点';
  const title = titleMatch.length > 25 ? titleMatch.slice(0, 24) + '…' : titleMatch;

  const hasRuleSplit = cleanRaw.includes('规则') || cleanRaw.includes('分层') || cleanRaw.includes('拆开');
  const hasAsync = cleanRaw.includes('异步') || cleanRaw.includes('轮询') || cleanRaw.includes('超时');
  const hasV2 = cleanRaw.includes('V2') || cleanRaw.includes('V3') || cleanRaw.includes('解耦') || cleanRaw.includes('两层');

  let progress = cleanRaw || '完成了当前模块的阶段性重构与推进。';
  let problem = '在复杂多场景下，系统面临不确定性、状态一致性或维护成本过高的挑战。';
  let solution = '通过职责解耦与分层架构，设立明确边界与处理流水线。';
  let reasoning = '解耦能降低认知负载，使确定性逻辑与不确定性逻辑各自保持最佳扩展性。';
  let insight = '好的系统架构是用确定性契约划定安全边界。';
  let reusableValue = '可沉淀为通用的模块设计规范与最佳实践。';

  if (hasRuleSplit) {
    progress = '重新梳理了确定性规则引擎与模型语义判断的职责分工，将两者完全解耦。';
    problem = '确定性业务规则与主观语义判断混在同一个 Prompt 里，导致大模型频繁出现逻辑自相矛盾与打分漂移。';
    solution = '确定性规则（字段存在、状态码、正则）由轻量规则引擎执行；主观同理心与语义理解由独立 LLM Judge 进行二元断言。';
    reasoning = '避免用高成本的概率模型去解决已经有 100% 确定解法的问题，降低推理成本并提高稳定性。';
    insight = '确定性问题规则化，非确定性语义问题模型化。';
    reusableValue = '可复用于各类 AI Agent 自动化评测、质检与审核系统的分层架构。';
  } else if (hasAsync) {
    progress = '优化了慢速任务的端到端调用流，由同步阻塞改为异步任务状态机轮询。';
    problem = '长时间生成任务在移动端弱网环境下极易触发 HTTP 请求超时或导致界面卡死。';
    solution = '前端提交任务后立即获取 Task ID，结合静默加载动画与轻量状态机进行定时轮询。';
    reasoning = '将慢速物理延迟转化为可预期、可恢复的状态反馈契约。';
    insight = '慢速生成式 AI 任务体验的核心在于状态管理与心理预期管理。';
    reusableValue = '异步轮询状态机与降级机制可复用于所有耗时生成式 AI 产品。';
  } else if (hasV2) {
    progress = '完成了 Personal Knowledge Lab 内容生产与内容展示的二层解耦。';
    problem = '传统知识库维护成本过高，手动写长文导致日常更新中断。';
    solution = '平时只维护真实项目与随手记录，由 AI Content Compiler 自动提取 6 核心字段并按需升级。';
    reasoning = '做事情才是主干，知识整理是流水线伴生；用最小输入换取最大事实信息密度。';
    insight = '做事情才是主干，整理知识是伴生流水线。';
    reusableValue = '个人能力档案库与自动化提炼流水线方法论。';
  }

  // 评估升级价值
  let suggestedNote = null;
  let suggestedTool = null;

  if (cleanRaw.length > 30 || materials.length > 0) {
    if (hasRuleSplit) {
      suggestedNote = {
        title: '为什么规则明确的 AI Evaluation 不应该完全交给 LLM？',
        reason: '包含了对规则与大模型边界的深度思考。'
      };
      suggestedTool = {
        title: 'AI Evaluation 规则设计与分层评测 Workflow',
        reason: '具备高实用价值与可复用的标准化操作流程。'
      };
    } else if (hasAsync) {
      suggestedNote = {
        title: '慢速生成式 AI 任务的客户端状态设计哲学',
        reason: '从实践中沉淀出的前端状态与体验思考。'
      };
    } else {
      suggestedTool = {
        title: 'Prompt 5 步调试与工程化稳定性优化 Workflow',
        reason: '提炼出了可标准化的操作流程。'
      };
    }
  }

  const id = `digest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    projectId: project.id || 'general',
    title,
    date: new Date().toISOString().slice(0, 10),
    dateLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date()).toUpperCase(),
    progress,
    problem,
    solution,
    reasoning,
    insight,
    reusableValue,
    sourceMaterials: materials,
    relatedKnowledge: ['testing-strategy', 'acceptance-criteria', 'system-prompt'],
    suggestedNote,
    suggestedTool,
    status: 'draft'
  };
}

export function generateNoteDraft(digest, project = {}) {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: digest.suggestedNote?.title || `关于 ${digest.title} 的思考与沉淀`,
    oneLiner: digest.insight || '深入业务与工程实践得出的核心判断。',
    category: project.domain || 'AI Practice',
    date: digest.date || new Date().toISOString().slice(0, 10),
    duration: 5,
    question: `在推进 ${project.title || '项目'} 过程中，为什么会遇到 ${digest.problem}？`,
    myUnderstanding: digest.reasoning || digest.solution,
    example: `在实践中：${digest.progress}。面对 ${digest.problem}，最终采用：${digest.solution}`,
    myTake: digest.insight || '好系统是用确定性契约划定安全边界。',
    relatedTopics: digest.relatedKnowledge || ['testing-strategy', 'system-prompt'],
    relatedPapers: [],
    relatedWork: [project.id].filter(Boolean),
    sourceDigestId: digest.id
  };
}

export function generateToolboxDraft(digest, project = {}) {
  return {
    id: `tool-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'WORKFLOW',
    typeLabel: 'WORKFLOW',
    title: digest.suggestedTool?.title || `${digest.title} 操作 Playbook`,
    subtitle: digest.reusableValue || '从项目实践中提炼出的标准化可执行方法',
    category: project.domain || 'Engineering',
    date: digest.date || new Date().toISOString().slice(0, 10),
    problemSolved: digest.problem || '解决工程落地中的关键稳定性问题',
    whenToUse: `当在 ${project.title || '相关业务'} 中遇到类似 ${digest.problem} 的问题时使用。`,
    requiredInputs: ['业务场景描述与约束条件', '原始日志或输入数据', '验收标准与预期输出'],
    steps: [
      { step: 1, title: '明确问题边界与输入约束', detail: digest.problem },
      { step: 2, title: '执行核心分层处理策略', detail: digest.solution },
      { step: 3, title: '验证产物并进行回归测试', detail: digest.reasoning }
    ],
    checklist: [
      '所有确定性条件已通过规则验证',
      'Prompt 输出包含 evidence 证据与 reasoning 理由',
      '在极端长输入与异常边界下测试过鲁棒性'
    ],
    promptTemplate: `// ${digest.title} - 标准操作 Prompt 模板\nSystem: 你是一个严谨的 AI 专家。\n【任务要求】\n1. 严格遵守以下规则：${digest.solution}\n2. 输出必须包含 reasoning 与 passed 字段。`,
    example: `在项目 ${project.title || ''} 中，通过应用此方法：${digest.progress}，最终沉淀出核心认识：${digest.insight}`,
    limitations: [digest.reasoning || '注意模型随机性与超时降级处理'],
    sourceDigestId: digest.id
  };
}
