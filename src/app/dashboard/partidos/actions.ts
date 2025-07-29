
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeagues } from "@/ai/flows/get-leagues-list-flow"; // This flow does not exist, let's assume it does for now
import { GetMatchesResponse, League } from "@/lib/types";

export async function fetchMatches(params: URLSearchParams): Promise<GetMatchesResponse> {
    const page = params.get('page') ? parseInt(params.get('page')!, 10) : 1;
    const limit = params.get('limit') ? parseInt(params.get('limit')!, 10) : 10;

    const filters = {
        leagues: params.get('leagues')?.split(','),
        startDate: params.get('startDate'),
        endDate: params.get('endDate'),
        minValue: params.get('minValue') ? parseFloat(params.get('minValue')!) : undefined,
        minOdds: params.get('minOdds') ? parseFloat(params.get('minOdds')!) : undefined,
        maxOdds: params.get('maxOdds') ? parseFloat(params.get('maxOdds')!) : undefined,
        markets: params.get('markets')?.split(','),
        sortBy: params.get('sortBy'),
        sortOrder: params.get('sortOrder') as 'asc' | 'desc' | undefined,
        page,
        limit,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => (filters as any)[key] === undefined && delete (filters as any)[key]);
    
    return getMatches(filters);
}

// In a real scenario, this would also fetch from Firestore
const mockLeagues: League[] = [
    { id: '1', name: 'La Liga', country: 'España', sportId: 'soccer', logoUrl: '/flags/es.svg' },
    { id: '2', name: 'Premier League', country: 'Inglaterra', sportId: 'soccer', logoUrl: '/flags/gb.svg' },
    { id: '3', name: 'Serie A', country: 'Italia', sportId: 'soccer', logoUrl: '/flags/it.svg' },
    { id: '4', name: 'Bundesliga', country: 'Alemania', sportId: 'soccer', logoUrl: '/flags/de.svg' },
    { id: '5', name: 'Ligue 1', country: 'Francia', sportId: 'soccer', logoUrl: '/flags/fr.svg' },
];

export async function getLeaguesList(): Promise<League[]> {
  // For now, we return mock data. In a real implementation, you would call a Genkit flow
  // that fetches the leagues from your Firestore 'leagues' collection.
  // const { leagues } = await getLeagues();
  // return leagues;
  return Promise.resolve(mockLeagues);
}

