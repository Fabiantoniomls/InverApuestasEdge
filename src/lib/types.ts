

export interface UserProfile {
    uid: string;
    email: string;
    is_premium: boolean;
    analysisCount: number;
    analysisLimit: number;
}

// Based on Phase 1, Prompt 1.1
export interface Sport {
    id: string;
    name: string;
    sportKey: string;
}

export interface League {
    id: string;
    name: string;
    country: string;
    sportId: string;
    logoUrl?: string;
}

export interface Team {
    id: string;
    name: string;
    logoUrl: string;
    leagueId: string;
}

export interface Match {
    id: string;
    startTime: string; // ISO 8601 string
    homeTeam: Team;
    awayTeam: Team;
    league: League;
    odds?: {
        home?: number;
        draw?: number;
        away?: number;
        over?: number;
        under?: number;
    };
    valueScore?: number;
    modelProbability?: Record<string, number>;
    marketProbability?: Record<string, number>;
    availableMarkets?: string[];
}

export interface GetMatchesResponse {
  data: Match[];
  totalMatches: number;
  totalPages: number;
  currentPage: number;
}

export interface GetMatchesInput {
    leagues?: string[];
    startDate?: string;
    endDate?: string;
    minValue?: number;
    minOdds?: number;
    maxOdds?: number;
    markets?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
