const { test, chromium } = require('@playwright/test');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

test('Montesquieu reading routes, interactions and offline scope', async () => {
  test.setTimeout(90000);
  const { stdout } = await promisify(execFile)(process.execPath, ['scripts/montesquieu/verify.mjs'], {
    cwd: process.cwd(),
    env: { ...process.env, CHROMIUM_PATH: process.env.CHROMIUM_PATH || chromium.executablePath() },
    timeout: 80000,
  });
  console.log(stdout.trim());
});
