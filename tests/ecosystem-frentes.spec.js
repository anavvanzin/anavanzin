// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Ecosystem Frentes (Frentes 2 & 3) E2E Test Suite
 * 
 * Verifies web development studio commercial page (/studio, /web) and
 * ecosystem cross-navigation bridges (/metodologia/, /estudar/, /, /advocacia.html)
 * following the 4-tier opaque-box methodology:
 * - Tier 1: Feature Coverage & Route Integrity
 * - Tier 2: Boundary & Corner Cases + Ecosystem Cross-Navigation
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

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      localStorage.setItem('av-lang', 'pt');
    } catch (e) {}
  });
});

test.describe('Ecosystem Frentes — Tier 1: Route Integrity & Feature Coverage', () => {

  test('T1.1: Root Home (/) returns HTTP 200, valid canonical and title', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title).toMatch(/Ana Vanzin/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toMatch(/^https:\/\/anavanzin\.com\/?$/);
  });

  test('T1.2: /metodologia/ returns HTTP 200, valid canonical and title', async ({ page }) => {
    const response = await page.goto('/metodologia/');
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title).toMatch(/Metodologia.*Ana Vanzin|Ana Vanzin.*Metodologia/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toMatch(/^https:\/\/anavanzin\.com\/metodologia\/?$/);
  });

  test('T1.3: /estudar/ returns HTTP 200 and loads study platform', async ({ page }) => {
    const response = await page.goto('/estudar/');
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('T1.4: /advocacia.html returns HTTP 200, valid canonical and title', async ({ page }) => {
    const response = await page.goto('/advocacia.html');
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title).toMatch(/Advocacia.*Ana Vanzin|Ana Vanzin.*Advocacia/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toMatch(/^https:\/\/anavanzin\.com\/advocacia(\.html)?\/?$/);
  });

  test('T1.5: /studio returns HTTP 200, valid canonical and metadata', async ({ page }) => {
    const response = await page.goto('/studio/');
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title).toMatch(/Studio.*Ana Vanzin|Ana Vanzin.*Studio/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toMatch(/^https:\/\/anavanzin\.com\/studio\/?$/);
  });

  test('T1.6: /web redirects to /studio via instant client redirect', async ({ page }) => {
    await page.goto('/web/');
    // Client-side meta refresh or location.replace directs to /studio/
    await page.waitForURL(/\/studio\/?/);
    expect(page.url()).toMatch(/\/studio\/?/);
  });
});

test.describe('Ecosystem Frentes — Tier 2: Boundary & Corner Cases + Ecosystem Cross-Navigation', () => {

  test('T2.1: /metodologia/ contains contextual bridge card to mentoria.anavanzin.com', async ({ page }) => {
    await page.goto('/metodologia/');

    // Locate the bridge link to mentoria
    const mentoriaLink = page.locator('a[href*="mentoria.anavanzin.com"]');
    await expect(mentoriaLink.first()).toBeVisible();

    const linkHref = await mentoriaLink.first().getAttribute('href');
    expect(linkHref).toMatch(/^https:\/\/mentoria\.anavanzin\.com\/?/);

    // Verify context refers to individual accompaniment / proposal review
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/mentoria|acompanhamento individual|leitura cr[íi]tica/i);
  });

  test('T2.2: /estudar/ connects back to mentoria.anavanzin.com', async ({ page }) => {
    await page.goto('/estudar/');

    // Footer or HUD contains link to mentoria.anavanzin.com
    const mentoriaLink = page.locator('a[href*="mentoria.anavanzin.com"]');
    await expect(mentoriaLink.first()).toBeAttached();

    const linkHref = await mentoriaLink.first().getAttribute('href');
    expect(linkHref).toMatch(/^https:\/\/mentoria\.anavanzin\.com\/?/);
  });

  test('T2.3: Root Home (/) pre-footer colophon card links to /studio', async ({ page }) => {
    await page.goto('/');

    const colophonLink = page.locator('a[href*="studio"]').first();
    await expect(colophonLink).toBeVisible();

    const href = await colophonLink.getAttribute('href');
    expect(href).toMatch(/(\/studio|https:\/\/anavanzin\.com\/studio)/);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/arquitetura digital autoral|sem aluguel mensal de hospedagem/i);
  });

  test('T2.4: Root Home (/) dialog #site-index links to both Mentoria and Studio', async ({ page }) => {
    await page.goto('/');

    const dialog = page.locator('#site-index');
    await expect(dialog).toBeAttached();

    // Verify link to mentoria
    const mentoriaLink = dialog.locator('a[href*="mentoria.anavanzin.com"]');
    await expect(mentoriaLink.first()).toBeAttached();

    // Verify link to studio
    const studioLink = dialog.locator('a[href*="studio"]');
    await expect(studioLink.first()).toBeAttached();
  });

  test('T2.5: Root Home (/) footer links to Studio, Advocacia, and Mentoria', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();

    const footerHtml = await footer.innerHTML();
    expect(footerHtml).toMatch(/studio/i);
    expect(footerHtml).toMatch(/advocacia/i);
    expect(footerHtml).toMatch(/mentoria/i);
  });

  test('T2.6: /studio reverse bridge in footer links back to Mentoria and Advocacia', async ({ page }) => {
    await page.goto('/studio/');

    const footer = page.locator('footer, .coda, .footer').first();
    await expect(footer).toBeVisible();

    const mentoriaLink = footer.locator('a[href*="mentoria.anavanzin.com"]');
    await expect(mentoriaLink.first()).toBeAttached();

    const advocaciaLink = footer.locator('a[href*="advocacia"]');
    await expect(advocaciaLink.first()).toBeAttached();
  });
});

