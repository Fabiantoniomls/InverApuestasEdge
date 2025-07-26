
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link";

export default function ProfilePage() {
  return (
      <div className="grid gap-10">
        <header className="mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Mi Perfil
            </h1>
            <p className="mt-2 text-muted-foreground">
                Gestiona la información de tu cuenta y tus preferencias.
            </p>
        </header>

        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Información Personal</CardTitle>
            <CardDescription>
                Actualiza tu nombre, correo electrónico y foto de perfil.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" defaultValue="Sofia R." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="analyst@betvaluator.edge" disabled />
                </div>
            </CardContent>
            <CardFooter>
            <Button>Guardar Cambios</Button>
            </CardFooter>
        </Card>

         <Card>
            <CardHeader>
            <CardTitle className="font-headline">Preferencias de Apuestas</CardTitle>
            <CardDescription>
                Ajusta tu capital inicial y tu estrategia de apuestas por defecto.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="bankroll">Capital Actual (€)</Label>
                    <Input id="bankroll" defaultValue="10483.21" type="number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="staking">Plan de Staking por Defecto</Label>
                    <Select defaultValue="QuarterKelly">
                    <SelectTrigger id="staking">
                        <SelectValue placeholder="Seleccionar plan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="QuarterKelly">Quarter Kelly</SelectItem>
                        <SelectItem value="HalfKelly">Half Kelly</SelectItem>
                        <SelectItem value="FullKelly">Full Kelly</SelectItem>
                        <SelectItem value="Percentage">Porcentaje (1%)</SelectItem>
                        <SelectItem value="Fixed">Fijo (€10)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="risk">Tolerancia al Riesgo</Label>
                    <Select defaultValue="medium">
                    <SelectTrigger id="risk">
                        <SelectValue placeholder="Seleccionar nivel de riesgo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
            <Button>Guardar Preferencias</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Zona de Peligro</CardTitle>
                <CardDescription>
                    Estas acciones son irreversibles. Por favor, procede con precaución.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard/settings">
                    <Button variant="outline">
                        Ir a Configuración Avanzada
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
  )
}
