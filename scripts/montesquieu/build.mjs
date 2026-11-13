import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const config = JSON.parse(fs.readFileSync(new URL('./source.json', import.meta.url)));
const prefix = config.basePath.slice(0, -1);
export const routes = ['/', ...Array.from({ length: 7 }, (_, i) => `/slide/${i + 1}`), '/sources', '/landing', '/stories'];
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] });

function replaceRequired(text, before, after) {
  if (!text.includes(before)) throw new Error(`Montesquieu source changed: missing ${before}`);
  return text.replaceAll(before, after);
}

function publicHtml(html) {
  html = replaceRequired(html, '<base href="/">', `<base href="${config.basePath}">`);
  // The landing route opens the poster; only reading views bypass it.
  html = replaceRequired(html, "document.documentElement.hasAttribute('data-initial-view')",
    "['sources', 'stories'].includes(document.documentElement.getAttribute('data-initial-view'))");
  html = html.replaceAll('https://montesquieu.anavanzin.com', config.canonical)
    .replaceAll('https://www.anavanzin.com/projetos', 'https://anavanzin.com/trabalhos/')
    .replaceAll('anavanzin.com / projetos', 'anavanzin.com / trabalhos');
  // Keep the reading timeline; authoring, cloud revisions and live broadcasting
  // stay in AI Studio and are not part of this public static edition.
  html = html.replace(/<script type="module" src="\.\/js\/workspace-firebase.js"><\/script>/, '');
  for (const id of ['header-phone-remote-btn', 'prep-remote-btn', 'sync-audience-btn', 'edit-toggle', 'revisions-button', 'reset-edits']) {
    html = html.replace(new RegExp(`<button\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?<\\/button>`, 'g'), '');
  }
  for (const id of ['phone-remote-dialog', 'sync-audience-dialog', 'revisions-dialog']) {
    html = html.replace(new RegExp(`<dialog\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?<\\/dialog>`, 'g'), '');
  }
  for (const mode of ['research', 'image', 'video', 'chat']) {
    html = html.replace(new RegExp(`<button\\b[^>]*\\bdata-studio-tab="${mode}"[^>]*>[\\s\\S]*?<\\/button>`, 'g'), '');
  }
  html = html.replaceAll('Preparation Studio', 'Circulation Timeline').replaceAll('Prep Studio (S)', 'Timeline (S)');
  html = html.replaceAll('./node_modules/three/', './vendor/three/');
  return html;
}

