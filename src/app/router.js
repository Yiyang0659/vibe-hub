const ROUTE_ALIASES = {
  learning: 'notes',
  topic: 'topics',
  lesson: 'topics',
  papers: 'reading',
  projects: 'work',
  playbooks: 'toolbox',
  favorites: 'saved',
  'library-resources': 'library'
};

const ROUTES = new Set([
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
]);

export function parseHash(hash = '') {
  const raw = String(hash).replace(/^#\/?/, '') || 'home';
  const [path, query = ''] = raw.split('?');
  const [routeName = 'home', id] = path.split('/');
  return { routeName: routeName || 'home', id, query };
}

export function normalizeRouteName(routeName = 'home') {
  const normalized = ROUTE_ALIASES[routeName] || routeName;
  return ROUTES.has(normalized) ? normalized : 'not-found';
}

export function createRouter({ render, target = globalThis } = {}) {
  if (typeof render !== 'function') throw new TypeError('createRouter requires a render function');
  const onRoute = () => {
    const parsed = parseHash(target.location?.hash || '');
    render({ ...parsed, normalizedRoute: normalizeRouteName(parsed.routeName) });
  };
  return {
    start() {
      target.addEventListener?.('hashchange', onRoute);
      onRoute();
    },
    stop() {
      target.removeEventListener?.('hashchange', onRoute);
    },
    refresh: onRoute
  };
}
