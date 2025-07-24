'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleFundamentalAnalysis, type ActionState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
      {pending ? 'Analyzing...' : 'Run Fundamental Analysis'}
    </Button>
  );
}

export function FundamentalAnalysisForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useFormState(handleFundamentalAnalysis, initialState);
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
            <div>
              <Label htmlFor="matchDescription">Match Description</Label>
              <Input id="matchDescription" name="matchDescription" placeholder="e.g., Man City vs Arsenal" defaultValue="Man City vs Arsenal" />
               {state?.fields?.matchDescription && <p className="mt-1 text-xs text-red-500">{state.fields.matchDescription}</p>}
            </div>
            <div>
              <Label htmlFor="teamAContext">Team A Context (Form, Injuries, etc.)</Label>
              <Textarea id="teamAContext" name="teamAContext" placeholder="Describe Team A's situation..." defaultValue="Strong recent form, but main striker is questionable with a minor injury."/>
               {state?.fields?.teamAContext && <p className="mt-1 text-xs text-red-500">{state.fields.teamAContext}</p>}
            </div>
            <div>
              <Label htmlFor="teamBContext">Team B Context (Form, Injuries, etc.)</Label>
              <Textarea id="teamBContext" name="teamBContext" placeholder="Describe Team B's situation..." defaultValue="Inconsistent form, but have a good head-to-head record against Team A. Fully fit squad."/>
               {state?.fields?.teamBContext && <p className="mt-1 text-xs text-red-500">{state.fields.teamBContext}</p>}
            </div>
        </div>
      
       <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold">Market Odds</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             <div>
              <Label htmlFor="oddsTeamA">Team A Win Odds</Label>
              <Input id="oddsTeamA" name="oddsTeamA" type="number" step="0.01" placeholder="e.g., 1.85" defaultValue="1.85"/>
              {state?.fields?.oddsTeamA && <p className="mt-1 text-xs text-red-500">{state.fields.oddsTeamA}</p>}
            </div>
            <div>
              <Label htmlFor="oddsDraw">Draw Odds</Label>
              <Input id="oddsDraw" name="oddsDraw" type="number" step="0.01" placeholder="e.g., 3.50" defaultValue="3.50"/>
              {state?.fields?.oddsDraw && <p className="mt-1 text-xs text-red-500">{state.fields.oddsDraw}</p>}
            </div>
            <div>
              <Label htmlFor="oddsTeamB">Team B Win Odds</Label>
              <Input id="oddsTeamB" name="oddsTeamB" type="number" step="0.01" placeholder="e.g., 4.20" defaultValue="4.20"/>
              {state?.fields?.oddsTeamB && <p className="mt-1 text-xs text-red-500">{state.fields.oddsTeamB}</p>}
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
