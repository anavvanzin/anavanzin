import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Hud from './sections/Hud';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import DailyRitual from './sections/DailyRitual';
import Library from './sections/Library';
import Companions from './sections/Companions';
import Herbarium from './sections/Herbarium';
import ExhibitionIndex from './sections/ExhibitionIndex';
import ExhibitionDetail from './sections/ExhibitionDetail';
import LibraryReader from './sections/LibraryReader';
import CinematicPavilions from './sections/CinematicPavilions';
import Footer from './sections/Footer';
import { siteConfig } from './config';
import { getExhibitionBySlug } from './lib/exhibitions';
import { getLibraryDocBySlug } from './lib/library';
import { getAppPath, getExhibitionPath, getLibraryPath, rootPath } from './lib/paths';

const navigationEvent = 'metodo:navigate';
let pendingFocus: 'navigate' | 'restore' | null = null;
const focusedLinksByPath = new Map<string, string>();

function subscribeToLocation(onChange: () => void) {
  const onHistoryChange = () => {
    pendingFocus = 'restore';
    onChange();
  };
  window.addEventListener('popstate', onHistoryChange);
  window.addEventListener('hashchange', onHistoryChange);
  window.addEventListener(navigationEvent, onChange);
  return () => {
    window.removeEventListener('popstate', onHistoryChange);
    window.removeEventListener('hashchange', onHistoryChange);
    window.removeEventListener(navigationEvent, onChange);
  };
}

function focusElement(element: HTMLElement) {
  element.focus({ preventScroll: true });
  // Native controls (especially restored links) must keep their Tab order.
  // Only static destinations need a temporary programmatic focus target.
  if (document.activeElement !== element && !element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
    element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true });
    element.focus({ preventScroll: true });
  }
}

function moveToDestination(hash: string, focus: boolean) {
  let id = '';
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return;
  }
  const element = id ? document.getElementById(id) : document.getElementById('conteudo');
  if (id && element) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
  } else if (!id) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (focus && element) focusElement(element);
}

function navigate(path: string, source?: HTMLAnchorElement) {
  const destination = new URL(path, window.location.origin);
  if (destination.href === window.location.href) {
    moveToDestination(destination.hash, true);
    return;
  }
  const focusedLink = source || (document.activeElement instanceof HTMLAnchorElement ? document.activeElement : null);
  if (focusedLink) focusedLinksByPath.set(getAppPath(window.location.pathname), focusedLink.href);
  pendingFocus = 'navigate';
  window.history.pushState(null, '', destination);
  window.dispatchEvent(new Event(navigationEvent));
}

function updateMeta(attribute: 'name' | 'property', name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function App() {
  const location = useSyncExternalStore(subscribeToLocation, () => window.location.href);
  const firstRender = useRef(true);
  const [archiveQuery, setArchiveQuery] = useState('');
  const [archiveCategory, setArchiveCategory] = useState('Todos');
  const currentUrl = new URL(location);
  const pathname = getAppPath(currentUrl.pathname);
  const exhibitionMatch = pathname.match(/^\/exhibitions\/([^/]+)$/);
  const libraryMatch = pathname.match(/^\/biblioteca\/([^/]+)$/);
  const activeExhibition = exhibitionMatch ? getExhibitionBySlug(exhibitionMatch[1]) : null;
  const activeLibraryDoc = libraryMatch ? getLibraryDocBySlug(libraryMatch[1]) : null;
  const article = activeExhibition || activeLibraryDoc;
  const notFound = pathname !== '/' && !article;
  const title = article ? `${article.title} — Método · Ana Vanzin` : notFound ? 'Página não encontrada — Método' : siteConfig.siteTitle;
  const description = article?.intro || siteConfig.siteDescription;
  const canonicalPath = activeExhibition ? getExhibitionPath(activeExhibition.slug) : activeLibraryDoc ? getLibraryPath(activeLibraryDoc.slug) : rootPath;

  useEffect(() => {
    document.body.classList.add('ready');

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const href = anchor.getAttribute('href');
      // A bare hash is not a valid selector or a meaningful destination.
      if (!href || href === '#') return;
      const destination = new URL(anchor.href, window.location.href);
      const insideApp = destination.pathname === rootPath.slice(0, -1) || destination.pathname.startsWith(rootPath);
      if (destination.origin !== window.location.origin || !insideApp) return;
      event.preventDefault();
      navigate(`${destination.pathname}${destination.search}${destination.hash}`, anchor);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = siteConfig.language;
    updateMeta('name', 'description', description);
    updateMeta('name', 'robots', notFound ? 'noindex, follow' : 'index, follow');
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:type', article ? 'article' : 'website');
    updateMeta('property', 'og:url', `https://anavanzin.com${canonicalPath}`);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://anavanzin.com${canonicalPath}`;
  }, [title, description, canonicalPath, notFound, article]);

  useEffect(() => {
    const focus = pendingFocus;
    const initialHash = firstRender.current && currentUrl.hash;
    firstRender.current = false;
    pendingFocus = null;
    if (!focus && !initialHash) return;
    const frame = requestAnimationFrame(() => {
      if (focus === 'restore') {
        const href = focusedLinksByPath.get(getAppPath(currentUrl.pathname));
        const link = href ? Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).find((anchor) => anchor.href === href) : null;
        const target = link || document.getElementById('conteudo');
        if (target) focusElement(target);
        return;
      }
      moveToDestination(currentUrl.hash, focus === 'navigate');
    });
    return () => cancelAnimationFrame(frame);
  }, [location, currentUrl.hash, currentUrl.pathname]);

  const skipLink = <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>;

  if (activeExhibition) {
    return <>{skipLink}<ExhibitionDetail exhibition={activeExhibition} onBack={() => navigate(`${rootPath}#exhibitions`)} onNavigate={(slug) => navigate(getExhibitionPath(slug))} /></>;
  }

  if (activeLibraryDoc) {
    return <>{skipLink}<LibraryReader doc={activeLibraryDoc} onBack={() => navigate(`${rootPath}#biblioteca`)} onNavigate={(slug) => navigate(getLibraryPath(slug))} /></>;
  }

  if (notFound) {
    return (
      <>{skipLink}<main id="conteudo" className="not-found" tabIndex={-1}>
        <h1>Esta página não está no acervo.</h1>
        <p>O endereço pode ter mudado. Volte ao índice para encontrar uma técnica ou leitura.</p>
        <a href={rootPath}>Voltar para Estudar</a>
      </main></>
    );
  }

  return (
    <>
      {skipLink}
      <Hud />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <DailyRitual />
        <ExhibitionIndex query={archiveQuery} category={archiveCategory} onQueryChange={setArchiveQuery} onCategoryChange={setArchiveCategory} />
        <Library />
        <Companions />
        <Herbarium />
        <Manifesto />
        <CinematicPavilions />
      </main>
      <Footer />
    </>
  );
}

