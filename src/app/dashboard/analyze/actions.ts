'use server';

import { z } from 'zod';
import { dataExplorer } from '@/ai/flows/data-explorer-flow';
import { quantitativeModel } from '@/ai/flows/quantitative-model-flow';
import { portfolioManager } from '@/ai/flows/portfolio-manager-flow';
import { calculateValueBetManual } from '@/ai/flows/calculate-value-bet-manual-flow';
import { analyzeSingleMatch } from '@/ai/flows/analyze-single-match-flow';
import { calculateBatchValueBets } from '@/ai/flows/calculate-batch-value-bets-flow';


export type ActionState = {
  message?: string;
  data?: any;
  fields?: Record<string, string>;
  issues?: string[];
};

const quantitativeSchema = z.object({
    teamA: z.string().min(1, { message: "Team A name is required." }),
    teamB: z.string().min(1, { message: "Team B name is required." }),
    teamAUrl: z.string().url({ message: "Please enter a valid URL for Team A." }),
    teamBUrl: z.string().url({ message: "Please enter a valid URL for Team B." }),
    leagueHomeAvg: z.coerce.number().gt(0, { message: "Must be greater than 0." }),
    leagueAwayAvg: z.coerce.number().gt(0, { message: "Must be greater than 0." }),
    oddsHome: z.coerce.number().gt(1, { message: "Odds must be > 1." }),
    oddsDraw: z.coerce.number().gt(1, { message: "Odds must be > 1." }),
    oddsAway: z.coerce.number().gt(1, { message: "Odds must be > 1." }),
    bankroll: z.coerce.number().min(0, { message: "Bankroll cannot be negative." }),
    stakingStrategy: z.string(),
});

export async function handleQuantitativeAnalysis(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
    
  const validatedFields = quantitativeSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key]?.[0] ?? "";
    }
    return {
      message: "Error: Please fix the issues below.",
      issues: validatedFields.error.flatten().formErrors,
      fields,
    };
  }
  try {
    const { 
        teamA, teamB, teamAUrl, teamBUrl, 
        leagueHomeAvg, leagueAwayAvg,
        oddsHome, oddsDraw, oddsAway,
        bankroll, stakingStrategy
    } = validatedFields.data;

    // 1. Data Explorer Flow
    const [teamAData, teamBData] = await Promise.all([
      dataExplorer({ teamName: teamA, dataSourceUrl: teamAUrl }),
      dataExplorer({ teamName: teamB, dataSourceUrl: teamBUrl }),
    ]);

    // 2. Quantitative Model Flow
    const modelProbabilities = await quantitativeModel({
      teamA_data: {
          homeGoalsFor: teamAData.stats.home.goalsFor,
          homeGoalsAgainst: teamAData.stats.home.goalsAgainst,
          homeXGFor: teamAData.stats.home.expectedGoalsFor,
          homeXGAgainst: teamAData.stats.home.expectedGoalsAgainst,
          awayGoalsFor: teamAData.stats.away.goalsFor,
          awayGoalsAgainst: teamAData.stats.away.goalsAgainst,
          awayXGFor: teamAData.stats.away.expectedGoalsFor,
          awayXGAgainst: teamAData.stats.away.expectedGoalsAgainst,
      },
      teamB_data: {
          homeGoalsFor: teamBData.stats.home.goalsFor,
          homeGoalsAgainst: teamBData.stats.home.goalsAgainst,
          homeXGFor: teamBData.stats.home.expectedGoalsFor,
          homeXGAgainst: teamBData.stats.home.expectedGoalsAgainst,
          awayGoalsFor: teamBData.stats.away.goalsFor,
          awayGoalsAgainst: teamBData.stats.away.goalsAgainst,
          awayXGFor: teamBData.stats.away.expectedGoalsFor,
          awayXGAgainst: teamBData.stats.away.expectedGoalsAgainst,
      },
      leagueAverages: {
          homeGoals: leagueHomeAvg,
          awayGoals: leagueAwayAvg,
      },
    });

    const matchDescription = `${teamA} vs ${teamB}`;
    const valueBets = [
      { match: matchDescription, outcome: 'Home Win', odds: oddsHome, modelProbability: modelProbabilities.homeWin, value: modelProbabilities.homeWin * oddsHome - 1 },
      { match: matchDescription, outcome: 'Draw', odds: oddsDraw, modelProbability: modelProbabilities.draw, value: modelProbabilities.draw * oddsDraw - 1 },
      { match: matchDescription, outcome: 'Away Win', odds: oddsAway, modelProbability: modelProbabilities.awayWin, value: modelProbabilities.awayWin * oddsAway - 1 },
    ];
    
    // 3. Portfolio Manager Flow
    const recommendations = await portfolioManager({
        bankroll,
        stakingStrategy,
        potentialBets: valueBets,
    });
    
    const responseData = {
        valueBets: valueBets.map(bet => ({ ...bet, estProbability: bet.modelProbability * 100 })),
        recommendations: recommendations.filter(rec => rec.recommendedStake > 0),
    };

    return { message: "Analysis complete.", data: responseData };
  } catch (e: any) {
    return {
      message: `An unexpected error occurred: ${e.message || 'Unknown error'}.`,
      issues: [e.message || 'Unknown error'],
    };
  }
}

