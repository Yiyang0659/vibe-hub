import test from 'node:test';
import assert from 'node:assert/strict';
import {renderKnowledgeColumn,renderThinkingColumn,renderAboutColumn} from '../../src/features/columns/pages.js';
test('knowledge only links a reference to an available published lesson',()=>{
 const html=renderKnowledgeColumn([{id:'rag',publication:'published'},{id:'mvp',publication:'draft'}]);
 assert.match(html,/href="#\/topics\/rag"/);
 assert.doesNotMatch(html,/href="#\/topics\/mvp"/);
 assert.match(html,/data-hp-preview/);
 assert.doesNotMatch(html,/3 \/ 12|2 \/ 8/);
});
test('thinking reference previews do not invent published engagement',()=>{
 const html=renderThinkingColumn();
 assert.match(html,/cl-feature/);assert.match(html,/cl-thinking-grid/);
 assert.match(html,/正文整理中/);assert.doesNotMatch(html,/1\.2k|856|2025\.09/);
});
test('about uses actual contact details and honest project stage',()=>{
 const html=renderAboutColumn();assert.match(html,/github.com\/Yiyang0659/);
 assert.match(html,/设计与开发/);assert.doesNotMatch(html,/hi@|xiangyuzuo.com|已上线/);
});
