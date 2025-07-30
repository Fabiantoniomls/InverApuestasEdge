
import { fetchLiveOdds } from "@/ai/flows/fetch-live-odds-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export async function UpcomingMatches() {
    let upcomingMatches = [];
    let fetchError = null;

    try {
        const { matches } = await fetchLiveOdds({ sport: 'soccer_spain_la_liga', regions: 'eu', markets: 'h2h' });
        upcomingMatches = matches.slice(0, 4); // Limit to 4 matches
    } catch (error: any) {
        console.error("Failed to fetch upcoming matches:", error);
        fetchError = error.message;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Próximos Partidos</CardTitle>
                    <CardDescription>Partidos destacados de La Liga (España) para analizar.</CardDescription>
                </div>
                <Link href="/dashboard/partidos?tab=todos" passHref>
                     <Button variant="outline">
                        Ver todos <ArrowRight className="ml-2" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {fetchError ? (
                    <div className="flex flex-col items-center justify-center text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="size-8 text-red-500 mb-2" />
                        <p className="font-semibold text-red-700">No se pudieron cargar los partidos</p>
                        <p className="text-sm text-red-600">La API de cuotas puede haber alcanzado su límite. Inténtalo más tarde.</p>
                    </div>
                ) : upcomingMatches.length === 0 ? (
                     <p className="text-muted-foreground text-center py-4">No se encontraron próximos partidos para La Liga en este momento.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {upcomingMatches.map(match => (
                            <div key={match.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                <div className="font-semibold text-foreground">{match.home_team} vs {match.away_team}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                    <Calendar className="size-4" />
                                    <span>{format(new Date(match.commence_time), "d MMM yyyy", { locale: es })}</span>
                                </div>
                                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="size-4" />
                                    <span>{format(new Date(match.commence_time), "HH:mm", { locale: es })}h</span>
                                </div>
                                 <Link href={`/dashboard/analyze?mode=quantitative&teamA=${match.home_team}&teamB=${match.away_team}`} passHref>
                                    <Button variant="link" className="p-0 h-auto mt-3">
                                        Analizar Partido
                                        <ArrowRight className="ml-1 size-4" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
