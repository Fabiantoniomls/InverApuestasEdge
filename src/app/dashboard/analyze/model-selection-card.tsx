
'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const models = [
    {
        value: 'fundamental',
        label: 'Análisis Fundamental',
        description: 'Evalúa factores cualitativos como la forma, lesiones y moral del equipo.'
    },
    {
        value: 'poisson-xg',
        label: 'Modelo Híbrido Poisson-xG',
        description: 'Predice resultados basándose en la calidad de las oportunidades de gol (xG), no solo en los goles marcados.'
    },
    {
        value: 'elo',
        label: 'Modelo Elo por Superficie',
        description: 'Calcula la habilidad relativa de los jugadores o equipos, ajustada por el tipo de superficie (Tenis).'
    }
];

export function ModelSelectionCard() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>2. Selección del Modelo</CardTitle>
                <CardDescription>Elige el motor analítico que deseas utilizar para evaluar el partido.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="model-select">Modelo Predictivo</Label>
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cada modelo ofrece una perspectiva diferente. <br/> Elige el que mejor se adapte a tu estrategia.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Select defaultValue="poisson-xg">
                        <SelectTrigger id="model-select">
                            <SelectValue placeholder="Selecciona un modelo..." />
                        </SelectTrigger>
                        <SelectContent>
                             {models.map(model => (
                                <SelectItem key={model.value} value={model.value}>
                                    <div className="flex items-center gap-2">
                                        <span>{model.label}</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent side="right" align="start">
                                                    <p>{model.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
            </CardContent>
        </Card>
    )
}
