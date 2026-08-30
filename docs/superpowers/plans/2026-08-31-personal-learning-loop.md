# Personal Learning Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing local terminology site into a personal learning loop with real visit history, unified search, project issue capture, structured learning status, portable backups, and a persistent dark/white theme switch.

**Architecture:** Keep static terminology in the existing data modules. Move user-data migration and persistence into `js/state.js`, place derived learning/search/project operations in the pure `js/knowledge.js` module, and leave DOM rendering and events in `js/app.js`. Continue using Hash routing and `localStorage`; export/import provides portability without adding a backend.

**Tech Stack:** HTML5, CSS3, native JavaScript ES modules, `localStorage`, Node.js `node:test`, Node built-in HTTP server.

**Spec:** `docs/superpowers/specs/2026-08-31-personal-learning-loop-design.md`

## Global Constraints

- The current dark developer-lab visual remains the default; the added light mode must be white and controlled from the top-right toolbar.
- Do not add a framework, package dependency, backend, account system, cloud sync, AI calls, uploads, or graph visualization.
- Preserve the existing `learning-voyage-state-v1` key for rollback; write active user data to `learning-workspace-state-v2`.
- All user-authored content stays in the current browser unless the user explicitly exports it.
- Existing favorites, notes, completion data, practice totals, theme intent, and motion mode must migrate without data loss.

---

### Task 1: Versioned State Store and Migration

**Files:**
- Create: `js/state.js`
- Create: `tests/state.test.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `STATE_KEY`, `LEGACY_STATE_KEY`, `createDefaultState()`, `migrateLegacyState(value, now)`, `normalizeV2State(value)`, `parseImportedState(jsonText)`, `serializeState(state)`, `createStateStore(storage, now)`.
- Consumes: a Web Storage-compatible object with `getItem(key)` and `setItem(key, value)`.

- [ ] **Step 1: Write failing migration and import tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDefaultState,
  createStateStore,
  migrateLegacyState,
  parseImportedState
} from '../js/state.js';

test('migrateLegacyState preserves v1 learning data', () => {
  const migrated = migrateLegacyState({
    completed: ['frontend'],
    favorites: ['state'],
    notes: { frontend: '浏览器里的界面层' },
    practiceAnswered: 3,
    practiceCorrect: 2,
    motionMode: 'scan',
    theme: 'night'
  }, '2026-08-31T00:00:00.000Z');

  assert.equal(migrated.version, 2);
  assert.equal(migrated.learningRecords.frontend.status, 'articulated');
  assert.deepEqual(migrated.notes.frontend, {
    content: '浏览器里的界面层',
    updatedAt: '2026-08-31T00:00:00.000Z'
  });
  assert.deepEqual(migrated.practice, { answered: 3, correct: 2 });
  assert.equal(migrated.theme, 'dark');
  assert.equal(migrated.motionMode, 'scan');
});

test('parseImportedState rejects an incompatible backup', () => {
  assert.throws(() => parseImportedState('{"version":1}'), /版本/);
  assert.throws(() => parseImportedState('{"version":2}'), /项目记录/);
});

test('createStateStore migrates once without deleting the legacy key', () => {
  const values = new Map([['learning-voyage-state-v1', JSON.stringify({ completed: ['frontend'] })]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
  const store = createStateStore(storage, () => '2026-08-31T00:00:00.000Z');
  assert.equal(store.load().learningRecords.frontend.status, 'articulated');
  assert.ok(values.has('learning-voyage-state-v1'));
  assert.ok(values.has('learning-workspace-state-v2'));
});

test('createDefaultState returns independent collections', () => {
  const first = createDefaultState();
  const second = createDefaultState();
  first.projectIssues.push({ id: 'one' });
  assert.equal(second.projectIssues.length, 0);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/state.test.js`

Expected: FAIL because `js/state.js` does not exist.

- [ ] **Step 3: Implement the minimal versioned store**

