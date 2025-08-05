




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
        id: string;
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


export interface AnalysisPayload {
  matchDetails: {
    sport: 'football' | 'tennis';
    participants: string; // Ej: "Real Madrid vs FC Barcelona"
    marketOdds: { home: number; draw?: number; away: number };
  };
  quantitativeAnalysis?: {
    modelUsed: 'Poisson-xG' | 'Elo';
    scrapedStats: Record<string, any>; // Datos brutos del dataExplorer
    probabilities: { home: number; draw?: number; away: number }; // Salida del quantitativeModel
  };
  qualitativeAnalysis?: {
    userInput: Record<string, any>; // Datos del formulario de análisis fundamental
    narrative: string; // Salida del flujo calculateValueBetManual
  };
  liveOdds: any; // Salida del flujo fetchLiveOdds
  confidenceScore?: number; // Se añadirá en un paso posterior
}

export interface SavedAnalysis {
    id: string;
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
    analysisTitle: string;
    analysisType: 'quantitative' | 'fundamental' | 'batch';
    isBetPlaced: boolean;
    betOutcome: 'PENDING' | 'WON' | 'LOST' | 'VOID';
    matchResult?: string; // e.g., '3-1'
    profitAndLoss?: number;
    confidenceScore: number;
    valueBetResult: {
        market: string;
        odds: number;
        modelProbability: number;
        expectedValue: number;
        recommendedStake?: number;
    };
    tags: string[];
    notes?: string;
    fullPayload: AnalysisPayload; // The complete, original payload used for the analysis
}
