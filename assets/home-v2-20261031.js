/* ===== home-v2 · coreografia do candidato (staging) =====================
   Camada de movimento sobre a home publicada. Nada aqui é essencial:
   sem JS/GSAP ou com prefers-reduced-motion, a página permanece
   completa e legível (a base av-os.css/home-review.css nunca esconde
   conteúdo por conta própria). */
(function () {
  'use strict';

  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Escape fecha o menu móvel e devolve o foco ao botão que o abriu. */
  var nav = document.querySelector('.nav');
  if (nav) {
    nav.addEventListener('keydown', function (event) {
      var trigger = nav.querySelector('.menu-trigger');
      if (event.key === 'Escape' && trigger && trigger.getAttribute('aria-expanded') === 'true') {
        trigger.click();
        trigger.focus();
      }
    });
  }

  function isEn() { return document.documentElement.lang === 'en'; }

  /* av-os.js registra o handler de idioma primeiro (script anterior no
     documento); aqui reagimos depois que o DOM já foi trocado. */
  var langListeners = [];
  function onLangChange(fn) { langListeners.push(fn); }
  document.querySelectorAll('.lang button[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      requestAnimationFrame(function () {
        langListeners.forEach(function (fn) { fn(); });
      });
    });
  });

  /* ---------- scramble latim ⇄ rótulo atual (portas) -------------------- */
  var GLYPHS = 'ABCDEFGHIKLMNOPQRSTUVXZ·'; /* latim epigráfico: sem J/U/W */
  function makeScramble(el) {
    var current = el.textContent, raf = 0, queue = [], frame = 0;
    function setText(s) {
      var out = '';
      for (var i = 0; i < s.length; i++) out += '<span class="glyph">' + (s[i] === ' ' ? '&nbsp;' : s[i]) + '</span>';
      el.innerHTML = out;
    }
    function to(target) {
      cancelAnimationFrame(raf);
      var from = current, len = Math.max(from.length, target.length);
      queue = [];
      for (var i = 0; i < len; i++) {
        queue.push({
          from: from[i] || '', to: target[i] || '',
          start: Math.floor(Math.random() * 14),
          end: Math.floor(Math.random() * 14) + 14 + i * 2
        });
      }
      frame = 0;
      (function tick() {
        var s = '', done = 0;
        for (var i = 0; i < queue.length; i++) {
          var q = queue[i];
          if (frame >= q.end) { s += q.to; done++; }
          else if (frame >= q.start) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          else s += q.from;
        }
        setText(s);
        if (done < queue.length) { frame++; raf = requestAnimationFrame(tick); }
        else current = target;
      })();
    }
    function reset(s) { cancelAnimationFrame(raf); current = s; setText(s); }
    return { to: to, reset: reset };
  }

  var doorWords = [];
  (function initDoors() {
    document.querySelectorAll('.door .word').forEach(function (el) {
      var sc = makeScramble(el);
      var door = el.closest('.door');
      function label() { return isEn() ? el.getAttribute('data-en') : el.getAttribute('data-pt'); }
      if (!REDUCE) {
        var latin = el.getAttribute('data-latin');
        door.addEventListener('pointerenter', function () { sc.to(latin); });
        door.addEventListener('pointerleave', function () { sc.to(label()); });
        door.addEventListener('focus', function () { sc.to(latin); });
        door.addEventListener('blur', function () { sc.to(label()); });
        door.addEventListener('touchstart', function () {
          sc.to(el.textContent.trim() === label() ? latin : label());
        }, { passive: true });
      }
      doorWords.push({ el: el, sc: sc });
    });
  })();

  /* ---------- movimento (gsap) ------------------------------------------ */
  var motionStarted = false;
  var stmtWords = [];
  var stmtST = null;

  function splitWords(p) {
    var text = p.textContent;
    p.textContent = '';
    var parts = text.split(/\s+/).filter(Boolean);
    parts.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.textContent = w;
      p.appendChild(span);
      if (i < parts.length - 1) p.appendChild(document.createTextNode(' '));
    });
    return p.querySelectorAll('.w');
  }

  /* as palavras acendem por fatia do progresso, calculadas a mão — sem
     tween ligado ao pin, então a troca de idioma só reparte os spans e
     nunca mata/recria o gatilho pinado (recriar com o pin ativo media
     posições erradas). janela de 2 fatias = acendimento sobreposto. */
  function paintStatements(p) {
    var n = stmtWords.length;
    for (var i = 0; i < n; i++) {
      var local = (p * (n + 1) - i) / 2; /* <0 apagada · 0–1 acendendo · ≥1 acesa */
      stmtWords[i].style.opacity = local >= 1 ? 1 : (local <= 0 ? 0.13 : 0.13 + local * 0.87);
    }
  }

  function splitStatements() {
    stmtWords = [];
    document.querySelectorAll('.statements p').forEach(function (p) {
      var ws = splitWords(p);
      for (var i = 0; i < ws.length; i++) stmtWords.push(ws[i]);
    });
  }

  /* suavização do progresso ≈ scrub:0.5, sem tween ligado ao pin */
  var stmtTarget = 0, stmtCur = 0, stmtTicking = false;
  function stmtTick() {
    stmtCur += (stmtTarget - stmtCur) * 0.12;
    if (Math.abs(stmtTarget - stmtCur) < 0.0005) stmtCur = stmtTarget;
    paintStatements(stmtCur);
    if (stmtCur === stmtTarget) { stmtTicking = false; gsap.ticker.remove(stmtTick); }
  }
  function stmtDrive(p, immediate) {
    stmtTarget = p;
    if (immediate) { stmtCur = p; paintStatements(p); return; }
    if (!stmtTicking) { stmtTicking = true; gsap.ticker.add(stmtTick); }
  }

  function buildStatements() {
    if (stmtST) { /* idioma trocou: reparte as palavras, o pin permanece */
      splitStatements();
      stmtDrive(stmtST.progress, true);
      return;
    }
    splitStatements();
    if (!stmtWords.length) return;
    stmtDrive(0, true);
    stmtST = ScrollTrigger.create({
      trigger: '.statements', start: 'top top',
      end: function () { return '+=' + (window.innerWidth < 760 ? '120%' : '160%'); },
      pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      refreshPriority: 1, /* o pin mede antes dos triggers abaixo dele */
      onUpdate: function (self) { stmtDrive(self.progress); },
      onRefresh: function (self) { stmtDrive(self.progress, true); }
    });
  }

  function cascade(targets, trigger, vars) {
    if (!document.querySelector(trigger)) return;
    var v = { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 };
    if (vars) for (var k in vars) v[k] = vars[k];
    if (v.y === null) delete v.y; /* y:null = esta cascata não toca em y */
    v.scrollTrigger = { trigger: trigger, start: 'top 84%', once: true };
    gsap.from(targets, v);
  }

  function initMotion() {
    if (motionStarted || REDUCE || !window.gsap || !window.ScrollTrigger) return;
    motionStarted = true;
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('v2-motion');
    var EASE = 'power3.out'; /* ≈ cubic-bezier(0.22,1,0.36,1) */

    /* 0 — fio de progresso (marcador de leitura) */
    var bar = document.createElement('div');
    bar.className = 'v2-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    gsap.to(bar, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });

    /* 1 — hero: o nome monta (nunca explode) */
    var nameSpans = document.querySelectorAll('#name a > span');
    var chars = [];
    nameSpans.forEach(function (sp) {
      var t = sp.textContent;
      sp.textContent = '';
      sp.setAttribute('aria-hidden', 'true'); /* o <a> pai tem aria-label */
      for (var i = 0; i < t.length; i++) {
        var wrap = document.createElement('span'); wrap.className = 'ch-wrap';
        var c = document.createElement('span'); c.className = 'ch';
        c.textContent = t[i];
        wrap.appendChild(c); sp.appendChild(wrap);
        chars.push(c);
      }
    });
    if (chars.length) {
      gsap.from(chars, {
        yPercent: 118, rotation: 3, duration: 1.25, ease: EASE,
        stagger: { each: 0.04 }, delay: 0.12
      });
    }
    gsap.from(['.signature', '.hero-copy', '.index-toggle'], {
      y: 24, opacity: 0, duration: 1, ease: EASE, stagger: 0.1, delay: 0.55
    });

    /* hero respira com o scroll: o texto esvai */
    gsap.to('.hero-inner', {
      opacity: 0.18, y: -40, ease: 'none',
      scrollTrigger: { trigger: '.fluid-hero', start: 'top top', end: 'bottom 30%', scrub: true }
    });

    /* as variantes A/B ainda têm a arte no hero; a candidata v3 não tem */
    if (document.querySelector('.hero-art')) {
      gsap.from('.hero-art', { opacity: 0, y: 34, duration: 1.3, ease: EASE, delay: 0.35 });
      gsap.from('.hero-art img', { scale: 1.06, duration: 1.7, ease: EASE, delay: 0.35 });
      gsap.to('.hero-art', {
        y: 36, ease: 'none',
        scrollTrigger: { trigger: '.fluid-hero', start: 'top top', end: 'bottom 30%', scrub: true }
      });
    }

    /* 2 — portas entram */
    cascade('.doors-head', '.doors');
    cascade('.door', '.doors-grid', { y: 56, stagger: 0.1, duration: 1.05 });

    /* 2b — índice ilustrado (cards IV–VII) */
    cascade('.index-illustrated-head', '.index-illustrated');
    cascade('.tile', '.tiles', { y: 44, stagger: 0.09, duration: 1 });

    /* 2c — direção A · "a home responde" (perguntas do arquivo) */
    cascade('.qa-head > *', '.qa', { y: 20, stagger: 0.07 });
    cascade('.qa-item', '.qa-list', { y: 26, stagger: 0.055, duration: 0.85 });
    cascade('.qa-plate', '.qa-body', { y: 30, duration: 1 });

    /* 2d — capela: a prancha escura que abre o painel */
    cascade('.capela-frame', '.capela', { y: 34, duration: 1.1 });
    cascade('.capela-caption > *', '.capela-caption', { y: 16, stagger: 0.08 });

    /* 3 — marquee reativo à velocidade (substitui a animação CSS) */
    var track = document.querySelector('.marquee-track');
    if (track) {
      track.style.animation = 'none';
      var loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 26, repeat: -1 });
      var skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power2.out' });
      var backTo1;
      ScrollTrigger.create({
        onUpdate: function (self) {
          var v = self.getVelocity();
          skewTo(gsap.utils.clamp(-9, 9, v / -260));
          gsap.to(loop, { timeScale: 1 + Math.min(3, Math.abs(v) / 700), duration: 0.15, overwrite: true });
          if (backTo1) backTo1.kill();
          backTo1 = gsap.to(loop, { timeScale: 1, duration: 0.9, delay: 0.2, ease: 'power2.out' });
          backTo1.eventCallback('onComplete', function () { skewTo(0); });
        }
      });
    }

    /* 5 — cascatas das seções */
    cascade(['.feature .eyebrow', '.feature h2', '.feature .topic', '.feature .feature-link'], '.feature');
    cascade(['.band .eyebrow', '.band h2', '.band div > p:not(.eyebrow)', '.band .cta'], '.band');
    cascade('.band li', '.band ul', { y: 18, stagger: 0.06 });
    cascade('.entries article', '.entries', { y: 44, stagger: 0.12, duration: 1 });
    cascade('.board-head', '.board', { y: 26 });
    cascade(['.bio .section-head', '.bio .bio-portrait', '.bio .facts li', '.bio .prose p', '.bio .prose a'], '.bio', { stagger: 0.08 });
    cascade('.footer > *', '.footer', { y: 14, stagger: 0.05 });

    /* 6 — manifesto pinado, palavra por palavra */
    buildStatements();

    /* 7 — board: mosaico entra (yPercent) + deriva por coluna (y) —
       componentes de transform distintos; y:null evita que a entrada
       dispute a propriedade y com o parallax (ambos escreveriam y). */
    cascade('.board-grid figure', '.board-grid', {
      y: null, yPercent: 6, opacity: 0, duration: 1.05, stagger: 0.07
    });
    gsap.utils.toArray('.board-grid figure').forEach(function (fig) {
      gsap.to(fig, {
        y: function () {
          var g = fig.parentNode;
          var cx = (fig.offsetLeft - g.offsetLeft) + fig.offsetWidth / 2;
          var t = (cx / g.offsetWidth) * 2 - 1;
          return Math.round(t * -26);
        },
        ease: 'none',
        scrollTrigger: { trigger: '.board', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true }
      });
    });
  }

  /* refresh programado: a base tem html{scroll-behavior:smooth} e o
     ScrollTrigger corrige o scroll via window.scrollTo() durante o
     refresh — com smooth isso vira glide e as medições saem erradas
     (pin ativo media start ≈ trueStart − scrollY). Desliga o smooth só
     durante o refresh e religa no fim do tick. */
  function safeRefresh() {
    var de = document.documentElement;
    de.style.scrollBehavior = 'auto';
    ScrollTrigger.refresh();
    setTimeout(function () { de.style.scrollBehavior = ''; }, 0);
  }

  /* idioma trocado: portas releem o rótulo; manifesto se reparte */
  var refreshDirty = false;
  var reT;
  onLangChange(function () {
    doorWords.forEach(function (d) {
      d.sc.reset(isEn() ? d.el.getAttribute('data-en') : d.el.getAttribute('data-pt'));
    });
    if (motionStarted) {
      buildStatements();
      /* adia p/ o layout assentar após a troca de textos; se um smooth-
         scroll do usuário estiver rolando, o scroll-idle abaixo sara */
      refreshDirty = true;
      clearTimeout(reT);
      reT = setTimeout(function () {
        if (!refreshDirty) return;
        refreshDirty = false;
        safeRefresh();
      }, 180);
    }
  });

  /* a base usa scroll-behavior:smooth — refresh() durante o glide mede
     posições erradas; ao parar de rolar, sara qualquer medição pendente */
  var idleT;
  window.addEventListener('scroll', function () {
    if (!refreshDirty) return;
    clearTimeout(idleT);
    idleT = setTimeout(function () {
      refreshDirty = false;
      if (motionStarted) safeRefresh();
    }, 220);
  }, { passive: true });

  if (document.readyState === 'complete') initMotion();
  else window.addEventListener('load', initMotion);
  setTimeout(initMotion, 3500); /* rede lenta: última chance; idempotente */
})();
