# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static website** for the ICONOCRACIA / *Iuris Memoria* academic
project (HTML + React loaded via CDN, **no build step**). There is exactly one runnable
service — a static file server — plus a Playwright E2E test suite.

### Services

| Service | Command | Notes |
|---|---|---|
| Static site (dev) | `npx http-server . -p 8080` | Serves the repo root at `http://localhost:8080`. Entry pages: `/` (cover), `/poster.html`, `/mesa/`, `/atlas/`. This is the "run the app" command — there is no separate build/prod command needed for development. |
| E2E tests | `npx playwright test` | Config in `playwright.config.js`. Playwright auto-starts its own `http-server` on port 8080 (`reuseExistingServer` is on when not in CI), so you do **not** need to start the server first for tests. |

There is **no lint script** or frontend bundler for local development. `npm run test`
maps to `playwright test`. Cloudflare Pages publication runs `npm run build:pages`
to prepare the tracked asset tree and Functions adapter. `wrangler.jsonc` separates
preview and production bindings; it is not needed for the static local server.

### Non-obvious caveats

- **Playwright browsers**: chromium (+ system deps) must be installed via
  `npx playwright install --with-deps chromium`. This is handled by the startup update script;
  if tests fail with a missing-browser error, re-run that command.
- **Flaky test**: `tests/tier5-adversarial.spec.js` → `T5.5` ("scroll position is preserved
  exactly during keyboard-triggered zoom/unzoom") is timing-sensitive and fails
  intermittently (asserts exact `scrollY` equality). It is unrelated to environment setup —
  65/66 tests pass reliably. Treat an isolated T5.5 failure as pre-existing flakiness, not a
  regression.
- Since content is static, editing an HTML/CSS/JS file is reflected on the next browser
  reload — no server restart or rebuild required (`http-server` has no watch/HMR, but it
  serves current file contents on each request).
