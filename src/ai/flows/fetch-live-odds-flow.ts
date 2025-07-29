
'use server';
/**
 * @fileOverview A Genkit flow to fetch live sports odds from The Odds API.
 * 
 * - fetchLiveOdds - A function that retrieves live odds for a given sport.
 * - FetchLiveOddsInput - The input type for the function.
 * - FetchLiveOddsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- Input Schema ---
const FetchLiveOddsInputSchema = z.object({
  sport: z.string().describe('The sport key to fetch odds for (e.g., soccer_spain_la_liga).'),
  regions: z.string().optional().default('eu').describe('The regions to fetch odds from (e.g., us, uk, eu, au).'),
  markets: z.string().optional().default('h2h').describe('The markets to fetch (e.g., h2h, spreads, totals).'),
});
export type FetchLiveOddsInput = z.infer<typeof FetchLiveOddsInputSchema>;

// --- Output Schema ---
const BookmakerSchema = z.object({
    key: z.string(),
    title: z.string(),
    last_update: z.number(),
    markets: z.array(z.object({
        key: z.string(),
        last_update: z.number(),
        outcomes: z.array(z.object({
            name: z.string(),
            price: z.number(),
        })),
    })).optional(), // Made markets optional to handle variations
});

const MatchOddsSchema = z.object({
  id: z.string(),
  sport_key: z.string(),
  sport_title: z.string(),
  commence_time: z.string(),
  home_team: z.string(),
  away_team: z.string(),
  bookmakers: z.array(BookmakerSchema),
});

const FetchLiveOddsOutputSchema = z.object({
    matches: z.array(MatchOddsSchema).describe('An array of live matches with odds from various bookmakers.'),
});
export type FetchLiveOddsOutput = z.infer<typeof FetchLiveOddsOutputSchema>;

// --- Exported Wrapper Function ---
export async function fetchLiveOdds(input: FetchLiveOddsInput): Promise<FetchLiveOddsOutput> {
  return fetchLiveOddsFlow(input);
}


// --- The Genkit Flow ---
const fetchLiveOddsFlow = ai.defineFlow(
  {
    name: 'fetchLiveOddsFlow',
    inputSchema: FetchLiveOddsInputSchema,
    outputSchema: FetchLiveOddsOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      throw new Error('THE_ODDS_API_KEY is not configured in environment variables.');
    }

    const { sport, regions, markets } = input;
    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=${regions}&markets=${markets}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch live odds: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      const validatedData = z.array(MatchOddsSchema).safeParse(data);

      if (!validatedData.success) {
        // Log the validation error for debugging but don't crash.
        // This can happen if the API response structure changes unexpectedly.
        console.warn("Zod validation warning (non-fatal):", validatedData.error.issues);
        // Return an empty list to prevent the app from crashing.
        return { matches: [] };
      }

      return { matches: validatedData.data };

    } catch (error) {
      console.error('Error in fetchLiveOddsFlow:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
);
