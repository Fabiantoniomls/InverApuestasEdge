
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleFundamentalAnalysis } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResultsDisplay } from './results-display';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { SoccerBallIcon } from './icons/soccer-ball';
import { TennisBallIcon } from './icons/tennis-ball';


const initialState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {pending ? 'Analizando...' : 'Calcular Valor'}
        </Button>
    );
}

export function FundamentalAnalysisForm() {
    const [state, formAction] = useActionState(handleFundamentalAnalysis, initialState);
    const [sport, setSport] = React.useState('futbol');

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="sport" value={sport} />
            <Card>
                <CardHeader>
                    <CardTitle>1. Deporte y Participantes</CardTitle>
                    <CardDescription>Selecciona el deporte e introduce los datos del partido que quieres analizar manualmente.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Deporte</Label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setSport('futbol')}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                                    sport === 'futbol' ? "border-primary bg-primary/5 text-primary" : "border-muted bg-transparent hover:bg-muted/50"
                                )}>
                                <SoccerBallIcon className="w-8 h-8" />
                                <span className="font-semibold">Fútbol</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSport('tenis')}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                                    sport === 'tenis' ? "border-primary bg-primary/5 text-primary" : "border-muted bg-transparent hover:bg-muted/50"
                                )}>
                                <TennisBallIcon className="w-8 h-8" />
                                <span className="font-semibold">Tenis</span>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {sport === 'futbol' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>2. Datos del Partido de Fútbol</CardTitle>
                        <CardDescription>Introduce las cuotas de mercado y las estadísticas clave para el análisis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FootballFields errors={state.fields} />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>2. Datos del Partido de Tenis</CardTitle>
                        <CardDescription>Introduce las cuotas y las estadísticas de servicio de ambos jugadores.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TennisFields errors={state.fields} />
                    </CardContent>
                </Card>
            )}

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


