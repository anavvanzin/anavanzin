const { test, expect } = require('@playwright/test');

test.use({ serviceWorkers: 'block' });

async function installReadOnlyNetworkGuard(context, baseURL) {
  expect(baseURL, 'The test project must configure baseURL').toBeTruthy();
  const origin = new URL(baseURL).origin;
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isRead = ['GET', 'HEAD'].includes(request.method());
    const isStateOrApi = /(?:^|\/)(?:api|_state)(?:\/|$)/i.test(url.pathname);
    const isVideo = /\.mp4$/i.test(url.pathname) || request.resourceType() === 'media';
    if (!isRead || isStateOrApi || isVideo || url.origin !== origin) {
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
}

test.beforeEach(async ({ page, context, baseURL }) => {
  await installReadOnlyNetworkGuard(context, baseURL);
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`defense feature follows the hero and fits at ${width}px in PT and EN`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const feature = page.getByRole('region', { name: 'Defesa da dissertação' });
    await expect(feature).toBeVisible();
    await expect(feature).toContainText('Mestrado');
    await expect(page.locator('.nav > nav a')).toHaveCount(8);
    if (width <= 1000) {
      await expect(page.locator('.nav > nav')).toBeHidden();
      await expect(page.locator('.mm-trigger')).toBeVisible();
    } else {
      await expect(page.locator('.nav > nav')).toBeVisible();
      await expect(page.locator('.mm-trigger')).toBeHidden();
    }
    for (const lang of ['pt', 'en']) {
      await page.getByRole('button', { name: lang.toUpperCase(), exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
      const link = page.locator('.defense-link');
      await expect(link).toContainText(lang === 'pt' ? 'Assistir à defesa' : 'Watch the defense');
      await expect(link).toHaveAttribute('href', '/defesa/');
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const placement = await page.evaluate(() => {
        const cardElement = document.querySelector('.defense-feature');
        const heroElement = document.querySelector('.home-hero');
        const card = cardElement.getBoundingClientRect();
        const hero = heroElement.getBoundingClientRect();
        return {
          insideHero: heroElement.contains(cardElement),
          immediatelyAfterHero: heroElement.nextElementSibling === cardElement,
          cardTop: card.top,
          heroBottom: hero.bottom,
        };
      });
      expect(placement.insideHero).toBe(false);
      expect(placement.immediatelyAfterHero).toBe(true);
      expect(placement.cardTop).toBeGreaterThanOrEqual(placement.heroBottom);
    }
  });
}

test('keyboard link opens the defense and preserves English', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  const link = page.getByRole('link', { name: 'Watch the defense 1h31 →' });
  await page.getByRole('button', { name: 'EN', exact: true }).focus();
  for (let step = 0; step < 70; step += 1) {
    await page.keyboard.press('Tab');
    if (await link.evaluate((element) => element === document.activeElement)) break;
  }
  await expect(link).toBeFocused();
  const focus = await link.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      visible: element.matches(':focus-visible'),
      outlineStyle: style.outlineStyle,
      outlineWidth: parseFloat(style.outlineWidth),
    };
  });
  expect(focus.visible).toBe(true);
  expect(['none', 'hidden']).not.toContain(focus.outlineStyle);
  expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/defesa\/$/);
  await expect(page.getByRole('heading', { name: 'Dissertation defense', exact: true })).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('region', { name: 'Dissertation defense' })).toBeVisible();
  await page.getByRole('button', { name: 'PT', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Defesa da dissertação' })).toBeVisible();
});

test('defense remains discoverable without JavaScript', async ({ browser, baseURL }) => {
  expect(baseURL, 'The test project must configure baseURL').toBeTruthy();
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    serviceWorkers: 'block',
    viewport: { width: 390, height: 844 },
  });
  try {
    await installReadOnlyNetworkGuard(context, baseURL);
    const page = await context.newPage();
    await page.goto(new URL('/', baseURL).href);
    await page.getByRole('link', { name: 'Assistir à defesa 1h31 →' }).click();
    await expect(page).toHaveURL(/\/defesa\/$/);
    await expect(page.getByRole('heading', { name: 'Defesa da dissertação', exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});
