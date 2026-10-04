/**
 * Trechos — Fólio + Concordância
 * Engine: parsing de catálogo (robusto, herdado do Arquivo Vivo), fólios
 * paginados em algarismos romanos, index verborum, verbetes KWIC,
 * favoritos persistentes, permalinks e hash routing.
 *
 * Views: 'folio' (texto corrido) | 'verbete' (concordância KWIC).
 * O trecho aberto é um overlay com permalink #/n/<pos>.
 *
 * Hash:
 *   #/n/<pos>        → trecho aberto (permalink)
 *   #/ano/<aaaa>     → filtro de ano
 *   #/favs           → favoritos
 *   #/fol/<n>        → fólio n (1-based, arábico na URL, romano na tela)
 *   #/palavra/<w>    → verbete da palavra
 * Mudanças de filtro usam replaceState (não poluem o histórico).
 *
 * Contrato do overlay (para o CSS): JS adiciona .active (monta), força
 * reflow, depois .visible (transição de entrada). Saída: remove .visible,
 * aguarda a transição e remove .active.
 */

const CONFIG = {
  DATA_URL: 'forum-data.json',
  SEARCH_DEBOUNCE: 120,
  OVERLAY_EXIT_MS: 400, // fallback caso transitionend não dispare
  FAVS_KEY: 'trechos:favs',
  PER_FOLIO_DESKTOP: 14,
  PER_FOLIO_MOBILE: 7,
  RAIL_WORDS: 12,
};

let allPosts = [];
// O catálogo conserva cada registro; allPosts é apenas a apresentação agrupada.
let allRecords = [];
const recordsByPosition = new Map();
let authorsList = [];
let authorCounts = {};
let yearCounts = {};
let yearsList = [];
let currentOverlayPost = null;

/* ── Estado único ── */
const state = {
  word: null,      // verbete aberto (null = fólio)
  folio: 0,        // página 0-based
  search: '',
  author: '',
  year: 0,
  favsOnly: false,
  lang: 'all',
  letter: null,    // filtro de letra do index verborum
  sort: 'next',    // ordenação do verbete: next | ano | autor
};

/* ── Favoritos (localStorage: array de positions) ── */
function loadFavs() {
  try {
    const arr = JSON.parse(localStorage.getItem(CONFIG.FAVS_KEY) || '[]');
    return new Set(Array.isArray(arr) ? arr.filter(n => Number.isFinite(n)) : []);
  } catch (e) { return new Set(); }
}
let favs = loadFavs();
function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}
const saveFavs = () => storageSet(CONFIG.FAVS_KEY, JSON.stringify([...favs]));

const HEART_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

/* ── Helpers ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmtDate = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};
const fmtDateShort = (ts) => {
  const d = new Date(ts || 0);
  return String(d.getDate()).padStart(2, '0') + '.' +
    String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
};
const fmtInt = (n) => n.toLocaleString('pt-BR');

const debounce = (fn, ms) => {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

const normalize = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* chave de deduplicação: sem diacríticos, minúscula, espaços colapsados */
const dedupeKey = (s) => normalize(s).replace(/\s+/g, ' ').trim();

