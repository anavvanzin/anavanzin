/* Static Metamorfose composition; only navigation changes state. */
(() => {
  const root = document.documentElement;
  const menu = document.querySelector('.mm-nav');
  const menuTrigger = document.querySelector('.mm-trigger');
  const index = document.querySelector('#mm-index');
  const indexTrigger = document.querySelector('.mm-index-toggle');
  const compact = matchMedia('(max-width: 1000px)');
  let panel = null;
  let updating = false;
  function setLang(lang) {
    if (!['pt', 'en'].includes(lang)) return;
    root.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-pt]').forEach(el => { el.textContent = el.dataset[lang]; });
    document.querySelectorAll('[data-label-pt]').forEach(el => el.setAttribute('aria-label', el.dataset[lang === 'pt' ? 'labelPt' : 'labelEn']));
    document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.lang === lang)));
    try { localStorage.setItem('av_lang', lang); } catch {}
  }
  function showPanel(next, focus = true) {
    updating = true;
    if (index.open && next !== 'index') index.close();
    root.toggleAttribute('data-menu-open', next === 'menu');
    menuTrigger.setAttribute('aria-expanded', String(next === 'menu'));
    indexTrigger.setAttribute('aria-expanded', String(next === 'index'));
    panel = next;
    if (next === 'index' && !index.open) index.showModal();
    updating = false;
    if (focus && next === 'menu') menu.querySelector('a').focus();
  }
  function openPanel(next) {
    if (next === 'menu' && !compact.matches) return;
    const url = new URL(location.href);
    url.hash = next === 'menu' ? 'menu' : 'indice';
    const state = { ...history.state, avHomePanel: next };
    // Switching panels occupies one history entry: Back closes the panel.
    if (history.state?.avHomePanel) history.replaceState(state, '', url);
    else history.pushState(state, '', url);
    showPanel(next);
  }
  function restoreFocus(previous) {
    const trigger = previous === 'index' ? indexTrigger : menuTrigger;
    (trigger.getClientRects().length ? trigger : document.querySelector('.home-brand')).focus();
  }
  function closePanel() {
    const previous = panel;
    if (!previous) return;
    showPanel(null, false);
    if (history.state?.avHomePanel) history.back();
    restoreFocus(previous);
  }
  document.querySelectorAll('[data-lang]').forEach(el => el.addEventListener('click', () => setLang(el.dataset.lang)));
  try { setLang(localStorage.getItem('av_lang') || 'pt'); } catch { setLang('pt'); }
  menuTrigger.addEventListener('click', () => panel === 'menu' ? closePanel() : openPanel('menu'));
  indexTrigger.addEventListener('click', () => openPanel('index'));
  index.querySelector('.mm-index-close').addEventListener('click', closePanel);
  index.querySelector('[data-open-menu]').addEventListener('click', () => openPanel('menu'));
  index.addEventListener('cancel', event => { event.preventDefault(); closePanel(); });
  index.addEventListener('close', () => { if (!updating && panel === 'index') closePanel(); });
  index.addEventListener('click', event => {
    if (event.target !== index) return;
    const b = index.getBoundingClientRect();
    if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) closePanel();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel) { event.preventDefault(); closePanel(); }
  });
  document.addEventListener('click', event => {
    if (panel === 'menu' && !event.target.closest('.nav, .mm-index-toggle, #mm-index')) closePanel();
  });
  window.addEventListener('popstate', () => {
    const previous = panel;
    const saved = history.state?.avHomePanel || null;
    showPanel(saved === 'menu' && !compact.matches ? null : saved, false);
    if (previous && !saved) restoreFocus(previous);
  });
  window.addEventListener('pageshow', () => {
    const saved = history.state?.avHomePanel;
    if (saved === 'index' || saved === 'menu' && compact.matches) showPanel(saved, false);
  });
  compact.addEventListener('change', () => { if (!compact.matches && panel === 'menu') closePanel(); });
  root.classList.add('mm-ready');
})();
