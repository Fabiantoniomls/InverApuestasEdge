
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleSingleMatchAnalysis } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ResultsDisplay } from './results-display';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';


const initialState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Analizando...' : 'Ejecutar Análisis Rápido'}
        </Button>
    );
}

export function SingleMatchAnalysisForm() {
    const [state, formAction] = useActionState(handleSingleMatchAnalysis, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Analizar un Partido</CardTitle>
                    <CardDescription>Pega los detalles de un partido (equipos, cuotas) para obtener un análisis rápido y una recomendación.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="match">Detalles del Partido</Label>
                        <Textarea 
                            id="match" 
                            name="match" 
                            placeholder="Ej: Real Madrid vs FC Barcelona, Cuotas: 1.85, 3.50, 4.00" 
                            rows={4}
                            required 
                        />
                        {state.fields?.match && <p className="text-red-500 text-sm">{state.fields.match}</p>}
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
