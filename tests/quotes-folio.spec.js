const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// These fixtures were independently recounted from the unmodified source JSON.
// Tests exercise the public UI; they do not import the implementation's helpers.
const dataPath = path.resolve(__dirname, '../quotes/forum-data.json');
const DATA_SHA256 = '2acb5dabe17d99cd4d32aba7b883b8618de898b2ca4e6553f6ff06b4ab281c57';
const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8')).posts;
const byPosition = new Map(posts.map(post => [post.position, post]));
const heartPositions = [182, 437, 852, 1033, 1241, 1257, 1288, 1299, 1316, 1490];
const runs = new WeakMap();
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

test.beforeEach(async ({ context, page, baseURL, browser }, testInfo) => {
  const origin = new URL(baseURL).origin;
  const run = { allowed: [], blocked: [], errors: [], browser: browser.version() };
  runs.set(context, run);
  expect(await context.cookies(), 'Fresh contexts inherit no user cookies').toEqual([]);
  page.on('pageerror', error => run.errors.push(error.message));
  context.on('page', other => other.on('pageerror', error => run.errors.push(error.message)));
  await context.routeWebSocket('**/*', socket => socket.close());
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    const api = /\/(?:api|_state)(?:\/|$)/.test(url.pathname);
    if (url.origin !== origin || request.method() !== 'GET' || api) {
      run.blocked.push({ method: request.method(), url: url.href, api });
      return route.abort('blockedbyclient');
    }
    const headers = { ...request.headers() };
    delete headers.cookie;
    delete headers.authorization;
    run.allowed.push({ method: request.method(), path: url.pathname });
    return route.continue({ headers });
  });
  await context.addInitScript(() => {
    // Per-context mock: never read or overwrite the user's system clipboard.
    window.__copiedTexts = [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async text => { window.__copiedTexts.push(text); },
    } });
    window.__quotesRouteEvents = [];
    for (const type of ['popstate', 'hashchange']) window.addEventListener(type, () => {
      window.__quotesRouteEvents.push({ type, hash: location.hash,
        history: history.state && history.state.quotes,
        focused: { tag: document.activeElement?.tagName, id: document.activeElement?.id,
          position: document.activeElement?.dataset.pos } });
    });
  });
  await testInfo.attach('actual-browser', { body: run.browser, contentType: 'text/plain' });
});

test.afterEach(async ({ context, page }, testInfo) => {
  const run = runs.get(context);
  if (!run) return;
  if (testInfo.status !== testInfo.expectedStatus && !page.isClosed()) {
    run.failureState = await page.evaluate(() => ({ hash: location.hash,
      history: history.state && history.state.quotes,
      focused: { tag: document.activeElement?.tagName, id: document.activeElement?.id,
        position: document.activeElement?.dataset.pos },
      overlay: document.querySelector('#overlay')?.className,
      routeEvents: window.__quotesRouteEvents }));
  }
  await testInfo.attach('network-and-runtime', {
    body: JSON.stringify(run, null, 2), contentType: 'application/json',
  });
  expect(run.errors, 'No uncaught application errors').toEqual([]);
  expect(run.blocked.filter(request => request.method !== 'GET'), 'No HTTP writes were even attempted').toEqual([]);
  expect(run.allowed.every(request => request.method === 'GET'), 'Guard released only static local GETs').toBe(true);
  expect(digest(fs.readFileSync(dataPath)), 'UI interactions never alter source records').toBe(DATA_SHA256);
});

async function visit(page, width = 1440, hash = '') {
  await page.setViewportSize({ width, height: 960 });
  const response = await page.goto('/quotes/' + hash, { waitUntil: 'load' });
  if (response) expect(response.status()).toBe(200);
  else await expect(page).toHaveURL(url => url.pathname === '/quotes/' && url.hash === hash);
  await expect(page.locator('html')).toHaveClass(/quotes-ready/);
  await expect(page.locator('#folioText')).not.toHaveText('');
}

