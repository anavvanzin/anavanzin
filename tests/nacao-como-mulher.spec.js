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
  await expect(page.locator('.hero-kicker')).toHaveText('ICONOCRACIA · exposição 01 · 2026');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Nation as a Woman');
  await expect(page.locator('.hero-kicker')).toHaveText('ICONOCRACIA · exhibition 01 · 2026');
  expect(await page.evaluate(() => localStorage.getItem('av_lang'))).toBe('en');
  await page.reload();
  await expect(page.locator('.hero-kicker')).toHaveText('ICONOCRACIA · exhibition 01 · 2026');
  await page.getByRole('button', { name: 'PT', exact: true }).click();
  await expect(page.locator('.hero-kicker')).toHaveText('ICONOCRACIA · exposição 01 · 2026');
  await page.getByRole('button', { name: 'EN', exact: true }).click();

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

for (const width of [390, 320, 768, 1280]) {
  test(`exhibition has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator('.object-card')).toHaveCount(9);
    if (width < 621) {
      await expect(page.locator('.draggable-figure')).toHaveCount(0);
      await expect(page.locator('.reading-layers')).toHaveCount(9);
    } else {
      await expect(page.locator('.draggable-figure')).toHaveCount(9);
      for (const lang of ['pt', 'en']) {
        if (lang === 'en') await page.getByRole('button', { name: 'EN', exact: true }).click();
        await page.evaluate(() => document.fonts.ready);
        const clipped = await page.locator('.living-text').evaluateAll(stages => stages.flatMap(stage => {
          const box = stage.getBoundingClientRect();
          return [...stage.querySelectorAll('.living-line')].filter(line => {
            const r = line.getBoundingClientRect();
            return r.left < box.left - 1 || r.right > box.right + 1 || r.bottom > box.bottom + 1;
          }).map(line => line.textContent);
        }));
        expect(clipped).toEqual([]);
      }
    }
  });
}

test('reading relayouts on drag, supports keyboard, full plates and reset', async ({ page }) => {
  await page.goto(route);
  const spread = page.locator('.reading-spread').first();
  const figure = spread.locator('.draggable-figure');
  await figure.scrollIntoViewIfNeeded();
  await figure.evaluate(el => window.scrollBy(0, el.getBoundingClientRect().top - 240));
  const initial = await figure.boundingBox();
  const linesBefore = await spread.locator('.living-line').allTextContents();
  await page.mouse.move(initial.x + initial.width / 2, initial.y + 20);
  await page.mouse.down();
  await page.mouse.move(initial.x + initial.width / 2 - 180, initial.y + 40, { steps: 8 });
  await page.mouse.up();
  expect((await figure.boundingBox()).x).toBeLessThan(initial.x);
  expect(await spread.locator('.living-line').allTextContents()).not.toEqual(linesBefore);
  await figure.focus();
  const before = await figure.boundingBox();
  await page.keyboard.press('ArrowLeft');
  expect((await figure.boundingBox()).x).toBeLessThan(before.x);
  await page.keyboard.press('+');
  expect((await figure.boundingBox()).width).toBeGreaterThan(before.width);
  await page.keyboard.press('Enter');
  await expect(figure.locator('img')).toHaveAttribute('src', /-atlas.webp$/);
  const overlapping = await spread.locator('.living-text').evaluate(stage => {
    const image = stage.querySelector('.draggable-figure').getBoundingClientRect();
    return [...stage.querySelectorAll('.living-line')].filter(line => {
      const r = line.getBoundingClientRect();
      return r.left < image.right && r.right > image.left && r.top < image.bottom && r.bottom > image.top;
    }).map(line => line.textContent);
  });
  expect(overlapping).toEqual([]);
  await spread.getByRole('button', { name: 'Repor figura' }).click();
  const reset = await figure.boundingBox();
  expect(reset.width).toBeCloseTo(initial.width, 0);
  expect(reset.x).toBeCloseTo(initial.x, 0);
});

test('touch reading remains scrollable and uses stable plates', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.locator('.draggable-figure')).toHaveCount(0);
  await page.getByRole('button', { name: 'EN', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Nation as a Woman');
  await page.locator('.object-card').last().scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(2000);
  await page.getByRole('button', { name: 'Explore', exact: true }).tap();
  const figure = page.locator('.draggable-figure');
  await figure.scrollIntoViewIfNeeded();
  await figure.evaluate(el => window.scrollBy(0, el.getBoundingClientRect().top - 240));
  const box = await figure.boundingBox();
  const session = await context.newCDPSession(page);
  const point = { x: box.x + box.width / 2, y: box.y + 20 };
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...point, x: point.x - 30 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(async () => (await figure.boundingBox()).x).toBeLessThan(box.x);
  await context.close();
});

test('Trabalhos includes the bilingual exhibition card and preserves ICONOCRACIA', async ({ page }) => {
  await page.goto('/trabalhos.html');
  await expect(page.getByRole('heading', { name: 'A Nação como Mulher', exact: true })).toBeVisible();
  await expect(page.locator('a[href="https://anavanzin.com/trabalhos/iconocracia/"]').first()).toBeAttached();
  await page.evaluate(() => { localStorage.setItem('av_lang', 'en'); });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'The Nation as a Woman', exact: true })).toBeVisible();
});

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
  await expect(page.locator('.living-text .living-line').first()).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Objects to explore' })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 1800));
  await expect(page.locator('.site-bar')).toBeInViewport();
  await expect(page.locator('.toolbar')).toBeInViewport();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.explore-meta .eyebrow')).toContainText('1628 (reference edition)');
});

async function expectReadableStage(page) {
  // Rejoin the painted lines: no omitted text or words split across narrow slivers.
  await expect.poll(() => page.locator('.living-text').evaluate(stage => {
    // A break after an existing hyphen (e.g. EU-1628) is a valid word boundary.
    const normalize = text => text.replace(/-\s+/g, '-').replace(/\s+/g, ' ').trim();
    const painted = [...stage.querySelectorAll('.living-line')].map(line => line.textContent).join(' ');
    const semantic = [...stage.querySelectorAll('.sr-only h3, .sr-only dt, .sr-only dd')].map(el => el.textContent).join(' ');
    return normalize(painted) === normalize(semantic);
  })).toBe(true);
  await expect.poll(() => page.locator('.living-text').evaluate(stage => {
    const box = stage.getBoundingClientRect();
    return [...stage.querySelectorAll('.living-line, .draggable-figure')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1;
    }).length;
  })).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
}

for (const width of [320, 390]) for (const lang of ['pt', 'en']) {
test(`Explore preserves readable text and keyboard controls at ${width}px (${lang})`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  if (lang === 'en') await page.getByRole('button', { name: 'EN', exact: true }).click();
  const explore = page.getByRole('button', { name: lang === 'pt' ? 'Explorar' : 'Explore', exact: true });
  await explore.focus();
  await page.keyboard.press('Enter');
  const stage = page.locator('.living-text');
  const figure = page.locator('.draggable-figure');
  const actions = page.locator('.explore-actions button');
  await actions.first().focus();
  for (let i = 1; i < 4; i++) {
    await page.keyboard.press('Tab');
    await expect(actions.nth(i)).toBeFocused();
  }
  await page.keyboard.press('Tab');
  await expect(figure).toBeFocused();
  await expectReadableStage(page);
  const initial = await figure.boundingBox();
  await page.keyboard.press('-');
  await expect.poll(async () => (await figure.boundingBox()).width).toBeLessThan(initial.width);
  for (let i = 0; i < 40; i++) await page.keyboard.press('+');
  for (let i = 0; i < 150; i++) await page.keyboard.press('ArrowDown');
  await expectReadableStage(page);
  await expect.poll(() => figure.evaluate(el => {
    const rect = el.getBoundingClientRect();
    const toolbar = document.querySelector('.toolbar').getBoundingClientRect();
    return rect.top >= toolbar.bottom && rect.bottom <= window.innerHeight;
  })).toBe(true);
  const boundary = await figure.evaluate(el => ({ top: el.style.top, width: el.style.width }));
  const height = (await stage.boundingBox()).height;
  // Height depends on prose and wrapping. Moving beyond the boundary must not grow it.
  for (let i = 0; i < 50; i++) await page.keyboard.press('ArrowDown');
  await expect.poll(() => figure.evaluate(el => ({ top: el.style.top, width: el.style.width }))).toEqual(boundary);
  expect((await stage.boundingBox()).height).toBe(height);
  await page.keyboard.press('Enter');
  await expect(figure.locator('img')).toHaveAttribute('src', /-atlas\.webp$/);
  await expectReadableStage(page);
  expect(await stage.evaluate(stage => {
    const image = stage.querySelector('.draggable-figure').getBoundingClientRect();
    return [...stage.querySelectorAll('.living-line')].filter(line => {
      const r = line.getBoundingClientRect();
      return r.left < image.right && r.right > image.left && r.top < image.bottom && r.bottom > image.top;
    }).length;
  })).toBe(0);

  // A live resize must reflow the same object, keep focus and retain the selected plate.
  await page.setViewportSize({ width: width === 320 ? 390 : 320, height: 844 });
  await expectReadableStage(page);
  await expect(figure).toBeFocused();
  await expect(figure.locator('img')).toHaveAttribute('src', /-atlas\.webp$/);
  await page.setViewportSize({ width, height: 844 });
  await expectReadableStage(page);
  await page.keyboard.press('Enter');
  await expect(figure.locator('img')).toHaveAttribute('src', /-cut\.webp$/);
  for (let i = 0; i < 3; i++) await page.keyboard.press('Shift+Tab');
  await expect(actions.nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await figure.boundingBox()).width).toBeCloseTo(initial.width, 0);
  await expectReadableStage(page);
  for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
  const source = page.locator('.explore-section .source-panel');
  await expect(source.locator('summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(source).toHaveAttribute('open', '');
  await expect(source.locator('.source-grid')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  // Tab through the horizontal object selector; every record must remain readable.
  const tabs = page.locator('.object-tabs button');
  await tabs.first().focus();
  for (let i = 0; i < 9; i++) {
    await expect(tabs.nth(i)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(tabs.nth(i)).toHaveAttribute('aria-pressed', 'true');
    await expectReadableStage(page);
    if (i < 8) await page.keyboard.press('Tab');
  }
});
}

test('prerendered edition qualifies counts and defers later plates', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.locator('.corpus-note')).toContainText('não devem ser somadas');
  expect(await page.locator('.object-card img[loading="eager"]').count()).toBe(2);
  expect(await page.locator('.object-card img[loading="lazy"]').count()).toBe(7);
  await context.close();
});


