

export interface UserProfile {
    uid: string;
    email: string;
    is_premium: boolean;
    analysisCount: number;
    analysisLimit: number;
    // Preferences
    preferredOddsFormat?: 'decimal' | 'fractional' | 'american';
    // Gamification
    points?: number;
    medals?: string[];
    // Personalization
    segment?: 'conservative' | 'balanced' | 'aggressive';
}


export interface League {
    id: string;
    name: string;
    country: string;
    sportId: string;
    logoUrl?: string;
}

export interface Team {
    id?: string; // Can be optional if we don't always have it
    name: string;
    logoUrl: string;
}

// Based on the strategic plan from the consultancy report
export interface Match {
    id: string;
    league: {
        name: string;
        logoUrl?: string;
        country: string;
    };
    eventTimestamp: number; // Unix timestamp
    teams: {
        home: Team;
        away: Team;
    };
    mainOdds: {
        '1'?: number;
        'X'?: number;
        '2'?: number;
    };
    valueMetrics?: {
        hasValue: boolean;
        market: string; // e.g., 'Home Win', 'Over 2.5'
        valueScore: number; // e.g., 0.085 for 8.5%
        explanation?: string; // XAI
        recommendedStake?: number;
    };
    marketCount?: number;
    liveStatus: 'pre-match' | 'live' | 'finished';
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
