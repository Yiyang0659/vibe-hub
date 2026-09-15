import test from 'node:test';
import assert from 'node:assert/strict';
import {renderAllKnowledge, renderKnowledgeDetail,renderSeries} from '../../src/features/columns/knowledge.js';
import {renderThinkingDetail} from '../../src/features/columns/thinking-details.js';
import {renderAboutStory,renderAboutNow} from '../../src/features/columns/about-details.js';
test('full knowledge index excludes drafts and preserves safe searchable text',()=>{
 const html=renderAllKnowledge([{id:'public',title:'<script>x</script>',publication:'published',excerpt:'a"b',category:'AI'},{id:'secret',title:'secret',publication:'draft'}]);
 assert.doesNotMatch(html,/<script>|topics\/secret/);assert.match(html,/&lt;script&gt;/);assert.match(html,/ds-pagination/);
});
test('knowledge detail keeps local learning controls and escapes notes',()=>{
 const html=renderKnowledgeDetail({id:'mvp',title:'MVP',category:'产品',definition:'概念'}, {note:'</textarea><script>alert(1)</script>',favorite:true,completed:true});
 assert.match(html,/data-favorite="mvp"/);assert.match(html,/id="save-note"/);assert.match(html,/id="complete-topic"/);assert.doesNotMatch(html,/<script>/);
});
test('series only links chapters with published content',()=>{
 const html=renderSeries('series-product',[{id:'ai-product-mvp',publication:'published'},{id:'ai-product-problem',publication:'draft'}]);
 assert.match(html,/topics\/ai-product-mvp/);assert.doesNotMatch(html,/topics\/ai-product-problem/);assert.match(html,/待整理/);
});
test('thinking layouts and about subpages provide separate navigable templates',()=>{
 assert.match(renderThinkingDetail('ai-collaboration'),/data-ds-scroll/);
 assert.match(renderThinkingDetail('vibehub-structure'),/ds-mini-sites/);
 assert.match(renderThinkingDetail('website-comparison'),/<table>/);
 assert.equal(renderThinkingDetail('missing'),'');
 assert.match(renderAboutStory(),/about\/now/);assert.match(renderAboutNow(),/about\/me/);
 assert.doesNotMatch(renderAboutNow(),/hi@|xiangyuzuo.com/);
});
