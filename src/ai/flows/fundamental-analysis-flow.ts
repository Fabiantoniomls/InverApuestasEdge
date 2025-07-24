'use server';

/**
 * @fileOverview Performs qualitative analysis of a match based on contextual factors and user-provided odds.
 *
 * - fundamentalAnalysis - A function that handles the qualitative analysis process.
 * - FundamentalAnalysisInput - The input type for the fundamentalAnalysis function.
 * - FundamentalAnalysisOutput - The return type for the fundamentalAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FundamentalAnalysisInputSchema = z.object({
  matchDescription: z.string().describe('Description of the match.'),
  teamAContext: z.string().describe('Contextual factors for Team A (e.g., form, injuries).'),
  teamBContext: z.string().describe('Contextual factors for Team B (e.g., form, injuries).'),
  oddsTeamA: z.number().describe('Decimal odds for Team A winning.'),
  oddsTeamB: z.number().describe('Decimal odds for Team B winning.'),
  oddsDraw: z.number().optional().describe('Decimal odds for a draw (if applicable).'),
});
export type FundamentalAnalysisInput = z.infer<typeof FundamentalAnalysisInputSchema>;

const FundamentalAnalysisOutputSchema = z.object({
  analysis: z.string().describe('Qualitative analysis of the match.'),
  teamAProbability: z.number().describe('Estimated probability of Team A winning (0-1).'),
  teamBProbability: z.number().describe('Estimated probability of Team B winning (0-1).'),
  drawProbability: z.number().optional().describe('Estimated probability of a draw (0-1, if applicable).'),
  valueTeamA: z.number().describe('Calculated value for betting on Team A.'),
  valueTeamB: z.number().describe('Calculated value for betting on Team B.'),
  valueDraw: z.number().optional().describe('Calculated value for betting on a draw (if applicable).'),
});
export type FundamentalAnalysisOutput = z.infer<typeof FundamentalAnalysisOutputSchema>;

export async function fundamentalAnalysis(input: FundamentalAnalysisInput): Promise<FundamentalAnalysisOutput> {
  return fundamentalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fundamentalAnalysisPrompt',
  input: {schema: FundamentalAnalysisInputSchema},
  output: {schema: FundamentalAnalysisOutputSchema},
  prompt: `You are an expert sports analyst specializing in qualitative match analysis.

You will receive contextual information about two teams or players, along with the betting odds for each outcome.

Based on the provided information, you will perform a qualitative analysis of the match, estimate the probabilities of each outcome, and calculate the betting value for each outcome.

Match Description: {{{matchDescription}}}
Team A Context: {{{teamAContext}}}
Team B Context: {{{teamBContext}}}
Odds Team A: {{{oddsTeamA}}}
Odds Team B: {{{oddsTeamB}}}
{{#if oddsDraw}}Odds Draw: {{{oddsDraw}}}{{/if}}

First, provide a detailed qualitative analysis of the match, considering all provided factors.

Then, estimate the probabilities (as decimals between 0 and 1) for Team A winning, Team B winning, and a draw (if applicable). Ensure the probabilities sum to 1 (or close to 1 due to rounding).

Finally, calculate the value for each outcome using the following formula:
Value = (Probability * Odds) - 1

Return the analysis, probabilities, and values in the specified JSON format.
`,
});

const fundamentalAnalysisFlow = ai.defineFlow(
  {
    name: 'fundamentalAnalysisFlow',
    inputSchema: FundamentalAnalysisInputSchema,
    outputSchema: FundamentalAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
