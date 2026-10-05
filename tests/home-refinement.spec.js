const { test, expect } = require('@playwright/test');

const widths = [320, 390, 768, 1024, 1440];
const languages = ['pt', 'en'];
const topicIds = ['comecar', 'metodos', 'ferramentas', 'acervos'];
const network = new WeakMap();

test.use({ serviceWorkers: 'block' });

test.beforeEach(async ({ page, context, baseURL }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false);
  const origin = new URL(baseURL).origin;
  const activity = { stateOrAPI: [], writes: [], mp4: [], portrait: [], fontCDN: [] };
  network.set(page, activity);
  page.on('request', request => {
    const url = new URL(request.url());
    if (/\/(?:api|_state)(?:\/|$)/.test(url.pathname)) activity.stateOrAPI.push(request.url());
    if (url.origin === origin && !['GET', 'HEAD'].includes(request.method())) activity.writes.push(request.url());
    if (/\.mp4(?:$|\/)/i.test(url.pathname)) activity.mp4.push(request.url());
    if (url.pathname === '/assets/redesign/ana-metamorfose.png') activity.portrait.push(request.url());
    if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) activity.fontCDN.push(request.url());
  });
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    if (/\/(?:api|_state)(?:\/|$)/.test(url.pathname)
        || /\.mp4(?:$|\/)/i.test(url.pathname)
        || (url.origin === origin && !['GET', 'HEAD'].includes(request.method()))) return route.abort();
    if (url.origin !== origin) return route.fulfill({ status: 204, body: '' });
    return route.continue();
  });
});

test.afterEach(async ({ page }) => {
  const activity = network.get(page);
  expect(activity.stateOrAPI, 'Home tests must never contact API or KV state routes').toEqual([]);
  expect(activity.writes, 'Home tests must never write through the local server').toEqual([]);
  expect(activity.mp4, 'The home must never request a removed hero video').toEqual([]);
  expect(activity.portrait, 'The removed hero poster is not downloaded').toEqual([]);
  expect(activity.fontCDN, 'Home uses self-hosted fonts rather than a Google Fonts download').toEqual([]);
});

async function openHome(page, lang = 'pt') {
  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response.status(), 'Home document response').toBe(200);
  await expect(page.locator('html')).not.toHaveClass(/av-loading/);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(`.lang button[data-lang="${lang}"]`).click();
  await assertLanguage(page, lang);
}

