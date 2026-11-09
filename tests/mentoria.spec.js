// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

/**
 * Mentoria PPG (Frente 1) E2E Test Suite
 * 
 * Tests the academic mentoring platform (mentoria.anavanzin.com / mentoria/index.html)
 * following the 4-tier opaque-box methodology:
 * - Tier 1: Feature Coverage & Route Integrity
 * - Tier 2: Boundary & Corner Cases + Ecosystem Bridges
 * - Tier 3: Content Fidelity & Pricing Verification
 * - Tier 4: Real-World Scenarios, Interaction & Responsive Audit
 */

const VIEWPORTS = [
  { name: 'Mobile SE (320px)', width: 320, height: 568 },
  { name: 'Mobile Standard (390px)', width: 390, height: 844 },
  { name: 'Tablet Portrait (768px)', width: 768, height: 1024 },
  { name: 'Tablet Landscape / Laptop (1024px)', width: 1024, height: 768 },
  { name: 'Desktop Large (1440px)', width: 1440, height: 900 },
];

test.describe('Frente 1: Mentoria PPG — Tier 1: Route Integrity & Feature Coverage', () => {

  test('T1.1: /mentoria/ resolves with HTTP 200, valid canonical and metadata', async ({ page }) => {
    const response = await page.goto('/mentoria/');
    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    // Title verification
    const title = await page.title();
    expect(title).toMatch(/Mentoria.*Ana Vanzin|Ana Vanzin.*Mentoria/i);

    // Canonical link tag
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toMatch(/^https:\/\/mentoria\.anavanzin\.com\/?$/);

    // Meta description verification
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveCount(1);
    const descContent = await metaDesc.getAttribute('content');
    expect(descContent).toBeTruthy();
    expect(descContent ? descContent.length : 0).toBeGreaterThan(20);

    // Meta viewport tag
    const metaViewport = page.locator('meta[name="viewport"]');
    await expect(metaViewport).toHaveCount(1);
  });

  test('T1.2: Local asset preservation in assets/mentoria/ with zero broken images', async ({ page }) => {
    // Collect network responses to detect broken images
    const failedImageUrls = [];
    page.on('response', response => {
      const url = response.url();
      if (url.match(/\.(png|jpg|jpeg|svg|webp)/i) && response.status() >= 400) {
        failedImageUrls.push({ url, status: response.status() });
      }
    });

    await page.goto('/mentoria/');

    // Verify all <img> elements on the page have loaded properly
    const images = page.locator('img');
    const imgCount = await images.count();
    expect(imgCount).toBeGreaterThan(0);

    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible();
      if (isVisible) {
        const naturalWidth = await img.evaluate((el) => (el instanceof HTMLImageElement ? el.naturalWidth : 0));
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }

    expect(failedImageUrls).toEqual([]);
  });

  test('T1.3: Staging mirror av-os-staging/mentoria/index.html parity with canonical', async () => {
    const canonicalPath = path.resolve(__dirname, '../mentoria/index.html');
    const stagingPath = path.resolve(__dirname, '../av-os-staging/mentoria/index.html');

    expect(fs.existsSync(canonicalPath)).toBe(true);
    expect(fs.existsSync(stagingPath)).toBe(true);

    const canonicalContent = fs.readFileSync(canonicalPath, 'utf8');
    const stagingContent = fs.readFileSync(stagingPath, 'utf8');

    // Canonical and staging must be in sync
    expect(canonicalContent.length).toBeGreaterThan(500);
    expect(stagingContent.length).toBeGreaterThan(500);
    expect(stagingContent).toBe(canonicalContent);
  });
});

test.describe('Frente 1: Mentoria PPG — Tier 2: Boundary & Corner Cases + Ecosystem Cross-Navigation', () => {

  test('T2.1: Colophon bridge card before footer links to Studio (/studio)', async ({ page }) => {
    await page.goto('/mentoria/');

    // Locates the pre-footer colophon card
    const colophonLink = page.locator('a[href*="studio"]').first();
    await expect(colophonLink).toBeVisible();

    const colophonText = await page.locator('body').innerText();
    expect(colophonText).toMatch(/ARQUITETURA DIGITAL AUTORAL/i);

    const targetHref = await colophonLink.getAttribute('href');
    expect(targetHref).toMatch(/(\/studio|https:\/\/anavanzin\.com\/studio)/);
  });

  test('T2.2: Cross-navigation links to open methodology repositories /estudar/ and /metodologia/', async ({ page }) => {
    await page.goto('/mentoria/');

    // Must link to open repositories as living proof
    const estudarLink = page.locator('a[href*="/estudar/"], a[href*="anavanzin.com/estudar"]');
    const metodologiaLink = page.locator('a[href*="/metodologia/"], a[href*="anavanzin.com/metodologia"]');

    await expect(estudarLink.first()).toBeVisible();
    await expect(metodologiaLink.first()).toBeVisible();
  });

  test('T2.3: Security hygiene — External links have rel="noopener"', async ({ page }) => {
    await page.goto('/mentoria/');

    const externalBlankLinks = page.locator('a[target="_blank"]');
    const count = await externalBlankLinks.count();

    for (let i = 0; i < count; i++) {
      const rel = await externalBlankLinks.nth(i).getAttribute('rel');
      expect(rel).toMatch(/noopener/);
    }
  });
});

