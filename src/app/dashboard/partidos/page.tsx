
import { Suspense } from 'react';
import { fetchMatches } from './actions';
import { MatchDataTable } from './_components/data-table';
import { columns } from './_components/columns';
import Loading from './loading';

export const dynamic = 'force-dynamic'

interface PartidosPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function MatchesList({ searchParams }: PartidosPageProps) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
           params.set(key, Array.isArray(value) ? value.join(',') : value);
        }
    });

    const { data, totalMatches, totalPages, currentPage } = await fetchMatches(params);

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
