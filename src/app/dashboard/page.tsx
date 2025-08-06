
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp, Banknote, Star } from "lucide-react";
import Link from "next/link";

const kpiCards = [
    {
        title: "ROI Total",
        value: "+15.7%",
        period: "Últimos 30 días",
        icon: TrendingUp,
        color: "text-green-400",
        bgColor: "bg-green-500/10"
    },
    {
        title: "Beneficio Neto",
        value: "$2,345.67",
        period: "Total histórico",
        icon: Banknote,
        color: "text-green-400",
        bgColor: "bg-green-500/10"
    },
    {
        title: "Apuestas con Valor",
        value: "8",
        period: "Disponibles esta semana",
        icon: Star,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10"
    }
];

const recentBets = [
    { match: "Real Madrid vs FC Barcelona", selection: "Gana Real Madrid @ 2.10", pnl: "+$55.00", status: "positive" },
    { match: "C. Alcaraz vs J. Sinner", selection: "Más de 22.5 juegos @ 1.85", pnl: "-$50.00", status: "negative" },
    { match: "Liverpool vs Man City", selection: "Ambos marcan @ 1.66", pnl: "+$33.00", status: "positive" },
    { match: "Boston Celtics vs LA Lakers", selection: "Celtics -5.5 @ 1.91", pnl: "Pendiente", status: "text-gray-400" },
];

const valueOpportunities = [
    { match: "Sevilla vs Real Betis", market: "Empate", odds: "3.50", probability: "35.2%", ev: "+5.6%" },
    { match: "A. Zverev vs D. Medvedev", market: "Gana Zverev", odds: "2.50", probability: "48.5%", ev: "+8.5%" },
    { match: "Inter Milan vs Juventus", market: "Más de 2.5 goles", odds: "1.95", probability: "55.8%", ev: "+4.3%" },
];


export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400">Bienvenido de nuevo, John. Aquí tienes un resumen de tu actividad.</p>
                </div>
                 <Link href="/dashboard/analyze">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-5 py-2.5">
                        <Plus className="mr-2 h-5 w-5" />
                        Nuevo Análisis
                    </Button>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {kpiCards.map(card => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title} className="p-6 flex items-center justify-between bg-[#1E1E1E] border border-gray-700/50">
                            <div>
                                <p className="text-gray-400 text-sm">{card.title}</p>
                                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                                <p className="text-sm text-gray-500">{card.period}</p>
                            </div>
                            <div className={`p-3 rounded-full ${card.bgColor}`}>
                                <Icon className={`h-8 w-8 ${card.color}`} />
                            </div>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <Card className="xl:col-span-3 p-6 bg-[#1E1E1E] border border-gray-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Rendimiento Histórico</h3>
                        <div className="flex space-x-2">
                             <Button variant="ghost" className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-700/50">1M</Button>
                             <Button variant="ghost" className="text-xs text-white px-2 py-1 rounded bg-blue-500">6M</Button>
                             <Button variant="ghost" className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-700/50">1A</Button>
                             <Button variant="ghost" className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-700/50">Todo</Button>
                        </div>
                    </div>
                    <div className="h-64 bg-[#2C2C2C] rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Gráfico de Rendimiento</p>
                    </div>
                </Card>

                <Card className="xl:col-span-2 p-6 bg-[#1E1E1E] border border-gray-700/50">
                    <h3 className="text-xl font-semibold mb-4">Mis Apuestas Recientes</h3>
                    <div className="space-y-4">
                         {recentBets.map((bet, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{bet.match}</p>
                                    <p className="text-sm text-gray-400">{bet.selection}</p>
                                </div>
                                <span className={`font-semibold ${bet.status}`}>{bet.pnl}</span>
                            </div>
                         ))}
                         <div className="flex justify-end">
                            <Link href="/dashboard/ledger" className="text-sm text-blue-400 hover:underline mt-2">
                                Ver todas
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6 mt-8 bg-[#1E1E1E] border border-gray-700/50">
                <h3 className="text-xl font-semibold mb-4">Oportunidades de Valor Destacadas</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-700">
                                <TableHead className="text-sm font-semibold text-gray-400">Partido</TableHead>
                                <TableHead className="text-sm font-semibold text-gray-400">Mercado</TableHead>
                                <TableHead className="text-sm font-semibold text-gray-400">Cuota</TableHead>
                                <TableHead className="text-sm font-semibold text-gray-400">Prob. Calculada</TableHead>
                                <TableHead className="text-sm font-semibold text-gray-400">Valor (+EV)</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {valueOpportunities.map((opp, index) => (
                                <TableRow key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                                    <TableCell>{opp.match}</TableCell>
                                    <TableCell>{opp.market}</TableCell>
                                    <TableCell>{opp.odds}</TableCell>
                                    <TableCell>{opp.probability}</TableCell>
                                    <TableCell className="font-bold text-green-400">{opp.ev}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">Analizar</Button>
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
