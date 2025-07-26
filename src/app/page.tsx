
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scaling } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
               <Scaling className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold text-foreground">BetValuator Edge</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your quantitative sports investment dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" defaultValue="analyst@betvaluator.edge" className="rounded-lg"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="password" className="rounded-lg"/>
              </div>
            </div>
            <Link href="/dashboard" className="mt-6 block">
              <Button className="w-full font-bold rounded-lg" variant="primary">Sign In</Button>
            </Link>
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
