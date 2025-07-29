
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scaling } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
               <Scaling className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold text-foreground">BetValuator Edge</CardTitle>
            <CardDescription className="text-muted-foreground">
              Accede a tu dashboard de inversión deportiva cuantitativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nombre@ejemplo.com" defaultValue="analyst@betvaluator.edge" className="rounded-lg"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" defaultValue="password" className="rounded-lg"/>
              </div>
            </div>
            <Link href="/dashboard" className="mt-6 block">
              <Button className="w-full font-bold rounded-lg" variant="default">Iniciar Sesión</Button>
            </Link>
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    