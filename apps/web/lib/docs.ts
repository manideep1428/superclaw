const FALLBACK_DOCS_BASE_URL = "http://localhost:3001/docs"

export const PUBLIC_DOCS_BASE_URL =
  process.env.NEXT_PUBLIC_DOCS_URL?.replace(/\/$/, "") ||
  FALLBACK_DOCS_BASE_URL

export function buildDocsPath(segments: string[] = []) {
  if (segments.length === 0) {
    return "/docs"
  }

  return `/docs/${segments.join("/")}`
}

export function buildExtensionDocsPath(slug: string) {
  return buildExternalDocsUrl(["extensions", slug])
}

export function buildExternalDocsUrl(segments: string[] = []) {
  if (segments.length === 0) {
    return PUBLIC_DOCS_BASE_URL
  }

  return `${PUBLIC_DOCS_BASE_URL}/${segments.join("/")}`
}

export function resolveServerDocsUrl(segments: string[] = []) {
  const baseUrl =
    process.env.DOCS_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_DOCS_URL?.replace(/\/$/, "") ||
    FALLBACK_DOCS_BASE_URL

  if (segments.length === 0) {
    return baseUrl
  }

  return `${baseUrl}/${segments.join("/")}`
}
