
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, BarChart2, MessageSquare, Search, ThumbsUp, TrendingUp, Trophy, UserPlus } from "lucide-react";
import Image from "next/image";

const activityFeed = [
    {
        user: { name: "QuantumLeap", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
        action: "compartió un nuevo análisis",
        title: "Valor Oculto en la Bundesliga: Augsburg vs. Hoffenheim",
        time: "hace 15 minutos",
        likes: 12,
        comments: 3
    },
    {
        user: { name: "ValueSeeker", avatar: "https://placehold.co/40x40.png", hint: "user avatar" },
        action: "inició una nueva discusión",
        title: "¿Es el Criterio de Kelly demasiado agresivo para el fútbol?",
        time: "hace 1 hora",
        likes: 5,
        comments: 8
    }
]

const forums = [
    { title: "Estrategias de Staking: Kelly vs. Apuestas Fijas", author: "RiskManager", replies: 42, lastReply: "hace 5 minutos" },
    { title: "Modelos xG: ¿Qué fuentes de datos son más fiables?", author: "DataGeek", replies: 112, lastReply: "hace 22 minutos" },
    { title: "Psicología del Trading: Cómo evitar el sesgo de confirmación", author: "MindfulBets", replies: 78, lastReply: "hace 1 hora" },
]

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
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {activityFeed.map((item, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                                    <Avatar>
                                        <AvatarImage src={item.user.avatar} alt={item.user.name} data-ai-hint={item.user.hint} />
                                        <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-semibold text-primary">{item.user.name}</span> {item.action}
                                        </p>
                                        <h3 className="font-semibold text-foreground hover:underline cursor-pointer">{item.title}</h3>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                            <span>{item.time}</span>
                                            <div className="flex items-center gap-1"><ThumbsUp className="size-3"/> {item.likes}</div>
                                            <div className="flex items-center gap-1"><MessageSquare className="size-3"/> {item.comments}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon"><ArrowUpRight className="size-4"/></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="forums" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Foros de Estrategia</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tema</TableHead>
                                        <TableHead>Autor</TableHead>
                                        <TableHead>Respuestas</TableHead>
                                        <TableHead>Última Actividad</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {forums.map((forum, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-semibold text-primary hover:underline cursor-pointer">{forum.title}</TableCell>
                                            <TableCell>{forum.author}</TableCell>
                                            <TableCell>{forum.replies}</TableCell>
                                            <TableCell>{forum.lastReply}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
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
