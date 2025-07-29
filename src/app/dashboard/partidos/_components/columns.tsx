
"use client"

import { Match } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// This will be implemented in Phase 4
const ValueIndicatorPlaceholder = ({ value }: { value: number | undefined }) => {
    if (value === undefined || value <= 0) {
        return <span className="text-muted-foreground">-</span>;
    }
    const color = value > 0.05 ? 'text-green-600' : 'text-yellow-600';
    return <div className={`font-bold ${color}`}>{`+${(value * 100).toFixed(1)}%`}</div>;
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
    header: "Valor",
    cell: ({ row }) => <ValueIndicatorPlaceholder value={row.original.valueScore} />,
  },
  {
    accessorKey: "startTime",
    header: "Fecha y Hora",
    cell: ({ row }) => {
        const date = new Date(row.getValue("startTime"));
        return (
            <div className="text-sm">
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
            <span className="font-medium">{match.homeTeam.name}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="font-medium">{match.awayTeam.name}</span>
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
                <span className="text-sm">{league.name}</span>
            </div>
        )
    }
  },
  {
    header: "1X2",
    cell: ({ row }) => {
      const odds = row.original.odds
      return (
        <div className="flex gap-2 text-xs">
          <Button variant="outline" size="sm" className="h-7">{odds?.home?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7">{odds?.draw?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7">{odds?.away?.toFixed(2) ?? '-'}</Button>
        </div>
      )
    },
  },
   {
    header: "O/U 2.5",
    cell: ({ row }) => {
      const odds = row.original.odds
      return (
        <div className="flex gap-2 text-xs">
          <Button variant="outline" size="sm" className="h-7">{odds?.over?.toFixed(2) ?? '-'}</Button>
          <Button variant="outline" size="sm" className="h-7">{odds?.under?.toFixed(2) ?? '-'}</Button>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const match = row.original
      return (
        <Button variant="default">Analizar Partido</Button>
      )
    },
  },
]