test.describe('Ecosystem Frentes — Tier 3: Content Fidelity & Pricing Verification (Studio)', () => {

  test('T3.1: Studio Hero headline expresses core value proposition', async ({ page }) => {
    await page.goto('/studio/');
    const content = await page.locator('body').innerText();

    expect(content).toMatch(/Sites r[áa]pidos, autorais e sem aluguel mensal de hospedagem/i);
  });

  test('T3.2: Studio presents all 4 transparent pricing packages', async ({ page }) => {
    await page.goto('/studio/');
    const content = await page.locator('body').innerText();

    // 01. Presença Essencial — R$ 1.490
    expect(content).toMatch(/R\$\s*1\.?490/);
    expect(content).toMatch(/Presen[çc]a Essencial|One-Page/i);

    // 02. Site Autoral & Institucional Completo — R$ 2.490
    expect(content).toMatch(/R\$\s*2\.?490/);
    expect(content).toMatch(/Site Autoral|Institucional Completo/i);

    // 03. Portal Avançado, Acervo Digital ou Ecossistema Multirrota — A partir de R$ 3.900
    expect(content).toMatch(/R\$\s*3\.?900/);
    expect(content).toMatch(/Portal Avan[çc]ado|Acervo Digital|Ecossistema/i);

    // 04. Reestruturação & Migração para Cloudflare — R$ 990
    expect(content).toMatch(/R\$\s*990/);
    expect(content).toMatch(/Migra[çc][ãa]o|Reestrutura[çc][ãa]o/i);
  });

  test('T3.3: Studio 2-Year Cost Comparison Table proves massive net savings', async ({ page }) => {
    await page.goto('/studio/');
    const content = await page.locator('body').innerText();

    // Traditional Agency model comparison (WLab / WordPress aluguel)
    expect(content).toMatch(/6\.?860/);
    expect(content).toMatch(/16\.?340/);

    // Cloudflare Studio Ana Vanzin model
    expect(content).toMatch(/1\.?570/);
    expect(content).toMatch(/2\.?630/);
  });

  test('T3.4: Section "Transparência Técnica" details zero hosting rent and 100% ownership', async ({ page }) => {
    await page.goto('/studio/');
    const content = await page.locator('body').innerText();

    expect(content).toMatch(/Transpar[êe]ncia T[ée]cnica/i);
    expect(content).toMatch(/R\$\s*0(,00)?/);
    expect(content).toMatch(/Cloudflare/i);
    expect(content).toMatch(/Registro\.br|40.*70/i);
    expect(content).toMatch(/100%\s*(da\s*)?titularidade|titularidade/i);
  });

  test('T3.5: Living Portfolio links to real case studies across the ecosystem', async ({ page }) => {
    await page.goto('/studio/');

    const caseLinks = [
      page.locator('a[href*="advocacia"]'),
      page.locator('a[href*="mentoria.anavanzin.com"]'),
      page.locator('a[href*="/estudar/"], a[href*="anavanzin.com/estudar"]'),
      page.locator('a[href*="/metodologia/"], a[href*="anavanzin.com/metodologia"]'),
      page.locator('a[href*="iconocracia"]'),
    ];

    for (const link of caseLinks) {
      await expect(link.first()).toBeAttached();
    }
  });

  test('T3.6: Ethical compliance declaration with OAB standards', async ({ page }) => {
    await page.goto('/studio/');
    const content = await page.locator('body').innerText();

    expect(content).toMatch(/OAB|Provimento 205\/2021|sobriedade/i);
  });
});

test.describe('Ecosystem Frentes — Tier 4: Real-World Scenarios, Interaction & Responsive Audit', () => {

  test('T4.1: Studio mailto: action buttons contain structured subject and body parameters', async ({ page }) => {
    await page.goto('/studio/');

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

  test('T4.2: Studio bilingual PT/EN toggle switches content language smoothly', async ({ page }) => {
    await page.goto('/studio/');

    const enButton = page.locator('button[data-lang="en"]').first();
    const ptButton = page.locator('button[data-lang="pt"]').first();

    if (await enButton.isVisible()) {
      // Switch to English
      await enButton.click();
      await page.waitForTimeout(300);

      const enContent = await page.locator('body').innerText();
      expect(enContent).toMatch(/Fast, authorial websites|digital architecture|hosting rent/i);

      // Switch back to Portuguese
      await ptButton.click();
      await page.waitForTimeout(300);

      const ptContent = await page.locator('body').innerText();
      expect(ptContent).toMatch(/Sites r[áa]pidos, autorais e sem aluguel mensal de hospedagem/i);
    }
  });

  for (const vp of VIEWPORTS) {
    test(`T4.3: Zero horizontal overflow on /studio/ (${vp.name}: ${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/studio/');

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasOverflow: doc.scrollWidth > doc.clientWidth + 1,
        };
      });

      expect(overflow.hasOverflow).toBe(false);
    });

    test(`T4.4: Zero horizontal overflow on Home / (${vp.name}: ${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasOverflow: doc.scrollWidth > doc.clientWidth + 1,
        };
      });

      expect(overflow.hasOverflow).toBe(false);
    });

    test(`T4.5: Zero horizontal overflow on /metodologia/ (${vp.name}: ${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/metodologia/');

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasOverflow: doc.scrollWidth > doc.clientWidth + 1,
        };
      });

      expect(overflow.hasOverflow).toBe(false);
    });
  }
});
