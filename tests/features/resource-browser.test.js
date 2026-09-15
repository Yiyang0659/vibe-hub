import test from 'node:test';
import assert from 'node:assert/strict';
import { resourcesForBrowser, resourceCard } from '../../src/features/toolbox/browser.js';
import { toolbox } from '../../src/features/toolbox/data.js';
import { library } from '../../src/features/library/data.js';
import { filterCatalog } from '../../src/features/columns/explore.js';
test('resource directory shows published content once with appropriate actions',()=>{
 const items=resourcesForBrowser(toolbox,library);
 assert.equal(items.length,7);
 assert.equal(new Set(items.map(x=>x.href)).size,7);
 assert.equal(filterCatalog(items,'','清单与模板').length,1);
 assert.equal(filterCatalog(items,'','外部资料').length,5);
 assert.equal(filterCatalog(items,'','提示词').length,0);
 assert.equal(items.find(x=>x.id==='content-publish-checklist').action,'打开清单 →');
 assert.equal(items.find(x=>x.id==='deepseek-harness-sync').action,'查看使用说明 →');
 assert.match(resourceCard(items.find(x=>x.external)),/noopener noreferrer/);
 assert.equal(resourcesForBrowser([], [{id:'unsafe',url:'javascript:alert(1)'}]).length,0);
});
