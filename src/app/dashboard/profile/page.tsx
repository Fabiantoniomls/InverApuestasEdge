
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LineChart, BarChart, Calendar as CalendarIcon, ArrowDown, ArrowUp, Trophy, HelpCircle, TrendingUp, TrendingDown, Repeat } from "lucide-react"
import { Line, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

const kpiData = {
    totalPL: "+€1,280.50",
    yield: "+7.8%",
    roi: "+9.2%",
    hitRate: "62%",
    totalBets: 158,
    avgStake: "€25.50",
    avgWinningOdds: "2.15",
    avgLosingOdds: "2.80",
};

const trendData = [
    { name: 'Jan', pl: 100 }, { name: 'Feb', pl: 150 }, { name: 'Mar', pl: 120 },
    { name: 'Apr', pl: 250 }, { name: 'May', pl: 400 }, { name: 'Jun', pl: 350 },
    { name: 'Jul', pl: 500 }, { name: 'Aug', pl: 650 }, { name: 'Sep', pl: 800 },
    { name: 'Oct', pl: 750 }, { name: 'Nov', pl: 950 }, { name: 'Dec', pl: 1280.50 },
];

const drawdownData = [
    { name: 'Jan', drawdown: 0 }, { name: 'Feb', drawdown: 0 }, { name: 'Mar', drawdown: -5 },
    { name: 'Apr', drawdown: 0 }, { name: 'May', drawdown: 0 }, { name: 'Jun', drawdown: -8 },
    { name: 'Jul', drawdown: 0 }, { name: 'Aug', drawdown: 0 }, { name: 'Sep', drawdown: 0 },
    { name: 'Oct', drawdown: -12 }, { name: 'Nov', drawdown: 0 }, { name: 'Dec', drawdown: 0 },
];

const segmentData = [
    { category: 'Football', totalBets: 102, hitRate: '65%', avgOdds: '2.05', totalStaked: '€2601', netPL: '+€950.30', yield: '+36.5%', roi: '+36.5%' },
    { category: 'Tennis', totalBets: 41, hitRate: '58%', avgOdds: '1.90', totalStaked: '€1045.5', netPL: '+€250.20', yield: '+23.9%', roi: '+23.9%' },
    { category: 'Basketball', totalBets: 15, hitRate: '40%', avgOdds: '2.50', totalStaked: '€382.5', netPL: '+€80.00', yield: '+20.9%', roi: '+20.9%' },
];

const KpiCard = ({ title, value, tooltip, icon: Icon }: { title: string, value: string, tooltip: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function ProfilePage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Mi Perfil de Rendimiento</h1>
                <p className="mt-1 text-muted-foreground">Tu centro de mando analítico para entender y mejorar tu estrategia de inversión.</p>
            </header>

            {/* Global Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <Select defaultValue="30d">
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Rango de Fechas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30d">Últimos 30 días</SelectItem>
                        <SelectItem value="90d">Últimos 90 días</SelectItem>
                        <SelectItem value="ytd">Año hasta la fecha</SelectItem>
                        <SelectItem value="all">Desde el inicio</SelectItem>
                    </SelectContent>
                </Select>
                 <Select defaultValue="decimal">
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Formato de Cuotas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="decimal">Decimal</SelectItem>
                        <SelectItem value="fractional">Fraccional</SelectItem>
                        <SelectItem value="american">Americano</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Banner */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Beneficio/Pérdida Total" value={kpiData.totalPL} tooltip="Ganancia o pérdida neta total." icon={TrendingUp} />
                <KpiCard title="Yield" value={kpiData.yield} tooltip="(Beneficio Neto / Cantidad Total Apostada) * 100. Mide la eficiencia de tu estrategia. >5% es bueno." icon={TrendingUp} />
                <KpiCard title="Tasa de Acierto" value={kpiData.hitRate} tooltip="(Apuestas Ganadas / Total de Apuestas) * 100." icon={Trophy} />
                <KpiCard title="Total de Apuestas" value={String(kpiData.totalBets)} tooltip="Número total de apuestas resueltas." icon={Repeat} />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Tendencia de Beneficio (P/L Acumulado)</CardTitle>
                        <CardDescription>Evolución de tu bankroll a lo largo del tiempo.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="pl" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Análisis de Riesgo (Drawdown)</CardTitle>
                        <CardDescription>Caídas desde picos de beneficio. El MDD fue del 12%.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={drawdownData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="drawdown" fill="hsl(var(--destructive))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Segment Analysis Table */}
             <Card>
                <CardHeader>
                    <CardTitle>Análisis por Segmentos</CardTitle>
                    <CardDescription>Desglosa tu rendimiento por categoría para encontrar tus fortalezas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Apuestas</TableHead>
                                <TableHead>Tasa Acierto</TableHead>
                                <TableHead>P/L Neto</TableHead>
                                <TableHead>Yield</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {segmentData.map((row) => (
                                <TableRow key={row.category}>
                                    <TableCell className="font-medium">{row.category}</TableCell>
                                    <TableCell>{row.totalBets}</TableCell>
                                    <TableCell>{row.hitRate}</TableCell>
                                    <TableCell className="font-semibold text-green-600">{row.netPL}</TableCell>
                                    <TableCell className="font-semibold text-green-600">{row.yield}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Highlights Module */}
            <div>
                 <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Datos Destacados</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="bg-green-500/10 border-green-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700"><Trophy /> Salón de la Fama</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <p><strong>Equipo Más Rentable:</strong> Real Madrid (+€450)</p>
                            <p><strong>Mejor Apuesta:</strong> Gana Liverpool vs Chelsea (+€150)</p>
                            <p><strong>Racha de Victorias:</strong> 8 apuestas</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-500/10 border-red-500/20">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-red-700"><TrendingDown /> Panel de Aprendizaje</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <p><strong>Tu Kryptonita:</strong> FC Barcelona (-€210)</p>
                            <p><strong>Mayor Pérdida:</strong> Empate en Clásico (-€100)</p>
                             <p><strong>Racha de Pérdidas:</strong> 4 apuestas</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700"><Repeat /> Lealtad vs. Beneficio</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <p><strong>Equipo Más Apostado:</strong> FC Barcelona (25 apuestas)</p>
                            <p><strong>Equipo Más Rentable:</strong> Real Madrid (+€450)</p>
                            <p className="!mt-2 text-xs text-blue-600">Analiza si tu lealtad a un equipo está afectando a tu rentabilidad.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

