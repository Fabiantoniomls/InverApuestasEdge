
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleFetchLiveOdds } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LiveOddsResults } from './live-odds-results';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const initialState = {
    message: '',
};

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
                    <CardDescription>Selecciona un deporte y una región para buscar los próximos partidos y sus cuotas en diferentes casas de apuestas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                           <Label htmlFor="sport">Deporte</Label>
                           <Input id="sport" name="sport" placeholder="Ej: soccer_epl" defaultValue="soccer_spain_la_liga" required />
                           {state.fields?.sport && <p className="text-red-500 text-sm">{state.fields.sport}</p>}
                        </div>
                        <div>
                           <Label htmlFor="regions">Región</Label>
                            <Select name="regions" defaultValue="eu">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona región..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="eu">Europa</SelectItem>
                                    <SelectItem value="us">EE. UU.</SelectItem>
                                    <SelectItem value="uk">Reino Unido</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                </SelectContent>
                            </Select>
                           {state.fields?.regions && <p className="text-red-500 text-sm">{state.fields.regions}</p>}
                        </div>
                        <div>
                           <Label htmlFor="markets">Mercado</Label>
                           <Select name="markets" defaultValue="h2h">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona mercado..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="h2h">Resultado Final (1X2)</SelectItem>
                                    <SelectItem value="spreads">Hándicap Asiático</SelectItem>
                                    <SelectItem value="totals">Totales (Más/Menos)</SelectItem>
                                </SelectContent>
                            </Select>
                           {state.fields?.markets && <p className="text-red-500 text-sm">{state.fields.markets}</p>}
                        </div>
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">
                        Consulta la documentación de <a href="https://the-odds-api.com/sports-odds-data/sports-apis.html" target="_blank" rel="noopener noreferrer" className="underline">The Odds API</a> para ver todas las claves de deportes disponibles.
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
