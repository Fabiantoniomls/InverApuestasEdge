
'use server';
/**
 * @fileOverview A Genkit flow to get a filtered, sorted, and paginated list of matches.
 * This flow fetches the daily schedule from Sportradar and then applies server-side filtering.
 * 
 * - getMatches - A function that returns a list of matches based on filters.
 * - GetMatchesInput - The input type for the function.
 * - GetMatchesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { GetMatchesResponse, Match, League, Team } from '@/lib/types';
import { fetchDailySchedule, FetchDailyScheduleOutput } from './fetch-daily-schedule-flow';
import { TEAM_LOGOS } from './_data/teams';

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

// Helper function to transform Sportradar API data into our internal Match type
function transformApiMatch(apiMatch: FetchDailyScheduleOutput['matches'][0]): Match {
    
    const homeCompetitor = apiMatch.competitors.find(c => c.qualifier === 'home');
    const awayCompetitor = apiMatch.competitors.find(c => c.qualifier === 'away');

    if (!homeCompetitor || !awayCompetitor) {
        // This case should be rare, but we handle it to prevent crashes.
        // We will filter out these incomplete matches later.
        return null as any; 
    }

    const homeTeam: Team = { id: homeCompetitor.id, name: homeCompetitor.name, logoUrl: TEAM_LOGOS[homeCompetitor.name] || 'https://placehold.co/40x40.png' };
    const awayTeam: Team = { id: awayCompetitor.id, name: awayCompetitor.name, logoUrl: TEAM_LOGOS[awayCompetitor.name] || 'https://placehold.co/40x40.png' };
    
    // NOTE: Daily schedule endpoint does not include odds. We simulate them.
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
            name: apiMatch.sport_event_context.competition.name,
            country: apiMatch.sport_event_context.category.name,
            logoUrl: '', // Not provided by Sportradar in this context
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


const getMatchesFlow = ai.defineFlow(
  {
    name: 'getMatchesFlow',
    inputSchema: GetMatchesInputSchema,
    outputSchema: z.any(), // Using any because GetMatchesResponse is complex
  },
  async (filters) => {
    // Fetch all soccer matches for the next few days and then filter.
    const { matches: allMatchesFromApi } = await fetchDailySchedule({ sport: 'soccer' });
    
    let allMatches = allMatchesFromApi
        .map(transformApiMatch)
        .filter(match => match !== null) // Filter out any matches that couldn't be transformed
        // Sort by date by default if no other sort is specified
        .sort((a, b) => {
            if (filters.sortBy && filters.sortBy !== 'eventTimestamp') return 0;
            return a.eventTimestamp - b.eventTimestamp
        });
        
    // Apply filters on the server
    let filteredMatches = allMatches;

    if (filters.leagues && filters.leagues.length > 0) {
        const leagueSet = new Set(filters.leagues);
        // Sportradar competition IDs are in the format "sr:competition:123"
        // We are filtering by name here as IDs are not consistent across endpoints
        filteredMatches = filteredMatches.filter(match => leagueSet.has(match.league.name));
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
     if (filters.minOdds) {
      filteredMatches = filteredMatches.filter(match => (match.mainOdds?.[1] || 0) >= filters.minOdds!);
    }
    if (filters.maxOdds) {
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
