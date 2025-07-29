
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import { GetMatchesResponse, League } from "@/lib/types";

export async function fetchMatches(searchParams: { [key: string]: string | string[] | undefined }): Promise<GetMatchesResponse> {
    const filters: { [key: string]: any } = {};

    // Iterate over searchParams and build a clean filter object
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') return;

        switch (key) {
            case 'page':
            case 'limit':
            case 'minValue':
            case 'minOdds':
            case 'maxOdds':
                filters[key] = parseFloat(value as string);
                break;
            case 'leagues':
            case 'markets':
                const arr = (value as string).split(',').filter(item => item.trim() !== '');
                if (arr.length > 0) {
                    filters[key] = arr;
                }
                break;
            default:
                filters[key] = value;
        }
    });

    // Ensure page and limit have default values if not present
    if (!filters.page) filters.page = 1;
    if (!filters.limit) filters.limit = 10;
    
    return getMatches(filters);
}


export async function getLeaguesList(): Promise<League[]> {
  const { leagues } = await getLeagues();
  return leagues;
}
