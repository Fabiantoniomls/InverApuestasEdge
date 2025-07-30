
import { getMatchesByLeague } from '../actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MatchCard } from './match-card';
import { SOCCER_LEAGUES } from '@/ai/flows/_data/leagues';
import Image from 'next/image';

export async function CompetitionsView() {
    const groupedMatches = await getMatchesByLeague();

    return (
        <Accordion type="multiple" defaultValue={Object.keys(groupedMatches)}>
            {Object.entries(groupedMatches).map(([leagueName, matches]) => {
                const leagueInfo = SOCCER_LEAGUES.find(l => l.name === leagueName);
                return (
                    <AccordionItem value={leagueName} key={leagueName}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                           <div className="flex items-center gap-3">
                             {leagueInfo?.logoUrl && <Image src={leagueInfo.logoUrl} alt={leagueName} width={24} height={24} />}
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
