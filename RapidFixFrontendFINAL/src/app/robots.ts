import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/checkout/',
          '/api/',
          '/_next/',
          '/actions/',
          '/context/',
        ],
      },
    ],
    sitemap: 'https://rapidfixauto.in/sitemap.xml',
    host: 'https://rapidfixauto.in',
  };
}