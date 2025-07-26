
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
  Beaker,
  User,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageProvider } from '@/context/language-context';

const navLinks = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/analyze', label: 'Mis Análisis', icon: BarChart },
    { href: '/dashboard/ledger', label: 'Mis Apuestas', icon: Receipt },
    { href: '/dashboard/simulator', label: 'Simulador', icon: Beaker },
    { href: '/dashboard/profile', label: 'Mi Perfil', icon: User },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
        <aside className="w-64 bg-white p-6 flex flex-col justify-between h-screen sticky top-0 shadow-md">
            <div>
                <div className="flex items-center space-x-3 p-2 mb-8">
                  <div className="bg-blue-500 p-2 rounded-lg">
                      <Scaling className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-blue-600">BetValuator</h1>
                </div>
                <nav className="space-y-4">
                     {navLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                             <Link key={link.label} href={link.href} className={cn("flex items-center p-2 rounded-lg text-gray-500", isActive ? "text-blue-600 bg-blue-50 font-semibold" : "hover:text-gray-900")}>
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
        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
    </div>
  );
}


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <LanguageProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </LanguageProvider>
  )
}
