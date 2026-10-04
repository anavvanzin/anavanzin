const { test, expect } = require('@playwright/test');
const assert = require('node:assert/strict');

// Run against a built Pages runtime, never http-server's .html aliases.
// PAGES_UI_TEST_URL=http://127.0.0.1:8171 <Playwright config selecting this spec>
const pagesURL = process.env.PAGES_UI_TEST_URL;
if (pagesURL) {
  const runtime = new URL(pagesURL);
  assert.ok(runtime.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(runtime.hostname) && runtime.port,
    'Navigation regression tests require an explicit local Pages runtime port.');
}
test.skip(!pagesURL, 'Set PAGES_UI_TEST_URL to the isolated Pages runtime; canonical routes require Pages routing.');
test.use({
  ...(pagesURL ? { baseURL: pagesURL } : {}),
  serviceWorkers: 'block',
  reducedMotion: 'reduce',
  storageState: { cookies: [], origins: [] },
});

const widths = [320, 390, 1440];
const languages = ['pt', 'en'];
const activityByContext = new WeakMap();
const languageSelectors = {
  '/': '.lang button[data-lang]',
  '/trabalhos': '#langtog button[data-lang]',
  editorial: '.langtog button[data-lang]',
};

test.beforeEach(async ({ context, page, baseURL }) => {
  const origin = new URL(baseURL).origin;
  const activity = { allowed: [], blocked: [], errors: [] };
  activityByContext.set(context, activity);
  expect(await context.cookies(), 'The fixture does not inherit any user cookies').toEqual([]);
  page.on('pageerror', error => activity.errors.push(error.message));
  context.on('page', other => other.on('pageerror', error => activity.errors.push(error.message)));
  await context.routeWebSocket('**/*', socket => socket.close());
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    const stateOrAPI = /\/(?:api|_state)(?:\/|$)/.test(url.pathname);
    if (url.origin !== origin || request.method() !== 'GET' || stateOrAPI) {
      activity.blocked.push({ method: request.method(), url: url.href });
      return route.abort('blockedbyclient');
    }
    // Even a cookie newly created by the Mesa cannot travel to the runtime.
    const headers = { ...request.headers() };
    delete headers.cookie;
    delete headers.authorization;
    activity.allowed.push({ method: request.method(), url: url.href });
    return route.continue({ headers });
  });
  await context.addInitScript(() => {
    window.__navigationPageshow = [];
    window.addEventListener('pageshow', event => {
      window.__navigationPageshow.push({ persisted: event.persisted, trusted: event.isTrusted, pathname: location.pathname });
    });
  });
});

test.afterEach(async ({ context }, testInfo) => {
  const activity = activityByContext.get(context);
  if (!activity) return;
  await testInfo.attach('navigation-network-guard', {
    body: JSON.stringify({ allowedGETs: activity.allowed.length, blocked: activity.blocked, errors: activity.errors }, null, 2),
    contentType: 'application/json',
  });
  expect(activity.errors, 'Navigation controls work without uncaught JavaScript errors').toEqual([]);
  expect(activity.allowed.every(request => request.method === 'GET' && !/\/(?:api|_state)(?:\/|$)/.test(new URL(request.url).pathname)),
    'Only public static GETs were released by the network guard').toBe(true);
});

async function visit(page, route, width = 390) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto(route, { waitUntil: 'load' });
  expect(response.status(), `Canonical document ${route}`).toBe(200);
  await expect(page).toHaveURL(url => url.pathname === route);
  if (route === '/') await expect(page.locator('html')).not.toHaveClass(/av-loading/);
}

function languageButtons(page, route) {
  return page.locator(languageSelectors[route] || languageSelectors.editorial);
}

function languageButton(page, route, lang) {
  return page.locator(`${languageSelectors[route] || languageSelectors.editorial}[data-lang="${lang}"]`);
}

