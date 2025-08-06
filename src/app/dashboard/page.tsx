
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp, Banknote, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UpcomingMatches } from "./upcoming-matches";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';

const roiData = [
  { value: 12.1 }, { value: 12.5 }, { value: 11.9 }, { value: 13.5 },
  { value: 14.8 }, { value: 15.1 }, { value: 15.7 },
];

const profitData = [
    { name: 'Jan', profit: 1800 }, { name: 'Feb', profit: 1950 }, { name: 'Mar', profit: 1900 },
    { name: 'Apr', profit: 2100 }, { name: 'May', profit: 2200 }, { name: 'Jun', profit: 2250 },
    { name: 'Jul', profit: 2345 },
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
                    <Line type="monotone" dataKey="profit" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
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
    { match: "Real Madrid vs FC Barcelona", selection: "Gana Real Madrid @ 2.10", pnl: "+€55.00", status: "Ganada" },
    { match: "C. Alcaraz vs J. Sinner", selection: "Más de 22.5 juegos @ 1.85", pnl: "-€50.00", status: "Perdida" },
    { match: "Liverpool vs Man City", selection: "Ambos marcan @ 1.66", pnl: "+€33.00", status: "Ganada" },
    { match: "Boston Celtics vs LA Lakers", selection: "Celtics -5.5 @ 1.91", pnl: "N/A", status: "Pendiente" },
];

const valueOpportunities = [
    { match: "Sevilla vs Real Betis", market: "Empate", odds: "3.50", probability: "35.2%", ev: "+5.6%" },
    { match: "A. Zverev vs D. Medvedev", market: "Gana Zverev", odds: "2.50", probability: "48.5%", ev: "+8.5%" },
    { match: "Inter Milan vs Juventus", market: "Más de 2.5 goles", odds: "1.95", probability: "55.8%", ev: "+4.3%" },
];


export default function DashboardPage() {
    
    const getStatusVariant = (status: string): "default" | "destructive" | "secondary" => {
        switch (status) {
            case "Ganada": return "default";
            case "Perdida": return "destructive";
            case "Pendiente": return "secondary";
            default: return "secondary";
        }
    };
    
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
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={profitData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `€${value}`} />
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--background))', 
                                        borderColor: 'hsl(var(--border))' 
                                    }} 
                                />
                                <Area type="monotone" dataKey="profit" stroke="hsl(var(--success))" fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="xl:col-span-2 p-6">
                    <h3 className="text-xl font-semibold mb-4">Mis Apuestas Recientes</h3>
                    <div className="space-y-1">
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Selección</TableHead>
                                    <TableHead className="text-center">Resultado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                 {recentBets.map((bet, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <p className="font-semibold">{bet.match}</p>
                                            <p className="text-sm text-muted-foreground">{bet.selection}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusVariant(bet.status)} className={bet.status === 'Ganada' ? 'bg-success/20 text-success' : ''}>
                                                {bet.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                 ))}
                            </TableBody>
                        </Table>
                         <div className="flex justify-end pt-2">
                            <Link href="/dashboard/ledger" className="text-sm text-primary hover:underline">
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
