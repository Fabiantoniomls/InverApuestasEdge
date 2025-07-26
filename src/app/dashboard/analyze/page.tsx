
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { QuantitativeAnalysisForm } from "./quantitative-analysis-form"
import { FundamentalAnalysisForm } from "./fundamental-analysis-form"
import { StakingStrategyTable } from "./staking-strategy-table"
import { useLanguage } from "@/context/language-context";
import { SingleMatchAnalysisForm } from "./single-match-analysis-form";
import { BatchValueBetsForm } from "./batch-value-bets-form";
import { ChevronDown } from "lucide-react";

type AnalysisType = 'quantitative' | 'fundamental' | 'single' | 'batch';

export default function AnalyzePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AnalysisType>('quantitative');

  const analysisOptions: { key: AnalysisType; title: string; description: string; form: JSX.Element; }[] = [
    { 
      key: 'quantitative', 
      title: t.quantitativeFootballModeling, 
      description: t.quantitativeDescription,
      form: <QuantitativeAnalysisForm />
    },
    { 
      key: 'fundamental', 
      title: t.fundamentalMatchAnalysis, 
      description: t.fundamentalDescription,
      form: <FundamentalAnalysisForm />
    },
    { 
      key: 'single', 
      title: t.singleMatchAnalysisTitle, 
      description: t.singleMatchAnalysisDescription,
      form: <SingleMatchAnalysisForm />
    },
     { 
      key: 'batch', 
      title: t.batchAnalysisTitle, 
      description: t.batchAnalysisDescription,
      form: <BatchValueBetsForm />
    },
  ];

  const activeAnalysis = analysisOptions.find(opt => opt.key === activeTab) || analysisOptions[0];

  return (
    <div className="p-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{activeAnalysis.title}</h1>
                    <p className="text-gray-500">{activeAnalysis.description}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">
                            Change Mode
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {analysisOptions.map(option => (
                             <DropdownMenuItem key={option.key} onClick={() => setActiveTab(option.key)}>
                                {option.title}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {activeAnalysis.form}
        </div>
        <div className="col-span-1 h-fit">
            <StakingStrategyTable />
        </div>
    </div>
  )
}
