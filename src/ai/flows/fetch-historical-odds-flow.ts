
'use server';
/**
 * @fileOverview A Genkit flow to fetch historical sports odds from The Odds API.
 * 
 * - fetchHistoricalOdds - A function that retrieves a snapshot of odds for a given sport and date.
 * - FetchHistoricalOddsInput - The input type for the function.
 * - FetchHistoricalOddsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { format } from 'date-fns';

// --- Schemas for the underlying match data (re-used from live odds) ---
const OutcomeSchema = z.object({
    name: z.string(),
    price: z.number(),
    point: z.number().optional(),
});

const MarketSchema = z.object({
    key: z.string(),
    last_update: z.union([z.string(), z.number()]).describe('The last update time for the market.'),
    outcomes: z.array(OutcomeSchema),
});

const BookmakerSchema = z.object({
    key: z.string(),
    title: z.string(),
    last_update: z.union([z.string(), z.number()]).describe('The last update time for the bookmaker.'),
    markets: z.array(MarketSchema).optional(),
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


// --- Input Schema ---
const FetchHistoricalOddsInputSchema = z.object({
  sport: z.string().describe('The sport key to fetch odds for (e.g., soccer_spain_la_liga).'),
  date: z.string().describe("The ISO 8601 timestamp for the data snapshot (e.g., 2021-10-18T12:00:00Z)."),
  regions: z.string().optional().default('eu').describe('The regions to fetch odds from (e.g., us, uk, eu, au).'),
  markets: z.string().optional().default('h2h').describe('The markets to fetch (e.g., h2h, spreads, totals).'),
  dateFormat: z.enum(['iso', 'unix']).optional().describe('The format for timestamps.'),
  oddsFormat: z.enum(['decimal', 'american']).optional().describe('The format for odds.'),
});
export type FetchHistoricalOddsInput = z.infer<typeof FetchHistoricalOddsInputSchema>;


// --- Output Schema (wrapped response) ---
const FetchHistoricalOddsOutputSchema = z.object({
    timestamp: z.string().describe("The timestamp of the returned snapshot."),
    previous_timestamp: z.string().nullable().describe("The previously available timestamp."),
    next_timestamp: z.string().nullable().describe("The next available timestamp."),
    data: z.array(MatchOddsSchema).describe('An array of historical matches with odds from various bookmakers.'),
});
export type FetchHistoricalOddsOutput = z.infer<typeof FetchHistoricalOddsOutputSchema>;

// --- Exported Wrapper Function ---
export async function fetchHistoricalOdds(input: FetchHistoricalOddsInput): Promise<FetchHistoricalOddsOutput> {
  return fetchHistoricalOddsFlow(input);
}


// --- The Genkit Flow ---
const fetchHistoricalOddsFlow = ai.defineFlow(
  {
    name: 'fetchHistoricalOddsFlow',
    inputSchema: FetchHistoricalOddsInputSchema,
    outputSchema: FetchHistoricalOddsOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      throw new Error('THE_ODDS_API_KEY is not configured in environment variables.');
    }

    const { sport, date, regions, markets, dateFormat, oddsFormat } = input;
    
    const queryParams = new URLSearchParams({
        apiKey,
        regions: regions || 'eu',
        markets: markets || 'h2h',
        date: format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    });
    
    if (dateFormat) queryParams.append('dateFormat', dateFormat);
    if (oddsFormat) queryParams.append('oddsFormat', oddsFormat);

    const apiUrl = `https://api.the-odds-api.com/v4/historical/sports/${sport}/odds/?${queryParams.toString()}`;

    try {
      const response = await fetch(apiUrl, { cache: 'no-store' });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch historical odds: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const rawData = await response.json();
      
      const validatedData = FetchHistoricalOddsOutputSchema.safeParse(rawData);

      if (!validatedData.success) {
        console.error("Zod validation error (historical odds):", validatedData.error.issues);
        // Throw an error that the frontend can catch and display
        throw new Error(`Data validation failed: ${validatedData.error.message}`);
      }

      return validatedData.data;

    } catch (error) {
      console.error('Error in fetchHistoricalOddsFlow:', error);
      throw error;
    }
  }
);
