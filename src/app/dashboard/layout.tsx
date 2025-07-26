
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Scaling
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage, LanguageProvider } from '@/context/language-context';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/analyze', label: 'Mis Análisis' },
    { href: '#', label: 'Comunidad' },
    { href: '#', label: 'Aprender' },
]

function Header() {
    const pathname = usePathname();
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
                            pathname.startsWith(link.href) && link.href !== '#' ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary text-muted-foreground hover:bg-gray-200 hover:text-foreground">
                    <Bell className="text-xl" />
                </Button>
                <Avatar className="size-10 border-2 border-primary">
                    <AvatarImage src="https://placehold.co/40x40" alt="User"/>
                    <AvatarFallback>SR</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}


function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
            <Header />
            <main className="px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-10">
                <div className="layout-content-container flex flex-col w-full max-w-5xl gap-8">
                    {children}
                </div>
            </main>
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