async function assertLanguage(page, lang) {
  await expect(page.locator('html')).toHaveAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  await expect(page.locator(`.lang button[data-lang="${lang}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(`.lang button[data-lang="${lang === 'pt' ? 'en' : 'pt'}"]`)).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#methodology-title')).toHaveText(lang === 'pt' ? 'Metodologia' : 'Methodology');
  await expect(page.locator('.methodology-cta')).toHaveText(lang === 'pt' ? 'Ler o guia →' : 'Read the guide →');
  await expect(page.locator('.methodology-topics')).toHaveAccessibleName(lang === 'pt' ? 'Seções do guia de pesquisa' : 'Research guide sections');
  await expect(page.locator('.methodology-intro')).toContainText(lang === 'pt' ? 'história do direito' : 'legal history');
  await expect(page.locator('.actions .primary')).toHaveText(lang === 'pt' ? 'entrar na iconocracia →' : 'enter iconocracia →');
}

async function assertNavigation(page) {
  await expect(page.locator('.nav > nav > a')).toHaveCount(9);
  expect(await page.locator('.nav > nav > a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual([
    '/sobre', '/atlas/', '/publicacoes/', '/metodologia/', '/quotes/',
    'https://iconocracia.com/', 'https://grupoiusgentium.com.br/',
    'https://anavanzin.com/arno-dal-ri-site', 'mailto:ana@anavanzin.com',
  ]);
  await expect(page.locator('.methodology-cta')).toHaveAttribute('href', '/metodologia/');
  expect(await page.locator('.methodology-topics a').evaluateAll(links => links.map(link => link.getAttribute('href'))))
    .toEqual(topicIds.map(id => `/metodologia/#${id}`));
  await expect(page.locator('.actions .primary')).toHaveAttribute('href', 'https://www.iconocracia.com');
  await expect(page.locator('.defense-link')).toHaveAttribute('href', '/defesa/');
  await expect(page.locator('.quotes-entry a')).toHaveAttribute('href', '/quotes/');
}

async function assertResponsiveNavigation(page, width) {
  const links = page.locator('.nav > nav > a');
  if (width <= 1000) {
    await expect(page.locator('.mm-trigger')).toBeVisible();
    await expect(page.locator('.mm-trigger')).toHaveAttribute('aria-expanded', 'false');
    for (const link of await links.all()) await expect(link).toBeHidden();
  } else {
    await expect(page.locator('.mm-trigger')).toBeHidden();
    for (const link of await links.all()) await expect(link).toBeVisible();
  }
}

async function assertTextHero(page, width) {
  await expect(page.locator('.home-hero video, .home-hero figure, .portrait-control')).toHaveCount(0);
  await expect(page.locator('#name')).toBeVisible();
  await expect(page.locator('.hero-copy .intro')).toBeVisible();
  await expect(page.locator('.actions .secondary')).toHaveAttribute('href', '/intro/');
  const placement = await page.evaluate(() => {
    const name = document.querySelector('.hero-name').getBoundingClientRect();
    const copy = document.querySelector('.hero-copy').getBoundingClientRect();
    const hero = document.querySelector('.home-hero').getBoundingClientRect();
    return { nameRight: name.right, nameBottom: name.bottom, copyLeft: copy.left, copyTop: copy.top, copyBottom: copy.bottom, heroBottom: hero.bottom };
  });
  if (width <= 1000) {
    expect(placement.copyTop, 'Text follows the name without a reserved media row').toBeCloseTo(placement.nameBottom, 0);
  } else {
    expect(placement.copyLeft, 'Desktop uses the freed column for the introduction').toBeGreaterThan(placement.nameRight);
  }
  expect(placement.heroBottom, 'No empty media row remains below the introduction').toBeCloseTo(placement.copyBottom, 0);
}

async function assertNoClippingOrOverflow(page) {
  const issues = await page.evaluate(() => {
    const problems = [];
    const viewport = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > viewport + 1 || document.body.scrollWidth > viewport + 1) {
      problems.push(`horizontal overflow: html=${document.documentElement.scrollWidth}, body=${document.body.scrollWidth}, viewport=${viewport}`);
    }
    const elements = document.querySelectorAll('.home-brand, .mm-trigger, .mm-index-toggle, .nav > nav > a, .lang button, h1, h2, .methodology-feature p, .methodology-feature a');
    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || !element.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) continue;
      const label = `${element.tagName} ${element.id || element.className || element.textContent.trim().slice(0, 45)}`;
      if (rect.left < -1 || rect.right > viewport + 1) problems.push(`${label}: element outside horizontal viewport`);
      // Text ranges reveal overflow even if an ancestor masks document scrollWidth.
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        for (const textRect of range.getClientRects()) {
          if (textRect.left < -1 || textRect.right > viewport + 1) problems.push(`${label}: text outside horizontal viewport`);
          for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            const bounds = ancestor.getBoundingClientRect();
            if (['hidden', 'clip'].includes(style.overflowX) && (textRect.left < bounds.left - 2 || textRect.right > bounds.right + 2)) {
              problems.push(`${label}: text clipped horizontally by ${ancestor.tagName}.${ancestor.className}`);
            }
            if (['hidden', 'clip'].includes(style.overflowY) && (textRect.top < bounds.top - 2 || textRect.bottom > bounds.bottom + 2)) {
              problems.push(`${label}: text clipped vertically by ${ancestor.tagName}.${ancestor.className}`);
            }
          }
        }
      }
    }
    const intro = document.querySelector('.methodology-intro').getBoundingClientRect();
    const cta = document.querySelector('.methodology-cta').getBoundingClientRect();
    if (intro.bottom > cta.top + 1) problems.push('Methodology introduction overlaps the CTA');
    const links = [...document.querySelectorAll('.methodology-topics a')].map(el => el.getBoundingClientRect());
    links.slice(1).forEach((rect, index) => { if (links[index].bottom > rect.top + 1) problems.push('Methodology topic links overlap'); });
    return [...new Set(problems)];
  });
  expect(issues, 'Readable headings, navigation and methodology text at the current CSS viewport').toEqual([]);
}

