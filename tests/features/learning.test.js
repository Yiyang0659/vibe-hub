import test from 'node:test';
import assert from 'node:assert/strict';
import * as learning from '../../src/features/learning/model.js';
import { renderLearningPage } from '../../src/features/learning/page.js';
import { renderHomeView } from '../../src/features/home/page.js';
import { normalizeRouteName } from '../../src/app/router.js';
const notes = [{ id:'n', title:'保存失败的复盘', category:'工程', oneLiner:'本地存储', date:'2026-09-10' }, { id:'l', title:'理解的变化', kind:'LOG', date:'2026-09-09' }, {id:'x', title:'未核实', publication:'review'}, {id:'d', title:'草稿', publication:'draft'}];
const topics = [{id:'t', title:'LocalStorage', english:'Browser storage', category:'工程', excerpt:'保存数据'}];
test('learning combines topic and note filters without losing the newest note', () => {
 const items = learning.learningItems({notes,topics});
 assert.equal(items.length,3);
 assert.deepEqual(learning.filterLearning(items,{q:'storage',category:'工程',kind:'CONCEPT'}).map(x=>x.id),['t']);
 assert.deepEqual(learning.filterLearning(items,{kind:'NOTE'}).map(x=>x.id),['n']);
 assert.deepEqual(learning.filterLearning(items,{kind:'LOG'}).map(x=>x.id),['l']);
 assert.equal(learning.filterLearning(items,{q:'不存在'}).length,0);
});
test('review opt-in never publishes a draft',()=>{
 assert.deepEqual(learning.learningItems({notes,includeReview:true}).map(x=>x.id),['n','l','x']);
});
test('learning route is compatible with existing note details',()=>assert.equal(normalizeRouteName('learning'),'notes'));
test('learning renders functional empty reset link and escapes search text',()=>{
 const html = renderLearningPage({notes,topics,params:new URLSearchParams('q=%3Cscript%3E')});
 assert.match(html,/没有找到/); assert.match(html,/清除筛选/); assert.doesNotMatch(html,/<script>/);
});
test('empty homepage shows no invented project counts or unreviewed records',()=>{
 const html = renderHomeView({notes:[notes[2]],work:[],toolbox:[],lessons:[]});
 assert.doesNotMatch(html,/未核实|持续迭代的完整项目|<strong>03<\/strong>/);
 assert.match(html,/#\/learning/);
});
