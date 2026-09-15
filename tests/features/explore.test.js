import test from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeCatalog, filterCatalog } from '../../src/features/columns/explore.js';
import { categoryFor } from '../../src/features/columns/knowledge-data.js';
import { resourceCatalog, thinkingCatalog, projectDepth } from '../../src/features/columns/depth.js';
import { designProjects } from '../../src/features/work/design-projects.js';
test('column search includes deep knowledge and series, excludes unpublished items',()=>{
 const catalog=knowledgeCatalog([{id:'deep-topic',title:'测试与状态',category:'工程实践',english:'State Test',excerpt:'处理边界',publication:'published'},{id:'secret',title:'草稿',publication:'draft'},{id:'review',title:'待审核',publication:'review'}]);
 assert.equal(filterCatalog(catalog,'state 边界','开发').length,1);
 assert.equal(filterCatalog(catalog,'草稿').length,0);
 assert.equal(filterCatalog(catalog,'','系列').length,4);
 assert.equal(filterCatalog(catalog,'不存在').length,0);
});
test('topic category links and column catalog use the same taxonomy',()=>{
 const topic={id:'tools',title:'工具调用',category:'AI 协作',tags:['Agent']};
 assert.equal(knowledgeCatalog([topic])[0].category,categoryFor(topic));
 assert.equal(categoryFor(topic),'Agent');
});
test('resources preserve internal tool actions and safe external destinations',()=>{
 const items=resourceCatalog([{id:'check',title:'清单',type:'CHECKLIST',publication:'published'},{id:'draft',publication:'draft'}],[{id:'ref',title:'参考',url:'https://example.com'},{id:'unsafe',url:'javascript:alert(1)'}]);
 assert.equal(items.length,2);assert.equal(items[0].href,'#/toolbox/check');assert.equal(items[1].external,true);
});
test('thinking catalog labels editorial drafts separately from published notes',()=>{
 const items=thinkingCatalog([{id:'note',title:'记录',publication:'published'},{id:'draft',publication:'draft'}]);
 assert.equal(items.find(x=>x.id==='note').status,'已发布');assert.equal(items.find(x=>x.id==='ai-collaboration').status,'内容草稿');assert.ok(!items.find(x=>x.id==='draft'));
});
test('project unfolding keeps development status and uses existing detail routes',()=>{
 const html=projectDepth(designProjects);assert.match(html,/方案探索/);assert.match(html,/#\/projects\/content-agent/);assert.match(html,/下一步/);assert.doesNotMatch(html,/已上线|用户验证通过/);
});
