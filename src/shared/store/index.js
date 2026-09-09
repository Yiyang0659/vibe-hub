import { safeParse } from '../lib/safe.js';

export const storageKey = 'pkl-v3-state';

export const defaultState = {
  completed: [],
  favorites: [],
  notes: {},
  lastViewed: null,
  theme: 'day',
  motionMode: 'trace',
  practiceAnswered: 0,
  practiceCorrect: 0,
  userNotes: [],
  userWork: [],
  userToolbox: [],
  userDigests: [],
  toolChecklist: {}
};

function preferredTheme(saved) {
  if (saved.theme === 'night' || saved.theme === 'day') return saved.theme;
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
}

function normalizeState(saved) {
  return {
    ...defaultState,
    ...saved,
    completed: Array.isArray(saved.completed) ? saved.completed : [],
    favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
    notes: saved.notes && typeof saved.notes === 'object' ? saved.notes : {},
    userNotes: Array.isArray(saved.userNotes) ? saved.userNotes : [],
    userWork: Array.isArray(saved.userWork) ? saved.userWork : [],
    userToolbox: Array.isArray(saved.userToolbox) ? saved.userToolbox : [],
    userDigests: Array.isArray(saved.userDigests) ? saved.userDigests : [],
    toolChecklist: saved.toolChecklist && typeof saved.toolChecklist === 'object' ? saved.toolChecklist : {},
    theme: preferredTheme(saved)
  };
}

function mergeUserContent(builtIn, userItems) {
  const userMap = new Map(userItems.map((item) => [item.id, item]));
  const merged = builtIn.map((item) => userMap.get(item.id) || item);
  userItems.forEach((item) => {
    if (!merged.some((candidate) => candidate.id === item.id)) merged.unshift(item);
  });
  return merged;
}

export function createStore({
  storage = globalThis.localStorage,
  notes = [],
  workItems = [],
  toolbox = [],
  initialDigests = [],
  onSave = () => {}
} = {}) {
  if (!storage?.getItem || !storage?.setItem) {
    throw new TypeError('createStore requires a Storage-compatible object');
  }

  const saved = safeParse(storage.getItem(storageKey), {}) || {};
  const state = normalizeState(saved);

  return {
    getState: () => state,
    save() {
      storage.setItem(storageKey, JSON.stringify(state));
      onSave(state);
    },
    getAllNotes: () => mergeUserContent(notes, state.userNotes),
    getAllWork: () => mergeUserContent(workItems, state.userWork),
    getAllToolbox: () => mergeUserContent(toolbox, state.userToolbox),
    getAllDigests: () => mergeUserContent(initialDigests, state.userDigests)
  };
}
