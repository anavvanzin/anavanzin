const {test, expect} = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

test.setTimeout(45000);
const pagesURL = process.env.PAGES_UI_TEST_URL;
test.skip(!pagesURL, 'Requires an isolated local Pages runtime with KV; static server tests do not provide /_state.');
const evidence = path.resolve(__dirname, '../../pages-validation');
fs.mkdirSync(evidence, {recursive:true});

function localOrigin(baseURL) {
  const url = new URL(baseURL);
  expect(['127.0.0.1','localhost']).toContain(url.hostname);
  return url.origin;
}

async function observe(page, origin) {
  const log = {stateRequests:[],stateResponses:[],externalBlocked:[],errors:[]};
  await page.context().route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    log.externalBlocked.push(url.href);
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', error => log.errors.push(error.message));
  page.on('request', request => {
    if(new URL(request.url()).pathname !== '/_state') return;
    log.stateRequests.push({method:request.method(),url:request.url(),body:request.postData()});
  });
  page.on('response', response => {
    if(new URL(response.url()).pathname !== '/_state') return;
    log.stateResponses.push({method:response.request().method(),status:response.status()});
  });
  return log;
}

async function readState(page, origin, id) {
  const response = await page.request.get(`${origin}/_state?id=${encodeURIComponent(id)}`,{timeout:5000});
  expect(response.status()).toBe(200);
  return response.json();
}

async function positions(page) {
  return page.locator('[data-window-id]').evaluateAll(windows => windows.map(element => ({
    id:element.dataset.windowId, x:Number.parseFloat(element.style.left),y:Number.parseFloat(element.style.top)
  })));
}

test('desktop mesa writes UI changes to local KV and restores them on reload', async ({page,baseURL}) => {
  const origin = localOrigin(pagesURL || baseURL);
  const log = await observe(page,origin);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`${origin}/mesa/`,{waitUntil:'domcontentloaded'});
  const firstRead = page.waitForResponse(response => new URL(response.url()).pathname === '/_state' && response.request().method() === 'GET');
  await page.getByRole('button',{name:/^(entrar|enter)\s*→$/i}).click();
  expect(await (await firstRead).json()).toEqual({});
  const cookie = (await page.context().cookies()).find(item => item.name === 'mesa_id');
  expect(cookie).toBeTruthy();
  expect(cookie.value).toMatch(/^m[\w-]{3,39}$/);
  await expect(page.locator('[data-window-id="justitia"]')).toBeVisible();
  await expect(page.locator('[data-window-id="projetos"]')).toBeVisible();

  const firstWrite = page.waitForResponse(response => new URL(response.url()).pathname === '/_state' && response.request().method() === 'PUT');
  await page.locator('button[data-lang="en"]').click();
  const written = await firstWrite;
  expect(written.status()).toBe(200);
  // The client does not consume the PUT body. Verify its status and stored state;
  // Playwright body retrieval can remain pending for that unconsumed fetch.
  await expect.poll(async()=> (await readState(page,origin,cookie.value)).lang).toBe('en');
  await page.locator('[data-window-id="projetos"]').getByRole('button',{name:'Close window',exact:true}).click();
  await expect(page.locator('[data-window-id="projetos"]')).toHaveCount(0);
  const bar = page.locator('[data-window-id="justitia"] .dwin__titlebar');
  const before = (await positions(page))[0];
  const box = await bar.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width/2-100,box.y+box.height/2+70,{steps:8});
  await page.mouse.up();
  await expect.poll(async()=> (await positions(page))[0]).not.toEqual(before);
  await page.locator('#desktop-navigation [data-app-id="contato"]').click();
  await expect(page.locator('[data-window-id="contato"]')).toBeVisible();
  const saved = {v:1,lang:'en',janelas:await positions(page)};
  await expect.poll(()=>readState(page,origin,cookie.value)).toEqual(saved);
  const reloadStart = log.stateRequests.length;
  await page.reload({waitUntil:'domcontentloaded'});
  await expect.poll(()=>positions(page)).toEqual(saved.janelas);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('button[data-lang="en"]')).toHaveAttribute('aria-pressed','true');
  expect((await page.context().cookies()).find(item=>item.name==='mesa_id').value).toBe(cookie.value);
  expect(log.stateRequests.slice(reloadStart).some(item=>item.method==='GET')).toBe(true);
  expect(await readState(page,origin,cookie.value)).toEqual(saved);
  expect(log.stateRequests.slice(reloadStart).filter(item=>item.method==='PUT').every(item=>JSON.parse(item.body).janelas.every(window=>window.id!=='projetos'))).toBe(true);

  // A local language choice still takes precedence over a saved desktop language.
  await page.evaluate(()=>localStorage.setItem('av_lang','pt'));
  await page.reload({waitUntil:'domcontentloaded'});
  await expect.poll(()=>positions(page)).toEqual(saved.janelas);
  await expect(page.locator('html')).toHaveAttribute('lang','pt');
  await expect.poll(()=>page.locator('[data-window-id="justitia"] img').evaluate(image=>image.complete && image.naturalWidth===1086)).toBe(true);
  expect(log.errors).toEqual([]);
  const screenshot = path.join(evidence,'mesa-desktop-restored.png');
  await page.screenshot({path:screenshot});
  fs.writeFileSync(path.join(evidence,'mesa-desktop.json'),JSON.stringify({origin,viewport:1440,cookieId:cookie.value,saved,restored:await positions(page),localLanguage:'pt',...log,screenshot},null,2)+'\n');
});

