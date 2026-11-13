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
