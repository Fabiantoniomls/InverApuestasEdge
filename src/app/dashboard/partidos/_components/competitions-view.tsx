
import { getMatchesByLeague } from '../actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MatchCard } from './match-card';
import { SOCCER_LEAGUES } from '@/ai/flows/_data/leagues';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export async function CompetitionsView() {
    const { data: groupedMatches, error } = await getMatchesByLeague();

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error al Cargar Competiciones</AlertTitle>
                <AlertDescription>
                    No se pudieron cargar los partidos por competición. Error: {error}
                </AlertDescription>
            </Alert>
        )
    }

    const leaguesWithMatches = Object.keys(groupedMatches);

    if (leaguesWithMatches.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron competiciones con partidos próximos.</p>
            </div>
        )
    }

    return (
        <Accordion type="multiple" defaultValue={leaguesWithMatches}>
            {Object.entries(groupedMatches).map(([leagueName, matches]) => {
                const leagueInfo = SOCCER_LEAGUES.find(l => l.name === leagueName);
                return (
                    <AccordionItem value={leagueName} key={leagueName}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                           <div className="flex items-center gap-3">
                             {leagueInfo?.logoUrl && <Image src={leagueInfo.logoUrl} alt={leagueName} width={24} height={24} data-ai-hint="league logo" />}
                             {leagueName}
                             <span className="text-sm font-normal text-muted-foreground">({matches.length} partidos)</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {matches.map(match => (
                                <MatchCard key={match.id} match={match} />
                             ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}
