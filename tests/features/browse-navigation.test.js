import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalBrowseHash,validBrowseReturn} from '../../src/app/browse-navigation.js';
test('old catalogs converge while details and editorial review stay available',()=>{
 assert.equal(canonicalBrowseHash('#/learning?kind=CONCEPT&q=MCP'),'#/topics?q=MCP');
 assert.equal(canonicalBrowseHash('#/learning'),'#/topics');
 assert.equal(canonicalBrowseHash('#/learning?kind=NOTE'),'#/learning?kind=NOTE');
 assert.equal(canonicalBrowseHash('#/learning?review=1'),'#/learning?review=1');
 assert.equal(canonicalBrowseHash('#/notes/a'),'#/notes/a');
 const target=canonicalBrowseHash('#/library?type=GITHUB&q=evals');
 assert.ok(target.startsWith('#/toolbox?'));
 assert.equal(new URLSearchParams(target.split('?')[1]).get('q'),'evals');
 assert.equal(new URLSearchParams(target.split('?')[1]).get('category'),'外部资料');
});
test('return destinations are limited to the matching public catalog',()=>{
 assert.equal(validBrowseReturn('#/toolbox?q=MCP','resource'),true);
 assert.equal(validBrowseReturn('#/topics?view=series','knowledge'),true);
 for(const bad of ['javascript:alert(1)','#/toolbox/a','#/topics/a','https://example.com'])assert.equal(validBrowseReturn(bad,'resource'),false);
 assert.equal(validBrowseReturn('#/toolbox','knowledge'),false);
});
