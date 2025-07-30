
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, ArrowDownUp, FileDown, Plus, Banknote, TrendingUp, TrendingDown, Percent, ArrowDown, MoreVertical } from 'lucide-react';
import { AddBetDialog } from './_components/add-bet-dialog';
import { SummaryCharts } from './_components/summary-charts';

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
        setFormattedDate(format(parseISO(bet.timestamp), "dd MMM yyyy, HH:mm'h'", { locale: es }));
    }, [bet.timestamp]);

    return (
        <TableRow>
            <TableCell className="text-sm text-muted-foreground">{formattedDate}</TableCell>
            <TableCell className="font-semibold text-foreground">{bet.match}</TableCell>
            <TableCell>{bet.selection}</TableCell>
            <TableCell>{bet.odds.toFixed(2)}</TableCell>
            <TableCell>{bet.stake.toFixed(2)}€</TableCell>
            <TableCell>
                <Badge
                    className={
                        bet.status === 'Ganada' ? 'bg-green-100 text-green-800' :
                        bet.status === 'Perdida' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }
                >
                    {bet.status}
                </Badge>
            </TableCell>
            <TableCell className={`font-semibold text-right ${bet.pnl > 0 ? 'text-green-600' : bet.pnl < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {bet.pnl > 0 ? '+' : ''}{bet.pnl.toFixed(2)}€
            </TableCell>
        </TableRow>
    );
};


const KpiCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string, icon: React.ElementType, colorClass: string }) => (
    <Card className="p-5">
        <div className="flex items-start">
            <div className={`p-3 rounded-full mr-4 ${colorClass.replace('text-', 'bg-').replace('600', '100')}`}>
                <Icon className={`h-6 w-6 ${colorClass}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
            </div>
        </div>
    </Card>
);

export default function LedgerPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Mis Apuestas</h1>
                <p className="text-gray-500 mt-1">Un registro completo de todas tus apuestas realizadas.</p>
            </header>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <KpiCard title="Total Apostado" value="540,00 €" icon={Banknote} colorClass="text-blue-600" />
                <KpiCard title="Ganancias Totales" value="280,00 €" icon={TrendingUp} colorClass="text-green-600" />
                <KpiCard title="Pérdidas Totales" value="-165,00 €" icon={TrendingDown} colorClass="text-red-600" />
                <KpiCard title="ROI (Retorno)" value="+21.30%" icon={Percent} colorClass="text-purple-600" />
            </div>
            
            <SummaryCharts />

            <Card className="p-6">
                 <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700">Historial de Apuestas</h2>
                        <p className="text-gray-500 mt-1">Consulta el estado y rendimiento de cada una de tus inversiones.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Buscar por partido, selección..." className="pl-10" />
                        </div>
                        <AddBetDialog>
                             <Button variant="default">
                                <Plus className="mr-2 h-4 w-4" />
                                Añadir
                            </Button>
                        </AddBetDialog>
                        <Button variant="outline">
                            <FileDown className="mr-2 h-4 w-4" /> Exportar
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Button variant="ghost" size="sm">Fecha <ArrowDown className="w-4 h-4 inline-block ml-1" /></Button>
                                </TableHead>
                                <TableHead>Partido</TableHead>
                                <TableHead>Selección</TableHead>
                                <TableHead>Cuota</TableHead>
                                <TableHead>Importe</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">
                                     <Button variant="ghost" size="sm">P/L (€) <ArrowDownUp className="w-4 h-4 inline-block ml-1" /></Button>
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
            </Card>
        </div>
    );
}
