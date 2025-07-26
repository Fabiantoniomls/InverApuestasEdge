
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, ChevronRight, LogOut, RefreshCw, User, Settings as SettingsIcon, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [switches, setSwitches] = React.useState({
    'news-analysis': false,
    'match-updates': true,
    'theme-toggle': false,
  });

  const handleSwitchChange = (id: keyof typeof switches) => {
    setSwitches((prev) => ({ ...prev, [id]: !prev[id] }));
    toast({
      title: '¡Configuración actualizada!',
      description: 'Tus preferencias han sido guardadas.',
    });
  };

  const handleReset = () => {
    setSwitches({
      'news-analysis': false,
      'match-updates': true,
      'theme-toggle': false,
    });
    toast({
      title: '¡Configuración restablecida!',
      description: 'Tus preferencias han vuelto a los valores predeterminados.',
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Configuración
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ajusta tus preferencias para personalizar tu experiencia en la plataforma.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
        <nav className="flex flex-col gap-2">
          <a
            className="rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary"
            href="#notifications"
          >
            Notificaciones
          </a>
          <a
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
            href="#display"
          >
            Visualización
          </a>
          <a
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
            href="#account"
          >
            Cuenta
          </a>
        </nav>
        <div className="space-y-12">
          <section id="notifications">
            <h2 className="text-2xl font-semibold text-primary">
              Preferencias de Notificaciones
            </h2>
            <p className="mt-1 text-muted-foreground">
              Elige qué notificaciones quieres recibir y cómo.
            </p>
            <div className="mt-6 space-y-6 rounded-lg border bg-card p-6 shadow-sm">
              <SettingRow
                title="Alertas de nuevos análisis"
                description="Recibe una notificación cuando se publique un nuevo análisis de partido."
                tooltipContent='Ej: "Nuevo análisis: Real Madrid vs Barcelona"'
              >
                <Switch
                  id="news-analysis"
                  checked={switches['news-analysis']}
                  onCheckedChange={() => handleSwitchChange('news-analysis')}
                />
              </SettingRow>
              <SettingRow
                title="Alertas de partidos en vivo"
                description="Recibe notificaciones sobre los partidos que has marcado como favoritos."
                tooltipContent='Ej: "¡Gol! Manchester United 1-0"'
              >
                <Switch
                  id="match-updates"
                  checked={switches['match-updates']}
                  onCheckedChange={() => handleSwitchChange('match-updates')}
                />
              </SettingRow>
            </div>
          </section>

          <section id="display">
            <h2 className="text-2xl font-semibold text-primary">
              Ajustes de Visualización
            </h2>
            <p className="mt-1 text-muted-foreground">
              Personaliza la apariencia de la plataforma según tus preferencias.
            </p>
            <div className="mt-6 space-y-6 rounded-lg border bg-card p-6 shadow-sm">
              <SettingRow
                title="Modo de visualización"
                tooltipContent="Cambia entre fondos claros y oscuros."
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Claro</span>
                  <Switch
                    id="theme-toggle"
                    checked={switches['theme-toggle']}
                    onCheckedChange={() => handleSwitchChange('theme-toggle')}
                  />
                  <span className="text-sm text-muted-foreground">Oscuro</span>
                </div>
              </SettingRow>
               <SettingRow
                title="Idioma de la Interfaz"
                description="Selecciona el idioma en el que deseas ver la plataforma."
              >
                 <Button variant="outline" className="gap-2">
                    <span className="text-sm font-medium">Español</span>
                    <ChevronRight className="h-4 w-4" />
                 </Button>
              </SettingRow>
            </div>
          </section>

          <section id="account">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary">
                  Gestión de la Cuenta
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Administra tu información personal y la configuración de tu cuenta.
                </p>
              </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                      <span>Restablecer a valores predeterminados</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Restablecer configuración?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que quieres restablecer todas las configuraciones a sus valores predeterminados? Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">Sí, restablecer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="mt-6 space-y-3 rounded-lg border bg-card shadow-sm">
              <AccountLink href="#" title="Editar Perfil" description="Actualiza tu nombre, foto de perfil y otros datos personales." />
              <hr/>
              <AccountLink href="#" title="Centro de Ayuda" description="Encuentra respuestas a tus preguntas y contacta con el soporte." />
               <hr/>
               <button className="w-full flex items-center justify-start gap-3 p-4 text-destructive transition-colors hover:bg-destructive/5">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Cerrar sesión</span>
               </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface SettingRowProps {
    title: string;
    description?: string;
    tooltipContent: string;
    children: React.ReactNode;
}

const SettingRow = ({ title, description, tooltipContent, children }: SettingRowProps) => (
    <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
            <div>
                <p className="font-medium text-foreground">{title}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <HelpCircle className="h-5 w-5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div>
            {children}
        </div>
    </div>
);


interface AccountLinkProps {
    href: string;
    title: string;
    description: string;
}

const AccountLink = ({ href, title, description }: AccountLinkProps) => (
  <a className="flex items-center justify-between p-4 transition-colors hover:bg-accent" href={href}>
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </a>
);
