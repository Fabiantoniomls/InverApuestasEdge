
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, BarChart2, Copy, MessageSquare, Search, ThumbsUp, TrendingUp, Trophy, UserPlus, FilePlus2, Star, LineChart, Banknote } from "lucide-react";
import Image from "next/image";

const activityFeed = [
    {
        user: { name: "QuantumLeap", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
        action: "compartió un nuevo análisis",
        time: "hace 15 minutos",
        likes: 12,
        comments: 3,
        analysis: {
            title: "Valor Oculto en la Bundesliga: Augsburg vs. Hoffenheim",
            market: "Gana Augsburg",
            odds: 2.50,
            probability: 45, // in %
            value: 12.5, // in %
        }
    },
    {
        user: { name: "ValueSeeker", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
        action: "compartió un nuevo análisis",
        time: "hace 1 hora",
        likes: 5,
        comments: 8,
        analysis: {
            title: "ATP Masters: Oportunidad en el Alcaraz vs. Zverev",
            market: "Alcaraz 2-0",
            odds: 1.80,
            probability: 60, // in %
            value: 8.0, // in %
        }
    }
]

const forums = [
    {
      title: "Discusión de Modelos (Fútbol)",
      description: "Debate sobre el modelo Híbrido Poisson-xG, lesiones, tácticas y más.",
      threads: 42,
      lastPost: "hace 5 min",
      icon: LineChart,
    },
    {
      title: "Discusión de Modelos (Tenis)",
      description: "Habla sobre el sistema Elo, la importancia de las superficies y estadísticas.",
      threads: 28,
      lastPost: "hace 22 min",
      icon: TrendingUp,
    },
    {
      title: "Gestión de Capital (Staking)",
      description: "Discute estrategias de Apuesta Fija, Porcentual y el Criterio de Kelly.",
      threads: 112,
      lastPost: "hace 1 hora",
      icon: Banknote,
    },
     {
      title: "Sugerencias para la Plataforma",
      description: "Feedback directo para proponer mejoras y nuevas funcionalidades.",
      threads: 78,
      lastPost: "hace 3 horas",
      icon: Star,
    },
];


const leaderboards = {
    yield: [
        { rank: 1, name: "AlphaReturns", value: "+18.2%", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
        { rank: 2, name: "QuantumLeap", value: "+15.7%", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
        { rank: 3, name: "ValueSeeker", value: "+12.1%", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
    ],
    pnl: [
         { rank: 1, name: "BankrollMaster", value: "+€12,450", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
         { rank: 2, name: "ConsistentGains", value: "+€9,800", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
         { rank: 3, name: "AlphaReturns", value: "+€8,200", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
    ],
    hitRate: [
         { rank: 1, name: "MrConsistent", value: "72%", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
         { rank: 2, name: "SharpShooter", value: "68%", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
         { rank: 3, name: "WinnerPicker", value: "65%", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
    ]
}

const analysts = [
    { name: "AlphaReturns", specialties: ["Fútbol", "Modelos xG", "La Liga"], followers: "1.2k", avatar: "https://placehold.co/64x64.png", hint: "user avatar" },
    { name: "ValueSeeker", specialties: ["Tenis", "Mercados ATP", "Elo Ratings"], followers: "890", avatar: "https://placehold.co/64x64.png", hint: "user avatar" },
    { name: "RiskManager", specialties: ["Gestión de Bankroll", "Psicología"], followers: "2.5k", avatar: "https://placehold.co/64x64.png", hint: "user avatar" },
]

const LeaderboardTable = ({ title, data, icon: Icon }: { title: string, data: any[], icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Icon className="text-primary"/> {title}</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Analista</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(item => (
                        <TableRow key={item.rank}>
                            <TableCell className="font-bold">{item.rank}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={item.avatar} alt={item.name} data-ai-hint={item.hint} />
                                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">{item.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default function CommunityPage() {
    return (
        <div className="space-y-8">
             <header>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Comunidad de Analistas</h1>
                <p className="mt-1 text-muted-foreground">Conecta, comparte y aprende de otros inversores deportivos para mejorar tu estrategia.</p>
            </header>

            <Tabs defaultValue="feed" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="feed">Feed de Actividad</TabsTrigger>
                    <TabsTrigger value="forums">Foros de Estrategia</TabsTrigger>
                    <TabsTrigger value="leaderboards">Clasificaciones</TabsTrigger>
                    <TabsTrigger value="analysts">Perfiles de Analista</TabsTrigger>
                </TabsList>
                
                <TabsContent value="feed" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Última Actividad</CardTitle>
                            <CardDescription>Análisis compartidos y discusiones de la comunidad.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {activityFeed.map((item, index) => (
                                <Card key={index} className="p-4 bg-secondary/30">
                                    <div className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarImage src={item.user.avatar} alt={item.user.name} data-ai-hint={item.user.hint} />
                                            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold text-primary">{item.user.name}</span> {item.action}
                                                <span className="mx-1">·</span>
                                                <span>{item.time}</span>
                                            </p>
                                            <h3 className="font-bold text-lg text-foreground mt-2">{item.analysis.title}</h3>
                                            
                                            <div className="border-y my-3 py-2 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                                <div className="font-medium"><span className="text-muted-foreground">Mercado: </span>{item.analysis.market}</div>
                                                <div className="font-medium"><span className="text-muted-foreground">Cuota: </span>{item.analysis.odds.toFixed(2)}</div>
                                                <div className="font-medium"><span className="text-muted-foreground">Prob. Modelo: </span>{item.analysis.probability}%</div>
                                                <div className="font-bold text-green-600 border border-green-500/50 rounded-full"><span className="text-muted-foreground">Valor: </span>+{item.analysis.value.toFixed(1)}%</div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                                <Button variant="ghost" size="sm" className="gap-1">
                                                    <ThumbsUp className="size-4"/> {item.likes} Análisis Sólido
                                                </Button>
                                                <Button variant="ghost" size="sm" className="gap-1">
                                                     <MessageSquare className="size-4"/> {item.comments} Comentarios
                                                </Button>
                                                <div className="flex-grow"></div>
                                                <Button variant="outline" size="sm" className="gap-1.5">
                                                     <FilePlus2 className="size-4"/> Copiar a Mis Análisis
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="forums" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {forums.map((forum, index) => {
                            const Icon = forum.icon;
                            return (
                                <Card key={index} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <Icon className="w-8 h-8 text-primary mb-4" />
                                            <Button variant="link" className="text-primary">
                                                Ir al Foro <ArrowUpRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                        <CardTitle>{forum.title}</CardTitle>
                                        <CardDescription>{forum.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-between text-sm text-muted-foreground">
                                        <span>{forum.threads} hilos</span>
                                        <span>Último post: {forum.lastPost}</span>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>


                <TabsContent value="leaderboards" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LeaderboardTable title="Top Yield" data={leaderboards.yield} icon={TrendingUp} />
                        <LeaderboardTable title="Top P/L" data={leaderboards.pnl} icon={BarChart2} />
                        <LeaderboardTable title="Top Tasa de Acierto" data={leaderboards.hitRate} icon={Trophy} />
                    </div>
                </TabsContent>

                <TabsContent value="analysts" className="mt-6">
                     <div className="relative mb-6">
                        <Input placeholder="Buscar analistas por nombre o especialidad..." className="pl-10" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysts.map((analyst, index) => (
                             <Card key={index}>
                                <CardContent className="flex flex-col items-center text-center p-6">
                                    <Avatar className="w-20 h-20 mb-4">
                                        <AvatarImage src={analyst.avatar} alt={analyst.name} data-ai-hint={analyst.hint}/>
                                        <AvatarFallback>{analyst.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-bold text-lg text-foreground">{analyst.name}</h3>
                                    <p className="text-sm text-muted-foreground">{analyst.followers} seguidores</p>
                                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                                        {analyst.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                                    </div>
                                    <Button className="w-full mt-6">
                                        <UserPlus className="mr-2"/> Seguir
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
