/** Public mount shared by the browser, content data and static build. */
export const rootPath = '/estudar/';

export function withBasePath(path = ''): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  if (path === rootPath.slice(0, -1) || path.startsWith(rootPath)) return path;
  return `${rootPath}${path.replace(/^\/+/, '')}`;
}

export function assetPath(path: string): string {
  return withBasePath(path);
}

export function getExhibitionPath(slug: string): string {
  return withBasePath(`exhibitions/${encodeURIComponent(slug)}/`);
}

export function getLibraryPath(slug: string): string {
  return withBasePath(`biblioteca/${encodeURIComponent(slug)}/`);
}

export function getAppPath(pathname: string): string {
  const mount = rootPath.slice(0, -1);
  if (pathname === mount || pathname === rootPath) return '/';
  if (!pathname.startsWith(rootPath)) return pathname.replace(/\/+$/, '') || '/';
  return `/${pathname.slice(rootPath.length).replace(/\/+$/, '')}`;
}
