
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

// Sportradar uses different identifiers. This is a simplified list.
// A more robust implementation would fetch these dynamically.
const sportOptions = [
    {
        label: "Fútbol",
        options: [
            { value: "sr:competition:23", label: "La Liga (España)" },
            { value: "sr:competition:17", label: "Premier League (Inglaterra)" },
            { value: "sr:competition:21", label: "Serie A (Italia)" },
            { value: "sr:competition:35", label: "Bundesliga (Alemania)" },
            { value: "sr:competition:34", label: "Ligue 1 (Francia)" },
            { value: "sr:competition:7", label: "UEFA Champions League" },
        ]
    },
    // Add other sports as needed, mapping to Sportradar competition IDs
];


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Buscando...' : 'Obtener Cuotas en Vivo'}
        </Button>
    );
}

export function LiveOddsForm() {
    const [state, formAction] = useActionState(handleFetchLiveOdds, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Buscar Cuotas en Vivo</CardTitle>
                    <CardDescription>Selecciona una competición para buscar los próximos partidos y sus cuotas. (Datos de Sportradar)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                           <Label htmlFor="sport">Liga / Torneo</Label>
                           <Select name="sport" defaultValue="sr:competition:23" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una competición..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sportOptions.map(group => (
                                        <SelectGroup key={group.label}>
                                            <SelectLabel>{group.label}</SelectLabel>
                                            {group.options.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                           </Select>
                           {state.fields?.sport && <p className="text-red-500 text-sm">{state.fields.sport}</p>}
                        </div>
                    </div>
                     <p className="text-xs text-muted-foreground pt-2">
                        Los datos de cuotas son proporcionados por Sportradar.
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
