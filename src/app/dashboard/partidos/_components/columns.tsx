
"use client"

import { Match } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpDown, BarChart2, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ValueIndicator = ({ value, explanation }: { value: number | undefined, explanation?: string }) => {
    if (value === undefined || value <= 0) {
        return <span className="text-muted-foreground">-</span>;
    }
    const colorClass = value > 0.05 ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold';
    
    const indicator = <Badge variant="outline" className={colorClass}>{`+${(value * 100).toFixed(1)}%`}</Badge>;

    if (!explanation) {
        return indicator;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`font-mono text-right ${colorClass} cursor-help`}>
                        {indicator}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        <p>{explanation}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


const ActionCell = ({ row }: { row: any }) => {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    const match = row.original;
    const params = new URLSearchParams();
    params.set('teamA', match.teams.home.name);
    params.set('teamB', match.teams.away.name);
    if(match.mainOdds?.[1]) params.set('oddsHome', String(match.mainOdds[1]));
    if(match.mainOdds?.['X']) params.set('oddsDraw', String(match.mainOdds['X']));
    if(match.mainOdds?.[2]) params.set('oddsAway', String(match.mainOdds[2]));
    if(tab) params.set('tab', tab);

    return (
        <div className="text-right">
            <Button asChild variant="default" size="sm">
              <Link href={`/dashboard/analyze?${params.toString()}`}>
                <BarChart2 className="mr-2 h-4 w-4" />
                Analizar
              </Link>
            </Button>
        </div>
    )
}


export const columns: ColumnDef<Match>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
          return (
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => row.toggleExpanded(!row.getIsExpanded())}
                  className="h-8 w-8"
              >
                  <ChevronDown className={`h-4 w-4 transition-transform ${row.getIsExpanded() ? 'rotate-180' : ''}`} />
                  <span className="sr-only">Toggle row</span>
              </Button>
          );
      },
  },
  {
    id: "eventTimestamp",
    accessorKey: "eventTimestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha y Hora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = new Date(row.original.eventTimestamp * 1000);
        return (
            <div className="text-left">
                <div>{format(date, "d MMM yyyy", { locale: es })}</div>
                <div className="text-xs text-muted-foreground">{format(date, "HH:mm", { locale: es })}h</div>
            </div>
        )
    }
  },
  {
    id: "partido",
    header: "Partido",
    cell: ({ row }) => {
      const match = row.original
      return (
        <div className="flex items-center gap-2 max-w-xs">
            <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={24} height={24} className="h-6 w-6" data-ai-hint="team logo" />
            <span className="font-medium truncate">{match.teams.home.name}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="font-medium truncate">{match.teams.away.name}</span>
            <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={24} height={24} className="h-6 w-6" data-ai-hint="team logo" />
        </div>
      )
    },
  },
  {
    id: "liga",
    header: "Liga",
    cell: ({ row }) => {
        const league = row.original.league;
        return (
             <div className="flex items-center gap-2">
                {league.logoUrl && <Image src={league.logoUrl} alt={league.name} width={20} height={20} className="h-5 w-5" data-ai-hint="league logo" />}
                <span className="text-sm truncate">{league.name}</span>
            </div>
        )
    }
  },
  {
    id: "1x2",
    header: () => <div className="text-right">1X2</div>,
    cell: ({ row }) => {
      const odds = row.original.mainOdds
      return (
        <div className="flex justify-end gap-1 text-xs w-full font-mono">
          <Button variant="outline" size="sm" className="h-7 w-14 justify-end">{odds?.[1]?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7 w-14 justify-end">{odds?.['X']?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7 w-14 justify-end">{odds?.[2]?.toFixed(2) ?? '-'}</Button>
        </div>
      )
    },
  },
  {
    id: "valueScore",
    accessorKey: "valueMetrics.valueScore",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right w-full justify-end"
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <ValueIndicator value={row.original.valueMetrics?.valueScore} explanation={row.original.valueMetrics?.explanation} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acción</div>,
    cell: ActionCell,
  },
]
