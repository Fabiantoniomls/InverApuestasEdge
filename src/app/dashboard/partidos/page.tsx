
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompetitionsView } from './_components/competitions-view';
import { FeaturedView } from './_components/featured-view';
import { MatchCardSkeleton } from './_components/match-card-skeleton';
import Loading from './loading';

export const dynamic = 'force-dynamic'

interface PartidosPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const FeaturedViewSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <MatchCardSkeleton key={i} />)}
    </div>
);

export default function PartidosPage({ searchParams }: PartidosPageProps) {
  const tab = (searchParams.tab as string) || 'destacados';

  return (
    <div>
        <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Explorador de Partidos</h1>
            <p className="mt-1 text-muted-foreground">Encuentra, filtra y analiza partidos para descubrir tu próxima apuesta de valor.</p>
        </header>

         <Tabs defaultValue={tab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="destacados">Destacados</TabsTrigger>
                <TabsTrigger value="competencias">Competencias</TabsTrigger>
                <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
            </TabsList>
            <TabsContent value="destacados" className="mt-6">
                 <Suspense fallback={<FeaturedViewSkeleton />}>
                    <FeaturedView />
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
