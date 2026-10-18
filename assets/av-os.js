/* av-os · anavanzin.com — comportamento compartilhado
   PT/EN toggle (data-pt/data-en), menu móvel, índice do site.
   Sem dependências. */
(function () {
  'use strict';

  /* ---------- idioma ---------- */
  var KEY = 'av-lang';

  function applyLang(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.querySelectorAll('[data-pt][data-en]').forEach(function (el) {
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
    });
    document.querySelectorAll('[data-pt-html][data-en-html]').forEach(function (el) {
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en-html') : el.getAttribute('data-pt-html');
    });
    document.querySelectorAll('[data-alt-pt][data-alt-en]').forEach(function (el) {
      el.setAttribute('alt', lang === 'en' ? el.getAttribute('data-alt-en') : el.getAttribute('data-alt-pt'));
    });
    document.querySelectorAll('[data-label-pt][data-label-en]').forEach(function (el) {
      el.setAttribute('aria-label', lang === 'en' ? el.getAttribute('data-label-en') : el.getAttribute('data-label-pt'));
    });
    document.querySelectorAll('.lang button[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var initial = saved || ((navigator.language || 'pt').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en');

  document.querySelectorAll('.lang button[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang')); });
  });
  applyLang(initial);

  /* ---------- menu móvel ---------- */
  var trigger = document.querySelector('.menu-trigger');
  var links = document.querySelector('.nav-links');
  if (trigger && links) {
    trigger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- índice do site ---------- */
  var dialog = document.getElementById('site-index');
  var toggle = document.querySelector('.index-toggle');
  if (dialog && toggle && typeof dialog.showModal === 'function') {
    toggle.addEventListener('click', function () {
      dialog.showModal();
      toggle.setAttribute('aria-expanded', 'true');
    });
    var close = dialog.querySelector('.index-close');
    if (close) close.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { toggle.setAttribute('aria-expanded', 'false'); });
  } else if (toggle) {
    /* sem <dialog>: revela o fallback <details> */
    toggle.hidden = true;
    var fb = document.querySelector('details.index-fallback');
    if (fb) fb.open = false;
  }
/* ---------- campo fluido (port fiel do fbm domain-warped) ---------- */
  var fluidCanvas = document.querySelector('canvas.fluid');
  if (fluidCanvas) initFluid(fluidCanvas);

  function initFluid(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SPEED = 0.8, STRENGTH = 0.45;

    function hexRgb(hex) {
      var v = parseInt(hex.replace('#', ''), 16);
      return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
    }
    function dim(c, k) { return { r: c.r * k, g: c.g * k, b: c.b * k }; }

    var accent = getComputedStyle(document.documentElement).getPropertyValue('--burgundy').trim() || '#750D20';
    var surface = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#F5F0E6';
    var glow = hexRgb(accent);
    var c0 = hexRgb(surface), c1 = dim(glow, 0.72), c2 = dim(glow, 0.38);

    function hash2(ix, iy) {
      var h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }
    function vnoise(x, y) {
      var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      var sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      var a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    }
    function fbm(x, y, oct) {
      var v = 0, amp = 0.5, freq = 1, norm = 0;
      for (var i = 0; i < oct; i++) { v += vnoise(x * freq, y * freq) * amp; norm += amp; amp *= 0.5; freq *= 2.03; }
      return v / norm;
    }
    function sample(x, y, t, mx, my) {
      var dx = x - mx, dy = y - my;
      var push = STRENGTH * Math.exp(-(dx * dx + dy * dy) / 0.018);
      var px = x + dx * push * 1.4, py = y + dy * push * 1.4;
      var q = fbm(px * 2.6 + t * 0.1, py * 2.6 - t * 0.07, 4);
      return fbm(px * 4.4 + q * 2.4 + 5.2 - t * 0.05, py * 4.4 + q * 1.9 + 1.3, 3);
    }
    function sstep(e0, e1, v) { var k = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return k * k * (3 - 2 * k); }

    var bw = 0, bh = 0, img = null, mx = 0.5, my = 0.42, tx = mx, ty = my;

    function render(t) {
      var cssW = canvas.clientWidth || 1, cssH = canvas.clientHeight || 1;
      var wantW = Math.round(Math.min(200, Math.max(96, cssW / 8)));
      var wantH = Math.max(2, Math.round((wantW * cssH) / cssW));
      if (wantW !== bw || wantH !== bh) {
        bw = wantW; bh = wantH; canvas.width = bw; canvas.height = bh;
        img = ctx.createImageData(bw, bh);
      }
      var data = img.data, aspect = cssW / cssH, p = 0;
      for (var iy = 0; iy < bh; iy++) {
        var y = iy / bh;
        for (var ix = 0; ix < bw; ix++) {
          var x = (ix / bw) * aspect;
          var v = sample(x, y, t, mx * aspect, my);
          var band = 0.86 + 0.14 * Math.sin((v * 7 - t * 0.5) * Math.PI * 2);
          var m1 = sstep(0.52, 0.94, v);
          var m2 = sstep(0.74, 0.985, v) * band;
          data[p] = c0.r + (c1.r - c0.r) * m1 + (c2.r - c1.r) * m2;
          data[p + 1] = c0.g + (c1.g - c0.g) * m1 + (c2.g - c1.g) * m2;
          data[p + 2] = c0.b + (c1.b - c0.b) * m1 + (c2.b - c1.b) * m2;
          data[p + 3] = 255;
          p += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    if (reduced) { render(0); return; }

    var last = 0, start = -1;
    function loop(now) {
      requestAnimationFrame(loop);
      if (start < 0) start = now;
      if (now - last < 33) return;
      last = now;
      if (document.hidden) return;
      mx += (tx - mx) * 0.09;
      my += (ty - my) * 0.09;
      render(((now - start) / 1000) * SPEED);
    }
    requestAnimationFrame(loop);

    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        tx = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
        ty = Math.min(1, Math.max(0, e.clientY / window.innerHeight));
      }, { passive: true });
    }
  }
})();
