const {defineConfig} = require('@playwright/test');
const assert = require('node:assert/strict');

const baseURL = process.env.PAGES_UI_TEST_URL || 'http://127.0.0.1:8101';
const runtime = new URL(baseURL);
assert.ok(runtime.protocol === 'http:' && ['127.0.0.1','localhost'].includes(runtime.hostname) && runtime.port,
  'Pages UI tests require an explicit localhost port and isolated local KV.');
process.env.PAGES_UI_TEST_URL = baseURL;

module.exports = defineConfig({
  testDir:'./tests',
  testMatch:'pages-mesa.spec.js',
  outputDir:'./test-results/pages',
  workers:1,
  timeout:45000,
  reporter:'list',
  use:{baseURL,headless:true,channel:process.env.PAGES_BROWSER_CHANNEL || undefined},
  webServer:{
    command:`wrangler pages dev .worker-assets --kv MESAS --port ${Number(runtime.port)} --ip 127.0.0.1 --show-interactive-dev-session=false`,
    url:baseURL,
    reuseExistingServer:!process.env.CI,
    timeout:30000,
    env:{WRANGLER_SEND_METRICS:'false'}
  }
});