const entries = page => page.locator('#folioText .entry[data-pos]');
async function positions(page, selector = '#folioText .entry[data-pos]') {
  return page.locator(selector).evaluateAll(elements => elements.map(element => Number(element.dataset.pos)));
}
async function filteredSearch(page, width, value, lang = null) {
  const mobile = width <= 900;
  if (mobile) await page.locator('#tbWords').click();
  const field = page.locator(mobile ? '#drawerSearch' : '#searchInput');
  await expect(field).toBeVisible();
  await field.fill(value);
  if (lang) await page.locator(`${mobile ? '#drawerLangs' : '#railLangs'} [data-lang="${lang}"]`).click();
  await expect(page.locator('#footMiddle')).toContainText(value);
  if (mobile) await page.locator('#drawerClose').click();
}
async function clearFilters(page, width) {
  if (width <= 900) {
    await page.locator('#tbWords').click();
    await page.locator('#drawerResetFilters').click();
    if (await page.locator('#drawer').isVisible()) await page.locator('#drawerClose').click();
  } else await page.locator('#resetFilters').click();
  await expect(page.locator('#totalLabel')).toContainText('1.580');
}
async function opened(page, position) {
  await expect(page.locator('#overlayCard')).toBeVisible();
  await expect(page.locator('#ovNum')).toHaveText(new RegExp(`\\b0*${position}$`));
  await expect(page).toHaveURL(url => url.hash === '#/n/' + position);
}
async function closed(page) {
  await expect(page.locator('#overlayCard')).not.toBeVisible();
}
async function noOverflow(page) {
  const metrics = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth,
    beyondViewport: [...document.querySelectorAll('body *')].filter(element => element.getClientRects().length)
      .map(element => { const rect = element.getBoundingClientRect(); return {
        tag: element.tagName, id: element.id, class: String(element.className).slice(0, 100),
        left: rect.left, right: rect.right, width: rect.width,
      }; }).filter(rect => rect.right > innerWidth + 1 || rect.left < -1).slice(0, 20) }));
  if (metrics.scroll > metrics.width + 1) await test.info().attach('overflow-elements', {
    body: JSON.stringify(metrics, null, 2), contentType: 'application/json',
  });
  expect(metrics.scroll, 'Document remains within the viewport').toBeLessThanOrEqual(metrics.width + 1);
}
async function keyboardReach(page, locator) {
  for (let step = 0; step < 100; step++) {
    await page.keyboard.press('Tab');
    if (await locator.evaluate(element => element === document.activeElement)) return;
  }
  throw new Error('Native Tab could not reach the requested control');
}
async function expectFocusInside(page, selector) {
  expect(await page.evaluate(sel => !!document.querySelector(sel)?.contains(document.activeElement), selector),
    'Keyboard focus stays inside the open dialog').toBe(true);
}

test('immutable catalog preserves all positions, raw duplicate occurrences and counts', async ({ page }) => {
  expect(digest(fs.readFileSync(dataPath))).toBe(DATA_SHA256);
  expect(posts).toHaveLength(1636);
  expect(posts.map(post => post.position)).toEqual(Array.from({ length: 1636 }, (_, i) => i + 1));
  const nonempty = posts.filter(post => post.bodyText.trim() && post.bodyText !== '-');
  expect(nonempty).toHaveLength(1608);
  // Independent editorial equivalence count, separate from the runtime model.
  const presentations = new Set(nonempty.map(post => post.bodyText.normalize('NFD')
    .replace(/\p{M}/gu, '').toLocaleLowerCase('en').replace(/\s+/gu, ' ').trim()));
  expect(presentations.size).toBe(1580);
  expect(byPosition.get(716).bodyText).toBe(byPosition.get(17).bodyText);
  expect(byPosition.get(716).timestamp).not.toBe(byPosition.get(17).timestamp);
  await visit(page);
  await expect(page.locator('#chipAllCount')).toHaveText('1.580');
  const response = await page.request.get('/quotes/forum-data.json');
  expect(response.status()).toBe(200);
  expect(digest(await response.body()), 'Server serves the original JSON bytes').toBe(DATA_SHA256);
});

