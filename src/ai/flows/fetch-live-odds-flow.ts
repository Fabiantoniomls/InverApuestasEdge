'use server';
/**
 * @fileOverview A Genkit flow to fetch the daily schedule of sports events from Sportradar.
 * 
 * - fetchDailySchedule - A function that retrieves the schedule for a given sport and date range.
 * - FetchDailyScheduleInput - The input type for the function.
 * - FetchDailyScheduleOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { format, addDays } from 'date-fns';

// --- Schemas based on Sportradar API ---

const SportEventSchema = z.object({
    id: z.string(),
    scheduled: z.string(), // Changed from start_time
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

const DailyScheduleSchema = z.object({
    sport_events: z.array(SportEventSchema),
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

const FetchDailyScheduleInputSchema = z.object({
  sport: z.string().describe('The sport to fetch, e.g., "soccer".'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
export type FetchDailyScheduleInput = z.infer<typeof FetchDailyScheduleInputSchema>;

const FetchDailyScheduleOutputSchema = z.object({
    matches: z.array(SportEventSchema).describe('An array of scheduled matches from Sportradar.'),
});
export type FetchDailyScheduleOutput = z.infer<typeof FetchDailyScheduleOutputSchema>;


// --- Exported Wrapper Function ---
export async function fetchDailySchedule(input: FetchDailyScheduleInput): Promise<FetchDailyScheduleOutput> {
  return fetchDailyScheduleFlow(input);
}


// --- The Genkit Flow ---
const fetchDailyScheduleFlow = ai.defineFlow(
  {
    name: 'fetchDailyScheduleFlow',
    inputSchema: FetchDailyScheduleInputSchema,
    outputSchema: FetchDailyScheduleOutputSchema,
  },
  async ({ sport }) => {
    const apiKey = process.env.SPORTRADAR_API_KEY;
    if (!apiKey) {
      throw new Error('SPORTRADAR_API_KEY is not configured in environment variables.');
    }
    
    // Fetch schedule for the next 7 days
    const today = new Date();
    const dates = Array.from({ length: 7 }).map((_, i) => format(addDays(today, i), 'yyyy-MM-dd'));

    const allScheduledEvents: z.infer<typeof SportEventSchema>[] = [];

    for (const date of dates) {
        const apiUrl = `https://api.sportradar.com/soccer/trial/v4/en/schedules/${date}/schedule.json`;
        
        try {
            const response = await fetch(apiUrl, { 
                headers: { 'x-api-key': apiKey, 'accept': 'application/json' },
                cache: 'no-store' 
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`[fetchDailySchedule] API Warning for date ${date}: ${response.status} ${response.statusText} - ${errorText}`);
                continue; // Skip to the next day on error
            }

            const data = await response.json();
            const validatedData = DailyScheduleSchema.safeParse(data);

            if (!validatedData.success) {
                console.warn(`[fetchDailySchedule] Zod validation warning for date ${date} (non-fatal):`, validatedData.error.issues);
                continue;
            }
            
            allScheduledEvents.push(...validatedData.data.sport_events);

        } catch (e: any) {
            console.warn(`[fetchDailySchedule] Exception for date ${date}: ${e.message}`);
            continue;
        }
    }
    
    return { matches: allScheduledEvents };
  }
);
