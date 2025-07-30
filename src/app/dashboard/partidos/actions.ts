
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import type { GetMatchesResponse, League, GetMatchesInput, Match } from "@/lib/types";
import { db } from "@/lib/firebase-admin";

export async function fetchMatches(filters: GetMatchesInput): Promise<GetMatchesResponse> {
    return getMatches(filters);
}

export async function getMatchesByLeague(): Promise<Record<string, Match[]>> {
    const matchesSnapshot = await db.collection('matches').orderBy('eventTimestamp', 'asc').get();
    const matches: Match[] = [];
    matchesSnapshot.forEach(doc => {
        matches.push(doc.data() as Match);
    });

    // Group matches by league name
    const groupedByLeague = matches.reduce((acc, match) => {
        const leagueName = match.league.name;
        if (!acc[leagueName]) {
            acc[leagueName] = [];
        }
        acc[leagueName].push(match);
        return acc;
    }, {} as Record<string, Match[]>);
    
    return groupedByLeague;
}


export async function getLeaguesList(): Promise<League[]> {
  const { leagues } = await getLeagues();
  return leagues;
}
