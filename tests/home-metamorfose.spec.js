const { test, expect } = require('@playwright/test');

const widths = [320, 390, 768, 1024, 1440];
const languages = ['pt', 'en'];
const destinations = ['/sobre', '/atlas/', '/publicacoes/', '/metodologia/', '/quotes/'];
const activityByPage = new WeakMap();

test.use({ serviceWorkers: 'block' });

test.beforeEach(async ({ page, context, baseURL }) => {
  const origin = new URL(baseURL).origin;
  const activity = { stateOrAPI: [], writes: [], mp4: [], fontCDN: [], errors: [] };
  activityByPage.set(page, activity);
  page.on('pageerror', error => activity.errors.push(error.message));
  page.on('request', request => {
    const url = new URL(request.url());
    if (/\/(?:api|_state)(?:\/|$)/.test(url.pathname)) activity.stateOrAPI.push(url.href);
    if (url.origin === origin && !['GET', 'HEAD'].includes(request.method())) activity.writes.push(url.href);
    if (/\.mp4(?:$|\/)/i.test(url.pathname)) activity.mp4.push(url.href);
    if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) activity.fontCDN.push(url.href);
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
  const activity = activityByPage.get(page);
  expect(activity.stateOrAPI, 'Home and navigation checks never access API/KV routes').toEqual([]);
  expect(activity.writes, 'No write reaches the preview server').toEqual([]);
  expect(activity.mp4, 'Home checks never request a removed hero video').toEqual([]);
  expect(activity.fontCDN, 'Typography loads from the site, without downloading Google Fonts').toEqual([]);
  expect(activity.errors, 'Navigation and panel controls complete without JavaScript errors').toEqual([]);
});

async function openHome(page, width, lang, reducedMotion = 'reduce') {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion });
  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response.status()).toBe(200);
  await expect(page.locator('html')).not.toHaveClass(/av-loading/);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(`.lang button[data-lang="${lang}"]`).click();
  await assertLanguageAndBrand(page, lang);
}

async function assertLanguageAndBrand(page, lang) {
  await expect(page.locator('html')).toHaveAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  await expect(page.locator(`.lang button[data-lang="${lang}"]`)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('av_lang'))).toBe(lang);
  const brand = page.locator('.home-brand');
  await expect(brand).toHaveAttribute('href', '/');
  await expect(brand).toHaveAccessibleName(lang === 'pt' ? 'Ana Vanzin · início' : 'Ana Vanzin · home');
  await expect(brand).toBeVisible();
  await expect(page.locator('.mm-index-toggle')).toHaveAccessibleName(/\S/);
  await expect(page.locator('.mm-index-toggle')).toHaveAttribute('aria-controls', 'mm-index');
}

async function assertPanels(page, width, panel = null) {
  const mobile = width <= 1000;
  await expect(page.locator('.mm-trigger')).toHaveAttribute('aria-expanded', String(panel === 'menu'));
  await expect(page.locator('.mm-index-toggle')).toHaveAttribute('aria-expanded', String(panel === 'index'));
  expect(await page.locator('#mm-index').evaluate(dialog => dialog instanceof HTMLDialogElement)).toBe(true);
  if (panel === 'index') {
    await expect(page.locator('#mm-index')).toBeVisible();
    expect(await page.locator('#mm-index').evaluate(dialog => dialog.open && dialog.matches(':modal'))).toBe(true);
  } else {
    await expect(page.locator('#mm-index')).toBeHidden();
    expect(await page.locator('#mm-index').evaluate(dialog => dialog.open)).toBe(false);
  }
  if (mobile) {
    await expect(page.locator('.mm-trigger')).toBeVisible();
    await expect(page.locator('.mm-trigger')).toHaveAccessibleName(/\S/);
    await expect(page.locator('.mm-trigger')).toHaveAttribute('aria-controls', 'mm-nav');
    if (panel === 'menu') await expect(page.locator('#mm-nav')).toBeVisible();
    else await expect(page.locator('#mm-nav')).toBeHidden();
  } else {
    await expect(page.locator('.mm-trigger')).toBeHidden();
    await expect(page.locator('#mm-nav')).toBeVisible();
  }
}

