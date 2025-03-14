import { scraper } from '@/lib/scraper';
import { ResultClient } from '../../components/ResultClient';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: { regNumber: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const regNumber = params.regNumber;
  
  return {
    title: `Results for ${regNumber}`,
    description: `Academic results for student ${regNumber} from University of Agriculture Faisalabad`,
  };
}

export default async function ResultsPage({ params }: { params: { regNumber: string } }) {
  const regNumber = params.regNumber;
  
  const regNumberPattern = /^\d{4}-ag-\d{1,6}$/i;
  if (!regNumberPattern.test(regNumber)) {
    notFound();
  }

  try {
    const result = await scraper.getResult(regNumber);
        return <ResultClient initialResult={result} regNumber={regNumber} />;
  } catch (error) {
    console.error('Error fetching results:', error);
    notFound();
  }
}
