
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  Users2,
  HelpCircle,
  BarChart,
  Receipt,
  Scaling,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage, LanguageProvider } from '@/context/language-context';

const navLinks = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/analyze', label: 'Mis Análisis', icon: BarChart },
    { href: '/dashboard/ledger', label: 'Mis Apuestas', icon: Receipt },
    { href: '/dashboard/community', label: 'Comunidad', icon: Users2 },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
]

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {t} = useLanguage();

  return (
    <div className="relative flex min-h-screen w-full bg-gray-100">
        <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
            <div>
                <div className="p-6 flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                        <Scaling className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-blue-600">BetValuator</h1>
                </div>
                <nav className="mt-6">
                     {navLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    "flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100",
                                    isActive && "text-blue-600 bg-blue-50 rounded-lg"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className={cn("ml-4", isActive && "font-semibold")}>{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="p-6">
                <Button variant="outline" className="w-full justify-start gap-3 mb-4">
                    <HelpCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Ayuda y Soporte</span>
                </Button>
                 <Link href="/dashboard/profile">
                    <div className="flex items-center">
                        <Avatar className="size-10">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>
                        <span className="ml-3 font-semibold text-gray-600">Cerrar Sesión</span>
                    </div>
                </Link>
            </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </main>
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
