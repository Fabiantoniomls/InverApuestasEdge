
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const savedAnalyses = [
    {
        id: 1,
        title: "Real Madrid vs. FC Barcelona",
        date: "Análisis del 15 de mayo de 2024",
        tags: [
            { name: "Fútbol", color: "blue" },
            { name: "Apuesta Segura", color: "green" },
        ],
        image: "https://placehold.co/64x64.png",
        hint: "football soccer"
    },
    {
        id: 2,
        title: "Manchester United vs. Liverpool",
        date: "Análisis del 20 de mayo de 2024",
        tags: [
            { name: "Fútbol", color: "blue" },
            { name: "Riesgo Medio", color: "orange" },
        ],
        image: "https://placehold.co/64x64.png",
        hint: "football match"
    },
    {
        id: 3,
        title: "Bayern Munich vs. Borussia Dortmund",
        date: "Análisis del 25 de mayo de 2024",
        tags: [
            { name: "Fútbol", color: "blue" },
            { name: "Riesgo Alto", color: "red" },
        ],
        image: "https://placehold.co/64x64.png",
        hint: "stadium football"
    },
    {
        id: 4,
        title: "Alcaraz vs. Sinner - Roland Garros",
        date: "Análisis del 28 de mayo de 2024",
        tags: [
            { name: "Tenis", color: "purple" },
            { name: "Apuesta Segura", color: "green" },
        ],
        image: "https://placehold.co/64x64.png",
        hint: "tennis court"
    },
];

const tagColors: { [key: string]: string } = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
};


export default function DashboardPage() {
    return (
        <>
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-foreground text-4xl font-bold leading-tight">Mis análisis</h1>
                        <p className="text-muted-foreground mt-1">Gestiona tus análisis de partidos guardados.</p>
                    </div>
                    <Link href="/dashboard/analyze">
                        <Button className="font-bold">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Análisis
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="md:col-span-2 relative">
                        <Input className="w-full pl-10 pr-4 py-2 border rounded-full text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Buscar por equipo, fecha..." type="text"/>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                         <Select>
                            <SelectTrigger className="w-full border rounded-full px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                                <SelectValue placeholder="Filtrar por etiqueta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="futbol">Fútbol</SelectItem>
                                <SelectItem value="tenis">Tenis</SelectItem>
                                <SelectItem value="riesgo-alto">Riesgo alto</SelectItem>
                                <SelectItem value="apuesta-segura">Apuesta segura</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                         <Select>
                            <SelectTrigger className="w-full border rounded-full px-4 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fecha">Fecha del análisis</SelectItem>
                                <SelectItem value="categoria">Categoría/Etiqueta</SelectItem>
                                <SelectItem value="confianza">Nivel de confianza</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {savedAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
                        <Image src={analysis.image} alt={analysis.title} data-ai-hint={analysis.hint} className="rounded-xl object-cover" width={64} height={64} />

                        <div className="flex-1">
                            <h3 className="text-foreground text-lg font-semibold leading-normal">{analysis.title}</h3>
                            <p className="text-muted-foreground text-sm">{analysis.date}</p>
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                {analysis.tags.map(tag => (
                                    <span key={tag.name} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${tagColors[tag.color]}`}>
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Link href={`/dashboard/analysis/${analysis.id}`}>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground">
                                    <Eye className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground">
                                <Edit className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-100 text-red-500 hover:text-red-700">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
