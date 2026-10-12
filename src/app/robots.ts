import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
  const approved = process.env.SITE_CONTENT_VERIFIED === 'true';
  // Public pages carry `noindex` until their official content is approved.
  // Crawlers must be able to read that directive; robots.txt must not block them.
  if (!siteUrl || !approved) return { rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
