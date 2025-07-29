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


type AnalysisMode = 'quantitative' | 'fundamental' | 'single' | 'batch' | 'image';

export default function AnalyzePage() {
  const [mode, setMode] = React.useState<AnalysisMode>('quantitative');
  const { t } = useLanguage();

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
      default:
        return <QuantitativeAnalysisForm />;
    }
  };

  const analysisOptions = {
    quantitative: {
      title: t.quantitativeFootballModeling,
      description: t.quantitativeDescription,
    },
    fundamental: {
      title: t.fundamentalMatchAnalysis,
      description: t.fundamentalDescription,
    },
    single: {
        title: t.singleMatchAnalysisTitle,
        description: t.singleMatchAnalysisDescription,
    },
    batch: {
        title: t.batchAnalysisTitle,
        description: t.batchAnalysisDescription,
    },
    image: {
        title: "Análisis desde Imagen",
        description: "Sube una captura de pantalla de las cuotas y la IA las extraerá por ti.",
    }
  };


  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <div className="col-span-full">
                <Select value={mode} onValueChange={(value) => setMode(value as AnalysisMode)}>
                    <SelectTrigger className="w-full md:w-1/2 lg:w-1/3">
                        <SelectValue placeholder="Select analysis mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="quantitative">{t.quantitativeAnalysis}</SelectItem>
                        <SelectItem value="fundamental">{t.fundamentalAnalysis}</SelectItem>
                        <SelectItem value="single">{t.singleMatchAnalysis}</SelectItem>
                        <SelectItem value="batch">{t.batchAnalysis}</SelectItem>
                        <SelectItem value="image">Análisis desde Imagen</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            </div>
            {renderForm()}
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <StakingStrategyReference 
                title={analysisOptions[mode].title} 
                description={analysisOptions[mode].description} 
            />
        </div>
    </div>
  );
}
