
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
    scheduled: string;
    competitors: Competitor[];
}

interface LiveOddsResultsProps {
    data: {
        matches: SportEvent[];
    };
}

export function LiveOddsResults({ data }: LiveOddsResultsProps) {
    if (!data || !data.matches || data.matches.length === 0) {
        return null;
    }

    const { matches } = data;

    const getSimulatedOdds = () => {
        return { 
            home: parseFloat((Math.random() * (3.5 - 1.5) + 1.5).toFixed(2)),
            draw: parseFloat((Math.random() * (4.0 - 2.8) + 2.8).toFixed(2)),
            away: parseFloat((Math.random() * (5.0 - 1.8) + 1.8).toFixed(2)),
        };
    };

    const getTeamNames = (match: SportEvent) => {
        const homeTeamName = match.competitors.find(c => c.qualifier === 'home')?.name;
        const awayTeamName = match.competitors.find(c => c.qualifier === 'away')?.name;
        return { homeTeamName, awayTeamName };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultados de Partidos Programados</CardTitle>
                <CardDescription>Se encontraron {matches.length} partidos. Las cuotas son simuladas con fines demostrativos.</CardDescription>
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
                             const { homeTeamName, awayTeamName } = getTeamNames(match);
                             if (!homeTeamName || !awayTeamName) return null; // Skip if team names are not found

                             const odds = getSimulatedOdds(); // Get fresh simulated odds for each match
                             return (
                                <TableRow key={match.id}>
                                    <TableCell>
                                        {format(new Date(match.scheduled), "d MMM yyyy, HH:mm", { locale: es })}
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
