import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Download, MoreVertical } from "lucide-react";
import Image from "next/image";

const simulations = [
    { name: "Simulación Agresiva Kelly", bankroll: "€3,452", roi: "15.2%", ruinRate: "25%", bankrollColor: "text-green-600", roiColor: "text-green-600", ruinRateColor: "text-red-500" },
    { name: "Estrategia Conservadora", bankroll: "€1,550", roi: "5.5%", ruinRate: "2%", bankrollColor: "text-green-600", roiColor: "text-green-600", ruinRateColor: "text-green-600" },
    { name: "Apuestas de Porcentaje Fijo", bankroll: "€1,985", roi: "9.8%", ruinRate: "10%", bankrollColor: "text-green-600", roiColor: "text-green-600", ruinRateColor: "text-yellow-600" },
    { name: "Test de Cuotas Bajas", bankroll: "€950", roi: "-0.5%", ruinRate: "55%", bankrollColor: "text-red-500", roiColor: "text-red-500", ruinRateColor: "text-red-500" },
];


export default function SimulatorPage() {
    return (
        <main className="flex-1 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Simulaciones</h1>
                <p className="text-gray-500">Visualiza y compara tus simulaciones de un vistazo.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Resumen de Simulaciones</h2>
                        <div className="flex items-center space-x-2">
                            <Button variant="link" className="text-sm font-semibold text-blue-600">
                                Ver todo <ArrowRight className="text-base ml-1" />
                            </Button>
                            <Button variant="outline" className="text-sm font-semibold text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                <Download className="text-base mr-1" />
                                Exportar
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="rounded-l-lg">Nombre</TableHead>
                                    <TableHead>Bankroll Final (Mediana)</TableHead>
                                    <TableHead>ROI (Mediana)</TableHead>
                                    <TableHead>Tasa de Ruina</TableHead>
                                    <TableHead className="rounded-r-lg"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {simulations.map((sim) => (
                                    <TableRow key={sim.name} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-gray-900">{sim.name}</TableCell>
                                        <TableCell className={`${sim.bankrollColor} font-semibold`}>{sim.bankroll}</TableCell>
                                        <TableCell className={sim.roiColor}>{sim.roi}</TableCell>
                                        <TableCell className={sim.ruinRateColor}>{sim.ruinRate}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="text-base" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-800">Métricas Clave</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-blue-800">Simulación más rentable</p>
                                    <p className="text-lg font-bold text-blue-900">Simulación Agresiva Kelly</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">+€2,452</p>
                                    <p className="text-sm text-blue-800">Beneficio Mediano</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-red-800">Mayor Tasa de Ruina</p>
                                    <p className="text-lg font-bold text-red-900">Test de Cuotas Bajas</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-red-600">55%</p>
                                    <p className="text-sm text-red-800">Probabilidad</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-800">¿Te resulta útil este panel?</CardTitle>
                            <p className="text-sm text-gray-600 pt-2">Tus comentarios nos ayudan a mejorar la experiencia de simulación para todos.</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">Poco útil</span>
                                <span className="text-sm text-gray-500">Muy útil</span>
                            </div>
                            <div className="flex justify-between items-center space-x-2 mb-4">
                                {[1, 2, 3, 4, 5].map(num => (
                                     <Button key={num} variant={num === 3 ? "default" : "outline"} size="icon" className={num === 3 ? "border-blue-500 bg-blue-50 text-blue-600" : ""}>
                                        {num}
                                    </Button>
                                ))}
                            </div>
                            <Textarea placeholder="¿Tienes alguna sugerencia específica?" rows={3} />
                            <Button className="w-full mt-4 bg-blue-600 text-white font-semibold hover:bg-blue-700">Enviar comentarios</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="mt-8">
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Comparación Visual de Bankroll</h2>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-600">Comparar:</span>
                             <Select defaultValue="fixed">
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="Seleccionar simulación" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aggressive">Simulación Agresiva Kelly</SelectItem>
                                    <SelectItem value="conservative">Estrategia Conservadora</SelectItem>
                                    <SelectItem value="fixed">Apuestas de Porcentaje Fijo</SelectItem>
                                    <SelectItem value="low-odds">Test de Cuotas Bajas</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm font-medium text-gray-600">con</span>
                             <Select defaultValue="conservative">
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="Seleccionar simulación" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aggressive">Simulación Agresiva Kelly</SelectItem>
                                    <SelectItem value="conservative">Estrategia Conservadora</SelectItem>
                                    <SelectItem value="fixed">Apuestas de Porcentaje Fijo</SelectItem>
                                    <SelectItem value="low-odds">Test de Cuotas Bajas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <Image alt="Comparison chart of two simulations" className="w-full h-auto rounded-lg" width={1200} height={400} src="https://placehold.co/1200x400.png" data-ai-hint="comparison chart" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6 text-center">
                        <div>
                            <h3 className="font-semibold text-gray-700">Apuestas de Porcentaje Fijo</h3>
                            <p className="text-2xl font-bold text-green-600 mt-1">€1,985</p>
                            <p className="text-sm text-gray-500">Bankroll Final Mediano</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Estrategia Conservadora</h3>
                            <p className="text-2xl font-bold text-green-600 mt-1">€1,550</p>
                            <p className="text-sm text-gray-500">Bankroll Final Mediano</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
