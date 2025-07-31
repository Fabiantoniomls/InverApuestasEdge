
'use server';
/**
 * @fileOverview A Genkit flow to fetch live odds from The Odds API.
 * This flow serves as a fallback data source.
 * 
 * - fetchTheOddsApi - A function that retrieves live odds for a given sport.
 * - FetchTheOddsApiInput - The input type for the function.
 * - FetchTheOddsApiOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schemas based on The Odds API v4 response
const OutcomeSchema = z.object({
    name: z.string(),
    price: z.number(),
});

const MarketSchema = z.object({
    key: z.string(),
    last_update: z.string(),
    outcomes: z.array(OutcomeSchema),
});

const BookmakerSchema = z.object({
    key: z.string(),
    title: z.string(),
    last_update: z.string(),
    markets: z.array(MarketSchema),
});

const OddsApiMatchSchema = z.object({
    id: z.string(),
    sport_key: z.string(),
    sport_title: z.string(),
    commence_time: z.string(),
    home_team: z.string(),
    away_team: z.string(),
    bookmakers: z.array(BookmakerSchema),
});


// Input and Output Schemas for the Flow
const FetchTheOddsApiInputSchema = z.object({
  sport: z.string().describe('The sport_key from The Odds API (e.g., soccer_epl).'),
});
export type FetchTheOddsApiInput = z.infer<typeof FetchTheOddsApiInputSchema>;

const FetchTheOddsApiOutputSchema = z.array(OddsApiMatchSchema);
export type FetchTheOddsApiOutput = z.infer<typeof FetchTheOddsApiOutputSchema>;


// Exported Wrapper Function
export async function fetchTheOddsApi(input: FetchTheOddsApiInput): Promise<FetchTheOddsApiOutput> {
  return fetchTheOddsApiFlow(input);
}


const fetchTheOddsApiFlow = ai.defineFlow(
  {
    name: 'fetchTheOddsApiFlow',
    inputSchema: FetchTheOddsApiInputSchema,
    outputSchema: FetchTheOddsApiOutputSchema,
  },
  async ({ sport }) => {
    const apiKey = process.env.THE_ODDS_API_KEY;
    if (!apiKey || apiKey === "YOUR_API_KEY") {
      throw new Error('THE_ODDS_API_KEY is not configured in environment variables.');
    }
    
    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h&oddsFormat=decimal`;

    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[fetchTheOddsApiFlow] API Error: ${response.status} ${response.statusText} - ${errorText}`);
        throw new Error(`Failed to fetch odds from The Odds API: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response data against the Zod schema
    const validatedData = FetchTheOddsApiOutputSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("[fetchTheOddsApiFlow] Zod validation error:", validatedData.error.issues);
        throw new Error("Invalid data structure received from The Odds API.");
    }
    
    return validatedData.data;
  }
);
