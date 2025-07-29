
'use server';
/**
 * @fileOverview A Genkit flow to get a list of available leagues.
 * In a real application, this would fetch from a database or a live API.
 * For this prototype, it returns a hardcoded list of major leagues.
 *
 * - getLeaguesList - A function that returns a list of leagues.
 * - GetLeaguesListOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { leagues as mockLeagues } from './_data/mock-data';

const GetLeaguesListOutputSchema = z.object({
    leagues: z.array(z.object({
        id: z.string(),
        name: z.string(),
        country: z.string(),
        sportId: z.string(),
        logoUrl: z.string().optional(),
    }))
});

export type GetLeaguesListOutput = z.infer<typeof GetLeaguesListOutputSchema>;

export async function getLeaguesList(): Promise<GetLeaguesListOutput> {
  return getLeaguesListFlow();
}

const getLeaguesListFlow = ai.defineFlow(
  {
    name: 'getLeaguesListFlow',
    inputSchema: z.void(),
    outputSchema: GetLeaguesListOutputSchema,
  },
  async () => {
    // In a real-world scenario, you might fetch this from a database
    // or The Odds API's /sports endpoint. For the prototype, we use mock data.
    return { leagues: mockLeagues };
  }
);
