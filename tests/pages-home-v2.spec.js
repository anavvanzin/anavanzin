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

async function heroGeometry(page) {
  const g=await page.evaluate(()=>{
    const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}};
    const a=document.querySelector('.project-float'),r=a.getBoundingClientRect();
    return {link:rect('.project-float'),panel:rect('.hero-panel'),hero:rect('.fluid-hero'),bio:rect('.bio'),position:getComputedStyle(a).position,animation:getComputedStyle(a).animationName};
  });
  expect(g.link.right<=g.panel.left || g.link.left>=g.panel.right || g.link.top>=g.panel.bottom || g.link.bottom<=g.panel.top).toBe(true);
  expect(g.panel.bottom).toBeLessThanOrEqual(g.hero.bottom);
  expect(g.hero.bottom).toBeLessThanOrEqual(g.bio.top);
  expect(g.link.height).toBeGreaterThanOrEqual(44);
  if(page.viewportSize().width>=1600){expect(g.panel.width).toBeLessThanOrEqual(900);expect(g.link.right).toBeLessThan(page.viewportSize().width-100);}
  expect(g.position).not.toBe('fixed');expect(g.animation).toBe('none');
  await expect(page.locator('.hero-panel .door')).toHaveCount(3);
  await expect(page.locator('main > .doors')).toHaveCount(0);
  await expect(page.locator('.editorial-strip')).toHaveCount(1);
  await expect(page.locator('.colophon-sticker')).toHaveAttribute('src','/assets/stickers/sticker-heart.png');
  await expect(page.locator('.project-float')).toHaveAccessibleName(/ICONOCRACIA · (pesquisa|research)/);
}
async function commentaryGeometry(page) {
  await heroGeometry(page);
  const plate=await page.locator('.capela-frame img').evaluate(i=>{const r=i.getBoundingClientRect();return {height:r.height,ratio:r.width/r.height,natural:i.naturalWidth/i.naturalHeight}});
  expect(plate.height).toBeLessThanOrEqual(300);
  expect(plate.ratio).toBeCloseTo(plate.natural,2);

  const g=await page.evaluate(()=>{
    const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}};
    const i=document.querySelector('.stf-photo img'),band=document.querySelector('.study-pair .band');
    return {board:rect('.board'),figure:rect('.f9'),photo:rect('.stf-photo'),image:rect('.stf-photo img'),caption:rect('.f9 figcaption'),readme:rect('.home-readme'),natural:i.naturalWidth/i.naturalHeight,pad:parseFloat(getComputedStyle(band).paddingLeft)};
  });
  expect(g.figure.bottom).toBeLessThanOrEqual(g.board.bottom);
  expect(g.caption.bottom).toBeLessThanOrEqual(g.figure.bottom+1);
  expect(g.image.bottom).toBeLessThanOrEqual(g.photo.bottom+1);
  expect(g.image.top).toBeGreaterThanOrEqual(g.photo.top-1);
  expect(g.image.width/g.image.height).toBeCloseTo(g.natural,2);
  expect(g.figure.bottom).toBeLessThan(g.readme.top);
  expect(g.pad).toBeGreaterThanOrEqual(20);
}

