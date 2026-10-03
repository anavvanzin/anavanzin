/* Focused checks for the original static case-study demonstration. */
const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const base = process.env.WORK_DEMO_URL || 'http://127.0.0.1:8097';
  const output = process.env.WORK_DEMO_EVIDENCE || path.resolve(__dirname, '../../../../validation/council');
  fs.mkdirSync(output, { recursive: true });
  const launchOptions = { headless: true };
  if (process.env.WORK_DEMO_CHROMIUM) launchOptions.executablePath = process.env.WORK_DEMO_CHROMIUM;
  const browser = await chromium.launch(launchOptions);
  const errors = [];
  const failedAssets = [];
  const requests = new Set();
  const localLinks = new Set();
  const results = [];
  const sizes = [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }, { name: 'narrow', width: 320, height: 780 }];
  try {
    for (const size of sizes) {
      const context = await browser.newContext({ viewport: { width: size.width, height: size.height } });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => requests.add(request.url()));
      page.on('response', response => { if (response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`); });
      await page.goto(`${base}/algoritmo-em-disputa/`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { level: 1, name: 'Algoritmo em Disputa', exact: true }).waitFor();
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://anavanzin.com/algoritmo-em-disputa/');
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index,follow');
      assert.equal(await page.locator('input,textarea').count(), 0);
      const links = await page.locator('a[href^="/"]').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
      links.forEach(link => localLinks.add(link));
      for (const id of ['rural', 'cadastro', 'imovel']) {
        await page.selectOption('#case-select', id);
        for (const phase of [1, 2, 3]) {
          await page.locator(`#tab-${phase}`).click();
          assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
          assert.equal(await page.locator(`#phase-${phase}`).isVisible(), true);
          assert.equal(await page.locator(`#tab-${phase}`).getAttribute('aria-selected'), 'true');
          assert.equal(new URL(page.url()).searchParams.get('caso'), id);
          assert.equal(new URL(page.url()).searchParams.get('fase'), String(phase));
          assert.equal(await page.locator('#previous-phase').isDisabled(), phase === 1);
          assert.equal(await page.locator('#next-phase').isDisabled(), phase === 3);
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
          assert.equal(overflow, false, `${size.name}/${id}/${phase}: horizontal overflow`);
        }
      }
      await page.locator('#tab-1').click();
      await page.locator('#tab-1').press('ArrowRight');
      assert.equal(await page.locator('#tab-2').getAttribute('aria-selected'), 'true');
      await page.locator('#tab-2').press('End');
      assert.equal(await page.locator('#tab-3').getAttribute('aria-selected'), 'true');
      await page.locator('#tab-3').press('Home');
      assert.equal(await page.locator('#tab-1').getAttribute('aria-selected'), 'true');
      await page.locator('#next-phase').click();
      assert.equal(await page.locator('#phase-2').isVisible(), true);
      await page.getByText('Ver a correspondência entre rótulos e perspectivas').click();
      assert.equal(await page.locator('.work-key').getAttribute('open') !== null, true);
      await page.locator('#previous-phase').click();
      assert.equal(await page.locator('#phase-1').isVisible(), true);
      await page.goto(`${base}/algoritmo-em-disputa/?caso=cadastro&fase=3#demonstracao`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#case-select').inputValue(), 'cadastro');
      assert.equal(await page.locator('#phase-3').isVisible(), true);
      await page.goto(`${base}/algoritmo-em-disputa/?caso=invalido&fase=99`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#case-select').inputValue(), 'rural');
      assert.equal(await page.locator('#phase-1').isVisible(), true);
      await page.goto(`${base}/algoritmo-em-disputa/`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(output, `${size.name}-hero.png`), fullPage: false });
      await page.locator('.work-tabs').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${size.name}-demo.png`), fullPage: false });
      results.push({ viewport: size.name, width: size.width, cases: 3, phasesPerCase: 3, keyboard: 'passed', url: 'passed', overflow: 'none' });
      await context.close();
    }
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await nojs.newPage();
    await page.goto(`${base}/algoritmo-em-disputa/`);
    assert.equal(await page.locator('.work-phase:visible').count(), 3);
    assert.equal(await page.locator('.work-tabs').isVisible(), false);
    assert.equal(await page.locator('.work-case-controls').isVisible(), false);
    assert.equal(await page.locator('noscript').isVisible(), true);
    await nojs.close();
    const http = await browser.newContext();
    const internalLinkResults = [];
    for (const link of localLinks) {
      const response = await http.request.get(`${base}${link}`);
      internalLinkResults.push({ link, status: response.status() });
    }
    await http.close();
    assert.deepEqual(errors, []);
    assert.deepEqual(failedAssets, []);
    assert.equal(Array.from(requests).every(url => url.startsWith(base)), true, 'Unexpected external network request');
    const report = { results, noJavaScript: 'three phases readable; interactive controls hidden', errors, failedAssets, externalRequests: [], internalLinkResults };
    fs.writeFileSync(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
