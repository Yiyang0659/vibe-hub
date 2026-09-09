import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const notoSansStack = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif';

function cssFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.isFile() && entry.name.endsWith('.css') ? [path] : [];
  });
}

function normalized(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function hasTopLevelComma(value) {
  let depth = 0;
  for (const character of value) {
    if (character === '(') depth += 1;
    else if (character === ')') depth = Math.max(0, depth - 1);
    else if (character === ',' && depth === 0) return true;
  }
  return false;
}

function typographyTokenDeclarations(css, path) {
  return Array.from(css.matchAll(/--(serif|sans|mono)\s*:\s*([^;{}]+)(?=;|})/g), (match) => ({
    path,
    token: match[1],
    value: normalized(match[2])
  }));
}

function fontDeclarations(css, path) {
  const uncommented = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return Array.from(uncommented.matchAll(/(font-family|font)\s*:\s*([^;{}]+)(?=;|})/g))
    .filter((match) => match.index === 0 || /[\s;{}]/.test(uncommented[match.index - 1]))
    .map((match) => ({
      path,
      property: match[1],
      value: normalized(match[2])
    }));
}

function usesSharedTypographyToken(declaration) {
  const value = declaration.value.replace(/\s*!important$/, '');
  if (declaration.property === 'font-family') return /^var\(--(?:serif|sans|mono)\)$/.test(value);
  if (value === 'inherit' || hasTopLevelComma(value)) return value === 'inherit';
  const tokenMatches = value.match(/var\(--(?:serif|sans|mono)\)/g) || [];
  return tokenMatches.length === 1 && value.endsWith(tokenMatches[0]);
}

test('global typography tokens are each declared once with the Noto Sans SC stack', () => {
  const files = cssFiles(resolve(root, 'src'));
  const declarations = files.flatMap((path) => {
    return typographyTokenDeclarations(readFileSync(path, 'utf8'), path);
  });

  for (const token of ['serif', 'sans', 'mono']) {
    const matches = declarations.filter((declaration) => declaration.token === token);
    assert.equal(matches.length, 1, `--${token} declarations: ${JSON.stringify(matches)}`);
    assert.equal(matches[0].value, normalized(notoSansStack));
  }
});

test('production styles only select fonts through the shared typography tokens', () => {
  const declarations = cssFiles(resolve(root, 'src')).flatMap((path) => {
    return fontDeclarations(readFileSync(path, 'utf8'), path);
  });

  for (const declaration of declarations) {
    assert.equal(usesSharedTypographyToken(declaration), true, `direct font declaration: ${JSON.stringify(declaration)}`);
  }
});

test('font policy detects declarations that bypass the shared tokens', () => {
  const declarations = fontDeclarations(`
    .rogue { font-family: Arial, sans-serif; font: 12px serif; }
    .fallback { font: 12px Arial, var(--sans); }
    .last { font-family: Arial, sans-serif }
  `, 'fixture.css');

  assert.equal(declarations.length, 4);
  assert.deepEqual(declarations.map(usesSharedTypographyToken), [false, false, false, false]);

  const tokenOverride = typographyTokenDeclarations(':root[data-theme="night"] { --sans: serif }', 'fixture.css');
  assert.deepEqual(tokenOverride.map(({ token, value }) => ({ token, value })), [{ token: 'sans', value: 'serif' }]);
});
