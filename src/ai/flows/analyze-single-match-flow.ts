'use server';
/**
 * @fileOverview A Genkit flow for analyzing a single match and returning structured data.
 *
 * - analyzeSingleMatch - A function that handles the single match analysis process.
 * - AnalyzeSingleMatchInput - The input type for the function.
 * - AnalyzeSingleMatchOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';
import { AnalyzeSingleMatchOutput, AnalyzeSingleMatchOutputSchema } from '../schemas';


const AnalyzeSingleMatchInputSchema = z.object({
  match: z.string().describe('The text details for a single sports match.'),
});
export type AnalyzeSingleMatchInput = z.infer<typeof AnalyzeSingleMatchInputSchema>;

export type { AnalyzeSingleMatchOutput };

export async function analyzeSingleMatch(input: AnalyzeSingleMatchInput): Promise<AnalyzeSingleMatchOutput> {
  return analyzeSingleMatchFlow(input);
}

const prompt = ai.definePrompt({
    name: 'analyzeSingleMatchPrompt',
    input: { schema: AnalyzeSingleMatchInputSchema },
    output: { schema: AnalyzeSingleMatchOutputSchema },
    prompt: `You are an expert sports betting analyst. Provide a detailed analysis for the following match:

"{{{match}}}"

Your analysis should include key statistics, a comparison of probabilities versus the given odds, and a determination of whether there is a value bet.
Based on your analysis, populate all fields in the required JSON output, including extracting the odds, setting 'valueBetFound' to true, and providing a 'recommendation' if a value opportunity exists.`,
});

const analyzeSingleMatchFlow = ai.defineFlow(
  {
    name: 'analyzeSingleMatchFlow',
    inputSchema: AnalyzeSingleMatchInputSchema,
    outputSchema: AnalyzeSingleMatchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
