
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import { GetMatchesResponse, League } from "@/lib/types";

export async function fetchMatches(params: URLSearchParams): Promise<GetMatchesResponse> {
    const page = params.get('page') ? parseInt(params.get('page')!, 10) : 1;
    const limit = params.get('limit') ? parseInt(params.get('limit')!, 10) : 10;
    const leaguesParam = params.get('leagues');

    const filters = {
        leagues: leaguesParam && leaguesParam.length > 0 ? leaguesParam.split(',') : undefined,
        startDate: params.get('startDate') || undefined,
        endDate: params.get('endDate') || undefined,
        minValue: params.get('minValue') ? parseFloat(params.get('minValue')!) : undefined,
        minOdds: params.get('minOdds') ? parseFloat(params.get('minOdds')!) : undefined,
        maxOdds: params.get('maxOdds') ? parseFloat(params.get('maxOdds')!) : undefined,
        markets: params.get('markets')?.split(','),
        sortBy: params.get('sortBy') || undefined,
        sortOrder: params.get('sortOrder') as 'asc' | 'desc' | undefined,
        page,
        limit,
    };

    // Remove undefined/null filters to prevent Zod validation errors
    Object.keys(filters).forEach(key => {
        const filterKey = key as keyof typeof filters;
        if (filters[filterKey] === undefined || filters[filterKey] === null) {
            delete (filters as any)[filterKey];
        }
    });
    
    return getMatches(filters);
}


export async function getLeaguesList(): Promise<League[]> {
  const { leagues } = await getLeagues();
  return leagues;
}