export async function buildMontesquieu(output) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'montesquieu-build-'));
  const destination = path.join(output, 'montesquieu');
  try {
    let source = process.env.MONTESQUIEU_SOURCE_DIR;
    if (!source) {
      source = path.join(temp, 'source');
      fs.mkdirSync(source);
      run('git', ['init', '--quiet'], source);
      run('git', ['fetch', '--quiet', '--depth=1', config.repository, config.commit], source);
      run('git', ['checkout', '--quiet', '--detach', 'FETCH_HEAD'], source);
    }
    const head = run('git', ['rev-parse', 'HEAD'], source).toString().trim();
    if (head !== config.commit || run('git', ['status', '--porcelain'], source).length) {
      throw new Error('Use a clean checkout of the pinned Montesquieu commit.');
    }
    fs.mkdirSync(destination, { recursive: true });
    for (const dir of ['assets', 'public', 'css', 'js', 'vendor', 'docs/licenses']) {
      fs.cpSync(path.join(source, dir), path.join(destination, dir), {
        recursive: true,
        filter: file => !/\.test\.[cm]?js$/.test(file) && !file.endsWith('/workspace-firebase.js'),
      });
    }
    // The app's import map references Three.js in node_modules. Ship only its
    // browser distribution, verified against the upstream lockfile's integrity.
    const archive = path.join(temp, 'three.tgz');
    run('curl', ['--fail', '--silent', '--show-error', '--location', '--retry', '3', '--max-time', '120',
      `https://registry.npmjs.org/three/-/three-${config.threeVersion}.tgz`, '--output', archive]);
    const integrity = createHash('sha512').update(fs.readFileSync(archive)).digest('base64');
    if (integrity !== config.threeIntegrity) throw new Error('Three.js integrity mismatch');
    const three = path.join(destination, 'vendor/three');
    fs.mkdirSync(three, { recursive: true });
    run('tar', ['-xzf', archive, '--strip-components=1', '-C', three, 'package/build', 'package/examples/jsm', 'package/LICENSE']);

    const require = createRequire(import.meta.url);
    const { injectServerRenderedMetadata } = require(path.join(source, 'seo-metadata.cjs'));
    const index = fs.readFileSync(path.join(source, 'index.html'), 'utf8');
    for (const route of routes) {
      const file = path.join(destination, route === '/' ? 'index.html' : `${route.slice(1)}.html`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, publicHtml(injectServerRenderedMetadata(index, route, config.canonical)));
    }
    const reportFile = path.join(destination, 'js/report.js');
    let report = fs.readFileSync(reportFile, 'utf8');
    report = replaceRequired(report, 'window.location.pathname', `(window.location.pathname.replace(/^\\/montesquieu(?=\\/|$)/, '') || '/')`);
    report = replaceRequired(report, '    initialViewAttr ||', "    ['sources', 'stories'].includes(initialViewAttr) ||");
    // The sources register follows slide 7. Scrolling to it while on a sources
    // deep link must not replace the sources route or canonical with the slide URL.
    report = replaceRequired(report, '    const viewportFocusDocY = scrollY + window.innerHeight * 0.45;', `    const sourcesSection = $('#sources');
    const isSourcesRoute = window.location.pathname.replace(/\\/$/, '').endsWith('/sources') || window.location.hash === '#sources';
    if (isSourcesRoute && sourcesSection && sourcesSection.getBoundingClientRect().top <= window.innerHeight * 0.45) return;

    const viewportFocusDocY = scrollY + window.innerHeight * 0.45;`);
    report = replaceRequired(report, '    if (changed && !fromRemoteSync) {', '    if ((changed || window.location.pathname !== `/slide/${num}`) && !fromRemoteSync) {');
    report = replaceRequired(report, '`/slide/${num}`', '`/montesquieu/slide/${num}`');
    report = replaceRequired(report, '${window.location.origin}/slide/', '${window.location.origin}/montesquieu/slide/');
    report = replaceRequired(report, '${origin}/slide/', '${origin}/montesquieu/slide/');
    report = replaceRequired(report, '`${origin}/`', '`${origin}/montesquieu/`');
    report = replaceRequired(report, "new URL('./public/assets/montesquieu-stories-preview-9-16.mp4', window.location.href)", "new URL('./public/assets/montesquieu-stories-preview-9-16.mp4', document.baseURI)");
    report = replaceRequired(report, 'if (remoteParams.isRemote) {', 'if (false && remoteParams.isRemote) {');
    report = replaceRequired(report, '  loadSavedEdits();', '  // Public reading edition uses the published scholarly text.');
    report = report.replaceAll('https://montesquieu.anavanzin.com', config.canonical);
    fs.writeFileSync(reportFile, report);

    // The public studio contains only the locally sourced timeline. Avoid a
    // programmatic tab request opening an unavailable AI tool.
    const studioFile = path.join(destination, 'js/studio.js');
    let studio = fs.readFileSync(studioFile, 'utf8');
    studio = replaceRequired(studio, 'function switchStudioTab(tabName) {', "function switchStudioTab(tabName) {\n    tabName = 'timeline';");
    studio = studio.replaceAll("fetch('/api/", `fetch('${prefix}/api/`);
    fs.writeFileSync(studioFile, studio);
    // The upstream inline-flex list splits text around <em> into separate flex
    // items; long Portuguese labels then overlap the adjacent reading column.
    fs.appendFileSync(path.join(destination, 'css/report.css'), `
/* Public reading edition: keep the four constitutional powers inside the card. */
.s3-powers { font-size: clamp(1.3rem, 2vw, 1.9rem); line-height: 1.25; }
.s3-powers > span { display: block; overflow-wrap: anywhere; }
`);
    const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.webmanifest')));
    manifest.id = config.basePath;
    manifest.start_url = config.basePath;
    manifest.scope = config.basePath;
    fs.writeFileSync(path.join(destination, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

    const swSource = fs.readFileSync(new URL('./sw.js', import.meta.url), 'utf8');
    const precache = ['./', './manifest.webmanifest', './css/report.css', './vendor/js/gsap.min.js',
      ...fs.readdirSync(path.join(destination, 'js')).filter(f => /\.[cm]?js$/.test(f)).map(f => './js/' + f)];
    fs.writeFileSync(path.join(destination, 'sw.js'), swSource
      .replace('__VERSION__', `${config.commit.slice(0, 12)}-1`)
      .replace('__PRECACHE__', JSON.stringify(precache)));
    fs.writeFileSync(path.join(destination, 'source-version.json'), JSON.stringify({ repository: config.repository, commit: config.commit, edition: 'public-reading' }));

    // Files must meet the same Pages asset limit as the existing site.
    for (const file of fs.readdirSync(destination, { recursive: true })) {
      const stat = fs.statSync(path.join(destination, file));
      if (stat.isFile() && stat.size > 25 * 1024 * 1024) throw new Error(`Montesquieu asset exceeds 25 MiB: ${file}`);
    }
    const sitemapFile = path.join(output, 'sitemap.xml');
    const sitemap = fs.readFileSync(sitemapFile, 'utf8');
    fs.writeFileSync(sitemapFile, sitemap.replace('</urlset>', routes.map(r => `  <url><loc>${config.canonical}${r}</loc></url>`).join('\n') + '\n</urlset>'));
    fs.appendFileSync(path.join(output, '_headers'), '\n/montesquieu/sw.js\n  Cache-Control: no-cache\n  Service-Worker-Allowed: /montesquieu/\n');
    console.log(`Montesquieu public edition staged from ${config.commit}`);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}
