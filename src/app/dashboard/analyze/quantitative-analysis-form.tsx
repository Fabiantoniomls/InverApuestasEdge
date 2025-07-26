
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { handleQuantitativeAnalysis, type ActionState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ResultsDisplay } from './results-display';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg mt-8 hover:bg-gray-800 transition-colors">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Analyzing...' : 'Run Quantitative Analysis'}
    </Button>
  );
}

export function QuantitativeAnalysisForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useActionState(handleQuantitativeAnalysis, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.issues) {
      toast({
        title: 'Success',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
       <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Data</h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="teamA" className="block text-sm font-medium text-gray-600 mb-1">Team A</Label>
              <Input id="teamA" name="teamA" placeholder="e.g., Manchester City" defaultValue="Manchester City" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              {state?.fields?.teamA && <p className="mt-1 text-xs text-red-500">{state.fields.teamA}</p>}
            </div>
             <div>
              <Label htmlFor="teamB" className="block text-sm font-medium text-gray-600 mb-1">Team B</Label>
              <Input id="teamB" name="teamB" placeholder="e.g., Liverpool" defaultValue="Liverpool" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
               {state?.fields?.teamB && <p className="mt-1 text-xs text-red-500">{state.fields.teamB}</p>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
             <div>
              <Label htmlFor="teamAUrl" className="block text-sm font-medium text-gray-600 mb-1">Team A Data Source (URL)</Label>
              <Input id="teamAUrl" name="teamAUrl" placeholder="https://fbref.com/..." defaultValue="https://fbref.com/en/squads/b8fd03ef/Manchester-City-Stats" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.teamAUrl && <p className="mt-1 text-xs text-red-500">{state.fields.teamAUrl}</p>}
            </div>
            <div>
              <Label htmlFor="teamBUrl" className="block text-sm font-medium text-gray-600 mb-1">Team B Data Source (URL)</Label>
              <Input id="teamBUrl" name="teamBUrl" placeholder="https://fbref.com/..." defaultValue="https://fbref.com/en/squads/822bd0ba/Liverpool-Stats" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.teamBUrl && <p className="mt-1 text-xs text-red-500">{state.fields.teamBUrl}</p>}
            </div>
        </div>
      </div>
       <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">League Averages</h2>
        <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="leagueHomeAvg" className="block text-sm font-medium text-gray-600 mb-1">Avg. Home Goals</Label>
              <Input id="leagueHomeAvg" name="leagueHomeAvg" type="number" step="0.01" placeholder="e.g., 1.55" defaultValue="1.55" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.leagueHomeAvg && <p className="mt-1 text-xs text-red-500">{state.fields.leagueHomeAvg}</p>}
            </div>
             <div>
              <Label htmlFor="leagueAwayAvg" className="block text-sm font-medium text-gray-600 mb-1">Avg. Away Goals</Label>
              <Input id="leagueAwayAvg" name="leagueAwayAvg" type="number" step="0.01" placeholder="e.g., 1.25" defaultValue="1.25" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.leagueAwayAvg && <p className="mt-1 text-xs text-red-500">{state.fields.leagueAwayAvg}</p>}
            </div>
        </div>
      </div>

       <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Market Odds & Staking</h2>
        <div className="grid grid-cols-3 gap-6 mb-6">
             <div>
              <Label htmlFor="oddsHome" className="block text-sm font-medium text-gray-600 mb-1">Home Win Odds</Label>
              <Input id="oddsHome" name="oddsHome" type="number" step="0.01" placeholder="e.g., 1.85" defaultValue="1.85" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.oddsHome && <p className="mt-1 text-xs text-red-500">{state.fields.oddsHome}</p>}
            </div>
            <div>
              <Label htmlFor="oddsDraw" className="block text-sm font-medium text-gray-600 mb-1">Draw Odds</Label>
              <Input id="oddsDraw" name="oddsDraw" type="number" step="0.01" placeholder="e.g., 3.50" defaultValue="3.50" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.oddsDraw && <p className="mt-1 text-xs text-red-500">{state.fields.oddsDraw}</p>}
            </div>
            <div>
              <Label htmlFor="oddsAway" className="block text-sm font-medium text-gray-600 mb-1">Away Win Odds</Label>
              <Input id="oddsAway" name="oddsAway" type="number" step="0.01" placeholder="e.g., 4.20" defaultValue="4.20" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.oddsAway && <p className="mt-1 text-xs text-red-500">{state.fields.oddsAway}</p>}
            </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bankroll" className="block text-sm font-medium text-gray-600 mb-1">Bankroll (€)</Label>
              <Input id="bankroll" name="bankroll" type="number" step="10" placeholder="e.g., 10000" defaultValue="10000" className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
              {state?.fields?.bankroll && <p className="mt-1 text-xs text-red-500">{state.fields.bankroll}</p>}
            </div>
            <div>
              <Label htmlFor="stakingStrategy" className="block text-sm font-medium text-gray-600 mb-1">Staking Strategy</Label>
              <Select name="stakingStrategy" defaultValue="QuarterKelly">
                <SelectTrigger className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none">
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QuarterKelly">Quarter Kelly</SelectItem>
                  <SelectItem value="HalfKelly">Half Kelly</SelectItem>
                  <SelectItem value="FullKelly">Full Kelly</SelectItem>
                  <SelectItem value="Percentage">Percentage (1%)</SelectItem>
                  <SelectItem value="Fixed">Fixed (€10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>
      </div>
      
      {state?.message && state.issues && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />

      {state?.data && <ResultsDisplay result={state.data} />}
    </form>
  );
}
