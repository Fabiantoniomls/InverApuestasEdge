'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/language-context';
import { QuantitativeAnalysisForm } from './quantitative-analysis-form';
import { FundamentalAnalysisForm } from './fundamental-analysis-form';
import { SingleMatchAnalysisForm } from './single-match-analysis-form';
import { BatchValueBetsForm } from './batch-value-bets-form';
import { ImageAnalysisForm } from './image-analysis-form';
import { StakingStrategyReference } from './staking-strategy-reference';
import { LiveOddsForm } from './live-odds-form';
import { useSearchParams } from 'next/navigation';


type AnalysisMode = 'quantitative' | 'fundamental' | 'single' | 'batch' | 'image' | 'live-odds';

const analysisOptions = {
    quantitative: {
      title: "Análisis Cuantitativo de Fútbol",
      description: "Usa el modelo híbrido Poisson-xG para encontrar apuestas de valor en los mercados de fútbol.",
    },
    fundamental: {
      title: "Análisis Fundamental de Partido",
      description: "Realiza un análisis cualitativo para Fútbol o Tenis basado en factores contextuales y estadísticos que introduzcas manualmente.",
    },
    single: {
        title: "Análisis Rápido de Partido Individual",
        description: "Pega los detalles de un partido para un análisis rápido y una recomendación de apuesta de valor.",
    },
    batch: {
        title: "Buscador de Apuestas de Valor por Lotes",
        description: "Pega una lista de partidos para analizarlos todos en bloque y encontrar apuestas de valor.",
    },
    image: {
        title: "Análisis desde Imagen",
        description: "Sube una captura de pantalla de las cuotas y la IA las extraerá por ti.",
    },
    'live-odds': {
        title: "Cuotas de Apuestas en Vivo",
        description: "Consulta las cuotas en tiempo real de múltiples casas de apuestas para encontrar el mejor precio.",
    }
  };

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode') as AnalysisMode | null;
  const [mode, setMode] = React.useState<AnalysisMode>(modeParam || 'quantitative');
  
  React.useEffect(() => {
    if (modeParam && modeParam !== mode) {
      setMode(modeParam);
    }
  }, [modeParam, mode]);

  const renderForm = () => {
    switch (mode) {
      case 'quantitative':
        return <QuantitativeAnalysisForm />;
      case 'fundamental':
        return <FundamentalAnalysisForm />;
      case 'single':
        return <SingleMatchAnalysisForm />;
      case 'batch':
        return <BatchValueBetsForm />;
      case 'image':
        return <ImageAnalysisForm />;
      case 'live-odds':
        return <LiveOddsForm />;
      default:
        return <QuantitativeAnalysisForm />;
    }
  };

  return (
    <div className="space-y-8">
        <header>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{analysisOptions[mode].title}</h1>
            <p className="mt-1 text-muted-foreground">{analysisOptions[mode].description}</p>
        </header>

        <div className="grid flex-1 items-start gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <div className="col-span-full">
                    <Select value={mode} onValueChange={(value) => setMode(value as AnalysisMode)}>
                        <SelectTrigger className="w-full md:w-1/2 lg:w-2/3">
                            <SelectValue placeholder="Select analysis mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="quantitative">Análisis Cuantitativo (Auto)</SelectItem>
                            <SelectItem value="fundamental">Análisis Fundamental (Manual)</SelectItem>
                            <SelectItem value="single">Análisis de Partido Individual (Texto)</SelectItem>
                            <SelectItem value="batch">Análisis por Lotes (Texto)</SelectItem>
                            <SelectItem value="image">Análisis desde Imagen</SelectItem>
                            <SelectItem value="live-odds">Buscador de Cuotas en Vivo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                {renderForm()}
            </div>
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
                <StakingStrategyReference 
                    title="Referencia de Estrategias" 
                    description="Contexto sobre los modelos y estrategias de gestión de capital utilizadas en la aplicación." 
                />
            </div>
        </div>
    </div>
  );
}
