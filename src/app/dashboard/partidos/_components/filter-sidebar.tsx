
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { getLeaguesList } from '../actions';
import { League } from '@/lib/types';


export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<Set<string>>(new Set(searchParams.get('leagues')?.split(',')));
  
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(),
    to: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : addDays(new Date(), 7),
  })

  const [value, setValue] = React.useState([Number(searchParams.get('minValue') || 0)]);
  const [odds, setOdds] = React.useState([
    Number(searchParams.get('minOdds') || 1.0),
    Number(searchParams.get('maxOdds') || 10.0),
  ]);
  
  useEffect(() => {
    async function fetchLeagues() {
      const leaguesData = await getLeaguesList();
      setLeagues(leaguesData);
    }
    fetchLeagues();
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
  
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('leagues', Array.from(selectedLeagues).join(','));
    if (date?.from) params.set('startDate', format(date.from, 'yyyy-MM-dd'));
    if (date?.to) params.set('endDate', format(date.to, 'yyyy-MM-dd'));
    params.set('minValue', String(value[0]));
    params.set('minOdds', String(odds[0]));
    params.set('maxOdds', String(odds[1]));
    
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleResetFilters = () => {
      router.push(pathname);
  }

  const handleLeagueSelect = (leagueId: string) => {
    const newSelectedLeagues = new Set(selectedLeagues);
    if (newSelectedLeagues.has(leagueId)) {
        newSelectedLeagues.delete(leagueId);
    } else {
        newSelectedLeagues.add(leagueId);
    }
    setSelectedLeagues(newSelectedLeagues);
  };


  return (
    <aside className="w-80 h-full border-r bg-background p-6 flex flex-col gap-8">
      <h2 className="text-xl font-bold">Filtros</h2>

      <div className="space-y-4">
        <Label htmlFor="search-team">Búsqueda por Equipo o Liga</Label>
        <Input id="search-team" placeholder="Ej: Real Madrid..." />
      </div>

      <div className="space-y-2">
        <Label>Ligas</Label>
         <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Buscar liga..." />
            <CommandList>
                <CommandEmpty>No se encontraron ligas.</CommandEmpty>
                <CommandGroup>
                {leagues.map((league) => (
                    <CommandItem
                        key={league.id}
                        onSelect={() => handleLeagueSelect(league.id)}
                        className="cursor-pointer"
                    >
                         <Checkbox checked={selectedLeagues.has(league.id)} className="mr-2" />
                        {league.name}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
        </Command>
      </div>

      <div className={cn("grid gap-2")}>
        <Label>Rango de Fechas</Label>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                date.to ? (
                    <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                    </>
                ) : (
                    format(date.from, "LLL dd, y")
                )
                ) : (
                <span>Elige una fecha</span>
                )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
            />
            </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Umbral de Valor ({value[0]}%)</Label>
        <Slider
          defaultValue={value}
          onValueChange={setValue}
          max={20}
          step={0.5}
        />
      </div>

       <div className="space-y-2">
        <Label>Rango de Cuotas ({odds[0].toFixed(2)} - {odds[1].toFixed(2)})</Label>
        <Slider
          defaultValue={odds}
          onValueChange={setOdds}
          max={20}
          step={0.1}
          min={1}
          minStepsBetweenThumbs={1}
        />
      </div>

       <div className="space-y-4">
            <Label>Mercados Disponibles</Label>
            <div className="flex items-center space-x-2">
                <Checkbox id="h2h" />
                <label htmlFor="h2h" className="text-sm font-medium leading-none">1X2 (Resultado Final)</label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="spreads" />
                <label htmlFor="spreads" className="text-sm font-medium leading-none">Hándicap Asiático</label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="totals" />
                <label htmlFor="totals" className="text-sm font-medium leading-none">Totales (Más/Menos)</label>
            </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-8">
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
             <Button variant="ghost" onClick={handleResetFilters} className="flex items-center gap-2 text-muted-foreground">
                <FilterX className="h-4 w-4" />
                Limpiar Filtros
            </Button>
        </div>

    </aside>
  );
}

