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
    <div className="text-sm">
        <p><strong>Desglose de Confianza:</strong></p>
        <ul className="list-disc pl-4 mt-1">
            <li>Nivel de Fuente: Nivel 1 (100 pts)</li>
            <li>Completitud de Datos: Completo (100 pts)</li>
            <li>Modelo Aplicado: Poisson-xG (100 pts)</li>
            <li>Frescura de Datos: Alta (100 pts)</li>
        </ul>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative h-20 w-20 cursor-help">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="stroke-current text-gray-200"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                className={`transform -rotate-90 origin-center ${getColor()}`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
               {/* Text */}
               <text x="50" y="55" textAnchor="middle" className={`text-2xl font-bold ${getTextColor()}`}>
                 {value}
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
