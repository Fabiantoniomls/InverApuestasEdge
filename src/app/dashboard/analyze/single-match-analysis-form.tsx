'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleSingleMatchAnalysis, type ActionState } from './actions';
import { Button } from '@/components/ui/button';
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
      {pending ? 'Analyzing...' : 'Run Single Match Analysis'}
    </Button>
  );
}

export function SingleMatchAnalysisForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useFormState(handleSingleMatchAnalysis, initialState);
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
              <Label htmlFor="match">Match Details</Label>
              <Textarea 
                id="match" 
                name="match" 
                placeholder="e.g., Man City vs Arsenal, Premier League. Odds: Man City 1.85, Draw 3.50, Arsenal 4.20. Man City is in great form..." 
                rows={5}
                defaultValue="Man City vs Arsenal, Premier League. Odds: Man City 1.85, Draw 3.50, Arsenal 4.20. Man City is in great form, but Arsenal has a strong defense. Considering the recent performance, a value bet might be on Arsenal."
              />
               {state?.fields?.match && <p className="mt-1 text-xs text-red-500">{state.fields.match}</p>}
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
