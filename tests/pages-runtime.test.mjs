import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const base = new URL(process.env.PAGES_TEST_BASE_URL || 'http://127.0.0.1:8101');
assert.ok(['127.0.0.1', 'localhost'].includes(base.hostname), 'State tests must use a local runtime.');
const output = path.resolve('.worker-assets');
const id = 'preflight-' + Date.now();
const state = {v:1,lang:'pt',janelas:[{id:'sobre',x:40,y:80}]};
const request = (route, options = {}) => fetch(new URL(route, base), {redirect:'manual', ...options});
const securityHeaders = response => {
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
};

test('Pages restores and writes mesa state using local KV', async () => {
  const empty = await request('/_state?id=' + id);
  assert.equal(empty.status, 200);
  assert.deepEqual(await empty.json(), {});
  assert.equal(empty.headers.get('cache-control'), 'no-store');
  securityHeaders(empty);
  const saved = await request('/_state?id=' + id, {method:'PUT',body:JSON.stringify(state)});
  assert.equal(saved.status, 200);
  securityHeaders(saved);
  const restored = await request('/_state?id=' + id);
  assert.deepEqual(await restored.json(), state);
});

test('Pages keeps state endpoint validation and bounded requests', async () => {
  assert.equal((await request('/_state')).status, 400);
  assert.equal((await request('/_state?id=x')).status, 400);
  assert.equal((await request('/_state?id=' + id,{method:'POST'})).status, 405);
  for (const body of ['invalid','[]','null']) {
    assert.equal((await request('/_state?id=' + id,{method:'PUT',body})).status, 400);
  }
  assert.equal((await request('/_state?id=' + id,{method:'PUT',body:'x'.repeat(4001)})).status, 413);
  const status = await new Promise((resolve, reject) => {
    const req = http.request(new URL('/_state?id=' + id, base), {method:'PUT',headers:{'transfer-encoding':'chunked'}}, res => {
      res.resume(); res.on('end',()=>resolve(res.statusCode));
    });
    req.on('error',reject); req.write('{}'); req.end();
  });
  assert.equal(status, 411);
});

test('Pages adapter preserves anonymous TTL, curated retention and preview noindex', async () => {
  const code = fs.readFileSync(path.join(output,'_worker.js'));
  const handler = (await import('data:text/javascript;base64,' + code.toString('base64'))).default;
  const writes = [];
  const env = {MESAS:{put:async(...args)=>writes.push(args),get:async()=>null}};
  for (const mesa of ['anonima-preflight','curada-preflight']) {
    const response = await handler.fetch(new Request('https://preview.anavanzin.pages.dev/_state?id='+mesa,{method:'PUT',body:'{}',headers:{'content-length':'2'}}),env);
    assert.equal(response.status,200);
    assert.equal(response.headers.get('x-robots-tag'),'noindex');
    securityHeaders(response);
  }
  assert.deepEqual(writes[0][2],{expirationTtl:7776000});
  assert.deepEqual(writes[1][2],{});
});

function corpusFiles(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
    const file = path.join(directory,entry.name);
    return entry.isDirectory() ? corpusFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}
test('Pages preserves 200 and content at historical corpus .html URLs', async () => {
  const files = ['corpus','iconocracia/corpus'].flatMap(dir=>corpusFiles(path.join(output,dir)));
  assert.ok(files.length > 0);
  for (const file of files) {
    const response = await request('/'+path.relative(output,file).split(path.sep).join('/'));
    assert.equal(response.status,200,file);
    assert.equal(response.headers.get('location'),null,file);
    assert.equal(await response.text(),fs.readFileSync(file,'utf8'),file);
    securityHeaders(response);
  }
});

test('Pages keeps the current home and restored academic artifacts intact', async () => {
  for (const [route,file] of [
    ['/','index.html'],['/trabalhos','trabalhos.html'],
    ['/seminario8-dever-poder/','seminario8-dever-poder/index.html'],
    ['/seminario8-dever-poder/colegas','seminario8-dever-poder/colegas.html'],
    ['/prot-tipo/','prot-tipo/index.html'],['/algoritmo-em-disputa/','algoritmo-em-disputa/index.html'],
    ['/mesa/','mesa/index.html'],['/fonts/fonts.css','fonts/fonts.css']
  ]) {
    const response = await request(route);
    assert.equal(response.status,200,route);
    assert.equal(await response.text(),fs.readFileSync(path.join(output,file),'utf8'),route);
    securityHeaders(response);
  }
  for (const file of ['seminario8-leitura.pdf','seminario8-leitura.docx']) {
    const response = await request('/seminario8-dever-poder/'+file);
    assert.equal(response.status,200);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(output,'seminario8-dever-poder',file)));
  }
});

test('Pages keeps legacy redirects, 404 and tooling exclusion', async () => {
  const redirect = await request('/arno-dal-ri-site');
  assert.equal(redirect.status,301);
  assert.equal(redirect.headers.get('location'),'https://arno-dal-ri.anavanzin.workers.dev/');
  const missing = await request('/pagina-inexistente-preflight');
  assert.equal(missing.status,404);
  assert.equal(await missing.text(),fs.readFileSync(path.join(output,'404.html'),'utf8'));
  for (const route of ['/worker.js','/wrangler.jsonc','/scripts/pages/build.mjs','/.agents/skills/ui-craft/SKILL.md']) {
    assert.equal((await request(route)).status,404,route);
  }
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(output,'_routes.json'),'utf8')),{
    version:1,include:['/_state','/iconocracia/corpus/*','/corpus/*'],exclude:[]
  });
});