```js
export const LEGACY_STATE_KEY = 'learning-voyage-state-v1';
export const STATE_KEY = 'learning-workspace-state-v2';

export function createDefaultState() {
  return {
    version: 2,
    favorites: [],
    notes: {},
    learningRecords: {},
    projectIssues: [],
    practice: { answered: 0, correct: 0 },
    theme: 'dark',
    motionMode: 'trace'
  };
}

export function migrateLegacyState(value = {}, now = new Date().toISOString()) {
  const state = createDefaultState();
  state.favorites = Array.isArray(value.favorites) ? [...new Set(value.favorites)] : [];
  state.notes = Object.fromEntries(Object.entries(value.notes || {}).map(([id, content]) => [
    id,
    { content: typeof content === 'string' ? content : '', updatedAt: now }
  ]));
  state.learningRecords = Object.fromEntries((value.completed || []).map((id) => [id, {
    status: 'articulated', confidence: 3, firstSeenAt: now, lastReviewedAt: now,
    reviewCount: 1, visitCount: id === value.lastViewed ? 1 : 0,
    lastVisitedAt: id === value.lastViewed ? now : ''
  }]));
  state.practice = {
    answered: Number(value.practiceAnswered) || 0,
    correct: Number(value.practiceCorrect) || 0
  };
  state.motionMode = ['trace', 'scan', 'packet'].includes(value.motionMode) ? value.motionMode : 'trace';
  return state;
}
```

Complete the module with defensive array/object normalization, deterministic JSON serialization, import validation requiring `version === 2` plus a `projectIssues` array, and a store whose `load()` prefers valid v2 data before migrating v1.

- [ ] **Step 4: Run the focused and full tests**

Run: `node --test tests/state.test.js && npm test`

Expected: all tests pass.

- [ ] **Step 5: Extend syntax checking**

Change `check` to include `node --check js/state.js` and run `npm run check`.

- [ ] **Step 6: Commit**

```bash
git add js/state.js tests/state.test.js package.json
git commit -m "feat: add versioned learning state store"
```

---

### Task 2: Pure Knowledge, Search, and Project Operations

**Files:**
- Create: `js/knowledge.js`
- Create: `tests/knowledge.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: terminology arrays from `js/data.js` and normalized v2 state.
- Produces: `getLearningRecord(state, lessonId)`, `recordVisit(state, lessonId, now)`, `getRecentLessons(lessons, state, limit)`, `getLearningSummary(lessons, state)`, `searchWorkspace(lessons, state, query)`, `filterProjectIssues(issues, status)`, `getRelatedProjectIssues(state, lessonId)`, `createProjectIssue(input, id, now)`, `updateProjectIssue(issue, patch, now)`.

- [ ] **Step 1: Write failing behavior tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProjectIssue,
  getLearningSummary,
  getRecentLessons,
  getRelatedProjectIssues,
  recordVisit,
  searchWorkspace
} from '../js/knowledge.js';

const lessons = [
  { id: 'state', title: '状态', english: 'State', excerpt: '界面数据', definition: '决定显示内容', aliases: [], tags: ['UI'], category: '前端' },
  { id: 'api', title: '接口', english: 'API', excerpt: '系统边界', definition: '交换数据', aliases: [], tags: ['请求'], category: '后端' }
];

test('recordVisit increments and recent lessons sort by last visit', () => {
  let state = { learningRecords: {}, notes: {}, projectIssues: [] };
  state = recordVisit(state, 'state', '2026-08-30T10:00:00.000Z');
  state = recordVisit(state, 'api', '2026-08-31T10:00:00.000Z');
  state = recordVisit(state, 'api', '2026-08-31T11:00:00.000Z');
  assert.equal(state.learningRecords.api.visitCount, 2);
  assert.deepEqual(getRecentLessons(lessons, state, 2).map((item) => item.id), ['api', 'state']);
});

test('searchWorkspace returns typed terms, notes, and project issues', () => {
  const state = {
    learningRecords: {},
    notes: { state: { content: '保存按钮等待请求', updatedAt: '2026-08-31' } },
    projectIssues: [{ id: 'issue-1', title: '资料保存失败', project: '学习站', symptom: 'PATCH 500', context: '', attempts: '', rootCause: '', solution: '', verification: '', reusableRule: '', relatedLessonIds: ['api'], status: 'working', createdAt: '', updatedAt: '' }]
  };
  assert.deepEqual(searchWorkspace(lessons, state, '状态').map((item) => item.type), ['lesson']);
  assert.deepEqual(searchWorkspace(lessons, state, '等待请求').map((item) => item.type), ['note']);
  assert.deepEqual(searchWorkspace(lessons, state, 'PATCH 500').map((item) => item.type), ['project']);
});

test('learning summary only completes articulated lessons', () => {
  const state = { learningRecords: { state: { status: 'articulated' }, api: { status: 'applied' } } };
  assert.deepEqual(getLearningSummary(lessons, state), { total: 2, unseen: 0, learning: 0, applied: 1, articulated: 1, percent: 50 });
});

test('project issue creation and reverse links are stable', () => {
  const issue = createProjectIssue({ title: '保存失败', relatedLessonIds: ['api', 'api'] }, 'issue-1', '2026-08-31T10:00:00.000Z');
  assert.equal(issue.status, 'inbox');
  assert.deepEqual(issue.relatedLessonIds, ['api']);
  assert.deepEqual(getRelatedProjectIssues({ projectIssues: [issue] }, 'api').map((item) => item.id), ['issue-1']);
});
```

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/knowledge.test.js`

Expected: FAIL because `js/knowledge.js` does not exist.

- [ ] **Step 3: Implement immutable pure operations**

Use shallow object/array copies so `recordVisit` and `updateProjectIssue` never mutate their inputs. `searchWorkspace` returns objects shaped as:

```js
{ type: 'lesson' | 'note' | 'project', id, lessonId, title, excerpt, href }
```

Search order is terminology, matching notes, then project issues. Normalize Chinese/English text with trim and locale-aware lowercase. Project issue search includes every text field and related lesson titles.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/knowledge.test.js && npm test`