for (const width of [320, 390, 1440]) {
  test(`${width}px pagination preserves catalog numbers and returns to the original folio`, async ({ page }) => {
    await visit(page, width);
    const count = width <= 900 ? 7 : 14;
    await expect(entries(page)).toHaveCount(count);
    const first = await positions(page);
    await expect(page.locator('#folPrev')).toBeDisabled();
    await page.locator('#folNext').click();
    await expect(entries(page)).toHaveCount(count);
    const next = await positions(page);
    expect(next.every(position => !first.includes(position))).toBe(true);
    expect(next[0]).toBeGreaterThan(first.at(-1));
    await page.locator('#folPrev').click();
    expect(await positions(page)).toEqual(first);
    await noOverflow(page);
  });

  test(`${width}px accented search, content language, empty results and clear filters`, async ({ page }) => {
    await visit(page, width);
    await filteredSearch(page, width, 'coração', 'pt');
    const expected = heartPositions.slice(0, width <= 900 ? 7 : 14);
    await expect.poll(() => positions(page)).toEqual(expected);
    await filteredSearch(page, width, 'coracao', 'pt');
    await expect.poll(() => positions(page)).toEqual(expected);
    await filteredSearch(page, width, 'zzq_sem_resultado_937');
    await expect(entries(page)).toHaveCount(0);
    await expect(page.locator('#folioText .empty-state')).toBeVisible();
    await clearFilters(page, width);
    await expect(entries(page)).toHaveCount(width <= 900 ? 7 : 14);
    await noOverflow(page);
  });

  test(`${width}px native cards support Tab, Enter/Space, focus trap and Escape restoration`, async ({ page }) => {
    await visit(page, width);
    const first = entries(page).first();
    expect(await first.evaluate(element => element.tagName)).toBe('BUTTON');
    const position = Number(await first.getAttribute('data-pos'));
    await keyboardReach(page, first);
    await expect(first).toBeFocused();
    await page.keyboard.press('Enter');
    await opened(page, position);
    for (let step = 0; step < 20; step++) {
      await page.keyboard.press(step < 10 ? 'Tab' : 'Shift+Tab');
      await expectFocusInside(page, '#overlayCard');
    }
    await page.keyboard.press('Escape');
    await closed(page);
    await expect(entries(page).first()).toBeFocused();
    await page.keyboard.press('Space');
    await opened(page, position);
    await page.keyboard.press('Escape');
    await closed(page);
    await expect(entries(page).first()).toBeFocused();
    await noOverflow(page);
  });

  test(`${width}px verbete KWIC sorting retains occurrences and returns to folio`, async ({ page }) => {
    await visit(page, width);
    await filteredSearch(page, width, 'coração', 'pt');
    if (width <= 900) await page.locator('#tbWords').click();
    const search = page.locator(width <= 900 ? '#drawerSearch' : '#searchInput');
    await search.focus();
    await search.press('Enter');
    await expect(page.locator('#viewVerbete')).toBeVisible();
    await expect(page.locator('#verbeteWord')).toHaveText('coracao');
    const kwic = page.locator('#kwicList .kwic-row');
    await expect(kwic).not.toHaveCount(0);
    const ids = (await positions(page, '#kwicList .kwic-row')).sort((a, b) => a - b);
    const count = await kwic.count();
    for (const sort of ['ano', 'autor', 'next']) {
      await page.locator(`#verbeteSorts [data-sort="${sort}"]`).click();
      await expect(page.locator(`#verbeteSorts [data-sort="${sort}"]`)).toHaveAttribute('aria-pressed', 'true');
      expect((await positions(page, '#kwicList .kwic-row')).sort((a, b) => a - b)).toEqual(ids);
      await expect(kwic).toHaveCount(count);
      if (sort === 'ano') {
        const years = (await positions(page, '#kwicList .kwic-row'))
          .map(position => new Date(byPosition.get(position).timestamp).getUTCFullYear());
        expect(years, 'Year sort orders source timestamps chronologically').toEqual([...years].sort((a, b) => a - b));
      } else {
        const ordered = await kwic.evaluateAll((rows, kind) => {
          const labels = rows.map(row => kind === 'autor'
            ? row.querySelector('.kwic-author').textContent
            : (row.querySelector('.kwic-right').textContent.trim().match(/^\S+/) || [''])[0].toLowerCase());
          return labels.every((label, index) => !index || labels[index - 1].localeCompare(label) <= 0);
        }, sort);
        expect(ordered, `${sort} sort visibly orders concordance labels`).toBe(true);
      }
    }
    await kwic.first().click();
    await expect(page.locator('#overlayCard')).toBeVisible();
    await page.locator('#ovBack').click();
    await closed(page);
    await expect(page.locator('#viewVerbete')).toBeVisible();
    await page.locator('#verbeteBack').click();
    await expect(page.locator('#viewFolio')).toBeVisible();
    await noOverflow(page);
  });

  test(`${width}px native navigation and interface PT/EN retain distinct content filters`, async ({ page }) => {
    await visit(page, width);
    const destinations = ['/', '/quotes/', '/metodologia/', '/quotes/admin'];
    const links = page.locator('header .quotes-brand, header .quotes-nav a');
    expect(await links.evaluateAll(elements => elements.map(element => element.getAttribute('href')))).toEqual(destinations);
    await expect(page.locator('.quotes-nav [aria-current="page"]')).toHaveCount(1);
    for (const lang of ['en', 'pt']) {
      await page.locator(`.quotes-interface-lang [data-lang="${lang}"]`).click();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
      await expect(page.locator('.quotes-nav a[href="/metodologia/"]')).toHaveText(lang === 'en' ? 'Method' : 'Método');
      expect(await page.evaluate(() => localStorage.getItem('av_lang'))).toBe(lang);
      await page.reload();
      await expect(page.locator('html')).toHaveClass(/quotes-ready/);
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
    }
    for (const link of await links.all()) {
      await keyboardReach(page, link);
      await expect(link).toBeFocused();
      expect(await link.evaluate(element => element.matches(':focus-visible'))).toBe(true);
      const box = await link.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
    await noOverflow(page);
    // Follow each destination through a native focused anchor, not location.assign.
    for (const destination of ['/metodologia/', '/quotes/admin', '/', '/quotes/']) {
      await visit(page, width);
      const anchor = page.locator(`header a[href="${destination}"]`).first();
      await anchor.focus();
      const response = await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        anchor.press('Enter'),
      ]);
      expect(response[0].status(), `Native destination ${destination}`).toBe(200);
      await expect(page).toHaveURL(url => destination === '/quotes/admin'
        ? /\/quotes\/admin(?:\.html)?$/.test(url.pathname) : url.pathname === destination);
    }
  });
}

