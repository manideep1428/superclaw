const FALLBACK_WEB_BASE_URL = "http://localhost:3000"

export const PUBLIC_WEB_BASE_URL =
  process.env.NEXT_PUBLIC_WEB_URL?.replace(/\/$/, "") ||
  FALLBACK_WEB_BASE_URL

const WEB_APP_PREFIXES = ["/dashboard", "/login", "/signup", "/support"]
const EXTERNAL_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/

export function buildWebUrl(path = "") {
  if (!path) {
    return PUBLIC_WEB_BASE_URL
  }

  return `${PUBLIC_WEB_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function resolveAppHref(href?: string | null) {
  if (!href) {
    return { href: href ?? undefined, external: false }
  }

  if (EXTERNAL_URL_PATTERN.test(href) || href.startsWith("//")) {
    return { href, external: true }
  }

  if (
    WEB_APP_PREFIXES.some(
      (prefix) => href === prefix || href.startsWith(`${prefix}/`)
    )
  ) {
    return { href: buildWebUrl(href), external: true }
  }

  return { href, external: false }
}
