# E2E Test Suite Ready (`TEST_READY.md`)

## Test Runner
- **Command**: `npx playwright test tests/ecosystem-frentes.spec.js tests/mentoria.spec.js`
- **Configuration**: `playwright.config.js` (auto-serves `http-server . -p 8080`, Chromium headless)
- **Base URL**: `http://localhost:8080`

## Coverage Summary
| Tier | Mentoria PPG (`tests/mentoria.spec.js`) | Ecosystem Frentes (`tests/ecosystem-frentes.spec.js`) | Total Tests | Current Status | Description |
|------|:---:|:---:|:---:|:---:|-------------|
| **Tier 1: Feature Coverage & Route Integrity** | 3 | 6 | 9 | 9 Passed (100%) | HTTP 200, valid canonicals, titles, zero 404s, asset preservation, staging parity |
| **Tier 2: Boundary & Cross-Navigation** | 3 | 6 | 9 | 4 Passed / 5 Pending M3 | Ecosystem bridges: Mentoria->Studio, Studio reverse bridge; pending M3: Metodologia, Estudar, Home colophon/modal/footer |
| **Tier 3: Content Fidelity & Pricing** | 6 | 6 | 12 | 12 Passed (100%) | All 4 Mentoria prices (R$ 550, 1.690, 2.590, 390); all 4 Studio prices (R$ 1.490, 2.490, 3.900, 990); 2-year cost comparison; absence of "Depoimentos em verificação"; "NA PRÁTICA"; "Rigor sem Adoecimento"; Lattes/barema |
| **Tier 4: Interaction & Responsive Audit** | 6 | 17 | 23 | 23 Passed (100%) | Formatted `mailto:` links with subject/body; bilingual PT/EN toggle; zero horizontal overflow across 5 viewports (320px, 390px, 768px, 1024px, 1440px) |
| **Total** | **18** | **35** | **53** | **48 Passed / 5 Pending M3** | Ready for full automated gate |

## Feature Checklist & Status Matrix
| Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Status | Test Spec File |
|---------|:------:|:------:|:------:|:------:|:------:|----------------|
| **Frente 1: Mentoria PPG (`mentoria/`)** | ✓ (3/3) | ✓ (3/3) | ✓ (6/6) | ✓ (6/6) | **18/18 PASS (100%)** | `tests/mentoria.spec.js` |
| **Frente 2: Studio Web & Cloudflare (`studio/`, `web/`)** | ✓ (2/2) | ✓ (1/1) | ✓ (6/6) | ✓ (7/7) | **16/16 PASS (100%)** | `tests/ecosystem-frentes.spec.js` |
| **Frente 3: Ecosystem Bridges & Cross-Nav** | ✓ (4/4) | 1 Pass / 5 Pending | N/A | ✓ (10/10) | **15/20 PASS (5 Pending M3)** | `tests/ecosystem-frentes.spec.js` |

## Pending Tests for Milestone 3 (Frente 3 Implementer Target)
The 5 pending tests in `tests/ecosystem-frentes.spec.js` validate the contextual bridges that Milestone 3 will place in existing pages:
1. `T2.1: /metodologia/ contains contextual bridge card to mentoria.anavanzin.com`
2. `T2.2: /estudar/ connects back to mentoria.anavanzin.com`
3. `T2.3: Root Home (/) pre-footer colophon card links to /studio`
4. `T2.4: Root Home (/) dialog #site-index links to both Mentoria and Studio`
5. `T2.5: Root Home (/) footer links to Studio, Advocacia, and Mentoria`

Once Milestone 3 inserts these bridges, running the exact command above will produce **53/53 passed (100%)**.

## Test Execution Commands
```bash
# Execute complete ecosystem suite
npx playwright test tests/ecosystem-frentes.spec.js tests/mentoria.spec.js

# Execute Mentoria test suite (100% passing)
npx playwright test tests/mentoria.spec.js

# Execute Ecosystem Frentes test suite
npx playwright test tests/ecosystem-frentes.spec.js
```
