'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { AnalyzeSingleMatchOutput } from "@/ai/schemas";

interface ValueBet {
    match?: string; // Optional for manual analysis where match is implicit
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

interface ResultsDisplayProps {
    result: {
        analysis?: string;
        valueBets: ValueBet[];
        recommendations?: Recommendation[];
        isBatch?: boolean;
        batchAnalysis?: AnalyzeSingleMatchOutput[];
    };
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {

    if (result.isBatch && result.batchAnalysis) {
        return (
            <div className="mt-8 space-y-6">
                <Separator />
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Batch Analysis Results</CardTitle>
                        <CardDescription>{result.batchAnalysis.length} matches analyzed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {result.batchAnalysis.map((match, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex w-full items-center justify-between pr-4">
                                           <span>{match.teamA} vs {match.teamB}</span>
                                           {match.valueBetFound && <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">Value Bet!</span>}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 p-2">
                                        <p className="text-sm text-muted-foreground">{match.analysis}</p>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Team A Odds</p>
                                                <p className="font-bold">{match.odds.teamA.toFixed(2)}</p>
                                            </div>
                                             <div>
                                                <p className="text-xs text-muted-foreground">Draw Odds</p>
                                                <p className="font-bold">{match.odds.draw?.toFixed(2) || 'N/A'}</p>
                                            </div>
                                             <div>
                                                <p className="text-xs text-muted-foreground">Team B Odds</p>
                                                <p className="font-bold">{match.odds.teamB.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        {match.recommendation && (
                                            <div className="!mt-4 rounded-md border border-primary/20 bg-primary/5 p-3 text-center">
                                                <p className="text-sm font-bold text-primary">{match.recommendation}</p>
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Determine if any value bets were found to show the table
    const hasValueBets = result.valueBets && result.valueBets.length > 0;
    const hasRecommendations = result.recommendations && result.recommendations.length > 0;

    return (
        <div className="mt-8 space-y-6">
            <Separator />
            
            {result.analysis && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Qualitative Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{result.analysis}</p>
                    </CardContent>
                </Card>
            )}

            {hasValueBets && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Value Opportunities</CardTitle>
                        <CardDescription>Markets where the estimated probability suggests positive expected value.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {result.valueBets[0].match && <TableHead>Match</TableHead>}
                                    <TableHead>Outcome / Market</TableHead>
                                    <TableHead className="text-right">Odds</TableHead>
                                    <TableHead className="text-right">Est. Probability</TableHead>
                                    <TableHead className="text-right">Expected Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.valueBets.map((bet, index) => (
                                    <TableRow key={index} className="font-medium">
                                        {bet.match && <TableCell>{bet.match}</TableCell>}
                                        <TableCell>{bet.outcome}</TableCell>
                                        <TableCell className="text-right">{bet.odds.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{(bet.estProbability).toFixed(1)}%</TableCell>
                                        <TableCell className={`text-right font-bold text-green-600`}>
                                            {bet.value > 0 ? '+' : ''}{bet.value.toFixed(3)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
            
            {!hasValueBets && result.analysis && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">No Value Bets Found</CardTitle>
                         <CardDescription>Based on the analysis, no betting opportunities with positive expected value were identified in the main markets.</CardDescription>
                    </CardHeader>
                </Card>
            )}

            {hasRecommendations && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Betting Recommendations</CardTitle>
                        <CardDescription>Final, actionable recommendations from the portfolio manager.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Match</TableHead>
                                    <TableHead>Outcome</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                    <TableHead className="text-right">Recommended Stake (€)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.recommendations!.map((rec, index) => (
                                    <TableRow key={index} className="bg-primary/10">
                                        <TableCell className="font-medium">{rec.match}</TableCell>
                                        <TableCell>{rec.outcome}</TableCell>
                                        <TableCell className={`text-right font-bold text-green-600`}>
                                            {rec.value.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                            {rec.recommendedStake.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
