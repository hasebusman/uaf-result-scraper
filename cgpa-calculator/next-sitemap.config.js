// Define keywords and slug generation directly to avoid module import issues
const keywords = [
	"uaf cgpa System",
	"cgpa calculator uaf",
	"gpa calculator uaf",
	"uaf cgpa calculator",
	"uaf gpa calculator",
	"uaf cgpa calculator live",
	"uaf calculator live",
	"uaf calculator",
	"lms uaf cgpa calculator",
  "cgpa calculator",
  "lms uaf",
  
];

function generateSlug(keyword) {
	return keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const keywordSlugs = keywords.map(keyword => ({
	keyword,
	slug: generateSlug(keyword)
}));

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://uafcalculator.live',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    const keywordPaths = keywordSlugs.map((item) => ({
      loc: `/${item.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));
    
    return keywordPaths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      }
    ],
  },
}
