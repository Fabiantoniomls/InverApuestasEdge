
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

const CompetitionsViewSkeleton = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <MatchCardSkeleton key={i} />)}
    </div>
)

async function MatchList({ filters }: { filters: GetMatchesInput }) {
    const { data, totalMatches, totalPages, currentPage } = await fetchMatches(filters);
    return <MatchDataTable columns={columns} data={data} totalMatches={totalMatches} totalPages={totalPages} currentPage={currentPage} />;
}

export default function PartidosPage({ searchParams }: PartidosPageProps) {
  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : 'destacados';
  const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1;
  const leagues = typeof searchParams.leagues === 'string' ? searchParams.leagues.split(',') : [];
  const startDate = typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined;
  const endDate = typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined;
  const minValue = searchParams.minValue ? parseFloat(searchParams.minValue as string) : undefined;
  const minOdds = searchParams.minOdds ? parseFloat(searchParams.minOdds as string) : undefined;
  const maxOdds = searchParams.maxOdds ? parseFloat(searchParams.maxOdds as string) : undefined;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'eventTimestamp';
  const sortOrderValue = typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder : 'asc';
  const sortOrder = ['asc', 'desc'].includes(sortOrderValue) ? (sortOrderValue as 'asc' | 'desc') : 'asc';

  const filters: GetMatchesInput = {
    page,
    limit: 10,
    leagues,
    startDate,
    endDate,
    minValue,
    minOdds,
    maxOdds,
    sortBy,
    sortOrder,
  };

  return (
    <div>
        <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Explorador de Partidos</h1>
            <p className="mt-1 text-muted-foreground">Encuentra, filtra y analiza partidos para descubrir tu próxima apuesta de valor.</p>
        </header>

         <Tabs defaultValue={tab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="destacados">Destacados</TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="competencias">Competencias</TabsTrigger>
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
                 <Suspense fallback={<CompetitionsViewSkeleton />}>
                    <CompetitionsView />
                 </Suspense>
            </TabsContent>
        </Tabs>
    </div>
  );
}
