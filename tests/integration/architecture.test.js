import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');

const expectedFeatureEntries = [
  'home',
  'topics',
  'notes',
  'reading',
  'work',
  'toolbox',
  'library',
  'practice',
  'saved',
  'workspace',
  'about'
].map((name) => `src/features/${name}/index.js`);

test('feature-first source entry points exist', () => {
  const expectedPaths = [
    'src/main.js',
    'src/app/router.js',
    'src/app/routes.js',
    'src/app/shell.js',
    'src/styles/index.css',
    ...expectedFeatureEntries
  ];

  const missing = expectedPaths.filter((path) => !existsSync(resolve(root, path)));
  assert.deepEqual(missing, []);
});

test('browser entry uses the feature-first source tree', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');

  assert.match(html, /\.\/src\/styles\/index\.css/);
  assert.match(html, /\.\/src\/main\.js/);
  assert.doesNotMatch(html, /\.\/js\/app\.js/);
  assert.doesNotMatch(html, /\.\/styles(?:\.css|\/)/);
});

test('stable project documentation entry points exist', () => {
  const expectedPaths = [
    'docs/README.md',
    'docs/engineering/architecture.md',
    'docs/engineering/test-plan.md',
    'docs/engineering/deployment.md',
    'docs/guides/add-content.md'
  ];

  const missing = expectedPaths.filter((path) => !existsSync(resolve(root, path)));
  assert.deepEqual(missing, []);
});

test('feature page renderers do not live in the application entry', () => {
  const mainSource = readFileSync(resolve(root, 'src/main.js'), 'utf8');
  const featureRenderers = [
    'src/features/topics/runtime.js',
    'src/features/notes/runtime.js',
    'src/features/reading/runtime.js',
    'src/features/work/runtime.js',
    'src/features/toolbox/runtime.js',
    'src/features/library/runtime.js',
    'src/features/about/runtime.js',
    'src/features/workspace/runtime.js',
    'src/features/practice/runtime.js',
    'src/features/saved/runtime.js'
  ];

  assert.deepEqual(featureRenderers.filter((path) => !existsSync(resolve(root, path))), []);
  assert.doesNotMatch(mainSource, /function renderTopicDetail/);
  assert.doesNotMatch(mainSource, /function renderWorkDetail/);
  assert.doesNotMatch(mainSource, /function renderToolboxDetail/);
});

test('feature-specific styles are colocated with their owners', () => {
  const expectedPaths = [
    'src/features/home/home.css',
    'src/features/notes/notes.css',
    'src/features/topics/topics.css',
    'src/features/workspace/workspace.css'
  ];

  assert.deepEqual(expectedPaths.filter((path) => !existsSync(resolve(root, path))), []);
  assert.equal(existsSync(resolve(root, 'src/styles/feature-pages.css')), false);
});

test('main is a small entry and orchestration lives in app', () => {
  const mainSource = readFileSync(resolve(root, 'src/main.js'), 'utf8');

  assert.equal(existsSync(resolve(root, 'src/app/runtime.js')), true);
  assert.match(mainSource, /\.\/app\/runtime\.js/);
  assert.ok(mainSource.split(/\r?\n/).length <= 20);
});
