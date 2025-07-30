
'use server';
/**
 * @fileOverview A Genkit flow to fetch live odds, process them, and store them in Firestore.
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
    const homeCompetitor = apiMatch.sport_event.competitors.find(c => c.qualifier === 'home');
    const awayCompetitor = apiMatch.sport_event.competitors.find(c => c.qualifier === 'away');

    if (!homeCompetitor || !awayCompetitor) return null;

    const homeTeam: Team = { id: homeCompetitor.id, name: homeCompetitor.name, logoUrl: 'https://placehold.co/40x40.png' };
    const awayTeam: Team = { id: awayCompetitor.id, name: awayCompetitor.name, logoUrl: 'https://placehold.co/40x40.png' };
    
    const league: League = { 
        id: apiMatch.sport_event.sport_event_context.competition.id,
        name: apiMatch.sport_event.sport_event_context.competition.name,
        country: apiMatch.sport_event.sport_event_context.category.name,
        sportId: 'soccer',
        logoUrl: '' 
    };
    
    let h2h_odds: { '1'?: number; 'X'?: number; '2'?: number; } = {};
    const moneylineMarket = apiMatch.markets?.find(m => m.name.toLowerCase() === '3-way moneyline');
    if (moneylineMarket) {
        h2h_odds['1'] = moneylineMarket.outcomes.find(o => o.name.toLowerCase() === 'home team')?.odds;
        h2h_odds['2'] = moneylineMarket.outcomes.find(o => o.name.toLowerCase() === 'away team')?.odds;
        h2h_odds['X'] = moneylineMarket.outcomes.find(o => o.name.toLowerCase() === 'draw')?.odds;
    }

    const hasValue = Math.random() > 0.8;
    const valueScore = hasValue ? Math.random() * 0.15 : 0;
    const explanations = ["Desajuste de la línea de mercado con nuestro modelo.", "Rendimiento reciente del equipo infravalorado por el mercado.", "Anomalía detectada en el movimiento de la línea de cuotas."];

    return {
        id: apiMatch.sport_event.id,
        league: {
            name: league.name,
            country: league.country,
            logoUrl: league.logoUrl,
        },
        eventTimestamp: new Date(apiMatch.sport_event.start_time).getTime(),
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
    console.log('Starting match update flow using Sportradar...');

    // Fetch all available soccer matches from Sportradar
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
