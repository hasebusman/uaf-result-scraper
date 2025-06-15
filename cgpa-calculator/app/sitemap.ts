import { MetadataRoute } from 'next';
import { keywordSlugs } from './utils/keywords';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://uafcalculator.live';

	const routes = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 1,
		},
	];

	const keywordPages = keywordSlugs.map((item) => ({
		url: `${baseUrl}/${item.slug}`,
		lastModified: new Date(),
		changeFrequency: 'weekly' as const,
		priority: 0.8,
	}));

	return [...routes, ...keywordPages];
}
