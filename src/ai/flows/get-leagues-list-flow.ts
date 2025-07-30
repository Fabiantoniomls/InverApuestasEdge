
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
import { SOCCER_LEAGUES, TENNIS_LEAGUES } from './_data/leagues';

const GetLeaguesListInputSchema = z.object({
    sport: z.enum(['soccer', 'tennis']).optional().default('soccer'),
});

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

export async function getLeaguesList(input: z.infer<typeof GetLeaguesListInputSchema>): Promise<GetLeaguesListOutput> {
  return getLeaguesListFlow(input);
}

const getLeaguesListFlow = ai.defineFlow(
  {
    name: 'getLeaguesListFlow',
    inputSchema: GetLeaguesListInputSchema,
    outputSchema: GetLeaguesListOutputSchema,
  },
  async ({ sport }) => {
    let allLeagues: any[] = [];
    if (sport === 'soccer') {
        allLeagues = SOCCER_LEAGUES;
    } else if (sport === 'tennis') {
        allLeagues = TENNIS_LEAGUES;
    }
    
    return { leagues: allLeagues.map(l => ({...l, sportId: l.sportKey })) };
  }
);
