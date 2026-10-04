const { test, expect } = require('@playwright/test');
const assert = require('node:assert/strict');

const pagesURL = process.env.PAGES_UI_TEST_URL;
if (pagesURL) {
  const runtime = new URL(pagesURL);
  assert.ok(runtime.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(runtime.hostname) && runtime.port,
    'Mover-se regressions require an explicit isolated local Pages runtime port.');
}
test.skip(!pagesURL, 'Set PAGES_UI_TEST_URL to Pages localhost; http-server does not validate canonical redirects.');
test.use({
  ...(pagesURL ? { baseURL: pagesURL } : {}),
  serviceWorkers: 'block',
  reducedMotion: 'reduce',
  storageState: { cookies: [], origins: [] },
});

const widths = [320, 390, 1440];
const modes = [
  { id: 'fio', name: 'Fio Rubrico' },
  { id: 'margem', name: 'Margem Viva' },
  { id: 'venda', name: 'A Venda' },
  { id: 'fichario', name: 'Fichário' },
];
const destinations = [
  { label: 'tese', href: '/iconocracia/', canonical: '/iconocracia/', heading: 'ICONOCRACIA' },
  { label: 'publicações', href: '/publicacoes/', canonical: '/publicacoes/', heading: 'publicações' },
  { label: 'ius gentium', href: '/grupoiusgentium/', canonical: '/grupoiusgentium/', heading: 'Ius Gentium' },
  { label: 'advocacia', href: '/advocacia.html', canonical: '/advocacia', heading: 'advocacia' },
  { label: 'contato', href: 'mailto:ana@anavanzin.com' },
];
const activityByContext = new WeakMap();

test.beforeEach(async ({ context, page, baseURL }) => {
  const origin = new URL(baseURL).origin;
  const activity = { allowed: [], blocked: [], errors: [] };
  activityByContext.set(context, activity);
  expect(await context.cookies(), 'No existing user cookies are inherited').toEqual([]);
  page.on('pageerror', error => activity.errors.push(error.message));
  context.on('page', other => other.on('pageerror', error => activity.errors.push(error.message)));
  await context.routeWebSocket('**/*', socket => socket.close());
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== origin || request.method() !== 'GET' || /\/(?:api|_state)(?:\/|$)/.test(url.pathname)) {
      activity.blocked.push({ method: request.method(), url: url.href });
      return route.abort('blockedbyclient');
    }
    const headers = { ...request.headers() };
    delete headers.cookie;
    delete headers.authorization;
    activity.allowed.push({ method: request.method(), url: url.href });
    return route.continue({ headers });
  });
  await context.addInitScript(() => {
    window.__moverPageshow = [];
    window.addEventListener('pageshow', event => window.__moverPageshow.push({ persisted: event.persisted, trusted: event.isTrusted }));
  });
});

test.afterEach(async ({ context }, testInfo) => {
  const activity = activityByContext.get(context);
  if (!activity) return;
  await testInfo.attach('mover-readonly-network', {
    body: JSON.stringify({ allowedGETs: activity.allowed.length, blocked: activity.blocked, errors: activity.errors }, null, 2),
    contentType: 'application/json',
  });
  expect(activity.errors, 'The paradigm controls and native navigation run without uncaught errors').toEqual([]);
  expect(activity.allowed.every(request => request.method === 'GET' && !/\/(?:api|_state)(?:\/|$)/.test(new URL(request.url).pathname))).toBe(true);
});

