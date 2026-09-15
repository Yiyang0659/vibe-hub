import { awakekeeperEnglish } from '../shared/content/awakekeeper-english.js';
import { englishContent } from '../shared/content/english.js';
// Original Chinese is retained for exact round trips. English content is bundled locally.
export const translations = {
'产品':'Product','首页':'Home','项目':'Projects','知识':'Knowledge','思考':'Thinking','资源':'Resources','关于':'About',
'想与做':'Think & Build','想与做首页':'Think & Build home','AI 产品与应用实践':'AI products & practice',
'主要页面':'Main pages','全站导航':'Site navigation','跳到主要内容':'Skip to content','返回页面顶部':'Back to top',
'搜索网站内容':'Search this site','搜索（/）':'Search (/)', '打开导航菜单':'Open navigation','关闭导航菜单':'Close navigation',
'切换为夜航模式':'Switch to dark mode','切换为日间模式':'Switch to light mode',
'当前：日间模式（点击切换夜航）':'Light mode — switch to dark','当前：夜航模式（点击切换日间）':'Dark mode — switch to light',
'知识 / Knowledge':'Knowledge','思考 / Thinking':'Thinking','资源 / Resources':'Resources','关于 / About':'About',
'把没弄懂的问题，':'Start with a question.', '整理成可反复查阅的知识。':'Build knowledge worth revisiting.',
'把理解、判断和复盘，':'Reflect on what you learn.', '写成自己的思考。':'Make your thinking your own.',
'把有用的方法和工具，':'Keep useful tools and methods.', '留给下一次使用。':'Ready for the next time.',
'我在学习 AI，':'I am learning about AI.', '也在把它做成真实的东西。':'And building things with it.',
'记录学习 AI、产品与开发时遇到的概念与方法。需要时查清一个术语，也可以沿着系列目录，从基础开始把知识连起来。':'Concepts and methods from learning AI, product design and development. Look up a term, or follow a series to connect the fundamentals.',
'留下一次学习中的疑问、一段实践后的判断，以及还在变化的想法。记录当时为什么这样想，也给之后的自己留下重新审视的空间。':'Questions from learning, reflections from practice, and ideas still taking shape. Writing down why I thought something leaves room to revisit it later.',
'把实践中用过的工具、检查清单、提示词和参考资料整理在一起。按用途查找，先了解适用场景，再决定怎样用在自己的问题里。':'Tools, checklists, prompts and references used in practice. Browse by purpose and understand where each resource fits before using it.',
'我是“想与做”，正在学习 AI、产品与开发。这里是我的个人学习记录平台：把遇到的问题、动手做过的项目，以及实践后的复盘认真留下来。':'I am the person behind Think & Build, learning AI, product design and development. This is my personal record of questions, projects and lessons from practice.',
'搜索':'Search','浏览完整目录 ↓':'Browse the full directory ↓','知识目录':'Knowledge directory','思考记录':'Reflections','资源目录':'Resource directory',
'搜索知识目录':'Search knowledge','搜索思考目录':'Search reflections','搜索资源目录':'Search resources',
'搜索：RAG / MVP / Agent / PRD …':'Search: RAG / MVP / Agent / PRD …','搜索文章、产品分析、实践复盘 …':'Search reflections, product analysis, reviews …','搜索工具、清单、提示词 …':'Search tools, checklists, prompts …',
'从这些知识开始':'Start exploring','最近的思考':'Recent reflections','值得回看的资源':'Resources to revisit','在这里你会看到':'What you will find',
'术语知识':'Concepts & terminology','系列学习':'Learning series','全部系列 →':'All series →',
'按方向与二级分类整理，用名称或关键词找到需要的概念。':'Browse by topic and category, or search for a concept by name.',
'沿着主题和章节逐步阅读，让零散的知识有一条清晰的路径。':'Follow chapters and themes to connect individual concepts into a learning path.',
'随笔与观察':'Notes & observations','分析与复盘':'Analysis & reflection',
'从日常学习和产品体验出发，写下自己的理解与疑问。':'Questions and insights from everyday learning and product experiences.',
'关注选择的理由、实践的结果，以及下一次可以改进的地方。':'The reasoning behind choices, what happened in practice, and what to improve next.',
'工具与方法':'Tools & methods','参考资料':'References','工具、脚本、清单与提示词，附上用途和使用说明。':'Tools, scripts, checklists and prompts, with context and instructions.',
'值得回看的文档与网站，保留来源，方便继续深入。':'Useful documents and websites, with links to the original sources.',
'先理解一个概念，再多走一步。':'Understand one concept. Then take the next step.',
'写下来，是为了下一次想得更清楚。':'Write it down to think more clearly next time.',
'资源不必很多，重要的是下次找得到、用得上。':'Keep resources you can find and use again.',
'现在我在做什么':'What I am working on','CURRENT FOCUS · 持续实践':'CURRENT FOCUS · WORK IN PROGRESS',
'持续整理想与做的学习记录':'Developing the Think & Build learning platform',
'改进滑一叠的小程序体验':'Improving the Hua Yi Die mini-program experience',
'把实践中的方法沉淀成知识与资源':'Turning practical experience into knowledge and resources',
'想法 → 实践 → 真实的东西':'Idea → Practice → Something real','了解我的记录方式 ↓':'How I document learning ↓',
'我在关注什么':'What I explore','我怎么做事':'How I work','为什么做这个网站':'Why this website',
'AI、产品实践与个人知识系统。':'AI, product practice and personal knowledge systems.',
'理解问题 → 动手实践 → 验证结果 → 复盘沉淀。':'Understand → Build → Validate → Reflect.',
'把零散学习与项目经验，慢慢变成能复用的个人系统。':'Turning learning and project experience into a personal system I can reuse.',
'想与做，和更好的可能性在一起。':'Think & Build. Explore what could be better.',
'前端':'Frontend','后端':'Backend','产品分析':'Product analysis','实践复盘':'Practice reviews','设计风格':'Design styles',
'随笔':'Notes','工具与脚本':'Tools & scripts','清单与模板':'Checklists & templates','提示词':'Prompts','外部资料':'External resources',
'全部':'All','全部术语':'All concepts','分类':'Categories','清除筛选':'Clear filters','搜索术语':'Search concepts','搜索系列':'Search series','搜索文章':'Search articles','搜索资源':'Search resources',
'搜索术语名称或关键词':'Search concept names or keywords','搜索系列名称或主题':'Search series or topics','搜索文章标题或内容':'Search article titles or content','搜索资源名称或用途':'Search resources or use cases',
'查清一个概念，或沿着一个主题系统学习。':'Look up a concept, or follow a topic step by step.',
'留下学习中的判断、实践后的复盘，以及还在变化的想法。':'Insights from learning, reflections on practice, and evolving ideas.',
'把值得反复使用的工具、清单和资料，放在容易找到的地方。':'Keep reusable tools, checklists and references easy to find.',
'按分类整理，向下浏览完整目录。':'Organized by category. Scroll to explore the full directory.',
'查看系列 →':'Explore series →','外部资料将在新标签页打开。':'External resources open in a new tab.',
'把 AI 想明白，':'Understand AI.', '也把它做出来。':'Build something with it.',
'浏览学习记录':'Explore learning records','看看我的实践':'Explore my projects','查看项目':'View projects','读最近文章':'Read recent articles',
'记录学习 AI、产品和开发时遇到的问题，把逐渐弄懂的概念、动手尝试的过程，以及有用的小工具整理在这里。':'A record of learning AI, product design and development: concepts I am understanding, things I am building, and tools that help.',
'从问题开始':'Start with a problem','让结果可验证':'Make results testable','想与做的书桌':'The Think & Build desk',
'把问题摆上桌，':'Put a question on the desk.', '把想法一点点做出来。':'Bring ideas to life, one step at a time.',
'知识目录与系列的正文保留原文':'Knowledge and article content remains in its original language',
};
Object.assign(translations, {
 '阅读项目过程 ↓':'Read the project story ↓','返回项目列表 →':'Back to projects →','术语目录参考 VibeHub；正文与实践章节由本站整理。学习记录保存在当前浏览器。':'The terminology directory draws on VibeHub. Explanations and practice chapters are written for this site. Learning records are stored in this browser.',
 '想与做 · 记录、实践、持续成长':'Think & Build · Record, practice and grow',
 '查看使用说明 →':'Read instructions →','打开清单 →':'Open checklist →','（新标签页）':'(new tab)',
 '查阅 Web 标准、开发文档和学习路径。':'Explore web standards, developer documentation and learning paths.',
 '相关内容':'Related content','沿着这条记录继续':'Continue this trail',
 '遇到的问题':'The question','理解与尝试':'Understanding and experiments','阶段结论':'Current conclusions',
 '返回项目列表':'Back to projects','阅读项目过程':'Read the project story',
 '项目 / 想与做':'Projects / Think & Build','项目 / 滑一叠':'Projects / Hua Yi Die',
 '只看代码没有运行页面':'Reading the code without running the page',
 '合并成功后不运行页面':'Not running the page after a successful merge',
 'AI 图片设计与出图小程序项目界面':'AI image design mini-program interface',
 'Personal Knowledge Lab V2.0 / V3.0项目界面':'Personal Knowledge Lab V2.0 / V3.0 interface',
 '个人学习与实践记录网站':'A personal website for learning and practice',
 '想与做 · 学习与实践记录':'Think & Build · Learning and practice',
 '想与做 · 学习与实践记录网站':'Think & Build · A learning and practice journal',
 '想与做 · 个人学习记录网站':'Think & Build · A personal learning journal',
 '滑一叠':'Hua Yi Die','划一叠':'Hua Yi Die','滑一叠 · 微信小程序':'Hua Yi Die · WeChat mini-program',
 '微信小程序':'WeChat mini-program','持续迭代':'Iterating','个人网站':'Personal website',
 '为什么把学习过程留在这里':'Why I record my learning here',
 '建站记录':'Building this site',
 '从术语、短笔记和小工具开始，让网站跟着真实积累一起成长。':'Start with concepts, short notes and small tools. Let the site grow alongside what I actually learn.',
 '项目和成熟文章还不多时，这个网站应该记录什么？':'What should this website record while I have only a few projects and finished articles?',
 '现阶段可以先留下学习中遇到的概念、自己的总结，以及已经整理的小插件。首页保留个人表达，内容从真实的问题和尝试开始积累。':'For now, I can record concepts I encounter, my own summaries and small plugins I have organized. The homepage keeps a personal voice, while the content grows from real questions and experiments.',
 '先让记录、整理和回看变得方便，项目与成体系的文章随着实践逐渐增加。':'Make it easy to capture, organize and revisit learning first. Projects and longer articles can grow with practice.',
 '先确定记录的形式，再慢慢填充内容':'Define the format, then build the collection',
 '给不同内容一个稳定的展示方式，减少每次新增记录时调整页面的成本。':'Give each content type a consistent format, so adding a record does not require redesigning the page.',
 '新增知识、笔记或工具时，怎样避免反复修改页面布局？':'How can I add knowledge, notes or tools without repeatedly changing the layout?',
 '知识解释一个概念，笔记记录理解过程，项目汇总实践，工具提供复用入口。为每种内容保留必要字段，额外材料按需要出现，列表和首页从同一份内容读取摘要。':'Knowledge explains a concept; notes capture how I understand it; projects document practice; tools make methods reusable. Each type has essential fields, optional supporting material, and a single source for summaries on the homepage and in lists.',
 '先用少量真实材料验证模板是否好填，再逐步增加记录。':'Test the templates with a few real examples before gradually adding more records.',
 '把学习记录放回网站的中心':'Put learning records at the heart of the site',
 '保留个人首页，也为还在形成的理解留出位置。':'Keep the personal homepage, while making room for understanding that is still developing.',
 '讨论网站内容时，发现现有页面更强调完整项目和成熟文章，而眼下主要在积累术语、总结与小插件。':'While discussing the site, I realized that the pages emphasized finished projects and articles, while most of my current work consists of concepts, summaries and small plugins.',
 '网站可以同时呈现个人方向和学习过程。短记录也有独立的价值，不必等内容足够完整才开始整理。':'The site can show both my direction and my learning process. Short records have value too; I do not have to wait for a complete article to start organizing them.',
 '本轮确定以学习和实践记录为内容主线，保持已有个人网站的视觉方向。':'This iteration centers the content on learning and practice, while keeping the existing visual direction.',
 'AI 产品从 0 到 1：从问题到持续迭代':'AI products from zero to one: from a problem to continuous iteration',
 '从 Prompt 到 Agent Workflow':'From prompts to agent workflows',
 '提示词上下文':'Prompt context','检索增强生成':'Retrieval-augmented generation','最小可行产品':'Minimum viable product','用户流程':'User flow',
 'RAG 是什么？':'What is RAG?','API 是什么？':'What is an API?','MVP 是什么？':'What is an MVP?','User Flow 是什么？':'What is a user flow?',
 '不是写得更长，而是给出真正影响判断的信息。':'Good context is not about length. It supplies the information that changes the decision.',
 '让不同程序通过明确入口和格式交换能力与数据。':'Let different programs exchange data and capabilities through defined interfaces and formats.',
 '先检索相关资料，再让模型基于资料生成回答。':'Retrieve relevant information first, then have the model answer using it.',
 '用最小完整方案验证最关键的不确定性。':'Use the smallest complete solution to test the most important uncertainty.',
 '描述用户从起点到完成任务所经过的页面和决策。':'Describe the screens and decisions a user passes through to complete a task.',
 '连接 AI 应用与外部工具、资源等能力的协议。':'A protocol connecting AI applications to external tools and resources.',
 '合并请求':'Pull request','开关':'Switch','组件化思维':'Component thinking','知识点':'Concept','站内补充':'Site notes',
 '页面':'Page','界面':'Interface','回看':'Revisit','复盘':'Reflection','AI 协作':'AI collaboration','后端航线':'Backend','产品设计':'Product design',
 '一句话理解':'In one sentence','一个简单例子':'A simple example','本页提要':'On this page','继续阅读':'Continue reading',
 '我的理解 / My Take':'My take','怎样做':'How to do it','本章目标':'Chapter goal','动手练习':'Practice exercise','本章交付物':'Deliverable','完成检查':'Completion checklist',
 '← 返回知识目录':'← Back to knowledge','← 返回思考列表':'← Back to reflections','← 返回资源目录':'← Back to resources',
 '把知识、项目过程和可复用资源组织起来，让零散积累更容易查找与回看。':'Organize knowledge, project records and reusable resources so that accumulated learning is easier to find and revisit.',
 '学习资料和项目经验分散在不同地方，新增内容时又容易被页面调整打断。既希望自己能回看关键记录，也希望读者能理解项目为什么做、怎样推进。':'Learning material and project experience were scattered across different places. Adding content often turned into adjusting layouts. I wanted to revisit key records and help readers understand why each project exists and how it develops.',
 '保留个人首页，将项目、知识、思考和资源分开组织。术语与系列各有目录，项目过程通过相关内容连接到知识、思考与工具。':'Keep a personal homepage and organize projects, knowledge, reflections and resources separately. Give concepts and series their own directories, and connect project progress to related knowledge, reflections and tools.',
 '围绕个人学习记录确定需求和约束，选择页面方案，并通过实际浏览反馈调整信息层级。':'Define requirements and constraints around personal learning records, choose page layouts, and refine the information hierarchy through actual browsing feedback.',
 'AI 辅助梳理方案、生成设计参考、实现页面、整理代码证据与运行测试；项目方向和体验反馈由本人提出。':'AI helps organize proposals, generate design references, implement pages, collect code evidence and run tests. I set the project direction and provide feedback on the experience.',
 '术语与系列分开：查概念和系统学习是不同的阅读任务。':'Separate concepts from series: looking up a term and following a learning path are different tasks.',
 '同一内容维护一份：通过关联入口和共享模板展示，减少重复更新。':'Maintain one source for each record and display it through related links and shared templates.',
 '先统一宽度、字体和边距，再迭代栏目：把调整集中在内容与阅读路径上。':'Standardize widths, typography and spacing first, then iterate on content and reading paths.',
 '首页设计存档 · 2026.09（栏目调整前，非当前运行截图）':'Homepage design archive · September 2026 (before the column update; not a current screenshot)',
 '手机、平板与深色模式尚未完成全站验收；不能把局部检查等同于完整可用性验证。':'A full review across phones, tablets and dark mode has not been completed. Partial checks do not establish site-wide usability.',
 '首页和知识、思考、资源、关于等栏目已有可浏览页面；当前继续整理项目档案与阶段记录。网站是静态应用，本地收藏、笔记和清单进度保存在当前浏览器，不包含账号与云同步。':'The homepage and the Knowledge, Thinking, Resources and About sections can be browsed. Project records and milestones are still being organized. This is a static application: bookmarks, notes and checklist progress are stored in the current browser, without accounts or cloud synchronization.',
});
Object.assign(translations, awakekeeperEnglish, {
 '只看收藏':'Favorites only','取消收藏':'Remove favorite','已取消收藏':'Removed from favorites',
 '输入内容':'Enter text','确认操作':'Confirm action','确认':'Confirm','保存':'Save','取消':'Cancel',
 '请求':'Request','接口':'API','响应':'Response','问题':'Question','检索':'Retrieve','回答':'Answer',
 '上一篇':'Previous','下一篇':'Next','返回知识目录':'Back to knowledge','相邻知识':'Adjacent concepts',
 '当前分类没有匹配内容，请更换分类、清除搜索或关闭收藏筛选。':'No matches in this category. Change category, clear the search or turn off Favorites only.',

 '二级分类':'Subcategories', '清除搜索':'Clear search',
 '选择左侧分组，或向下浏览当前分类。':'Choose a group on the left, or browse this category below.',
 '没有匹配分组':'No matching groups',
 '没有找到相关术语，请更换分类或清除搜索。':'No matching concepts. Choose another category or clear the search.'
});

