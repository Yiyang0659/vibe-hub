import { expandedLessons } from './expanded-data.js';

export const categories = [
  { id: '前端航线', code: 'FE', title: '前端开发', subtitle: '浏览器、界面与交互状态', accent: '#45e0bf' },
  { id: '后端航线', code: 'BE', title: '后端开发', subtitle: '数据、服务与业务规则', accent: '#58a6ff' },
  { id: 'AI 协作', code: 'AI', title: 'AI 协作', subtitle: '上下文、验收与迭代闭环', accent: '#f2b84b' },
  { id: '产品设计', code: 'PD', title: '产品设计', subtitle: '用户问题与信息结构', accent: '#ff7aa8' },
  { id: '工程实践', code: 'EN', title: '工程实践', subtitle: '测试、版本与可维护性', accent: '#a8b3c2' }
];

const shared = {
  updated: '2026-08-30',
  source: '个人学习笔记 · 原创整理'
};

const coreLessons = [
  {
    ...shared,
    id: 'frontend', title: '前端', english: 'Frontend', category: '前端航线', level: '入门', duration: 9,
    tags: ['浏览器', '界面', '请求'], excerpt: '用户在网页、小程序和软件里直接看到、点击和输入的那一层。',
    userSays: '老听人说前端、后端，这两个到底有什么区别？',
    definition: '前端是用户在网页、小程序和软件里直接看到、点击和输入的那一层。',
    why: '例如，在注册页，输入框、提交按钮和“正在提交 / 注册成功 / 出错了”的提示属于前端；账号是否真正创建成功，要由后端处理后返回结果。',
    points: ['读取用户输入并及时呈现状态', '按照 API 约定发出请求并处理响应', '根据真实结果更新页面，而不是提前假设成功'],
    example: '用户修改显示名称后点击保存：前端读取输入、显示保存中、发出请求，最后根据后端返回的真实结果显示成功或错误。',
    pitfalls: ['在请求返回前提前显示保存成功', '把密钥、可信价格或权限规则只放在浏览器里', '请求失败后清空用户已经填写的内容'],
    checklist: ['保存中状态与按钮禁用同步', '成功提示来自真实响应', '失败后保留输入并给出可执行的恢复方式'],
    boundary: '前端代码会交给浏览器运行，访问者可以查看或修改；密钥、价格和权限规则不能只放在前端。',
    scenario: {
      title: '一次保存经过哪些部分？',
      description: '突出显示的步骤表示“前端”在这条流程里负责的位置。',
      steps: [
        { title: '填写并点击保存', owner: '前端', focus: true, description: '读取输入，检查必要字段，并立即显示保存中。', panel: 'browser' },
        { title: '发出保存请求', owner: '前端', focus: true, description: '按照 API 约定发送地址、方法和数据。', panel: 'api' },
        { title: '接收、检查并处理', owner: '后端', focus: false, description: '接收请求，检查输入、身份和权限。', panel: 'backend' },
        { title: '写入记录', owner: '数据库', focus: false, description: '在检查通过后长期保存这次修改。', panel: 'database' },
        { title: '返回保存结果', owner: '后端', focus: false, description: '把状态码、结果数据或错误信息组成响应。', panel: 'backend' },
        { title: '显示结果', owner: '前端', focus: true, description: '根据真实响应更新页面，显示成功或可恢复的错误。', panel: 'browser' }
      ]
    },
    related: ['html-semantics', 'state-management', 'api-contract'],
    question: {
      prompt: '页面提示保存成功，刷新后却恢复原样。先检查什么？',
      choices: ['对照保存请求、成功提示出现时机，以及刷新后的读取响应', '先清除浏览器缓存并刷新，观察旧值是否还会出现', '把成功提示延迟一秒，再重复保存和刷新'],
      answer: 0,
      explanation: '先确认前端是否提前报告成功，再核对保存请求及刷新后的读取响应，才能判断数据究竟没有写入、没有读回，还是只显示错了状态。'
    },
    agentPrompt: '页面点保存以后会提示成功，但一刷新内容就没了。先检查前端是不是提前显示成功，以及它有没有正确处理保存请求和刷新后的读取结果。找到问题再改，改完重新保存并刷新确认。',
    references: [
      { title: 'Web 开发入门模块', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started' },
      { title: 'Web 是如何运作的', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works' }
    ]
  },
  {
    ...shared,
    id: 'html-semantics', title: '语义化 HTML', english: 'Semantic HTML', category: '前端航线', level: '入门', duration: 8,
    tags: ['HTML', '可访问性', 'SEO'], excerpt: '先把内容的身份写对，再讨论它长什么样。',
    definition: '语义化 HTML 是根据内容的真实角色选择元素：导航使用 nav，主要内容使用 main，独立文章使用 article，而不是把所有东西都装进没有含义的 div。',
    why: '正确的结构能同时帮助浏览器、搜索引擎、屏幕阅读器和未来维护代码的人理解页面。样式可以变化，内容的身份不应该随之丢失。',
    points: ['一个页面通常只有一个主要 main 区域', '按钮负责动作，链接负责前往地址', '标题层级描述内容关系，而不是字号大小'],
    example: '把“查看课程详情”写成链接，把“收藏课程”写成按钮，并让课程卡片使用 article 包裹。',
    pitfalls: ['为了样式方便滥用 div', '用可点击的 span 冒充按钮', '跳过标题级别来追求更大的默认字号'],
    checklist: ['关闭 CSS 后仍能看懂结构', '仅用键盘可以访问全部操作', '页面地标名称清晰且不重复'],
    related: ['accessibility', 'component-thinking'],
    question: { prompt: '点击课程标题要进入可复制地址的详情页，最合适的元素是什么？', choices: ['按钮 button', '链接 a', '普通 span 加点击事件'], answer: 1, explanation: '这是导航行为，应使用具有真实 href 的链接，浏览器返回、复制地址和键盘操作都会自然生效。' }
  },
  {
    ...shared,
    id: 'component-thinking', title: '组件化思维', english: 'Component Thinking', category: '前端航线', level: '入门', duration: 10,
    tags: ['组件', '复用', '界面'], excerpt: '不是把页面切成碎片，而是找到稳定的责任边界。',
    definition: '组件是拥有清晰输入、输出和职责的界面单元。它可以被复用，但“可复用”不是唯一目的；隔离复杂度、统一行为同样重要。',
    why: '当相同模式散落在多个页面时，文案、状态和交互很容易漂移。合理组件化能让一次修改覆盖所有正确位置。',
    points: ['围绕用户任务划分，而不是按视觉矩形切块', '通过参数表达差异，避免复制粘贴', '让组件负责自身状态，但不要吞掉业务规则'],
    example: '课程卡统一接收标题、分类、进度和收藏状态；不同页面只决定展示哪些课程。',
    pitfalls: ['只有一次使用也提前抽象', '一个组件处理整页所有逻辑', '用十几个布尔参数制造难懂组合'],
    checklist: ['组件名称能说明职责', '输入数据有明确默认值', '空状态与错误状态有定义'],
    related: ['state-management', 'design-token'],
    question: { prompt: '三个页面都有相同的课程卡，但收藏状态不同，应该怎么做？', choices: ['复制三份卡片代码', '建立课程卡组件并传入收藏状态', '把三个页面合并成一个页面'], answer: 1, explanation: '稳定结构由一个组件维护，页面只传入数据和状态，能避免样式与交互逐渐不一致。' }
  },
  {
    ...shared,
    id: 'state-management', title: '界面状态', english: 'UI State', category: '前端航线', level: '进阶', duration: 12,
    entryQuestion: '为什么界面总是记不住上一步发生了什么？',
    tags: ['State', '交互', '数据流'], excerpt: '页面会变化，就需要明确记住“现在是什么状态”。',
    definition: '界面状态是决定当前显示内容与可执行操作的数据，例如搜索词、选中的筛选项、请求是否进行中、收藏是否成功。',
    why: '如果状态散落在元素文字和 CSS 类名里，页面很容易互相矛盾。把状态集中表达，渲染结果才可预测。',
    points: ['区分服务器数据、页面状态与临时输入', '每个状态变化都应有明确触发原因', '从最小必要状态推导其余显示值'],
    example: '收藏按钮只保存课程 ID 集合，按钮文案和收藏总数都由这个集合推导。',
    pitfalls: ['保存可以计算出的重复数据', '成功提示早于真实写入结果', '多个组件各自保存同一事实'],
    checklist: ['刷新后该状态是否需要保留', '错误时能否恢复或重试', '快速连续操作不会得到错误结果'],
    related: ['component-thinking', 'api-contract'],
    question: { prompt: '收藏总数可以由收藏 ID 列表得到，应该如何保存？', choices: ['同时保存列表与总数', '只保存总数', '保存列表，需要时计算总数'], answer: 2, explanation: '总数是可以推导的数据，重复保存会带来两个值不同步的风险。' }
  },
  {
    ...shared,
    id: 'accessibility', title: '可访问性', english: 'Accessibility', category: '前端航线', level: '进阶', duration: 14,
    tags: ['A11y', '键盘', '对比度'], excerpt: '让不同能力、设备和环境中的人都能完成任务。',
    definition: '可访问性是从结构、键盘、视觉、文案和辅助技术等方面减少使用障碍，而不是上线前补一层特殊模式。',
    why: '清晰结构、足够对比度和可操作焦点不仅帮助残障用户，也改善强光、临时受伤、慢网和小屏场景。',
    points: ['交互元素必须有可见焦点', '颜色不能是唯一的信息载体', '表单错误要说明问题与修复方法'],
    example: '练习选项既用颜色标记正确与错误，也显示“回答正确/需要复习”的文字。',
    pitfalls: ['移除浏览器焦点轮廓', '给所有图标重复无意义描述', '只用鼠标悬停展示关键信息'],
    checklist: ['Tab 顺序符合视觉顺序', '放大到 200% 仍可操作', '减少动态效果偏好得到尊重'],
    related: ['html-semantics', 'responsive-layout'],
    question: { prompt: '错误输入框只有红色边框，没有任何文字，主要问题是什么？', choices: ['颜色不够鲜艳', '只靠颜色传达错误', '输入框应该更宽'], answer: 1, explanation: '用户可能无法区分颜色，也不知道错在哪里；需要同时提供明确错误信息。' }
  },
  {
    ...shared,
    id: 'responsive-layout', title: '响应式布局', english: 'Responsive Layout', category: '前端航线', level: '进阶', duration: 11,
    tags: ['CSS', '移动端', '布局'], excerpt: '不是把桌面页面缩小，而是为不同空间重新安排优先级。',
    definition: '响应式布局根据可用空间调整列数、导航方式、间距和内容优先级，让同一任务在不同设备上保持可用。',
    why: '桌面侧栏直接压缩到手机上会挤占正文。真正的响应式设计需要改变结构，而不只是改变尺寸。',
    points: ['从内容断点出发，而不是追随设备型号', '移动端保持主要操作可见', '允许文字自然换行，避免固定高度'],
    example: '桌面端左侧航海导航在手机上变成底部四项快捷栏，搜索仍保留在顶部。',
    pitfalls: ['隐藏内容却没有替代入口', '给卡片固定高度导致文字被裁切', '缩小触控目标来塞下更多按钮'],
    checklist: ['320px 宽度不横向滚动', '触控目标有足够尺寸', '长标题与大字号不会破坏布局'],
    related: ['accessibility', 'design-token'],
    question: { prompt: '桌面侧栏在手机上占掉一半宽度，最合理的处理是？', choices: ['把字体缩到 10px', '让页面横向滚动', '改为顶部菜单或底部快捷导航'], answer: 2, explanation: '小屏需要重新组织导航形态，同时保持主要入口可达。' }
  },
  {
    ...shared,
    id: 'api-contract', title: 'API 契约', english: 'API Contract', category: '后端航线', level: '入门', duration: 10,
    tags: ['API', '请求', '响应'], excerpt: '前后端先约定如何说话，才能各自稳定工作。',
    definition: 'API 契约定义一个请求的地址、方法、参数、身份要求、成功结果和错误格式，是服务之间可验证的共同约定。',
    why: '只约定“返回用户数据”远远不够。字段为空怎么办、权限失败返回什么、是否可以重试，都需要被明确。',
    points: ['输入与输出字段要有类型和约束', '错误结构应稳定且可供界面解释', '契约变化要考虑旧客户端兼容'],
    example: '保存笔记接口明确接收 lessonId 与 content，成功返回更新时间，内容超长返回可读错误码。',
    pitfalls: ['所有失败都返回 200', '字段含义只存在口头约定', '前端猜测不同错误的文字'],
    checklist: ['包含成功与失败示例', '注明鉴权与权限边界', '说明幂等和重试行为'],
    related: ['data-model', 'error-handling'],
    question: { prompt: '接口失败时永远返回 200 和一段不同格式文字，会造成什么问题？', choices: ['页面颜色不好看', '调用方难以稳定识别和处理错误', '请求速度一定会更慢'], answer: 1, explanation: '稳定的状态码和错误结构是契约的一部分，调用方才能可靠提供反馈。' }
  },
  {
    ...shared,
    id: 'data-model', title: '数据模型', english: 'Data Model', category: '后端航线', level: '进阶', duration: 13,
    tags: ['数据库', '实体', '关系'], excerpt: '先说明世界里有哪些东西，再决定表和字段。',
    definition: '数据模型描述业务实体、属性、关系和约束，例如课程、用户、学习记录之间如何关联。',
    why: '如果直接从页面输入框设计数据库，相同概念会被重复保存，未来统计、权限和迁移都会变得困难。',
    points: ['围绕稳定业务事实建模', '明确一对一、一对多和多对多关系', '数据库约束保护不能被破坏的规则'],
    example: '完成记录单独关联用户与课程，并用唯一约束防止同一课程重复生成两条完成记录。',
    pitfalls: ['把多个值塞进逗号分隔文本', '依赖应用代码保证所有约束', '过早为未知需求建立复杂抽象'],
    checklist: ['字段名称表达同一业务语言', '时间和状态变化有记录策略', '删除行为与关联数据处理清楚'],
    related: ['api-contract', 'database'],
    question: { prompt: '同一用户不能重复收藏同一课程，最可靠的保护在哪里？', choices: ['按钮点击后变灰', '数据库中的用户与课程联合唯一约束', '提醒用户不要重复点击'], answer: 1, explanation: '界面可以改善体验，但数据库约束才能在并发和不同客户端下守住事实。' }
  },
  {
    ...shared,
    id: 'error-handling', title: '错误处理', english: 'Error Handling', category: '后端航线', level: '进阶', duration: 12,
    tags: ['错误', '恢复', '日志'], excerpt: '错误不可避免，好的系统让它可见、可理解、可恢复。',
    definition: '错误处理包括识别失败类型、记录诊断信息、向用户提供恰当反馈，并在安全条件下重试或回滚。',
    why: '一句“出错了”既不能帮助用户继续，也不能帮助开发者定位。不同失败需要不同恢复路径。',
    points: ['用户消息与内部诊断信息分离', '可重试错误不要重复产生副作用', '关键操作失败应保持已有数据'],
    example: '笔记保存失败时保留编辑内容，显示重试按钮，并在后台记录请求标识和错误原因。',
    pitfalls: ['吞掉异常后假装成功', '把数据库错误原样展示给用户', '无限自动重试造成更多负载'],
    checklist: ['用户知道发生了什么', '用户知道下一步能做什么', '开发者有足够上下文定位问题'],
    related: ['api-contract', 'testing-strategy'],
    question: { prompt: '保存失败后最不应该做什么？', choices: ['保留用户输入', '提供重试入口', '清空表单并只显示错误代码'], answer: 2, explanation: '清空输入会让用户失去劳动成果，错误代码也不能提供可执行的恢复方式。' }
  },
  {
    ...shared,
    id: 'prompt-context', title: '提示词上下文', english: 'Prompt Context', category: 'AI 协作', level: '入门', duration: 9,
    entryQuestion: '为什么给 AI 的背景信息越多，回答反而越不靠谱？',
    tags: ['提示词', '上下文', '目标'], excerpt: '不是写得更长，而是给出真正影响判断的信息。',
    definition: '提示词上下文是模型完成任务所需的背景、目标、约束、已有材料和验收标准。有效上下文与任务直接相关。',
    why: '“帮我优化一下”没有说明为谁优化、解决什么问题、不能改变什么，模型只能用常见默认值补空白。',
    points: ['先说目标用户与真实任务', '提供现有代码或资料的准确位置', '把不可改变的限制写成明确边界'],
    example: '将“做个首页”改为“为中文个人学习站设计首页，用户需要继续上次课程；保留本地数据，不增加登录”。',
    pitfalls: ['堆叠无关角色设定', '把实现细节误写成业务目标', '没有说明完成后如何验证'],
    checklist: ['目标是否可观察', '关键输入是否已提供', '限制和验收是否互相矛盾'],
    related: ['acceptance-criteria', 'iteration-loop'],
    question: { prompt: '下面哪项最能提高“优化这个页面”的可执行性？', choices: ['加上“你是世界级设计师”', '说明目标用户、当前问题和验收标准', '重复三次“必须认真”'], answer: 1, explanation: '与任务有关的背景和可验证结果，比空泛角色或强调语气更能减少误解。' }
  },
  {
    ...shared,
    id: 'acceptance-criteria', title: '验收标准', english: 'Acceptance Criteria', category: 'AI 协作', level: '入门', duration: 8,
    tags: ['验收', '任务', '质量'], excerpt: '把“做好”翻译成可以检查的结果。',
    definition: '验收标准是一组判断任务是否完成的具体条件，描述用户能观察到的行为，而不是含糊的质量形容词。',
    why: '“专业、高级、好用”无法直接验证。明确尺寸、状态、流程和边界，才能让实现与复查对齐。',
    points: ['使用给定情境—操作—结果描述行为', '覆盖正常、空白与失败状态', '每条标准都能被独立验证'],
    example: '搜索无结果时显示当前关键词、清空按钮和返回全部课程入口，而不是留下空白区域。',
    pitfalls: ['把实现方案当成验收结果', '只覆盖理想路径', '使用“尽量”“适当”等模糊词'],
    checklist: ['标准可由他人重复检查', '包含关键设备或环境', '没有规定与目标无关的细枝末节'],
    related: ['prompt-context', 'testing-strategy'],
    question: { prompt: '哪一条是更好的验收标准？', choices: ['页面要非常高级', '手机上体验尽量好', '在 360px 宽度下无横向滚动且主导航可操作'], answer: 2, explanation: '它给出了环境、可观察结果和明确边界，可以真实检查。' }
  },
  {
    ...shared,
    id: 'iteration-loop', title: '迭代闭环', english: 'Iteration Loop', category: 'AI 协作', level: '进阶', duration: 11,
    tags: ['迭代', '反馈', '验证'], excerpt: '一次生成只是起点，观察结果才能决定下一步。',
    definition: '迭代闭环是“提出小目标—生成或修改—运行验证—观察差距—继续调整”的工作循环。',
    why: '同时要求大量改动会让问题来源难以定位。小批次、有证据的反馈更容易保持方向并降低返工。',
    points: ['一次聚焦一个可验证变化', '反馈描述观察到的事实', '修复后重新执行原来的验证'],
    example: '先完成搜索并测试空结果，再增加收藏；避免一次同时实现五个未定义功能。',
    pitfalls: ['只看代码没有运行页面', '用“还是不对”代替具体差异', '发现问题后继续堆新功能'],
    checklist: ['本轮目标是否足够小', '验证证据是否可复现', '下一步来自当前差距而非新灵感'],
    related: ['acceptance-criteria', 'testing-strategy'],
    question: { prompt: '界面修改后最有效的反馈是什么？', choices: ['还是不够高级', '移动端 360px 下收藏按钮被标题遮住，截图已标出', '全部重新设计'], answer: 1, explanation: '具体环境、现象和位置让问题可以复现，也便于验证修复。' }
  },
  {
    ...shared,
    id: 'user-problem', title: '用户问题', english: 'User Problem', category: '产品设计', level: '入门', duration: 9,
    tags: ['用户', '问题', '需求'], excerpt: '先理解人为什么受阻，再讨论做哪个功能。',
    definition: '用户问题描述某类人在特定情境下想完成什么、受到什么阻碍，以及阻碍带来的影响。',
    why: '“需要一个 AI 功能”是方案，不是问题。回到真实任务，团队才有空间选择更简单有效的解法。',
    points: ['包含具体人群和发生情境', '描述阻碍而不是预设按钮', '影响应能被观察或验证'],
    example: '初学者学完零散教程后找不到下一步，也看不到进度，因此常在第二周放弃。',
    pitfalls: ['把所有人当成目标用户', '用自己偏好代替用户证据', '一开始就锁定技术方案'],
    checklist: ['问题来自访谈或行为证据', '没有偷偷塞入解决方案', '说明了为什么值得现在处理'],
    related: ['user-interview', 'information-architecture'],
    question: { prompt: '哪一句更像用户问题？', choices: ['我们需要一个 AI 推荐按钮', '学习者不知道下一步学什么，常在完成第一课后离开', '首页需要三个卡片'], answer: 1, explanation: '它描述了用户、阻碍和可观察影响，没有提前锁死解决方式。' }
  },
  {
    ...shared,
    id: 'user-interview', title: '用户访谈', english: 'User Interview', category: '产品设计', level: '进阶', duration: 13,
    tags: ['访谈', '研究', '证据'], excerpt: '追问真实经历，而不是让用户替你设计产品。',
    definition: '用户访谈通过开放问题了解过去发生的真实行为、动机、阻碍和替代方案。',
    why: '人们对未来行为的预测常不准确，礼貌性认同也不等于会使用。具体经历比抽象偏好更可靠。',
    points: ['询问最近一次具体经历', '追问当时怎么做和为什么', '区分原话、观察与研究者推断'],
    example: '不要问“你会用学习打卡吗”，而问“上次中断课程后，你怎么记住学到哪里”。',
    pitfalls: ['引导用户同意方案', '只记录支持自己想法的回答', '把一个人的意见当成普遍结论'],
    checklist: ['问题以经历而非假设为中心', '获得记录与引用授权', '访谈后按模式整理而非逐人总结'],
    related: ['user-problem', 'information-architecture'],
    question: { prompt: '哪一个访谈问题更有效？', choices: ['你喜欢我们的学习地图吗？', '如果加提醒你会每天用吗？', '回忆最近一次忘记学习进度时，你后来怎么找到位置？'], answer: 2, explanation: '它要求讲述最近的真实经历，能得到行为、障碍和替代方案证据。' }
  },
  {
    ...shared,
    id: 'information-architecture', title: '信息架构', english: 'Information Architecture', category: '产品设计', level: '进阶', duration: 12,
    tags: ['导航', '分类', '内容'], excerpt: '让人知道这里有什么、自己在哪、下一步去哪。',
    definition: '信息架构组织内容的分类、层级、标签和导航，使用户能发现信息并建立稳定的心理模型。',
    why: '内容再完整，如果分类只反映内部团队结构，用户仍然找不到。清晰架构来自用户任务和内容关系。',
    points: ['一级分类数量保持可扫描', '同一概念使用一致名称', '搜索与浏览互相补充'],
    example: '个人学习站以学习领域为一级航线，以难度和标签辅助筛选，详情页提供相关内容继续前进。',
    pitfalls: ['分类互相重叠却没有说明', '导航名称在不同页面漂移', '把所有内容塞进一个长首页'],
    checklist: ['新用户能预测入口内容', '当前所在位置清楚', '无结果时有返回路径'],
    related: ['user-problem', 'responsive-layout'],
    question: { prompt: '知识条目既可按领域也可按难度查找，合理方式是？', choices: ['建立两份重复内容', '领域做主分类，难度作为筛选属性', '只保留搜索框'], answer: 1, explanation: '稳定领域适合作为主架构，难度作为跨分类属性，既避免重复也支持不同查找方式。' }
  },
  {
    ...shared,
    id: 'git-workflow', title: 'Git 工作流', english: 'Git Workflow', category: '工程实践', level: '入门', duration: 10,
    entryQuestion: 'AI 把代码改坏了，怎么放心地回退？',
    tags: ['Git', '版本', '协作'], excerpt: '用可理解的小步记录，让改变能够检查和回退。',
    definition: 'Git 工作流规定如何分支、提交、审查与合并代码，让团队知道每次变化的目的与边界。',
    why: '巨大且混杂的提交难以审查，也难以安全回退。小而完整的提交能保留清晰决策历史。',
    points: ['一个提交表达一个完整意图', '提交前检查变更范围与测试结果', '不要把密钥和生成物混入版本库'],
    example: '先提交搜索逻辑与测试，再单独提交搜索界面；出现问题时可以精确定位。',
    pitfalls: ['提交信息只有 update', '把格式化与功能改动混在一起', '未经检查提交所有未跟踪文件'],
    checklist: ['差异中没有无关文件', '提交信息说明为什么改变', '提交在独立状态下可以运行'],
    related: ['testing-strategy', 'performance-budget'],
    question: { prompt: '哪种提交最容易审查？', choices: ['一周全部改动一次提交', '搜索功能、测试和必要样式组成一个聚焦提交', '每保存一次文件都提交'], answer: 1, explanation: '一个可运行、目标单一的变化既提供完整上下文，也不会混入无关内容。' }
  },
  {
    ...shared,
    id: 'testing-strategy', title: '测试策略', english: 'Testing Strategy', category: '工程实践', level: '进阶', duration: 14,
    tags: ['测试', '质量', '回归'], excerpt: '把测试放在最能降低风险的地方，而不是追求数量。',
    definition: '测试策略根据失败风险选择单元、集成、端到端和人工检查的组合，并明确关键路径与测试边界。',
    why: '只测函数可能漏掉真实交互，只依赖端到端测试又会慢且脆弱。不同层级应解决不同问题。',
    points: ['纯逻辑优先使用快速单元测试', '关键流程验证组件或系统协作', '视觉与可用性需要真实页面检查'],
    example: '搜索匹配用单元测试，收藏持久化用集成测试，移动布局用浏览器截图验收。',
    pitfalls: ['为了覆盖率测试实现细节', '测试之间共享脆弱状态', '失败后只重跑而不理解原因'],
    checklist: ['关键用户路径有保护', '测试失败信息能定位行为', '测试数据稳定且容易理解'],
    related: ['iteration-loop', 'error-handling'],
    question: { prompt: '响应式布局是否遮挡按钮，最适合如何验证？', choices: ['只写字符串单元测试', '在目标视口运行页面并检查截图与交互', '代码能编译就算通过'], answer: 1, explanation: '这属于真实布局和交互问题，需要浏览器环境验证，而不是纯逻辑测试。' }
  },
  {
    ...shared,
    id: 'design-token', title: '设计令牌', english: 'Design Token', category: '工程实践', level: '进阶', duration: 11,
    tags: ['CSS', '设计系统', '一致性'], excerpt: '给颜色、间距和圆角起稳定名字，减少视觉漂移。',
    definition: '设计令牌是对颜色、字体、间距、阴影等视觉决策的命名变量，让设计意图可以跨组件一致复用。',
    why: '到处复制 #b7472a 会让主题切换和品牌调整变得危险；语义名称能说明这个颜色为何存在。',
    points: ['优先使用语义名称而不是具体色名', '基础尺度保持有限且有规律', '组件变量可引用全局令牌再局部调整'],
    example: '使用 --color-action 表示主要操作色，夜航模式只需重新定义该语义变量。',
    pitfalls: ['为每个像素值建立变量', '令牌名称绑定单一页面位置', '组件绕过令牌直接写魔法数字'],
    checklist: ['名称表达用途而非外观', '亮暗主题都能映射', '常用组件没有近似但不同的值'],
    related: ['component-thinking', 'responsive-layout'],
    question: { prompt: '哪个变量名更适合作为设计令牌？', choices: ['--red-color', '--homepage-button-red', '--color-action-primary'], answer: 2, explanation: '语义名称描述用途，不绑定某个具体颜色或页面，因此更容易支持主题与复用。' }
  },
  {
    ...shared,
    id: 'performance-budget', title: '性能预算', english: 'Performance Budget', category: '工程实践', level: '进阶', duration: 12,
    tags: ['性能', '加载', '指标'], excerpt: '在页面变慢之前，为资源和体验设一条明确边界。',
    definition: '性能预算为脚本体积、图片大小或关键体验指标设定可检查上限，并在开发流程中持续监控。',
    why: '性能通常不是一次优化完成的，而会随功能逐渐退化。没有边界，每个“只增加一点”最终都会累积。',
    points: ['预算要对应真实用户设备与网络', '优先保护关键内容和主要操作', '超出预算时需要明确取舍而非忽略'],
    example: '个人知识站首屏不依赖大型图片和框架，核心内容在离线环境仍能直接打开。',
    pitfalls: ['只在高性能电脑测试', '把懒加载用于首屏关键内容', '以压缩分数代替真实体验'],
    checklist: ['记录资源体积基线', '测试慢速网络与低端设备', '部署前自动检查关键阈值'],
    related: ['testing-strategy', 'responsive-layout'],
    question: { prompt: '性能预算最重要的作用是什么？', choices: ['让所有文件一样大', '在体验退化前暴露资源增长', '保证页面永远没有图片'], answer: 1, explanation: '预算提供持续可检查的边界，让团队在新增资源时看见代价并做取舍。' }
  }
];

export const lessons = [...coreLessons, ...expandedLessons];

export const learningQuote = '真正的理解不是记住名词，而是能在出错时知道该检查哪里。';
