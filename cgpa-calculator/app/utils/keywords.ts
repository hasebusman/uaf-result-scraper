export const keywords = [
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
]

export function generateSlug(keyword: string): string {
	return keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const keywordSlugs = keywords.map(keyword => ({
	keyword,
	slug: generateSlug(keyword)
}));