Expected: all tests pass.

- [ ] **Step 5: Extend syntax checking and commit**

Add `node --check js/knowledge.js` to `check`, run `npm run check`, then:

```bash
git add js/knowledge.js tests/knowledge.test.js package.json
git commit -m "feat: add personal knowledge operations"
```

---

### Task 3: Connect v2 State, Real History, and Learning Status

**Files:**
- Modify: `js/app.js`
- Modify: `tests/data.test.js`

**Interfaces:**
- Consumes: `createStateStore()` from `js/state.js`; history and learning operations from `js/knowledge.js`.
- Produces: existing pages backed by normalized v2 state; lesson detail controls with status and confidence.

- [ ] **Step 1: Add a failing integration-contract test**

Add to `tests/data.test.js`:

```js
test('every learning route can participate in structured progress', () => {
  for (const lesson of lessons) {
    assert.equal(typeof lesson.id, 'string');
    assert.ok(lesson.id.length > 0);
    assert.ok(Array.isArray(lesson.related));
  }
});
```

Add a new `tests/app-contract.test.js` test that reads `js/app.js` and asserts it imports `createStateStore`, `recordVisit`, and `getLearningSummary`, and contains all four status values. It must fail before the app integration.

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/app-contract.test.js`

Expected: FAIL because the v2 imports and status UI are absent.

- [ ] **Step 3: Replace legacy state access**

Initialize once:

```js
const stateStore = createStateStore(localStorage);
let state = stateStore.load();

