import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium, expect } from '@playwright/test';

const base = 'http://127.0.0.1:8101';
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
const errors = [];
const failures = [];
fs.mkdirSync('test-results/montesquieu', {recursive:true});
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => {if(r.url().startsWith(base) && r.status() >= 400) failures.push([r.status(),r.url()]);});
  await page.goto(base + '/montesquieu/');
  await page.evaluate(async()=>{await caches.open('unrelated-site-cache'); await caches.open('anavanzin-montesquieu-old');});
  await expect(page.locator('#curtain-browse-btn')).toBeVisible();
  await page.locator('#curtain-browse-btn').click();
  await page.locator('#next-slide').click();
  await expect(page).toHaveURL(/\/montesquieu\/slide\/2$/);
  await expect(page.locator('#banner-slide-label')).toHaveText('02');
  await page.reload();
  await expect(page.locator('#banner-slide-label')).toHaveText('02');
  const annotationsBefore = await page.locator('#header-annotations-btn').getAttribute('aria-pressed');
  await page.locator('#header-annotations-btn').click();
  await expect(page.locator('#header-annotations-btn')).toHaveAttribute('aria-pressed', annotationsBefore === 'true' ? 'false' : 'true');
  await page.keyboard.press('s');
  await expect(page.locator('#studio-drawer')).toBeVisible();
  assert.equal(await page.locator('[data-studio-tab]').count(),1);
  await page.locator('[data-timeline-filter="constitutional"]').click();
  await expect(page.locator('[data-timeline-filter="constitutional"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('#studio-drawer-close').click();
  await expect(page.locator('#studio-drawer')).toBeHidden();
  await page.keyboard.press('m');
  await expect(page.locator('#meridian-canvas-mount canvas')).toBeAttached({timeout:15000});
  await page.locator('#meridian-3d-close').click();
  await page.screenshot({path:'test-results/montesquieu/desktop.png'});

  // Exercise the actual section controls: they use fragment links and dialogs,
  // rather than navigating to root-absolute /sources, /landing or /stories.
  await Promise.all([
    page.waitForURL(base + '/montesquieu/#sources'),
    page.locator('.header__nav a[href="#sources"]').click(),
  ]);
  await expect(page.locator('#sources-title')).toBeInViewport();
  assert.ok(new URL(page.url()).pathname.startsWith('/montesquieu/'));
  await page.reload();
  await expect(page.locator('#sources-title')).toBeInViewport();
  await Promise.all([
    page.waitForURL(base + '/montesquieu/#slide-1'),
    page.locator('#sources a[href="#slide-1"]').click(),
  ]);
  await page.waitForLoadState('load');
  await expect(page.locator('#banner-slide-label')).toHaveText('01');
  assert.ok(new URL(page.url()).pathname.startsWith('/montesquieu/'));
  await page.locator('#header-stories-btn').click();
  await expect(page.locator('#stories-preview-dialog')).toBeVisible();
  assert.ok(new URL(page.url()).pathname.startsWith('/montesquieu/'));
  await page.locator('#stories-view-landing-btn').click();
  await expect(page.locator('#podium-curtain')).toBeVisible();
  assert.ok(new URL(page.url()).pathname.startsWith('/montesquieu/'));
  await page.locator('#curtain-browse-btn').click();
  await page.locator('#header-landing-btn').click();
  await expect(page.locator('#podium-curtain')).toBeVisible();
  assert.ok(new URL(page.url()).pathname.startsWith('/montesquieu/'));
  await page.locator('#curtain-browse-btn').click();

  for (const route of ['sources', 'landing', 'stories']) {
    const response = await page.goto(base + '/montesquieu/' + route);
    assert.equal(response.status(),200);
    await expect(page.locator('html')).toHaveAttribute('data-initial-view', route);
    assert.ok(new URL(page.url()).pathname.startsWith('/montesquieu/'));
    if (route === 'sources') await expect(page.locator('#sources-title')).toBeInViewport();
    if (route === 'stories') await expect(page.locator('#stories-preview-dialog')).toBeVisible();
    if (route === 'landing') await expect(page.locator('#podium-curtain')).toBeVisible();
    await expect(page).toHaveURL(base + '/montesquieu/' + route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://anavanzin.com/montesquieu/' + route);
    const reloaded = await page.reload();
    assert.equal(reloaded.status(),200);
    await expect(page.locator('html')).toHaveAttribute('data-initial-view', route);
    if (route === 'sources') await expect(page.locator('#sources-title')).toBeInViewport();
    if (route === 'stories') await expect(page.locator('#stories-preview-dialog')).toBeVisible();
    if (route === 'landing') await expect(page.locator('#podium-curtain')).toBeVisible();
    await expect(page).toHaveURL(base + '/montesquieu/' + route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://anavanzin.com/montesquieu/' + route);
  }

  await page.goto(base + '/montesquieu/slide/1');
  for (let i=1;i<=7;i++) {
    await page.locator(`.header__nav [data-slide-link="${i}"]`).click();
    await expect(page).toHaveURL(new RegExp('/montesquieu/slide/' + i + '$'));
    await expect(page.locator('#banner-slide-label')).toHaveText(String(i).padStart(2,'0'));
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), new RegExp('/montesquieu/slide/' + i + '$'));
    const response = await page.reload();
    assert.equal(response.status(),200);
    await expect(page.locator('#banner-slide-label')).toHaveText(String(i).padStart(2,'0'));
  }
  const registrations = await page.evaluate(async()=>{
    await navigator.serviceWorker.ready;
    return (await navigator.serviceWorker.getRegistrations()).map(r=>r.scope);
  });
  assert.deepEqual(registrations,[base + '/montesquieu/']);
  assert.ok((await page.evaluate(()=>caches.keys())).includes('unrelated-site-cache'));
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#banner-slide-label')).toHaveText('07');
  await context.setOffline(false);
  await context.close();

  for (const viewport of [{width:390,height:844},{width:844,height:390}]) {
    const mobile = await browser.newContext({viewport,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const page = await mobile.newPage();
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(base + '/montesquieu/slide/3');
    await expect(page.locator('#slide-3')).toBeVisible();
    await expect(page.locator('#banner-slide-label')).toHaveText('03');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth + 1), 'Mobile page overflows horizontally');
    await page.screenshot({path:`test-results/montesquieu/mobile-${viewport.width}.png`});
    await mobile.close();
  }
  assert.deepEqual(errors,[]);
  assert.deepEqual(failures,[]);
  console.log('Verified: poster, slide navigation/reload, annotations, timeline, 3D, section controls/deep links/reloads, seven slide links/reloads, isolated offline reading, mobile portrait and landscape.');
} finally { await browser.close(); }
