
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit, Trash2, Share2, Copy, Image as ImageIcon, Save, Calendar, Clock, Facebook, Twitter, Linkedin, Bot } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
    textualAnalysis: "Basado en la forma actual del equipo y datos históricos, el Real Madrid tiene una mayor probabilidad de ganar. La defensa del Barcelona ha mostrado vulnerabilidades que el ataque del Madrid puede explotar. Sin embargo, el potencial del FC Barcelona no debe ser subestimado, especialmente en un clásico.",
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
    }
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
        <div className="space-y-8">
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
                    <h1 className="text-foreground text-3xl md:text-4xl font-bold leading-tight tracking-tight">{analysisData.title}</h1>
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
                            <div>
                                <CardTitle className="font-bold text-xl">Resultado del Análisis</CardTitle>
                                <CardDescription>Resumen de las probabilidades y recomendaciones.</CardDescription>
                            </div>
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
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 text-xs text-foreground truncate">Real Madrid</div>
                                            <Progress value={analysisData.probabilities.teamA} className="h-2.5 flex-1" />
                                            <div className="w-10 text-xs font-semibold">{analysisData.probabilities.teamA}%</div>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <div className="w-20 text-xs text-foreground truncate">FC Barcelona</div>
                                            <Progress value={analysisData.probabilities.teamB} className="h-2.5 flex-1" />
                                            <div className="w-10 text-xs font-semibold">{analysisData.probabilities.teamB}%</div>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <div className="w-20 text-xs text-foreground truncate">Empate</div>
                                            <Progress value={analysisData.probabilities.draw} className="h-2.5 flex-1" />
                                            <div className="w-10 text-xs font-semibold">{analysisData.probabilities.draw}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 border-t pt-4">
                                <h3 className="text-base font-semibold text-foreground mb-2">Análisis Textual por IA</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{analysisData.textualAnalysis}</p>
                            </div>
                             <div className="mt-6 border-t pt-4">
                                <h3 className="text-base font-semibold text-foreground mb-2">Compartir Análisis</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="relative flex-grow">
                                        <Input readOnly type="text" value={analysisData.shareUrl} className="pr-12 rounded-lg h-10"/>
                                        <Button variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full">
                                            <Copy className="size-4" />
                                        </Button>
                                    </div>
                                    <Button variant="secondary">
                                        <ImageIcon className="mr-2" />
                                        <span>Generar Imagen</span>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                    <p className="text-sm text-muted-foreground">O compartir en:</p>
                                    <div className="flex gap-2">
                                        <SocialButton href="#" className="bg-[#1877F2]"><Facebook className="h-4 w-4" /></SocialButton>
                                        <SocialButton href="#" className="bg-[#1DA1F2]"><Twitter className="h-4 w-4" /></SocialButton>
                                        <SocialButton href="#" className="bg-[#25D366]"><WhatsAppIcon /></SocialButton>
                                        <SocialButton href="#" className="bg-[#0A66C2]"><Linkedin className="h-4 w-4" /></SocialButton>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-bold text-xl">Estadísticas Clave del Partido</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="text-xs text-muted-foreground uppercase bg-gray-50 dark:bg-gray-800">
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
                                            <TableCell className="text-center text-green-600 font-semibold">{analysisData.stats.teamA.winRate}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">{analysisData.stats.teamB.name}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamB.goalsFor}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamB.goalsAgainst}</TableCell>
                                            <TableCell className="text-center">{analysisData.stats.teamB.possession}</TableCell>
                                            <TableCell className="text-center text-red-600 font-semibold">{analysisData.stats.teamB.winRate}</TableCell>
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
                           <CardTitle className="font-bold text-xl">Detalles del Partido</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-4 text-sm">
                                <li className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Competición</span>
                                    <span className="font-medium text-foreground">{analysisData.matchDetails.competition}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Fecha</span>
                                    <span className="font-medium text-foreground">{analysisData.matchDetails.date}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Hora</span>
                                    <span className="font-medium text-foreground">{analysisData.matchDetails.time}</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                           <CardTitle className="font-bold text-xl">Datos de Entrada del Análisis</CardTitle>
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
                             <div className="border-t pt-4">
                                <h3 className="text-base font-semibold text-foreground mb-2">Modelo Utilizado</h3>
                                <div className="flex items-center gap-2">
                                     <Bot className="text-primary size-5" />
                                    <Badge variant="secondary">{analysisData.inputData.modelUsed}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-bold text-xl">Notas Personales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Añade tus notas aquí..." defaultValue={analysisData.personalNotes} rows={5} className="rounded-lg"/>
                            <div className="flex justify-end mt-4">
                                <Button variant="primary">
                                    <Save className="mr-2"/> Guardar Nota
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