async function assertLanguage(page, route, lang) {
  await expect(page.locator('html')).toHaveAttribute('lang', lang === 'en' ? 'en' : /^pt(?:-BR)?$/);
  const buttons = languageButtons(page, route);
  await expect(buttons).toHaveCount(2);
  await expect(languageButton(page, route, lang)).toHaveAttribute('aria-pressed', 'true');
  await expect(languageButton(page, route, lang === 'pt' ? 'en' : 'pt')).toHaveAttribute('aria-pressed', 'false');
  const stored = await page.evaluate(() => localStorage.getItem('av_lang'));
  expect(lang === 'pt' ? [null, 'pt'] : ['en'], 'PT may be the initial default; an EN choice must be persisted').toContain(stored);
  if (route === '/') {
    await expect(page.locator('.home-brand')).toHaveAccessibleName(lang === 'pt' ? 'Ana Vanzin · início' : 'Ana Vanzin · home');
    await expect(page.locator('.signature')).toHaveText(lang === 'pt' ? 'direito · imagem · memória' : 'law · image · memory');
    if (await page.locator('#mm-nav').isVisible()) await expect(page.locator('#mm-nav a[href="/sobre"]')).toHaveText(lang === 'pt' ? 'Sobre' : 'About');
  } else if (route === '/trabalhos') {
    await expect(page.locator('#title')).toHaveText(lang === 'pt' ? 'Trabalhos & Seminários' : 'Works & Seminars');
    await expect(page.locator('#avnav a[href="/trabalhos"]')).toHaveText(lang === 'pt' ? 'trabalhos' : 'works');
  } else {
    await expect(page.locator('.ed-bar .avnav a[data-route="sobre"]')).toHaveText(lang === 'pt' ? 'sobre' : 'about');
    if (route === '/sobre') await expect(page.locator('.ed-head .dek')).toContainText(lang === 'pt' ? 'Sou Ana Vanzin' : 'I am Ana Vanzin');
  }
}

async function chooseLanguage(page, route, lang) {
  await languageButton(page, route, lang).click();
  await assertLanguage(page, route, lang);
}

