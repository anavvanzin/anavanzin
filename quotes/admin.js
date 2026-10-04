/* Trechos · registro local de rascunhos.
   Lê o catálogo somente para número sugerido e duplicatas.
   Salva apenas neste navegador ou em um arquivo JSON baixado. */
(function () {
  'use strict';
  var DRAFT_KEY = 'trechos:registro:rascunho:v1';
  var AUTHOR = 'Ana';
  var form = document.getElementById('quoteForm');
  var quoteInput = document.getElementById('quoteInput');
  var attrInput = document.getElementById('attrInput');
  var dateInput = document.getElementById('dateInput');
  var assignNum = document.getElementById('assignNum');
  var dupWarning = document.getElementById('dupWarning');
  var submitBtn = document.getElementById('submitBtn');
  var exportBtn = document.getElementById('exportBtn');
  var clearBtn = document.getElementById('clearBtn');
  var statusBox = document.getElementById('statusBox');
  var catalogStatus = document.getElementById('catalogStatus');
  var previewNum = document.getElementById('previewNum');
  var previewQuote = document.getElementById('previewQuote');
  var previewAttr = document.getElementById('previewAttr');
  var previewDate = document.getElementById('previewDate');
  var catalog = null;
  var normIndex = {};
  var maxPosition = 0;
  function normalize(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Corpo gravado no JSON: trecho + (atribuição ? '\n— ' + atribuição : '').
  function buildBodyText(quote, attribution) {
    var q = String(quote || '').trim();
    var a = String(attribution || '').trim();
    return a ? q + '\n— ' + a : q;
  }

  function maxPos(posts) {
    var m = 0;
    for (var i = 0; i < posts.length; i++) {
      var p = Number(posts[i].position) || 0;
      if (p > m) m = p;
    }
    return m;
  }

  // Índice de duplicatas: corpo normalizado -> menor position.
  function buildNormIndex(posts) {
    var idx = Object.create(null);
    for (var i = 0; i < posts.length; i++) {
      var n = normalize(posts[i].bodyText);
      if (!n) continue;
      var pos = Number(posts[i].position) || 0;
      if (!(n in idx) || pos < idx[n]) idx[n] = pos;
    }
    return idx;
  }

  // Procura duplicata: (a) corpo completo idêntico; (b) trecho contido em
  // algum corpo existente (mesma citação com atribuição diferente).
  function findDuplicate(posts, idx, bodyText, quoteOnly) {
    var nFull = normalize(bodyText);
    if (nFull && nFull in idx) {
      return { kind: 'exact', position: idx[nFull] };
    }
    var nQuote = normalize(quoteOnly);
    if (!nQuote || nQuote.length < 12) return null; // evita falso positivo em texto curto
    for (var i = 0; i < posts.length; i++) {
      var nExisting = normalize(posts[i].bodyText);
      if (nExisting.length < 12) continue; // ignora corpos vazios/junk (ex.: Nº 1 = "-")
      if (nExisting.indexOf(nQuote) !== -1 || nQuote.indexOf(nExisting) !== -1) {
        return { kind: 'partial', position: Number(posts[i].position) || 0 };
      }
    }
    return null;
  }

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T12:00:00');
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).format(d);
    } catch (e) {
      return iso;
    }
  }


  function validDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    var d = new Date(iso + 'T12:00:00');
    return !isNaN(d.getTime()) &&
      d.getFullYear() === Number(iso.slice(0, 4)) &&
      d.getMonth() + 1 === Number(iso.slice(5, 7)) &&
      d.getDate() === Number(iso.slice(8, 10));
  }

  function setStatus(kind, text) {
    statusBox.hidden = !kind;
    statusBox.className = 'adm-status' + (kind ? ' is-' + kind : '');
    statusBox.textContent = text || '';
  }

  function duplicate() {
    return catalog && quoteInput.value.trim()
      ? findDuplicate(catalog, normIndex,
        buildBodyText(quoteInput.value, attrInput.value), quoteInput.value)
      : null;
  }

  function refreshForm() {
    var quote = quoteInput.value.trim();
    var attr = attrInput.value.trim();
    var nextNum = catalog ? String(maxPosition + 1) : '—';
    assignNum.textContent = nextNum;
    previewNum.textContent = nextNum;
    previewQuote.textContent = quote || 'O trecho aparece aqui conforme você digita.';
    previewAttr.hidden = !attr;
    previewAttr.textContent = attr;
    previewDate.textContent = formatDate(dateInput.value) + ' · rascunho de ' + AUTHOR;
    var dup = duplicate();
    dupWarning.hidden = !dup;
    dupWarning.textContent = dup
      ? (dup.kind === 'exact' ? 'Duplicata exata' : 'Possível duplicata') +
        ' — este trecho já consta no Nº ' + dup.position + '.'
      : '';
    var valid = Boolean(quote && validDate(dateInput.value) && !dup);
    submitBtn.disabled = !valid;
    exportBtn.disabled = !valid;
  }

  function draft() {
    return {
      schemaVersion: 1,
      status: 'draft',
      savedAt: new Date().toISOString(),
      quote: quoteInput.value.trim(),
      attribution: attrInput.value.trim(),
      date: dateInput.value,
      suggestedPosition: catalog ? maxPosition + 1 : null,
      post: {
        bodyText: buildBodyText(quoteInput.value, attrInput.value),
        author: AUTHOR,
        timestamp: new Date(dateInput.value + 'T12:00:00').getTime()
      }
    };
  }

  function canSave() {
    if (!form.reportValidity()) return false;
    if (!quoteInput.value.trim()) {
      setStatus('error', 'Escreva um trecho antes de salvar o rascunho.');
      quoteInput.focus();
      return false;
    }
    if (!validDate(dateInput.value)) {
      setStatus('error', 'Escolha uma data válida para o rascunho.');
      dateInput.focus();
      return false;
    }
    if (duplicate()) {
      setStatus('error', 'Confira a duplicata indicada antes de salvar.');
      quoteInput.focus();
      return false;
    }
    return true;
  }

  function restoreDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved.schemaVersion !== 1 || typeof saved.quote !== 'string' ||
          typeof saved.attribution !== 'string' || !validDate(saved.date)) {
        throw new Error('Formato de rascunho inválido');
      }
      quoteInput.value = saved.quote;
      attrInput.value = saved.attribution;
      dateInput.value = saved.date;
      setStatus('success', 'Rascunho restaurado deste navegador.');
    } catch (e) {
      setStatus('error', 'Não foi possível restaurar o rascunho local. Você pode preencher a ficha e baixar uma cópia.');
    }
  }

  function loadCatalog() {
    fetch('./forum-data.json', { cache: 'no-store', credentials: 'omit' })
      .then(function (res) {
        if (!res.ok) throw new Error('Catálogo indisponível');
        return res.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.posts) || !data.posts.every(function (post) {
          return post && typeof post.bodyText === 'string' &&
            Number.isInteger(post.position) && post.position > 0;
        })) throw new Error('Catálogo inválido');
        var nextIndex = buildNormIndex(data.posts);
        var nextMax = maxPos(data.posts);
        catalog = data.posts;
        normIndex = nextIndex;
        maxPosition = nextMax;
        catalogStatus.textContent = 'Catálogo consultado para conferir número e duplicatas.';
        refreshForm();
      })
      .catch(function () {
        catalog = null;
        normIndex = Object.create(null);
        maxPosition = 0;
        catalogStatus.textContent = 'Catálogo indisponível: número e duplicatas não conferidos. O rascunho local continua disponível.';
        refreshForm();
      });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!canSave()) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft()));
      setStatus('success', 'Rascunho salvo somente neste navegador. Para guardar uma cópia, baixe o arquivo JSON.');
    } catch (e) {
      setStatus('error', 'Este navegador não permitiu salvar. Use “Baixar rascunho” para guardar uma cópia.');
    }
  });

  exportBtn.addEventListener('click', function () {
    if (!canSave()) return;
    var file = new Blob([JSON.stringify(draft(), null, 2) + '\n'], {
      type: 'application/json;charset=utf-8'
    });
    var url = URL.createObjectURL(file);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'trecho-rascunho-' + dateInput.value + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    setStatus('success', 'Cópia do rascunho preparada para download. Ela contém uma proposta de ficha, sem publicar no acervo.');
  });

  clearBtn.addEventListener('click', function () {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      setStatus('error', 'Não foi possível apagar o rascunho salvo neste navegador. Os campos foram preservados.');
      return;
    }
    form.reset();
    dateInput.value = todayISO();
    refreshForm();
    setStatus('success', 'Campos e rascunho local limpos.');
    quoteInput.focus();
  });

  [quoteInput, attrInput, dateInput].forEach(function (input) {
    input.addEventListener('input', refreshForm);
  });
  dateInput.value = todayISO();
  restoreDraft();
  refreshForm();
  loadCatalog();
}());