async function tabTo(page, locator) {
  await expect(locator).toBeVisible();
  for (let step = 0; step < 90; step++) {
    if (await locator.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('The control is not reachable by native Tab navigation');
}

async function enter(page, locator) {
  await tabTo(page, locator);
  await expect(locator).toBeFocused();
  await page.keyboard.press('Enter');
}

async function visitMover(page, width = 390) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto('/mover-se', { waitUntil: 'load' });
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL(url => url.pathname === '/mover-se');
}

async function enterFromHomeIndex(page, width, withoutJS = false) {
  await page.setViewportSize({ width, height: 900 });
  expect((await page.goto('/', { waitUntil: 'load' })).status()).toBe(200);
  if (withoutJS) await enter(page, page.locator('.mm-index-fallback summary'));
  else {
    await expect(page.locator('html')).not.toHaveClass(/av-loading/);
    await enter(page, page.locator('.mm-index-toggle'));
  }
  const link = page.locator(withoutJS ? '.mm-index-fallback a[href="/mover-se.html"]' : '#mm-index a[href="/mover-se.html"]');
  await tabTo(page, link);
  const alias = page.waitForResponse(response => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/mover-se.html');
  const document = page.waitForResponse(response => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/mover-se');
  await page.keyboard.press('Enter');
  const redirect = await alias;
  expect([301, 308], 'The existing .html index link resolves through a permanent canonical redirect').toContain(redirect.status());
  expect(new URL(redirect.headers().location, page.url()).pathname).toBe('/mover-se');
  expect((await document).status()).toBe(200);
  await expect(page).toHaveURL(url => url.pathname === '/mover-se');
}

async function assertMode(page, id, persistent = true) {
  await expect(page.locator('.ms-switcher')).toBeVisible();
  await expect(page.locator('.ms-switcher .ms-btn')).toHaveCount(4);
  await expect(page.locator('.ms-switcher .ms-btn[aria-pressed="true"]')).toHaveCount(1);
  for (const mode of modes) {
    await expect(page.locator(`.ms-switcher .ms-btn[data-target="${mode.id}"]`)).toHaveAttribute('aria-pressed', String(mode.id === id));
    if (mode.id === id) await expect(page.locator(`#p-${mode.id}`)).toBeVisible();
    else await expect(page.locator(`#p-${mode.id}`)).toBeHidden();
  }
  if (persistent) expect(await page.evaluate(() => localStorage.getItem('av_moverse_mode'))).toBe(id);
}

async function selectMode(page, mode, persistent = true) {
  await enter(page, page.locator('.ms-switcher').getByRole('button', { name: mode.name, exact: true }));
  await assertMode(page, mode.id, persistent);
}

function destinationLink(page, mode, destination) {
  return page.locator(`#p-${mode.id} a[href="${destination.href}"]`);
}

async function exposeDestination(page, mode, destination, index) {
  if (mode.id === 'fio') {
    const knot = page.locator('#fio-knots .fio-knot-container').nth(index);
    if (!await knot.locator('.fio-content').isVisible()) await enter(page, knot.getByRole('button', { name: destination.label, exact: true }));
  } else if (mode.id === 'margem') {
    await enter(page, page.locator('#mv-links').getByRole('button', { name: destination.label, exact: true }));
  } else if (mode.id === 'venda') {
    const item = page.locator('#v-items .v-item').nth(index);
    if (!await item.evaluate(element => element.classList.contains('revealed'))) await enter(page, item.getByRole('button', { name: 'vendado — toque para revelar', exact: true }));
  }
  const link = destinationLink(page, mode, destination);
  await expect(link).toBeVisible();
  expect(await link.evaluate(element => element instanceof HTMLAnchorElement)).toBe(true);
  await expect(link).toHaveAccessibleName(new RegExp(destination.label, 'i'));
  // Actionability includes the Venda mask; trial never clicks a mailto or navigates.
  await link.click({ trial: true });
  return link;
}

for (const width of widths) {
  test(`home index reaches canonical Mover-se and all four keyboard modes at ${width}px`, async ({ page }) => {
    await enterFromHomeIndex(page, width);
    await assertMode(page, 'fio');
    for (const mode of modes) {
      await selectMode(page, mode);
      await expect(page.locator(`#p-${mode.id} a[href]`)).toHaveCount(5);
      for (const [index, destination] of destinations.entries()) await exposeDestination(page, mode, destination, index);
      if (mode.id === 'venda') {
        const replay = page.getByRole('button', { name: 'Replay', exact: true });
        await enter(page, replay);
        await expect(page.locator('#v-items .v-item.revealed')).toHaveCount(0);
        const masks = page.locator('#v-items .v-overlay');
        await tabTo(page, masks.nth(0));
        await page.keyboard.press('Space');
        await expect(page.locator('#v-items .v-item.revealed')).toHaveCount(1);
        await destinationLink(page, mode, destinations[0]).click({ trial: true });
        await enter(page, masks.nth(1));
        await expect(page.locator('#v-items .v-item.revealed')).toHaveCount(2);
        await destinationLink(page, mode, destinations[1]).click({ trial: true });
        await enter(page, replay);
        await expect(page.locator('#v-items .v-item.revealed')).toHaveCount(0);
        await assertMode(page, 'venda');
      }
    }
    const cards = page.locator('#f-grid a');
    await enter(page, page.locator('.f-filters').getByRole('button', { name: 'prática', exact: true }));
    await expect(cards.filter({ visible: true })).toHaveCount(1);
    await expect(cards.filter({ visible: true })).toHaveAttribute('href', '/advocacia.html');
    await enter(page, page.locator('.f-filters').getByRole('button', { name: 'todos', exact: true }));
    await expect(cards.filter({ visible: true })).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });

  for (const mode of modes) {
    test(`${mode.name} keeps its mode through native links and real Back at ${width}px`, async ({ page }, testInfo) => {
      await visitMover(page, width);
      await selectMode(page, mode);
      for (const [index, destination] of destinations.entries()) {
        if (!destination.canonical) continue; // Never activate mailto.
        const link = await exposeDestination(page, mode, destination, index);
        await tabTo(page, link);
        const document = page.waitForResponse(response => response.request().isNavigationRequest() && response.status() === 200 && new URL(response.url()).pathname === destination.canonical);
        await page.keyboard.press('Enter');
        expect((await document).status()).toBe(200);
        await expect(page).toHaveURL(url => url.pathname === destination.canonical);
        await expect(page.locator('h1').first()).toHaveText(destination.heading);
        await page.goBack({ waitUntil: 'load' });
        await expect(page).toHaveURL(url => url.pathname === '/mover-se');
        await assertMode(page, mode.id);
      }
      await testInfo.attach('mover-real-history-pageshow', {
        body: JSON.stringify(await page.evaluate(() => window.__moverPageshow)), contentType: 'application/json',
      });
    });
  }
}

test.describe('progressive native navigation without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  for (const width of widths) {
    test(`Mover-se has five fallback links and a keyboard home brand at ${width}px`, async ({ page }) => {
      await enterFromHomeIndex(page, width, true);
      await expect(page.locator('.ms-switcher')).toBeHidden();
      const navigation = page.getByRole('navigation', { name: 'Navegação de Mover-se', exact: true });
      await expect(navigation).toBeVisible();
      await expect(navigation.getByRole('link')).toHaveCount(5);
      for (const destination of destinations) await expect(navigation.getByRole('link', { name: destination.label, exact: true })).toHaveAttribute('href', destination.href);
      const publications = navigation.getByRole('link', { name: 'publicações', exact: true });
      await enter(page, publications);
      await expect(page).toHaveURL(url => url.pathname === '/publicacoes/');
      await expect(page.locator('h1').first()).toHaveText('publicações');
      await page.goBack({ waitUntil: 'load' });
      await expect(page).toHaveURL(url => url.pathname === '/mover-se');
      const brand = page.locator('.ms-topbar a.ms-title');
      await expect(brand).toHaveAttribute('href', '/');
      const home = page.waitForResponse(response => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/');
      await enter(page, brand);
      expect((await home).status()).toBe(200);
      await expect(page.locator('#name')).toContainText('vanzin');
    });
  }
});

for (const denied of ['getter', 'setter']) {
  test(`denied storage ${denied} defaults to Fio and keeps all mode controls usable`, async ({ page }) => {
    await page.addInitScript(denial => {
      const reject = () => { throw new DOMException('Storage denied by browser policy', 'SecurityError'); };
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get: denial === 'getter' ? reject : () => ({ getItem: () => null, setItem: reject }),
      });
    }, denied);
    await visitMover(page, 320);
    await assertMode(page, 'fio', false);
    for (const mode of modes) {
      await selectMode(page, mode, false);
      await exposeDestination(page, mode, destinations[1], 1);
    }
  });
}

for (const invalid of ['unknown-mode', '__proto__']) {
  test(`invalid saved mode ${invalid} falls back to usable Fio`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('av_moverse_mode', value), invalid);
    await visitMover(page);
    await assertMode(page, 'fio');
    await exposeDestination(page, modes[0], destinations[0], 0);
    await selectMode(page, modes[3]);
    await expect(page.locator('#f-grid a')).toHaveCount(5);
  });
}
