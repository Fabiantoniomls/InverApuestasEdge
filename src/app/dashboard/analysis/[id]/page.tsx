
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit, Trash2, Share2, Copy, Image as ImageIcon, Save, Calendar, Clock, Facebook, Twitter, Linkedin, Bot } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ConfidenceGauge } from "../_components/confidence-gauge";

// Mock data - in a real app, you would fetch this based on the `id` param
const analysisData = {
    title: "Real Madrid vs. FC Barcelona",
    createdAt: "25 de Octubre, 2024 - 10:30 AM",
    updatedAt: "Hoy - 14:15 PM",
    recommendation: "Apostar por Real Madrid",
    confidence: 85,
    ev: 15.2,
    probabilities: {
        teamA: 55,
        teamB: 25,
        draw: 20,
    },
    textualAnalysis: "El modelo identifica un valor significativo en la victoria del Real Madrid. Esto se debe principalmente a que su rendimiento en Goles Esperados (xG) de **1.8** por partido supera ampliamente su promedio de goles anotados, lo que sugiere que el mercado está subestimando su potencial ofensivo. Aunque el FC Barcelona tiene un ataque potente, su xGA (Goles Esperados en Contra) de **1.4** indica una vulnerabilidad defensiva que el ataque del Madrid, en plena forma, puede y debe explotar. La cuota de 2.10 para la victoria local ofrece un margen de valor del **+15.2%**.",
    shareUrl: "https://betvaluator.edge/analysis/12345",
    personalNotes: "Actualización: Considerar la posible lesión de Vinicius Jr. podría afectar la ofensiva del Madrid. Revisar cuotas de apuestas en vivo.",
    stats: {
        teamA: { name: "Real Madrid", goalsFor: 12, goalsAgainst: 4, possession: "60%", winRate: "80%" },
        teamB: { name: "FC Barcelona", goalsFor: 8, goalsAgainst: 6, possession: "55%", winRate: "40%" },
    },
    matchDetails: {
        competition: "La Liga",
        date: "26 Oct 2024",
        time: "20:00",
    },
    inputData: {
        context: "El Real Madrid está en excelente forma, habiendo ganado sus últimos 5 partidos. El FC Barcelona ha sido inconsistente, con 2 victorias, 2 derrotas y 1 empate en sus últimos 5.",
        initialOdds: "Real Madrid: 45%, FC Barcelona: 30%, Empate: 25%",
        modelUsed: "Poisson-xG v2.1"
    },
    valueBets: [
        { market: "Gana Real Madrid", odds: 2.10, probability: 55, value: 15.5 },
        { market: "Empate", odds: 3.50, probability: 25, value: -12.5 },
        { market: "Gana FC Barcelona", odds: 3.80, probability: 20, value: -24.0 },
    ]
};

const SocialButton = ({ href, children, className }: { href: string, children: React.ReactNode, className: string }) => (
     <a href={href} className={`flex items-center justify-center w-8 h-8 rounded-full text-white hover:opacity-90 transition-opacity ${className}`}>
        {children}
    </a>
)

const WhatsAppIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.613-1.476l-6.261 1.688zm7.472-1.847c1.664.95 3.522 1.442 5.378 1.442 5.462 0 9.9-4.438 9.9-9.902 0-2.653-1.04-5.14-2.9-7.001-1.859-1.86-4.348-2.901-7.001-2.901-5.462 0-9.9 4.438-9.9 9.902 0 2.021.57 3.965 1.634 5.679l-1.08 3.946 3.996-1.082zM12 6.557c-3.006 0-5.454 2.448-5.454 5.454s2.448 5.454 5.454 5.454 5.454-2.448 5.454-5.454-2.448-5.454-5.454-5.454zm2.426 6.331c-.139.395-.837.747-1.112.792-.275.045-.472.045-.693-.045s-.96-.363-1.825-1.125c-.864-.762-1.438-1.707-1.662-2.002s-.225-.45.045-.693c.27-.243.51-.318.66-.45.15-.131.2-.225.3-.363.1-.139.045-.27.000-.411s-.45-.945-.62-1.287c-.17-.342-.34-.296-.45-.296s-.27-.000-.41.000c-.139.000-.363.045-.525.225-.163.18-.62.62-1.112 1.619-.492.999-.837 1.966-.837 2.261.000.296.225.568.45.747.225.179 1.412 1.905 3.2 3.16.599.405 1.29.62 1.688.792.398.172.885.131 1.211-.075.325-.206.96-.689 1.112-1.311.15-.622.15-.99.09-.1.045-.045-.09-.09z"/>
    </svg>
)

export default function SavedAnalysisPage({ params }: { params: { id: string } }) {
    
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <nav aria-label="breadcrumb">
                <ol className="flex items-center gap-2 text-sm">
                    <li>
                        <Link className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors" href="/dashboard">
                            <ArrowLeft className="size-4" /> Mis Análisis
                        </Link>
                    </li>
                </ol>
            </nav>

             <header className="space-y-2">
                <h1 className="text-foreground text-3xl md:text-4xl font-bold leading-tight tracking-tight">{analysisData.title}</h1>
                 <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="size-4" />
                        <span>Analizado el: {analysisData.createdAt}</span>
                    </div>
                </div>
            </header>

            <Card className="bg-card shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="text-primary text-sm uppercase tracking-wider">Recomendación Principal</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 space-y-2">
                        <p className="text-3xl font-bold text-foreground">{analysisData.recommendation}</p>
                        <p className="text-4xl font-bold text-success">EV: +{analysisData.ev.toFixed(1)}%</p>
                        <p className="text-muted-foreground">Stake Sugerido: 2.5 Unidades (Kelly)</p>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <ConfidenceGauge value={analysisData.confidence} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                        <Bot className="text-primary"/> Análisis del Experto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: analysisData.textualAnalysis.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold">$1</strong>') }} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-bold text-xl">Tabla de Apuestas de Valor</CardTitle>
                    <CardDescription>Análisis completo de todos los mercados principales.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mercado</TableHead>
                                    <TableHead className="text-center">Cuota</TableHead>
                                    <TableHead className="text-center">Prob. Modelo</TableHead>
                                    <TableHead className="text-center">Valor Calculado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analysisData.valueBets.sort((a, b) => b.value - a.value).map((bet, index) => (
                                    <TableRow key={index} className={bet.value > 0 ? "bg-green-500/5" : "bg-red-500/5"}>
                                        <TableCell className="font-medium">{bet.market}</TableCell>
                                        <TableCell className="text-center font-mono">{bet.odds.toFixed(2)}</TableCell>
                                        <TableCell className="text-center font-mono">{bet.probability.toFixed(1)}%</TableCell>
                                        <TableCell className={`text-center font-bold font-mono ${bet.value > 0 ? 'text-success' : 'text-destructive'}`}>
                                            {bet.value > 0 ? '+' : ''}{bet.value.toFixed(1)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-bold text-xl">Datos de Entrada del Análisis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Contexto de los Equipos</h3>
                        <p className="text-muted-foreground">{analysisData.inputData.context}</p>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-foreground mb-1">Modelo Utilizado</h3>
                        <Badge variant="secondary">{analysisData.inputData.modelUsed}</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
