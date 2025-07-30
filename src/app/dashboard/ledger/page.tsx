
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, SortAsc, ArrowDownUp, FileDown, Plus } from 'lucide-react';
import { AddBetDialog } from './_components/add-bet-dialog';


const allBets = [
    { id: 1, sport: "Fútbol", match: "Man City vs Arsenal", selection: "Man City", odds: 1.85, stake: 50, status: "Ganada", pnl: 42.50, timestamp: "2024-05-18T14:00:00Z" },
    { id: 2, sport: "Tenis", match: "Nadal vs Djokovic", selection: "Djokovic", odds: 2.10, stake: 100, status: "Perdida", pnl: -100.00, timestamp: "2024-05-17T12:30:00Z" },
    { id: 3, sport: "Fútbol", match: "Bayern Munich vs Dortmund", selection: "Empate", odds: 3.50, stake: 25, status: "Perdida", pnl: -25.00, timestamp: "2024-05-16T18:45:00Z" },
    { id: 4, sport: "Fútbol", match: "Liverpool vs Chelsea", selection: "Liverpool", odds: 2.00, stake: 75, status: "Ganada", pnl: 75.00, timestamp: "2024-05-15T19:00:00Z" },
    { id: 5, sport: "Tenis", match: "Alcaraz vs Sinner", selection: "Alcaraz", odds: 1.50, stake: 200, status: "Ganada", pnl: 100.00, timestamp: "2024-05-14T15:00:00Z" },
    { id: 6, sport: "Fútbol", match: "Inter vs Milan", selection: "Inter", odds: 2.25, stake: 50, status: "Ganada", pnl: 62.50, timestamp: "2024-05-12T20:00:00Z" },
    { id: 7, sport: "Fútbol", match: "Barcelona vs Real Madrid", selection: "Real Madrid", odds: 2.75, stake: 40, status: "Perdida", pnl: -40.00, timestamp: "2024-05-11T21:00:00Z" },
    { id: 8, sport: "Baloncesto", match: "Lakers vs Celtics", selection: "Lakers +5.5", odds: 1.91, stake: 30, status: "Pendiente", pnl: 0.00, timestamp: "2024-05-20T02:30:00Z" },
];


const BetRow = ({ bet }: { bet: typeof allBets[0] }) => {
    const [formattedDate, setFormattedDate] = React.useState('');

    React.useEffect(() => {
        // This effect runs only on the client, ensuring no hydration mismatch.
        setFormattedDate(format(parseISO(bet.timestamp), "dd MMM yyyy, HH:mm", { locale: es }) + 'h');
    }, [bet.timestamp]);

    return (
        <TableRow>
            <TableCell className="text-sm text-muted-foreground">
                {formattedDate}
            </TableCell>
            <TableCell className="font-medium text-foreground">{bet.match}</TableCell>
            <TableCell className="text-muted-foreground">{bet.selection}</TableCell>
            <TableCell className="text-right text-muted-foreground">{bet.odds.toFixed(2)}</TableCell>
            <TableCell className="text-right text-muted-foreground">{bet.stake.toFixed(2)}</TableCell>
            <TableCell className="text-center">
                <Badge
                    variant={
                        bet.status === 'Ganada' ? 'default' :
                            bet.status === 'Perdida' ? 'destructive' : 'secondary'
                    }
                    className={
                        bet.status === 'Ganada' ? 'bg-green-100 text-green-800' :
                            bet.status === 'Perdida' ? 'bg-red-100 text-red-800' : ''
                    }
                >
                    {bet.status}
                </Badge>
            </TableCell>
            <TableCell className={`text-right font-semibold ${bet.pnl > 0 ? 'text-green-600' : bet.pnl < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {bet.pnl > 0 ? '+' : ''}{bet.pnl.toFixed(2)}
            </TableCell>
        </TableRow>
    );
};


export default function LedgerPage() {
    return (
        <div className="space-y-8">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Apuestas</h1>
                    <p className="mt-1 text-muted-foreground">Un registro completo de todas tus apuestas realizadas.</p>
                </div>
                <AddBetDialog>
                     <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Apuesta
                    </Button>
                </AddBetDialog>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Apuestas</CardTitle>
                    <CardDescription>Consulta el estado y rendimiento de cada una de tus inversiones.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="relative flex-1 w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Buscar por partido, selección..." className="pl-10 w-full" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="gap-1">
                                <FileDown className="h-4 w-4" />
                                <span>Exportar</span>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button variant="ghost" size="sm">
                                            Fecha <SortAsc className="w-4 h-4 inline-block ml-1" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Partido</TableHead>
                                    <TableHead>Selección</TableHead>
                                    <TableHead className="text-right">
                                         <Button variant="ghost" size="sm">
                                            Cuota <ArrowDownUp className="w-4 h-4 inline-block ml-1" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Importe (€) <ArrowDownUp className="w-4 h-4 inline-block ml-1" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-center">Estado</TableHead>
                                    <TableHead className="text-right">
                                        <Button variant="ghost" size="sm">
                                            P/L (€) <ArrowDownUp className="w-4 h-4 inline-block ml-1" />
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allBets.map((bet) => (
                                    <BetRow key={bet.id} bet={bet} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
