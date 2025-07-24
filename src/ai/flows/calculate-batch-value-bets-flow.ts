'use server';
/**
 * @fileOverview A Genkit flow for analyzing a batch of matches from a single text input.
 * This flow acts as an orchestrator, first extracting matches, then analyzing them in parallel.
 * It includes usage control based on user subscription tiers.
 *
 * - calculateBatchValueBets - Analyzes a list of matches and returns structured JSON data for each.
 * - CalculateBatchValueBetsInput - Input type for the flow.
 * - CalculateBatchValueBetsOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getUserIdFromSession } from '@/app/actions/auth.actions';
import { extractMatches } from './extract-matches-flow';
import { analyzeSingleMatch } from './analyze-single-match-flow';
import { AnalyzeSingleMatchOutput, AnalyzeSingleMatchOutputSchema } from '../schemas';
import type { UserProfile } from '@/lib/types';
import '@/lib/firebase-admin';

const CalculateBatchValueBetsInputSchema = z.object({
  matchesText: z.string().describe('A block of text containing multiple match details, each on a new line or separated clearly.'),
  sportKey: z.string().optional().describe('The sport context to aid analysis, e.g., tennis_atp_wimbledon.'),
});
export type CalculateBatchValueBetsInput = z.infer<typeof CalculateBatchValueBetsInputSchema>;

const CalculateBatchValueBetsOutputSchema = z.object({
  analyzedMatches: z.array(AnalyzeSingleMatchOutputSchema).describe('An array of structured analysis objects, one for each match found in the text.'),
});
export type CalculateBatchValueBetsOutput = z.infer<typeof CalculateBatchValueBetsOutputSchema>;

export async function calculateBatchValueBets(input: CalculateBatchValueBetsInput): Promise<CalculateBatchValueBetsOutput> {
  return calculateBatchValueBetsFlow(input);
}

const calculateBatchValueBetsFlow = ai.defineFlow(
  {
    name: 'calculateBatchValueBetsFlow',
    inputSchema: CalculateBatchValueBetsInputSchema,
    outputSchema: CalculateBatchValueBetsOutputSchema,
  },
  async (input) => {
    const db = getFirestore();
    
    // 1. Authenticate user
    const userId = await getUserIdFromSession();
    if (!userId) {
        throw new Error('AUTH_ERROR: Usuario no autenticado.');
    }
    
    const userProfileRef = db.collection('users').doc(userId);
    let analysisResults: AnalyzeSingleMatchOutput[] = [];

    // 2. Run analysis within a transaction to check quota and update count
    await db.runTransaction(async (transaction) => {
        const userProfileDoc = await transaction.get(userProfileRef);
        if (!userProfileDoc.exists) {
            // If the profile doesn't exist, create it for the demo
            console.log(`Creating mock user profile for ${userId}`);
            transaction.set(userProfileRef, {
                uid: userId,
                email: 'analyst@betvaluator.edge',
                is_premium: false,
                analysisCount: 0,
                analysisLimit: 10,
            });
        }
        
        const userDoc = (await transaction.get(userProfileRef)).data() as UserProfile;

        // 3. Check usage quota
        const isPremium = userDoc.is_premium || false;
        const analysisCount = userDoc.analysisCount || 0; 
        const analysisLimit = userDoc.analysisLimit || 10; // Default limit for free users
        
        if (!isPremium && analysisCount >= analysisLimit) {
             throw new Error('QUOTA_EXCEEDED: Has alcanzado tu límite de análisis en lote. Actualiza a Premium para análisis ilimitados.');
        }

        // 4. Perform the core logic (scatter-gather)
        const { matches } = await extractMatches({ matchesText: input.matchesText });
        
        if(matches.length === 0) {
          analysisResults = [];
          return;
        }

        const analysisPromises = matches.map(match => analyzeSingleMatch({ match }));
        analysisResults = await Promise.all(analysisPromises);
        
        // 5. Update user's analysis count if they are not premium
        if (!isPremium) {
            transaction.update(userProfileRef, {
                analysisCount: FieldValue.increment(1)
            });
        }
    });

    // 6. Return results
    return { analyzedMatches: analysisResults };
  }
);
