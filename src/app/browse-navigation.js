// Old public entry points resolve to one catalog without removing detail pages.
export function canonicalBrowseHash(hash) {
  const [path, query = ''] = hash.split('?');
  const params = new URLSearchParams(query);
  if (['#/library', '#/library-resources'].includes(path)) {
    params.delete('type');
    params.set('category', '外部资料');
    return '#/toolbox?' + params;
  }
  if (['#/learning', '#/notes'].includes(path) && !params.has('review')) {
    if (params.get('kind') === 'CONCEPT' || !params.has('kind')) {
      params.delete('kind');
      return '#/topics' + (params.size ? '?' + params : '');
    }
  }
  return hash;
}
export function validBrowseReturn(hash, kind) {
  if (typeof hash !== 'string') return false;
  const [path, query=''] = hash.split('?');
  const params = new URLSearchParams(query);
  if (kind === 'knowledge') return path === '#/topics' || (path === '#/learning' && params.get('kind') === 'CONCEPT');
  if (kind === 'resource') return path === '#/toolbox';
  return false;
}
export function mountBrowseNavigation(main, routeName, id) {
  browseController?.abort();
  const kind = ['topics','topic','lesson'].includes(routeName) ? 'knowledge' : ['toolbox','playbooks'].includes(routeName) ? 'resource' : null;
  if (!kind) return;
  const key = kind + '-return';
  let previous;
  try { previous = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch {}
  if (!id) {
    main.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link?.getAttribute('href')?.startsWith(kind === 'knowledge' ? '#/topics/' : '#/toolbox/')) {
        try { sessionStorage.setItem(key, JSON.stringify({hash:location.hash,y:scrollY})); } catch {}
      }
    }, {capture:true, signal: browseSignal()});
    if (main.dataset?.restoreCatalog === 'true' && previous?.hash === location.hash && Number.isFinite(previous.y)) requestAnimationFrame(()=>scrollTo({top:previous.y,behavior:'instant'}));
  } else {
    const href = validBrowseReturn(previous?.hash,kind) ? previous.hash : kind === 'knowledge' ? '#/topics' : '#/toolbox';
    const nav = document.createElement('nav');
    nav.className = 'browse-return site-container';
    nav.setAttribute('aria-label','返回目录');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = kind === 'knowledge' ? '← 返回知识目录' : '← 返回资源目录';
    nav.append(link);
    const breadcrumb = main.querySelector('.entry-breadcrumb a[href="#/toolbox"]');
    if (kind === 'resource' && breadcrumb) {
      breadcrumb.href = href;
      breadcrumb.textContent = '← 返回资源目录';
    } else main.prepend(nav);
    if(kind === 'resource') main.querySelectorAll('a[href="#/toolbox"]').forEach(a=>a.href=href);
  }
}
let browseController;
function browseSignal() {
  browseController?.abort();
  browseController = new AbortController();
  return browseController.signal;
}
