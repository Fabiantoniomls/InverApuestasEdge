
'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AnalysisSetupCard } from "./analysis-setup-card";
import { ModelSelectionCard } from "./model-selection-card";
import { ResultsCard } from "./results-card";
import { RiskManagementCard } from "./risk-management-card";

export default function AnalyzePage() {
  
  // Mock data for results display
  const mockResults = {
    probabilities: {
      home: 45,
      draw: 25,
      away: 30,
    },
    valueBets: [
      {
        market: "Victoria Local",
        ev: 20.5,
        odds: 2.1,
        probability: 45
      },
    ]
  };
  
  // Mock state for form, would be handled by a state manager or form library
  const isAnalyzed = true; 

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Centro de Análisis</h1>
          <p className="text-muted-foreground">
            Crea, analiza y ejecuta tus estrategias de inversión deportiva desde un único lugar.
          </p>
        </div>
        <Button size="lg">
          <PlusCircle className="mr-2" />
          Crear Nuevo Análisis
        </Button>
      </div>

      <form className="space-y-6">
        <AnalysisSetupCard />
        <ModelSelectionCard />
        
        {/* Conditional rendering based on whether analysis has been run */}
        {isAnalyzed ? (
          <>
            <ResultsCard results={mockResults} />
            <RiskManagementCard />
          </>
        ) : (
          <div className="flex justify-end">
              <Button type="submit" size="lg" className="bg-foreground hover:bg-foreground/90">
                Ejecutar Análisis
              </Button>
          </div>
        )}
      </form>
    </div>
  );
}
