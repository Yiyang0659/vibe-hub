import test from 'node:test';
import assert from 'node:assert/strict';
import {renderKnowledgeBrowser} from '../../src/features/columns/knowledge-browser.js';
import {renderThinkingBrowser} from '../../src/features/columns/thinking-browser.js';
import {renderResourceBrowser} from '../../src/features/toolbox/browser.js';
import {renderAboutPage} from '../../src/features/about/page.js';

test('four landing pages introduce their purpose before the existing content and expose valid scroll targets',()=>{
 for(const html of [renderKnowledgeBrowser([]),renderThinkingBrowser(),renderResourceBrowser(),renderAboutPage()]){
  assert.equal([...html.matchAll(/<h1[ >]/g)].length,1);
  const target=html.match(/data-column-scroll="([^"]+)"/)[1];
  assert.ok(html.includes(`id="${target}"`));
  assert.ok(html.indexOf('class="ci-hero"')<html.indexOf(`id="${target}"`));
  assert.doesNotMatch(html,/person-hero|<img/);
 }
});
test('knowledge keeps terminology and series controls, resources and thinking retain search',()=>{
 const knowledge=renderKnowledgeBrowser([]);
 assert.match(knowledge,/id="kb-search"/);assert.match(knowledge,/#\/topics\?view=series/);
 assert.match(renderResourceBrowser(),/id="rb-search"/);
 assert.match(renderThinkingBrowser(),/id="tb-search"/);
});
