# Test Infrastructure & Methodology (`TEST_INFRA.md`)
**Project**: `anavanzin.com` & `mentoria.anavanzin.com` (`ana vanzin inc`)  
**Scope**: Ecosystem Frentes (Frente 1: Mentoria PPG, Frente 2: Studio Web/Cloudflare, Frente 3: Ecosystem Bridges)  
**Standard**: 4-Tier Opaque-Box Deterministic E2E Test Suite  

---

## 1. Test Architecture Overview

The testing infrastructure for `anavanzin.com` is designed around **opaque-box end-to-end verification** using Playwright. Because the production architecture is hosted on Cloudflare Pages and Workers, testing validates user-observable browser behaviors, route resolution, semantic contracts, DOM integrity, responsive layouts, and zero-overflow viewport constraints against an active static server.

### 1.1 Core Components
- **Test Runner**: Playwright (`@playwright/test` v1.47+)
- **Test Environment**: Headless Chromium (`Desktop Chrome`)
- **Server Harness**: `npx http-server . -p 8080` (auto-started via `playwright.config.js` with `reuseExistingServer: !process.env.CI`)
- **Base URL**: `http://localhost:8080`
- **Spec Isolation**: Dedicated test specs (`tests/ecosystem-frentes.spec.js` and `tests/mentoria.spec.js`) separated from historical legacy tests, preventing regressions and false-positive failures.

---

## 2. The 4-Tier Testing Methodology

The test suite is structured across four progressive tiers, ensuring complete verification from fundamental HTTP routing up to real-world multi-viewport interaction:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TIER 1: Feature Coverage & Route Integrity                             │
│ - HTTP 200 responses, no 404s, valid HTML document structures          │
│ - Canonical <link rel="canonical"> tags and OpenGraph metadata         │
│ - Target routes: /, /metodologia/, /estudar/, /advocacia.html,         │
│   /studio, /web (redirect/alias), /mentoria/                           │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TIER 2: Boundary & Corner Cases + Ecosystem Cross-Navigation           │
│ - Cross-navigation bridges between distinct ecosystem frentes:         │
│   * /metodologia/ -> mentoria.anavanzin.com                            │
│   * /estudar/ -> mentoria.anavanzin.com                                │
│   * / (Home) -> Colophon /studio & Modal Dialog #site-index            │
│   * /studio -> Reverse footer bridge to Mentoria & Advocacia           │
│ - Link target security (`rel="noopener"`) and external URL validity    │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TIER 3: Content Fidelity & Pricing Verification                        │
│ - Exact contractual pricing and deliverables verification:             │
│   * Mentoria: R$ 550, R$ 1.690, R$ 2.590, R$ 390                       │
│   * Studio: R$ 1.490, R$ 2.490, A partir de R$ 3.900, Migração R$ 990  │
│   * Studio 2-Year Cost Comparison: R$ 1.570-2.630 vs R$ 6.860-16.340   │
│   * Studio Technical Transparency: R$ 0 Cloudflare, ~R$ 40-70 Registro │
│ - Absence of forbidden placeholder copy ("Depoimentos em verificação") │
│ - Presence of mandatory copy: "NA PRÁTICA · O QUE A BANCA REALMENTE    │
│   AVALIA", "Rigor sem Adoecimento · Método como Cuidado", Lattes barema│
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TIER 4: Real-World Scenarios, Interaction & Responsive Audit           │
│ - Pre-formatted `mailto:` CTA links with encoded subject & body        │
│ - Functional bilingual switching (PT/EN toggle)                        │
│ - Viewport audit across 5 screen sizes (320px, 390px, 768px, 1024px,   │
│   1440px) enforcing zero horizontal overflow (scrollWidth <= clientW)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Test Suites Directory & Feature Mapping

