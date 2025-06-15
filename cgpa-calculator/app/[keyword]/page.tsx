

import { keywords, keywordSlugs, generateSlug } from '../utils/keywords';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import KeywordPageClient from './KeywordPageClient';

interface PageProps {
	params: Promise<{
		keyword: string;
	}>;
}

export async function generateStaticParams() {
	return keywordSlugs.map((item) => ({
		keyword: item.slug,
	}));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { keyword: keywordSlug } = await params;
	const keywordData = keywordSlugs.find(item => item.slug === keywordSlug);
	
	if (!keywordData) {
		return {
			title: 'Not Found',
		};
	}

	const keyword = keywordData.keyword;
	
	return {
		title: `${keyword} - UAF CGPA Calculator`,
		description: `Calculate your UAF CGPA easily with our ${keyword}. Free online tool for University of Agriculture Faisalabad students.`,
		keywords: [keyword, 'uaf', 'cgpa', 'calculator', 'gpa', 'university agriculture faisalabad'],
		openGraph: {
			title: `${keyword} - UAF CGPA Calculator`,
			description: `Calculate your UAF CGPA easily with our ${keyword}. Free online tool for University of Agriculture Faisalabad students.`,
			type: 'website',
		},
	};
}

export default async function KeywordPage({ params }: PageProps) {
	const { keyword: keywordSlug } = await params;
	const keywordData = keywordSlugs.find(item => item.slug === keywordSlug);
	
	if (!keywordData) {
		notFound();
	}

	const keyword = keywordData.keyword;

	return <KeywordPageClient keyword={keyword} />;
}
