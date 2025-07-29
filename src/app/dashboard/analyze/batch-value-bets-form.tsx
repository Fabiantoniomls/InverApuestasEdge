
'use client'

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleCalculateBatchValueBets } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ResultsDisplay } from './results-display';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';


const initialState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Analizando...' : 'Buscar Apuestas de Valor'}
        </Button>
    );
}

export function BatchValueBetsForm() {
    const [state, formAction] = useFormState(handleCalculateBatchValueBets, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Analizar Múltiples Partidos</CardTitle>
                    <CardDescription>Pega una lista de partidos, cada uno en una nueva línea, para analizarlos en lote. Esto puede consumir cuota de tu plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <Label htmlFor="matchesText">Lista de Partidos</Label>
                        <Textarea 
                            id="matchesText" 
                            name="matchesText" 
                            placeholder="Adrian Mannarino 1.80 vs Valentin Royer 2.10\nNovak Djokovic 1.50 vs Carlos Alcaraz 2.50\n..." 
                            rows={8}
                            required 
                        />
                        {state.fields?.matchesText && <p className="text-red-500 text-sm">{state.fields.matchesText}</p>}
                    </div>
                     <div>
                        <Label htmlFor="sportKey">Clave del Deporte (Opcional)</Label>
                        <Input 
                            id="sportKey" 
                            name="sportKey" 
                            placeholder="Ej: tennis_atp_wimbledon"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Proporcionar un contexto ayuda a la IA a realizar un análisis más preciso.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <SubmitButton />
            </div>
            
            {/* Displaying general message/error */}
            {state.message && !state.data && (
                 <Alert variant={state.issues ? "destructive" : "default"}>
                    <AlertDescription>
                        {state.message}
                    </AlertDescription>
                </Alert>
            )}

            {state.data && <ResultsDisplay data={state.data} />}
        </form>
    );
}
