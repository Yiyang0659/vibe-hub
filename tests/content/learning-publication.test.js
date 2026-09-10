import test from 'node:test';
import assert from 'node:assert/strict';
import {learningItems, filterLearning} from '../../src/features/learning/model.js';
import {collections} from '../../src/features/learning/data.js';
import {notes,workItems,toolbox} from '../../src/features/index.js';
import {lessons} from '../../src/features/topics/index.js';
import {searchAllEntities} from '../../src/shared/lib/search.js';

test('every collection reference resolves to a published learning record',()=>{
 const items=learningItems({notes,topics:lessons});
 for(const c of collections) assert.equal(filterLearning(items,{collection:c}).length,c.items.length,c.id);
});
test('content IDs stay unique within each collection',()=>{
 for(const list of [notes,workItems,toolbox,lessons]) assert.equal(new Set(list.map(x=>x.id)).size,list.length);
});
test('global search excludes drafts and labels reviewed history',()=>{
 const result=searchAllEntities({notes:[{id:'draft',title:'secret',publication:'draft'},{id:'review',title:'secret',publication:'review'}]},'secret');
 assert.equal(result.length,1);assert.equal(result[0].id,'review');assert.match(result[0].typeLabel,/待核实/);
});
