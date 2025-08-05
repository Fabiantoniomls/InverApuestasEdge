import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ConfidenceGauge } from "./_components/confidence-gauge";
import type { NarrativeSynthesisOutput } from "@/ai/flows/narrativeSynthesisFlow";

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
        narrativeSynthesis?: NarrativeSynthesisOutput;
        confidence?: number;
    };
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
    if (!data || data.isLiveOdds) return null;

    const { analysis, valueBets, recommendations, batchAnalysis, isBatch, narrativeSynthesis, confidence } = data;

    // --- New Narrative Synthesis Display ---
    if (narrativeSynthesis && confidence) {
        return (
            <div className="space-y-4">
                {narrativeSynthesis.valueBets.map((bet, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{bet.market}</CardTitle>
                                    <CardDescription>Mercado: {valueBets?.[index]?.match || "Partido"}</CardDescription>
                                </div>
                                <ConfidenceGauge value={confidence} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-y py-4 my-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Cuota</p>
                                    <p className="font-bold text-lg">{bet.odds.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Prob. Modelo</p>
                                    <p className="font-bold text-lg">{(bet.modelProbability * 100).toFixed(1)}%</p>
                                </div>
                                <div className="text-green-600">
                                    <p className="text-sm">Valor Esperado (EV)</p>
                                    <p className="font-bold text-lg">+{(bet.expectedValue * 100).toFixed(1)}%</p>
                                </div>
                                <div className="text-primary">
                                    <p className="text-sm">Stake Sugerido</p>
                                    <p className="font-bold text-lg">{recommendations?.[index]?.recommendedStake.toFixed(2) || 'N/A'} Uds.</p>
                                </div>
                            </div>
                            
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Ver Análisis Detallado</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: narrativeSynthesis.narrative.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
                 {narrativeSynthesis.valueBets.length === 0 && (
                     <Card>
                        <CardHeader>
                           <CardTitle>Análisis Completado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{narrativeSynthesis.narrative}</p>
                             <p className="mt-4 font-semibold">No se han encontrado apuestas de valor con los criterios actuales.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }


    // --- Existing Displays (for other forms) ---
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