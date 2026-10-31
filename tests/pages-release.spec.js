const {test, expect} = require('@playwright/test');

test.use({serviceWorkers:'block',locale:'pt-BR',reducedMotion:'reduce'});
test.skip(!process.env.PAGES_UI_TEST_URL, 'Requires the local Pages release artifact.');

for (const width of [1440,390,320]) {
  test(`Pages release: language, index and navigation at ${width}px`, async ({page,context,baseURL}) => {
    const errors = [];
    const failedAssets = [];
    const origin = new URL(baseURL).origin;
    await context.route('**/*', route => {
      const request = route.request();
      if (new URL(request.url()).origin !== origin || !['GET','HEAD'].includes(request.method())) {
        return route.abort('blockedbyclient');
      }
      return route.continue();
    });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (new URL(response.url()).origin === origin && response.status() >= 400) {
        failedAssets.push(response.url());
      }
    });
    await page.setViewportSize({width,height:900});
    expect((await page.goto('/')).status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await page.locator('.study-inspiration img').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('.study-inspiration img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.getByRole('button',{name:'EN',exact:true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await page.locator('.index-toggle').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#site-index')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-index')).not.toBeVisible();
    if (width < 1000) {
      await page.locator('.menu-trigger').click();
      await expect(page.locator('.menu-trigger')).toHaveAttribute('aria-expanded','true');
    }
    await page.locator('.nav-links a[href="/metodologia/"]').click();
    await expect(page).toHaveURL(/\/metodologia\/$/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await page.goto('/');
    await page.locator('.feature-link[href="/defesa/"]').click();
    await expect(page).toHaveURL(/\/defesa\/$/);
    await expect(page.getByRole('heading',{name:'Dissertation defense',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'PT',exact:true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    expect(failedAssets).toEqual([]);
  });
}