async function assertNoOverflow(page) {
  const problems = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const issues = [];
    if (document.documentElement.scrollWidth > width + 1 || document.body.scrollWidth > width + 1) issues.push('document horizontal overflow');
    const selector = '.home-brand, .mm-trigger, .mm-index-toggle, .lang button, .nav > nav > a, #mm-index a, #mm-index button, #mm-index h2, #name, .defense-feature p, .defense-link, .methodology-feature h2, .methodology-feature p, .methodology-feature a';
    for (const element of document.querySelectorAll(selector)) {
      if (!element.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) continue;
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) continue;
      const label = `${element.tagName}.${element.className}`;
      if (bounds.left < -1 || bounds.right > width + 1) issues.push(`${label} outside viewport`);
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        for (const text of range.getClientRects()) {
          if (text.left < -1 || text.right > width + 1) issues.push(`${label} text outside viewport`);
          for (let parent = element; parent; parent = parent.parentElement) {
            const css = getComputedStyle(parent);
            const clip = parent.getBoundingClientRect();
            if (['hidden', 'clip'].includes(css.overflowX) && (text.left < clip.left - 2 || text.right > clip.right + 2)) issues.push(`${label} text clipped horizontally`);
          }
        }
      }
    }
    return [...new Set(issues)];
  });
  expect(problems, 'Navigation, panels and reading content fit the CSS viewport').toEqual([]);
}

