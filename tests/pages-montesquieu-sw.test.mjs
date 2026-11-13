import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const origin = 'https://anavanzin.com';
const base = '/montesquieu/';
const source = fs.readFileSync(new URL('../scripts/montesquieu/sw.js', import.meta.url), 'utf8')
  .replace('__VERSION__', 'regression-test')
  .replace('__PRECACHE__', '[]');

function worker({ response = new Response('fresh network content'), offline = false, putFails = false, entries = new Map(), addAllFails = false } = {}) {
  const listeners = {};
  const puts = [];
  const matches = [];
  const deleted = [];
  let skippedWaiting = false;
  const cacheName = 'anavanzin-montesquieu-regression-test';
  const cache = {
    put: async (request, cachedResponse) => {
      puts.push([request, cachedResponse]);
      if (putFails) throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
    },
    addAll: async () => {
      if (addAllFails) throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
    },
    match: async request => {
      const key = typeof request === 'string' ? request : request.url;
      matches.push(key);
      return entries.get(key);
    },
  };
  vm.runInNewContext(source, {
    URL, Response,
    self: {
      location: { origin },
      addEventListener: (name, handler) => { listeners[name] = handler; },
      clients: { claim: async () => {} },
      skipWaiting: async () => { skippedWaiting = true; },
    },
    caches: {
      open: async name => { assert.equal(name, cacheName); return cache; },
      keys: async () => [cacheName, 'anavanzin-montesquieu-old', 'another-section-cache'],
      delete: async name => { deleted.push(name); },
    },
    fetch: async () => {
      if (offline) throw new TypeError('Network unavailable');
      return response;
    },
  });
  return {
    response, puts, matches, deleted,
    skippedWaiting: () => skippedWaiting,
    fetch(path, { mode, ...init } = {}) {
      const request = new Request(new URL(path, origin), init);
      if (mode) Object.defineProperty(request, 'mode', { value: mode });
      let result;
      listeners.fetch({ request, respondWith: promise => { result = promise; } });
      return result;
    },
    async install() {
      let completion;
      listeners.install({ waitUntil: promise => { completion = promise; } });
      await completion;
    },
    async activate() {
      let completion;
      listeners.activate({ waitUntil: promise => { completion = promise; } });
      await completion;
    },
  };
}

for (const fallback of ['missing', 'stale page', 'cached home']) {
  test(`cache write failure preserves the successful network response with ${fallback}`, async () => {
    const path = base + 'sources';
    const entries = new Map();
    if (fallback === 'stale page') entries.set(origin + path, new Response('stale page'));
    if (fallback === 'cached home') entries.set(base, new Response('cached home'));
    const sw = worker({ putFails: true, entries });
    const response = await sw.fetch(path, { mode: 'navigate' });
    assert.equal(response, sw.response);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'fresh network content');
    assert.equal(sw.puts.length, 1);
    assert.deepEqual(sw.matches, []);
  });
}

test('successful cache writes use a clone and leave the network body readable', async () => {
  const sw = worker();
  const response = await sw.fetch(base + 'js/report.js');
  assert.equal(response, sw.response);
  assert.equal(sw.puts.length, 1);
  assert.notEqual(sw.puts[0][1], response);
  assert.equal(await sw.puts[0][1].text(), 'fresh network content');
  assert.equal(await response.text(), 'fresh network content');
});

test('HTTP errors are returned without being cached or replaced by stale content', async () => {
  const sw = worker({ response: new Response('not found', { status: 404 }) });
  assert.equal(await sw.fetch(base + 'missing'), sw.response);
  assert.equal(sw.puts.length, 0);
  assert.deepEqual(sw.matches, []);
});

test('network failure still uses the exact cached response', async () => {
  const cached = new Response('saved sources');
  const sw = worker({ offline: true, entries: new Map([[origin + base + 'sources', cached]]) });
  assert.equal(await sw.fetch(base + 'sources', { mode: 'navigate' }), cached);
  assert.equal(sw.puts.length, 0);
});

test('offline navigation falls back to the scoped home, while missing assets return an error', async () => {
  const home = new Response('saved Montesquieu home');
  const sw = worker({ offline: true, entries: new Map([[base, home]]) });
  assert.equal(await sw.fetch(base + 'sources', { mode: 'navigate' }), home);
  const asset = await sw.fetch(base + 'js/missing.js');
  assert.equal(asset.type, 'error');
  assert.equal(asset.status, 0);
  assert.equal((await worker({ offline: true }).fetch(base + 'sources', { mode: 'navigate' })).type, 'error');
});

test('the worker ignores requests outside its scope and uncached media/API requests', () => {
  const sw = worker();
  for (const [path, init] of [
    ['/', {}],
    ['/_state?id=test', {}],
    ['/montesquieu-other/sources', {}],
    ['https://other.example/montesquieu/sources', {}],
    [base + 'api/studio/chat', {}],
    [base + 'audio.mp3', {}],
    [base + 'video.mp4', {}],
    [base + 'asset.js', { headers: { range: 'bytes=0-20' } }],
    [base + 'sources', { method: 'POST' }],
  ]) assert.equal(sw.fetch(path, init), undefined, path);
});

test('activation deletes only obsolete Montesquieu caches', async () => {
  const sw = worker();
  await sw.activate();
  assert.deepEqual(sw.deleted, ['anavanzin-montesquieu-old']);
});

test('installation activates and skips waiting even if precaching fails', async () => {
  const sw = worker({ addAllFails: true });
  await sw.install();
  assert.equal(sw.skippedWaiting(), true);
});
