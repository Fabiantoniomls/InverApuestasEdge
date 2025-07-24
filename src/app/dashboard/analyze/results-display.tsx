'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface ResultsDisplayProps {
    result: {
        analysis?: string;
        valueBets: {
            match: string;
            outcome: string;
            odds: number;
            estProbability: number;
            value: number;
        }[];
        recommendations?: {
            match: string;
            outcome: string;
            value: number;
            recommendedStake: number;
        }[];
    };
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
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

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Value Bets Table</CardTitle>
                    <CardDescription>Intermediate calculations identifying potential value.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Match</TableHead>
                                <TableHead>Outcome</TableHead>
                                <TableHead className="text-right">Odds</TableHead>
                                <TableHead className="text-right">Est. Probability (%)</TableHead>
                                <TableHead className="text-right">Calculated Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.valueBets.map((bet, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{bet.match}</TableCell>
                                    <TableCell>{bet.outcome}</TableCell>
                                    <TableCell className="text-right">{bet.odds.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{bet.estProbability.toFixed(1)}%</TableCell>
                                    <TableCell className={`text-right font-bold ${bet.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {bet.value.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {result.recommendations && result.recommendations.length > 0 && (
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
                                {result.recommendations.map((rec, index) => (
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
