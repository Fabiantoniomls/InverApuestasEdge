
'use server'

import { getMatches } from "@/ai/flows/get-matches-flow";
import { getLeaguesList as getLeagues } from "@/ai/flows/get-leagues-list-flow";
import type { GetMatchesResponse, League, GetMatchesInput, Match } from "@/lib/types";
import { db } from "@/lib/firebase-admin";

export async function fetchMatches(filters: GetMatchesInput): Promise<GetMatchesResponse> {
    return getMatches(filters);
}

export async function getMatchesByLeague(): Promise<Record<string, Match[]>> {
    try {
        const matchesSnapshot = await db.collection('matches').orderBy('eventTimestamp', 'asc').limit(50).get();
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
    } catch (error) {
        console.error("Error fetching matches by league from Firestore:", error);
        return {};
    }
}

export async function getMatchesByValue(): Promise<Match[]> {
    try {
        const matchesSnapshot = await db.collection('matches')
            .where('valueMetrics.hasValue', '==', true)
            .orderBy('valueMetrics.valueScore', 'desc')
            .limit(8)
            .get();
            
        const matches: Match[] = [];
        matchesSnapshot.forEach(doc => {
            matches.push(doc.data() as Match);
        });

        return matches;
    } catch (error) {
        console.error("Error fetching matches by value from Firestore:", error);
        return [];
    }
}


export async function getLeaguesList(): Promise<League[]> {
  const { leagues } = await getLeagues();
  return leagues.map(l => ({...l, id: l.id, name: l.name, country: l.country, sportId: l.sportId, logoUrl: l.logoUrl }))
}
