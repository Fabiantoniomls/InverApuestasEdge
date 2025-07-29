
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Plus, Edit, Eye, Trash2, Library, CheckCircle2, TrendingUp, AlertCircle, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UpcomingMatches } from "./upcoming-matches";

const savedAnalyses = [
    {
        id: 1,
        title: "Real Madrid vs. FC Barcelona",
        date: "Análisis del 15 de mayo de 2024",
        tags: [
            { name: "Fútbol", color: "blue" },
            { name: "Apuesta Segura", color: "green" },
        ],
        homeTeamLogoUrl: "https://placehold.co/40x40.png",
        awayTeamLogoUrl: "https://placehold.co/40x40.png",
        homeHint: "real madrid logo",
        awayHint: "barcelona logo",
        analysisData: { ev: 12.5, odds: 2.10, stake: 3, probability: 51 },
        matchResult: "3-1",
        profitAndLoss: 33.00,
        betOutcome: "WON",
        isBetPlaced: true,
    },
    {
        id: 2,
        title: "Manchester United vs. Liverpool",
        date: "Análisis del 20 de mayo de 2024",
        tags: [
            { name: "Fútbol", color: "blue" },
            { name: "Riesgo Medio", color: "orange" },
        ],
        homeTeamLogoUrl: "https://placehold.co/40x40.png",
        awayTeamLogoUrl: "https://placehold.co/40x40.png",
        homeHint: "manchester united logo",
        awayHint: "liverpool logo",
        analysisData: { ev: 25.0, odds: 3.50, stake: 1.5, probability: 35 },
        matchResult: "2-2",
        profitAndLoss: -25.00,
        betOutcome: "LOST",
        isBetPlaced: true,
    },
    {
        id: 3,
        title: "Bayern Munich vs. Borussia Dortmund",
        date: "Análisis del 25 de mayo de 2024",
        tags: [
            { name: "Fútbol", color: "blue" },
            { name: "Riesgo Alto", color: "red" },
        ],
        homeTeamLogoUrl: "https://placehold.co/40x40.png",
        awayTeamLogoUrl: "https://placehold.co/40x40.png",
        homeHint: "bayern munich logo",
        awayHint: "dortmund logo",
        analysisData: { ev: 8.2, odds: 1.90, stake: 4, probability: 57 },
        matchResult: "N/A",
        profitAndLoss: 0,
        betOutcome: "PENDING",
        isBetPlaced: false,
    },
    {
        id: 4,
        title: "Alcaraz vs. Sinner - Roland Garros",
        date: "Análisis del 28 de mayo de 2024",
        tags: [
            { name: "Tenis", color: "purple" },
            { name: "Apuesta Segura", color: "green" },
        ],
        homeTeamLogoUrl: "https://placehold.co/40x40.png",
        awayTeamLogoUrl: "https://placehold.co/40x40.png",
        homeHint: "alcaraz photo",
        awayHint: "sinner photo",
        analysisData: { ev: 5.0, odds: 1.50, stake: 5, probability: 70 },
        matchResult: "3-0",
        profitAndLoss: 55.30,
        betOutcome: "WON",
        isBetPlaced: true,
    },
];

const tagColors: { [key: string]: { base: string, outcome?: string } } = {
    blue: { base: "bg-blue-100 text-blue-800" },
    green: { base: "bg-green-100 text-green-800", outcome: "bg-green-100 text-green-800" },
    orange: { base: "bg-orange-100 text-orange-800", outcome: "bg-red-100 text-red-800" },
    red: { base: "bg-red-100 text-red-800", outcome: "bg-red-100 text-red-800" },
    purple: { base: "bg-purple-100 text-purple-800" },
};

const MetricCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card className="p-4">
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
        </div>
    </Card>
);

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <header>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-foreground text-3xl font-bold leading-tight tracking-tight">Mis análisis</h1>
                        <p className="text-muted-foreground mt-1">Tu bitácora de rendimiento analítico.</p>
                    </div>
                    <Link href="/dashboard/analyze">
                        <Button className="font-bold">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Análisis
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Análisis Totales" value="58" icon={Library} />
                <MetricCard title="Tasa de Acierto" value="62%" icon={CheckCircle2} />
                <MetricCard title="P/L Total" value="+ $1,280.50" icon={TrendingUp} />
                <MetricCard title="ROI Promedio" value="+8.5%" icon={AlertCircle} />
            </div>
            
            <UpcomingMatches />

            <div>
                 <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                     <h2 className="text-2xl font-bold tracking-tight text-foreground">Historial de Análisis</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative w-full sm:w-auto">
                            <Input className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-full text-sm" placeholder="Buscar por equipo, fecha..." type="text"/>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                         <Select>
                            <SelectTrigger className="w-full sm:w-[180px] border rounded-full text-sm">
                                <SelectValue placeholder="Filtrar por etiqueta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="futbol">Fútbol</SelectItem>
                                <SelectItem value="tenis">Tenis</SelectItem>
                                <SelectItem value="riesgo-alto">Riesgo alto</SelectItem>
                                <SelectItem value="apuesta-segura">Apuesta segura</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select>
                            <SelectTrigger className="w-full sm:w-[180px] border rounded-full text-sm">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date_desc">Fecha (reciente)</SelectItem>
                                <SelectItem value="date_asc">Fecha (antiguo)</SelectItem>
                                <SelectItem value="ev_desc">Mayor Valor Esperado (EV)</SelectItem>
                                <SelectItem value="roi_desc">Mayor ROI (%)</SelectItem>
                                <SelectItem value="pnl_win_desc">Mayor Ganancia (€)</SelectItem>
                                <SelectItem value="pnl_loss_desc">Mayor Pérdida (€)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    {savedAnalyses.map((analysis) => {
                        const pnlColor = analysis.profitAndLoss > 0 ? "text-green-600" : analysis.profitAndLoss < 0 ? "text-red-600" : "text-muted-foreground";

                        return (
                            <div key={analysis.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
                                <div className="flex items-start gap-4">
                                    <div className="flex -space-x-4">
                                        <Image src={analysis.homeTeamLogoUrl} alt="Home team logo" data-ai-hint={analysis.homeHint} className="rounded-full object-cover border-2 border-white" width={40} height={40} />
                                        <Image src={analysis.awayTeamLogoUrl} alt="Away team logo" data-ai-hint={analysis.awayHint} className="rounded-full object-cover border-2 border-white" width={40} height={40} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-foreground text-lg font-semibold leading-normal">{analysis.title}</h3>
                                                <p className="text-muted-foreground text-sm">{analysis.date}</p>
                                            </div>
                                            {analysis.isBetPlaced && (
                                                <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full font-medium">
                                                    <BadgeCheck className="size-3" />
                                                    <span>Apuesta Realizada</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-y my-3 py-2 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                            <div className="font-medium"><span className="text-muted-foreground">EV: </span>{analysis.analysisData.ev.toFixed(1)}%</div>
                                            <div className="font-medium"><span className="text-muted-foreground">Cuota: </span>{analysis.analysisData.odds.toFixed(2)}</div>
                                            <div className="font-medium"><span className="text-muted-foreground">Stake: </span>{analysis.analysisData.stake.toFixed(1)}%</div>
                                            <div className="font-medium"><span className="text-muted-foreground">Prob: </span>{analysis.analysisData.probability}%</div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {analysis.tags.map(tag => {
                                                    const colorClass = tagColors[tag.color]?.base || 'bg-gray-100 text-gray-800';
                                                    const outcomeColorClass = (analysis.betOutcome === 'WON' && tagColors[tag.color]?.outcome) || colorClass;
                                                    const finalClass = analysis.isBetPlaced && analysis.betOutcome !== 'PENDING' ? outcomeColorClass : colorClass;
                                                    return (
                                                        <span key={tag.name} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${finalClass}`}>
                                                            {tag.name}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                            {analysis.isBetPlaced && (
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Resultado: {analysis.matchResult}</p>
                                                    <p className={`text-sm font-bold ${pnlColor}`}>P/L: {analysis.profitAndLoss >= 0 ? '+' : ''}${analysis.profitAndLoss.toFixed(2)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Link href={`/dashboard/analysis/${analysis.id}`}>
                                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-red-100 text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