test('combinatorial author/search/language filters and random all respect the same selection', async ({ page }) => {
  await visit(page);
  await filteredSearch(page, 1440, 'love', 'en');
  await page.locator('#authorTags [data-author="Charles Bukowski"]').click();
  await expect.poll(() => positions(page)).toEqual([614]);
  for (let attempt = 0; attempt < 4; attempt++) {
    await page.locator(attempt ? '#ovSortear' : '#randomBtn').click();
    const position = Number((await page.locator('#ovNum').innerText()).match(/\d+/)[0]);
    expect([614]).toContain(position);
    await opened(page, position);
  }
  await page.keyboard.press('Escape');
  await closed(page);
  await page.locator('#railLangs [data-lang="pt"]').click();
  await expect(entries(page)).toHaveCount(0);
  await expect(page.locator('#folioText .empty-state')).toBeVisible();
  await clearFilters(page, 1440);
  await expect(entries(page)).toHaveCount(14);
});

test('permalinks #70 and #716 show exact raw occurrences, dates and lossless copy/share', async ({ page }) => {
  for (const [position, date] of [[70, '19.07.2014'], [716, '27.09.2014'], [17, '19.07.2014']]) {
    await visit(page, 390, '#/n/' + position);
    await opened(page, position);
    await expect(page.locator('#overlayMeta')).toContainText(date);
    if (!await page.locator('#overlayRawText').isVisible()) await page.locator('#overlayRaw summary').click();
    expect(await page.locator('#overlayRawText').textContent()).toBe(byPosition.get(position).bodyText);
    await expect(page.locator('#overlayRawText')).toBeVisible();
    await page.locator('#copyBtn').click();
    await expect.poll(() => page.evaluate(() => window.__copiedTexts.at(-1))).toBe(byPosition.get(position).bodyText);
    await page.locator('#copyLinkBtn').click();
    await expect.poll(() => page.evaluate(() => window.__copiedTexts.at(-1)))
      .toBe(new URL('/quotes/#/n/' + position, page.url()).href);
  }
});

