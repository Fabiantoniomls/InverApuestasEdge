'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleQuantitativeAnalysis, type ActionState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ResultsDisplay } from './results-display';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-bold">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Analyzing...' : 'Run Quantitative Analysis'}
    </Button>
  );
}

export function QuantitativeAnalysisForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useFormState(handleQuantitativeAnalysis, initialState);
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
    <form action={formAction} className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold">Team Data</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="teamA">Team A</Label>
              <Input id="teamA" name="teamA" placeholder="e.g., Manchester City" defaultValue="Manchester City" />
              {state?.fields?.teamA && <p className="mt-1 text-xs text-red-500">{state.fields.teamA}</p>}
            </div>
             <div>
              <Label htmlFor="teamB">Team B</Label>
              <Input id="teamB" name="teamB" placeholder="e.g., Liverpool" defaultValue="Liverpool"/>
               {state?.fields?.teamB && <p className="mt-1 text-xs text-red-500">{state.fields.teamB}</p>}
            </div>
             <div>
              <Label htmlFor="teamAUrl">Team A Data Source (URL)</Label>
              <Input id="teamAUrl" name="teamAUrl" placeholder="https://fbref.com/..." defaultValue="https://fbref.com/en/squads/b8fd03ef/Manchester-City-Stats" />
              {state?.fields?.teamAUrl && <p className="mt-1 text-xs text-red-500">{state.fields.teamAUrl}</p>}
            </div>
            <div>
              <Label htmlFor="teamBUrl">Team B Data Source (URL)</Label>
              <Input id="teamBUrl" name="teamBUrl" placeholder="https://fbref.com/..." defaultValue="https://fbref.com/en/squads/822bd0ba/Liverpool-Stats"/>
              {state?.fields?.teamBUrl && <p className="mt-1 text-xs text-red-500">{state.fields.teamBUrl}</p>}
            </div>
        </div>
      </div>
       <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold">League Averages</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="leagueHomeAvg">Avg. Home Goals</Label>
              <Input id="leagueHomeAvg" name="leagueHomeAvg" type="number" step="0.01" placeholder="e.g., 1.55" defaultValue="1.55" />
              {state?.fields?.leagueHomeAvg && <p className="mt-1 text-xs text-red-500">{state.fields.leagueHomeAvg}</p>}
            </div>
             <div>
              <Label htmlFor="leagueAwayAvg">Avg. Away Goals</Label>
              <Input id="leagueAwayAvg" name="leagueAwayAvg" type="number" step="0.01" placeholder="e.g., 1.25" defaultValue="1.25" />
              {state?.fields?.leagueAwayAvg && <p className="mt-1 text-xs text-red-500">{state.fields.leagueAwayAvg}</p>}
            </div>
        </div>
      </div>

       <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold">Market Odds & Staking</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             <div>
              <Label htmlFor="oddsHome">Home Win Odds</Label>
              <Input id="oddsHome" name="oddsHome" type="number" step="0.01" placeholder="e.g., 1.85" defaultValue="1.85"/>
              {state?.fields?.oddsHome && <p className="mt-1 text-xs text-red-500">{state.fields.oddsHome}</p>}
            </div>
            <div>
              <Label htmlFor="oddsDraw">Draw Odds</Label>
              <Input id="oddsDraw" name="oddsDraw" type="number" step="0.01" placeholder="e.g., 3.50" defaultValue="3.50"/>
              {state?.fields?.oddsDraw && <p className="mt-1 text-xs text-red-500">{state.fields.oddsDraw}</p>}
            </div>
            <div>
              <Label htmlFor="oddsAway">Away Win Odds</Label>
              <Input id="oddsAway" name="oddsAway" type="number" step="0.01" placeholder="e.g., 4.20" defaultValue="4.20"/>
              {state?.fields?.oddsAway && <p className="mt-1 text-xs text-red-500">{state.fields.oddsAway}</p>}
            </div>
            <div className="md:col-span-1.5">
              <Label htmlFor="bankroll">Bankroll (€)</Label>
              <Input id="bankroll" name="bankroll" type="number" step="10" placeholder="e.g., 10000" defaultValue="10000"/>
              {state?.fields?.bankroll && <p className="mt-1 text-xs text-red-500">{state.fields.bankroll}</p>}
            </div>
            <div className="md:col-span-1.5">
              <Label htmlFor="stakingStrategy">Staking Strategy</Label>
              <Select name="stakingStrategy" defaultValue="QuarterKelly">
                <SelectTrigger>
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
