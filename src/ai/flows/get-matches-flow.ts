
'use server';
/**
 * @fileOverview A Genkit flow to get a filtered, sorted, and paginated list of matches.
 * This flow fetches live odds from The Odds API and then applies server-side filtering.
 * 
 * - getMatches - A function that returns a list of matches based on filters.
 * - GetMatchesInput - The input type for the function.
 * - GetMatchesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { GetMatchesResponse, Match, League, Team } from '@/lib/types';
import { fetchLiveOdds, FetchLiveOddsOutput } from './fetch-live-odds-flow';
import { SOCCER_LEAGUES } from './_data/leagues';

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

// Helper function to transform API data into our internal Match type
function transformApiMatch(apiMatch: FetchLiveOddsOutput['matches'][0]): Match {
    const leagueInfo = SOCCER_LEAGUES.find(l => l.id === apiMatch.sport_key) || { name: apiMatch.sport_title, country: '', logoUrl: '' };
    
    const homeTeam: Team = { id: apiMatch.home_team, name: apiMatch.home_team, logoUrl: 'https://placehold.co/40x40.png', leagueId: apiMatch.sport_key };
    const awayTeam: Team = { id: apiMatch.away_team, name: apiMatch.away_team, logoUrl: 'https://placehold.co/40x40.png', leagueId: apiMatch.sport_key };
    const league: League = { id: apiMatch.sport_key, name: leagueInfo.name, country: leagueInfo.country, sportId: 'soccer', logoUrl: leagueInfo.logoUrl };
    
    // Find best odds for h2h and totals
    let h2h_odds: { home?: number; draw?: number; away?: number; } = {};
    let totals_odds: { over?: number; under?: number; } = {};

    apiMatch.bookmakers?.forEach(bookmaker => {
        bookmaker.markets?.forEach(market => {
            if (market.key === 'h2h') {
                const home = market.outcomes.find(o => o.name === apiMatch.home_team)?.price;
                const away = market.outcomes.find(o => o.name === apiMatch.away_team)?.price;
                const draw = market.outcomes.find(o => o.name === 'Draw')?.price;
                if (home && (!h2h_odds.home || home > h2h_odds.home)) h2h_odds.home = home;
                if (away && (!h2h_odds.away || away > h2h_odds.away)) h2h_odds.away = away;
                if (draw && (!h2h_odds.draw || draw > h2h_odds.draw)) h2h_odds.draw = draw;
            }
            if (market.key === 'totals') {
                const over = market.outcomes.find(o => o.name === 'Over' && o.point === 2.5)?.price;
                const under = market.outcomes.find(o => o.name === 'Under' && o.point === 2.5)?.price;
                 if (over && (!totals_odds.over || over > totals_odds.over)) totals_odds.over = over;
                 if (under && (!totals_odds.under || under > totals_odds.under)) totals_odds.under = under;
            }
        });
    });

    return {
        id: apiMatch.id,
        startTime: apiMatch.commence_time,
        homeTeam,
        awayTeam,
        league,
        odds: { ...h2h_odds, ...totals_odds },
        valueScore: Math.random() * 0.15, // Placeholder for value score
    };
}


const getMatchesFlow = ai.defineFlow(
  {
    name: 'getMatchesFlow',
    inputSchema: GetMatchesInputSchema,
    outputSchema: z.any(), // Using any because GetMatchesResponse is complex
  },
  async (filters) => {
    // 1. Fetch ALL upcoming matches from the API for the main soccer leagues
    // The API only supports one sport key per request, so we make parallel calls.
    const leaguesToFetch = filters.leagues && filters.leagues.length > 0 
        ? SOCCER_LEAGUES.filter(l => filters.leagues!.includes(l.id))
        : SOCCER_LEAGUES;

    const apiPromises = leaguesToFetch.map(league => fetchLiveOdds({
        sport: league.id,
        regions: 'eu',
        markets: 'h2h,totals',
    }));

    const results = await Promise.all(apiPromises);
    
    const allMatchesFromApi = results.flatMap(result => result.matches);

    let allMatches = allMatchesFromApi
        .map(transformApiMatch)
        // Sort by date by default if no other sort is specified
        .sort((a, b) => {
            if (filters.sortBy) return 0; // Skip if other sorting is active
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        });
        
    // 2. Apply filters on the server
    let filteredMatches = allMatches;

    // Filtering logic (leagues filter is already applied before API call)
    if (filters.startDate) {
      filteredMatches = filteredMatches.filter(match => new Date(match.startTime) >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      filteredMatches = filteredMatches.filter(match => new Date(match.startTime) <= new Date(filters.endDate!));
    }
    if (filters.minValue) {
      filteredMatches = filteredMatches.filter(match => (match.valueScore || 0) >= filters.minValue!);
    }
     if (filters.minOdds) {
      filteredMatches = filteredMatches.filter(match => (match.odds?.home || 0) >= filters.minOdds!);
    }
    if (filters.maxOdds) {
      filteredMatches = filteredMatches.filter(match => (match.odds?.home || 0) <= filters.maxOdds!);
    }

    // Sorting logic
    if (filters.sortBy) {
        filteredMatches.sort((a, b) => {
            let aVal, bVal;

            if (filters.sortBy === 'startTime') {
                aVal = new Date(a.startTime).getTime();
                bVal = new Date(b.startTime).getTime();
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
