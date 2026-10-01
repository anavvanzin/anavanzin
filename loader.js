(() => {
  const root = document.documentElement;
  const loader = document.getElementById('av-loader');
  if (!loader || !root.classList.contains('av-loading')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const preview = document.body.hasAttribute('data-loader-preview');
  const start = window.avLoaderStart || performance.now();
  const controls = [...document.querySelectorAll('body > header, body > main, body > footer')];
  const previous = controls.map(el => el.inert);
  let finished = false;
  controls.forEach(el => { el.inert = true; });
  function finish() {
    if (finished) return;
    finished = true;
    root.classList.remove('av-loading');
    loader.setAttribute('aria-hidden', 'true');
    controls.forEach((el, i) => { el.inert = previous[i]; });
    try { sessionStorage.setItem('av_intro_seen', '1'); } catch {}
    const button = loader.querySelector('button');
    if (document.activeElement === button) {
      const main = document.querySelector('main');
      if (main) { main.setAttribute('tabindex', '-1'); main.focus({preventScroll:true}); }
    }
    document.dispatchEvent(new Event('av:loader-finished'));
  }
  loader.setAttribute('aria-hidden', 'false');
  loader.querySelector('button').addEventListener('click', finish);
  reduced.addEventListener('change', event => { if (event.matches) finish(); });
  setTimeout(finish, 1600);
  const video = document.getElementById('hero-video');
  const poster = new Promise(resolve => {
    if (!video) return resolve();
    const image = new Image();
    image.onload = image.onerror = resolve;
    image.src = video.poster;
  });
  Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), poster]).then(() => {
    setTimeout(finish, Math.max(0, (preview ? 900 : 650) - (performance.now() - start)));
  }).catch(finish);
})();