test.describe('Frente 1: Mentoria PPG — Tier 3: Content Fidelity & Pricing Verification', () => {

  test('T3.1: All 4 pricing tiers are transparently displayed with exact figures', async ({ page }) => {
    await page.goto('/mentoria/');
    const content = await page.locator('body').innerText();

    // 01. Leitura Crítica & Parecer de Projeto — R$ 550
    expect(content).toMatch(/R\$\s*550/);
    expect(content).toMatch(/Leitura Cr[íi]tica|Parecer de Projeto/i);

    // 02. Ciclo de Estruturação de Projeto — R$ 1.690
    expect(content).toMatch(/R\$\s*1\.?690/);
    expect(content).toMatch(/Ciclo de Estrutura[çc][ãa]o/i);

    // 03. Mentoria Completa de Candidatura — R$ 2.590
    expect(content).toMatch(/R\$\s*2\.?590/);
    expect(content).toMatch(/Mentoria Completa|Ponta a Ponta/i);

    // 04. Planejamento Pré-Banca: Arguição Simulada — R$ 390
    expect(content).toMatch(/R\$\s*390/);
    expect(content).toMatch(/Argui[çc][ãa]o Simulada|Pr[ée]-Banca/i);
  });

  test('T3.2: Absolute absence of forbidden placeholder "Depoimentos em verificação"', async ({ page }) => {
    await page.goto('/mentoria/');
    const rawHtml = await page.content();
    const bodyText = await page.locator('body').innerText();

    // Neither the text nor raw HTML may contain "Depoimentos em verificação"
    expect(rawHtml).not.toContain('Depoimentos em verificação');
    expect(rawHtml).not.toContain('Depoimento em verificação');
    expect(bodyText).not.toContain('Depoimentos em verificação');
  });

  test('T3.3: Presence of "NA PRÁTICA · O QUE A BANCA REALMENTE AVALIA" with 3 comparison cards', async ({ page }) => {
    await page.goto('/mentoria/');
    const content = await page.locator('body').innerText();

    // Section title
    expect(content).toMatch(/NA PR[ÁA]TICA.*O QUE A BANCA REALMENTE AVALIA/i);

    // Card 1: Tese Genérica -> Problema Delimitado
    expect(content).toMatch(/Tese Gen[ée]rica/i);
    expect(content).toMatch(/Problema Delimitado/i);

    // Card 2: Metodologia Decorativa -> Caminho Verificável
    expect(content).toMatch(/Metodologia Decorativa/i);
    expect(content).toMatch(/Caminho Verific[áa]vel/i);

    // Card 3: Contato no Escuro -> Alinhamento com a Linha
    expect(content).toMatch(/Contato no Escuro/i);
    expect(content).toMatch(/Alinhamento com a Linha/i);
  });

  test('T3.4: "Rigor sem Adoecimento · Método como Cuidado" and neurodiversity/depression awareness', async ({ page }) => {
    await page.goto('/mentoria/');
    const content = await page.locator('body').innerText();

    // Section heading
    expect(content).toMatch(/Rigor sem Adoecimento/i);
    expect(content).toMatch(/M[ée]todo como Cuidado/i);

    // Authentic human disclosure without academic terrorism
    expect(content).toMatch(/depress[ãa]o/i);
    expect(content).toMatch(/neuroatipicidade/i);
    expect(content).toMatch(/paralisia executiva/i);
  });

  test('T3.5: Movimento I explicit Lattes & barema audit + strategic entressafra trajectory', async ({ page }) => {
    await page.goto('/mentoria/');
    const content = await page.locator('body').innerText();

    // Lattes and barema audit in method
    expect(content).toMatch(/Curr[íi]culo Lattes|Lattes/i);
    expect(content).toMatch(/barema/i);

    // Trajectory details (OAB, mestrado na graduação, PPGD/UFSC entressafra)
    expect(content).toMatch(/OAB/i);
    expect(content).toMatch(/PPGD/i);
    expect(content).toMatch(/entressafra|edital/i);
  });

  test('T3.6: Section "Por que projetos promissores reprovam?" details the 3 capital flaws', async ({ page }) => {
    await page.goto('/mentoria/');
    const content = await page.locator('body').innerText();

    expect(content).toMatch(/Por que projetos promissores reprovam/i);
    // 3 flaws
    expect(content).toMatch(/resposta pronta|parecer/i);
    expect(content).toMatch(/metodologia decorativa/i);
    expect(content).toMatch(/desconex[ãa]o com a linha|desconex[ãa]o com o orientador/i);
  });
});

test.describe('Frente 1: Mentoria PPG — Tier 4: Real-World Scenarios, Interaction & Responsive Audit', () => {

  test('T4.1: Structured mailto: CTA links with pre-filled subject and body parameters', async ({ page }) => {
    await page.goto('/mentoria/');

    // Find all mailto: links
    const mailtoLinks = page.locator('a[href^="mailto:"]');
    const count = await mailtoLinks.count();
    expect(count).toBeGreaterThan(0);

    let hasSubjectParam = false;
    let hasBodyParam = false;

    for (let i = 0; i < count; i++) {
      const href = await mailtoLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^mailto:[\w.-]+@anavanzin\.com/);
      if (href?.includes('subject=')) hasSubjectParam = true;
      if (href?.includes('body=')) hasBodyParam = true;
    }

    expect(hasSubjectParam).toBe(true);
    expect(hasBodyParam).toBe(true);
  });

  for (const vp of VIEWPORTS) {
    test(`T4.2: Zero horizontal overflow on viewport ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/mentoria/');

      // Evaluate document element scrollWidth vs clientWidth
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasOverflow: doc.scrollWidth > doc.clientWidth + 1, // 1px subpixel tolerance
        };
      });

      expect(overflow.hasOverflow).toBe(false);
    });
  }
});
