
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import type { GetMatchesResponse, League, GetMatchesInput, Match } from "@/lib/types";
import { fetchLiveOdds } from "@/ai/flows/fetch-live-odds-flow";

export async function fetchMatches(filters: GetMatchesInput): Promise<GetMatchesResponse> {
    // Add a try-catch block for robust error handling
    try {
        const response = await getMatches(filters);
        return response;
    } catch (error: any) {
        console.error("Error fetching matches in action:", error.message);
        // Return a structured error response that the UI can handle
        return {
            data: [],
            totalMatches: 0,
            totalPages: 0,
            currentPage: filters.page || 1,
        };
    }
}

export async function getMatchesByLeague(): Promise<{ data: Record<string, Match[]>, error: string | null }> {
    try {
        const response = await getMatches({ limit: 100 }); 
        
        if (!response.data) {
            return { data: {}, error: 'No se recibieron datos de la API.' };
        }

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
        console.error("Error in getMatchesByLeague:", error.message);
        return { data: {}, error: error.message };
    }
}

export async function getMatchesByValue(): Promise<{ data: Match[], error: string | null }> {
    try {
        const response = await getMatches({ 
            minValue: 0.01,
            sortBy: 'valueMetrics.valueScore', 
            sortOrder: 'desc',
            limit: 8 
        });

        if (!response.data) {
            return { data: [], error: 'No se recibieron datos de la API.' };
        }

        return { data: response.data, error: null };
    } catch (error: any) {
        console.error("Error in getMatchesByValue:", error.message);
        return { data: [], error: error.message };
    }
}

type GetLeaguesListParams = {
    sport?: 'soccer' | 'tennis' | 'basketball';
}

export async function getLeaguesList(params?: GetLeaguesListParams): Promise<{leagues: League[], error: string | null}> {
  try {
    const { leagues } = await getLeagues({ sportGroup: params?.sport || 'soccer' });
    const mappedLeagues = leagues.map(l => ({...l, id: l.id, name: l.name, country: l.country, sportId: l.sportId, logoUrl: l.logoUrl }))
    return { leagues: mappedLeagues, error: null };
  } catch (error: any) {
    return { leagues: [], error: error.message };
  }
}
