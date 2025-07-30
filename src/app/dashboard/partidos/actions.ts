
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import type { GetMatchesResponse, League, GetMatchesInput, Match } from "@/lib/types";

export async function fetchMatches(filters: GetMatchesInput): Promise<GetMatchesResponse> {
    return getMatches(filters);
}

export async function getMatchesByLeague(): Promise<{ data: Record<string, Match[]>, error: string | null }> {
    try {
        // We can fetch from a few popular soccer leagues for the "Competitions" view as fetching all is too slow.
        const popularLeagues = ['soccer_spain_la_liga', 'soccer_epl', 'soccer_italy_serie_a', 'soccer_germany_bundesliga'];
        const response = await getMatches({ limit: 100, leagues: popularLeagues }); 
        
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
        return { data: [], error: error.message };
    }
}

type GetLeaguesListParams = {
    sport?: 'soccer' | 'tennis' | 'basketball';
}

export async function getLeaguesList(params?: GetLeaguesListParams): Promise<League[]> {
  const { leagues } = await getLeagues({ sportGroup: params?.sport || 'soccer' });
  return leagues.map(l => ({...l, id: l.id, name: l.name, country: l.country, sportId: l.sportId, logoUrl: l.logoUrl }))
}
