
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageProvider, useLanguage } from '@/context/language-context';

const navLinks = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/analyze', label: 'Mis Análisis', icon: BarChart },
    { href: '/dashboard/ledger', label: 'Mis Apuestas', icon: Receipt },
    { href: '/dashboard/community', label: 'Comunidad', icon: Users2 },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {t} = useLanguage();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
        <aside className="w-64 bg-white p-6 flex flex-col justify-between h-screen sticky top-0 shadow-md">
            <div>
                <div className="text-2xl font-bold text-blue-600 mb-10">
                    BetValuator
                </div>
                <nav className="space-y-4">
                     {navLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                             <Link key={link.label} href={link.href} className={cn("flex items-center p-2 rounded-lg", isActive ? "text-blue-600 bg-blue-50 font-semibold" : "text-gray-500 hover:text-gray-900")}>
                                <Icon className="mr-3" />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="space-y-4">
                 <Link href="#" className="flex items-center text-gray-500 hover:text-gray-900">
                    <HelpCircle className="mr-3" />
                    Ayuda y Soporte
                </Link>
                 <Link href="/dashboard/profile" className="flex items-center text-gray-500 hover:text-gray-900">
                    <Avatar className="w-8 h-8 mr-3">
                        <AvatarImage src="https://placehold.co/32x32.png" alt="User" data-ai-hint="user avatar" />
                        <AvatarFallback>N</AvatarFallback>
                    </Avatar>
                    Cerrar Sesión
                </Link>
            </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
            {children}
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
