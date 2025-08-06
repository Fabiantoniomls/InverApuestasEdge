
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Users,
  Search,
  BarChart,
  Receipt,
  FlaskConical,
  LogOut,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageProvider } from '@/context/language-context';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/partidos', label: 'Explorar Partidos', icon: Search },
    { href: '/dashboard/analyze', label: 'Mis Análisis', icon: BarChart },
    { href: '/dashboard/ledger', label: 'Mis Apuestas', icon: Receipt },
    { href: '/dashboard/simulator', label: 'Simulador', icon: FlaskConical },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#121212] text-[#E0E0E0]">
        <aside className="sticky top-0 hidden h-screen w-64 flex-col justify-between bg-[#1E1E1E] p-4 lg:flex">
            <div>
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white">BetValuator</h1>
                    <span className="text-sm text-gray-400">Edge</span>
                </div>
                <nav className="space-y-2">
                     {navLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard');
                        return (
                             <Link key={link.label} href={link.href} className={cn(
                                 "flex items-center p-3 text-gray-300 rounded-lg",
                                 isActive ? "bg-blue-500/10 text-blue-400 border-l-4 border-blue-500" : "hover:bg-gray-700"
                              )}>
                                <Icon className="mr-3 h-5 w-5" />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="space-y-2">
                 <Link href="/dashboard/profile" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
                    <Avatar className="w-8 h-8 mr-3">
                        <AvatarImage src="https://placehold.co/32x32.png" alt="User" data-ai-hint="user avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span>John Doe</span>
                </Link>
                 <Link href="/" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                </Link>
            </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-8 bg-[#121212]">
          <LanguageProvider>
            {children}
          </LanguageProvider>
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
      <DashboardLayout>{children}</DashboardLayout>
  )
}
