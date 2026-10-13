import { libraryDocs, type LibraryDoc } from '../data/libraryDocs'

export type { LibraryDoc }

export const libraryDocuments = libraryDocs

export function getLibraryDocBySlug(slug: string): LibraryDoc | null {
  return libraryDocs.find((doc) => doc.slug === slug) ?? null
}
