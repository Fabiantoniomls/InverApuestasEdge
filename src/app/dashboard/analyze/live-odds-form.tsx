
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleFetchLiveOdds } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LiveOddsResults } from './live-odds-results';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';


const initialState = {
    message: '',
};

// This list can be dynamic in a future version by fetching available sports
const sportOptions = [
    { value: "soccer", label: "Fútbol" },
    // We can add more sports as Sportradar implementation expands
];


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Buscando...' : 'Obtener Partidos Programados'}
        </Button>
    );
}

export function LiveOddsForm() {
    const [state, formAction] = useActionState(handleFetchLiveOdds, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Buscar Partidos Programados</CardTitle>
                    <CardDescription>Selecciona un deporte para buscar los próximos partidos programados para los siguientes 7 días. (Datos de Sportradar)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                           <Label htmlFor="sport">Deporte</Label>
                           <Select name="sport" defaultValue="soccer" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un deporte..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sportOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                           </Select>
                           {state.fields?.sport && <p className="text-red-500 text-sm">{state.fields.sport}</p>}
                        </div>
                     <p className="text-xs text-muted-foreground pt-2">
                        Los datos de partidos son proporcionados por Sportradar. La disponibilidad puede variar.
                    </p>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <SubmitButton />
            </div>
            
            {state.message && (
                 <Alert variant={state.issues ? "destructive" : "default"}>
                    <AlertDescription>
                        {state.message}
                    </AlertDescription>
                </Alert>
            )}

            {state.data?.isLiveOdds && <LiveOddsResults data={state.data} />}
        </form>
    );
}
