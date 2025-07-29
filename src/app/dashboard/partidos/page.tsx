
import { Suspense } from 'react';
import { fetchMatches } from './actions';
import { MatchDataTable } from './_components/data-table';
import { columns } from './_components/columns';
import Loading from './loading';
import type { GetMatchesInput } from '@/lib/types';

export const dynamic = 'force-dynamic'

interface PartidosPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function MatchesList({ searchParams }: PartidosPageProps) {
    
    // Build a clean filters object directly in the Server Component
    const filters: GetMatchesInput = {
        page: searchParams.page ? parseInt(searchParams.page as string, 10) : 1,
        limit: searchParams.limit ? parseInt(searchParams.limit as string, 10) : 10,
    };

    if (searchParams.leagues && typeof searchParams.leagues === 'string' && searchParams.leagues.trim() !== '') {
        filters.leagues = searchParams.leagues.split(',');
    }
    if (searchParams.startDate) filters.startDate = searchParams.startDate as string;
    if (searchParams.endDate) filters.endDate = searchParams.endDate as string;
    if (searchParams.minValue) filters.minValue = parseFloat(searchParams.minValue as string);
    if (searchParams.minOdds) filters.minOdds = parseFloat(searchParams.minOdds as string);
    if (searchParams.maxOdds) filters.maxOdds = parseFloat(searchParams.maxOdds as string);
    if (searchParams.sortBy) filters.sortBy = searchParams.sortBy as string;
    if (searchParams.sortOrder) filters.sortOrder = searchParams.sortOrder as 'asc' | 'desc';


    const { data, totalMatches, totalPages, currentPage } = await fetchMatches(filters);

    return (
        <MatchDataTable 
            columns={columns} 
            data={data}
            totalMatches={totalMatches}
            totalPages={totalPages}
            currentPage={currentPage}
        />
    );
}

export default function PartidosPage({ searchParams }: PartidosPageProps) {
  return (
    <div>
        <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Explorador de Partidos</h1>
            <p className="mt-1 text-muted-foreground">Busca, filtra y analiza partidos para encontrar tu próxima apuesta de valor.</p>
        </header>
        <Suspense fallback={<Loading />}>
            <MatchesList searchParams={searchParams} />
        </Suspense>
    </div>
  );
}