for (const width of [320,390,768,1024,1440,1599,1600,1920,2048,2560]) {
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
    expect(await page.locator('img').count()).toBe(25);
    expect(await page.locator('img[src*="ana-reading"]').count()).toBe(0);
    await expect(page.locator('.study-inspiration img')).toHaveAttribute('src','/assets/home/avo-original-color.webp');
    await expect(page.locator('.editorial-portrait img')).toHaveAttribute('src','/assets/ana-portrait.webp');
    expect(await page.locator('.editorial-portrait img').evaluate(img=>getComputedStyle(img).filter)).toBe('none');
    await expect(page.locator('.bio-sticker')).toHaveAttribute('src','/assets/stickers/sticker-heart.png');
    await expect(page.locator('.event-highlight, #saberes-franceses-2026')).toHaveCount(0);
    await expect(page.locator('a[href*="saberes-franca-brasil-2026"], a[href*="/assets/events/"]')).toHaveCount(0);
    await expect(page.locator('main > section').nth(1)).toHaveClass('bio');
    await expect(page.locator('main > section').nth(2)).toHaveClass('index-illustrated');
    await expect(page.locator('.research-question')).toHaveCount(3);
    await expect(page.locator('a[href="/marginalia/justica-nao-nasceu-cega.html"]')).toHaveCount(0);
    await expect(page.locator('#question-money a[href="/trabalhos/#dinheiro"]')).toHaveCount(1);
    await expect(page.locator('#question-iconocracy a')).toHaveAttribute('href','https://iconocracia.com/');
    await expect(page.locator('.capela-note')).toContainText('Intervenção cromática de Ana Vanzin');
    const pair=await page.locator('.study-pair').evaluate(el=>{const a=el.children[0].getBoundingClientRect(),b=el.children[1].getBoundingClientRect();return {ax:a.x,bx:b.x,ay:a.y,by:b.y}});
    if(width>900){expect(pair.bx).toBeGreaterThan(pair.ax);expect(Math.abs(pair.ay-pair.by)).toBeLessThan(2);}
    else expect(pair.by).toBeGreaterThan(pair.ay);

    await expect(page.locator('.bio-frame img')).toHaveAttribute('src','/assets/home/ana-vanzin-staircase.jpg');
    await expect(page.locator('.project-float')).toHaveAttribute('href','https://iconocracia.com');
    await expect(page.locator('.project-float')).toHaveText('ICONOCRACIA');
    await expect(page.locator('.publications-projects a[href="/atlas/"]')).toHaveCount(1);
    await expect(page.locator('.statements')).toHaveCount(0);
    await expect(page.locator('.family-notes + .editorial-strip')).toHaveCount(1);
    await expect(page.locator('main > :last-child')).toHaveClass('closing-motto');
    expect(await page.locator('.board').evaluate(el=>!!(el.compareDocumentPosition(document.querySelector('#readme')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await expect(page.locator('.family-notes > aside')).toHaveCount(2);
    await expect(page.locator('.mother-tribute img')).toHaveAttribute('src','/assets/mae/mae-04-1200.webp');
    await expect(page.locator('.mother-tribute a')).toHaveAttribute('href','/mae');
    const family=await page.locator('.family-notes').evaluate(el=>{
      const [a,b]=[...el.children].map(x=>x.getBoundingClientRect());
      return {left:a.left,right:a.right,top:a.top,bottom:a.bottom,nextLeft:b.left,nextTop:b.top};
    });
    if(width>1000){expect(family.nextLeft).toBeGreaterThanOrEqual(family.right);expect(Math.abs(family.nextTop-family.top)).toBeLessThan(1);}
    else expect(family.nextTop).toBeGreaterThanOrEqual(family.bottom);
    const crop=await page.locator('.study-inspiration img').evaluate(img=>({fit:getComputedStyle(img).objectFit,pos:getComputedStyle(img).objectPosition,ratio:img.clientWidth/img.clientHeight}));
    expect(crop.fit).toBe('cover');expect(crop.pos).toBe('50% 0%');
    expect(crop.ratio).toBeGreaterThan(1.14);expect(crop.ratio).toBeLessThan(1.16);

    expect(await page.evaluate(()=>getComputedStyle(document.querySelector('.study-inspiration img')).filter)).toBe('none');
    for (const language of ['en','pt']) {
      await page.getByRole('button',{name:language.toUpperCase(),exact:true}).click();
      await expect(page.locator('html')).toHaveAttribute('lang',language==='en'?'en':'pt-BR');
      for(const summary of await page.locator('.research-question summary').all()){
        await summary.focus();await page.keyboard.press('Enter');
        await expect(summary.locator('..')).toHaveAttribute('open','');
        await expect(summary.locator('..').locator('.qa-answer')).toBeVisible();
        await page.keyboard.press('Enter');
      }
      await noOverflow(page);
      await commentaryGeometry(page);
      await expect(page.locator('.mother-tribute')).toHaveAccessibleName(language==='en'?'For my mother':'Para minha mãe');
      await expect(page.locator('.mother-tribute a')).toHaveAccessibleName(language==='en'?'Read the tribute':'Ler a homenagem');
      await page.locator('.mother-tribute a').focus();
      await expect(page.locator('.mother-tribute a')).toBeFocused();
      await expect(page.locator('.bio')).toHaveAccessibleName(language==='en'?'Introduction':'Apresentação');
      await expect(page.locator('.bio-cta')).toHaveAccessibleName(language==='en'?'About me ↓':'Sobre mim ↓');
      await expect(page.locator('.bio-cta')).toHaveAttribute('href','#readme');
      await expect(page.locator('.bio h1, .bio h2, #about-title')).toHaveCount(0);
      await expect(page.locator('.bio-lede')).toBeVisible();
      await expect(page.locator('.bio')).not.toContainText(/Olá, sou a Ana|Hello, I’m Ana/);
      await expect(page.locator('#readme h3').first()).toHaveText(language==='en'?'## research':'## pesquisa');
      await expect(page.locator('.publications-projects h2')).toHaveText(language==='en'?'Publications and visual projects':'Publicações e projetos visuais');
      const names=language==='en'?['Study · paths for research','Quotes · an archive of reading','Works · works and projects']:['Estudar · caminhos para pesquisar','Trechos · um arquivo de leituras','Trabalhos · obras e projetos'];
      for(let i=0;i<3;i++) {
        const door=page.locator('.door').nth(i);
        await expect(door).toHaveAccessibleName(names[i]);
        const visible=(await door.locator('.word').innerText()).trim().toLocaleLowerCase();
        expect((await door.getAttribute('aria-label')).toLocaleLowerCase().startsWith(visible+' ·')).toBe(true);
      }
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
    await page.locator('.stf-observation summary').focus();await page.keyboard.press('Enter');
    await expect(page.locator('.stf-observation')).toHaveAttribute('open','');
    for(const summary of await page.locator('.home-glossary summary').all()){await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');}
    await noOverflow(page);
    await commentaryGeometry(page);
    expect(errors).toEqual([]);expect(bad).toEqual([]);
  });
}
for(const width of [320,768]){
  test('home-v2 200% text reflow '+width,async({page,context,baseURL})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await localOnly(context,baseURL);
    await page.setViewportSize({width,height:900});
    await page.goto('/');await ready(page);
    await page.locator('.research-question,.home-glossary details,.stf-observation').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
    await page.addStyleTag({content:'html { font-size: 200% !important; }'});
    for(const lang of ['EN','PT']){
      await page.getByRole('button',{name:lang,exact:true}).click();
      await noOverflow(page);
      await commentaryGeometry(page);
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
      await commentaryGeometry(page);
    }
    for(const summary of await page.locator('.research-question summary,.home-glossary summary').all())await summary.click();
    await page.waitForTimeout(400);
    await page.locator('#stf-justica').scrollIntoViewIfNeeded();
    await expect(page.locator('#stf-justica')).toHaveCSS('opacity','1');
    for(const summary of await page.locator('.research-question summary,.home-glossary summary').all())await summary.click();
    await page.waitForTimeout(400);
    await page.locator('#readme').scrollIntoViewIfNeeded();
    await expect(page.locator('#readme')).toBeInViewport();
    await noOverflow(page);
    expect(errors).toEqual([]);
  });
}

test('homepage asset URLs are content fingerprints, not stale dated cache keys',async({request})=>{
  const {createHash}=require('node:crypto');
  const html=await (await request.get('/')).text();
  for(const ext of ['css','js']){
    const pattern=new RegExp('/assets/home-v2\\.([a-f0-9]{12})\\.'+ext);
    const match=html.match(pattern);expect(match).not.toBeNull();
    const response=await request.get(match[0]);expect(response.ok()).toBe(true);
    expect(createHash('sha256').update(await response.body()).digest('hex').slice(0,12)).toBe(match[1]);
  }
  expect(html).not.toContain('home-v2-20261031.');
});

for(const motion of ['reduce','no-preference']) {
  test('dark marquee preserves readable type and motion preference: '+motion,async({page,context,baseURL})=>{
    await localOnly(context,baseURL);await page.emulateMedia({reducedMotion:motion});
    await page.setViewportSize({width:390,height:900});await page.goto('/');await ready(page);
    const result=await page.locator('.marquee').evaluate(el=>{
      const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
      const lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
      const bg=rgb(getComputedStyle(el).backgroundColor),fg=rgb(getComputedStyle(el.querySelector('span')).color),label=rgb(getComputedStyle(el.querySelector('em')).color);
      const contrast=c=>(Math.max(lum(bg),lum(c))+.05)/(Math.min(lum(bg),lum(c))+.05);
      return {bg,wordContrast:contrast(fg),labelContrast:contrast(label),animation:getComputedStyle(el.querySelector('.marquee-track')).animationName,words:el.querySelectorAll('.marquee-track>span').length,hidden:el.getAttribute('aria-hidden')};
    });
    expect(Math.max(...result.bg)).toBeLessThan(32);
    expect(result.wordContrast).toBeGreaterThanOrEqual(4.5);expect(result.labelContrast).toBeGreaterThanOrEqual(4.5);
    expect(result.animation).toBe(motion==='reduce'?'none':'av-slide');expect(result.words).toBe(8);expect(result.hidden).toBe('true');await noOverflow(page);
  });
}

for (const route of ['/', '/trabalhos/']) {
  test('decorative vector arrows and author credit survive locale changes: '+route, async ({page,context,baseURL})=>{
    await localOnly(context,baseURL);
    await page.setViewportSize({width:390,height:844});
    await page.goto(route);
    for (const lang of ['pt','en','pt']) {
      await page.locator('.lang button[data-lang="'+lang+'"]').click();
      expect(await page.locator('body').innerText()).not.toMatch(/[↗↘]/);
      expect(await page.locator('svg.link-arrow').count()).toBeGreaterThan(10);
      const arrows=await page.locator('svg.link-arrow').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {hidden:x.getAttribute('aria-hidden'),focus:x.getAttribute('focusable'),w:r.width,h:r.height}}));
      for (const a of arrows){expect(a.hidden).toBe('true');expect(a.focus).toBe('false');expect(a.w).toBeLessThanOrEqual(20);expect(a.h).toBeLessThanOrEqual(20);}
      const note=page.locator(route==='/'?'.exhibition-note':'.expo-note');
      await expect(note).toHaveText(lang==='pt'?'Pesquisa e curadoria: Ana Vanzin. Fontes e referências em cada ficha.':'Research and curation: Ana Vanzin. Sources and references accompany each entry.');
      await noOverflow(page);
    }
    if(route==='/'){
      await page.locator('.index-toggle').click();
      await expect(page.locator('#site-index svg.link-arrow')).toHaveCount(17);
      await page.keyboard.press('Escape');
      await expect(page.locator('.index-toggle')).toBeFocused();
    } else await expect(page.locator('.coda-cta')).toHaveAccessibleName('abrir uma conversa');
  });
}

test('exhibition credits research in PT/EN and preserves source uncertainty', async ({page,context,baseURL})=>{
  await localOnly(context,baseURL);
  await page.goto('/atlas/nacao-como-mulher/');
  await expect(page.locator('.provenance-note')).toHaveText('Pesquisa e curadoria: Ana Vanzin. Fontes e referências em cada ficha.');
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await expect(page.locator('.provenance-note')).toHaveText('Research and curation: Ana Vanzin. Sources and references accompany each entry.');
  expect(await page.locator('body').innerText()).not.toContain('AI-generated interpretive studies');
  await expect(page.locator('.object-card')).toHaveCount(9);
  expect(await page.content()).toContain('Visual similarity alone does not establish which source file was used.');
});