function FootballFields({ errors }: { errors: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="equipo_a_nombre">Equipo Local</Label>
                    <Input id="equipo_a_nombre" name="equipo_a_nombre" placeholder="Ej: Real Madrid" />
                    {errors?.equipo_a_nombre && <p className="text-red-500 text-sm">{errors.equipo_a_nombre}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="equipo_b_nombre">Equipo Visitante</Label>
                    <Input id="equipo_b_nombre" name="equipo_b_nombre" placeholder="Ej: FC Barcelona" />
                     {errors?.equipo_b_nombre && <p className="text-red-500 text-sm">{errors.equipo_b_nombre}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Cuotas de Mercado (1X2)</Label>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Input name="cuota_equipo_a" placeholder="Local" type="number" step="0.01" />
                        {errors?.cuota_equipo_a && <p className="text-red-500 text-sm">{errors.cuota_equipo_a}</p>}
                    </div>
                    <div>
                        <Input name="cuota_empate" placeholder="Empate" type="number" step="0.01" />
                        {errors?.cuota_empate && <p className="text-red-500 text-sm">{errors.cuota_empate}</p>}
                    </div>
                    <div>
                        <Input name="cuota_equipo_b" placeholder="Visitante" type="number" step="0.01" />
                        {errors?.cuota_equipo_b && <p className="text-red-500 text-sm">{errors.cuota_equipo_b}</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Goles Promedio Liga (Local/Visitante)</Label>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Input name="liga_goles_local_promedio" placeholder="Local" type="number" step="0.01" />
                         {errors?.liga_goles_local_promedio && <p className="text-red-500 text-sm">{errors.liga_goles_local_promedio}</p>}
                       </div>
                       <div>
                         <Input name="liga_goles_visitante_promedio" placeholder="Visitante" type="number" step="0.01" />
                          {errors?.liga_goles_visitante_promedio && <p className="text-red-500 text-sm">{errors.liga_goles_visitante_promedio}</p>}
                       </div>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>xG Local (A Favor/En Contra)</Label>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Input name="equipo_a_xgf" placeholder="xGF" type="number" step="0.01" />
                         {errors?.equipo_a_xgf && <p className="text-red-500 text-sm">{errors.equipo_a_xgf}</p>}
                       </div>
                       <div>
                         <Input name="equipo_a_xga" placeholder="xGA" type="number" step="0.01" />
                         {errors?.equipo_a_xga && <p className="text-red-500 text-sm">{errors.equipo_a_xga}</p>}
                       </div>
                    </div>
                </div>
                 <div className="space-y-2 col-start-2">
                    <Label>xG Visitante (A Favor/En Contra)</Label>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Input name="equipo_b_xgf" placeholder="xGF" type="number" step="0.01" />
                         {errors?.equipo_b_xgf && <p className="text-red-500 text-sm">{errors.equipo_b_xgf}</p>}
                       </div>
                       <div>
                         <Input name="equipo_b_xga" placeholder="xGA" type="number" step="0.01" />
                         {errors?.equipo_b_xga && <p className="text-red-500 text-sm">{errors.equipo_b_xga}</p>}
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TennisFields({ errors }: { errors: any }) {
    return (
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="jugador_a_nombre">Jugador A</Label>
                    <Input id="jugador_a_nombre" name="jugador_a_nombre" placeholder="Ej: Carlos Alcaraz" />
                    {errors?.jugador_a_nombre && <p className="text-red-500 text-sm">{errors.jugador_a_nombre}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jugador_b_nombre">Jugador B</Label>
                    <Input id="jugador_b_nombre" name="jugador_b_nombre" placeholder="Ej: Jannik Sinner" />
                    {errors?.jugador_b_nombre && <p className="text-red-500 text-sm">{errors.jugador_b_nombre}</p>}
                </div>
            </div>

             <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="superficie">Superficie</Label>
                    <Input id="superficie" name="superficie" placeholder="Ej: Pista Dura" />
                    {errors?.superficie && <p className="text-red-500 text-sm">{errors.superficie}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Cuotas (Jugador A)</Label>
                    <Input name="cuota_jugador_a" placeholder="Cuota A" type="number" step="0.01" />
                    {errors?.cuota_jugador_a && <p className="text-red-500 text-sm">{errors.cuota_jugador_a}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Cuotas (Jugador B)</Label>
                    <Input name="cuota_jugador_b" placeholder="Cuota B" type="number" step="0.01" />
                    {errors?.cuota_jugador_b && <p className="text-red-500 text-sm">{errors.cuota_jugador_b}</p>}
                </div>
            </div>
            
            <div>
                 <Label>Estadísticas de Saque Jugador A (% 1er Serv. / % Pts Ganados 1er / % Pts Ganados 2do)</Label>
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Input name="jugador_a_primer_servicio_pct" placeholder="% 1er Servicio" type="number" step="0.1" />
                         {errors?.jugador_a_primer_servicio_pct && <p className="text-red-500 text-sm">{errors.jugador_a_primer_servicio_pct}</p>}
                    </div>
                    <div>
                        <Input name="jugador_a_puntos_ganados_1er_serv_pct" placeholder="% Ganados 1er" type="number" step="0.1" />
                         {errors?.jugador_a_puntos_ganados_1er_serv_pct && <p className="text-red-500 text-sm">{errors.jugador_a_puntos_ganados_1er_serv_pct}</p>}
                    </div>
                    <div>
                        <Input name="jugador_a_puntos_ganados_2do_serv_pct" placeholder="% Ganados 2do" type="number" step="0.1" />
                         {errors?.jugador_a_puntos_ganados_2do_serv_pct && <p className="text-red-500 text-sm">{errors.jugador_a_puntos_ganados_2do_serv_pct}</p>}
                    </div>
                 </div>
            </div>
             <div>
                 <Label>Estadísticas de Saque Jugador B (% 1er Serv. / % Pts Ganados 1er / % Pts Ganados 2do)</Label>
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Input name="jugador_b_primer_servicio_pct" placeholder="% 1er Servicio" type="number" step="0.1" />
                         {errors?.jugador_b_primer_servicio_pct && <p className="text-red-500 text-sm">{errors.jugador_b_primer_servicio_pct}</p>}
                    </div>
                    <div>
                        <Input name="jugador_b_puntos_ganados_1er_serv_pct" placeholder="% Ganados 1er" type="number" step="0.1" />
                         {errors?.jugador_b_puntos_ganados_1er_serv_pct && <p className="text-red-500 text-sm">{errors.jugador_b_puntos_ganados_1er_serv_pct}</p>}
                    </div>
                    <div>
                        <Input name="jugador_b_puntos_ganados_2do_serv_pct" placeholder="% Ganados 2do" type="number" step="0.1" />
                         {errors?.jugador_b_puntos_ganados_2do_serv_pct && <p className="text-red-500 text-sm">{errors.jugador_b_puntos_ganados_2do_serv_pct}</p>}
                    </div>
                 </div>
            </div>
        </div>
    );
}