for(const width of [390,320]) {
  test(`mobile mesa works at ${width}px without overwriting the desktop KV state`,async({page,baseURL})=>{
    const origin = localOrigin(pagesURL || baseURL);
    const log = await observe(page,origin);
    const id = `pages-mobile-${width}-${Date.now()}`;
    const desktopState = {v:1,lang:'en',janelas:[{id:'justitia',x:410,y:154}]};
    const seed = await page.request.put(`${origin}/_state?id=${id}`,{data:JSON.stringify(desktopState),timeout:5000});
    expect(seed.status()).toBe(200);
    expect(await seed.text()).toBe('ok');
    await page.context().addCookies([{name:'mesa_id',value:id,url:origin}]);
    await page.setViewportSize({width,height:844});
    await page.goto(`${origin}/mesa/`,{waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:/^(entrar|enter)\s*→$/i}).click();
    await expect(page.locator('[data-window-id]')).toHaveCount(0);
    await page.locator('button[data-lang="en"]').click();
    const toggle = page.locator('#desktop-menu-toggle');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded','true');
    await page.locator('#desktop-navigation [data-app-id="projetos"]').click();
    const dialog = page.locator('[data-window-id="projetos"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal','true');
    await expect(dialog).toBeFocused();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#desktop-navigation [data-app-id="contato"]')).toBeInViewport();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded','false');
    await expect(toggle).toBeFocused();
    await dialog.getByRole('button',{name:'Close window',exact:true}).click();
    await expect(dialog).toHaveCount(0);
    await page.locator('button.desktop-icon[data-app-id="justitia"]').click();
    await expect(page.locator('[data-window-id="justitia"]')).toBeVisible();
    await expect.poll(()=>page.locator('[data-window-id="justitia"] img').evaluate(image=>image.complete && image.naturalWidth===1086)).toBe(true);
    const screenshot = path.join(evidence,`mesa-mobile-${width}.png`);
    await page.screenshot({path:screenshot});
    await page.reload({waitUntil:'domcontentloaded'});
    await expect(page.locator('#desktop-menu-toggle')).toBeVisible();
    await expect(page.locator('[data-window-id]')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    expect(await page.evaluate(()=>localStorage.getItem('av_booted'))).toBe('1');
    // Give the real save debounce time to run; mobile should still issue no GET/PUT.
    await page.waitForTimeout(650);
    expect(log.stateRequests).toEqual([]);
    expect(await readState(page,origin,id)).toEqual(desktopState);
    expect(log.errors).toEqual([]);
    fs.writeFileSync(path.join(evidence,`mesa-mobile-${width}.json`),JSON.stringify({origin,viewport:width,cookieId:id,desktopState,afterMobile:await readState(page,origin,id),reloadedLanguage:'en',...log,screenshot},null,2)+'\n');
  });
}
