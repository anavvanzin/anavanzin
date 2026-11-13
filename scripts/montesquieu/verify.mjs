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

  for (let i=1;i<=7;i++) {
    const response = await page.goto(base + '/montesquieu/slide/' + i);
    assert.equal(response.status(),200);
    await expect(page.locator('#banner-slide-label')).toHaveText(String(i).padStart(2,'0'));
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), new RegExp('/montesquieu/slide/' + i + '$'));
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
  console.log('Verified: poster, slide navigation/reload, annotations, timeline, 3D, seven deep links, isolated offline reading, mobile portrait and landscape.');
} finally { await browser.close(); }
