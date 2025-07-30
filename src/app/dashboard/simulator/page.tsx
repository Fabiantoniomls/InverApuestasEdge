
'use client'

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Bot, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { handleRunSimulation, ActionState } from '../analyze/actions';
import { SimulationResults } from './_components/simulation-results';


const sportOptions = [
    { value: "sr:sport:1", label: "Fútbol" },
    // Add more sports as Sportradar implementation expands
];

const initialState: ActionState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Ejecutando...' : 'Ejecutar Backtest'}
        </Button>
    );
}

export default function SimulatorPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [state, formAction] = useActionState(handleRunSimulation, initialState);


    return (
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-8 lg:col-span-2">
                 {state.data ? (
                    <SimulationResults data={state.data} />
                 ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Resultados de la Simulación</CardTitle>
                            <CardDescription>
                               Los resultados del backtest para la fecha y liga seleccionada aparecerán aquí una vez que configures y ejecutes la simulación.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="text-center text-muted-foreground py-8">
                                {state.message && (
                                    <Alert variant={state.issues ? "destructive" : "default"}>
                                        <AlertTitle>{state.issues ? 'Error en la Simulación' : 'Notificación'}</AlertTitle>
                                        <AlertDescription>
                                            {state.message}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                 )}
            </div>
            <div className="grid auto-rows-max items-start gap-8 lg:col-span-1">
                <form action={formAction}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurar Simulación</CardTitle>
                            <CardDescription>
                                Elige una fecha histórica y un deporte para realizar un backtest de tu estrategia.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <Alert>
                                    <Bot className="h-4 w-4" />
                                    <AlertTitle>Acceso a Datos Históricos</AlertTitle>
                                    <AlertDescription>
                                        Esta herramienta utiliza datos históricos de cuotas de Sportradar.
                                        <a href="https://developer.sportradar.com/docs/read/getting-started" target="_blank" rel="noopener noreferrer">
                                            <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                                                Ver Documentación <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </a>
                                    </AlertDescription>
                                </Alert>
                                <div>
                                    <label htmlFor="sport" className="text-sm font-medium">Deporte</label>
                                     <Select name="sport" defaultValue="sr:sport:1" required>
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
                                            disabled={(day) => day > new Date() || day < new Date("2020-01-01")}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    {state.fields?.date && <p className="text-red-500 text-sm mt-1">{state.fields.date}</p>}
                                </div>
                                <SubmitButton />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
