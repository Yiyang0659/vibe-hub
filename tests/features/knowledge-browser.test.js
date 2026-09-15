import test from 'node:test';
import assert from 'node:assert/strict';
import {topics} from '../../src/features/topics/data.js';
import {termGroups,renderKnowledgeBrowser,seriesSidebar} from '../../src/features/columns/knowledge-browser.js';
test('term directory contains every term exactly once and excludes course chapters',()=>{
 const all=termGroups(topics).flatMap(g=>g.items);
 assert.equal(all.length,341);assert.equal(new Set(all.map(t=>t.id)).size,341);
 assert.ok(all.every(t=>!t.course));
});
test('term search combines English keywords with category and excludes drafts',()=>{
 assert.ok(termGroups(topics,'MCP','AI').flatMap(g=>g.items).some(t=>t.id==='mcp'));
 assert.equal(termGroups(topics,'MCP','Git').length,0);
 assert.equal(termGroups([{id:'draft',title:'unique',publication:'draft',knowledgeCategory:'AI'}],'unique').length,0);
});
test('series directory separates courses from terminology navigation',()=>{
 const html=renderKnowledgeBrowser(topics,new URLSearchParams('view=series'));
 assert.ok(html.includes('搜索系列'));assert.ok(!html.includes('data-kb-category'));
 const sidebar=seriesSidebar(topics.find(t=>t.id==='ai-product-poc'));
 assert.ok(sidebar.includes('aria-current="page"'));assert.ok(sidebar.includes('系列章节'));
});

import {activeKnowledgeGroup} from '../../src/features/columns/knowledge-browser.js';
test('reading location tracks section boundaries in either scroll direction',()=>{
 assert.equal(activeKnowledgeGroup([],130),-1);
 assert.equal(activeKnowledgeGroup([400,800],130),0);
 assert.equal(activeKnowledgeGroup([-500,129,700],130),1);
 assert.equal(activeKnowledgeGroup([-500,131,700],130),0);
 assert.equal(activeKnowledgeGroup([-900,-400,100],130),2);
});
test('secondary navigation retains its accessible name without a visible heading',()=>{
 const html=renderKnowledgeBrowser(topics);
 assert.match(html,/id="kb-subcategories" aria-label="二级分类"/);
 assert.doesNotMatch(html,/<summary>二级分类/);
});
