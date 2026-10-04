import { chromium } from '../../../node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.DEMO_BASE_URL || 'http://127.0.0.1:8097';
const output = process.env.DEMO_EVIDENCE_DIR || fileURLToPath(new URL('../../../../validation/prot-tipo/', import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    const badResponses = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => requests.push(request.url()));
    page.on('response', response => { if (response.status() >= 400) badResponses.push([response.status(), response.url()]); });
    await page.goto(`${base}/prot-tipo/`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Conselho de Contestação Algorítmica', exact: true }).waitFor();
    assert(await page.getByText('Protótipo acadêmico · demonstração local.', { exact: true }).isVisible());
    assert.equal(await page.locator('#case-selector-module button').count(), 6);
    assert.equal(await page.locator('input[type="file"], textarea').count(), 0);
    const img = page.locator('#main-header img');
    assert(await img.evaluate(node => node.complete && node.naturalWidth > 0));
    const width = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    assert(width[0] <= width[1] + 1, `Horizontal overflow ${width}`);
    const search = page.locator('#case-selector-module input');
    await search.fill('Bolsa');
    assert.equal(await page.locator('#case-selector-module button').count(), 1);
    await page.locator('#case-selector-module button').click();
    await page.locator('#tab-auditoria-view h3').filter({ hasText: 'Bolsa Família' }).waitFor();
    await search.fill('');
    for (let index = 0; index < 6; index++) {
      await page.locator('#case-selector-module button').nth(index).click();
      assert(await page.locator('#tab-auditoria-view').isVisible());
    }
    if (viewport.width > 600) {
      await page.getByTitle('Iniciar animação do cenário fictício').click();
      await page.getByText('Conclusão fictícia: discutir revisão e garantias procedimentais.', { exact: false }).waitFor({ timeout: 16000 });
    }
    await page.getByRole('button', { name: 'Adicionar exemplo à lista local' }).click();
    await page.getByRole('status').filter({ hasText: 'Exemplo incluído' }).waitFor();
    assert.equal(await page.locator('#report-abuse-section article').count(), 1);
    await page.getByRole('button', { name: 'Remover exemplo Divergência cadastral' }).click();
    assert.equal(await page.locator('#report-abuse-section article').count(), 0);
    await page.getByRole('button', { name: '2. DELIBERAÇÃO', exact: true }).click();
    await page.locator('#tab-deliberacao-view').waitFor();
    await page.getByRole('button', { name: 'SIMULAR CONCORDÂNCIA', exact: true }).click();
    await page.getByRole('button', { name: 'CONCORDÂNCIA SIMULADA', exact: true }).waitFor();
    for (const name of ['2. Cruzada', '3. Acórdão', '1. Pareceres']) {
      await page.getByRole('button', { name, exact: true }).click();
      assert(await page.locator('#tab-deliberacao-view').isVisible());
    }
    await page.getByRole('button', { name: '3. SIMULAÇÃO', exact: true }).click();
    await page.locator('#tab-simulacao-view').waitFor();
    assert.equal(await page.locator('#citizen-toolbox input[readonly]').count(), 3);
    await page.getByRole('button', { name: 'INICIAR EXERCÍCIO DIDÁTICO', exact: true }).click();
    await page.getByText('✓ CONCLUSÃO FICTÍCIA · SEM EFEITO JURÍDICO', { exact: true }).waitFor({ state: 'attached', timeout: 10000 });
    await page.getByRole('button', { name: 'Fundamentos Jurídicos', exact: true }).click();
    await page.locator('#tab-fundamentos-view').waitFor();
    await page.getByRole('button', { name: 'Guia Passo a Passo', exact: true }).click();
    await page.getByRole('dialog').waitFor();
    for (let step = 0; step < 4; step++) await page.getByRole('button', { name: 'Entendi, Avançar', exact: true }).click();
    await page.getByRole('button', { name: 'Concluir', exact: true }).click();
    assert.equal(await page.getByRole('dialog').count(), 0);
    await page.getByRole('button', { name: '1. AUDITORIA', exact: true }).click();
    await page.locator('#tab-auditoria-view').waitFor();
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('#tab-auditoria-view').parentElement).opacity) === 1);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${output}/prot-tipo-${viewport.width}.png`, fullPage: false });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('#report-abuse-section article').count(), 0);
    assert.equal(errors.length, 0, JSON.stringify(errors));
    assert.equal(badResponses.length, 0, JSON.stringify(badResponses));
    const external = requests.filter(url => !url.startsWith(base));
    assert.equal(external.length, 0, JSON.stringify(external));
    assert.equal(requests.filter(url => url.includes('/api/')).length, 0);
    results.push({ viewport, requests: requests.length, errors, badResponses, external, checks: 'six cases; filter; local observatory add/delete/reset; three deliberation phases; simulation; readonly fictional identity; doctrine/tutorial; no overflow/API/external requests; image/fonts/assets' });
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
