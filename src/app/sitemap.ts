// estado: ""
import type { MetadataRoute } from 'next';

const routes = ['', '/productos', '/buscador', '/agencias', '/nosotros', '/blog', '/reciclaje'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
  if (!siteUrl || process.env.SITE_CONTENT_VERIFIED !== 'true') return [];
  return routes.map((route) => ({ url: `${siteUrl}${route}`, changeFrequency: 'monthly' }));
}
