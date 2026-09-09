import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore, storageKey } from '../../src/shared/store/index.js';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    read(key) { return values.get(key); }
  };
}

test('store keeps the v3 storage key and resilient defaults', () => {
  const storage = memoryStorage({ [storageKey]: '{invalid json' });
  const store = createStore({ storage });

  assert.equal(storageKey, 'pkl-v3-state');
  assert.deepEqual(store.getState().favorites, []);
  assert.equal(store.getState().theme, 'day');
});

test('store merges user-created entities over built-in content', () => {
  const storage = memoryStorage({
    [storageKey]: JSON.stringify({
      userNotes: [
        { id: 'built-in', title: '覆盖后的文章' },
        { id: 'personal', title: '个人文章' }
      ]
    })
  });
  const store = createStore({
    storage,
    notes: [{ id: 'built-in', title: '原文章' }]
  });

  assert.deepEqual(store.getAllNotes().map((item) => item.title), ['个人文章', '覆盖后的文章']);
});

test('store persists state changes through one save entry point', () => {
  const storage = memoryStorage();
  const store = createStore({ storage });

  store.getState().favorites.push('frontend');
  store.save();

  assert.deepEqual(JSON.parse(storage.read(storageKey)).favorites, ['frontend']);
});
