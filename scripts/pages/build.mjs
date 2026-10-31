// Pages preparation only: keep the existing publication boundary and Worker logic.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.join(root, '.worker-assets');
execFileSync('bash', ['scripts/stage-worker-assets.sh'], { cwd: root, stdio: 'inherit' });

const source = fs.readFileSync(path.join(root, 'worker.js'), 'utf8');
if ((source.match(/export default \{/g) || []).length !== 1) {
  throw new Error('Worker export changed; review the Pages adapter before publishing.');
}
const headersSource = fs.readFileSync(path.join(output, '_headers'), 'utf8');
const globalBlock = headersSource.match(/^\/\*\s*\n((?:[ \t]+[^\n]*\n)+)/m)?.[1];
if (!globalBlock) throw new Error('Global asset headers not found.');
const globalHeaders = globalBlock.trim().split('\n').map(line => {
  const index = line.indexOf(':');
  if (index < 1) throw new Error('Unexpected header syntax.');
  return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
});

// Pages does not apply _headers to Function responses. Reuse the global rules.
const adapter = `${source.replace('export default {', 'const originalHandler = {')}
const globalHeaders = ${JSON.stringify(globalHeaders)};
export default {
  async fetch(request, env, context) {
    const pathname = new URL(request.url).pathname;
    const response = pathname === "/trabalhos/iconocracia" || pathname.startsWith("/trabalhos/iconocracia/")
      ? await env.ICONOCRACIA_WORK.fetch(request)
      : await originalHandler.fetch(request, env, context);
    const headers = new Headers(response.headers);
    for (const [name, value] of globalHeaders) headers.set(name, value);
    if (new URL(request.url).hostname.endsWith('.pages.dev')) {
      headers.set('X-Robots-Tag', 'noindex');
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
`;
fs.writeFileSync(path.join(output, '_worker.js'), adapter);
fs.writeFileSync(path.join(output, '_routes.json'), JSON.stringify({
  version: 1,
  include: ['/trabalhos/iconocracia*', '/_state', '/iconocracia/corpus/*', '/corpus/*'],
  exclude: []
}, null, 2) + '\n');
fs.appendFileSync(path.join(output, '_headers'), `
# Canonical metadata remains on anavanzin.com; Pages hosts are review copies.
https://:project.pages.dev/*
  X-Robots-Tag: noindex
https://:version.:project.pages.dev/*
  X-Robots-Tag: noindex
`);
console.log('Pages artifact ready; no deploy, namespace, domain or DNS changes performed.');
