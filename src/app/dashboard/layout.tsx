
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  PlusSquare,
  Bookmark,
  User,
  LogOut,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageProvider } from '@/context/language-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/explore', label: 'Explorar', icon: Search },
    { href: '/dashboard/analyze', label: 'Crear', icon: PlusSquare },
    { href: '/dashboard/ledger', label: 'Mis análisis', icon: Bookmark },
    { href: '/dashboard/profile', label: 'Perfil', icon: User },
]

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="https://placehold.co/48x48" alt="@analyst" />
                        <AvatarFallback>SR</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="text-foreground text-base font-bold leading-normal">Sofia R.</h1>
                        <p className="text-muted-foreground text-sm font-normal leading-normal">@sofia_r</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors text-sm font-medium",
                                    isActive
                                    ? "bg-primary text-primary-foreground font-semibold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
             <Link href="/" className="w-full">
                <Button variant="primary" className="w-full font-bold gap-2">
                    <LogOut className="h-5 w-5"/>
                    Cerrar sesión
                </Button>
            </Link>
        </aside>
        <div className="flex-1 bg-gray-50">
          <main className="p-4 md:p-8">{children}</main>
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
    </Language-Provider>
  )
}
