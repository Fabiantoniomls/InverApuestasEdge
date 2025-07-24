
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuantitativeAnalysisForm } from "./quantitative-analysis-form"
import { FundamentalAnalysisForm } from "./fundamental-analysis-form"
import { StakingStrategyTable } from "./staking-strategy-table"
import { useLanguage } from "@/context/language-context";

export default function AnalyzePage() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Tabs defaultValue="quantitative">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quantitative">{t.quantitativeAnalysis}</TabsTrigger>
                <TabsTrigger value="fundamental">{t.fundamentalAnalysis}</TabsTrigger>
              </TabsList>
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
            </Tabs>
        </div>
        <div className="lg:col-span-1">
            <StakingStrategyTable />
        </div>
    </div>
  )
}