test('Back closes a native-opened modal and Forward reopens the same occurrence', async ({ page }) => {
  await visit(page, 390);
  const first = entries(page).first();
  const position = Number(await first.getAttribute('data-pos'));
  await first.click();
  await opened(page, position);
  await page.goBack();
  await closed(page);
  await expect(entries(page).first()).toBeFocused();
  await page.goForward();
  await opened(page, position);
  await expectFocusInside(page, '#overlayCard');
});

test('a duplicate occurrence favorited at #716 survives reload and remains #716 in filtered presentation', async ({ page }) => {
  await visit(page, 390, '#/n/716');
  await page.locator('#overlayFavBtn').click();
  await expect(page.locator('#overlayFavBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/quotes-ready/);
  await opened(page, 716);
  await expect(page.locator('#overlayFavBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await closed(page);
  await page.locator('#chipFavs').click();
  await expect.poll(() => positions(page)).toEqual([716]);
  await entries(page).first().click();
  await opened(page, 716);
  await expect(page.locator('#overlayMeta')).toContainText('27.09.2014');
  await page.locator('#overlayFavBtn').click();
  await page.keyboard.press('Escape');
  await closed(page);
  await expect(entries(page)).toHaveCount(0);
});

for (const width of [320, 390]) {
  test(`${width}px drawer traps/restores focus and content PT/EN does not rewrite interface language`, async ({ page }) => {
    await visit(page, width);
    await page.locator('.quotes-interface-lang [data-lang="en"]').click();
    await page.locator('#tbWords').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#drawer')).toBeVisible();
    for (let step = 0; step < 12; step++) {
      await page.keyboard.press(step < 6 ? 'Tab' : 'Shift+Tab');
      await expectFocusInside(page, '#drawer');
    }
    for (const lang of ['pt', 'en']) {
      await page.locator(`#drawerLangs [data-lang="${lang}"]`).click();
      await expect(page.locator(`#drawerLangs [data-lang="${lang}"]`)).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator(`#railLangs [data-lang="${lang}"]`)).toHaveAttribute('aria-pressed', 'true');
      expect(await page.evaluate(() => localStorage.getItem('av_lang'))).toBe('en');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    }
    await page.keyboard.press('Escape');
    await expect(page.locator('#drawer')).not.toBeVisible();
    await expect(page.locator('#tbWords')).toBeFocused();
    await noOverflow(page);
  });
}

test('storage denied leaves catalog, drawer, theme, favorite and modal usable', async ({ context, page }) => {
  await context.addInitScript(() => Object.defineProperty(window, 'localStorage', {
    configurable: true, get() { throw new DOMException('Storage denied by test', 'SecurityError'); },
  }));
  await visit(page, 320);
  await page.locator('#themeBtn').click();
  await filteredSearch(page, 320, 'coração', 'pt');
  await expect(entries(page)).toHaveCount(7);
  await entries(page).first().click();
  await page.locator('#overlayFavBtn').click();
  await expect(page.locator('#overlayFavBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await closed(page);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/quotes-ready/);
  await expect(entries(page)).toHaveCount(7);
});

test('clipboard rejection cannot break modal navigation or focus restoration', async ({ context, page }) => {
  await context.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true, value: { writeText: async () => { throw new DOMException('Clipboard denied by test', 'NotAllowedError'); } },
  }));
  await visit(page, 390);
  const position = Number(await entries(page).first().getAttribute('data-pos'));
  await entries(page).first().click();
  await page.locator('#copyBtn').click();
  await page.locator('#copyLinkBtn').click();
  await opened(page, position);
  await page.locator('#nextRandom').click();
  await expect(page.locator('#ovNum')).not.toHaveText(new RegExp(`\\b0*${position}$`));
  await page.keyboard.press('Escape');
  await closed(page);
  await expect(entries(page).first()).toBeFocused();
});

test('hero is a native button and works with keyboard Space', async ({ page }) => {
  await visit(page);
  const hero = page.locator('#hero button, button#hero').first();
  await expect(hero).toBeVisible();
  await keyboardReach(page, hero);
  await page.keyboard.press('Space');
  await expect(page.locator('#overlayCard')).toBeVisible();
  await page.keyboard.press('Escape');
  await closed(page);
  await expect(hero).toBeFocused();
});

test('Registro saves and exports only a local Unicode draft, then restores it on reload', async ({ page, context }) => {
  const response = await page.goto('/quotes/admin.html');
  expect(response.status()).toBe(200);
  await expect(page.locator('#formHelp')).toContainText('não publica');
  await expect(page.locator('#submitBtn')).toBeDisabled();
  const text = 'Rascunho de teste — coração, Anaïs e pesquisa jurídica. Não publicar.';
  await page.locator('#quoteInput').fill(text);
  await page.locator('#attrInput').fill('Atribuição de teste');
  await page.locator('#dateInput').fill('2026-10-04');
  await expect(page.locator('#previewQuote')).toHaveText(text);
  await expect(page.locator('#previewAttr')).toHaveText('Atribuição de teste');
  await expect(page.locator('#assignNum')).toHaveText('1637');
  await page.locator('#submitBtn').click();
  expect(await page.evaluate(() => localStorage.getItem('trechos:registro:rascunho:v1'))).not.toBeNull();
  await page.reload();
  await expect(page.locator('#quoteInput')).toHaveValue(text);
  await expect(page.locator('#attrInput')).toHaveValue('Atribuição de teste');
  await expect(page.locator('#dateInput')).toHaveValue('2026-10-04');
  const downloading = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const draft = JSON.parse(fs.readFileSync(await (await downloading).path(), 'utf8'));
  expect(draft.status).toBe('draft');
  expect(draft.suggestedPosition).toBe(1637);
  expect(draft.post.bodyText).toContain(text);
  expect(draft.post.bodyText).toContain('Atribuição de teste');
  expect(runs.get(context).blocked, 'Registro never attempts API, authentication, or HTTP writes').toEqual([]);
  await page.locator('#clearBtn').click();
  await expect(page.locator('#quoteInput')).toHaveValue('');
});

test('Registro rejects an existing exact raw quote as a new draft', async ({ page }) => {
  await page.goto('/quotes/admin.html');
  await expect(page.locator('#assignNum')).toHaveText('1637');
  await page.locator('#quoteInput').fill(byPosition.get(716).bodyText);
  await expect(page.locator('#dupWarning')).toBeVisible();
  await expect(page.locator('#submitBtn')).toBeDisabled();
  await expect(page.locator('#exportBtn')).toBeDisabled();
});

test('Registro storage denial is reported and a local file can still be exported', async ({ context, page }) => {
  await context.addInitScript(() => Object.defineProperty(window, 'localStorage', {
    configurable: true, get() { throw new DOMException('Storage denied by test', 'SecurityError'); },
  }));
  await page.goto('/quotes/admin.html');
  await expect(page.locator('#assignNum')).toHaveText('1637');
  await page.locator('#quoteInput').fill('Rascunho local para teste de armazenamento bloqueado, sem publicação.');
  await page.locator('#submitBtn').click();
  await expect(page.locator('#statusBox')).toBeVisible();
  await expect(page.locator('#statusBox')).toContainText(/armazen|navegador|salv/i);
  const downloading = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const draft = JSON.parse(fs.readFileSync(await (await downloading).path(), 'utf8'));
  expect(draft.status).toBe('draft');
});

test('Registro catalog failure keeps a clearly unverified local draft available', async ({ context, page }) => {
  await context.route('**/quotes/forum-data.json', route => route.fulfill({ status: 503, body: 'Unavailable for test' }));
  await page.goto('/quotes/admin.html');
  await expect(page.locator('#catalogStatus')).toContainText(/não|indispon|falha/i);
  await page.locator('#quoteInput').fill('Prévia de teste sem catálogo; somente rascunho local.');
  await expect(page.locator('#submitBtn')).toBeEnabled();
  await page.locator('#submitBtn').click();
  await expect(page.locator('#statusBox')).toBeVisible();
});

test('Registro rejects a malformed catalog without losing the local draft path', async ({ context, page }) => {
  await context.route('**/quotes/forum-data.json', route => route.fulfill({ status: 200,
    contentType: 'application/json', body: JSON.stringify({ posts: [null] }) }));
  await page.goto('/quotes/admin.html');
  await expect(page.locator('#catalogStatus')).toContainText('indisponível');
  await page.locator('#quoteInput').fill('Rascunho de teste com catálogo inválido; não publicar.');
  await expect(page.locator('#submitBtn')).toBeEnabled();
  await expect(page.locator('#exportBtn')).toBeEnabled();
  const downloading = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const draft = JSON.parse(fs.readFileSync(await (await downloading).path(), 'utf8'));
  expect(draft.status).toBe('draft');
  expect(draft.suggestedPosition).toBeNull();
});

test('Registro treats prototype-like text as a new quote rather than a duplicate', async ({ page }) => {
  await page.goto('/quotes/admin.html');
  await expect(page.locator('#assignNum')).toHaveText('1637');
  for (const text of ['constructor', '__proto__']) {
    await page.locator('#quoteInput').fill(text);
    await expect(page.locator('#dupWarning')).not.toBeVisible();
    await expect(page.locator('#submitBtn')).toBeEnabled();
    await expect(page.locator('#exportBtn')).toBeEnabled();
  }
});

test('without JavaScript, header destinations remain native and Registro explains its local scope', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 960 },
    storageState: { cookies: [], origins: [] }, serviceWorkers: 'block' });
  const origin = new URL(baseURL).origin;
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.method() !== 'GET' || url.origin !== origin || /\/(?:api|_state)(?:\/|$)/.test(url.pathname)) return route.abort();
    const headers = { ...request.headers() }; delete headers.cookie; delete headers.authorization;
    return route.continue({ headers });
  });
  const page = await context.newPage();
  try {
    await page.goto(new URL('/quotes/', baseURL).href);
    await expect(page.locator('.quotes-nav a[href="/metodologia/"]')).toBeVisible();
    await expect(page.locator('.quotes-brand')).toHaveAttribute('href', '/');
    await page.locator('.quotes-nav a[href="/quotes/admin"]').click();
    await expect(page).toHaveURL(url => /\/quotes\/admin(?:\.html)?$/.test(url.pathname));
    await expect(page.locator('body')).toContainText(/rascunho|prévia/i);
    await expect(page.locator('body')).toContainText(/não publica/i);
    await noOverflow(page);
  } finally { await context.close(); }
});
