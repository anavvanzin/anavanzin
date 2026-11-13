# Montesquieu public reading edition

`npm run build:pages` imports the exact public GitHub revision in `source.json`
and publishes it at `https://anavanzin.com/montesquieu/` in the existing Pages
project. No DNS, Worker routes, KV or database changes are required.

The published edition retains the poster, seven slides, annotations, sources,
lectern script, PDF, audio, stories, timeline, 3D meridian and offline reading.
Gemini tools, text editing, Firebase revisions, audience sync and remote control
remain in the original AI Studio application. No Gemini key or Firebase
configuration is copied into the public artifact.

The build rewrites slide/share URLs and canonical metadata for the subdirectory,
prerenders all eleven reading routes, and scopes the manifest and service worker
to `/montesquieu/`. Its service worker only deletes its own versioned caches.
Three.js is copied from the exact package version with its lockfile integrity
checked. GitHub source and the npm registry must be reachable during the build.

To update: push AI Studio changes to `anavvanzin/montesquieu`, review the new
commit, update `source.json`, build, and verify the preview before merging.
Required source replacements fail the build when upstream routing changes.
For a local build, `MONTESQUIEU_SOURCE_DIR=/absolute/clean/checkout` avoids a
second download; the checkout must match the pinned commit and be clean.

Validation: `node --test tests/montesquieu-build.test.mjs`, the existing Pages
runtime tests, and `node scripts/montesquieu/verify.mjs` with Pages dev on port
8101. The browser check uses local Chromium and never writes remote state.

Rollback: revert the integration commit and let the existing Pages GitHub
deployment run, or roll back to the preceding Pages production deployment.
The pre-integration production deployment was
`be094185-3b68-48c1-9533-59342fb7121e` (site commit `7d8a28a`).
