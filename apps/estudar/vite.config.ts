import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { exhibitionsConfig, siteConfig } from './src/config'
import { libraryDocs } from './src/data/libraryDocs'
import { getExhibitionPath, getLibraryPath, rootPath } from './src/lib/paths'

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

/** Keep metadata identical to the host site's canonical metadata policy. */
function normalizeMetadataHead(source: string, canonical: string): string {
  const head = source.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0];
  if (!head) throw new Error('Article entry is missing its document head.');
  let updated = head
    .replace(/\s*<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '')
    .replace(/\s*<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, '')
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/gi, `<meta property="og:url" content="${canonical}">`);
  updated = updated.replace(/\s*<\/head>/i, `\n<link rel="canonical" href="${canonical}">\n<meta name="robots" content="index,follow">\n</head>`);
  return source.replace(head, updated);
}

/** Emit an entry document for each article so direct URLs work on static hosts. */
function articleEntries(): Plugin {
  return {
    name: 'metodo-article-entries',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset' || typeof index.source !== 'string') {
        this.error('The built index.html is required to generate article entries.');
      }
      const template: string = index.source;
      const routes = [
        ...exhibitionsConfig.items.map((article) => ({ ...article, path: getExhibitionPath(article.slug) })),
        ...libraryDocs.map((article) => ({ ...article, path: getLibraryPath(article.slug) })),
      ];
      const entries = [
        { title: siteConfig.siteTitle, intro: siteConfig.siteDescription, path: rootPath, article: false },
        ...routes.map((route) => ({ ...route, title: `${route.title} — Método · Ana Vanzin`, article: true })),
      ];
      for (const entry of entries) {
        const title = escapeHtml(entry.title);
        const description = escapeHtml(entry.intro);
        const canonical = `https://anavanzin.com${entry.path}`;
        const source = template
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
          .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
          .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
          .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
          .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
          .replace(/<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${entry.article ? 'article' : 'website'}" />`);
        const fileName = entry.path === rootPath ? 'index.html' : `${entry.path.slice(rootPath.length)}index.html`;
        const normalized = normalizeMetadataHead(source, canonical);
        if (fileName === 'index.html') index.source = normalized;
        else this.emitFile({ type: 'asset', fileName, source: normalized });
      }
    },
  };
}

export default defineConfig({
  base: rootPath,
  plugins: [react(), articleEntries()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
});
