
'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SoccerBallIcon } from './icons/soccer-ball';
import { TennisBallIcon } from './icons/tennis-ball';


export function AnalysisSetupCard() {
    const [sport, setSport] = React.useState('football');

    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Configuración del Análisis</CardTitle>
                <CardDescription>Define el partido y las cuotas de mercado que deseas analizar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Deporte</Label>
                    <div className="flex gap-4">
                        <button 
                            type="button" 
                            onClick={() => setSport('football')}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                                sport === 'football' ? "border-primary bg-primary/5 text-primary" : "border-muted bg-transparent hover:bg-muted/50"
                            )}>
                            <SoccerBallIcon className="w-8 h-8"/>
                            <span className="font-semibold">Fútbol</span>
                        </button>
                         <button 
                            type="button" 
                            onClick={() => setSport('tennis')}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                                sport === 'tennis' ? "border-primary bg-primary/5 text-primary" : "border-muted bg-transparent hover:bg-muted/50"
                            )}>
                            <TennisBallIcon className="w-8 h-8" />
                            <span className="font-semibold">Tenis</span>
                        </button>
                    </div>
                </div>

                {sport === 'football' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="home-team">Equipo Local</Label>
                            <Input id="home-team" placeholder="Ej: Real Madrid" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="away-team">Equipo Visitante</Label>
                            <Input id="away-team" placeholder="Ej: FC Barcelona" />
                        </div>
                    </div>
                )}
                
                {sport === 'tennis' && (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="player-1">Jugador 1</Label>
                            <Input id="player-1" placeholder="Ej: Carlos Alcaraz" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="player-2">Jugador 2</Label>
                            <Input id="player-2" placeholder="Ej: Jannik Sinner" />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="data-url">Opcional: Pegar URL de datos (ej. FBref.com)</Label>
                    <Input id="data-url" placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <Label>Cuotas de Mercado</Label>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Input id="odds-1" placeholder="Local / 1" type="number" step="0.01" />
                        </div>
                        <div>
                            <Input id="odds-x" placeholder="Empate / X" type="number" step="0.01" disabled={sport === 'tennis'} />
                        </div>
                        <div>
                            <Input id="odds-2" placeholder="Visitante / 2" type="number" step="0.01" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
