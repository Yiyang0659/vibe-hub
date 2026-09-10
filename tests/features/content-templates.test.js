import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent } from '../../src/shared/content/validation.js';
import { renderNote } from '../../src/features/notes/detail.js';
import { renderTool } from '../../src/features/toolbox/detail.js';
import { renderWorkDetailPage } from '../../src/features/work/detail.js';
test('a short note requires no unresolved question and hides absent sections',()=>{
 const n={id:'short',title:'短记录',question:'遇到的问题',myUnderstanding:'尝试的过程',myTake:'当前结论'};
 assert.deepEqual(validateContent('note',n),[]);
 const html=renderNote(n);
 assert.match(html,/当前结论/); assert.doesNotMatch(html,/还没想清楚|undefined|真实例子/);
});
test('plugins work without prompts; unsafe launch links are not rendered',()=>{
 const tool={id:'plugin',type:'PLUGIN',title:'插件',problemSolved:'整理书签',usage:'安装后打开侧栏',url:'https://example.com/plugin'};
 assert.deepEqual(validateContent('tool',tool),[]);
 assert.match(renderTool(tool),/https:\/\/example.com\/plugin/);
 assert.doesNotMatch(renderTool({...tool,url:'javascript:alert(1)'}),/href="javascript:/);
 assert.doesNotMatch(renderTool(tool),/PROMPT|undefined/);
});
test('experiments allow observations without numeric claims',()=>{
 const work={id:'trial',title:'小实验',kind:'EXPERIMENT',statusLabel:'进行中',problem:'验证布局',solution:'缩小浏览器',result:'导航可以展开'};
 assert.deepEqual(validateContent('work',work),[]);
 assert.match(renderWorkDetailPage(work),/导航可以展开/);
 assert.doesNotMatch(renderWorkDetailPage(work),/undefined|独立完成/);
});
test('validation rejects missing purpose and unavailable published plugins',()=>{
 assert.ok(validateContent('tool',{id:'x',title:'x',type:'PLUGIN'}).length);
 assert.ok(validateContent('note',{id:'x',title:'x'}).length);
});
