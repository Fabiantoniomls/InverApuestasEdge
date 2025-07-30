
'use client'

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Bot, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';


const sportOptions = [
    { value: "soccer_spain_la_liga", label: "La Liga (España)" },
    { value: "soccer_epl", label: "Premier League (Inglaterra)" },
    { value: "soccer_italy_serie_a", label: "Serie A (Italia)" },
    { value: "soccer_germany_bundesliga", label: "Bundesliga (Alemania)" },
    { value: "soccer_france_ligue_one", label: "Ligue 1 (Francia)" },
    { value: "soccer_uefa_champs_league", label: "UEFA Champions League" },
];


export default function SimulatorPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

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
                        <p className="text-center text-muted-foreground py-8">Los resultados de la simulación aparecerán aquí una vez que la configures y la ejecutes.</p>
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
                        <div className="space-y-6">
                             <Alert variant="destructive">
                                <Bot className="h-4 w-4" />
                                <AlertTitle>Funcionalidad Premium Requerida</AlertTitle>
                                <AlertDescription>
                                    El acceso a los datos de cuotas históricas de The Odds API solo está disponible en sus planes de pago. Para activar esta funcionalidad, por favor actualiza tu suscripción.
                                     <a href="https://the-odds-api.com" target="_blank" rel="noopener noreferrer">
                                        <Button variant="link" className="p-0 h-auto mt-2 text-destructive-foreground">
                                            Ver Planes de The Odds API <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </a>
                                </AlertDescription>
                            </Alert>
                            <div>
                                <label htmlFor="sport" className="text-sm font-medium text-muted-foreground">Liga</label>
                                 <Select name="sport" defaultValue="soccer_spain_la_liga" required disabled>
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
                            </div>
                            <div>
                                 <label htmlFor="date" className="text-sm font-medium text-muted-foreground">Fecha del Backtest</label>
                                 <input type="hidden" name="date" value={date?.toISOString() ?? ''} />
                                 <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                        )}
                                        disabled
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
                            </div>
                             <Button type="submit" disabled className="w-full">
                                Ejecutar Backtest
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
