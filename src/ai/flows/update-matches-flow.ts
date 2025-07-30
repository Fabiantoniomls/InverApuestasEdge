
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
import { SOCCER_LEAGUES } from './_data/leagues';

const UpdateMatchesOutputSchema = z.object({
  success: z.boolean(),
  matchesUpdated: z.number(),
});
export type UpdateMatchesOutput = z.infer<typeof UpdateMatchesOutputSchema>;


// Helper function to transform API data into our internal Match type
function transformApiMatch(apiMatch: FetchLiveOddsOutput['matches'][0]): Match {
    const leagueInfo = SOCCER_LEAGUES.find(l => l.id === apiMatch.sport_key) || { name: apiMatch.sport_title, country: 'Unknown', logoUrl: '' };

    const homeTeam: Team = { id: apiMatch.home_team, name: apiMatch.home_team, logoUrl: 'https://placehold.co/40x40.png' };
    const awayTeam: Team = { id: apiMatch.away_team, name: apiMatch.away_team, logoUrl: 'https://placehold.co/40x40.png' };
    
    const league: League = { 
        id: apiMatch.sport_key, 
        name: leagueInfo.name, 
        country: leagueInfo.country, 
        sportId: 'soccer',
        logoUrl: leagueInfo.logoUrl 
    };
    
    // Find best odds for h2h and totals
    let h2h_odds: { '1'?: number; 'X'?: number; '2'?: number; } = {};
    apiMatch.bookmakers?.forEach(bookmaker => {
        bookmaker.markets?.forEach(market => {
            if (market.key === 'h2h') {
                const home = market.outcomes.find(o => o.name === apiMatch.home_team)?.price;
                const away = market.outcomes.find(o => o.name === apiMatch.away_team)?.price;
                const draw = market.outcomes.find(o => o.name === 'Draw')?.price;
                if (home && (!h2h_odds['1'] || home > h2h_odds['1'])) h2h_odds['1'] = home;
                if (away && (!h2h_odds['2'] || away > h2h_odds['2'])) h2h_odds['2'] = away;
                if (draw && (!h2h_odds['X'] || draw > h2h_odds['X'])) h2h_odds['X'] = draw;
            }
        });
    });

    return {
        id: apiMatch.id,
        league: league,
        eventTimestamp: new Date(apiMatch.commence_time).getTime(),
        teams: {
            home: homeTeam,
            away: awayTeam,
        },
        mainOdds: h2h_odds,
        valueMetrics: {
            hasValue: Math.random() > 0.8, // Simulate value finding
            market: 'Home Win',
            valueScore: Math.random() * 0.15, // Placeholder for value score
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
    console.log('Starting match update flow...');

    const apiPromises = SOCCER_LEAGUES.map(league => fetchLiveOdds({
        sport: league.id,
        regions: 'eu',
        markets: 'h2h',
    }));

    const results = await Promise.all(apiPromises);
    const allMatchesFromApi = results.flatMap(result => result.matches);
    const transformedMatches = allMatchesFromApi.map(transformApiMatch);

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
