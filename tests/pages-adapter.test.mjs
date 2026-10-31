import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {unstable_readConfig} = require('wrangler');

test('preview has the static work service and uses its own mesa storage', () => {
  const config = env => unstable_readConfig({config:'wrangler.jsonc',env},{hideWarnings:true});
  const preview = config('preview');
  const production = config('production');
  assert.notEqual(preview.kv_namespaces[0].id, production.kv_namespaces[0].id);
  assert.deepEqual(preview.services, [{binding:'ICONOCRACIA_WORK',service:'anavanzin-kimi'}]);
  assert.deepEqual(preview.d1_databases, []);
});

test('delegated work responses retain security headers and preview noindex', async () => {
  const code = fs.readFileSync('.worker-assets/_worker.js');
  const handler = (await import('data:text/javascript;base64,' + code.toString('base64'))).default;
  const request = new Request('https://review.anavanzin.pages.dev/trabalhos/iconocracia/?lang=en');
  const env = {ICONOCRACIA_WORK:{fetch:async forwarded => {
    assert.equal(forwarded, request);
    return new Response('static work', {status:200,headers:{'x-work':'preserved'}});
  }}};
  const response = await handler.fetch(request, env, {});
  assert.equal(await response.text(), 'static work');
  assert.equal(response.headers.get('x-work'), 'preserved');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
});
