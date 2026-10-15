const { test, expect } = require('@playwright/test');

test.use({ reducedMotion: 'reduce' });

for (const width of [1280, 320, 390]) {
  test(`history restores a link without breaking Tab or Shift+Tab (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/estudar/');
    const links = page.locator('.exhibition-item');
    await expect(links).toHaveCount(13);
    const source = links.nth(1);
    const href = await source.getAttribute('href');
    await source.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(href));
    await expect(page.locator('#conteudo')).toBeFocused();
    await page.goBack();
    await expect(source).toBeFocused();
    await expect(source).not.toHaveAttribute('tabindex', '-1');
    await page.keyboard.press('Tab');
    await expect(links.nth(2)).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(source).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(links.nth(0)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(source).toBeFocused();
    await page.goForward();
    await expect(page).toHaveURL(new RegExp(href));
    await expect(page.locator('#conteudo')).toBeFocused();
    await page.goBack();
    await expect(source).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(links.nth(2)).toBeFocused();
  });
}

test('static hash destinations receive temporary focus, skip link still works', async ({ page }) => {
  await page.goto('/estudar/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#conteudo')).toBeFocused();
  const brand = page.locator('.hud-brand');
  await brand.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#hero')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#hero')).not.toHaveAttribute('tabindex');
});

test('small ink text meets WCAG AA on every paper surface and inverse buttons', async ({ page }) => {
  await page.goto('/estudar/');
  const ratios = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const color = (name) => style.getPropertyValue(name).trim();
    const luminance = (hex) => {
      const rgb = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255)
        .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    const contrast = (a, b) => {
      const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    const pairs = [];
    for (const ink of ['--text-primary', '--text-secondary', '--accent-void']) {
      for (const paper of [color('--bg-primary'), color('--bg-tertiary'), '#faf7ef']) {
        pairs.push({ ink, paper, ratio: contrast(color(ink), paper) });
      }
    }
    pairs.push({ ink: 'inverse on terracotta', ratio: contrast(color('--text-inverse'), color('--accent-void')) });
    pairs.push({ ink: 'accent on dark', ratio: contrast(color('--accent-on-dark'), color('--bg-secondary')) });
    return pairs;
  });
  for (const pair of ratios) expect(pair.ratio, JSON.stringify(pair)).toBeGreaterThanOrEqual(4.5);
  await page.goto('/estudar/exhibitions/fichamento-e-cornell/');
  const link = page.locator('.template-kit-link');
  await expect(link).toHaveCSS('color', 'rgb(163, 63, 27)');
  const copy = page.locator('.template-copy');
  await copy.hover();
  await expect(copy).toHaveCSS('background-color', 'rgb(163, 63, 27)');
  await expect(copy).toHaveCSS('color', 'rgb(242, 236, 220)');
});

for (const width of [320, 390]) {
  test(`mobile menu, search and note templates remain operable (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/estudar/');
    const menu = page.locator('.hud-toggle');
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('searchbox', { name: 'Buscar no acervo' }).fill('fichamento');
    await expect(page.locator('.exhibition-item')).toHaveCount(1);
    const result = page.locator('.exhibition-item');
    await result.focus();
    await page.keyboard.press('Enter');
    const picker = page.getByLabel('Tipo de anotação');
    await picker.selectOption('feynman');
    await expect(page.locator('.template-selected-heading h3')).toContainText('Feynman');
    await page.getByText('Ver texto para copiar manualmente', { exact: true }).click();
    await expect(page.locator('#note-template-text')).toContainText('Feynman');
    await expect(page.locator('.template-actions a[download]')).toHaveAttribute('href', '/estudar/templates/feynman.md');
    await expect(page.locator('.template-actions a[target]')).toHaveAttribute('href', '/estudar/templates/feynman.pdf');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goBack();
    await expect(page.getByRole('searchbox')).toHaveValue('fichamento');
    await expect(result).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('searchbox')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(result).toBeFocused();
  });
}
