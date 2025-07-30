
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AddBetDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Apuesta</DialogTitle>
          <DialogDescription>
            Registra una nueva apuesta en tu historial. Esta acción es manual.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="match" className="text-right">
              Partido
            </Label>
            <Input id="match" placeholder="Ej: Real Madrid vs Barcelona" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="selection" className="text-right">
              Selección
            </Label>
            <Input id="selection" placeholder="Ej: Gana Real Madrid" className="col-span-3" />
          </div>
           <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="odds" className="text-right col-span-2">
                        Cuota
                    </Label>
                    <Input id="odds" type="number" placeholder="2.50" className="col-span-2" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="stake" className="text-right col-span-2">
                        Importe
                    </Label>
                    <Input id="stake" type="number" placeholder="50.00" className="col-span-2" />
                </div>
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                    Estado
                </Label>
                <Select>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="won">Ganada</SelectItem>
                        <SelectItem value="lost">Perdida</SelectItem>
                        <SelectItem value="void">Nula</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                </Select>
           </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancelar
                </Button>
            </DialogClose>
          <Button type="submit">Guardar Apuesta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
