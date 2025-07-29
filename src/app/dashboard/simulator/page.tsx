
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { handleRunSimulation } from '../analyze/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';


const initialState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Ejecutando Simulación...' : 'Ejecutar Backtest'}
        </Button>
    );
}

const sportOptions = [
    { value: "soccer_spain_la_liga", label: "La Liga (España)" },
    { value: "soccer_epl", label: "Premier League (Inglaterra)" },
    { value: "soccer_italy_serie_a", label: "Serie A (Italia)" },
    { value: "soccer_germany_bundesliga", label: "Bundesliga (Alemania)" },
    { value: "soccer_france_ligue_one", label: "Ligue 1 (Francia)" },
    { value: "soccer_uefa_champs_league", label: "UEFA Champions League" },
];


export default function SimulatorPage() {
    const [state, formAction] = useActionState(handleRunSimulation, initialState);
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
    // Helper to find the best odds for each outcome (Home, Away, Draw)
    const getBestOdds = (match: any) => {
        const odds: { home: number | null, away: number | null, draw: number | null } = { home: null, away: null, draw: null };
        
        match.bookmakers.forEach((bookmaker: any) => {
            const h2hMarket = bookmaker.markets.find((m:any) => m.key === 'h2h');
            if (h2hMarket) {
                const homeOutcome = h2hMarket.outcomes.find((o:any) => o.name === match.home_team);
                const awayOutcome = h2hMarket.outcomes.find((o:any) => o.name === match.away_team);
                const drawOutcome = h2hMarket.outcomes.find((o:any) => o.name === 'Draw');

                if (homeOutcome && (!odds.home || homeOutcome.price > odds.home)) {
                    odds.home = homeOutcome.price;
                }
                if (awayOutcome && (!odds.away || awayOutcome.price > odds.away)) {
                    odds.away = awayOutcome.price;
                }
                if (drawOutcome && (!odds.draw || drawOutcome.price > odds.draw)) {
                    odds.draw = drawOutcome.price;
                }
            }
        });
        return odds;
    };

    return (
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-8 lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Resultados de la Simulación</CardTitle>
                        <CardDescription>
                           Resultados del backtest para la fecha y liga seleccionada. La tabla muestra los partidos y las mejores cuotas encontradas en esa fecha.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       {state.message && (
                            <Alert variant={state.issues ? "destructive" : "default"} className="mb-4">
                                <Bot className="h-4 w-4" />
                                <AlertTitle>{state.issues ? 'Error en la Simulación' : 'Simulación Completada'}</AlertTitle>
                                <AlertDescription>
                                    {state.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        {state.data?.isSimulation && state.data.data.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hora</TableHead>
                                        <TableHead>Partido</TableHead>
                                        <TableHead className="text-center">Cuota Local</TableHead>
                                        <TableHead className="text-center">Cuota Empate</TableHead>
                                        <TableHead className="text-center">Cuota Visitante</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {state.data.data.map((match: any) => {
                                        const bestOdds = getBestOdds(match);
                                        return (
                                            <TableRow key={match.id}>
                                                <TableCell>{format(new Date(match.commence_time), "HH:mm", { locale: es })}h</TableCell>
                                                <TableCell className="font-medium">{match.home_team} vs {match.away_team}</TableCell>
                                                <TableCell className="text-center font-mono">{bestOdds.home?.toFixed(2) ?? 'N/A'}</TableCell>
                                                <TableCell className="text-center font-mono">{bestOdds.draw?.toFixed(2) ?? 'N/A'}</TableCell>
                                                <TableCell className="text-center font-mono">{bestOdds.away?.toFixed(2) ?? 'N/A'}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                        
                        {state.data?.isSimulation && state.data.data.length === 0 && (
                             <p className="text-center text-muted-foreground py-8">No se encontraron datos de partidos para la fecha y liga seleccionada.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-8 lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Configurar Simulación</CardTitle>
                        <CardDescription>
                            Elige una fecha histórica y una liga para realizar un backtest de tu estrategia.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-6">
                            <div>
                                <label htmlFor="sport" className="text-sm font-medium">Liga</label>
                                 <Select name="sport" defaultValue="soccer_spain_la_liga" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una liga..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fútbol</SelectLabel>
                                            {sportOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                               </Select>
                                {state.fields?.sport && <p className="text-red-500 text-sm mt-1">{state.fields.sport}</p>}
                            </div>
                            <div>
                                 <label htmlFor="date" className="text-sm font-medium">Fecha del Backtest</label>
                                 <input type="hidden" name="date" value={date?.toISOString() ?? ''} />
                                 <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        disabled={(day) => day > new Date() || day < new Date("2020-06-06")}
                                    />
                                    </PopoverContent>
                                </Popover>
                                {state.fields?.date && <p className="text-red-500 text-sm mt-1">{state.fields.date}</p>}
                            </div>
                            <SubmitButton />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
