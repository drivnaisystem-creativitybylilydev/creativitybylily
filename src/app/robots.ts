import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/account', '/cart', '/checkout', '/auth', '/tracking-automation'] }],
    sitemap: 'https://creativitybylilyco.com/sitemap.xml',
  };
}