async function captureMethodology(page, testInfo, name) {
  await testInfo.attach(name, { body: await page.locator('.methodology-feature').screenshot(), contentType: 'image/png' });
}

for (const width of widths) {
  test(`home PT/EN at ${width}px: readable methodology, text hero and destinations`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of languages) {
      await openHome(page, lang);
      await assertNavigation(page);
      await assertResponsiveNavigation(page, width);
      await assertTextHero(page, width);
      expect(await page.locator('.methodology-intro').evaluate(element => parseFloat(getComputedStyle(element).fontSize)), 'Methodology body text remains at least18px').toBeGreaterThanOrEqual(18);
      await expect(page.locator('.methodology-topics a').first()).toHaveCSS('font-family', /DM Sans/);
      await expect(page.locator('.methodology-topics a').first()).toHaveCSS('text-transform', 'none');
      expect(await page.evaluate(() => document.fonts.check('18px "DM Sans"'))).toBe(true);
      await assertNoClippingOrOverflow(page);
      await testInfo.attach(`hero-${lang}-${width}`, { body: await page.locator('.home-hero').screenshot(), contentType: 'image/png' });
      await captureMethodology(page, testInfo, `methodology-${lang}-${width}`);
    }
  });
}

test('home remains free of media when the motion preference changes', async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const motion of ['no-preference', 'reduce', 'no-preference']) {
      await page.emulateMedia({ reducedMotion: motion });
      for (const lang of languages) {
        await openHome(page, lang);
        await assertTextHero(page, width);
        await assertNoClippingOrOverflow(page);
      }
    }
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('text hero and methodology remain usable at320px and1440px', async ({ page }) => {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect((await page.goto('/')).status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await assertTextHero(page, width);
      await assertNavigation(page);
      await expect(page.locator('#methodology-title')).toHaveText('Metodologia');
      await expect(page.locator('.methodology-intro')).toBeVisible();
      await expect(page.locator('.lang')).toBeHidden();
      await expect(page.locator('#av-loader')).toBeHidden();
      await assertNoClippingOrOverflow(page);
      await page.locator('.methodology-topics a[href="/metodologia/#metodos"]').click();
      await expect(page).toHaveURL(url => url.pathname === '/metodologia/' && url.hash === '#metodos');
      await expect(page.locator('#metodos')).toBeInViewport();
    }
  });
});

async function focusByTab(page, target) {
  for (let step = 0; step < 70; step++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate(element => element === document.activeElement)) {
      expect(await target.evaluate(element => element.matches(':focus-visible'))).toBe(true);
      const style = await target.evaluate(element => {
        const css = getComputedStyle(element);
        return { width: parseFloat(css.outlineWidth), style: css.outlineStyle };
      });
      expect(style.width, 'Keyboard focus has a visible outline').toBeGreaterThanOrEqual(2);
      expect(style.style).not.toBe('none');
      return;
    }
  }
  throw new Error('Methodology link was not reachable by Tab within the home focus order');
}

