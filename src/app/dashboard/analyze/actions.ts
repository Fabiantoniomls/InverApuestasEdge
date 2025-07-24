'use server';

import { z } from 'zod';
import { dataExplorer } from '@/ai/flows/data-explorer-flow';
import { quantitativeModel } from '@/ai/flows/quantitative-model-flow';
import { portfolioManager } from '@/ai/flows/portfolio-manager-flow';
import { fundamentalAnalysis } from '@/ai/flows/fundamental-analysis-flow';


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
          homeGoalsFor: teamAData.home.goalsFor,
          homeGoalsAgainst: teamAData.home.goalsAgainst,
          homeXGFor: teamAData.home.xGFor,
          homeXGAgainst: teamAData.home.xGAgainst,
          awayGoalsFor: teamAData.away.goalsFor,
          awayGoalsAgainst: teamAData.away.goalsAgainst,
          awayXGFor: teamAData.away.xGFor,
          awayXGAgainst: teamAData.away.xGAgainst,
      },
      teamB_data: {
          homeGoalsFor: teamBData.home.goalsFor,
          homeGoalsAgainst: teamBData.home.goalsAgainst,
          homeXGFor: teamBData.home.xGFor,
          homeXGAgainst: teamBData.home.xGAgainst,
          awayGoalsFor: teamBData.away.goalsFor,
          awayGoalsAgainst: teamBData.away.goalsAgainst,
          awayXGFor: teamBData.away.xGFor,
          awayXGAgainst: teamBData.away.xGAgainst,
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

const fundamentalSchema = z.object({
  matchDescription: z.string().min(1, { message: "Match description is required." }),
  teamAContext: z.string().min(1, { message: "Team A context is required." }),
  teamBContext: z.string().min(1, { message: "Team B context is required." }),
  oddsTeamA: z.coerce.number().gt(1, { message: "Odds must be > 1." }),
  oddsDraw: z.coerce.number().gt(1, { message: "Odds must be > 1." }),
  oddsTeamB: z.coerce.number().gt(1, { message: "Odds must be > 1." }),
});


export async function handleFundamentalAnalysis(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
    
  const validatedFields = fundamentalSchema.safeParse(Object.fromEntries(formData.entries()));

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
    const result = await fundamentalAnalysis(validatedFields.data);
    const { matchDescription, oddsTeamA, oddsDraw, oddsTeamB } = validatedFields.data;

    const responseData = {
        analysis: result.analysis,
        valueBets: [
            { match: matchDescription, outcome: 'Team A Win', odds: oddsTeamA, estProbability: result.teamAProbability * 100, value: result.valueTeamA },
            { match: matchDescription, outcome: 'Draw', odds: oddsDraw, estProbability: (result.drawProbability || 0) * 100, value: result.valueDraw || 0 },
            { match: matchDescription, outcome: 'Team B Win', odds: oddsTeamB, estProbability: result.teamBProbability * 100, value: result.valueTeamB },
        ],
        // Fundamental analysis doesn't produce staking recommendations directly
        recommendations: [],
    };

    return { message: "Analysis complete.", data: responseData };
  } catch (e: any) {
     return {
      message: `An unexpected error occurred: ${e.message || 'Unknown error'}.`,
      issues: [e.message || 'Unknown error'],
    };
  }
}
