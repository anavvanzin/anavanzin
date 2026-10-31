import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const base=new URL(process.env.PAGES_TEST_BASE_URL || 'http://127.0.0.1:8101');
assert.ok(base.protocol==='http:' && ['localhost','127.0.0.1'].includes(base.hostname) && base.port);
const get=p=>fetch(new URL(p,base),{redirect:'manual'});
const output=path.resolve('.worker-assets');
test('Only legacy publication indexes redirect to the consolidated writing section',async()=>{
 for(const p of ['/publicacoes','/publicacoes/','/publicacoes/index.html']){
  const r=await get(p);assert.equal(r.status,301,p);
  const destination=new URL(r.headers.get('location'),base);
  assert.equal(destination.pathname,'/trabalhos/');assert.equal(destination.hash,'#escrita');
 }
 const r=await get('/trabalhos/');assert.equal(r.status,200);
 const html=await r.text();assert.equal((html.match(/data-record=/g)||[]).length,20);
 for(const id of ['escrita','em-curso','apresentacoes','projetos-visuais','recursos'])assert.ok(html.includes('id="'+id+'"'));
 for(const slug of ['vrouwe-justitia','contrato-visual','maria-marianne']){
  const historical=await get('/publicacoes/'+slug+'.html');assert.equal(historical.status,308);assert.equal(new URL(historical.headers.get('location'),base).pathname,'/publicacoes/'+slug);
  const detail=await get('/publicacoes/'+slug);assert.equal(detail.status,200,slug);
  assert.equal(await detail.text(),fs.readFileSync(path.join(output,'publicacoes',slug+'.html'),'utf8'));
 }
 const pdf=await get('/publicacoes/o-contrato-visual-2026.pdf');assert.equal(pdf.status,200);
 assert.deepEqual(Buffer.from(await pdf.arrayBuffer()),fs.readFileSync(path.join(output,'publicacoes/o-contrato-visual-2026.pdf')));
});
test('Consolidation retains seminar destinations, downloads and the delegated work service',async()=>{
 for(const p of ['/seminario8-dever-poder/','/seminario8-dever-poder/colegas','/prot-tipo/','/algoritmo-em-disputa/','/malleus']){
  const r=await get(p);assert.ok(r.status>=200&&r.status<400,p+' '+r.status);
 }
 for(const p of ['malleus-maleficarum.pptx','allegorical-sexual-contract.pdf','nacionalidade-feminina.pptx','madre-della-nazione.pptx','marianne-irma-tropical.pptx']){
  const r=await get('/slides/'+p);assert.equal(r.status,200,p);
  assert.deepEqual(Buffer.from(await r.arrayBuffer()),fs.readFileSync(path.join(output,'slides',p)));
 }
 for(const suffix of ['', '/', '/nested?lang=en']){
  const p='/trabalhos/iconocracia'+suffix;const r=await get(p);assert.equal(r.status,200);
  assert.equal(await r.text(),'Local Iconocracia fixture '+p);
 }
});
test('Exhibition artifact serves its HTML, hashed bundles and all eighteen plates',async()=>{
 const root='/atlas/nacao-como-mulher/';const r=await get(root);assert.equal(r.status,200);
 const html=await r.text();assert.ok(html.includes('A Nação como Mulher'));
 const bundles=[...html.matchAll(/(?:src|href)="(\/atlas\/nacao-como-mulher\/assets\/[^" ]+)"/g)].map(m=>m[1]);
 assert.equal(bundles.length,2);
 const plates=fs.readdirSync(path.join(output,root,'plates')).filter(p=>p.endsWith('.webp'));
 assert.equal(plates.length,18);
 for(const p of [...bundles,...plates.map(p=>root+'plates/'+p)]){
  const asset=await get(p);assert.equal(asset.status,200,p);
  assert.deepEqual(Buffer.from(await asset.arrayBuffer()),fs.readFileSync(path.join(output,p)));
 }
});

test('Removed Ampulheta entry points and exclusive assets return genuine 404s',async()=>{
 for(const p of ['/ampulheta','/ampulheta/','/ampulheta.html','/ampulheta-native.js','/assets/icons/ampulheta-v1.png'])assert.equal((await get(p)).status,404,p);
 for(const p of ['desktop-app.js','window-contents.js','icons.js'])assert.ok(!fs.readFileSync(path.join(output,p),'utf8').match(/WAmpulheta|AmpulhetaNative|HourglassIcon|ampulheta/i),p);
});
test('Research companion prominently identifies active demonstration data',async()=>{
 const r=await get('/iconocracia/atlas/');assert.equal(r.status,200);const html=await r.text();assert.ok(html.includes('id="prototype-notice"'));assert.ok(html.includes('não representam medições validadas'));
 const source=fs.readFileSync(path.join(output,'iconocracia/atlas/data.js'),'utf8');
 assert.ok(source.includes('placas no corpus · demonstração'));assert.ok(source.includes('codificado · demonstração'));assert.ok(source.includes('pontuações demonstrativas, não validadas'));
});

test('Standalone Radiografia retains noindex and labels illustrative scores',async()=>{
 const r=await get('/iconocracia/radiografia/');assert.equal(r.status,200);const html=await r.text();
 assert.ok(html.includes('id="radiografia-prototype-notice"'));assert.ok(html.includes('não medições validadas'));assert.ok(html.includes('content="noindex,follow"'));
});
