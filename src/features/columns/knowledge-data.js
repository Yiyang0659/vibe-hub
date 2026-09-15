import { authoredSeries } from '../topics/course-data.js';
export const seriesDefinitions=[authoredSeries[0],
 {id:'series-agent',title:'从 Prompt 到 Agent Workflow',category:'AI',summary:'从基础概念到连续的工作流程，整理 AI 协作的学习路径。',chapters:[['提示词上下文','把目标和背景说清楚。','prompt-context'],['系统提示词','定义稳定的行为约束。','system-prompt'],['RAG','为回答补充可检索的知识。','rag'],['API','把服务连接起来。','api'],['工具调用','定义模型与工具的边界。','tool-calling'],['工作流','让步骤与输入输出可追踪。','ai-product-workflow'],['验证结果','用明确标准检查输出。','acceptance-criteria'],['持续迭代','记录失败、反馈与下一步。','ai-product-iteration']]},...authoredSeries.slice(1)];

export const categoryFor=t=>{if(t.knowledgeCategory)return t.knowledgeCategory;const text=[t.category,...(t.tags||[])].join(' ');return /Agent|工具调用|MCP/i.test(text)?'Agent':/产品|设计/.test(text)?'产品':/AI|模型|Prompt/i.test(text)?'AI':'开发';};
export const knowledgeTitle=t=>({mvp:'MVP 是什么？',rag:'RAG 是什么？',api:'API 是什么？','user-flow':'User Flow 是什么？'}[t.id]||t.title);
