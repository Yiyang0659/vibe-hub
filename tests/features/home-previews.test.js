import test from 'node:test';
import assert from 'node:assert/strict';
import { homeLearningSections, mountHomePreviews } from '../../src/features/learning/home-sections.js';
test('reference previews preserve composition without inventing published content',()=>{
 const html=homeLearningSections({lessons:[{id:'api',title:'API'}],notes:[{id:'draft',title:'不公开',publication:'draft'}]});
 assert.ok(html.indexOf('id="home-knowledge"')<html.indexOf('id="home-thinking"'));
 assert.ok(html.indexOf('id="home-thinking"')<html.indexOf('id="home-resources"'));
 assert.match(html,/#\/topics\/api/);assert.match(html,/系列 · 可阅读/);
 assert.match(html,/href="#\/topics\/series-product"/);
 assert.match(html,/href="#\/topics\/series-agent"/);
 assert.match(html,/thinking-reference.png/);assert.match(html,/Project Retro Template/);
 assert.doesNotMatch(html,/不公开|12 篇|8 分钟阅读|我在用/);
});
test('preview search combines category and text, with empty state and reset',()=>{
 const input=Object.assign(new EventTarget(),{value:''});
 const buttons=['','开发','AI'].map(value=>Object.assign(new EventTarget(),{dataset:{hpFilter:value},setAttribute(k,v){this[k]=v;}}));
 const items=[['开发','api 接口'],['AI','agent'],['开发','前端']].map(([category,search])=>({dataset:{category,search},hidden:false}));
 const empty={hidden:true},count={textContent:''};
 const panel={dataset:{limit:'4'},querySelector(s){return s==='[data-hp-search]'?input:s==='.hp-empty'?empty:count;},querySelectorAll(s){return s==='[data-hp-item]'?items:buttons;}};
 mountHomePreviews({querySelectorAll:()=>[panel]});
 buttons[1].dispatchEvent(new Event('click'));input.value='api';input.dispatchEvent(new Event('input'));
 assert.deepEqual(items.map(x=>x.hidden),[false,true,true]);
 buttons[2].dispatchEvent(new Event('click'));assert.equal(empty.hidden,false);
 input.value='';input.dispatchEvent(new Event('input'));buttons[0].dispatchEvent(new Event('click'));
 assert.deepEqual(items.map(x=>x.hidden),[false,false,false]);assert.equal(empty.hidden,true);
});
