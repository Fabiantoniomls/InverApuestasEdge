
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  Users,
  Wallet,
  Scaling
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage, LanguageProvider } from '@/context/language-context';

const navLinks = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/analyze', label: 'Mis Análisis', icon: Scaling },
    { href: '/dashboard/ledger', label: 'Registro', icon: Wallet },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
]

function Header() {
    const pathname = usePathname();
     const { t, setLanguage, language } = useLanguage();

    return (
       <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-white px-10 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-4 text-primary">
                <Scaling className="size-6 text-primary" />
                <h2 className="text-foreground text-xl font-bold leading-tight tracking-tighter"> BetValuator Edge </h2>
            </div>
            <nav className="hidden md:flex flex-1 justify-center gap-8">
                {navLinks.map(link => (
                    <Link 
                        key={link.label} 
                        href={link.href} 
                        className={cn(
                            "text-sm font-medium leading-normal transition-colors",
                            pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {link.label === 'Mis Análisis' ? t.analyze : link.label}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary text-muted-foreground hover:bg-gray-200 hover:text-foreground">
                    <Bell className="text-xl" />
                </Button>
                <Avatar className="size-10 border-2 border-primary">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                    <AvatarFallback>SR</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-white sm:flex">
                <nav className="flex flex-col gap-8 p-6">
                     <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold"
                        >
                        <Scaling className="h-8 w-8 text-blue-500" />
                        <h1 className="text-xl font-bold text-primary">
                            BetValuator
                        </h1>
                    </Link>
                    {navLinks.map(link => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary",
                                    pathname === link.href && "bg-secondary text-primary"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>
             <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-72">
                <main className="flex-1 bg-gray-50/50 p-8">
                    <div className="mx-auto w-full max-w-6xl">
                         {children}
                    </div>
                </main>
            </div>
        </div>
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </LanguageProvider>
  )
}
