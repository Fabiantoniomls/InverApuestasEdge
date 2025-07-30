
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Competitor {
    id: string;
    name: string;
    qualifier: string;
}

interface SportEvent {
    id: string;
    start_time: string;
    competitors: Competitor[];
}

interface Outcome {
    name: string;
    odds: number;
}

interface Market {
    name: string;
    outcomes: Outcome[];
}

interface Match {
    sport_event: SportEvent;
    markets?: Market[];
}

interface LiveOddsResultsProps {
    data: {
        matches: Match[];
    };
}

export function LiveOddsResults({ data }: LiveOddsResultsProps) {
    if (!data || !data.matches || data.matches.length === 0) {
        return null;
    }

    const { matches } = data;

    const getBestOdds = (match: Match) => {
        const homeTeamName = match.sport_event.competitors.find(c => c.qualifier === 'home')?.name;
        const awayTeamName = match.sport_event.competitors.find(c => c.qualifier === 'away')?.name;
        const odds: { home: number | null, away: number | null, draw: number | null } = { home: null, away: null, draw: null };
        
        const market = match.markets?.find(m => m.name.toLowerCase() === '3-way moneyline');
        if (market) {
            const homeOutcome = market.outcomes.find(o => o.name.toLowerCase() === 'home team');
            const awayOutcome = market.outcomes.find(o => o.name.toLowerCase() === 'away team');
            const drawOutcome = market.outcomes.find(o => o.name.toLowerCase() === 'draw');

            if (homeOutcome) odds.home = homeOutcome.odds;
            if (awayOutcome) odds.away = awayOutcome.odds;
            if (drawOutcome) odds.draw = drawOutcome.odds;
        }
        return { odds, homeTeamName, awayTeamName };
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultados de Cuotas en Vivo</CardTitle>
                <CardDescription>Se encontraron {matches.length} partidos. Estas son las mejores cuotas disponibles.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Partido</TableHead>
                            <TableHead className="text-center">Cuota Local</TableHead>
                            <TableHead className="text-center">Cuota Empate</TableHead>
                            <TableHead className="text-center">Cuota Visitante</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.map((match) => {
                             const { odds, homeTeamName, awayTeamName } = getBestOdds(match);
                             if (!homeTeamName || !awayTeamName) return null;
                             return (
                                <TableRow key={match.sport_event.id}>
                                    <TableCell>
                                        {format(new Date(match.sport_event.start_time), "d MMM yyyy, HH:mm", { locale: es })}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {homeTeamName} vs {awayTeamName}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">{odds.home?.toFixed(2) ?? 'N/A'}</TableCell>
                                    <TableCell className="text-center font-semibold">{odds.draw?.toFixed(2) ?? 'N/A'}</TableCell>
                                    <TableCell className="text-center font-semibold">{odds.away?.toFixed(2) ?? 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">Analizar</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
