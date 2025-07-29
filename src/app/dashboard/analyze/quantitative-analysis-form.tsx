
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleQuantitativeAnalysis } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ResultsDisplay } from './results-display';
import { Alert, AlertDescription } from '@/components/ui/alert';


const initialState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Analizando...' : 'Ejecutar Análisis Cuantitativo'}
        </Button>
    );
}

export function QuantitativeAnalysisForm() {
    const [state, formAction] = useActionState(handleQuantitativeAnalysis, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>1. Datos de los Equipos y Liga</CardTitle>
                    <CardDescription>Introduce la información de los equipos y las medias de la liga para el modelo.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label htmlFor="teamA">Equipo Local</Label>
                        <Input id="teamA" name="teamA" placeholder="Ej: Real Madrid" required />
                         {state.fields?.teamA && <p className="text-red-500 text-sm">{state.fields.teamA}</p>}
                        
                        <Label htmlFor="teamAUrl">URL de Datos (FBref)</Label>
                        <Input id="teamAUrl" name="teamAUrl" placeholder="https://fbref.com/en/squads/..." type="url" required/>
                        {state.fields?.teamAUrl && <p className="text-red-500 text-sm">{state.fields.teamAUrl}</p>}
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="teamB">Equipo Visitante</Label>
                        <Input id="teamB" name="teamB" placeholder="Ej: FC Barcelona" required />
                        {state.fields?.teamB && <p className="text-red-500 text-sm">{state.fields.teamB}</p>}

                        <Label htmlFor="teamBUrl">URL de Datos (FBref)</Label>
                        <Input id="teamBUrl" name="teamBUrl" placeholder="https://fbref.com/en/squads/..." type="url" required/>
                        {state.fields?.teamBUrl && <p className="text-red-500 text-sm">{state.fields.teamBUrl}</p>}
                    </div>
                     <div className="space-y-2 col-span-full">
                        <Label>Promedios de Goles de la Liga</Label>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <Input name="leagueHomeAvg" placeholder="Goles Local Promedio" type="number" step="0.01" required/>
                                {state.fields?.leagueHomeAvg && <p className="text-red-500 text-sm">{state.fields.leagueHomeAvg}</p>}
                             </div>
                             <div>
                                <Input name="leagueAwayAvg" placeholder="Goles Visitante Promedio" type="number" step="0.01" required/>
                                {state.fields?.leagueAwayAvg && <p className="text-red-500 text-sm">{state.fields.leagueAwayAvg}</p>}
                             </div>
                         </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>2. Cuotas de Mercado y Gestión de Riesgo</CardTitle>
                    <CardDescription>Define las cuotas y tu estrategia de staking para calcular las recomendaciones.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>Cuotas del Mercado 1X2</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                               <Input name="oddsHome" placeholder="Local" type="number" step="0.01" required/>
                               {state.fields?.oddsHome && <p className="text-red-500 text-sm">{state.fields.oddsHome}</p>}
                            </div>
                            <div>
                               <Input name="oddsDraw" placeholder="Empate" type="number" step="0.01" required/>
                               {state.fields?.oddsDraw && <p className="text-red-500 text-sm">{state.fields.oddsDraw}</p>}
                            </div>
                            <div>
                               <Input name="oddsAway" placeholder="Visitante" type="number" step="0.01" required/>
                               {state.fields?.oddsAway && <p className="text-red-500 text-sm">{state.fields.oddsAway}</p>}
                            </div>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bankroll">Capital Total (Bankroll)</Label>
                            <Input id="bankroll" name="bankroll" type="number" placeholder="Ej: 1000" required />
                             {state.fields?.bankroll && <p className="text-red-500 text-sm">{state.fields.bankroll}</p>}
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="stakingStrategy">Estrategia de Staking</Label>
                             <Select name="stakingStrategy" defaultValue="QuarterKelly">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona estrategia..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="QuarterKelly">Cuarto de Kelly</SelectItem>
                                    <SelectItem value="HalfKelly">Medio Kelly</SelectItem>
                                    <SelectItem value="FullKelly">Kelly Completo</SelectItem>
                                    <SelectItem value="Percentage">Porcentaje Fijo (1%)</SelectItem>
                                    <SelectItem value="Fixed">Apuesta Fija (10€)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                     </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end">
                <SubmitButton />
            </div>

            {state.message && state.issues && (
                 <Alert variant="destructive">
                    <AlertDescription>
                        <p>{state.message}</p>
                        <ul>
                            {state.issues.map((issue, index) => (
                                <li key={index}>- {issue}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {state.data && <ResultsDisplay data={state.data} />}
        </form>
    );
}
