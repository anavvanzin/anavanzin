const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const paths = ['/seminario8-dever-poder/', '/prot-tipo/', '/algoritmo-em-disputa/'];

for (const width of [1440, 390, 320]) {
  test(`works and related pieces remain navigable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/trabalhos.html');
    for (const lang of ['en', 'pt']) {
      await page.locator(`#langtog button[data-lang="${lang}"]`).click();
      await expect(page.locator('#title')).toHaveText(lang === 'pt' ? 'Trabalhos & Seminários' : 'Works & Seminars');
      const clipped = await page.locator('.bar a, .bar button, .entry .lk').evaluateAll(elements => {
        const width = document.documentElement.clientWidth;
        return elements.filter(element => {
          const bounds = element.getBoundingClientRect();
          return bounds.left < -1 || bounds.right > width + 1 || element.scrollWidth > element.clientWidth + 1;
        }).map(element => element.textContent.trim());
      });
      expect(clipped, 'Navigation, PT/EN and work links fit the viewport').toEqual([]);
    }
    const seminar = page.locator('.entry').filter({ hasText: 'Do Poder-Dever ao Dever-Poder' });
    await expect(seminar).toContainText('Ana Vanzin & Vinícius Oliveira');
    for (const path of paths) await expect(seminar.locator(`a[href="${path}"]`)).toBeVisible();
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('a[href="/trabalhos"]').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  });
}

test('recovered seminar and adaptation are readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ['/trabalhos.html', '/seminario8-dever-poder/', '/seminario8-dever-poder/colegas.html', '/algoritmo-em-disputa/']) {
    await page.goto(baseURL + path);
    await expect(page.locator('h1').first()).toBeVisible();
    expect((await page.locator('body').innerText()).length).toBeGreaterThan(150);
  }
  await context.close();
});

test('seminar deck navigation and local council preserve slide position', async ({ page }) => {
  await page.goto('/seminario8-dever-poder/Seminario8.html');
  await page.waitForFunction(() => document.querySelector('deck-stage')?.goTo);
  const active = () => page.locator('deck-stage > section[data-deck-active]');
  await page.keyboard.press('ArrowRight');
  await expect(active()).toHaveAttribute('data-label', /01/);
  await page.keyboard.press('ArrowLeft');
  await expect(active()).toHaveAttribute('data-label', /00/);
  await page.evaluate(() => document.querySelector('deck-stage').goTo(32));
  await active().getByRole('button', { name: /Iniciar a Deliberação/ }).click();
  await expect(page.locator('#c-status-text')).toContainText('simulação local');
  await page.locator('#c-phases button').nth(1).click();
  await expect(page.locator('#c-main')).not.toBeEmpty();
  await page.keyboard.press('Escape');
  await expect(page.locator('#consejo-overlay')).toBeHidden();
  await expect(active()).toHaveAttribute('data-label', /32/);
});

test('prepared demonstrations issue no API or external requests', async ({ page, baseURL }) => {
  const requests = [];
  const errors = [];
  const origin = new URL(baseURL).origin;
  page.on('request', r => {
    const url = new URL(r.url());
    if (url.origin !== origin || r.method() !== 'GET' || /^\/(?:api|_state)(?:\/|$)/.test(url.pathname)) requests.push(r.url());
  });
  page.on('pageerror', e => errors.push(e.message));
  for (const path of ['/seminario8-dever-poder/Conselho.html', '/prot-tipo/', '/algoritmo-em-disputa/']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(errors).toEqual([]);
  expect(requests).toEqual([]);
});

for (const width of [1440, 390]) {
  test(`seminar council cases and phases work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/seminario8-dever-poder/Conselho.html');
    for (let i = 0; i < 4; i++) {
      const item = page.locator('.case-item').nth(i);
      await item.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#caseTitle')).not.toHaveText('Selecione um caso');
      for (let phase = 0; phase < 3; phase++) {
        await page.locator('.phase-btn').nth(phase).click();
        await expect(page.locator('#mainContent')).not.toBeEmpty();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      }
    }
  });
}

test('print companion and publication policy include only public materials', () => {
  const text = fs.readFileSync('seminario8-dever-poder/Seminario8-print.html', 'utf8');
  expect(text).toContain('DOCX de leitura');
  expect(text).toContain('casos');
  expect(fs.statSync('seminario8-dever-poder/seminario8-leitura.pdf').size).toBeGreaterThan(10000);
  expect(fs.statSync('seminario8-dever-poder/seminario8-leitura.docx').size).toBeGreaterThan(10000);
  expect(fs.existsSync('seminario8-dever-poder/dever_poder_paper.md')).toBe(false);
  expect(fs.existsSync('seminario8-dever-poder/refine-logs')).toBe(false);
});
