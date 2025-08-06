
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp, Banknote, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UpcomingMatches } from "./upcoming-matches";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const roiData = [
  { value: 12.1 }, { value: 12.5 }, { value: 11.9 }, { value: 13.5 },
  { value: 14.8 }, { value: 15.1 }, { value: 15.7 },
];

const profitData = [
  { value: 1800 }, { value: 1950 }, { value: 1900 }, { value: 2100 },
  { value: 2200 }, { value: 2250 }, { value: 2345 },
];

const valueBetsData = [
  { day: 'L', count: 2 }, { day: 'M', count: 5 }, { day: 'X', count: 3 },
  { day: 'J', count: 6 }, { day: 'V', count: 4 }, { day: 'S', count: 8 },
  { day: 'D', count: 1 },
];


const kpiCards = [
    {
        title: "ROI Total",
        value: "+15.7%",
        period: "Últimos 30 días",
        icon: TrendingUp,
        color: "text-success",
        bgColor: "bg-green-500/10",
        chart: (
             <ResponsiveContainer width="100%" height={40}>
                <LineChart data={roiData}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )
    },
    {
        title: "Beneficio Neto",
        value: "€2,345.67",
        period: "Total histórico",
        icon: Banknote,
        color: "text-success",
        bgColor: "bg-green-500/10",
        chart: (
             <ResponsiveContainer width="100%" height={40}>
                <LineChart data={profitData}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )
    },
    {
        title: "Apuestas con Valor",
        value: "8",
        period: "Disponibles esta semana",
        icon: Star,
        color: "text-primary",
        bgColor: "bg-blue-500/10",
        chart: (
            <ResponsiveContainer width="100%" height={40}>
                <BarChart data={valueBetsData}>
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
            </ResponsiveContainer>
        )
    }
];

const recentBets = [
    { match: "Real Madrid vs FC Barcelona", selection: "Gana Real Madrid @ 2.10", pnl: "+€55.00", status: "text-success" },
    { match: "C. Alcaraz vs J. Sinner", selection: "Más de 22.5 juegos @ 1.85", pnl: "-€50.00", status: "text-destructive" },
    { match: "Liverpool vs Man City", selection: "Ambos marcan @ 1.66", pnl: "+€33.00", status: "text-success" },
    { match: "Boston Celtics vs LA Lakers", selection: "Celtics -5.5 @ 1.91", pnl: "Pendiente", status: "text-muted-foreground" },
];

const valueOpportunities = [
    { match: "Sevilla vs Real Betis", market: "Empate", odds: "3.50", probability: "35.2%", ev: "+5.6%" },
    { match: "A. Zverev vs D. Medvedev", market: "Gana Zverev", odds: "2.50", probability: "48.5%", ev: "+8.5%" },
    { match: "Inter Milan vs Juventus", market: "Más de 2.5 goles", odds: "1.95", probability: "55.8%", ev: "+4.3%" },
];


export default function DashboardPage() {
    return (
        <div className="space-y-12">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Bienvenido de nuevo, John. Aquí tienes un resumen de tu actividad.</p>
                </div>
                 <Link href="/dashboard/analyze">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg px-5 py-2.5 text-base">
                        <Plus className="mr-2 h-5 w-5" />
                        Nuevo Análisis
                    </Button>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {kpiCards.map(card => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title} className="p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">{card.title}</p>
                                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                                    <p className="text-sm text-muted-foreground">{card.period}</p>
                                </div>
                                <div className={`p-3 rounded-full ${card.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${card.color}`} />
                                </div>
                            </div>
                            <div className="mt-4">
                                {card.chart}
                            </div>
                        </Card>
                    )
                })}
            </div>
            
            <UpcomingMatches />

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <Card className="xl:col-span-3 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Rendimiento Histórico</h3>
                        <div className="flex space-x-2">
                             <Button variant="ghost" className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-accent/50">1M</Button>
                             <Button variant="ghost" className="text-xs text-foreground px-2 py-1 rounded bg-primary">6M</Button>
                             <Button variant="ghost" className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-accent/50">1A</Button>
                             <Button variant="ghost" className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-accent/50">Todo</Button>
                        </div>
                    </div>
                    <div className="h-64 bg-background/50 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Gráfico de Rendimiento</p>
                    </div>
                </Card>

                <Card className="xl:col-span-2 p-6">
                    <h3 className="text-xl font-semibold mb-4">Mis Apuestas Recientes</h3>
                    <div className="space-y-4">
                         {recentBets.map((bet, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{bet.match}</p>
                                    <p className="text-sm text-muted-foreground">{bet.selection}</p>
                                </div>
                                <span className={`font-semibold ${bet.status}`}>{bet.pnl}</span>
                            </div>
                         ))}
                         <div className="flex justify-end">
                            <Link href="/dashboard/ledger" className="text-sm text-primary hover:underline mt-2">
                                Ver todas
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Oportunidades de Valor Destacadas</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border">
                                <TableHead className="text-sm font-semibold text-muted-foreground">Partido</TableHead>
                                <TableHead className="text-sm font-semibold text-muted-foreground">Mercado</TableHead>
                                <TableHead className="text-sm font-semibold text-muted-foreground">Cuota</TableHead>
                                <TableHead className="text-sm font-semibold text-muted-foreground">Prob. Calculada</TableHead>
                                <TableHead className="text-sm font-semibold text-muted-foreground">Valor (+EV)</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {valueOpportunities.map((opp, index) => (
                                <TableRow key={index} className="border-b border-border hover:bg-muted/50">
                                    <TableCell>{opp.match}</TableCell>
                                    <TableCell>{opp.market}</TableCell>
                                    <TableCell>{opp.odds}</TableCell>
                                    <TableCell>{opp.probability}</TableCell>
                                    <TableCell className="font-bold text-success">{opp.ev}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="link" asChild className="p-0 h-auto">
                                            <Link href="/dashboard/analyze">Analizar</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
