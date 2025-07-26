
'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const stakingStrategies = [
    { value: 'fixed', label: 'Apuesta Fija', description: 'Apostas un monto fijo. Ideal para principiantes por su simplicidad y control.' },
    { value: 'percentage', label: 'Porcentual', description: 'Apostas un porcentaje fijo de tu capital total. El monto se ajusta con tu bankroll.' },
    { value: 'quarter_kelly', label: 'Cuarto de Kelly', description: 'Una versión conservadora del Criterio de Kelly. Busca crecimiento a largo plazo con menor riesgo.' }
];

export function RiskManagementCard() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>4. Gestión de Riesgo y Ejecución</CardTitle>
                <CardDescription>Calcula el tamaño de tu apuesta y añádela a tu cupón de apuestas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bankroll">Capital Total (Bankroll)</Label>
                        <Input id="bankroll" type="number" placeholder="Ej: 10000" />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="staking-strategy">Estrategia de Staking</Label>
                         <Select defaultValue="quarter_kelly">
                            <SelectTrigger id="staking-strategy">
                                <SelectValue placeholder="Selecciona una estrategia..." />
                            </SelectTrigger>
                            <SelectContent>
                                {stakingStrategies.map(strategy => (
                                    <SelectItem key={strategy.value} value={strategy.value}>
                                        <div className="flex items-center gap-2">
                                            <span>{strategy.label}</span>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                         <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{strategy.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                 </div>

                 <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Importe de Apuesta Sugerido</p>
                    <p className="text-4xl font-bold text-primary">€25.50</p>
                 </div>

                 <Button type="button" size="lg" className="w-full">
                    <ShoppingCart className="mr-2" />
                    Añadir a Cupón de Apuestas
                 </Button>

            </CardContent>
        </Card>
    )
}
