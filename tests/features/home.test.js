import test from 'node:test';
import assert from 'node:assert/strict';
import { renderHomeView, mountHomeView, unmountHomeView } from '../../src/features/home/page.js';

test('home hero pill uses the requested positioning statement', () => {
  const html = renderHomeView({ work: [], notes: [], toolbox: [] });

  assert.ok(html.includes('AI PRODUCT / AGENT / BUILDING'));
});

test('pet repeats the click effect every five seconds and cleans up on remount/unmount', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const classList = { add() {}, remove() {} };
  const symbol = { textContent: '✦' };
  const message = { textContent: '移动鼠标，它会注意到你。' };
  const face = { dataset: { expression: 'neutral' } };
  const orb = Object.assign(new EventTarget(), { querySelector: () => symbol });
  const elements = {
    '.h-orb': orb,
    '.h-character-companion': { classList },
    '.h-pet-face': face,
    '.h-character-art': {},
    '.h-companion-message': message
  };
  const stage = { classList, isConnected: true, querySelector: (selector) => elements[selector] };
  const replacements = {
    window: Object.assign(new EventTarget(), {
      matchMedia: () => ({ matches: false }),
      setTimeout: globalThis.setTimeout
    }),
    document: { querySelectorAll: () => [], querySelector: () => stage, documentElement: new EventTarget() },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {}
  };
  const originals = new Map(Object.keys(replacements).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(replacements)) {
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  try {
    mountHomeView();
    t.mock.timers.tick(4999);
    assert.equal(message.textContent, '移动鼠标，它会注意到你。');
    t.mock.timers.tick(1);
    assert.equal(message.textContent, '它把一个想法捡了回来。');
    assert.equal(face.dataset.expression, 'happy');
    t.mock.timers.tick(5000);
    assert.equal(symbol.textContent, '{ }');
    assert.equal(face.dataset.expression, 'surprised');
    orb.dispatchEvent(new Event('click'));
    assert.equal(symbol.textContent, '✓');
    assert.equal(face.dataset.expression, 'wink');
    mountHomeView();
    t.mock.timers.tick(5000);
    assert.equal(message.textContent, '它把一个想法捡了回来。');
    assert.equal(face.dataset.expression, 'happy');
    unmountHomeView();
    t.mock.timers.tick(15000);
    assert.equal(message.textContent, '它把一个想法捡了回来。');
  } finally {
    unmountHomeView();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
