'use server';

import { z } from 'zod';

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

  await new Promise(resolve => setTimeout(resolve, 2000));

  const teamA = validatedFields.data.teamA;
  const teamB = validatedFields.data.teamB;

  // Mocked response from portfolioManagerFlow
  const mockData = {
      valueBets: [
          { match: `${teamA} vs ${teamB}`, outcome: 'Home Win', odds: validatedFields.data.oddsHome, estProbability: 45.5, value: 0.15 },
          { match: `${teamA} vs ${teamB}`, outcome: 'Draw', odds: validatedFields.data.oddsDraw, estProbability: 28.0, value: -0.05 },
          { match: `${teamA} vs ${teamB}`, outcome: 'Away Win', odds: validatedFields.data.oddsAway, estProbability: 26.5, value: 0.02 },
      ],
      recommendations: [
          { match: `${teamA} vs ${teamB}`, outcome: 'Home Win', value: 0.15, recommendedStake: 25.50 },
      ]
  }

  return { message: "Analysis complete.", data: mockData };
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
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { matchDescription, oddsTeamA, oddsDraw, oddsTeamB } = validatedFields.data;

  const mockData = {
    analysis: "Based on Team A's strong recent form and key player returning from injury, they appear to have a significant advantage over Team B, who has struggled in away games. The model reflects this, giving Team A a higher probability of winning than the market odds suggest, indicating a value bet.",
    valueBets: [
        { match: matchDescription, outcome: 'Team A Win', odds: oddsTeamA, estProbability: 55.0, value: 0.21 },
        { match: matchDescription, outcome: 'Draw', odds: oddsDraw, estProbability: 25.0, value: -0.10 },
        { match: matchDescription, outcome: 'Team B Win', odds: oddsTeamB, estProbability: 20.0, value: -0.25 },
    ]
  };

  return { message: "Analysis complete.", data: mockData };
}
