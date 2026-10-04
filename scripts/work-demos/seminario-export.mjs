// Revised deck is the source of truth. Generate its readable A4 companion and exports.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
const base = process.argv[2] || 'http://127.0.0.1:8097';
const dir = 'seminario8-dever-poder';
const browser = await chromium.launch();
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
try {
  const page = await browser.newPage({reducedMotion:'reduce'});
  await page.goto(base + '/' + dir + '/Seminario8.html');
  await page.waitForFunction(()=>document.querySelector('deck-stage')?.children.length>20);
  const slides = await page.locator('deck-stage > section').evaluateAll(sections=>sections.map((section,i)=>{
    const texts = [...section.querySelectorAll('h1,h2,h3,p,li,tr,.cite,.caption,.norm,.ttl,.status')]
      .filter(el=>!el.parentElement?.closest('p,li,tr,.cite,.caption'))
      .map(el=>({tag:/^H[123]$/.test(el.tagName)?'h3':'p',text:el.textContent.replace(/\s+/g,' ').trim()})).filter(el=>el.text);
    return {title:section.dataset.label || String(i+1),texts};
  }));
  const content = slides.map(s=>`<section class="sheet"><h2>${esc(s.title)}</h2>${s.texts.map(t=>`<${t.tag}>${esc(t.text)}</${t.tag}>`).join('\n')}</section>`).join('\n');
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Seminário 8 — versão para leitura e impressão</title><meta name="description" content="Versão para leitura e impressão do seminário Do Poder-Dever ao Dever-Poder, de Ana Vitória Vanzin e Vinícius Oliveira."><link rel="canonical" href="https://anavanzin.com/seminario8-dever-poder/Seminario8-print.html"><meta name="robots" content="noindex,follow"><link rel="stylesheet" href="/fonts/fonts.css"><style>body{margin:0;background:#f5f0e6;color:#111;font:16px/1.65 'DM Sans',sans-serif}main,nav{max-width:800px;margin:auto;padding:24px}a{color:#8b3a1a}h1,h2,h3{font-family:'Playfair Display',serif;line-height:1.25}h1{font-size:34px}h2{font-size:25px;border-bottom:1px solid #8b3a1a;padding-bottom:12px}h3{font-size:20px}.sheet{margin:48px 0}.notice{padding:16px;border:1px solid #8b3a1a}button{font:inherit;padding:8px 12px;background:#fff9ef;border:1px solid #8b3a1a;color:#111;cursor:pointer}@page{size:A4;margin:20mm}@media print{body{background:white;font-size:10pt}main{max-width:none;padding:0}nav,.print-controls{display:none}.sheet{break-before:page;margin:0}h2,h3{break-after:avoid}p{orphans:3;widows:3}}</style></head><body><nav><a href="/trabalhos">← trabalhos</a> · <a href="/seminario8-dever-poder/">seminário</a> · <a href="Seminario8.html">slides</a></nav><main><h1>Do Poder-Dever ao Dever-Poder</h1><p>Ana Vitória Vanzin &amp; Vinícius Oliveira · PPGD/UFSC · 2026</p><p class="notice">Companion de leitura gerado a partir do deck revisado. Os cenários e pareceres do Conselho são didáticos, as personas são fictícias e a supervisão humana prévia é uma proposta do seminário. O texto vigente da LGPD garante pedido de revisão sem exigir expressamente pessoa natural.</p><p class="print-controls"><button onclick="window.print()">Imprimir / salvar PDF</button> · <a href="seminario8-leitura.pdf" download>PDF de leitura</a> · <a href="seminario8-leitura.docx" download>DOCX de leitura</a></p>${content}</main></body></html>\n`;
  fs.writeFileSync(dir + '/Seminario8-print.html',html);
  await page.goto(base + '/' + dir + '/Seminario8-print.html');
  await page.evaluate(()=>document.fonts.ready);
  await page.pdf({path:dir+'/seminario8-leitura.pdf',format:'A4',printBackground:false});
  execFileSync('pandoc',[dir+'/Seminario8-print.html','--from=html','--to=docx','--output='+dir+'/seminario8-leitura.docx']);
  for (const [file,out] of [['colegas.html','colegas.pdf'],['flyer.html','flyer.pdf']]) {
    await page.goto(base+'/'+dir+'/'+file);
    await page.evaluate(()=>{ document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in')); return document.fonts.ready; });
    await page.pdf({path:dir+'/'+out,format:'A4',printBackground:true,margin:{top:'10mm',bottom:'10mm',left:'10mm',right:'10mm'}});
  }
  console.log(`Generated reading companion, PDF/DOCX and revised guide/flyer (${slides.length} slides).`);
} finally { await browser.close(); }
