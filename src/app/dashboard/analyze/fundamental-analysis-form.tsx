'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleFundamentalAnalysis, type ActionState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ResultsDisplay } from './results-display';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-bold">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Analyzing...' : 'Run Fundamental Analysis'}
    </Button>
  );
}

export function FundamentalAnalysisForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useFormState(handleFundamentalAnalysis, initialState);
  const { toast } = useToast();
  const [sport, setSport] = useState('futbol');

  useEffect(() => {
    if (state?.message && !state.issues) {
      toast({
        title: 'Success',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="sport" value={sport} />
      <div className="space-y-4">
          <div>
            <Label htmlFor="sport">Sport</Label>
            <Select onValueChange={setSport} defaultValue={sport}>
              <SelectTrigger id="sport-select">
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="futbol">Football</SelectItem>
                <SelectItem value="tenis">Tennis</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </div>

      {sport === 'futbol' && <FootballFields state={state} />}
      {sport === 'tenis' && <TennisFields state={state} />}

       {state?.message && state.issues && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />

      {state?.data && <ResultsDisplay result={state.data} />}
    </form>
  );
}


function FootballFields({ state }: { state: ActionState }) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Match Details</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="equipo_a_nombre">Team A</Label>
                        <Input id="equipo_a_nombre" name="equipo_a_nombre" placeholder="e.g., Man City" defaultValue="Man City" />
                        {state?.fields?.equipo_a_nombre && <p className="mt-1 text-xs text-red-500">{state.fields.equipo_a_nombre}</p>}
                    </div>
                    <div>
                        <Label htmlFor="equipo_b_nombre">Team B</Label>
                        <Input id="equipo_b_nombre" name="equipo_b_nombre" placeholder="e.g., Arsenal" defaultValue="Arsenal" />
                        {state?.fields?.equipo_b_nombre && <p className="mt-1 text-xs text-red-500">{state.fields.equipo_b_nombre}</p>}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Market Odds</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="cuota_equipo_a">Team A Win Odds</Label>
                        <Input id="cuota_equipo_a" name="cuota_equipo_a" type="number" step="0.01" defaultValue="1.85" />
                        {state?.fields?.cuota_equipo_a && <p className="mt-1 text-xs text-red-500">{state.fields.cuota_equipo_a}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cuota_empate">Draw Odds</Label>
                        <Input id="cuota_empate" name="cuota_empate" type="number" step="0.01" defaultValue="3.50" />
                        {state?.fields?.cuota_empate && <p className="mt-1 text-xs text-red-500">{state.fields.cuota_empate}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cuota_equipo_b">Team B Win Odds</Label>
                        <Input id="cuota_equipo_b" name="cuota_equipo_b" type="number" step="0.01" defaultValue="4.20" />
                        {state?.fields?.cuota_equipo_b && <p className="mt-1 text-xs text-red-500">{state.fields.cuota_equipo_b}</p>}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Statistical Data</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div>
                        <Label htmlFor="liga_goles_local_promedio">League Avg. Home Goals</Label>
                        <Input id="liga_goles_local_promedio" name="liga_goles_local_promedio" type="number" step="0.01" defaultValue="1.65" />
                        {state?.fields?.liga_goles_local_promedio && <p className="mt-1 text-xs text-red-500">{state.fields.liga_goles_local_promedio}</p>}
                    </div>
                    <div>
                        <Label htmlFor="liga_goles_visitante_promedio">League Avg. Away Goals</Label>
                        <Input id="liga_goles_visitante_promedio" name="liga_goles_visitante_promedio" type="number" step="0.01" defaultValue="1.25" />
                        {state?.fields?.liga_goles_visitante_promedio && <p className="mt-1 text-xs text-red-500">{state.fields.liga_goles_visitante_promedio}</p>}
                    </div>
                    <div>
                        <Label htmlFor="equipo_a_xgf">Team A xG For</Label>
                        <Input id="equipo_a_xgf" name="equipo_a_xgf" type="number" step="0.01" defaultValue="1.9" />
                        {state?.fields?.equipo_a_xgf && <p className="mt-1 text-xs text-red-500">{state.fields.equipo_a_xgf}</p>}
                    </div>
                    <div>
                        <Label htmlFor="equipo_a_xga">Team A xG Against</Label>
                        <Input id="equipo_a_xga" name="equipo_a_xga" type="number" step="0.01" defaultValue="0.8" />
                        {state?.fields?.equipo_a_xga && <p className="mt-1 text-xs text-red-500">{state.fields.equipo_a_xga}</p>}
                    </div>
                     <div>
                        <Label htmlFor="equipo_b_xgf">Team B xG For</Label>
                        <Input id="equipo_b_xgf" name="equipo_b_xgf" type="number" step="0.01" defaultValue="1.5" />
                        {state?.fields?.equipo_b_xgf && <p className="mt-1 text-xs text-red-500">{state.fields.equipo_b_xgf}</p>}
                    </div>
                    <div>
                        <Label htmlFor="equipo_b_xga">Team B xG Against</Label>
                        <Input id="equipo_b_xga" name="equipo_b_xga" type="number" step="0.01" defaultValue="1.1" />
                        {state?.fields?.equipo_b_xga && <p className="mt-1 text-xs text-red-500">{state.fields.equipo_b_xga}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TennisFields({ state }: { state: ActionState }) {
    return (
      <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Match Details</h3>
                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="jugador_a_nombre">Player A</Label>
                        <Input id="jugador_a_nombre" name="jugador_a_nombre" placeholder="e.g., C. Alcaraz" defaultValue="C. Alcaraz" />
                        {state?.fields?.jugador_a_nombre && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_a_nombre}</p>}
                    </div>
                    <div>
                        <Label htmlFor="jugador_b_nombre">Player B</Label>
                        <Input id="jugador_b_nombre" name="jugador_b_nombre" placeholder="e.g., J. Sinner" defaultValue="J. Sinner" />
                        {state?.fields?.jugador_b_nombre && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_b_nombre}</p>}
                    </div>
                     <div>
                        <Label htmlFor="superficie">Surface</Label>
                        <Input id="superficie" name="superficie" placeholder="e.g., Clay, Hard, Grass" defaultValue="Clay" />
                        {state?.fields?.superficie && <p className="mt-1 text-xs text-red-500">{state.fields.superficie}</p>}
                    </div>
                </div>
            </div>

             <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Market Odds</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="cuota_jugador_a">Player A Win Odds</Label>
                        <Input id="cuota_jugador_a" name="cuota_jugador_a" type="number" step="0.01" defaultValue="1.75" />
                        {state?.fields?.cuota_jugador_a && <p className="mt-1 text-xs text-red-500">{state.fields.cuota_jugador_a}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cuota_jugador_b">Player B Win Odds</Label>
                        <Input id="cuota_jugador_b" name="cuota_jugador_b" type="number" step="0.01" defaultValue="2.10" />
                        {state?.fields?.cuota_jugador_b && <p className="mt-1 text-xs text-red-500">{state.fields.cuota_jugador_b}</p>}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Player A Statistics (%)</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="jugador_a_primer_servicio_pct">1st Serve %</Label>
                        <Input id="jugador_a_primer_servicio_pct" name="jugador_a_primer_servicio_pct" type="number" step="0.1" defaultValue="65" />
                        {state?.fields?.jugador_a_primer_servicio_pct && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_a_primer_servicio_pct}</p>}
                    </div>
                    <div>
                        <Label htmlFor="jugador_a_puntos_ganados_1er_serv_pct">1st Serve Pts Won %</Label>
                        <Input id="jugador_a_puntos_ganados_1er_serv_pct" name="jugador_a_puntos_ganados_1er_serv_pct" type="number" step="0.1" defaultValue="75" />
                         {state?.fields?.jugador_a_puntos_ganados_1er_serv_pct && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_a_puntos_ganados_1er_serv_pct}</p>}
                    </div>
                    <div>
                        <Label htmlFor="jugador_a_puntos_ganados_2do_serv_pct">2nd Serve Pts Won %</Label>
                        <Input id="jugador_a_puntos_ganados_2do_serv_pct" name="jugador_a_puntos_ganados_2do_serv_pct" type="number" step="0.1" defaultValue="55" />
                        {state?.fields?.jugador_a_puntos_ganados_2do_serv_pct && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_a_puntos_ganados_2do_serv_pct}</p>}
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Player B Statistics (%)</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="jugador_b_primer_servicio_pct">1st Serve %</Label>
                        <Input id="jugador_b_primer_servicio_pct" name="jugador_b_primer_servicio_pct" type="number" step="0.1" defaultValue="68" />
                         {state?.fields?.jugador_b_primer_servicio_pct && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_b_primer_servicio_pct}</p>}
                    </div>
                    <div>
                        <Label htmlFor="jugador_b_puntos_ganados_1er_serv_pct">1st Serve Pts Won %</Label>
                        <Input id="jugador_b_puntos_ganados_1er_serv_pct" name="jugador_b_puntos_ganados_1er_serv_pct" type="number" step="0.1" defaultValue="72" />
                        {state?.fields?.jugador_b_puntos_ganados_1er_serv_pct && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_b_puntos_ganados_1er_serv_pct}</p>}
                    </div>
                    <div>
                        <Label htmlFor="jugador_b_puntos_ganados_2do_serv_pct">2nd Serve Pts Won %</Label>
                        <Input id="jugador_b_puntos_ganados_2do_serv_pct" name="jugador_b_puntos_ganados_2do_serv_pct" type="number" step="0.1" defaultValue="52" />
                         {state?.fields?.jugador_b_puntos_ganados_2do_serv_pct && <p className="mt-1 text-xs text-red-500">{state.fields.jugador_b_puntos_ganados_2do_serv_pct}</p>}
                    </div>
                </div>
            </div>
      </div>
    );
}
