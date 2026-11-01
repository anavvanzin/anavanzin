const {test,expect}=require('@playwright/test');
test.use({serviceWorkers:'block',locale:'pt-BR',reducedMotion:'reduce'});
for(const width of [320,768,1440])test('consolidated works: categories, locale and links at '+width,async({page,context,baseURL})=>{
 const errors=[],bad=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(new URL(r.url()).origin===new URL(baseURL).origin&&r.status()>=400)bad.push(r.url());});
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(baseURL).origin&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 await page.setViewportSize({width,height:900});await page.goto('/trabalhos/');
 await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode()));await document.fonts.ready});
 await expect(page.locator('[data-record="em-curso-1"], [data-record="em-curso-3"]')).toHaveCount(0);
 await expect(page.locator('#em-curso [data-record="em-curso-2"]')).toContainText('versão de trabalho');
 await expect(page.locator('#em-curso [data-record="em-curso-4"]')).toContainText('versão de trabalho');
 await expect(page.locator('[data-record]')).toHaveCount(18);
 expect(await page.locator('.pub-grp').evaluateAll(els=>els.map(e=>e.id))).toEqual(['recursos','escrita','apresentacoes','em-curso','projetos-visuais']);
 expect(await page.locator('.works-sections a').evaluateAll(els=>els.map(e=>e.getAttribute('href')))).toEqual(['#recursos','#escrita','#apresentacoes','#em-curso','#projetos-visuais']);
 await expect(page.locator('.pub-grp').first()).toHaveAttribute('id','recursos');
 await expect(page.locator('#recursos')).toContainText('Participei da construção da biblioteca digital');
 await expect(page.locator('#recursos')).not.toContainText('quinzenais');
 for(const [id,count] of [['escrita',2],['em-curso',2],['apresentacoes',9],['projetos-visuais',3],['recursos',2]])await expect(page.locator('#'+id+' [data-record]')).toHaveCount(count);
 await expect(page.locator('[data-record="projetos-visuais-2"]')).toContainText('protótipo');
 await expect(page.locator('[data-record="projetos-visuais-2"]')).not.toContainText('328');
 await expect(page.locator('[data-record="projetos-visuais-2"]')).not.toContainText('88%');
 await expect(page.locator('#dinheiro a[href="/slides/marianne-irma-tropical.pptx"]')).toHaveCount(0);
 await expect(page.locator('#dinheiro')).toHaveAttribute('href','/slides/marianne-irma-tropical.pptx');
 for(const lang of ['EN','PT']){
  await page.getByRole('button',{name:lang,exact:true}).click();
  await expect(page.locator('h1')).toHaveText(lang==='EN'?'Research and works':'Pesquisa e trabalhos');
  await expect(page.locator('#em-curso h2')).toHaveText(lang==='EN'?'Work in progress':'Em curso');
  await expect(page.locator('main')).not.toContainText(/acesso sob solicitação|available on request/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.locator('.works-sections a[href="#em-curso"]').focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#em-curso$/);await expect(page.locator('#em-curso-title')).toBeInViewport();
 if(width===320){await page.addStyleTag({content:'html{font-size:200%!important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.goto('/publicacoes/');await expect(page).toHaveURL(/\/trabalhos\/#escrita$/);await expect(page.locator('#escrita-title')).toBeVisible();
 expect(errors).toEqual([]);expect(bad).toEqual([]);
});
test('shipped desktop scripts remain functional in an explicit local legacy fixture',async({page,context,baseURL})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(baseURL).origin&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 await page.setViewportSize({width:1440,height:1000});
 await context.route('**/__legacy-desktop-fixture',route=>route.fulfill({status:200,contentType:'text/html',body:require('node:fs').readFileSync('mesa/index 2.html','utf8')}));
 await page.goto('/__legacy-desktop-fixture');
 await page.getByRole('button',{name:'entrar →',exact:true}).click();
 await expect(page.locator('.desktop-tile-group')).toHaveCount(4);
 await page.getByRole('button',{name:'pessoa e memória',exact:true}).click();
 await expect(page.locator('[data-app-id="ampulheta"]')).toHaveCount(0);
 await expect(page.locator('.desktop-icon[data-app-id="sobre"]')).toBeVisible();
 expect(errors).toEqual([]);
});
for(const width of [390,1440])for(const [path,notice] of [['/iconocracia/atlas/','#prototype-notice'],['/iconocracia/radiografia/','#radiografia-prototype-notice']])test('prototype notice survives React rendering: '+path+' '+width,async({page,context,baseURL})=>{
 test.skip(process.env.PAGES_TEST_ALLOW_CDN!=='1','Opt-in GET-only check of the existing pinned React CDN scripts.');
 const allowed=new Set(['https://unpkg.com/react@18.3.1/umd/react.production.min.js','https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js']);
 await context.route('**/*',r=>['GET','HEAD'].includes(r.request().method())&&(new URL(r.request().url()).origin===new URL(baseURL).origin||allowed.has(r.request().url()))?r.continue():r.abort());
 await page.setViewportSize({width,height:900});await page.goto(path);
 await expect(page.locator('#root > *').first()).toBeVisible();
 await expect(page.locator(notice)).toBeVisible();await expect(page.locator(notice)).toBeInViewport();
 expect(await page.locator(notice).evaluate(el=>!el.closest('#root'))).toBe(true);
 await expect(page.locator(notice)).toContainText('not validated');
});
