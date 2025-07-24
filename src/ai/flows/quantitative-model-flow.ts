'use server';

/**
 * @fileOverview Calculates match outcome probabilities using a Poisson-xG hybrid model.
 *
 * - quantitativeModel - A function that calculates match outcome probabilities.
 * - QuantitativeModelInput - The input type for the quantitativeModel function.
 * - QuantitativeModelOutput - The return type for the quantitativeModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuantitativeModelInputSchema = z.object({
  teamA_data: z.object({
    homeGoalsFor: z.number(),
    homeGoalsAgainst: z.number(),
    homeXGFor: z.number(),
    homeXGAgainst: z.number(),
    awayGoalsFor: z.number(),
    awayGoalsAgainst: z.number(),
    awayXGFor: z.number(),
    awayXGAgainst: z.number(),
  }),
  teamB_data: z.object({
    homeGoalsFor: z.number(),
    homeGoalsAgainst: z.number(),
    homeXGFor: z.number(),
    homeXGAgainst: z.number(),
    awayGoalsFor: z.number(),
    awayGoalsAgainst: z.number(),
    awayXGFor: z.number(),
    awayXGAgainst: z.number(),
  }),
  leagueAverages: z.object({
    homeGoals: z.number(),
    awayGoals: z.number(),
  }),
});
export type QuantitativeModelInput = z.infer<typeof QuantitativeModelInputSchema>;

const QuantitativeModelOutputSchema = z.object({
  homeWin: z.number(),
  draw: z.number(),
  awayWin: z.number(),
});
export type QuantitativeModelOutput = z.infer<typeof QuantitativeModelOutputSchema>;

export async function quantitativeModel(input: QuantitativeModelInput): Promise<QuantitativeModelOutput> {
  return quantitativeModelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quantitativeModelPrompt',
  input: {schema: QuantitativeModelInputSchema},
  output: {schema: QuantitativeModelOutputSchema},
  prompt: `You are a sports analyst specializing in predicting football match outcomes. You will use the provided team statistics and league averages to calculate the probabilities for a home win, draw, and away win.

Team A Statistics:
Home Goals For: {{{teamA_data.homeGoalsFor}}}
Home Goals Against: {{{teamA_data.homeGoalsAgainst}}}
Home xG For: {{{teamA_data.homeXGFor}}}
Home xG Against: {{{teamA_data.homeXGAgainst}}}
Away Goals For: {{{teamA_data.awayGoalsFor}}}
Away Goals Against: {{{teamA_data.awayGoalsAgainst}}}
Away xG For: {{{teamA_data.awayXGFor}}}
Away xG Against: {{{teamA_data.awayXGAgainst}}}

Team B Statistics:
Home Goals For: {{{teamB_data.homeGoalsFor}}}
Home Goals Against: {{{teamB_data.homeGoalsAgainst}}}
Home xG For: {{{teamB_data.homeXGFor}}}
Home xG Against: {{{teamB_data.homeXGAgainst}}}
Away Goals For: {{{teamB_data.awayGoalsFor}}}
Away Goals Against: {{{teamB_data.awayGoalsAgainst}}}
Away xG For: {{{teamB_data.awayXGFor}}}
Away xG Against: {{{teamB_data.awayXGAgainst}}}

League Averages:
Home Goals: {{{leagueAverages.homeGoals}}}
Away Goals: {{{leagueAverages.awayGoals}}}

Based on this information, calculate the probabilities for a home win, draw, and away win. Return the probabilities as a JSON object.
`,
});

const quantitativeModelFlow = ai.defineFlow(
  {
    name: 'quantitativeModelFlow',
    inputSchema: QuantitativeModelInputSchema,
    outputSchema: QuantitativeModelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
