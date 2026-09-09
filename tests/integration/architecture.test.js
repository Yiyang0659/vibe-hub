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