async function tabTo(page, locator) {
  await expect(locator).toBeVisible();
  for (let step = 0; step < 70; step++) {
    if (await locator.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('The native link could not be reached with Tab');
}

async function enterHome(page, link) {
  await expect(link).toHaveAttribute('href', '/');
  expect(await link.evaluate(element => element instanceof HTMLAnchorElement)).toBe(true);
  await tabTo(page, link);
  await expect(link).toBeFocused();
  const document = page.waitForResponse(response => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/');
  await page.keyboard.press('Enter');
  expect((await document).status()).toBe(200);
  await expect(page).toHaveURL(url => url.pathname === '/' && url.hash === '');
  await expect(page.locator('.home-brand')).toBeVisible();
  await expect(page.locator('#name')).toContainText('vanzin');
}

async function assertActive(page, route) {
  const current = page.locator('.avnav a[aria-current="page"]');
  await expect(current).toHaveCount(1);
  expect(await current.evaluate(link => new URL(link.href).pathname)).toBe(route);
  await expect(current).toHaveClass(/\bcur\b/);
  await expect(page.locator('.avnav a.cur')).toHaveCount(1);
}

for (const width of widths) {
  test(`Mesa Ana is a native keyboard home link at ${width}px`, async ({ page }) => {
    await visit(page, '/mesa/', width);
    await page.getByRole('button', { name: /^(entrar|enter)\s*→$/i }).click();
    const brand = page.getByRole('link', { name: 'Ana Vanzin · início', exact: true });
    await expect(brand).toBeVisible();
    const bounds = await brand.boundingBox();
    expect(bounds.height, 'The brand remains a usable mobile target').toBeGreaterThanOrEqual(44);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
    await enterHome(page, brand);
  });

  test(`canonical Trabalhos has one current link and reachable work routes at ${width}px`, async ({ page }) => {
    await visit(page, '/', width);
    await page.locator('.mm-index-toggle').click();
    const works = page.locator('#mm-index a[href="/trabalhos"]');
    await tabTo(page, works);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(url => url.pathname === '/trabalhos');
    await assertActive(page, '/trabalhos');
    for (const lang of languages) {
      await chooseLanguage(page, '/trabalhos', lang);
      await assertActive(page, '/trabalhos');
      for (const route of ['/seminario8-dever-poder/', '/prot-tipo/', '/algoritmo-em-disputa/']) {
        const link = page.locator(`.entry a[href="${route}"]`);
        await expect(link).toBeVisible();
      }
    }
    await page.locator('.entry a[href="/seminario8-dever-poder/"]').click();
    await expect(page).toHaveURL(url => url.pathname === '/seminario8-dever-poder/');
    const back = page.locator('a[href="/trabalhos"]').first();
    await back.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(url => url.pathname === '/trabalhos');
    await assertActive(page, '/trabalhos');
  });

  test(`home index/menu retain exclusive panels and keyboard access at ${width}px`, async ({ page }) => {
    for (const lang of languages) {
      await visit(page, '/', width);
      await chooseLanguage(page, '/', lang);
      await page.locator('.mm-index-toggle').click();
      const dialog = page.locator('#mm-index');
      await expect(dialog).toBeVisible();
      await expect(page.locator('.mm-index-toggle')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('.mm-trigger')).toHaveAttribute('aria-expanded', 'false');
      const menuButton = dialog.locator('[data-open-menu]');
      if (width <= 1000) {
        await expect(page.locator('#mm-nav')).toBeHidden();
        await tabTo(page, menuButton);
        await page.keyboard.press('Enter');
        await expect(dialog).toBeHidden();
        await expect(page.locator('.mm-index-toggle')).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.mm-trigger')).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('#mm-nav')).toBeVisible();
        await expect(page.locator('#mm-nav a').first()).toBeFocused();
        await expect(page).toHaveURL(url => url.hash === '#menu');
        await page.keyboard.press('Escape');
        await expect(page.locator('#mm-nav')).toBeHidden();
        await expect(page.locator('.mm-trigger')).toBeFocused();
      } else {
        // The desktop nav is already present; there is no duplicate menu control.
        await expect(menuButton).toBeHidden();
        await expect(page.locator('#mm-nav')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(page.locator('.mm-index-toggle')).toBeFocused();
      }
      await expect(page).toHaveURL(url => url.hash === '');
      await assertLanguage(page, '/', lang);
    }
  });
}

test.describe('native links without JavaScript or third-party dependencies', () => {
  test.use({ javaScriptEnabled: false });
  for (const width of widths) {
    test(`legacy Atlas Ana returns home while project brands stay in ICONOCRACIA at ${width}px`, async ({ page }) => {
      await visit(page, '/iconocracia/atlas/', width);
      const brand = page.locator('.ico-bar > a.brand');
      await expect(brand).toContainText('ana vanzin');
      await enterHome(page, brand);
      await visit(page, '/iconocracia/', width);
      await expect(page.locator('h1').first()).toHaveText('ICONOCRACIA');
      const atlasEntry = page.locator('.entries a[href="/iconocracia/atlas/"]');
      await expect(atlasEntry).toContainText('Atlas da Pesquisa');
      await tabTo(page, atlasEntry);
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(url => url.pathname === '/iconocracia/atlas/');
      await visit(page, '/atlas/', width);
      const projectBack = page.locator('.ed-back');
      await expect(projectBack).toHaveAccessibleName(/ICONOCRACIA/);
      expect(await projectBack.evaluate(link => new URL(link.href).pathname)).toBe('/iconocracia/');
      await tabTo(page, projectBack);
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(url => url.pathname === '/iconocracia/');
    });

    test(`Mesa progressive HTML exposes a keyboard home link at ${width}px`, async ({ page }) => {
      await visit(page, '/mesa/', width);
      const brand = page.locator('#home-title a');
      await expect(brand).toHaveText('ana vanzin');
      await enterHome(page, brand);
    });

    test(`Trabalhos keeps PT content and native seminar navigation without inert language controls at ${width}px`, async ({ page }) => {
      await visit(page, '/trabalhos', width);
      await expect(page.locator('#langtog')).toBeHidden();
      await expect(page.locator('#title')).toHaveText('Trabalhos & Seminários');
      await expect(page.locator('.entry').filter({ hasText: 'Do Poder-Dever ao Dever-Poder' })).toContainText('Ana Vanzin & Vinícius Oliveira');
      const seminar = page.locator('.entry a[href="/seminario8-dever-poder/"]');
      await tabTo(page, seminar);
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(url => url.pathname === '/seminario8-dever-poder/');
      const back = page.locator('a[href="/trabalhos"]').first();
      await tabTo(page, back);
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(url => url.pathname === '/trabalhos');
      await expect(page.locator('#title')).toHaveText('Trabalhos & Seminários');
    });
  }
});

for (const width of [390, 1440]) {
  test(`shared editorial navigation announces each current canonical page at ${width}px`, async ({ page }) => {
    for (const route of ['/sobre', '/atlas/', '/publicacoes/', '/metodologia/']) {
      await visit(page, route, width);
      for (const lang of languages) {
        await chooseLanguage(page, route, lang);
        await assertActive(page, route);
      }
      await tabTo(page, page.locator('.ed-bar a.brand'));
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(url => url.pathname === '/');
      await assertLanguage(page, '/', 'en');
    }
  });

  for (const source of ['/', '/sobre', '/trabalhos']) {
    test(`language changed on another document survives real Back/Forward from ${source} at ${width}px`, async ({ page }, testInfo) => {
      await visit(page, source, width);
      await chooseLanguage(page, source, 'pt');
      await visit(page, '/publicacoes/', width);
      await chooseLanguage(page, '/publicacoes/', 'en');
      await page.goBack({ waitUntil: 'load' });
      await expect(page).toHaveURL(url => url.pathname === source);
      await assertLanguage(page, source, 'en');
      await expect.poll(() => page.evaluate(() => window.__navigationPageshow.some(event => event.trusted))).toBe(true);
      const restored = await page.evaluate(() => window.__navigationPageshow);
      await testInfo.attach('actual-back-pageshow', { body: JSON.stringify(restored), contentType: 'application/json' });
      // persisted=true is evidence of BFCache; a reload is still a valid history traversal.
      await chooseLanguage(page, source, 'pt');
      await page.goForward({ waitUntil: 'load' });
      await expect(page).toHaveURL(url => url.pathname === '/publicacoes/');
      await assertLanguage(page, '/publicacoes/', 'pt');
    });
  }
}

for (const route of ['/', '/sobre', '/trabalhos']) {
  test(`real storage events synchronize an already open ${route} with another tab`, async ({ page, context }) => {
    await visit(page, route);
    await chooseLanguage(page, route, 'pt');
    const other = await context.newPage();
    await visit(other, '/publicacoes/');
    await chooseLanguage(other, '/publicacoes/', 'en');
    await assertLanguage(page, route, 'en');
    await chooseLanguage(page, route, 'pt');
    await assertLanguage(other, '/publicacoes/', 'pt');
    await other.close();
  });

  test(`synthetic persisted pageshow reapplies stored language on ${route}`, async ({ page }) => {
    await visit(page, route);
    await chooseLanguage(page, route, 'pt');
    // Same-document writes emit no storage event: this isolates the pageshow handler.
    await page.evaluate(() => localStorage.setItem('av_lang', 'en'));
    await expect(languageButton(page, route, 'pt')).toHaveAttribute('aria-pressed', 'true');
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    await assertLanguage(page, route, 'en');
  });
}

test('denied localStorage keeps PT/EN controls and public navigation usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new DOMException('Storage denied by browser policy', 'SecurityError'); },
    });
  });
  for (const route of ['/', '/sobre', '/trabalhos']) {
    await visit(page, route);
    await languageButton(page, route, 'en').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(languageButton(page, route, 'en')).toHaveAttribute('aria-pressed', 'true');
    const home = page.locator(route === '/' ? '.home-brand' : route === '/trabalhos' ? '.bar a.brand' : '.ed-bar a.brand');
    await enterHome(page, home);
  }
});
