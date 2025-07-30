
"use client"

import { Match } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpDown } from "lucide-react"

const ValueIndicator = ({ value }: { value: number | undefined }) => {
    if (value === undefined || value <= 0) {
        return <span className="text-muted-foreground">-</span>;
    }
    const color = value > 0.05 ? 'text-green-600' : 'text-yellow-600';
    return <div className={`font-bold font-mono ${color}`}>{`+${(value * 100).toFixed(1)}%`}</div>;
};


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
    accessorKey: "valueScore",
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
    cell: ({ row }) => <div className="text-right"><ValueIndicator value={row.original.valueScore} /></div>,
  },
  {
    accessorKey: "startTime",
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
        const date = new Date(row.getValue("startTime"));
        return (
            <div className="text-left">
                <div>{format(date, "d MMM yyyy", { locale: es })}</div>
                <div className="text-xs text-muted-foreground">{format(date, "HH:mm", { locale: es })}h</div>
            </div>
        )
    }
  },
  {
    header: "Partido",
    cell: ({ row }) => {
      const match = row.original
      return (
        <div className="flex items-center gap-2">
            <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={24} height={24} className="h-6 w-6" data-ai-hint="team logo" />
            <span className="font-medium truncate">{match.homeTeam.name}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="font-medium truncate">{match.awayTeam.name}</span>
            <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={24} height={24} className="h-6 w-6" data-ai-hint="team logo" />
        </div>
      )
    },
  },
  {
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
    header: "1X2",
    cell: ({ row }) => {
      const odds = row.original.odds
      return (
        <div className="flex justify-end gap-2 text-xs w-full">
          <Button variant="outline" size="sm" className="h-7 font-mono w-16 justify-end">{odds?.home?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7 font-mono w-16 justify-end">{odds?.draw?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7 font-mono w-16 justify-end">{odds?.away?.toFixed(2) ?? '-'}</Button>
        </div>
      )
    },
  },
   {
    header: "O/U 2.5",
    cell: ({ row }) => {
      const odds = row.original.odds
      return (
        <div className="flex justify-end gap-2 text-xs w-full">
          <Button variant="outline" size="sm" className="h-7 font-mono w-16 justify-end">{odds?.over?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7 font-mono w-16 justify-end">{odds?.under?.toFixed(2) ?? '-'}</Button>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acción</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
            <Button variant="default">Analizar Partido</Button>
        </div>
      )
    },
  },
]
