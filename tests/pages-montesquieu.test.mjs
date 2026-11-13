import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = '.worker-assets/montesquieu/';
test('all reading routes are prerendered with section URLs and public controls', () => {
  for (const route of ['index', 'landing', 'sources', 'stories', ...Array.from({length:7}, (_, i) => `slide/${i+1}`)]) {
    const html = fs.readFileSync(root + route + '.html', 'utf8');
    assert.match(html, /<base href="\/montesquieu\/">/);
    assert.match(html, /rel="canonical" href="https:\/\/anavanzin.com\/montesquieu\//);
    assert.doesNotMatch(html, /src="\.\/js\/workspace-firebase.js"|id="sync-audience-btn"|data-studio-tab="(?:research|image|video|chat)"/);
    if (route.startsWith('slide/')) assert.ok(html.includes(`data-initial-slide="${route.slice(-1)}"`));
  }
  const manifest = JSON.parse(fs.readFileSync(root + 'manifest.webmanifest'));
  assert.equal(manifest.scope, '/montesquieu/');
  assert.equal(manifest.start_url, '/montesquieu/');
  for (const file of ['server.cjs', 'firebase-applet-config.json', 'firestore.rules', 'package.json', 'js/workspace-firebase.js']) {
    assert.equal(fs.existsSync(root + file), false, file);
  }
  assert.ok(fs.existsSync(root + 'vendor/three/build/three.module.js'));
  assert.match(fs.readFileSync('.worker-assets/sitemap.xml', 'utf8'), /https:\/\/anavanzin.com\/montesquieu\/slide\/7/);
});

test('reading links stay in the section and reference existing academic targets', () => {
  const html = fs.readFileSync(root + 'index.html', 'utf8');
  const base = new URL('https://anavanzin.com/montesquieu/');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href, base);
    if (url.origin !== base.origin || url.pathname.startsWith('/trabalhos/')) continue;
    assert.ok(url.pathname.startsWith(base.pathname), `Reading link escapes the section: ${href}`);
    if (href.startsWith('#') && href.length > 1 && href !== '#landing') {
      assert.ok(ids.has(decodeURIComponent(url.hash.slice(1))), `Missing reading target: ${href}`);
    }
  }
  for (const id of ['src-dauchy', 'src-montesquieu', 'src-const-1824', 'src-figueiredo', 'src-ceschiatti', 'src-transplants']) {
    assert.ok(ids.has(id), `Missing academic source: ${id}`);
  }
  const version = JSON.parse(fs.readFileSync(root + 'source-version.json'));
  assert.equal(version.commit, 'f75cd797b43f6c0597498bbcf28a4d7c4497dede');
});

test('service worker preserves unrelated caches and ignores other site sections', async () => {
  const listeners = {};
  const deleted = [];
  const context = {
    URL, Response,
    self: { location: {origin:'https://anavanzin.com'}, clients:{claim:async()=>{}}, addEventListener:(name, fn)=>listeners[name]=fn },
    caches: {keys:async()=>['other-site-cache','anavanzin-montesquieu-obsolete'], delete:async key=>deleted.push(key)},
  };
  vm.runInNewContext(fs.readFileSync(root + 'sw.js', 'utf8'), context);
  let completion;
  listeners.activate({waitUntil:promise=>completion=promise});
  await completion;
  assert.deepEqual(deleted, ['anavanzin-montesquieu-obsolete']);
  for (const url of ['https://anavanzin.com/', 'https://anavanzin.com/_state?id=test', 'https://anavanzin.com/montesquieu/api/studio/chat', 'https://other.example/montesquieu/']) {
    listeners.fetch({request:new Request(url),respondWith:()=>assert.fail(`Intercepted ${url}`)});
  }
});