export function translate(text, language) {
 if(language!=='en'||!/[\u4e00-\u9fff]/.test(text))return text;
 const trimmed=text.trim();
 if(translations[trimmed])return text.replace(trimmed,translations[trimmed]);
 const parts=text.split(/(\s+[·/|→]\s+|^\/\s*)/);
 if(parts.length>1 && parts.every(p=>!/[\u4e00-\u9fff]/.test(p)||translations[p.trim()]||englishContent[p.trim()]))return parts.map(p=>/[\u4e00-\u9fff]/.test(p)?translate(p,language):p).join('');
 const value=englishContent[trimmed];
 if(value)return text.replace(trimmed,value);
 if(/^\d+ 章 · 持续整理$/.test(trimmed))return trimmed.replace('章 · 持续整理','chapters · In progress');
 if(/^\d+ 条术语$/.test(trimmed))return trimmed.replace('条术语','concepts');
 if(/^\d+ 篇记录$/.test(trimmed))return trimmed.replace('篇记录','records');
 if(/^共 \d+ 个资源$/.test(trimmed))return trimmed.replace('共 ','').replace('个资源','resources');
 return text;
}
export function initLanguage() {
 const button=document.querySelector('#language-toggle');
 if(!button)return;
 let language='zh';try{language=localStorage.getItem('site-language')==='en'?'en':'zh';}catch{}
 const originals=new WeakMap();
 const attributes=new WeakMap();
 let titleRecord;
 const observer=new MutationObserver(apply);
 function apply(){
  observer.disconnect();
  document.documentElement.lang=language==='en'?'en':'zh-CN';
  const originalTitle=titleRecord&&document.title===titleRecord.rendered?titleRecord.original:document.title;
  const renderedTitle=originalTitle.split(' · ').map(part=>translate(part,language)).join(' · ');
  if(document.title!==renderedTitle)document.title=renderedTitle;
  titleRecord={original:originalTitle,rendered:renderedTitle};
  // Option labels may change language; their semantic values must not change.
  document.querySelectorAll('option:not([value])').forEach(option=>option.setAttribute('value',option.textContent));
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
   if(node.parentElement?.closest('script,style,code,pre,textarea,#language-toggle,[contenteditable]'))continue;
   const previous=originals.get(node);
   const original=previous&&node.nodeValue===previous.rendered?previous.original:node.nodeValue;
   const rendered=translate(original,language);
   if(node.nodeValue!==rendered)node.nodeValue=rendered;
   originals.set(node,{original,rendered});
  }
  document.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el=>{
   if(el===button)return;
   const saved=attributes.get(el)||{};
   for(const key of ['aria-label','title','placeholder']){
    if(!el.hasAttribute(key))continue;
    const current=el.getAttribute(key), previous=saved[key];
    const original=previous&&previous.rendered===current?previous.original:current;
    const rendered=translate(original,language);
    if(rendered!==current)el.setAttribute(key,rendered);
    saved[key]={original,rendered};
   }
   attributes.set(el,saved);
  });
  button.querySelector('.language-mark').textContent=language==='en'?'中':'EN';
  button.setAttribute('aria-label',language==='en'?'切换为中文':'Switch to English');
  button.title=language==='en'?'切换为中文':'Switch to English';
  button.setAttribute('aria-pressed',String(language==='en'));
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder']});
 }
 button.addEventListener('click',()=>{language=language==='en'?'zh':'en';try{localStorage.setItem('site-language',language);}catch{}apply();});
 apply();
}

export function bilingualText(value) {
 if(Array.isArray(value))return value.map(bilingualText).join(' ');
 if(value&&typeof value==='object')return Object.values(value).map(bilingualText).join(' ');
 const original=String(value??'');
 return original+' '+translate(original,'en');
}
