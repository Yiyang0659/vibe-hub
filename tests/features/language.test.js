import test from 'node:test';
import assert from 'node:assert/strict';
import {translate} from '../../src/app/language.js';
test('UI language preserves whitespace, original content and Chinese mode',()=>{
 assert.equal(translate(' 首页 ','en'),' Home ');
 assert.equal(translate('首页','zh'),'首页');
 assert.equal(translate('一篇尚未翻译的正文','en'),'一篇尚未翻译的正文');
 assert.equal(translate('341 条术语','en'),'341 concepts');
});

import {topicsWithDomain} from '../../src/features/topics/index.js';
import {notes,workItems,toolbox} from '../../src/features/index.js';
import {normalizeRouteName} from '../../src/app/router.js';
import {findThinking} from '../../src/features/columns/thinking-browser.js';
import {readFileSync} from 'node:fs';
test('all built-in article, concept, project and tool text has an English translation',()=>{
 const missing=new Set();
 const walk=value=>{
  if(typeof value==='string'&&/[\u4e00-\u9fff]/.test(value)&&translate(value,'en')===value)missing.add(value);
  else if(Array.isArray(value))value.forEach(walk);
  else if(value&&typeof value==='object')Object.values(value).forEach(walk);
 };
 [topicsWithDomain,notes,workItems,toolbox].forEach(walk);
 assert.deepEqual([...missing],[]);
});
test('English phrases find the original articles without changing content IDs',()=>{
 assert.ok(findThinking(notes,'define the format').some(x=>x.id==='content-before-expansion'));
 assert.equal(translate('知识 · 组件化思维','en'),'Knowledge · Component thinking');
});
test('workspace route and header entry are removed; avatar overrides are absent',()=>{
 assert.equal(normalizeRouteName('workspace'),'not-found');
 const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
 assert.ok(html.includes('id="language-toggle"'));
 assert.ok(!html.includes('workspace-launcher'));
 for(const path of ['columns/knowledge-browser.css','columns/thinking-browser.css','toolbox/browser.css','about/about.css']){
  assert.doesNotMatch(readFileSync(new URL('../../src/features/'+path,import.meta.url),'utf8'),/zh-brand-avatar/);
 }
});