// Zod schema for manual analysis, using a discriminated union
const FootballInputSchema = z.object({
  sport: z.literal('futbol'),
  equipo_a_nombre: z.string().min(1, { message: "Required" }),
  equipo_b_nombre: z.string().min(1, { message: "Required" }),
  cuota_equipo_a: z.coerce.number().gt(1),
  cuota_empate: z.coerce.number().gt(1),
  cuota_equipo_b: z.coerce.number().gt(1),
  liga_goles_local_promedio: z.coerce.number().gt(0),
  liga_goles_visitante_promedio: z.coerce.number().gt(0),
  equipo_a_xgf: z.coerce.number(),
  equipo_a_xga: z.coerce.number(),
  equipo_b_xgf: z.coerce.number(),
  equipo_b_xga: z.coerce.number(),
});

const TennisInputSchema = z.object({
  sport: z.literal('tenis'),
  jugador_a_nombre: z.string().min(1, { message: "Required" }),
  jugador_b_nombre: z.string().min(1, { message: "Required" }),
  cuota_jugador_a: z.coerce.number().gt(1),
  cuota_jugador_b: z.coerce.number().gt(1),
  superficie: z.string().min(1, { message: "Required" }),
  jugador_a_primer_servicio_pct: z.coerce.number().min(0).max(100),
  jugador_a_puntos_ganados_1er_serv_pct: z.coerce.number().min(0).max(100),
  jugador_a_puntos_ganados_2do_serv_pct: z.coerce.number().min(0).max(100),
  jugador_b_primer_servicio_pct: z.coerce.number().min(0).max(100),
  jugador_b_puntos_ganados_1er_serv_pct: z.coerce.number().min(0).max(100),
  jugador_b_puntos_ganados_2do_serv_pct: z.coerce.number().min(0).max(100),
});

const fundamentalSchema = z.discriminatedUnion('sport', [
  FootballInputSchema,
  TennisInputSchema,
]);


