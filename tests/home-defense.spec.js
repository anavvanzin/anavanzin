const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`defense feature fits the opening composition at ${width}px in PT and EN`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const feature = page.getByRole('region', { name: 'Defesa da dissertação' });
    await expect(feature).toBeVisible();
    await expect(feature).toContainText('Mestrado');
    await expect(page.locator('.nav nav a')).toHaveCount(6);
    for (const lang of ['pt', 'en']) {
      await page.getByRole('button', { name: lang.toUpperCase(), exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
      const link = page.locator('.defense-link');
      await expect(link).toContainText(lang === 'pt' ? 'Assistir à defesa' : 'Watch the defense');
      await expect(link).toHaveAttribute('href', '/defesa/');
      const box = await link.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    const placement = await page.evaluate(() => {
      const card = document.querySelector('.defense-feature').getBoundingClientRect();
      const hero = document.querySelector('.home-hero').getBoundingClientRect();
      const portrait = document.querySelector('.hero-portrait').getBoundingClientRect();
      return { cardBottom: card.bottom, heroBottom: hero.bottom, portraitTop: portrait.top };
    });
    expect(placement.cardBottom).toBeLessThanOrEqual(placement.heroBottom);
    if (width <= 1000) expect(placement.cardBottom).toBeLessThanOrEqual(placement.portraitTop);
  });
}

test('keyboard link opens the defense and preserves English', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  const link = page.getByRole('link', { name: 'Watch the defense 1h31 →' });
  await page.getByRole("button", { name: "EN", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style', 'solid');
  await expect(link).toHaveCSS('outline-color', 'rgb(245, 240, 230)');
  await link.press('Enter');
  await expect(page).toHaveURL(/\/defesa\/$/);
  await expect(page.getByRole('heading', { name: 'Dissertation defense', exact: true })).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('region', { name: 'Dissertation defense' })).toBeVisible();
  await page.getByRole('button', { name: 'PT', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Defesa da dissertação' })).toBeVisible();
});

test('defense remains discoverable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:8080/');
  await page.getByRole('link', { name: 'Assistir à defesa 1h31 →' }).click();
  await expect(page).toHaveURL(/\/defesa\/$/);
  await expect(page.getByRole('heading', { name: 'Defesa da dissertação', exact: true })).toBeVisible();
  await context.close();
});
