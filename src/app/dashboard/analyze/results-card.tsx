
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ValueBet {
    market: string;
    ev: number;
    odds: number;
    probability: number;
}

interface ResultsCardProps {
    results: {
        probabilities: {
            home: number;
            draw: number;
            away: number;
        };
        valueBets: ValueBet[];
    };
}

export function ResultsCard({ results }: ResultsCardProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>3. Resultados y Valor</CardTitle>
                <CardDescription>Las probabilidades estimadas por el modelo y las oportunidades de valor encontradas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Probabilidad Real Estimada</h4>
                    <div className="flex justify-around bg-muted p-4 rounded-lg">
                        <div className="text-center">
                            <p className="font-bold text-2xl text-foreground">{results.probabilities.home}%</p>
                            <p className="text-xs text-muted-foreground">Victoria Local</p>
                        </div>
                        <Separator orientation="vertical" className="h-auto" />
                        <div className="text-center">
                            <p className="font-bold text-2xl text-foreground">{results.probabilities.draw}%</p>
                            <p className="text-xs text-muted-foreground">Empate</p>
                        </div>
                        <Separator orientation="vertical" className="h-auto" />
                        <div className="text-center">
                            <p className="font-bold text-2xl text-foreground">{results.probabilities.away}%</p>
                            <p className="text-xs text-muted-foreground">Victoria Visitante</p>
                        </div>
                    </div>
                </div>

                {results.valueBets.length > 0 && (
                    <div className="space-y-4">
                        {results.valueBets.map((bet, index) => (
                             <div key={index} className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-lg">
                                <p className="text-sm font-bold text-green-700">APUESTA DE VALOR IDENTIFICADA</p>
                                <div className="flex items-end justify-between mt-2">
                                    <div>
                                        <p className="text-lg font-bold text-foreground">{bet.market}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Cuota: {bet.odds.toFixed(2)} | Prob. Modelo: {bet.probability}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Valor Esperado</p>
                                        <p className="font-bold text-3xl text-green-600">+{bet.ev.toFixed(1)}%</p>
                                    </div>
                                </div>
                                 <button className="text-xs text-primary hover:underline mt-2">Ver desglose del cálculo</button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