export async function handleFundamentalAnalysis(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = fundamentalSchema.safeParse(rawData);
  
  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key in validatedFields.error.flatten().fieldErrors) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key as keyof typeof fields]?.[0] ?? "";
    }
    return {
      message: "Error: Please fix the issues below.",
      issues: validatedFields.error.flatten().formErrors,
      fields,
    };
  }
  
   try {
    const result = await calculateValueBetManual(validatedFields.data);

    // Transform the result to match the structure expected by ResultsDisplay
    const responseData = {
        analysis: result.analysis,
        valueBets: result.valueBets.map(bet => ({
            match: validatedFields.data.sport === 'futbol' ? `${validatedFields.data.equipo_a_nombre} vs ${validatedFields.data.equipo_b_nombre}` : `${validatedFields.data.jugador_a_nombre} vs ${validatedFields.data.jugador_b_nombre}`,
            outcome: bet.market,
            odds: bet.odds,
            estProbability: bet.probability * 100,
            value: bet.expectedValue,
        })),
        recommendations: [], // This flow doesn't generate staking recommendations
    };

    return { message: "Analysis complete.", data: responseData };
  } catch (e: any) {
     return {
      message: `An unexpected error occurred: ${e.message || 'Unknown error'}.`,
      issues: [e.message || 'Unknown error'],
    };
  }
}

const singleMatchSchema = z.object({
  match: z.string().min(1, { message: "Match details are required." }),
});

export async function handleSingleMatchAnalysis(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = singleMatchSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key]?.[0] ?? "";
    }
    return {
      message: "Error: Please fix the issues below.",
      issues: validatedFields.error.flatten().formErrors,
      fields,
    };
  }

  try {
    const result = await analyzeSingleMatch(validatedFields.data);
    const matchDescription = `${result.teamA} vs ${result.teamB}`;
    
    const responseData = {
        analysis: result.analysis,
        valueBets: [
            { match: matchDescription, outcome: `${result.teamA} Win`, odds: result.odds.teamA, estProbability: 0, value: 0 },
            { match: matchDescription, outcome: 'Draw', odds: result.odds.draw || 0, estProbability: 0, value: 0 },
            { match: matchDescription, outcome: `${result.teamB} Win`, odds: result.odds.teamB, estProbability: 0, value: 0 },
        ],
        recommendations: result.valueBetFound && result.recommendation ? [{
            match: matchDescription,
            outcome: result.recommendation,
            value: 0, // Value not calculated in this flow
            recommendedStake: 0 // Staking not calculated
        }] : [],
    };

     // Filter out draw if odds are 0
    responseData.valueBets = responseData.valueBets.filter(bet => bet.odds > 0);

    return { message: "Analysis complete.", data: responseData };
  } catch (e: any) {
    return {
      message: `An unexpected error occurred: ${e.message || 'Unknown error'}.`,
      issues: [e.message || 'Unknown error'],
    };
  }
}


const batchSchema = z.object({
  matchesText: z.string().min(1, { message: "Match list is required." }),
  sportKey: z.string().optional(),
});

export async function handleCalculateBatchValueBets(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = batchSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key]?.[0] ?? "";
    }
    return {
      message: "Error: Please fix the issues below.",
      issues: validatedFields.error.flatten().formErrors,
      fields,
    };
  }

  try {
    const { analyzedMatches } = await calculateBatchValueBets(validatedFields.data);

    // Transform the raw analysis into the structure ResultsDisplay expects
    const valueBets = analyzedMatches.map(match => ({
        match: `${match.teamA} vs ${match.teamB}`,
        outcome: match.recommendation || 'N/A',
        odds: match.odds.teamA, // This is a simplification, might need adjustment
        estProbability: 0, // Not provided by this flow
        value: 0, // Not provided by this flow
    }));
    
    const recommendations = analyzedMatches
      .filter(match => match.valueBetFound && match.recommendation)
      .map(match => ({
          match: `${match.teamA} vs ${match.teamB}`,
          outcome: match.recommendation!,
          value: 0, // Not provided
          recommendedStake: 0 // Not provided
      }));

    const responseData = {
      isBatch: true,
      batchAnalysis: analyzedMatches,
      valueBets: [], // Let's use a dedicated structure for batch results
      recommendations: [],
    };


    return { message: `${analyzedMatches.length} matches analyzed.`, data: responseData };
  } catch (e: any) {
    return {
      message: e.message,
      issues: [e.message],
    };
  }
}