async function assertStaticHome(page) {
  await expect(page.locator('.home-hero video, .home-hero figure, .portrait-control')).toHaveCount(0);
  await expect(page.locator('#name')).toBeVisible();
  await expect(page.locator('.hero-copy .intro')).toBeVisible();
  expect(await page.locator('.home-hero').evaluate(hero => hero.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
}

test('regression: queued dialog close preserves an index reopened in the same turn', async ({ page }) => {
  await openHome(page, 390, 'pt');
  await page.evaluate(async () => {
    const dialog = document.querySelector('#mm-index');
    const trigger = document.querySelector('.mm-index-toggle');
    const closed = new Promise(resolve => dialog.addEventListener('close', resolve, { once: true }));
    trigger.click();
    dialog.querySelector('[data-open-menu]').click();
    trigger.click();
    await closed;
  });
  await assertPanels(page, 390, 'index');
  await expect(page).toHaveURL(url => url.hash === '#indice');
});

for (const width of widths) {
  test(`panel history, exclusivity, Escape and focus in PT/EN at ${width}px`, async ({ page }) => {
    for (const lang of languages) {
      await openHome(page, width, lang);
      await assertPanels(page, width);
      await expect(page.locator('.nav > nav > a')).toHaveCount(8);
      if (width <= 1000) {
        await page.locator('.mm-trigger').focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(url => url.hash === '#menu');
        await assertPanels(page, width, 'menu');
        await page.keyboard.press('Escape');
        await expect(page).toHaveURL(url => url.hash === '');
        await assertPanels(page, width);
        await expect(page.locator('.mm-trigger')).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(url => url.hash === '#menu');
        await assertPanels(page, width, 'menu');
        await page.locator('.mm-index-toggle').click();
        await expect(page).toHaveURL(url => url.hash === '#indice');
        await assertPanels(page, width, 'index');
        // Switching panels replaces the single panel history entry.
        await page.goBack();
        await expect(page).toHaveURL(url => url.hash === '');
        await assertPanels(page, width);
        await page.goForward();
        await expect(page).toHaveURL(url => url.hash === '#indice');
        await assertPanels(page, width, 'index');
        await page.keyboard.press('Escape');
        await expect(page).toHaveURL(url => url.hash === '');
        await assertPanels(page, width);
        await expect(page.locator('.mm-index-toggle')).toBeFocused();
      }

      await page.locator('.mm-index-toggle').focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(url => url.hash === '#indice');
      await assertPanels(page, width, 'index');
      for (let step = 0; step < 12; step++) {
        await page.keyboard.press('Tab');
        expect(await page.locator('#mm-index').evaluate(dialog => dialog.contains(document.activeElement)), 'Native modal keeps keyboard focus inside its panel').toBe(true);
      }
      await page.keyboard.press('Escape');
      await assertPanels(page, width);
      await expect(page.locator('.mm-index-toggle')).toBeFocused();

      await page.locator('.mm-index-toggle').click();
      await assertPanels(page, width, 'index');
      await page.goBack();
      await expect(page).toHaveURL(url => url.hash === '');
      await assertPanels(page, width);
      await page.goForward();
      await assertPanels(page, width, 'index');
      await page.locator('.mm-index-close').click();
      await assertPanels(page, width);
      await expect(page.locator('.mm-index-toggle')).toBeFocused();

      await page.locator('.mm-index-toggle').click();
      const switchToMenu = page.locator('#mm-index [data-open-menu]');
      if (width <= 1000) {
        await expect(switchToMenu).toBeVisible();
        await switchToMenu.click();
        await expect(page).toHaveURL(url => url.hash === '#menu');
        await assertPanels(page, width, 'menu');
        await page.goBack();
        await expect(page).toHaveURL(url => url.hash === '');
        await assertPanels(page, width);
        await page.goForward();
        await expect(page).toHaveURL(url => url.hash === '#menu');
        await assertPanels(page, width, 'menu');
      } else await expect(switchToMenu).toBeHidden();
      await page.keyboard.press('Escape');
      await expect(page).toHaveURL(url => url.hash === '');
      await assertPanels(page, width);
      await expect(page.locator(width <= 1000 ? '.mm-trigger' : '.mm-index-toggle')).toBeFocused();
      await assertLanguageAndBrand(page, lang);
    }
  });

  test(`text hero, reduced motion and 200% root text reflow at ${width}px`, async ({ page }, testInfo) => {
    for (const lang of languages) {
      for (const fontSize of ['16px', '32px']) {
        await openHome(page, width, lang);
        await page.evaluate(size => { document.documentElement.style.fontSize = size; }, fontSize);
        await expect(page.locator('html')).toHaveCSS('font-size', fontSize);
        await assertStaticHome(page);
        await assertNoOverflow(page);
        if (width <= 1000) {
          await page.locator('.mm-trigger').click();
          await assertPanels(page, width, 'menu');
          await assertNoOverflow(page);
          expect(await page.locator('#mm-nav').evaluate(nav => nav.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
          await page.keyboard.press('Escape');
        }
        await page.locator('.mm-index-toggle').click();
        await assertPanels(page, width, 'index');
        await assertNoOverflow(page);
        expect(await page.locator('#mm-index').evaluate(dialog => dialog.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
        const lastLink = page.locator('#mm-index a[href]').last();
        await lastLink.scrollIntoViewIfNeeded();
        await expect(lastLink).toBeInViewport();
        if (fontSize === '32px') await testInfo.attach(`index-${lang}-${width}-200-percent-text`, { body: await page.screenshot(), contentType: 'image/png' });
        await page.keyboard.press('Escape');
        await assertPanels(page, width);
      }
    }
  });
}

for (const width of [390, 1440]) {
  test(`header destinations and internal brand return to home in PT/EN at ${width}px`, async ({ page }) => {
    for (const lang of languages) {
      for (const path of destinations) {
        await openHome(page, width, lang);
        if (width <= 1000) await page.locator('.mm-trigger').click();
        const navigation = page.waitForResponse(response => response.request().isNavigationRequest() && new URL(response.url()).pathname === path);
        await page.locator(`.nav > nav > a[href="${path}"]`).click();
        expect((await navigation).status(), `Navigation document ${path}`).toBe(200);
        await expect(page).toHaveURL(url => url.pathname === path);
        const internalBrand = path === '/quotes/' ? page.locator('.quotes-brand[href="/"]') : page.locator('.ed-bar > a.brand[href="/"]');
        await expect(internalBrand).toBeVisible();
        await expect(internalBrand).toHaveAccessibleName(/ana vanzin/i);
        if (path !== '/quotes/') {
          await expect.poll(() => internalBrand.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
        }
        await internalBrand.click();
        await expect(page).toHaveURL(url => url.pathname === '/' && url.hash === '');
        await assertLanguageAndBrand(page, lang);
        await expect(page.locator('.home-brand')).toHaveAttribute('href', '/');
        await page.locator('.home-brand').click();
        await expect(page).toHaveURL(url => url.pathname === '/' && url.hash === '');
        await assertLanguageAndBrand(page, lang);
      }
    }
  });
}

test('keyboard focus on the first board link has at least 3:1 contrast on mobile and desktop', async ({ page }, testInfo) => {
  for (const width of [390, 1440]) {
    await openHome(page, width, 'pt');
    const link = page.locator('.board a[href]').first();
    for (let step = 0; step < 70; step += 1) {
      await page.keyboard.press('Tab');
      if (await link.evaluate(element => element === document.activeElement)) break;
    }
    await expect(link).toBeFocused();
    await expect(link).toBeVisible();
    await expect(link).toBeInViewport();
    const focus = await link.evaluate(element => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const rgba = cssColor => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = cssColor;
        context.fillRect(0, 0, 1, 1);
        const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
        return [r, g, b, alpha / 255];
      };
      const over = (foreground, background) => foreground.slice(0, 3).map((channel, index) => channel * foreground[3] + background[index] * (1 - foreground[3]));
      const layers = [];
      let opaqueBackground = false;
      // The outline sits outside the link, so its adjacent background comes
      // from the ancestors, including any translucent background layers.
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        const css = getComputedStyle(parent);
        if (css.backgroundImage !== 'none') throw new Error('Focus contrast requires measuring the image painted behind the outline');
        if (Number(css.opacity) !== 1) throw new Error('Focus contrast requires accounting for ancestor opacity');
        const color = rgba(css.backgroundColor);
        layers.push(color);
        if (color[3] === 1) {
          opaqueBackground = true;
          break;
        }
      }
      const background = layers.reverse().reduce((result, color) => over(color, result), [255, 255, 255]);
      const css = getComputedStyle(element);
      const outline = rgba(css.outlineColor);
      const paintedOutline = over(outline, background);
      // WCAG relative luminance and contrast ratio, without rounding.
      const luminance = color => color.map(channel => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      }).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
      const light = Math.max(luminance(paintedOutline), luminance(background));
      const dark = Math.min(luminance(paintedOutline), luminance(background));
      return {
        focusVisible: element.matches(':focus-visible'),
        outlineStyle: css.outlineStyle,
        outlineWidth: parseFloat(css.outlineWidth),
        outlineOffset: parseFloat(css.outlineOffset),
        outlineAlpha: outline[3],
        opaqueBackground,
        background,
        paintedOutline,
        contrast: (light + 0.05) / (dark + 0.05),
      };
    });
    expect(focus.focusVisible, 'Real Tab navigation activates the visible focus indicator').toBe(true);
    expect(['none', 'hidden']).not.toContain(focus.outlineStyle);
    expect(focus.outlineWidth, 'Focus indicator has a visible thickness').toBeGreaterThanOrEqual(2);
    expect(focus.outlineOffset, 'The measured outline sits against the surrounding board background').toBeGreaterThanOrEqual(0);
    expect(focus.outlineAlpha).toBeGreaterThan(0);
    expect(focus.opaqueBackground, 'The measured background includes an opaque painted ancestor').toBe(true);
    expect(focus.contrast, 'Focus indicator contrasts with its actual adjacent background').toBeGreaterThanOrEqual(3);
    await testInfo.attach(`board-keyboard-focus-${width}`, { body: JSON.stringify(focus, null, 2), contentType: 'application/json' });
  }
});
