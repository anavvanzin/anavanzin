const { test, expect } = require('@playwright/test');

const route = '/atlas/nacao-como-mulher/';

test('exhibition has a complete no-JavaScript reading edition', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto(route);
  expect(response.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A Nação como Mulher');
  await expect(page.locator('.object-card')).toHaveCount(9);
  await expect(page.locator('.derivative-label')).toHaveCount(0);
  await expect(page.locator('.source-panel')).toHaveCount(9);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://anavanzin.com/atlas/nacao-como-mulher/');
  await context.close();
});

test('language, filters and modes are keyboard-accessible', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A Nação como Mulher');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Nation as a Woman');
  expect(await page.evaluate(() => localStorage.getItem('av_lang'))).toBe('en');

  await page.getByRole('button', { name: 'war', exact: true }).click();
  await expect(page.locator('.object-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  const figure = page.locator('.draggable-figure');
  await expect(figure).toBeVisible();
  const before = await figure.boundingBox();
  await figure.focus();
  await page.keyboard.press('ArrowLeft');
  const after = await figure.boundingBox();
  expect(after.x).toBeLessThan(before.x);
});

test('comparison accepts two records and labels both studies', async ({ page }) => {
  await page.goto(route);
  const select = page.getByRole('button', { name: /Selecionar para comparação/ });
  await select.nth(0).click();
  await select.nth(1).click();
  await expect(page.locator('.comparison-grid article')).toHaveCount(2);
  await expect(page.locator('.comparison-grid article img')).toHaveCount(2);
});

for (const width of [390, 320]) {
  test(`exhibition has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('the Atlas advertises the thematic exhibition', async ({ page }) => {
  await page.goto('/atlas/');
  const card = page.getByRole('link', { name: /A Nação como Mulher/ });
  await expect(card).toHaveAttribute('href', '/atlas/nacao-como-mulher/');
});


test('Atlas cards preserve the four existing destinations', async ({ page }) => {
  await page.goto('/atlas/');
  for (const slug of ['justitia', 'marianne', 'britannia', 'republica']) {
    const link = page.locator(`#grid a[href="${slug}.html"]`);
    await expect(link).toHaveCount(1);
    const response = await page.request.get(`/atlas/${slug}.html`);
    expect(response.status()).toBe(200);
  }
});

test('English Explore respects theme, semantics and sticky controls', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Filter by theme' })).toBeVisible();
  await page.getByRole('button', { name: 'war', exact: true }).click();
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  const selected = page.locator('.object-tabs button[aria-pressed="true"]');
  await expect(selected).toHaveCount(1);
  await expect(page.locator('.explore-meta h2')).toHaveText(await selected.textContent());
  await expect(page.locator('.living-text [aria-hidden="true"]')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Objects to explore' })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 1800));
  await expect(page.locator('.site-bar')).toBeInViewport();
  await expect(page.locator('.toolbar')).toBeInViewport();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.explore-meta .eyebrow')).toContainText('later editions');
});

test('figure stays within narrow stage when moved and resized', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(route);
  await page.getByRole('button', { name: 'Explorar' }).click();
  const figure = page.locator('.draggable-figure');
  await figure.focus();
  const initial = await figure.boundingBox();
  await page.keyboard.press('-');
  expect((await figure.boundingBox()).width).toBeLessThanOrEqual(initial.width);
  for (let i = 0; i < 40; i++) await page.keyboard.press('+');
  for (let i = 0; i < 150; i++) await page.keyboard.press('ArrowDown');
  const bounds = await page.locator('.living-text').boundingBox();
  const moved = await figure.boundingBox();
  expect(moved.width).toBeLessThanOrEqual(bounds.width);
  expect(moved.y + moved.height).toBeLessThanOrEqual(bounds.y + bounds.height);
  expect(bounds.height).toBeLessThan(1500);
});

test('prerendered edition qualifies counts and defers later plates', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.locator('.corpus-note')).toContainText('não devem ser somadas');
  expect(await page.locator('.object-card img[loading="eager"]').count()).toBe(2);
  expect(await page.locator('.object-card img[loading="lazy"]').count()).toBe(7);
  await context.close();
});
