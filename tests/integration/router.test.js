import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRouteName, parseHash } from '../../src/app/router.js';

test('parseHash separates route, id and query', () => {
  assert.deepEqual(parseHash('#/topics/frontend?from=home'), {
    routeName: 'topics',
    id: 'frontend',
    query: 'from=home'
  });
});

test('parseHash defaults to home', () => {
  assert.deepEqual(parseHash(''), { routeName: 'home', id: undefined, query: '' });
});

test('normalizeRouteName keeps aliases compatible', () => {
  assert.equal(normalizeRouteName('topic'), 'topics');
  assert.equal(normalizeRouteName('lesson'), 'topics');
  assert.equal(normalizeRouteName('papers'), 'reading');
  assert.equal(normalizeRouteName('projects'), 'work');
  assert.equal(normalizeRouteName('playbooks'), 'toolbox');
  assert.equal(normalizeRouteName('favorites'), 'saved');
  assert.equal(normalizeRouteName('library-resources'), 'library');
  assert.equal(normalizeRouteName('missing'), 'not-found');
});
