
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import type { GetMatchesResponse, League, GetMatchesInput, Match } from "@/lib/types";

export async function fetchMatches(filters: GetMatchesInput): Promise<GetMatchesResponse> {
    return getMatches(filters);
}

export async function getMatchesByLeague(): Promise<{ data: Record<string, Match[]>, error: string | null }> {
    try {
        // Fetch all matches from the live API
        const response = await getMatches({ limit: 100 }); // Fetch a larger number to group
        if (!response.data) {
            return { data: {}, error: 'No data received from the API.' };
        }

        // Group matches by league name
        const groupedByLeague = response.data.reduce((acc, match) => {
            const leagueName = match.league.name;
            if (!acc[leagueName]) {
                acc[leagueName] = [];
            }
            acc[leagueName].push(match);
            return acc;
        }, {} as Record<string, Match[]>);
        
        return { data: groupedByLeague, error: null };
    } catch (error: any) {
        return { data: {}, error: error.message };
    }
}

export async function getMatchesByValue(): Promise<{ data: Match[], error: string | null }> {
    try {
        // Fetch matches from the live API, filtering by value
        const response = await getMatches({ 
            minValue: 0.01, // Filter for matches that have a value score > 0
            sortBy: 'valueMetrics.valueScore', 
            sortOrder: 'desc',
            limit: 8 
        });

        if (!response.data) {
            return { data: [], error: 'No data received from the API.' };
        }

        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: [], error: error.message };
    }
}


export async function getLeaguesList(): Promise<League[]> {
  const { leagues } = await getLeagues();
  return leagues.map(l => ({...l, id: l.id, name: l.name, country: l.country, sportId: l.sportId, logoUrl: l.logoUrl }))
}
