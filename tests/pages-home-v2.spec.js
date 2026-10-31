const {test, expect} = require('@playwright/test');

const CDN = new Set([
  'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
  'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'
]);
test.use({serviceWorkers:'block',locale:'pt-BR'});

async function localOnly(context, baseURL, allowMotion=false) {
  const origin = new URL(baseURL).origin;
  await context.route('**/*', route => {
    const r=route.request();
    if (!['GET','HEAD'].includes(r.method())) return route.abort();
    if (new URL(r.url()).origin===origin || (allowMotion && CDN.has(r.url()))) return route.continue();
    return route.abort('blockedbyclient');
  });
}
async function ready(page) {
  await page.locator('#name').waitFor();
  await page.evaluate(async () => {
    for (const img of document.images) img.loading='eager';
    await Promise.all([...document.images].map(img=>img.decode()));
    await document.fonts.ready;
  });
}
async function noOverflow(page) {
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)<=innerWidth)).toBe(true);
}
for (const width of [320,390,768,1024,1440]) {
  test('home-v2 artifact: PT/EN, assets and keyboard at '+width, async ({page,context,baseURL})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await localOnly(context,baseURL);
    const errors=[],bad=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(new URL(r.url()).origin===new URL(baseURL).origin && r.status()>=400)bad.push(r.url());});
    await page.setViewportSize({width,height:900});
    expect((await page.goto('/')).status()).toBe(200);
    await ready(page);
    await expect(page.locator('#name')).toBeVisible();
    expect(await page.locator('img').count()).toBe(20);
    expect(await page.locator('img[src*="ana-reading"]').count()).toBe(0);
    await expect(page.locator('.study-inspiration img')).toHaveAttribute('src','/assets/home/avo-original-color.webp');
    await expect(page.locator('.editorial-portrait img')).toHaveAttribute('src','/assets/ana-portrait.webp');
    expect(await page.locator('.editorial-portrait img').evaluate(img=>getComputedStyle(img).filter)).toBe('none');
    await expect(page.locator('.bio-sticker')).toHaveAttribute('src','/assets/stickers/sticker-heart.png');
    await expect(page.locator('main > section').nth(1)).toHaveClass('bio');
    await expect(page.locator('.bio-frame img')).toHaveAttribute('src','/assets/home/ana-vanzin-staircase.jpg');
    await expect(page.locator('.hero-panel a.primary')).toHaveAttribute('href','https://iconocracia.com');
    await expect(page.locator('.hero-panel a.primary')).toHaveText('ICONOCRACIA →');
    await expect(page.locator('.publications-projects a[href="/atlas/"]')).toHaveCount(1);
    await expect(page.locator('.statements')).toHaveCount(0);
    await expect(page.locator('main > :last-child')).toHaveClass('study-inspiration');
    expect(await page.locator('.board').evaluate(el=>!!(el.compareDocumentPosition(document.querySelector('#readme')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    const crop=await page.locator('.study-inspiration img').evaluate(img=>({fit:getComputedStyle(img).objectFit,pos:getComputedStyle(img).objectPosition,ratio:img.clientWidth/img.clientHeight}));
    expect(crop.fit).toBe('cover');expect(crop.pos).toBe('50% 0%');
    expect(crop.ratio).toBeGreaterThan(1.14);expect(crop.ratio).toBeLessThan(1.16);

    expect(await page.evaluate(()=>getComputedStyle(document.querySelector('.study-inspiration img')).filter)).toBe('none');
    for (const language of ['en','pt']) {
      await page.getByRole('button',{name:language.toUpperCase(),exact:true}).click();
      await expect(page.locator('html')).toHaveAttribute('lang',language==='en'?'en':'pt-BR');
      await noOverflow(page);
      await expect(page.locator('#about-title')).toHaveText(language==='en'?'Hello, I’m Ana.':'Olá, sou a Ana.');
      await expect(page.locator('#readme h3').first()).toHaveText(language==='en'?'## research':'## pesquisa');
      await expect(page.locator('.publications-projects h2')).toHaveText(language==='en'?'Publications and visual projects':'Publicações e projetos visuais');
      const names=language==='en'?['Research · paths for research','Quotes · an archive of reading','Works · works and projects']:['Pesquisar · caminhos para pesquisar','Trechos · um arquivo de leituras','Trabalhos · obras e projetos'];
      for(let i=0;i<3;i++) await expect(page.locator('.door').nth(i)).toHaveAccessibleName(names[i]);
    }
    const fontNames=await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replaceAll('"','')));
    for(const font of ['Instrument Serif','DM Sans','JetBrains Mono'])expect(fontNames).toContain(font);
    await page.locator('.skip').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await page.locator('.index-toggle').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#site-index')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-index')).not.toBeVisible();
    if(width<1000){
      await page.locator('.menu-trigger').click();
      await expect(page.locator('.menu-trigger')).toHaveAttribute('aria-expanded','true');
      await page.keyboard.press('Escape');
      await expect(page.locator('.menu-trigger')).toHaveAttribute('aria-expanded','false');
      await expect(page.locator('.menu-trigger')).toBeFocused();
    }
    await page.locator('.bio-cta').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#readme$/);
    await expect(page.locator('#readme')).toBeInViewport();
    expect(await page.locator('#readme').evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
    const door=page.locator('.door').first();
    const name=await door.getAttribute('aria-label');
    await door.focus();
    await expect(door).toHaveAccessibleName(name);
    const target=page.locator('a[href="#stf-justica"]').first();
    await target.click();
    await expect(page).toHaveURL(/#stf-justica$/);
    await expect(page.locator('#stf-justica')).toBeInViewport();
    expect(errors).toEqual([]);expect(bad).toEqual([]);
  });
}
for(const width of [320,768]){
  test('home-v2 200% text reflow '+width,async({page,context,baseURL})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await localOnly(context,baseURL);
    await page.setViewportSize({width,height:900});
    await page.goto('/');await ready(page);
    await page.addStyleTag({content:'html { font-size: 200% !important; }'});
    for(const lang of ['EN','PT']){
      await page.getByRole('button',{name:lang,exact:true}).click();
      await noOverflow(page);
      await expect(page.locator('.study-inspiration img')).toBeVisible();
    }
  });
}
test('home-v2 stays usable without GSAP',async({page,context,baseURL})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await localOnly(context,baseURL);
  await page.goto('/');await ready(page);
  expect(await page.evaluate(()=>!!window.gsap)).toBe(false);
  expect(await page.locator('html').getAttribute('class')||'').not.toContain('v2-motion');
  await expect(page.locator('#readme')).toBeVisible();
  for(const lang of ['EN','PT'])await page.getByRole('button',{name:lang,exact:true}).click();
  const door=page.locator('.door').first();const name=await door.getAttribute('aria-label');
  await door.focus();await page.waitForTimeout(100);await expect(door).toHaveAccessibleName(name);
});
test('home-v2 artifact links return valid first hops and canonical redirects',async({page,context,baseURL,request})=>{
  await localOnly(context,baseURL);
  await page.goto('/');
  const missing=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href').slice(1)).filter(id=>id && !document.getElementById(id)));
  expect(missing).toEqual([]);
  for(const [path,status,location] of [['/sobre',308,'/sobre/'],['/trabalhos',308,'/trabalhos/'],['/arno-dal-ri-site',301,'https://arno-dal-ri.anavanzin.workers.dev/']]) {
    const response=await request.get(new URL(path,baseURL).href,{maxRedirects:0});
    expect(response.status()).toBe(status); expect(response.headers().location).toBe(location);
  }
  for(const [path,title] of [['/readme','Dossiê · ana vanzin'],['/perfil','Perfil · ana vanzin']]){
    const r=await request.get(new URL(path,baseURL).href,{maxRedirects:0});
    expect(r.status()).toBe(200);
    expect(await r.text()).toContain('<title>'+title+'</title>');
  }
  const paths=await page.locator('a[href^="/"]').evaluateAll(a=>[...new Set(a.map(x=>x.getAttribute('href').split('#')[0]))]);
  for(const path of paths){
    const r=await request.get(new URL(path,baseURL).href,{maxRedirects:0});
    expect(r.status(),path).toBeGreaterThanOrEqual(200);
    expect(r.status(),path).toBeLessThan(400);
  }
});
for(const width of [390,1440]) for(const reducedMotion of ['no-preference','reduce']){
  test('home-v2 real CDN motion without oversized manifesto: '+width+' '+reducedMotion,async({page,context,baseURL})=>{
    test.skip(process.env.PAGES_TEST_ALLOW_CDN!=='1','Opt-in GET-only check of existing pinned CDN scripts.');
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await localOnly(context,baseURL,true);
    await page.emulateMedia({reducedMotion});
    await page.setViewportSize({width,height:900});
    await page.goto('/');await ready(page);
    await page.waitForFunction(()=>!!window.gsap && !!window.ScrollTrigger);
    if(reducedMotion==='reduce'){
      expect(await page.locator('html').getAttribute('class')||'').not.toContain('v2-motion');
    }else{
      await page.waitForFunction(()=>document.documentElement.classList.contains('v2-motion'));
    }
    // The large manifesto has been removed; no scroll-pinning should survive.
    expect(await page.evaluate(()=>ScrollTrigger.getAll().filter(t=>t.pin).length)).toBe(0);
    for(const lang of ['EN','PT']){
      await page.getByRole('button',{name:lang,exact:true}).click();
      await expect(page.locator('html')).toHaveAttribute('lang',lang==='EN'?'en':'pt-BR');
      await page.locator('#readme').scrollIntoViewIfNeeded();
      await expect(page.locator('#readme')).toBeInViewport();
      await page.waitForTimeout(400);
      expect(await page.evaluate(()=>ScrollTrigger.getAll().filter(t=>t.pin).length)).toBe(0);
      await noOverflow(page);
    }
    expect(errors).toEqual([]);
  });
}