function saveState() {
  state = stateStore.save(state);
  updateProgressUI();
}
```

Replace `practiceAnswered` and `practiceCorrect` with `state.practice.answered` and `state.practice.correct`. Replace note strings with `state.notes[id]?.content`. Define `isCompleted(id)` as status `articulated` for backward-compatible card visuals.

- [ ] **Step 4: Record visits and render real recents**

In `renderLesson`, call `recordVisit` before rendering and persist once. In `renderHome`, use `getRecentLessons`; fall back to the first four lessons only when history is empty. Compute progress with `getLearningSummary` and show articulated, applied, and learning counts.

- [ ] **Step 5: Add structured status controls**

Render a native `<select id="learning-status">` with `unseen`, `learning`, `applied`, and `articulated`, plus `<input id="learning-confidence" type="range" min="1" max="5">`. Saving updates `lastReviewedAt`, increments `reviewCount`, and preserves visit fields.

- [ ] **Step 6: Verify and commit**

Run: `npm test && npm run check`

Expected: all tests pass and syntax checking exits 0.

```bash
git add js/app.js tests/data.test.js tests/app-contract.test.js
git commit -m "feat: track learning history and mastery"
```

---

### Task 4: Quick Capture and Project Log Pages

**Files:**
- Modify: `index.html`
- Modify: `js/app.js`
- Modify: `styles.css`
- Modify: `tests/app-contract.test.js`

**Interfaces:**
- Consumes: `createProjectIssue`, `updateProjectIssue`, and `filterProjectIssues` from `js/knowledge.js`.
- Produces: `#/capture` and `#/projects` routes; forms identified by `#capture-form` and `[data-project-form]`.

- [ ] **Step 1: Extend the failing app contract**

Assert that `index.html` contains navigation to `#/projects`, `js/app.js` routes both `capture` and `projects`, and the capture form requires a `name="title"` field. Run the test and verify it fails because routes are absent.

- [ ] **Step 2: Add navigation and routes**

Add “项目日志” to the desktop navigation. Change the fourth mobile item to `记录` targeting `#/projects`; keep `#/favorites` routing intact. Add a “快速记录” action on the home page.

- [ ] **Step 3: Implement capture form**

The form includes required title plus project, symptom, context, and a multi-select checkbox list of terminology IDs. On submit, call:

```js
const issue = createProjectIssue(
  Object.fromEntries(new FormData(form)),
  crypto.randomUUID(),
  new Date().toISOString()
);
state.projectIssues = [issue, ...state.projectIssues];
saveState();
location.hash = `#/projects?focus=${encodeURIComponent(issue.id)}`;
```

Build `relatedLessonIds` explicitly from checked inputs rather than relying on `Object.fromEntries` for repeated names.

- [ ] **Step 4: Implement project log, filtering, editing, and backlinks**

Render status buttons for all/inbox/working/resolved. Each issue card exposes a complete edit form containing attempts, root cause, solution, verification, reusable rule, relations, and status. Save with `updateProjectIssue`. When `focus` matches, add `is-highlighted` and scroll that record into view without animation when reduced motion is requested.

- [ ] **Step 5: Add responsive styles and empty state**

Add `.capture-page`, `.project-page`, `.project-card`, `.project-form`, `.issue-status`, and `.relation-picker` styles. At 580px, stack form fields and actions in one column without horizontal overflow.

- [ ] **Step 6: Verify and commit**

Run: `npm test && npm run check`

```bash
git add index.html js/app.js styles.css tests/app-contract.test.js
git commit -m "feat: add project learning journal"
```

---

### Task 5: Unified Search, Notes, and Reverse Project Links

**Files:**
- Modify: `js/app.js`
- Modify: `styles.css`
- Modify: `tests/app-contract.test.js`

**Interfaces:**
- Consumes: `searchWorkspace` and `getRelatedProjectIssues` from `js/knowledge.js`.
- Produces: typed global search results and project backlinks on terminology detail pages.

- [ ] **Step 1: Add failing app contract assertions**

Assert `js/app.js` calls `searchWorkspace`, includes result labels for `术语`, `笔记`, and `项目问题`, and renders `related-projects`. Run the test and verify RED.

- [ ] **Step 2: Replace lesson-only global search**

Map unified results to links using each result's `href`. Render a type badge and concise excerpt. Limit to 10 results after unified sorting. Keep the current empty state and close the dialog after result activation.

- [ ] **Step 3: Persist timestamped notes**

Save notes as:

```js
state.notes[id] = {
  content: document.querySelector('#lesson-note').value.trim(),
  updatedAt: new Date().toISOString()
};
```

Display the latest update time next to the save button. Empty content removes the note entry instead of leaving an empty searchable record.

- [ ] **Step 4: Render project backlinks**

Below the terminology note section, render matching issues with project name, issue title, status, and links to `#/projects?focus=<id>`. Omit the section when there are no relations.

