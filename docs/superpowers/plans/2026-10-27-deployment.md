# Deployment correction — 2026-10-27

Approved scope: consolidate anavanzin.com on its existing Cloudflare Pages project,
add working previews and a required release check, and retire duplicate GitHub publishing.
The main checkout and its local edits remain untouched.

## Sequence

1. `tests/pages-adapter.test.mjs`: reproduce missing preview binding and missing
   headers on delegated responses. Use the generated artifact and mocked service calls.
2. `wrangler.jsonc`, `scripts/pages/build.mjs`: bind previews to the existing
   static-only `anavanzin-kimi` Worker and apply headers to delegated responses.
   Its live code and bindings were inspected: ASSETS only, no writable data bindings.
   Preserve distinct MESAS namespaces and production D1. Risk: medium.
3. `tests/pages-runtime.test.mjs`: update the obsolete trabalhos.html expectation
   to the current directory page and assert the canonical redirect. Add current
   editorial pages to artifact checks. Risk: low.
4. `tests/pages-release.spec.js`, `playwright.pages.config.js`: exercise the current
   homepage, PT/EN, mobile navigation, keyboard index, and defense navigation on the
   actual local Pages artifact. The legacy mesa-window tests target a retired UI.
   Keep requests local and leave those historical tests available. Risk: low.
5. `.github/workflows/deploy-pages.yml`: replace the duplicate GitHub publisher
   with a read-only Pages release check. Build once, test local KV/runtime and UI.
   Remove `CNAME`, since GitHub Pages must not claim the Cloudflare hostname.
   `README.md`, `scripts/pages/ROLLBACK.md`: document the resulting release process.
   Risk: medium; apply branch protection only after the required check exists.
6. Cloudflare project: permit `fix/*`, `feat/*`, `codex/*` previews. GitHub main:
   require the release and Pages checks, strict updates, PRs, no force push/deletion.
   Preserve shared GitHub authorization. Risk: medium.
7. Validate the immutable Pages release and public route behavior. Snapshot the
   current route configuration, remove only the old apex catch-all route, then
   verify public content and preserved service routes. Restore the captured route
   if validation fails. Preserve Worker deployments, wildcard subdomains, explicit
   Trabalhos/Arno/Iconocracia routes, www, DNS and all data. Risk: high.

## Verification

- RED then GREEN: adapter/config regressions.
- Local Pages runtime: state validation, isolated KV roundtrip, corpus URLs,
  source-byte equality, canonical redirects, exclusions and 404.
- Browser: current homepage at 1440, 390 and 320 px, PT/EN, menu/index and defense.
- Remote: successful PR CI and Pages preview, protected main, production commit,
  before/after route inventory, representative content and www redirect.
- No remote KV or D1 writes. Keep rollback records outside public assets.
