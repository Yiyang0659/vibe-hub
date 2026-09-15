import test from 'node:test';
import assert from 'node:assert/strict';
import { topics } from '../../src/features/topics/data.js';
import { referenceTerms, terminologyCategories } from '../../src/features/topics/glossary.js';
import { seriesDefinitions, renderKnowledgeDetail } from '../../src/features/columns/knowledge.js';
import { categoryFor } from '../../src/features/columns/knowledge-data.js';
const byId=new Map(topics.map(t=>[t.id,t]));
test('all 322 reference terms resolve to unique local entries with original explanations',()=>{
 assert.equal(referenceTerms.length,322);assert.equal(new Set(referenceTerms.map(t=>t.localId)).size,322);
 assert.equal(byId.size,topics.length);
 for(const term of referenceTerms){const local=byId.get(term.localId);assert.ok(local,term.id);assert.ok(local.definition?.length>10,term.id);assert.ok(local.example?.length>10,term.id);assert.equal(categoryFor(local),term.knowledgeCategory);assert.equal(local.subcategory,term.subcategory);assert.equal(local.catalogSource,term.url);}
 assert.deepEqual(terminologyCategories,['前端','后端','产品','测试','技术栈','AI','Git','设计风格']);
});
test('all course chapters resolve to readable content and valid related terms',()=>{
 assert.deepEqual(seriesDefinitions.map(s=>s.chapters.length),[15,8,8,6]);
 for(const s of seriesDefinitions)for(const [,,id] of s.chapters)assert.ok(byId.get(id)?.definition,id);
 for(const t of topics.filter(t=>t.course)){assert.ok(t.course.exercise);assert.ok(t.course.deliverable);assert.ok(t.course.check.length);for(const id of t.related)assert.ok(byId.has(id),id);}
});
test('course detail exposes practice, deliverable and next chapter navigation',()=>{
 const html=renderKnowledgeDetail(byId.get('ai-product-poc'));for(const text of ['本章目标','动手练习','本章交付物','完成检查','ai-product-mvp','系列目录'])assert.ok(html.includes(text),text);
});
test('legacy interactive lessons and stable IDs remain available',()=>{
 assert.ok(byId.get('frontend').scenario);assert.ok(byId.get('component-thinking'));assert.ok(byId.get('state-management'));assert.ok(byId.get('rag').question);
});
