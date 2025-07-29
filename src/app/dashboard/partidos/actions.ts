
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import { GetMatchesResponse, League } from "@/lib/types";

export async function fetchMatches(searchParams: { [key: string]: string | string[] | undefined }): Promise<GetMatchesResponse> {
    const filters: { [key: string]: any } = {};

    // Helper function to safely get and parse search parameters
    const getParam = (key: string) => searchParams[key];

    const page = getParam('page');
    const limit = getParam('limit');
    const leagues = getParam('leagues');
    const startDate = getParam('startDate');
    const endDate = getParam('endDate');
    const minValue = getParam('minValue');
    const minOdds = getParam('minOdds');
    const maxOdds = getParam('maxOdds');
    const markets = getParam('markets');
    const sortBy = getParam('sortBy');
    const sortOrder = getParam('sortOrder');

    // Build the filters object with valid values
    filters.page = page ? parseFloat(page as string) : 1;
    filters.limit = limit ? parseFloat(limit as string) : 10;
    
    if (leagues && typeof leagues === 'string' && leagues.trim() !== '') {
        filters.leagues = leagues.split(',').filter(item => item.trim() !== '');
    }
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minValue) filters.minValue = parseFloat(minValue as string);
    if (minOdds) filters.minOdds = parseFloat(minOdds as string);
    if (maxOdds) filters.maxOdds = parseFloat(maxOdds as string);
    if (markets && typeof markets === 'string' && markets.trim() !== '') {
        filters.markets = markets.split(',').filter(item => item.trim() !== '');
    }
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;

    return getMatches(filters);
}


export async function getLeaguesList(): Promise<League[]> {
  const { leagues } = await getLeagues();
  return leagues;
}
