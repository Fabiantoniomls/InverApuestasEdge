
'use server';
/**
 * @fileOverview A Genkit flow to get a list of available leagues from Sportradar.
 * This flow fetches all active sports/leagues and groups them.
 *
 * - getLeaguesList - A function that returns a list of leagues for a given sport.
 * - GetLeaguesListOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CompetitionFromApiSchema = z.object({
    id: z.string(),
    name: z.string(),
    gender: z.string().optional(),
    category: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

const GetLeaguesListInputSchema = z.object({
    sportGroup: z.enum(['soccer', 'tennis', 'basketball', 'tennis_atp', 'tennis_wta']).optional().default('soccer'),
});

const GetLeaguesListOutputSchema = z.object({
    leagues: z.array(z.object({
        id: z.string(),
        name: z.string(),
        country: z.string().optional().default(''), 
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
    const apiKey = process.env.SPORTRADAR_API_KEY;
    if (!apiKey) {
      throw new Error('SPORTRADAR_API_KEY is not configured in environment variables.');
    }
    
    // Handle different tennis keys
    let sportPath = sportGroup;
    if (sportGroup === 'tennis_atp' || sportGroup === 'tennis_wta') {
        sportPath = 'tennis';
    }

    // Sportradar endpoint to get all competitions for a sport
    const apiUrl = `https://api.sportradar.com/${sportPath}/trial/v4/en/competitions.json`;

    try {
        const response = await fetch(apiUrl, { 
            headers: { 'x-api-key': apiKey, 'accept': 'application/json' },
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch competitions list: ${response.statusText}`);
        }

        const apiResponse: { competitions: z.infer<typeof CompetitionFromApiSchema>[] } = await response.json();
        
        const mappedLeagues = apiResponse.competitions.map(comp => ({
            id: comp.id,
            name: `${comp.category.name}: ${comp.name}`,
            sportId: sportGroup,
            country: comp.category.name, 
            logoUrl: '', // Sportradar competitions endpoint doesn't provide logos
        }));

        return { leagues: mappedLeagues };

    } catch (error) {
        console.error("Error fetching leagues from Sportradar API:", error);
        return { leagues: [] }; // Return empty on error
    }
  }
);
