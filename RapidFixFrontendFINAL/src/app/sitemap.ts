import type { MetadataRoute } from 'next';
import { cities } from '@/lib/cityData';

const builtServices = [
  'bike-service',
  'car-service',
  'car-ac-repair',
  'battery-replacement',
  'tyre-wheel',
  'engine-repair',
  'denting-painting',
  'ev-service',
  'mechanic-near-me',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://rapidfixauto.in';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                    priority: 1.0, changeFrequency: 'weekly',  lastModified: now },
    { url: `${base}/booking`,       priority: 0.9, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/locations`,     priority: 0.8, changeFrequency: 'weekly',  lastModified: now },
    { url: `${base}/services`,      priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/blog`,          priority: 0.6, changeFrequency: 'weekly',  lastModified: now },
    { url: `${base}/about`,         priority: 0.5, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/contact`,       priority: 0.5, changeFrequency: 'monthly', lastModified: now },
  ];

  const serviceCityRoutes: MetadataRoute.Sitemap = builtServices.flatMap(service =>
    cities.map(city => ({
      url: `${base}/${service}-in-${city}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
      lastModified: now,
    }))
  );

  return [...staticRoutes, ...serviceCityRoutes];
}