- [ ] **Step 5: Verify and commit**

Run: `npm test && npm run check`

```bash
git add js/app.js styles.css tests/app-contract.test.js
git commit -m "feat: search notes and project knowledge"
```

---

### Task 6: Backup Controls and Dark/White Theme Switch

**Files:**
- Modify: `index.html`
- Modify: `js/app.js`
- Modify: `styles.css`
- Modify: `tests/app-contract.test.js`

**Interfaces:**
- Consumes: `serializeState`, `parseImportedState`, and the state store from `js/state.js`.
- Produces: `#theme-toggle`, `#export-data`, and `#import-data` controls.

- [ ] **Step 1: Add failing UI contract tests**

Assert the topbar contains `id="theme-toggle"`, the project page implementation contains export/import control IDs, and CSS contains `:root[data-theme="light"]`. Run and verify the test fails before markup and styles are added.

- [ ] **Step 2: Add the top-right theme switch**

Place the button after the local-data label in `.topbar-meta`. Use:

```js
function applyTheme(theme) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  themeToggle.textContent = state.theme === 'dark' ? '切换到白色' : '切换到深色';
  themeToggle.setAttribute('aria-pressed', String(state.theme === 'light'));
}
```

Clicking toggles and saves; initial load applies the stored value before the first route render.

- [ ] **Step 3: Implement a variable-driven white theme**

Add `:root[data-theme="light"]` variables for white page/surface backgrounds, near-black text, visible borders, and accessible status colors. Replace hard-coded dark surface declarations used by topbar, cards, dialogs, forms, practice board, and mobile navigation with `--surface-*` variables so both themes share selectors.

- [ ] **Step 4: Add export and import controls**

Export uses a Blob with MIME `application/json` and filename `learning-workspace-YYYY-MM-DD.json`. Import uses a hidden file input, reads text, calls `parseImportedState`, and shows a local confirmation dialog immediately before replacing state. On rejection or invalid data, keep existing state unchanged and show a descriptive toast.

- [ ] **Step 5: Verify and commit**

Run: `npm test && npm run check`

```bash
git add index.html js/app.js styles.css tests/app-contract.test.js
git commit -m "feat: add backups and light theme"
```

---

### Task 7: Full Regression and Browser Acceptance

**Files:**
- Modify only files required by failures found during verification.

**Interfaces:**
- Consumes: the complete application from Tasks 1–6.
- Produces: verified desktop and mobile behavior with no known console errors.

- [ ] **Step 1: Run full automated verification**

Run: `npm test && npm run check`

Expected: every test passes, zero failures, every JavaScript file passes syntax checking.

- [ ] **Step 2: Start or reload the local application**

Run: `npm run dev` if the server is not already active. Reload after code changes because the server has no hot-module replacement.

- [ ] **Step 3: Verify the learning loop in the browser**

At 1280px: create a project issue, edit it to resolved, associate `frontend`, find it by global search, open the backlink from the terminology page, change the terminology status, and confirm home statistics and true recents update.

- [ ] **Step 4: Verify backup safety**

Export JSON and inspect that it contains version 2 user data but no static lesson definitions. Attempt an invalid import and confirm current data remains. Import the exported backup only after the app's overwrite confirmation and confirm the created issue returns.

- [ ] **Step 5: Verify dark and white themes**

At 1280px and 360px, inspect home, library cards, search dialog, lesson details, capture form, project cards, and practice feedback in both themes. Confirm the switch remains in the top-right toolbar and persists after reload.

- [ ] **Step 6: Verify responsive behavior and logs**

At 360px, 820px, and 1280px confirm no horizontal overflow. Read browser console warnings/errors after all routes have been opened; fix any application-originated entries.

- [ ] **Step 7: Commit verification fixes**

If verification required changes:

```bash
git add index.html js styles.css tests package.json
git commit -m "fix: complete learning loop acceptance"
```

Finish with `git status --short`, `git log --oneline --decorate -8`, and a fresh `npm test && npm run check`.

