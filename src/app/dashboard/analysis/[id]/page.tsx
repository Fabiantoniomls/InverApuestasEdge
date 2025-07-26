
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit, Trash2, Share2, Copy, Image as ImageIcon, Save, Calendar, Clock } from "lucide-react";
import Link from "next/link";

// Mock data - in a real app, you would fetch this based on the `id` param
const analysisData = {
    title: "Real Madrid vs. FC Barcelona",
    createdAt: "25 de Octubre, 2024 - 10:30 AM",
    updatedAt: "Hoy - 14:15 PM",
    recommendation: "Apostar por Real Madrid",
    confidence: 70,
    probabilities: {
        teamA: 55,
        teamB: 25,
        draw: 20,
    },
    textualAnalysis: "Basado en la forma actual del equipo y datos históricos, el Real Madrid tiene una mayor probabilidad de ganar. Sin embargo, el potencial del FC Barcelona no debe ser subestimado, especialmente en un clásico. La defensa del Barcelona ha mostrado vulnerabilidades que el ataque del Madrid puede explotar.",
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
    }
};

export default function SavedAnalysisPage({ params }: { params: { id: string } }) {
    
    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            <nav aria-label="breadcrumb">
                <ol className="flex items-center gap-2 text-sm">
                    <li>
                        <Link className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors" href="/dashboard">
                            <ArrowLeft className="size-4" /> Mis Análisis
                        </Link>
                    </li>
                </ol>
            </nav>

            <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-foreground text-4xl font-bold leading-tight tracking-tighter">{analysisData.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            <span>Creado: {analysisData.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="size-4" />
                            <span>Última act: {analysisData.updatedAt}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Button variant="secondary">
                        <Edit className="mr-2" />
                        <span className="truncate">Editar Análisis</span>
                    </Button>
                    <Button variant="destructive">
                        <Trash2 className="mr-2" />
                        <span className="truncate">Eliminar Análisis</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <Card>
                        <CardHeader className="flex-row justify-between items-start">
                            <CardTitle className="font-bold">Resultado del Análisis</CardTitle>
                             <Button variant="primary">
                                <Share2 className="mr-2" />
                                <span>Compartir</span>
                            </Button>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="border-l-4 border-primary pl-4">
                                        <p className="text-sm text-muted-foreground">Recomendación</p>
                                        <p className="text-lg font-semibold text-foreground">{analysisData.recommendation}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground">Nivel de Confianza</p>
                                            <p className="text-lg font-semibold text-green-600">{analysisData.confidence}%</p>
                                        </div>
                                        <Progress value={analysisData.confidence} className="h-2.5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Probabilidades Actualizadas</p>
                                    <div className="flex flex-col gap-2">
                                        <div>
                                          <Progress value={analysisData.probabilities.teamA} className="h-2.5" />
                                          <p className="text-xs text-foreground mt-1">Real Madrid: {analysisData.probabilities.teamA}%</p>
                                        </div>
                                        <div>
                                          <Progress value={analysisData.probabilities.teamB} className="h-2.5 bg-red-500" />
                                           <p className="text-xs text-foreground mt-1">FC Barcelona: {analysisData.probabilities.teamB}%</p>
                                        </div>
                                         <div>
                                          <Progress value={analysisData.probabilities.draw} className="h-2.5 bg-gray-400" />
                                          <p className="text-xs text-foreground mt-1">Empate: {analysisData.probabilities.draw}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 border-t pt-4">
                                <h3 className="text-base font-semibold text-foreground mb-2">Análisis Textual</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{analysisData.textualAnalysis}</p>
                            </div>
                             <div className="mt-6 border-t pt-4">
                                <h3 className="text-base font-semibold text-foreground mb-2">Compartir Análisis</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="relative flex-grow">
                                        <Input readOnly type="text" value={analysisData.shareUrl} className="pr-12"/>
                                        <Button variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full">
                                            <Copy className="size-4" />
                                        </Button>
                                    </div>
                                    <Button variant="secondary">
                                        <ImageIcon className="mr-2" />
                                        <span>Generar Imagen</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="font-bold">Notas Personales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Añade tus notas aquí..." defaultValue={analysisData.personalNotes} rows={5}/>
                            <div className="flex justify-end mt-4">
                                <Button variant="primary">
                                    <Save className="mr-2"/> Guardar Nota
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-bold">Estadísticas Clave</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Equipo</TableHead>
                                            <TableHead className="text-center">Goles Marcados (Últ. 5)</TableHead>
                                            <TableHead className="text-center">Goles Recibidos (Últ. 5)</TableHead>
                                            <TableHead className="text-center">Posesión Media</TableHead>
                                            <TableHead className="text-center">Tasa de Victorias</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">{analysisData.stats.teamA.name}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamA.goalsFor}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamA.goalsAgainst}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamA.possession}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamA.winRate}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">{analysisData.stats.teamB.name}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamB.goalsFor}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamB.goalsAgainst}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamB.possession}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamB.winRate}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                <div className="lg:col-span-1 flex flex-col gap-8">
                     <Card>
                        <CardHeader>
                           <CardTitle className="font-bold">Detalles del Partido</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-4 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Competición</span>
                                    <span className="font-medium text-foreground">{analysisData.matchDetails.competition}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Fecha</span>
                                    <span className="font-medium text-foreground">{analysisData.matchDetails.date}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Hora</span>
                                    <span className="font-medium text-foreground">{analysisData.matchDetails.time}</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                           <CardTitle className="font-bold">Datos de Entrada</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold text-foreground mb-2">Contexto de los Equipos</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{analysisData.inputData.context}</p>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="text-base font-semibold text-foreground mb-2">Probabilidades Iniciales</h3>
                                <p className="text-sm text-muted-foreground">{analysisData.inputData.initialOdds}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    