import test from 'node:test';
import assert from 'node:assert/strict';
import {noteEntries} from '../../src/features/notes/entries.js';
import {findThinking,thinkingType,renderThinkingReading,thinkingSections} from '../../src/features/columns/thinking-browser.js';
test('thinking directory only shows published records and separates reviews',()=>{
 assert.equal(findThinking([...noteEntries,{title:'draft',publication:'draft'}]).length,3);
 assert.equal(findThinking(noteEntries,'','实践复盘').length,1);
 assert.equal(thinkingType({category:'竞品分析'}),'产品分析');
 assert.equal(findThinking(noteEntries,'不存在的关键词').length,0);
});
test('reading keeps actual text and renders only populated sections with matching anchors',()=>{
 const n=noteEntries[0],html=renderThinkingReading(n,[{title:'unsafe',href:'javascript:alert(1)'}]);
 assert.ok(html.includes(n.myUnderstanding));assert.ok(!html.includes('javascript:'));
 assert.ok(!html.includes('仍待验证'));
 for(const [id] of thinkingSections(n)){assert.ok(html.includes('id="tb-'+id+'"'));assert.ok(html.includes('data-tb-scroll="tb-'+id+'"'));}
});

test('thinking search includes questions, examples and follow-up content',()=>{
 const records=[{id:'full-body',publication:'published',title:'记录',question:'边界检查',example:'一个具体例子',nextSteps:['尝试新的流程']}];
 assert.equal(findThinking(records,'边界检查').length,1);
 assert.equal(findThinking(records,'具体例子').length,1);
 assert.equal(findThinking(records,'新的流程').length,1);
 assert.equal(findThinking(records,'边界检查 不存在').length,0);
});
