import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://consultaxpk.com';
  const routes = ['', '/about', '/services', '/calculators', '/contact', '/privacy-policy', '/terms'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : route === '/privacy-policy' || route === '/terms' ? 0.5 : 0.8,
  }));
}
