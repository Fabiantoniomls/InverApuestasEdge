
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ValueBet {
    match: string;
    outcome: string;
    odds: number;
    estProbability: number;
    value: number;
}

interface Recommendation {
    match: string;
    outcome: string;
    value: number;
    recommendedStake: number;
}

interface BatchAnalysisResult {
    teamA: string;
    teamB: string;
    odds: {
        teamA: number;
        teamB: number;
        draw?: number;
    };
    analysis: string;
    valueBetFound: boolean;
    recommendation?: string;
}

interface ResultsDisplayProps {
    data: {
        analysis?: string;
        valueBets?: ValueBet[];
        recommendations?: Recommendation[];
        batchAnalysis?: BatchAnalysisResult[];
        isBatch?: boolean;
        isLiveOdds?: boolean; // To prevent rendering in this component
    };
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
    if (!data || data.isLiveOdds) return null;

    const { analysis, valueBets, recommendations, batchAnalysis, isBatch } = data;

    if (isBatch && batchAnalysis) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Resultados del Análisis por Lotes</CardTitle>
                    <CardDescription>{batchAnalysis.length} partidos analizados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partido</TableHead>
                                <TableHead>Análisis</TableHead>
                                <TableHead>Recomendación</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batchAnalysis.map((match, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{match.teamA} vs {match.teamB}</TableCell>
                                    <TableCell>{match.analysis}</TableCell>
                                    <TableCell>
                                        {match.valueBetFound && match.recommendation ? (
                                            <Badge variant="default" className="bg-green-100 text-green-800">{match.recommendation}</Badge>
                                        ) : (
                                            <Badge variant="secondary">Sin Valor</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {analysis && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Análisis Cualitativo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{analysis}</p>
                    </CardContent>
                </Card>
            )}

            {valueBets && valueBets.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Oportunidades de Valor</CardTitle>
                        <CardDescription>Mercados donde el modelo estima una ventaja sobre las cuotas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mercado</TableHead>
                                    <TableHead className="text-right">Cuota</TableHead>
                                    <TableHead className="text-right">Prob. Modelo</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {valueBets.map((bet, index) => (
                                     <TableRow key={index} className={bet.value > 0 ? 'bg-green-50' : ''}>
                                        <TableCell className="font-medium">{bet.outcome}</TableCell>
                                        <TableCell className="text-right">{bet.odds.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{bet.estProbability.toFixed(2)}%</TableCell>
                                        <TableCell className={`text-right font-semibold ${bet.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {(bet.value * 100).toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {recommendations && recommendations.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Apuestas Recomendadas</CardTitle>
                        <CardDescription>Basado en tu estrategia de staking, estas son las apuestas sugeridas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Resultado</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Importe Sugerido</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recommendations.map((rec, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{rec.outcome}</TableCell>
                                        <TableCell className="text-right font-semibold text-green-600">
                                            {(rec.value * 100).toFixed(2)}%
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                            €{rec.recommendedStake.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
