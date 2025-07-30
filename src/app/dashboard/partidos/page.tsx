
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompetitionsView } from './_components/competitions-view';
import { FeaturedView } from './_components/featured-view';
import { MatchCardSkeleton } from './_components/match-card-skeleton';
import Loading from './loading';
import { MatchDataTable } from './_components/data-table';
import { fetchMatches } from './actions';
import { columns } from './_components/columns';
import type { GetMatchesInput } from '@/lib/types';


export const dynamic = 'force-dynamic'

interface PartidosPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const FeaturedViewSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <MatchCardSkeleton key={i} />)}
    </div>
);

async function MatchList({ filters }: { filters: GetMatchesInput }) {
    const { data, totalMatches, totalPages, currentPage } = await fetchMatches(filters);
    return <MatchDataTable columns={columns} data={data} totalMatches={totalMatches} totalPages={totalPages} currentPage={currentPage} />;
}

export default function PartidosPage({ searchParams }: PartidosPageProps) {
  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : 'destacados';

  const filters: GetMatchesInput = {
    page: searchParams.page ? parseInt(searchParams.page as string) : 1,
    limit: 10,
    leagues: typeof searchParams.leagues === 'string' ? searchParams.leagues.split(',') : [],
    startDate: typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined,
    endDate: typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined,
    minValue: searchParams.minValue ? parseFloat(searchParams.minValue as string) : undefined,
    minOdds: searchParams.minOdds ? parseFloat(searchParams.minOdds as string) : undefined,
    maxOdds: searchParams.maxOdds ? parseFloat(searchParams.maxOdds as string) : undefined,
    sortBy: typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'eventTimestamp',
    sortOrder: typeof searchParams.sortOrder === 'string' && ['asc', 'desc'].includes(searchParams.sortOrder) ? (searchParams.sortOrder as 'asc' | 'desc') : 'asc',
  };

  return (
    <div>
        <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Explorador de Partidos</h1>
            <p className="mt-1 text-muted-foreground">Encuentra, filtra y analiza partidos para descubrir tu próxima apuesta de valor.</p>
        </header>

         <Tabs defaultValue={tab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="destacados">Destacados</TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="competencias">Competencias</TabsTrigger>
                <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
            </TabsList>
            <TabsContent value="destacados" className="mt-6">
                 <Suspense fallback={<FeaturedViewSkeleton />}>
                    <FeaturedView />
                 </Suspense>
            </TabsContent>
            <TabsContent value="todos" className="mt-6">
                <Suspense fallback={<Loading />} key={JSON.stringify(filters)}>
                    <MatchList filters={filters} />
                </Suspense>
            </TabsContent>
            <TabsContent value="competencias" className="mt-6">
                 <Suspense fallback={<Loading />}>
                    <CompetitionsView />
                 </Suspense>
            </TabsContent>
             <TabsContent value="tendencias" className="mt-6">
                <p>Vista de tendencias y market movers próximamente.</p>
            </TabsContent>
        </Tabs>
    </div>
  );
}
