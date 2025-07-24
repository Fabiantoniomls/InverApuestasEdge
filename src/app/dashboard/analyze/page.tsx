import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuantitativeAnalysisForm } from "./quantitative-analysis-form"
import { FundamentalAnalysisForm } from "./fundamental-analysis-form"
import { StakingStrategyTable } from "./staking-strategy-table"

export default function AnalyzePage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Tabs defaultValue="quantitative">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quantitative">Quantitative Analysis</TabsTrigger>
                <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="quantitative">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Quantitative Football Modeling</CardTitle>
                    <CardDescription>
                      Use the Poisson-xG hybrid model to find value bets in football markets.
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
                    <CardTitle className="font-headline">Fundamental Match Analysis</CardTitle>
                    <CardDescription>
                      Perform qualitative analysis for Football or Tennis based on contextual factors.
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
