/**
 * Email clients cannot load localhost. Product images may be:
 * - Relative paths to files in /public (e.g. /products/...) — rewritten to the deployed site
 * - Full Supabase Storage URLs from the admin dashboard — passed through unchanged
 */

const FALLBACK_SITE_ORIGIN = 'https://creativitybylilyco.com';

function isLocalHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost')
  );
}

/**
 * Origin of the live storefront (Vercel). Used when substituting localhost or building relative image URLs.
 * Prefer setting NEXT_PUBLIC_SITE_URL on Vercel to your real domain (with or without www).
 */
export function getDeploymentBaseUrl(): string {
  const env =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_URL?.trim() : '';
  if (env) {
    const withProto =
      env.startsWith('http://') || env.startsWith('https://') ? env : `https://${env}`;
    try {
      const { hostname, protocol, host } = new URL(withProto);
      if (isLocalHost(hostname)) {
        return FALLBACK_SITE_ORIGIN;
      }
      return `${protocol}//${host}`.replace(/\/$/, '');
    } catch {
      /* use fallback */
    }
  }
  return FALLBACK_SITE_ORIGIN;
}

/** @deprecated Use getDeploymentBaseUrl() — still the same fallback origin when env is unset */
export const EMAIL_PUBLIC_SITE_URL = FALLBACK_SITE_ORIGIN;

/**
 * Base URL for links in HTML emails (no trailing slash).
 * Localhost / 127.0.0.1 `siteUrl` is replaced with the deployment base so links work in inboxes.
 */
export function getEmailSiteUrl(siteUrl?: string | null): string {
  const deploy = getDeploymentBaseUrl();
  const raw = (siteUrl ?? deploy).trim();
  const withProtocol =
    raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;

  try {
    const { hostname } = new URL(withProtocol);
    if (isLocalHost(hostname)) {
      return deploy;
    }
  } catch {
    return deploy;
  }

  return withProtocol.replace(/\/$/, '');
}

/** Encode each path segment so spaces / special chars work in Gmail, etc. */
function encodePathSegments(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '';
  return (
    '/' +
    segments
      .map((seg) => {
        try {
          return encodeURIComponent(decodeURIComponent(seg));
        } catch {
          return encodeURIComponent(seg);
        }
      })
      .join('/')
  );
}

/**
 * Absolute image URL safe for `<img src>` in transactional email.
 * - Admin uploads: full `https://*.supabase.co/storage/...` URLs are left intact.
 * - Static /public paths: prefixed with deployment origin; segments are encoded (e.g. folder names with spaces).
 * - Empty / missing: brand logo on the live site.
 */
export function emailAssetSrc(siteUrl: string | undefined, imagePathOrUrl: string): string {
  const base = getEmailSiteUrl(siteUrl).replace(/\/$/, '');
  const raw = (imagePathOrUrl || '').trim();

  if (!raw) {
    return `${base}/brand_logo.webp`;
  }

  if (raw.startsWith('//')) {
    return emailAssetSrc(siteUrl, `https:${raw}`);
  }

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const u = new URL(raw);
      if (isLocalHost(u.hostname)) {
        const path = encodePathSegments(u.pathname);
        return `${base}${path}${u.search}${u.hash}`;
      }
      // Supabase public objects, other HTTPS — do not mutate (query strings / tokens must stay valid)
      return raw;
    } catch {
      return raw;
    }
  }

  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return `${base}${encodePathSegments(withLeading)}`;
}
