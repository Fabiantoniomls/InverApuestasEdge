
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuantitativeAnalysisForm } from "./quantitative-analysis-form"
import { FundamentalAnalysisForm } from "./fundamental-analysis-form"
import { StakingStrategyTable } from "./staking-strategy-table"
import { useLanguage } from "@/context/language-context";
import { SingleMatchAnalysisForm } from "./single-match-analysis-form";
import { BatchValueBetsForm } from "./batch-value-bets-form";

export default function AnalyzePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
            <Tabs defaultValue="quantitative">
               <div className="mb-4">
                 <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="quantitative">{t.quantitativeAnalysis}</TabsTrigger>
                    <TabsTrigger value="fundamental">{t.fundamentalAnalysis}</TabsTrigger>
                    <TabsTrigger value="single">{t.singleMatchAnalysis}</TabsTrigger>
                    <TabsTrigger value="batch">{t.batchAnalysis}</TabsTrigger>
                  </TabsList>
               </div>
              <TabsContent value="quantitative">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">{t.quantitativeFootballModeling}</CardTitle>
                    <CardDescription>
                      {t.quantitativeDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QuantitativeAnalysisForm />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="fundamental">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">{t.fundamentalMatchAnalysis}</CardTitle>
                    <CardDescription>
                      {t.fundamentalDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FundamentalAnalysisForm />
                  </CardContent>
                </Card>
              </TabsContent>
               <TabsContent value="single">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">{t.singleMatchAnalysisTitle}</CardTitle>
                    <CardDescription>
                      {t.singleMatchAnalysisDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SingleMatchAnalysisForm />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="batch">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">{t.batchAnalysisTitle}</CardTitle>
                    <CardDescription>
                      {t.batchAnalysisDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BatchValueBetsForm />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
        <div className="w-full lg:w-1/3">
            <StakingStrategyTable />
        </div>
    </div>
  )
}
