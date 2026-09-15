import { vibeCatalog } from './vibehub-catalog.js';
import { glossaryNotes } from './glossary-notes.js';
export const terminologyCategories=vibeCatalog.catalog.map(c=>c.category);
export const terminologyGroups=Object.fromEntries(vibeCatalog.catalog.map(c=>[c.category,c.groups.map(g=>g.subcategory)]));
export const terminologyAliases={component:'component-thinking',state:'state-management','responsive-design':'responsive-layout',flex:'css-flexbox',grid:'css-grid',route:'route-endpoint','env-var':'environment-variable','ai-hallucination':'hallucination'};
export const referenceTerms=vibeCatalog.catalog.flatMap(c=>c.groups.flatMap(g=>g.terms.map(t=>({...t,knowledgeCategory:c.category,subcategory:g.subcategory,localId:terminologyAliases[t.id]||t.id}))));
export function enrichGlossary(existing){
 const known=new Map(existing.map(t=>[t.id,t]));
 const metadata=new Map(referenceTerms.map(t=>[t.localId,t]));
 const enriched=existing.map(t=>{const ref=metadata.get(t.id);return ref?{...t,knowledgeCategory:ref.knowledgeCategory,subcategory:ref.subcategory,catalogSource:ref.url,aliases:[...new Set([...(t.aliases||[]),ref.title,ref.english])]}:{...t,knowledgeCategory:/产品/.test(t.category)?'产品':/AI/.test(t.category)?'AI':/前端/.test(t.category)?'前端':/后端/.test(t.category)?'后端':/git/.test(t.id)?'Git':/test|acceptance/.test(t.id)?'测试':'技术栈',subcategory:'站内补充'}});
 const additions=referenceTerms.filter(t=>!known.has(t.localId)).map(t=>{const content=glossaryNotes[t.id];if(!content)throw new Error('Missing original glossary explanation: '+t.id);return {id:t.localId,title:t.title,english:t.english,category:t.knowledgeCategory,knowledgeCategory:t.knowledgeCategory,subcategory:t.subcategory,tags:[t.subcategory,t.english],level:'入门',publication:'published',excerpt:content[0],definition:content[0],example:content[1],source:'站内编写 · 术语目录参考 VibeHub',catalogSource:t.url,updated:'2026-09-11',related:referenceTerms.filter(x=>x.subcategory===t.subcategory&&x.localId!==t.localId).slice(0,3).map(x=>x.localId)};});
 return [...enriched,...additions];
}