test('keyboard reaches methodology and its sections in PT/EN, mobile/desktop', async ({ page }) => {
  for (const width of [320, 1440]) {
    for (const lang of languages) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.evaluate(saved => localStorage.setItem('av_lang', saved), lang);
      const targets = [
        { selector: '.methodology-nav', hash: '' },
        { selector: '.methodology-cta', hash: '' },
        ...topicIds.map(id => ({ selector: `.methodology-topics a[href="/metodologia/#${id}"]`, hash: `#${id}` })),
      ];
      for (const target of targets) {
        expect((await page.goto('/')).status()).toBe(200);
        await expect(page.locator('html')).not.toHaveClass(/av-loading/);
        await assertLanguage(page, lang);
        if (width <= 1000 && target.selector === '.methodology-nav') {
          await focusByTab(page, page.locator('.mm-trigger'));
          await page.keyboard.press('Enter');
          await expect(page.locator('.mm-trigger')).toHaveAttribute('aria-expanded', 'true');
          await expect(page.locator('#mm-nav')).toBeVisible();
        }
        await focusByTab(page, page.locator(target.selector));
        const navigation = page.waitForResponse(response => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/metodologia/');
        await page.keyboard.press('Enter');
        expect((await navigation).status(), 'Methodology navigation document response').toBe(200);
        await expect(page).toHaveURL(url => url.pathname === '/metodologia/' && url.hash === target.hash);
        if (target.hash) await expect(page.locator(target.hash)).toBeInViewport();
        else await expect(page.locator('h1')).toBeVisible();
      }
    }
  }
});

test('language choice survives reload in both directions on mobile anddesktop', async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openHome(page, 'pt');
    for (const lang of ['en', 'pt']) {
      await page.locator(`.lang button[data-lang="${lang}"]`).click();
      await assertLanguage(page, lang);
      expect(await page.evaluate(() => localStorage.getItem('av_lang'))).toBe(lang);
      await page.reload();
      await assertLanguage(page, lang);
      await assertTextHero(page, width);
      await assertNoClippingOrOverflow(page);
    }
  }
});

for (const lang of languages) {
  test(`200% root text resize (32px), not native zoom: ${lang}, allfive widths`, async ({ page }, testInfo) => {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await openHome(page, lang);
      const originalTextSize = await page.locator('.methodology-intro').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
      await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
      await expect(page.locator('html')).toHaveCSS('font-size', '32px');
      expect(await page.locator('.methodology-intro').evaluate(element => parseFloat(getComputedStyle(element).fontSize)), 'Methodology body text scales with user text resizing').toBeGreaterThanOrEqual(originalTextSize * 1.95);
      await assertNoClippingOrOverflow(page);
      await assertNavigation(page);
      const metrics = await page.evaluate(() => ({
        validation: 'Root font-size 32px (200% of 16px). This is text resizing, not native browser zoom.',
        cssViewport: innerWidth,
        root: getComputedStyle(document.documentElement).fontSize,
        intro: getComputedStyle(document.querySelector('.methodology-intro')).fontSize,
        heading: getComputedStyle(document.querySelector('#methodology-title')).fontSize,
        topic: getComputedStyle(document.querySelector('.methodology-topics a')).fontSize,
      }));
      await testInfo.attach(`text-resize-metrics-${width}`, { body: JSON.stringify(metrics, null, 2), contentType: 'application/json' });
      await captureMethodology(page, testInfo, `text-resize-${lang}-${width}`);
    }
  });
}

test('720px effective CSS viewport reflow in PT/EN, separately from text resize', async ({ page }, testInfo) => {
  for (const lang of languages) {
    // 720 CSS px model the available width of a 1440px desktop at 200% zoom.
    // This verifies reflow; it does not drive or claim native browser zoom.
    await page.setViewportSize({ width: 720, height: 900 });
    await openHome(page, lang);
    await assertTextHero(page, 720);
    await assertNoClippingOrOverflow(page);
    const columns = await page.locator('.methodology-feature').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(columns, 'Methodology reflows to one column at the effective viewport').toBe(1);
    await captureMethodology(page, testInfo, `effective-css-viewport-${lang}-720`);
  }
});