const escapeHtml = (str) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  return String(str).replace(/[&<>"]/g, (c) => map[c] || c);
};

const padNum = (n) => String(n).padStart(3, '0');

/* Rótulo de exibição para trechos sem atribuição detectável.
 * Nunca usar p.author (nome de quem postou no fórum) como se fosse autor. */
const NO_ATTR = 'Sem atribuição';

/* Atribuição plausível: tem ≥2 chars, contém letra, e não é ruído do
 * scraping (ano solto, "Unknown", assinatura da própria Ana). */
function isPlausibleAttr(a) {
  if (!a) return false;
  const t = a.trim();
  if (t.length < 2) return false;
  if (!/\p{L}/u.test(t)) return false;                    // "1934", "1977)", "3"
  if (/^(unknown|anavanzin)$/i.test(t)) return false;
  return true;
}

/* Higiene de exibição do texto raspado:
 *  - colapsa aspas duplicadas nas pontas ("“…texto…”” → “…texto…”)
 *  - vírgula/;:!? colada entre letras quase sempre é espaço perdido no
 *    scraping ("imagined,if" → "imagined, if"; "really!it's" → "really! it's")
 *  - ponto só quando seguido de MAIÚSCULA e precedido de minúscula
 *    ("us.This" → "us. This"), preservando siglas ("U.S.A."), URLs
 *    ("google.com") e decimais. */
function cleanQuoteText(q) {
  return String(q || '')
    .replace(/^\s*(["'“”‘’]){2,}/, (m) => m.trim().slice(-1))
    .replace(/(["'“”‘’]){2,}\s*$/, (m) => m.trim().slice(0, 1))
    .replace(/(\p{L})([,;:!?])(\p{L})/gu, '$1$2 $3')
    .replace(/(\p{Ll})\.(\p{Lu})/gu, '$1. $2')
    .trim();
}

/* ── Attribution Parser ──
 * Regras (ordem):
 *  (a) linha final começando com —/–/-  → atribuição
 *  (b) senão, corta no ÚLTIMO — ou –
 *  (c) hífen simples só nos últimos ~30% do texto E seguido de maiúscula/dígito
 *  (d) fallback: texto inteiro é citação, atribuição vazia
 * `raw` é sempre preservado. */
function parseAttribution(text) {
  if (!text) return { quote: '', attribution: '', raw: '' };

  // (a) trailing line começando com travessão/meia-risca/hífen
  const lines = text.split(/\r?\n|<br\s*\/?>/i).map(l => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    const m = lines[lines.length - 1].match(/^[—–-]\s*(.+)$/s);
    if (m && isPlausibleAttr(m[1])) {
      return {
        quote: lines.slice(0, -1).join('\n').trim(),
        attribution: m[1].trim(),
        raw: text,
      };
    }
  }

  // (b) último — ou –
  const idx = Math.max(text.lastIndexOf('—'), text.lastIndexOf('–'));
  if (idx > 0) {
    const q = text.slice(0, idx).trim();
    const a = text.slice(idx + 1).trim();
    if (q && isPlausibleAttr(a)) return { quote: q, attribution: a, raw: text };
  }

  // (c) hífen simples: últimos ~30% do texto + próximo char útil é maiúscula/dígito
  const hy = text.lastIndexOf('-');
  if (hy > 0 && hy >= text.length * 0.7) {
    const rest = text.slice(hy + 1).trim();
    if (rest && /^[\p{Lu}\p{Nd}]/u.test(rest)) {
      const q = text.slice(0, hy).trim();
      if (q && isPlausibleAttr(rest)) return { quote: q, attribution: rest, raw: text };
    }
  }

  // (d) fallback
  return { quote: text, attribution: '', raw: text };
}

/* ── Detecção de idioma (pt/en por escore) ── */
function detectLang(text) {
  const low = ' ' + text.toLowerCase() + ' ';
  let pt = 0;
  if (/[ãõçáâêéíóôú]/.test(low)) pt += 2;
  (low.match(/\b(não|que|para|você|uma|com|nada|meu|minha|mais|como|quando|sobre|porque|então|ser|estar|coisa|amor|tempo|gente)\b/g) || []).forEach(() => pt++);
  (low.match(/\b(the|and|you|that|with|this|from|what|when|love|about|there|would|because)\b/g) || []).forEach(() => pt--);
  return pt > 0 ? 'pt' : 'en';
}

/* ── Stoplist do index verborum (pt + en) ── */
const STOP = new Set(('a o e é de do da das dos que em um uma uns umas para por com sem não nao no na nos nas se ao aos as os me te lhe eu tu ele ela nós vos eles elas meu minha seu sua isso isto aquele mas como mais menos muito pouco quando onde qual quem porque então já também só sobre entre até depois antes ser estar ter haver foi era são será seria sido tem têm havia numa num pelo pela dele dela você vocês nem essa esse essas esses nada tudo todo toda todos todas outro outra bem the and for that with this from you your they them there here what when where which who whom will would could should have has had been being was were are is not but all any can just like make made too very much more most some such than then their theirs into out over under about after before because been while your yours our ours his her hers its don don\'t doesn\'t didn\'t won\'t i\'m i\'ve you\'re we\'re they\'re one two she he we us my me mine am be do does did doing going get got go went say said says know knew think thought want wanted way ways thing things time times people person really always never ever even still yet own same other others how why who\'s let lets let\'s only every someone something anyone anybody everything nothing somebody down over again away back into onto myself yourself himself herself themselves itself ourselves feel feels felt take takes took taken good better best great little long longer come comes came give gives gave keep keeps kept look looks looked need needs needed find finds found leave leaves left tell tells told call calls called seem seems seemed turn turns turned start starts started stop stops stopped talk talks talked live lives lived work works worked mean means meant much many maybe perhaps everyone everybody enough almost sometimes often usually anymore though although unless whatever whenever wherever whether without within toward towards through during since until while because kind sort lot lots bit quite rather pretty just already also else stuff able gonna wanna gotta thats theres heres cant wont dont didnt doesnt isnt arent wasnt werent havent hasnt hadnt couldnt shouldnt wouldnt can\'t won\'t couldn\'t wouldn\'t shouldn\'t isn\'t aren\'t wasn\'t weren\'t haven\'t hasn\'t hadn\'t you\'ll we\'ll they\'ll i\'ll he\'s she\'s that\'s there\'s here\'s what\'s você todos assim ainda apenas outra outras outro outros mesmo mesma coisa coisas pessoa pessoas alguém alguma algum algo nunca sempre talvez porém contudo entanto pois cujo cuja durante enquanto embora those these another anything first last next right left around above below once twice both each either neither whole half part place aside along across behind beside besides between beyond instead anyway anyhow upon further furthest').split(/\s+/));

/* ── Index verborum ──
 * Palavras com ≥4 letras, fora da stoplist, frequência entre 3 e 6% do
 * corpus. Conta UMA ocorrência por trecho (frequência de documento). */
let wordsCache = null;
function wordIndex() {
  if (wordsCache) return wordsCache;
  const map = new Map();
  allPosts.forEach(p => {
    const seen = new Set();
    (p._low.match(/[a-zà-ÿ'’]{4,}/g) || []).forEach(w0 => {
      const w = w0.replace(/’/g, "'").replace(/^'+|'+$/g, '').replace(/'s$/, '');
      if (STOP.has(w) || w.length < 4 || seen.has(w)) return;
      seen.add(w);
      map.set(w, (map.get(w) || 0) + 1);
    });
  });
  const ceiling = Math.max(6, Math.round(allPosts.length * 0.06));
  wordsCache = [...map.entries()]
    .filter(([, c]) => c >= 3 && c <= ceiling)
    .map(([w, c]) => ({ w, c }))
    .sort((a, b) => b.c - a.c || a.w.localeCompare(b.w));
  return wordsCache;
}

/* ── Romanos ── */
function roman(n) {
  const t = [[100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
  let s = '';
  t.forEach(([v, r]) => { while (n >= v) { s += r; n -= v; } });
  return s || 'i';
}

/* ── Highlight de busca ──
 * Aplica <mark> apenas em segmentos de texto — nunca dentro de tags ou
 * entidades. Funciona sobre o texto CRU: busca os termos numa versão
 * normalizada (sem diacríticos, minúscula) e mapeia os índices de volta
 * para o texto original, que é escapado por segmento na montagem final. */
function highlightText(text, query) {
  const raw = String(text || '');
  if (!query || !query.trim()) return escapeHtml(raw);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return escapeHtml(raw);

  // texto normalizado + mapa de índice normalizado → índice cru
  let norm = '';
  const idxMap = [];
  for (let i = 0; i < raw.length; i++) {
    const n = normalize(raw[i]);
    for (let j = 0; j < n.length; j++) idxMap.push(i);
    norm += n;
  }

  const ranges = [];
  for (const t of terms) {
    if (!t) continue;
    let from = 0;
    while (true) {
      const at = norm.indexOf(t, from);
      if (at === -1) break;
      ranges.push([at, at + t.length]);
      from = at + Math.max(t.length, 1);
    }
  }
  if (!ranges.length) return escapeHtml(raw);

  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of ranges) {
    const lastM = merged[merged.length - 1];
    if (lastM && s <= lastM[1]) lastM[1] = Math.max(lastM[1], e);
    else merged.push([s, e]);
  }

  let html = '';
  let cursor = 0;
  for (const [s, e] of merged) {
    const rs = idxMap[s];
    const re = idxMap[e - 1] + 1;
    if (rs > cursor) html += escapeHtml(raw.slice(cursor, rs));
    html += '<mark>' + escapeHtml(raw.slice(rs, re)) + '</mark>';
    cursor = re;
  }
  html += escapeHtml(raw.slice(cursor));
  return html;
}

/* ── Data Loading ── */
async function loadData() {
  try {
    const res = await fetch(CONFIG.DATA_URL);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();

    // Não descartar ocorrências: agrupamento pertence somente à lista da UI.
    const byKey = new Map();
    allRecords = (data.posts || [])
      .filter(p => p.bodyText && p.bodyText !== '-' && p.bodyText.trim())
      .sort((a, b) => a.position - b.position)
      .map((p) => {
        const parsed = parseAttribution(p.bodyText);
        const quote = cleanQuoteText(parsed.quote);
        return {
          ...p,
          _position: p.position, // número de catálogo imutável (Nº da ficha)
          _groupKey: dedupeKey(p.bodyText),
          _num: padNum(p.position),
          _dateFmt: fmtDate(p.timestamp),
          _dateShort: fmtDateShort(p.timestamp),
          _quote: quote,
          _attr: parsed.attribution,
          _year: new Date(p.timestamp).getFullYear(),
          _lang: detectLang(quote),
          _long: quote.length > 320,
          _low: ' ' + quote.toLowerCase() + ' ',
          _searchText: normalize(p.bodyText),
        };
      });

    recordsByPosition.clear();
    allRecords.forEach(p => {
      recordsByPosition.set(p._position, p);
      if (!byKey.has(p._groupKey)) byKey.set(p._groupKey, p);
    });
    allPosts = [...byKey.values()];
    wordsCache = null;

    authorCounts = {};
    yearCounts = {};
    const authors = new Map(), years = new Map();
    allRecords.forEach(p => {
      const key = p._attr || NO_ATTR;
      if (!authors.has(key)) authors.set(key, new Set());
      authors.get(key).add(p._groupKey);
      if (p._year) {
        if (!years.has(p._year)) years.set(p._year, new Set());
        years.get(p._year).add(p._groupKey);
      }
    });
    authors.forEach((keys, name) => { authorCounts[name] = keys.size; });
    years.forEach((keys, year) => { yearCounts[year] = keys.size; });
    authorsList = Object.entries(authorCounts)
      .filter(([name]) => name !== NO_ATTR)
      .sort((a, b) => b[1] - a[1]);
    yearsList = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);

    renderHero();
    renderYearTrail();
    renderRail();
    applyInitialHash();
    document.documentElement.classList.add('quotes-ready');
  } catch (err) {
    $('#folioText').innerHTML = `
      <p class="empty-state">Não foi possível carregar os dados.<br>
      <small style="font-size:.8rem">Erro: ${escapeHtml(err.message)}</small></p>`;
    console.error('Data load failed:', err);
  }
}

/* ── Interface (av_lang é independente do idioma dos trechos) ── */
const ui = (pt, en) => document.documentElement.lang.startsWith('en') ? en : pt;
const emptyState = () => ({
  word: null, folio: 0, search: '', author: '', year: 0,
  favsOnly: false, lang: 'all', letter: null, sort: 'next',
});
const postAt = (position) => recordsByPosition.get(Number(position));
function announce(text, id = '#resultsStatus') {
  const el = $(id);
  if (el) el.textContent = text;
}
function press(el, on, className = 'on') {
  el.classList.toggle(className, on);
  el.setAttribute('aria-pressed', String(on));
}

/* ── Hero: trecho do dia ── */
function renderHero() {
  if (!allPosts.length) return;
  const isUrl = s => /^\s*https?:\/\//i.test(s) || /\b[\w-]+\.(com|org|net|br|blogspot|html?)\b/i.test(s);
  const pool = allPosts.filter(p => p._quote.trim().length >= 40 &&
    p._quote.trim().length <= 200 && !isUrl(p._quote));
  const src = pool.length ? pool : allPosts;
  const now = new Date();
  const daySeed = now.getFullYear() * 372 + now.getMonth() * 31 + now.getDate();
  const hero = src[daySeed % src.length];
  $('#hero').innerHTML = `
    <button type="button" class="hero-inner hero-open" data-pos="${hero._position}">
      <span class="hero-meta"><span class="hero-label">${ui('Trecho do dia', 'Passage of the day')}</span>
      <span class="hero-num">nº ${hero._num}</span></span>
      <span class="hero-text">${escapeHtml(hero._quote)}</span>
      ${hero._attr ? `<span class="hero-attr">${escapeHtml(hero._attr)}</span>` : ''}
      <span class="hero-date">${hero._dateFmt}</span>
    </button>`;
}
$('#hero').addEventListener('click', e => {
  const button = e.target.closest('button[data-pos]');
  if (button) openOverlay(postAt(button.dataset.pos));
});

/* ── Trilha de anos ── */
function renderYearTrail() {
  const bar = $('#yearTrail');
  yearsList.forEach(y => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'trail-item';
    b.dataset.year = y;
    b.innerHTML = `${y} <small>${yearCounts[y]}</small>`;
    bar.insertBefore(b, $('#chipFavs'));
  });
  $('#chipAllCount').textContent = fmtInt(allPosts.length);
  updateFavCount();
}
$('#yearTrail').addEventListener('click', e => {
  const chip = e.target.closest('.trail-item');
  if (!chip) return;
  if (chip.id === 'chipStats') { toggleStats(); return; }
  if (chip.id === 'chipFavs') {
    state.favsOnly = !state.favsOnly;
    if (state.favsOnly) state.year = 0;
  } else {
    const year = Number(chip.dataset.year || 0);
    state.year = state.year === year ? 0 : year;
    if (state.year) state.favsOnly = false;
  }
  state.folio = 0;
  render();
});

/* ── Índice, autores e idioma dos trechos ── */
function renderRail() {
  const all = wordIndex();
  $('#wordTotal').textContent = all.length ? fmtInt(all.length) + ui(' palavras', ' words') : '';
  $('#drawerTitle').textContent = 'index verborum' + (all.length ? ' · ' + fmtInt(all.length) : '');
  const letterSet = [...new Set(all.map(x => x.w[0]))].sort();
  const lettersHtml = letterSet.map(l =>
    `<button type="button" data-letter="${escapeHtml(l)}">${escapeHtml(l)}</button>`).join('');
  $('#railLetters').innerHTML = lettersHtml;
  $('#drawerLetters').innerHTML = lettersHtml;
  const tagsHtml = `
    <button type="button" class="tag" data-author="">${ui('Todos', 'All')}</button>
    ${authorsList.slice(0, 12).map(([name, count]) =>
      `<button type="button" class="tag" data-author="${escapeHtml(name)}">${escapeHtml(name)} <small>${count}</small></button>`
    ).join('')}`;
  $('#authorTags').innerHTML = tagsHtml;
  $('#drawerAuthors').innerHTML = tagsHtml;
  renderWords();
}
['#railLetters', '#drawerLetters'].forEach(sel => {
  $(sel).addEventListener('click', e => {
    const b = e.target.closest('button[data-letter]');
    if (!b) return;
    state.letter = state.letter === b.dataset.letter ? null : b.dataset.letter;
    renderWords();
    updateHash();
  });
});
['#railWords', '#drawerWords'].forEach(sel => {
  $(sel).addEventListener('click', e => {
    const b = e.target.closest('button[data-word]');
    if (b) openVerbete(b.dataset.word);
  });
});
['#authorTags', '#drawerAuthors'].forEach(sel => {
  $(sel).addEventListener('click', e => {
    const b = e.target.closest('button[data-author]');
    if (!b) return;
    state.author = b.dataset.author || '';
    state.folio = 0;
    closeDrawer();
    render();
  });
});
['#railLangs', '#drawerLangs'].forEach(sel => {
  const group = $(sel);
  if (!group) return;
  group.addEventListener('click', e => {
    const b = e.target.closest('button[data-lang]');
    if (!b || !['all', 'pt', 'en'].includes(b.dataset.lang)) return;
    // Este filtro não escreve av_lang e não troca o idioma da interface.
    state.lang = b.dataset.lang;
    state.folio = 0;
    render();
  });
});
function renderWords() {
  const all = wordIndex();
  const shown = (state.letter ? all.filter(x => x.w[0] === state.letter) : all)
    .slice(0, CONFIG.RAIL_WORDS);
  const html = shown.map(x =>
    `<button type="button" data-word="${escapeHtml(x.w)}" aria-pressed="${state.word === x.w}" class="${state.word === x.w ? 'on' : ''}">${escapeHtml(x.w)}<span>${x.c}</span></button>`
  ).join('');
  $('#railWords').innerHTML = html;
  $('#drawerWords').innerHTML = html;
  $$('#railLetters button, #drawerLetters button').forEach(b => {
    press(b, b.dataset.letter === state.letter);
  });
}

/* Filtrar registros ANTES de agrupar preserva anos, favoritos e aliases.
 * A menor position entre os registros correspondentes representa cada corpo. */
function matchingRecords() {
  const terms = normalize(state.search.trim()).split(/\s+/).filter(Boolean);
  return allRecords.filter(p => {
    if (state.year && p._year !== state.year) return false;
    if (state.author && (p._attr || NO_ATTR) !== state.author) return false;
    if (state.favsOnly && !favs.has(p._position)) return false;
    if (state.lang !== 'all' && p._lang !== state.lang) return false;
    return !terms.length || terms.every(t => p._searchText.includes(t));
  });
}
function filtered() {
  const groups = new Map();
  matchingRecords().forEach(p => {
    if (!groups.has(p._groupKey)) groups.set(p._groupKey, p);
  });
  return [...groups.values()];
}

function render({ syncHash = true } = {}) {
  if (state.word) renderVerbete();
  else renderFolio();
  syncUI();
  if (currentOverlayPost) $('#headFol').textContent = 'nº ' + currentOverlayPost._num;
  if (syncHash) updateHash();
}
const perFolio = () => window.matchMedia('(max-width: 900px)').matches
  ? CONFIG.PER_FOLIO_MOBILE : CONFIG.PER_FOLIO_DESKTOP;

function renderFolio() {
  $('#viewFolio').hidden = false;
  $('#viewVerbete').hidden = true;
  const list = filtered();
  const per = perFolio();
  const pages = Math.max(1, Math.ceil(list.length / per));
  state.folio = Math.max(0, Math.min(state.folio, pages - 1));
  const slice = list.slice(state.folio * per, state.folio * per + per);
  const searching = !!state.search.trim();
  $('#folioText').innerHTML = slice.length ? slice.map((p, i) => {
    let lead = '<span class="pilcrow" aria-hidden="true">¶</span>';
    let body = highlightText(p._quote, state.search);
    if (i === 0 && !searching) {
      const m = body.match(/^([^<]*?)([\p{L}])/u);
      if (m) {
        lead = '';
        body = m[1] + `<span class="capitular">${m[2]}</span>` + body.slice(m[0].length);
      }
    }
    const attr = p._attr
      ? `<span class="entry-author">${escapeHtml(p._attr)}</span>`
      : `<span class="entry-author no-attr">${ui('sem atribuição', 'unattributed')}</span>`;
    return `<button type="button" class="entry${favs.has(p._position) ? ' favd' : ''}" data-pos="${p._position}">${lead}${body} ${attr}<sup> ${p._num}</sup></button>`;
  }).join('') : `<p class="empty-state">${state.favsOnly && !searching && !state.author
    ? ui('Nenhum favorito ainda — toque no coração de um trecho para guardá-lo aqui.', 'No favourites yet — use the heart on a passage to keep it here.')
    : ui('Nenhum trecho encontrado para esta combinação de filtros.', 'No passages match these filters.')}</p>`;
  $('#apparatus').innerHTML = slice.map(p =>
    `<div class="ap-line"><span class="ap-num">${p._num}</span> ${escapeHtml(p._attr || ui('sem atribuição', 'unattributed'))} · ${p._dateShort} · ${p._lang}${p._long ? ui(' · longo', ' · long') : ''}</div>`
  ).join('');
  $('#rangeLabel').textContent = slice.length
    ? ui('entradas ', 'entries ') + slice[0]._num + '–' + slice[slice.length - 1]._num
    : ui('nenhuma entrada', 'no entries');
  $('#totalLabel').textContent = `${fmtInt(list.length)} ${ui('de', 'of')} ${fmtInt(allPosts.length)} ${ui('corpos distintos', 'distinct bodies')}`;
  $('#folLabel').textContent = `fol. ${roman(state.folio + 1)} ${ui('de', 'of')} ${roman(pages)}`;
  const prev = $('#folPrev'), next = $('#folNext');
  prev.textContent = `← fol. ${roman(Math.max(1, state.folio))}`;
  next.textContent = `fol. ${roman(Math.min(pages, state.folio + 2))} →`;
  prev.disabled = state.folio === 0;
  next.disabled = state.folio >= pages - 1;
  $('#headFol').textContent = 'fol. ' + roman(state.folio + 1);
  $('#footMiddle').textContent = searching
    ? `${ui('busca', 'search')}: ${state.search.trim()} · ${fmtInt(list.length)} ${ui('corpos distintos', 'distinct bodies')}`
    : state.lang === 'all' ? ui('pt e en', 'pt and en') : state.lang;
  announce($('#totalLabel').textContent + ' · ' + fmtInt(allRecords.length) +
    ui(' registros não vazios preservados', ' nonempty records preserved'));
}
$('#folioText').addEventListener('click', e => {
  const entry = e.target.closest('button.entry[data-pos]');
  if (entry) openOverlay(postAt(entry.dataset.pos));
});
$('#folPrev').addEventListener('click', () => { state.folio--; render(); });
$('#folNext').addEventListener('click', () => { state.folio++; render(); });

/* ── Concordância: todas as ocorrências de cada corpo da seleção ── */
function wordMatches(text, word) {
  let normalized = '';
  const indexMap = [];
  for (let i = 0; i < text.length; i++) {
    const chars = normalize(text[i]);
    for (let j = 0; j < chars.length; j++) indexMap.push(i);
    normalized += chars;
  }
  const escaped = normalize(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!escaped) return [];
  const rx = new RegExp('(^|[^a-zà-ÿ])(' + escaped + ')(?![a-zà-ÿ])', 'g');
  const matches = [];
  let m;
  while ((m = rx.exec(normalized))) {
    const at = m.index + m[1].length;
    const start = indexMap[at];
    let end = indexMap[at + m[2].length - 1] + 1;
    while (/[\u0300-\u036f]/.test(text[end] || '')) end++;
    matches.push({ start, end });
  }
  return matches;
}
function kwicLines() {
  if (!state.word) return [];
  const rows = [];
  filtered().forEach(p => {
    wordMatches(p._quote, state.word).forEach(({ start: at, end }) => {
      const left = p._quote.slice(0, at);
      const rest = p._quote.slice(end);
      rows.push({
        id: p._position, num: p._num, kw: p._quote.slice(at, end),
        left: left.length > 60 ? '…' + left.slice(-60) : left,
        right: rest.length > 90 ? rest.slice(0, 90) + '…' : rest,
        nextWord: (rest.trim().match(/^[^\s]+/) || [''])[0].toLowerCase(),
        author: p._attr || ui('sem atribuição', 'unattributed'),
        year: p._year, offset: at, post: p,
      });
    });
  });
  rows.sort((a, b) => state.sort === 'ano'
    ? a.year - b.year || a.id - b.id || a.offset - b.offset
    : state.sort === 'autor'
      ? a.author.localeCompare(b.author) || a.id - b.id || a.offset - b.offset
      : a.nextWord.localeCompare(b.nextWord) || a.id - b.id || a.offset - b.offset);
  return rows;
}
function renderVerbete() {
  $('#viewFolio').hidden = true;
  $('#viewVerbete').hidden = false;
  const rows = kwicLines();
  const count = rows.length + ui(' ocorrências em ', ' occurrences in ') +
    new Set(rows.map(k => k.post._groupKey)).size + ui(' corpos distintos', ' distinct bodies');
  $('#verbeteWord').textContent = state.word;
  $('#verbeteCount').textContent = count;
  $$('#verbeteSorts button').forEach(b => press(b, b.dataset.sort === state.sort));
  $('#kwicList').innerHTML = rows.length ? rows.map(k => `
    <button type="button" class="kwic-row" data-pos="${k.id}" data-offset="${k.offset}">
      <span class="kwic-num">${k.num}</span>
      <span class="kwic-left">${escapeHtml(k.left)}</span>
      <span class="kwic-kw">${escapeHtml(k.kw)}</span>
      <span class="kwic-right">${escapeHtml(k.right)}</span>
      <span class="kwic-author">${escapeHtml(k.author)}</span>
    </button>`).join('') : '<p class="empty-state">' +
    ui('Nenhuma ocorrência nesta seleção.', 'No occurrences in this selection.') + '</p>';
  $('#headFol').textContent = ui('verbete · ', 'entry · ') + state.word;
  $('#footMiddle').textContent = count + ' · ' + state.word;
  announce(count);
}
function openVerbete(word) {
  if (!word) return;
  state.word = word;
  state.sort = 'next';
  closeDrawer({ restore: false });
  render();
  $('#verbeteBack').focus();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
$('#verbeteBack').addEventListener('click', () => {
  state.word = null;
  render();
  $('#folNext').disabled ? $('#randomBtn').focus() : $('#folNext').focus();
});
$('#verbeteSorts').addEventListener('click', e => {
  const b = e.target.closest('button[data-sort]');
  if (!b || !['next', 'ano', 'autor'].includes(b.dataset.sort)) return;
  state.sort = b.dataset.sort;
  render();
});
$('#kwicList').addEventListener('click', e => {
  const row = e.target.closest('button.kwic-row[data-pos]');
  if (row) openOverlay(postAt(row.dataset.pos));
});
function syncUI() {
  $$('#yearTrail .trail-item[data-year]').forEach(c =>
    press(c, !state.favsOnly && Number(c.dataset.year) === state.year, 'active'));
  press($('#chipFavs'), state.favsOnly, 'active');
  $$('#authorTags .tag, #drawerAuthors .tag').forEach(t =>
    press(t, t.dataset.author === state.author, 'active'));
  $$('#railLangs button[data-lang], #drawerLangs button[data-lang]').forEach(b =>
    press(b, b.dataset.lang === state.lang));
  $$('#railWords button, #drawerWords button').forEach(b => press(b, b.dataset.word === state.word));
  ['#searchInput', '#drawerSearch'].forEach(sel => {
    if ($(sel).value !== state.search) $(sel).value = state.search;
  });
}

/* ── Hash routing: atalhos legados + filtros combináveis ──
 * Query do hash representa a seleção, sem tocar a query do documento.
 * /n conserva sempre a position do registro, inclusive aliases duplicados. */
function filterHash() {
  let base = '', primary = '';
  if (state.word) { base = '#/palavra/' + encodeURIComponent(state.word); primary = 'word'; }
  else if (state.year) { base = '#/ano/' + state.year; primary = 'year'; }
  else if (state.favsOnly) { base = '#/favs'; primary = 'favs'; }
  else if (state.folio > 0) { base = '#/fol/' + (state.folio + 1); primary = 'folio'; }
  const params = new URLSearchParams();
  if (state.search) params.set('q', state.search);
  if (state.author) params.set('autor', state.author);
  if (state.lang !== 'all') params.set('lang', state.lang);
  if (state.year && primary !== 'year') params.set('ano', state.year);
  if (state.favsOnly && primary !== 'favs') params.set('favs', '1');
  if (state.folio > 0 && primary !== 'folio') params.set('fol', state.folio + 1);
  if (state.word && state.sort !== 'next') params.set('sort', state.sort);
  if (state.letter) params.set('letra', state.letter);
  const query = params.toString();
  return (base || (query ? '#/filtro' : '')) + (query ? '?' + query : '');
}
function routeFromHash(hash) {
  const next = emptyState();
  if (!hash || hash === '#') return { state: next };
  const [path, query = ''] = hash.split('?');
  const params = new URLSearchParams(query);
  let m;
  if ((m = path.match(/^#\/n\/(\d+)$/))) {
    const post = postAt(m[1]);
    return post ? { post } : { state: next, invalid: true };
  }
  if ((m = path.match(/^#\/ano\/(\d{4})$/))) {
    if (!yearCounts[m[1]]) return { state: next, invalid: true };
    next.year = Number(m[1]);
  } else if (path === '#/favs') next.favsOnly = true;
  else if ((m = path.match(/^#\/fol\/(\d+)$/))) next.folio = Math.max(0, Number(m[1]) - 1);
  else if ((m = path.match(/^#\/palavra\/(.+)$/))) {
    try { next.word = decodeURIComponent(m[1]); }
    catch { return { state: next, invalid: true }; }
  } else if (path !== '#/filtro') return { state: next, invalid: true };
  next.search = params.get('q') || '';
  const author = params.get('autor');
  if (author && Object.hasOwn(authorCounts, author)) next.author = author;
  if (['pt', 'en'].includes(params.get('lang'))) next.lang = params.get('lang');
  if (yearCounts[params.get('ano')]) next.year = Number(params.get('ano'));
  if (params.get('favs') === '1') next.favsOnly = true;
  const fol = Number(params.get('fol'));
  if (Number.isSafeInteger(fol) && fol > 0) next.folio = fol - 1;
  if (['next', 'ano', 'autor'].includes(params.get('sort'))) next.sort = params.get('sort');
  if (/^[a-zà-ÿ]$/.test(params.get('letra') || '')) next.letter = params.get('letra');
  return { state: next };
}
function writeHistory(mode, hash, overlayPosition = null, overlayEntry = false) {
  const existing = history.state && typeof history.state === 'object' ? history.state : {};
  history[mode + 'State']({
    ...existing, quotes: { selection: { ...state }, overlayPosition, overlayEntry },
  }, '', location.pathname + location.search + hash);
}
let lastAppliedRoute = '';
const routeSignature = () => location.href + '\n' + JSON.stringify(history.state && history.state.quotes);
function updateHash() {
  if (currentOverlayPost) return;
  writeHistory('replace', filterHash());
}
function applyLocation() {
  if (!allRecords.length) return;
  // Uma travessia entre hashes pode emitir popstate e hashchange. Renderizar
  // duas vezes removeria a ficha que acabou de receber o foco restaurado.
  const route = routeFromHash(location.hash);
  const viewMatches = route.post
    ? currentOverlayPost && currentOverlayPost._position === route.post._position
    : !currentOverlayPost && filterHash() === location.hash;
  if (lastAppliedRoute === routeSignature() && viewMatches) return;
  closingViaHistory = false;
  if (route.post) {
    const saved = history.state && history.state.quotes;
    if (saved && saved.selection) Object.assign(state, emptyState(), saved.selection);
    render({ syncHash: false });
    openOverlay(route.post, { fromHash: true });
  } else {
    const savedFocus = currentOverlayPost ? overlayOpener : null;
    if (currentOverlayPost) closeOverlay({ fromHash: true, restore: false, render: false });
    Object.assign(state, route.state);
    render();
    renderWords();
    if (savedFocus) restoreFocus(savedFocus);
  }
  lastAppliedRoute = routeSignature();
}
function applyInitialHash() { applyLocation(); }
window.addEventListener('hashchange', applyLocation);
window.addEventListener('popstate', applyLocation);

/* ── Favoritos: positions originais, com fallback em memória ── */
function setFavBtn(btn, on) {
  if (!btn) return;
  press(btn, on, 'active');
}
function updateFavCount() {
  if ($('#favCount')) $('#favCount').textContent = [...favs].filter(pos => recordsByPosition.has(pos)).length;
}
function toggleFav(post) {
  const pos = post._position;
  const on = !favs.has(pos);
  if (on) favs.add(pos); else favs.delete(pos);
  const saved = saveFavs();
  setFavBtn($('#overlayFavBtn'), on);
  updateFavCount();
  render();
  announce(saved ? ui('Favoritos atualizados neste navegador.', 'Favourites updated in this browser.')
    : ui('Favoritos disponíveis nesta sessão; armazenamento indisponível.', 'Favourites available for this session; storage is unavailable.'), '#quoteStatus');
}

/* ── Busca e reset ── */
let searchTimer = null;
function setSearch(query) {
  clearTimeout(searchTimer);
  state.search = query;
  state.folio = 0;
  render();
}
['#searchInput', '#drawerSearch'].forEach(sel => {
  $(sel).addEventListener('input', e => {
    const query = e.target.value;
    const other = sel === '#searchInput' ? $('#drawerSearch') : $('#searchInput');
    other.value = query;
    state.search = query;
    state.folio = 0;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => setSearch(query), CONFIG.SEARCH_DEBOUNCE);
  });
  $(sel).addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    setSearch(e.target.value);
    const term = normalize(e.target.value.trim()).split(/\s+/).filter(Boolean)[0];
    if (term) openVerbete(term);
  });
});
function resetFilters() {
  clearTimeout(searchTimer);
  Object.assign(state, emptyState());
  renderWords();
  closeDrawer();
  render();
}
['#resetFilters', '#drawerResetFilters'].forEach(sel => {
  if ($(sel)) $(sel).addEventListener('click', resetFilters);
});

/* ── Dialogs: foco, retorno, inércia e teclado ── */
let activeDialog = null;
let inertSnapshot = [];
let previousOverflow = '';
let overlayOpener = null;
let drawerOpener = null;
function rememberFocus() {
  const el = document.activeElement;
  const card = el && el.closest('[data-pos]');
  return { el, pos: card ? card.dataset.pos : null,
    offset: card ? card.dataset.offset : null,
    hero: !!(el && el.closest('#hero')) };
}
function focusable(dialog) {
  return [...dialog.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')]
    .filter(el => !el.disabled && el.tabIndex >= 0 && !el.closest('[inert]') &&
      el.getClientRects().length > 0);
}
function releaseDialog() {
  inertSnapshot.forEach(([el, inert]) => { el.inert = inert; });
  inertSnapshot = [];
  document.body.style.overflow = previousOverflow;
  activeDialog = null;
}
function engageDialog(dialog) {
  if (activeDialog === dialog) return;
  if (activeDialog) releaseDialog();
  activeDialog = dialog;
  previousOverflow = document.body.style.overflow;
  const container = dialog.id === 'overlayCard' ? $('#overlay') : dialog;
  [...document.body.children].forEach(el => {
    if (el === container || el.tagName === 'SCRIPT') return;
    inertSnapshot.push([el, el.inert]);
    el.inert = true;
  });
  document.body.style.overflow = 'hidden';
}
function restoreFocus(saved) {
  let el = saved && saved.el;
  if (!el || !el.isConnected || !el.getClientRects().length || el.closest('[inert]')) {
    el = null;
    if (saved && saved.pos) {
      el = [...$$('button.entry[data-pos], button.kwic-row[data-pos], #hero button[data-pos]')]
        .find(b => b.dataset.pos === saved.pos &&
          (saved.offset === undefined || saved.offset === null || b.dataset.offset === saved.offset) &&
          (!saved.hero || b.closest('#hero')) && b.getClientRects().length);
    }
  }
  (el || $('#randomBtn')).focus();
}
document.addEventListener('focusin', e => {
  if (activeDialog && !activeDialog.contains(e.target)) {
    const first = focusable(activeDialog)[0] || activeDialog;
    first.focus();
  }
});
document.addEventListener('keydown', e => {
  if (activeDialog && e.key === 'Tab') {
    const items = focusable(activeDialog);
    if (!items.length) { e.preventDefault(); activeDialog.focus(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !activeDialog.contains(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
      e.preventDefault(); first.focus();
    }
    return;
  }
  if (e.key === 'Escape') {
    if (currentOverlayPost) { e.preventDefault(); closeOverlay(); }
    else if (!$('#drawer').hidden) { e.preventDefault(); closeDrawer(); }
    else if (state.word) { state.word = null; render(); $('#randomBtn').focus(); }
    else if (!$('#statsPanel').hidden) toggleStats(false);
    else if (/input|textarea/i.test(e.target.tagName)) e.target.blur();
    return;
  }
  const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    if (currentOverlayPost) return;
    e.preventDefault(); focusSearch(); return;
  }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    if (!$('#drawer').hidden) return;
    const d = e.key === 'ArrowRight' ? 1 : -1;
    e.preventDefault();
    if (currentOverlayPost) shiftOpen(d);
    else if (!state.word) { state.folio += d; render(); }
    return;
  }
  if (e.key === 'r' || e.key === 'R') {
    if ($('#drawer').hidden) sortear();
    return;
  }
  if (e.key === '/' && !currentOverlayPost) { e.preventDefault(); focusSearch(); }
});
function focusSearch() {
  if (window.matchMedia('(max-width: 900px)').matches) openDrawer();
  else $('#searchInput').focus();
}
function sortear() {
  const list = state.word ? [...new Map(kwicLines().map(k => [k.post._groupKey, k.post])).values()] : filtered();
  if (list.length) openOverlay(list[Math.floor(Math.random() * list.length)]);
}
['#randomBtn', '#tbRandom', '#ovSortear'].forEach(sel => $(sel).addEventListener('click', sortear));

/* ── Ficha: texto de exibição + registro bruto preservado ── */
let overlayCloseTimer = null;
let closingViaHistory = false;
let overlayContextHash = '';
function overlaySizeClass(text) {
  const len = (text || '').length;
  return len > 420 ? 'ts-22' : len > 190 ? 'ts-28' : len > 90 ? 'ts-38' : 'ts-52';
}
function fillOverlay(post) {
  $('#ovNum').textContent = 'nº ' + post._num;
  $('#ovBack').textContent = state.word ? ui('← verbete ', '← entry ') + state.word : ui('← fólio', '← folio');
  $('#overlayQuote').textContent = post._quote;
  $('#overlayQuote').className = 'trecho-text ' + overlaySizeClass(post._quote);
  $('#overlayAttr').textContent = post._attr || '';
  $('#overlayMeta').textContent = ui('registrado ', 'recorded ') + post._dateShort + '\n' +
    post._lang + (post._long ? ui(' · longo', ' · long') : ui(' · breve', ' · short'));
  if ($('#overlayPoster')) $('#overlayPoster').textContent =
    ui('Conta de registro no fórum: ', 'Forum posting account: ') + (post.author || ui('não informada', 'not supplied'));
  if ($('#overlayRawText')) $('#overlayRawText').textContent = post.bodyText;
  const inText = wordIndex().filter(x =>
    new RegExp('(^|[^a-zà-ÿ])' + x.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-zà-ÿ]|$)').test(post._low)
  ).slice(0, 5);
  $('#overlayWordsWrap').hidden = !inText.length;
  $('#overlayWords').innerHTML = inText.map(x =>
    `<button type="button" data-word="${escapeHtml(x.w)}">${escapeHtml(x.w)} ${x.c}</button>`).join('');
  setFavBtn($('#overlayFavBtn'), favs.has(post._position));
  $('#headFol').textContent = 'nº ' + post._num;
}
function openOverlay(post, opts = {}) {
  if (!post) return;
  clearTimeout(searchTimer);
  const wasOpen = !!currentOverlayPost;
  if (!wasOpen) {
    overlayOpener = rememberFocus();
    overlayContextHash = filterHash();
    closeDrawer({ restore: false });
  }
  clearTimeout(overlayCloseTimer);
  overlayCloseTimer = null;
  currentOverlayPost = post;
  const overlay = $('#overlay');
  overlay.inert = false;
  overlay.setAttribute('aria-hidden', 'false');
  if (!opts.fromHash) {
    writeHistory(wasOpen ? 'replace' : 'push', '#/n/' + post._position, post._position, true);
  }
  fillOverlay(post);
  if (!wasOpen && $('#overlayRaw')) $('#overlayRaw').open = false;
  announce('', '#quoteStatus');
  overlay.classList.add('active');
  void overlay.offsetHeight;
  overlay.classList.add('visible');
  engageDialog($('#overlayCard'));
  overlay.querySelector('.overlay-scroll').scrollTop = 0;
  if (!wasOpen) $('#closeOverlay').focus();
}
function closeOverlay(opts = {}) {
  if (!currentOverlayPost) return;
  if (!opts.fromHash && history.state && history.state.quotes &&
      history.state.quotes.overlayEntry && /^#\/n\//.test(location.hash)) {
    if (!closingViaHistory) { closingViaHistory = true; history.back(); }
    return;
  }
  const overlay = $('#overlay');
  currentOverlayPost = null;
  closingViaHistory = false;
  overlay.classList.remove('visible');
  releaseDialog();
  overlay.inert = true;
  overlay.setAttribute('aria-hidden', 'true');
  if (!opts.fromHash) writeHistory('replace', overlayContextHash);
  if (opts.render !== false) render({ syncHash: !opts.fromHash });
  if (opts.restore !== false) restoreFocus(overlayOpener);
  clearTimeout(overlayCloseTimer);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  overlayCloseTimer = setTimeout(() => {
    overlay.classList.remove('active');
    overlayCloseTimer = null;
  }, reduced ? 0 : CONFIG.OVERLAY_EXIT_MS);
}
function shiftOpen(d) {
  const list = state.word ? [...new Map(kwicLines().map(k => [k.post._groupKey, k.post])).values()] : filtered();
  if (!list.length || !currentOverlayPost) return;
  const i = list.findIndex(p => p._groupKey === currentOverlayPost._groupKey);
  const index = i < 0 ? (d > 0 ? 0 : list.length - 1) : (i + d + list.length) % list.length;
  openOverlay(list[index]);
}
$('#closeOverlay').addEventListener('click', () => closeOverlay());
$('#ovBack').addEventListener('click', () => closeOverlay());
$('#overlay').addEventListener('click', e => {
  if (e.target === $('#overlay') || e.target.classList.contains('overlay-bg')) closeOverlay();
});
$('#prevRandom').addEventListener('click', () => shiftOpen(-1));
$('#nextRandom').addEventListener('click', () => shiftOpen(1));
$('#overlayWords').addEventListener('click', e => {
  const b = e.target.closest('button[data-word]');
  if (!b) return;
  const word = b.dataset.word;
  // Esta ação muda de vista deliberadamente: não reativar o contexto anterior.
  closeOverlay({ fromHash: true });
  state.word = word;
  state.sort = 'next';
  render();
  $('#verbeteBack').focus();
  window.scrollTo({ top: 0, behavior: 'auto' });
});
async function copyValue(text, link) {
  try {
    await navigator.clipboard.writeText(text);
    announce(link ? ui('Link copiado.', 'Link copied.') : ui('Texto original copiado.', 'Original text copied.'), '#quoteStatus');
  } catch {
    announce(ui('Não foi possível copiar. O texto original e o endereço da ficha continuam disponíveis.',
      'Copying was unavailable. The original text and the record address remain available.'), '#quoteStatus');
  }
}
$('#copyBtn').addEventListener('click', () => {
  if (currentOverlayPost) copyValue(currentOverlayPost.bodyText, false);
});
$('#copyLinkBtn').addEventListener('click', () => {
  if (currentOverlayPost) copyValue(location.origin + location.pathname + '#/n/' + currentOverlayPost._position, true);
});
$('#overlayFavBtn').addEventListener('click', () => {
  if (currentOverlayPost) toggleFav(currentOverlayPost);
});

/* ── Prancha: contagens da apresentação, registros mantidos no catálogo ── */
function renderStats() {
  $('#statsNumbers').innerHTML = [
    [fmtInt(allPosts.length), ui('corpos distintos', 'distinct bodies')],
    [fmtInt(allRecords.length), ui('registros não vazios', 'nonempty records')],
    [yearsList.length, ui('anos de registro', 'recording years')],
    [[...favs].filter(pos => recordsByPosition.has(pos)).length, ui('registros favoritos', 'favourite records')],
  ].map(([v, l]) => `<div class="stat-item"><span class="stat-value">${v}</span><span class="stat-label">${l}</span></div>`).join('');
  const max = Math.max(1, ...yearsList.map(y => yearCounts[y]));
  $('#yearBars').innerHTML = yearsList.map(y =>
    `<div class="year-bar" role="img" aria-label="${y}: ${yearCounts[y]} ${ui('corpos distintos', 'distinct bodies')}" title="${y} · ${yearCounts[y]}" style="--h:${Math.max(3, Math.round(yearCounts[y] / max * 100))}%" data-count="${yearCounts[y]}"></div>`
  ).join('');
  $('#statsAuthors').innerHTML = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 20)
    .map(([name, count]) =>
      `<button type="button" class="tag" data-author="${escapeHtml(name)}">${escapeHtml(name)} <small>${count}</small></button>`).join('');
  const byLen = [...allPosts].sort((a, b) => b._quote.length - a._quote.length);
  $('#statsExtremes').innerHTML = [
    [ui('Mais longo', 'Longest'), byLen[0]], [ui('Mais curto', 'Shortest'), byLen[byLen.length - 1]],
  ].filter(([, p]) => p).map(([label, p]) =>
    `<button type="button" class="tag" data-pos="${p._position}">${label} · Nº ${p._num} · ${p._quote.length} ${ui('car.', 'chars')}</button>`).join('');
}
function toggleStats(force) {
  const panel = $('#statsPanel');
  const show = force !== undefined ? force : panel.hidden;
  panel.hidden = !show;
  $('#chipStats').classList.toggle('active', show);
  $('#chipStats').setAttribute('aria-expanded', String(show));
  if (show) { renderStats(); $('#statsClose').focus(); }
  else $('#chipStats').focus();
}
$('#statsClose').addEventListener('click', () => toggleStats(false));
$('#statsAuthors').addEventListener('click', e => {
  const b = e.target.closest('button[data-author]');
  if (!b) return;
  state.author = b.dataset.author;
  state.folio = 0;
  toggleStats(false);
  render();
});
$('#statsExtremes').addEventListener('click', e => {
  const b = e.target.closest('button[data-pos]');
  if (b) openOverlay(postAt(b.dataset.pos));
});

/* ── Gaveta móvel ── */
function openDrawer() {
  if (currentOverlayPost) return;
  if ($('#drawer').hidden) drawerOpener = rememberFocus();
  $('#drawer').hidden = false;
  $('#tbWords').setAttribute('aria-expanded', 'true');
  engageDialog($('#drawer'));
  $('#drawerSearch').focus();
}
function closeDrawer({ restore = true } = {}) {
  if ($('#drawer').hidden) return;
  $('#drawer').hidden = true;
  $('#tbWords').setAttribute('aria-expanded', 'false');
  if (activeDialog === $('#drawer')) releaseDialog();
  if (restore) restoreFocus(drawerOpener);
}
$('#tbWords').addEventListener('click', () => $('#drawer').hidden ? openDrawer() : closeDrawer());
$('#tbFolio').addEventListener('click', () => {
  closeDrawer({ restore: false });
  state.word = null;
  render();
  $('#tbFolio').focus();
  window.scrollTo({ top: 0, behavior: 'auto' });
});
$('#drawerClose').addEventListener('click', () => closeDrawer());
$('#tbWords').setAttribute('aria-expanded', 'false');
$('#tbWords').setAttribute('aria-controls', 'drawer');
$('#overlay').setAttribute('aria-hidden', 'true');
$('#overlay').inert = true;

/* ── Tema e sincronização local protegida ── */
$('#themeBtn').addEventListener('click', () => {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  storageSet('theme', next);
});
function restoreTheme() {
  const saved = storageGet('theme');
  if (saved === 'dark' || saved === 'light') document.documentElement.setAttribute('data-theme', saved);
}
function restoreFavs() {
  try {
    const arr = JSON.parse(localStorage.getItem(CONFIG.FAVS_KEY) || '[]');
    if (Array.isArray(arr)) favs = new Set(arr.filter(Number.isFinite));
  } catch { /* preservar favoritos em memória se o armazenamento for negado */ }
  updateFavCount();
}
function refreshInterface() {
  if (!allRecords.length) return;
  renderHero();
  renderRail();
  render();
  if (!$('#statsPanel').hidden) renderStats();
  if (currentOverlayPost) fillOverlay(currentOverlayPost);
}
window.addEventListener('av:lang', refreshInterface);
window.addEventListener('storage', e => {
  if (e.key === CONFIG.FAVS_KEY || e.key === null) {
    restoreFavs();
    render();
    if (currentOverlayPost) setFavBtn($('#overlayFavBtn'), favs.has(currentOverlayPost._position));
  }
  if (e.key === 'theme' || e.key === null) restoreTheme();
});
window.addEventListener('pageshow', () => {
  restoreTheme();
  if (!allRecords.length) return;
  restoreFavs();
  refreshInterface();
});
const narrowScreen = window.matchMedia('(max-width: 900px)');
narrowScreen.addEventListener('change', () => {
  if (!narrowScreen.matches) closeDrawer({ restore: false });
  if (allRecords.length) render();
});
restoreTheme();
loadData();
