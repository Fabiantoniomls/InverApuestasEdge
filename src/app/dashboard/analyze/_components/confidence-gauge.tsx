
'use client';

import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConfidenceGaugeProps {
  value: number;
}

export function ConfidenceGauge({ value }: ConfidenceGaugeProps) {
  const circumference = 2 * Math.PI * 45; // 2 * pi * r
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value >= 80) return 'stroke-success';
    if (value >= 60) return 'stroke-warning';
    return 'stroke-destructive';
  };
  
  const getTextColor = () => {
    if (value >= 80) return 'fill-success';
    if (value >= 60) return 'fill-warning';
    return 'fill-destructive';
  }

  // A real implementation would get this from the analysis payload
  const tooltipContent = (
    <div className="text-sm p-1">
        <p className="font-bold mb-2">Confianza del Análisis: {value}/100</p>
        <ul className="space-y-1">
            <li className="flex items-center gap-2"><span className="text-green-400">●</span> Fuente de Datos: Fiable</li>
            <li className="flex items-center gap-2"><span className="text-green-400">●</span> Completitud de Datos: Alta</li>
            <li className="flex items-center gap-2"><span className="text-green-400">●</span> Modelo Aplicado: Poisson-xG</li>
            <li className="flex items-center gap-2"><span className="text-yellow-400">●</span> Frescura de Datos: Reciente</li>
        </ul>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative h-28 w-28 cursor-help">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="stroke-current text-muted/30"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                className={`transform -rotate-90 origin-center transition-all duration-500 ${getColor()}`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
               {/* Text */}
               <text x="50" y="55" textAnchor="middle" className={`text-3xl font-bold ${getTextColor()}`}>
                 {value}
               </text>
                 <text x="50" y="70" textAnchor="middle" className="text-xs fill-muted-foreground">
                 Confianza
               </text>
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
