export function applyPageMeta(meta, doc = globalThis.document) {
  if (!doc || !meta) return;
  doc.title = meta.title;
  doc.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  doc.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
  doc.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
}

export function navRouteFor(routeName) {
  if (['topics', 'reading', 'library'].includes(routeName)) return 'notes';
  return routeName;
}

export function updateActiveNavigation(routeName, doc = globalThis.document) {
  if (!doc) return;
  const activeRoute = navRouteFor(routeName);
  doc.querySelectorAll('[data-route]').forEach((link) => {
    const active = link.dataset.route === activeRoute;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
