
'use server';
/**
 * @fileOverview A Genkit flow to fetch daily schedules, process them, and store them in Firestore.
 * This acts as a background job to populate our match database.
 * 
 * - updateMatches - Fetches matches from the API and saves them to the 'matches' collection.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import type { Match, Team, League } from '@/lib/types';
import { fetchLiveOdds, FetchLiveOddsOutput } from './fetch-live-odds-flow';

const UpdateMatchesOutputSchema = z.object({
  success: z.boolean(),
  matchesUpdated: z.number(),
});
export type UpdateMatchesOutput = z.infer<typeof UpdateMatchesOutputSchema>;


// Helper function to transform Sportradar API data into our internal Match type
function transformApiMatch(apiMatch: FetchLiveOddsOutput['matches'][0]): Match | null {
    const homeCompetitor = apiMatch.competitors.find(c => c.qualifier === 'home');
    const awayCompetitor = apiMatch.competitors.find(c => c.qualifier === 'away');

    if (!homeCompetitor || !awayCompetitor) return null;

    const homeTeam: Team = { id: homeCompetitor.id, name: homeCompetitor.name, logoUrl: 'https://placehold.co/40x40.png' };
    const awayTeam: Team = { id: awayCompetitor.id, name: awayCompetitor.name, logoUrl: 'https://placehold.co/40x40.png' };
    
    const league: League = { 
        id: apiMatch.sport_event_context.competition.id,
        name: apiMatch.sport_event_context.competition.name,
        country: apiMatch.sport_event_context.category.name,
        sportId: 'soccer',
        logoUrl: '' 
    };
    
    // Simulate odds as they don't come from the daily schedule endpoint
    let h2h_odds: { '1'?: number; 'X'?: number; '2'?: number; } = {
        '1': parseFloat((Math.random() * (3.5 - 1.5) + 1.5).toFixed(2)),
        'X': parseFloat((Math.random() * (4.0 - 2.8) + 2.8).toFixed(2)),
        '2': parseFloat((Math.random() * (5.0 - 1.8) + 1.8).toFixed(2)),
    };

    const hasValue = Math.random() > 0.8;
    const valueScore = hasValue ? Math.random() * 0.15 : 0;
    const explanations = ["Desajuste de la línea de mercado con nuestro modelo.", "Rendimiento reciente del equipo infravalorado por el mercado.", "Anomalía detectada en el movimiento de la línea de cuotas."];

    return {
        id: apiMatch.id,
        league: {
            name: league.name,
            country: league.country,
            logoUrl: league.logoUrl,
        },
        eventTimestamp: new Date(apiMatch.scheduled).getTime(),
        teams: {
            home: homeTeam,
            away: awayTeam,
        },
        mainOdds: h2h_odds,
        valueMetrics: {
            hasValue,
            market: hasValue ? 'Home Win' : 'N/A',
            valueScore,
            explanation: hasValue ? explanations[Math.floor(Math.random() * explanations.length)] : undefined,
        },
        liveStatus: 'pre-match',
    };
}


const updateMatchesFlow = ai.defineFlow(
  {
    name: 'updateMatchesFlow',
    inputSchema: z.void(),
    outputSchema: UpdateMatchesOutputSchema,
  },
  async () => {
    console.log('Starting match update flow using Sportradar daily schedule...');

    // Fetch all available soccer matches from Sportradar for the next 7 days
    const { matches: allMatchesFromApi } = await fetchLiveOdds({ sport: 'soccer' });
    const transformedMatches = allMatchesFromApi.map(transformApiMatch).filter((m): m is Match => m !== null);

    if (transformedMatches.length === 0) {
      console.log('No matches found to update.');
      return { success: true, matchesUpdated: 0 };
    }

    // Use a Firestore batch write to update all matches atomically
    const batch = db.batch();
    transformedMatches.forEach(match => {
        const matchRef = db.collection('matches').doc(match.id);
        batch.set(matchRef, match, { merge: true }); // Use merge to avoid overwriting existing fields unnecessarily
    });

    await batch.commit();

    console.log(`Successfully updated ${transformedMatches.length} matches in Firestore.`);

    return {
      success: true,
      matchesUpdated: transformedMatches.length,
    };
  }
);

export async function updateMatches(): Promise<UpdateMatchesOutput> {
    return await updateMatchesFlow();
}
