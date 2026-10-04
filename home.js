/* Metamorfose navigation and language controls. */
(() => {
  const root = document.documentElement;
  const menu = document.querySelector('.mm-nav');
  const menuTrigger = document.querySelector('.mm-trigger');
  const index = document.querySelector('#mm-index');
  const indexTrigger = document.querySelector('.mm-index-toggle');
  const compact = matchMedia('(max-width: 1000px)');
  let panel = null;
  let updating = false;
  let lang = 'pt';
  function setLang(next, persist = true) {
    if (!['pt', 'en'].includes(next)) return;
    lang = next;
    root.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-pt]').forEach(el => { el.textContent = el.dataset[lang]; });
    document.querySelectorAll('[data-label-pt]').forEach(el => el.setAttribute('aria-label', el.dataset[lang === 'pt' ? 'labelPt' : 'labelEn']));
    document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.lang === lang)));
    if (persist) { try { localStorage.setItem('av_lang', lang); } catch {} }
  }
  function restoreLang() {
    let next = lang;
    try { next = localStorage.getItem('av_lang') === 'en' ? 'en' : 'pt'; } catch {}
    setLang(next, false);
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
  restoreLang();
  menuTrigger.addEventListener('click', () => panel === 'menu' ? closePanel() : openPanel('menu'));
  indexTrigger.addEventListener('click', () => openPanel('index'));
  index.querySelector('.mm-index-close').addEventListener('click', closePanel);
  index.querySelector('[data-open-menu]').addEventListener('click', () => openPanel('menu'));
  index.addEventListener('cancel', event => { event.preventDefault(); closePanel(); });
  index.addEventListener('close', () => { if (!updating && !index.open && panel === 'index') closePanel(); });
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
    restoreLang();
    const saved = history.state?.avHomePanel;
    if (saved === 'index' || saved === 'menu' && compact.matches) showPanel(saved, false);
  });
  window.addEventListener('storage', event => {
    if (event.key === 'av_lang' || event.key === null) restoreLang();
  });
  compact.addEventListener('change', () => { if (!compact.matches && panel === 'menu') closePanel(); });
  root.classList.add('mm-ready');
})();

/* Load portrait motion only when visible and permitted. */
(() => {
  const video = document.getElementById('hero-video');
  const button = document.querySelector('.portrait-control');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 1000px)');
  let userPaused = false, userRequested = false, visible = true;

  function label() {
    const paused = video.paused;
    const unavailable = Boolean(video.error);
    button.disabled = unavailable;
    button.dataset.pt = unavailable ? 'Retrato estático' : paused ? 'Retomar movimento' : 'Pausar movimento';
    button.dataset.en = unavailable ? 'Static portrait' : paused ? 'Resume motion' : 'Pause motion';
    button.textContent = document.documentElement.lang === 'en' ? button.dataset.en : button.dataset.pt;
  }

  function sync() {
    if (userPaused || document.hidden || !visible || document.documentElement.classList.contains('av-loading') || (reduced.matches && !userRequested)) {
      video.pause();
      label();
      return;
    }
    const desired = mobile.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
    if (video.getAttribute('src') !== desired) {
      video.src = desired;
      video.load();
    }
    video.play().then(label).catch(label);
  }

  function source() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.classList.remove('has-frame');
    sync();
  }

  button.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      userRequested = true;
    } else {
      userPaused = true;
      userRequested = false;
    }
    sync();
  });
  video.addEventListener('playing', () => { video.classList.add('has-frame'); label(); });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  video.addEventListener('error', label);
  reduced.addEventListener('change', () => {
    userRequested = false;
    if (reduced.matches && video.readyState) video.currentTime = 0;
    sync();
  });
  mobile.addEventListener('change', source);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('av:loader-finished', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 }).observe(video);
  }
  source();
})();
