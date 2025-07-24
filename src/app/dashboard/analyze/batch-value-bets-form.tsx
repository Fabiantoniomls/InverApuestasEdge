'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleCalculateBatchValueBets, type ActionState } from './actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ResultsDisplay } from './results-display';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-bold">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Analyzing...' : 'Run Batch Analysis'}
    </Button>
  );
}

export function BatchValueBetsForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useFormState(handleCalculateBatchValueBets, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.issues ? 'Error' : 'Success',
        description: state.message,
        variant: state.issues ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-8">
        <div className="space-y-4">
            <div>
              <Label htmlFor="matchesText">Match List</Label>
              <Textarea 
                id="matchesText" 
                name="matchesText" 
                placeholder="Paste a list of matches here, one per line. e.g.&#10;Man City vs Arsenal, Odds: 1.8, 3.5, 4.0&#10;Liverpool vs Chelsea, Odds: 2.1, 3.2, 3.1"
                rows={8}
                defaultValue="Adrian Mannarino 1.80 vs Valentin Royer 2.10\nNovak Djokovic 1.50 vs Carlos Alcaraz 2.50\nCoric, Borna 2.3 vs Navone, Mariano 1.62"
              />
               {state?.fields?.matchesText && <p className="mt-1 text-xs text-red-500">{state.fields.matchesText}</p>}
            </div>
             <div>
                <Label htmlFor="sportKey">Sport</Label>
                <Input id="sportKey" name="sportKey" placeholder="e.g., tennis_atp_wimbledon" defaultValue="tennis_atp_wimbledon" />
                {state?.fields?.sportKey && <p className="mt-1 text-xs text-red-500">{state.fields.sportKey}</p>}
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
