
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/sidebar';
import {
    Activity,
    Trophy,
    Flame,
    Globe,
    Flag
} from 'lucide-react';


export default function PartidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultCollapsed={false}>
        <div className="flex h-full">
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-between p-1">
                    <h2 className="font-bold text-lg group-data-[collapsible=icon]:hidden">
                        Filtros
                    </h2>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <Collapsible defaultOpen>
                            <CollapsibleTrigger className='w-full'>
                                <SidebarMenuButton tooltip="Destacados" isActive>
                                    <Flame />
                                    Destacados
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarInset>
                                    <SidebarMenuButton tooltip="Valor > 10%">Valor &gt; 10%</SidebarMenuButton>
                                    <SidebarMenuButton tooltip="Cuotas Bajas (<1.5)">Cuotas Bajas (&lt;1.5)</SidebarMenuButton>
                                </SidebarInset>
                            </CollapsibleContent>
                         </Collapsible>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                         <Collapsible>
                            <CollapsibleTrigger className='w-full'>
                                <SidebarMenuButton tooltip="Deportes">
                                    <Trophy />
                                    Deportes
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                             <CollapsibleContent>
                                <SidebarInset>
                                    <SidebarMenuButton tooltip="Fútbol">Fútbol</SidebarMenuButton>
                                    <SidebarMenuButton tooltip="Tenis">Tenis</SidebarMenuButton>
                                </SidebarInset>
                            </CollapsibleContent>
                         </Collapsible>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                         <Collapsible>
                            <CollapsibleTrigger className='w-full'>
                                <SidebarMenuButton tooltip="Países">
                                    <Globe />
                                    Países
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                             <CollapsibleContent>
                                <SidebarInset>
                                    <SidebarMenuButton tooltip="España">España</SidebarMenuButton>
                                    <SidebarMenuButton tooltip="Inglaterra">Inglaterra</SidebarMenuButton>
                                </SidebarInset>
                            </CollapsibleContent>
                         </Collapsible>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                         <Collapsible defaultOpen>
                            <CollapsibleTrigger className='w-full'>
                                <SidebarMenuButton tooltip="Ligas Populares">
                                    <Activity />
                                    Ligas Populares
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarInset>
                                    <SidebarMenuButton tooltip="La Liga">La Liga</SidebarMenuButton>
                                    <SidebarMenuButton tooltip="Premier League">Premier League</SidebarMenuButton>
                                </SidebarInset>
                            </CollapsibleContent>
                         </Collapsible>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
        </div>
    </SidebarProvider>
  );
}
