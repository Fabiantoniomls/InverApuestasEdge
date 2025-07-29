
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Outcome {
    name: string;
    price: number;
}

interface Market {
    key: string;
    last_update: number;
    outcomes: Outcome[];
}

interface Bookmaker {
    key: string;
    title: string;
    last_update: number;
    markets: Market[];
}

interface Match {
    id: string;
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Bookmaker[];
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

    // Helper to find the best odds for each outcome (Home, Away, Draw)
    const getBestOdds = (match: Match) => {
        const odds: { home: number | null, away: number | null, draw: number | null } = { home: null, away: null, draw: null };
        
        match.bookmakers.forEach(bookmaker => {
            const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
            if (h2hMarket) {
                const homeOutcome = h2hMarket.outcomes.find(o => o.name === match.home_team);
                const awayOutcome = h2hMarket.outcomes.find(o => o.name === match.away_team);
                const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');

                if (homeOutcome && (!odds.home || homeOutcome.price > odds.home)) {
                    odds.home = homeOutcome.price;
                }
                if (awayOutcome && (!odds.away || awayOutcome.price > odds.away)) {
                    odds.away = awayOutcome.price;
                }
                if (drawOutcome && (!odds.draw || drawOutcome.price > odds.draw)) {
                    odds.draw = drawOutcome.price;
                }
            }
        });
        return odds;
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultados de Cuotas en Vivo</CardTitle>
                <CardDescription>Se encontraron {matches.length} partidos. Estas son las mejores cuotas disponibles en el mercado seleccionado.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Partido</TableHead>
                            <TableHead className="text-center">Mejor Cuota Local</TableHead>
                            <TableHead className="text-center">Mejor Cuota Empate</TableHead>
                            <TableHead className="text-center">Mejor Cuota Visitante</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.map((match) => {
                             const bestOdds = getBestOdds(match);
                             return (
                                <TableRow key={match.id}>
                                    <TableCell>
                                        {format(new Date(match.commence_time), "d MMM yyyy, HH:mm", { locale: es })}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {match.home_team} vs {match.away_team}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">{bestOdds.home?.toFixed(2) ?? 'N/A'}</TableCell>
                                    <TableCell className="text-center font-semibold">{bestOdds.draw?.toFixed(2) ?? 'N/A'}</TableCell>
                                    <TableCell className="text-center font-semibold">{bestOdds.away?.toFixed(2) ?? 'N/A'}</TableCell>
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
