
'use server';
/**
 * @fileOverview A Genkit flow to get a filtered, sorted, and paginated list of matches.
 * This flow acts as an orchestrator with a fallback mechanism. It first tries to fetch
 * data from Sportradar, and if that fails, it falls back to The Odds API.
 * 
 * - getMatches - A function that returns a list of matches based on filters.
 * - GetMatchesInput - The input type for the function.
 * - GetMatchesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { GetMatchesResponse, Match, League, Team } from '@/lib/types';
import { fetchLiveOdds } from './fetch-live-odds-flow';
import type { FetchLiveOddsOutput as SportradarOutputType } from './fetch-live-odds-flow';
import { fetchTheOddsApi, FetchTheOddsApiOutput as TheOddsApiMatch } from './fetch-the-odds-api-flow';

const GetMatchesInputSchema = z.object({
    leagues: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minValue: z.number().optional(),
    minOdds: z.number().optional(),
    maxOdds: z.number().optional(),
    markets: z.array(z.string()).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
});

export type GetMatchesInput = z.infer<typeof GetMatchesInputSchema>;

export async function getMatches(input: GetMatchesInput): Promise<GetMatchesResponse> {
  return getMatchesFlow(input);
}


function transformSportradarMatch(apiMatch: SportradarOutputType['matches'][0]): Match | null {
    const homeCompetitor = apiMatch.competitors.find(c => c.qualifier === 'home');
    const awayCompetitor = apiMatch.competitors.find(c => c.qualifier === 'away');

    if (!homeCompetitor || !awayCompetitor) return null;

    const homeTeam: Team = { id: homeCompetitor.id, name: homeCompetitor.name, logoUrl: 'https://placehold.co/40x40.png' };
    const awayTeam: Team = { id: awayCompetitor.id, name: awayCompetitor.name, logoUrl: 'https://placehold.co/40x40.png' };
    
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
            id: apiMatch.sport_event_context.competition.id,
            name: apiMatch.sport_event_context.competition.name,
            country: apiMatch.sport_event_context.category.name,
            logoUrl: '',
        },
        eventTimestamp: new Date(apiMatch.scheduled).getTime() / 1000,
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

function transformTheOddsApiMatch(apiMatch: TheOddsApiMatch[0]): Match {
     const homeTeam: Team = { name: apiMatch.home_team, logoUrl: 'https://placehold.co/40x40.png' };
     const awayTeam: Team = { name: apiMatch.away_team, logoUrl: 'https://placehold.co/40x40.png' };

    // Find the h2h odds from a bookmaker
    const bookmaker = apiMatch.bookmakers?.find(b => b.markets.some(m => m.key === 'h2h'));
    const h2hMarket = bookmaker?.markets.find(m => m.key === 'h2h');
    const homeOdds = h2hMarket?.outcomes.find(o => o.name === apiMatch.home_team)?.price;
    const awayOdds = h2hMarket?.outcomes.find(o => o.name === apiMatch.away_team)?.price;
    const drawOdds = h2hMarket?.outcomes.find(o => o.name === 'Draw')?.price;

    return {
        id: apiMatch.id,
        league: {
            id: apiMatch.sport_key,
            name: apiMatch.sport_title,
            country: '',
            logoUrl: '',
        },
        eventTimestamp: new Date(apiMatch.commence_time).getTime() / 1000,
        teams: { home: homeTeam, away: awayTeam },
        mainOdds: {
            '1': homeOdds,
            'X': drawOdds,
            '2': awayOdds,
        },
        liveStatus: 'pre-match',
    };
}

const getMatchesFlow = ai.defineFlow(
  {
    name: 'getMatchesFlow',
    inputSchema: GetMatchesInputSchema,
    outputSchema: z.any(), // Using any because GetMatchesResponse is complex
  },
  async (filters) => {
    let allMatches: Match[] = [];

    try {
        console.log("Attempting to fetch matches from Sportradar...");
        const { matches: sportradarMatches } = await fetchLiveOdds({ sport: 'soccer' });
        allMatches = sportradarMatches
            .map(transformSportradarMatch)
            .filter((match): match is Match => match !== null);
        console.log(`Successfully fetched ${allMatches.length} matches from Sportradar.`);

    } catch (error: any) {
        console.warn(`[getMatchesFlow] Sportradar fetch failed: ${error.message}. Falling back to The Odds API.`);
        
        try {
            const theOddsApiMatches = await fetchTheOddsApi({ sport: 'soccer_epl' }); // Default to a popular league
            allMatches = theOddsApiMatches.map(transformTheOddsApiMatch);
             console.log(`Successfully fetched ${allMatches.length} matches from The Odds API.`);
        } catch (fallbackError: any) {
             console.error(`[getMatchesFlow] Fallback to The Odds API also failed: ${fallbackError.message}.`);
             // Return empty response if both fail
             return {
                data: [],
                totalMatches: 0,
                totalPages: 0,
                currentPage: filters.page || 1,
            };
        }
    }
        
    // Default sorting by date if no other sort is specified
    allMatches.sort((a, b) => {
        if (!a.eventTimestamp || !b.eventTimestamp) return 0;
        return a.eventTimestamp - b.eventTimestamp
    });
        
    // Apply filters on the server
    let filteredMatches = allMatches;

    if (filters.leagues && filters.leagues.length > 0) {
        const leagueSet = new Set(filters.leagues);
        filteredMatches = filteredMatches.filter(match => leagueSet.has(match.league.id));
    }
    if (filters.startDate) {
      filteredMatches = filteredMatches.filter(match => new Date(match.eventTimestamp * 1000) >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      filteredMatches = filteredMatches.filter(match => new Date(match.eventTimestamp * 1000) <= new Date(filters.endDate!));
    }
    if (filters.minValue) {
      filteredMatches = filteredMatches.filter(match => (match.valueMetrics?.valueScore || 0) >= filters.minValue!);
    }
    if (filters.minOdds && filters.markets?.includes('1')) {
        filteredMatches = filteredMatches.filter(match => (match.mainOdds?.[1] || Infinity) >= filters.minOdds!);
    }
    if (filters.maxOdds && filters.markets?.includes('1')) {
        filteredMatches = filteredMatches.filter(match => (match.mainOdds?.[1] || 0) <= filters.maxOdds!);
    }

    // Sorting logic
    if (filters.sortBy && filters.sortBy !== 'eventTimestamp') {
        filteredMatches.sort((a, b) => {
            let aVal, bVal;

            if (filters.sortBy === 'valueMetrics.valueScore') {
                aVal = a.valueMetrics?.valueScore ?? 0;
                bVal = b.valueMetrics?.valueScore ?? 0;
            } else {
                aVal = (a as any)[filters.sortBy!] ?? 0;
                bVal = (b as any)[filters.sortBy!] ?? 0;
            }

            if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Pagination logic
    const totalMatches = filteredMatches.length;
    const limit = filters.limit ?? 10;
    const page = filters.page ?? 1;
    const totalPages = Math.ceil(totalMatches / limit);
    const startIndex = (page - 1) * limit;
    const paginatedMatches = filteredMatches.slice(startIndex, startIndex + limit);

    return {
      data: paginatedMatches,
      totalMatches,
      totalPages,
      currentPage: page,
    };
  }
);
