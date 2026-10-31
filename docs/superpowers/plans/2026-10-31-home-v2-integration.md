# Home-v2 local release integration

## Scope

Branch: `feat/home-v2-local-20261031`.
Base: deployment PR #179 head `1a0497e82dc044546b679981b41d86ca9c557a5a`.
This branch is stacked on that open PR; it does not merge or publish it.

The reviewed home-v2 staging HTML becomes root `index.html`. Eight missing
runtime assets are added explicitly. Existing assets and non-home pages are
preserved. Three door links gain stable bilingual accessible names so the
decorative scramble does not replace their accessible names on focus.

No changes to deployment ownership, production data bindings, dependency
manifests, lockfile, or publication workflow.

## Verification contract

The staging source is untracked in a separate dirty checkout. Do not run
`git add .`, reset that checkout, or copy the whole staging directory.

Pages staging uses `git archive HEAD`. Commit intended integration files
locally before `npm run build:pages`, then verify artifact bytes and paths.
The approved candidate HTML is preserved except for the three accessible
labels; candidate CSS, JS and new binary assets remain byte-identical.

Required local release commands (using existing dependencies):
```sh
npm run build:pages
# Start isolated local fixture and Pages runtime; never use remote KV.
# See tests/fixtures/iconocracia-work and playwright.pages.config.js.
PAGES_TEST_BASE_URL=http://127.0.0.1:8131 npm run test:pages
PAGES_UI_TEST_URL=http://127.0.0.1:8131 npm run test:pages:ui
PAGES_UI_TEST_URL=http://127.0.0.1:8131 PAGES_TEST_ALLOW_CDN=1 npm run test:pages:ui
```

The routine browser gate has 12 tests; four opt-in cases read only the two
existing pinned GSAP/ScrollTrigger CDN URLs. Those opt-in cases cover initial
normal/reduced motion at 390 and 1440 px. The pinned language regression uses
synthetic click dispatch to preserve the actively pinned viewport, asserts
language change and active progress, and waits beyond the refresh debounce.
It is a state-integration test, not proof of an offscreen pointer interaction.
Separate real click/keyboard journeys cover PT/EN and navigation at five widths.

Route coverage verifies first hops, three explicit redirect destinations and
same-document fragment existence. Existing release journeys visit methodology
and defense. It does not certify every site's destination rendering.

## Preserved editorial limits

- The historical print's exact edition/copy and earlier scan provenance remain
  unverified. Keep the supplied-reproduction qualification; no licence or date
  is inferred.
- Brazil 1822–1922 is the thesis scope; the Atlas is broader. The separate
  master's period remains 1804–1957.
- Preserve the grandmother photograph and real staircase portrait without
  filters, with the cat overlay; removed Ana-reading banner stays absent.
- Safari, Firefox, real-device QA, all legacy full-site tests and live protected
  destination pages are outside this local release verification.
- Live reduced-motion preference changes after page load are not certified.
- This local environment reuses installed dependencies and Node 26; CI's clean
  Node 22 install remains a separate post-push check. No new software installed.

## Release boundary

No push, remote PR, merge or publication is part of this preparation.
Before any later release: independently authorize the #179 merge and homepage
release, update/rebase the integration branch as needed, and require both
`pages-release-check` and `Cloudflare Pages` at the exact new head.

## Reader-directed revision — 2026-10-31 evening

The user corrected the hierarchy and terminology: short natural introduction
and real portrait/sticker immediately after hero; full README/profile content
near the end; grandmother as a compact final personal note. The photo uses CSS
object-fit/object-position only; its original file remains unchanged. The
oversized manifesto is removed, including its active scroll pin. Earlier pin
regression descriptions above document the previous checkpoint, not the revised
candidate. New motion checks assert no pins and use real language clicks.

The README-format excerpt is grounded in existing readme.html/perfil.html,
without copying their stale doctoral line name or unqualified historical claim.
ICONOCRACIA links to iconocracia.com; Atlas remains the separate local visual
project, listed alongside publications with in-progress status made explicit.
No replacement illustration has been selected. The rejected reading banner
remains absent; this is a review candidate, not final design approval.
