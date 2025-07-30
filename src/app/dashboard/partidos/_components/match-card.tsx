
import { Match } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, BarChart2, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ValueIndicator = ({ value, explanation }: { value: number | undefined, explanation?: string }) => {
    if (value === undefined || value <= 0) {
        return <Badge variant="secondary">Sin Valor</Badge>;
    }
    const colorClass = value > 0.1 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge className={colorClass}>{`+${(value * 100).toFixed(1)}% Valor`}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        <p>{explanation || 'Valor detectado por el modelo.'}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export function MatchCard({ match }: { match: Match }) {
    const { teams, mainOdds, eventTimestamp, valueMetrics } = match;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-x-2 w-full">
                       <Image src={teams.home.logoUrl} alt={teams.home.name} width={28} height={28} className="h-7 w-7" data-ai-hint="team logo" />
                       <span className="font-semibold text-sm truncate text-left">{teams.home.name}</span>
                       <span className="text-sm font-mono text-right font-semibold">{mainOdds?.[1]?.toFixed(2) ?? '-'}</span>

                       <Image src={teams.away.logoUrl} alt={teams.away.name} width={28} height={28} className="h-7 w-7" data-ai-hint="team logo" />
                       <span className="font-semibold text-sm truncate text-left">{teams.away.name}</span>
                       <span className="text-sm font-mono text-right font-semibold">{mainOdds?.[2]?.toFixed(2) ?? '-'}</span>

                       <div className="w-7 h-7 flex items-center justify-center">
                           <span className="text-muted-foreground font-mono text-xs">X</span>
                       </div>
                       <span className="text-sm truncate text-left text-muted-foreground">Empate</span>
                       <span className="text-sm font-mono text-right font-semibold">{mainOdds?.['X']?.toFixed(2) ?? '-'}</span>

                    </div>
                </div>

                 <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        <span>{format(new Date(eventTimestamp), "d MMM yyyy", { locale: es })}</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        <span>{format(new Date(eventTimestamp), "HH:mm", { locale: es })}h</span>
                    </div>
                </div>
                
                 <div className="flex items-center justify-between gap-2">
                     <ValueIndicator value={valueMetrics?.valueScore} explanation={valueMetrics?.explanation} />
                    <Button variant="default" size="sm">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Analizar
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}
