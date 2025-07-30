'use server';
/**
 * @fileOverview A Genkit flow to get a list of available leagues from The Odds API.
 * This flow fetches all active sports/leagues and groups them.
 *
 * - getLeaguesList - A function that returns a list of leagues for a given sport.
 * - GetLeaguesListOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SportFromApiSchema = z.object({
    key: z.string(),
    group: z.string(),
    title: z.string(),
    description: z.string(),
    active: z.boolean(),
    has_outrights: z.boolean(),
});

const GetLeaguesListInputSchema = z.object({
    sportGroup: z.enum(['soccer', 'tennis_atp', 'tennis_wta', 'basketball']).optional().default('soccer'),
});

const GetLeaguesListOutputSchema = z.object({
    leagues: z.array(z.object({
        id: z.string(),
        name: z.string(),
        country: z.string().optional().default(''), // Country is not provided by this API endpoint
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
  async ({ sportGroup }) => {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      throw new Error('THE_ODDS_API_KEY is not configured in environment variables.');
    }
    
    const apiUrl = `https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl, { 
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sports list: ${response.statusText}`);
        }

        const sportsData: z.infer<typeof SportFromApiSchema>[] = await response.json();
        
        const sportGroupMapping: Record<string, string | null> = {
            'soccer': 'Soccer',
            'tennis_atp': 'Tennis',
            'tennis_wta': 'Tennis',
            'basketball': 'Basketball',
        };

        const targetGroup = sportGroupMapping[sportGroup] || 'Soccer';

        const filteredLeagues = sportsData
            .filter(sport => {
                if (!sport.active || sport.group !== targetGroup) return false;
                if (sportGroup === 'tennis_atp') return sport.key.includes('_atp_');
                if (sportGroup === 'tennis_wta') return sport.key.includes('_wta_');
                return true;
            })
            .map(sport => ({
                id: sport.key,
                name: sport.title,
                sportId: sport.key,
                // These fields are not available from the /sports endpoint, so we set defaults
                country: '', 
                logoUrl: '', 
            }));

        return { leagues: filteredLeagues };

    } catch (error) {
        console.error("Error fetching leagues from API:", error);
        return { leagues: [] }; // Return empty on error
    }
  }
);
