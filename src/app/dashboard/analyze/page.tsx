
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <CardTitle className="font-headline">{activeAnalysis.title}</CardTitle>
                            <CardDescription className="mt-1">
                            {activeAnalysis.description}
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Change Mode
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {analysisOptions.map(option => (
                                     <DropdownMenuItem key={option.key} onClick={() => setActiveTab(option.key)}>
                                        {option.title}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    {activeAnalysis.form}
                </CardContent>
            </Card>
        </div>
        <div className="w-full lg:w-1/3">
            <StakingStrategyTable />
        </div>
    </div>
  )
}
