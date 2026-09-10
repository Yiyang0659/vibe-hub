import test from 'node:test';
import assert from 'node:assert/strict';
import {createTopicsRuntime} from '../../src/features/topics/runtime.js';
for (const scenario of [undefined, {title:'例子',description:'过程说明',steps:[{owner:'界面',title:'输入',description:'填写内容'}]}]) test('knowledge detail accepts optional fields with scenario=' + Boolean(scenario),()=>{
 const main={innerHTML:''};const previous=globalThis.document;
 globalThis.document={querySelectorAll:()=>[],querySelector:()=>null};
 const item={id:'small',title:'小概念',definition:'一句话理解',example:'一个例子',category:'工程实践',scenario};
 const context={main,state:{notes:{},favorites:[]},lessons:[item],topicById:()=>item,categoryOf:()=>({accent:'#000'}),saveState(){},getAllNotes:()=>[],getAllWork:()=>[],getAllToolbox:()=>[],isFavorite:()=>false,isCompleted:()=>false,WHY_LOOKUP:{},escapeHTML:x=>String(x||''),renderRelatedTrail:()=>'',renderNotFound(){throw Error('unexpected 404');}};
 try{createTopicsRuntime(context).renderTopicDetail('small');assert.match(main.innerHTML,/一句话理解/);assert.doesNotMatch(main.innerHTML,/undefined|最容易误解|QUICK CHECK/);}finally{globalThis.document=previous;}
});