### 3.1 `tests/mentoria.spec.js` (Frente 1)
Focuses on the comprehensive academic mentorship offering (`mentoria.anavanzin.com` / `mentoria/index.html`):
- **Tier 1**: Verifies HTTP 200 for `/mentoria/` (and `/mentoria/index.html`), document structure, `<title>`, meta description, canonical link pointing to `https://mentoria.anavanzin.com`.
- **Tier 2**: Verifies local asset preservation in `assets/mentoria/` (zero broken remote images), colophon bridge card *"SOBRE ESTE SITE · ARQUITETURA DIGITAL AUTORAL"* linking to `/studio`, and links to `/estudar/` and `/metodologia/`.
- **Tier 3**: Verifies all 4 pricing tiers (R$ 550, R$ 1.690, R$ 2.590, R$ 390); verifies absence of "Depoimentos em verificação"; verifies presence of "NA PRÁTICA · O QUE A BANCA REALMENTE AVALIA" with 3 comparison cards; verifies "Rigor sem Adoecimento · Método como Cuidado" and neurodiversity/depression awareness; verifies Movimento I Lattes and barema audit.
- **Tier 4**: Verifies structured `mailto:ana@anavanzin.com` links for each service modality; tests responsive rendering across all 5 viewports with zero horizontal scroll overflow.

### 3.2 `tests/ecosystem-frentes.spec.js` (Frentes 2 & 3)
Focuses on web development studio commercial page (`/studio`, `/web`) and ecosystem cross-navigation bridges:
- **Tier 1**: Verifies HTTP 200, valid canonicals, and titles for `/`, `/metodologia/`, `/estudar/`, `/advocacia.html`, `/studio/`, and `/web/` redirect resolution.
- **Tier 2**: Verifies contextual bridges:
  - `/metodologia/` bridge card to `https://mentoria.anavanzin.com`
  - `/estudar/` footer link to `https://mentoria.anavanzin.com`
  - `/` (Home) pre-footer colophon card to `/studio`
  - `/` (Home) modal dialog `#site-index` links to both Mentoria and Studio
  - `/` (Home) footer links to Studio and Mentoria
  - `/studio` reverse footer bridge to `https://mentoria.anavanzin.com` and `/advocacia.html`
- **Tier 3**: Verifies Studio content fidelity:
  - Hero headline: *"Sites rápidos, autorais e sem aluguel mensal de hospedagem."*
  - 4 Studio pricing packages: R$ 1.490, R$ 2.490, A partir de R$ 3.900, Migração R$ 990
  - 2-Year Cost Comparison Table: R$ 1.570–2.630 (Cloudflare) vs R$ 6.860–16.340 (Traditional Agency)
  - Technical Transparency: R$ 0 / R$ 0,00 Cloudflare hosting, ~R$ 40–70 Registro.br, 100% titularidade
  - Living portfolio references: `anavanzin.com`, `/advocacia`, `mentoria.anavanzin.com`, `/estudar/`, `/metodologia/`, `/trabalhos/iconocracia/`
- **Tier 4**: Verifies interactive features:
  - Pre-formatted `mailto:` CTA links with parameters for Studio packages
  - Bilingual PT/EN toggle on `/studio` and `/`
  - Zero-overflow horizontal scrollbar validation across 5 viewports:
    - 320px (iPhone SE / compact mobile)
    - 390px (Standard smartphone)
    - 768px (Tablet portrait)
    - 1024px (Tablet landscape / small laptop)
    - 1440px (Desktop / high-resolution display)

---

## 4. Test Execution Commands

### 4.1 Running the Full Ecosystem Test Suite
```bash
npx playwright test tests/ecosystem-frentes.spec.js tests/mentoria.spec.js
```

### 4.2 Running Individual Test Suites
```bash
# Run only Mentoria tests
npx playwright test tests/mentoria.spec.js

# Run only Ecosystem Bridges & Studio tests
npx playwright test tests/ecosystem-frentes.spec.js

# Run in debug/headed mode
npx playwright test tests/ecosystem-frentes.spec.js --headed

# Run with trace viewer on failure
npx playwright test tests/ecosystem-frentes.spec.js --trace on
```

---

## 5. Verification & Troubleshooting Protocols

1. **Port Conflicts**: Playwright uses port 8080. If port 8080 is occupied by an external process, kill it via `lsof -i :8080` before starting.
2. **Missing Browsers**: If Chromium is not found, install via `npx playwright install --with-deps chromium`.
3. **Flaky Tests**: The test suite uses explicit assertions (`toBeVisible`, `toHaveText`, `toHaveAttribute`) with automatic Playwright waiting rather than arbitrary sleep timers, ensuring deterministic execution.
