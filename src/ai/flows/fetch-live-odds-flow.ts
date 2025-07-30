
'use server';
/**
 * @fileOverview A Genkit flow to fetch live sports odds from Sportradar.
 * 
 * - fetchLiveOdds - A function that retrieves live odds for a given sport.
 * - FetchLiveOddsInput - The input type for the function.
 * - FetchLiveOddsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- Schemas based on Sportradar API ---

const SportEventSchema = z.object({
    id: z.string(),
    start_time: z.string(),
    sport_event_context: z.object({
        sport: z.object({ id: z.string(), name: z.string() }),
        category: z.object({ id: z.string(), name: z.string() }),
        competition: z.object({ id: z.string(), name: z.string() }),
    }),
    competitors: z.array(z.object({
        id: z.string(),
        name: z.string(),
        qualifier: z.string(), // "home" or "away"
    })),
});

const MarketSchema = z.object({
    name: z.string(),
    outcomes: z.array(z.object({
        name: z.string(),
        odds: z.number(),
    })),
});

const SportEventWithOddsSchema = z.object({
    sport_event: SportEventSchema,
    markets: z.array(MarketSchema).optional(),
});


// --- Input and Output Schemas for the Flow ---

const FetchLiveOddsInputSchema = z.object({
  sport: z.string().describe('The sport to fetch, e.g., "soccer". The flow will map this to the Sportradar competition IDs.'),
  // Sportradar's live schedule API is less granular than The Odds API.
  // We fetch a schedule and then filter.
});
export type FetchLiveOddsInput = z.infer<typeof FetchLiveOddsInputSchema>;

const FetchLiveOddsOutputSchema = z.object({
    matches: z.array(SportEventWithOddsSchema).describe('An array of live matches with odds from Sportradar.'),
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
    const apiKey = process.env.SPORTRADAR_API_KEY;
    if (!apiKey) {
      throw new Error('SPORTRADAR_API_KEY is not configured in environment variables.');
    }

    // Sportradar API calls are often structured around sports, not specific leagues for schedules.
    // We'll fetch a general soccer schedule and let the consuming flows filter.
    const apiUrl = `https://api.sportradar.com/soccer/trial/v4/en/schedules/live/schedule.json?api_key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, { cache: 'no-store' });

      if (!response.ok) {
        const errorText = await response.text();
        // Log the detailed error on the server for debugging
        console.error(`[fetchLiveOddsFlow] API Error: ${response.status} ${response.statusText} - ${errorText}`);
        // Throw a cleaner error to the client
        throw new Error(`Failed to fetch live odds: ${response.statusText}`);
      }

      const data = await response.json();

      // Sportradar returns an object with a `schedules` property
      const schedules = data.schedules || [];
      const validatedData = z.array(SportEventWithOddsSchema).safeParse(schedules);

      if (!validatedData.success) {
        console.warn("[fetchLiveOddsFlow] Zod validation warning (non-fatal):", validatedData.error.issues);
        return { matches: [] };
      }

      return { matches: validatedData.data };

    } catch (e: any) {
        console.error(`[fetchLiveOddsFlow] Exception: ${e.message}`);
        throw new Error(`An error occurred while fetching odds from Sportradar: ${e.message}`);
    }
  }
);
