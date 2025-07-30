
'use server';

import { z } from 'zod';
import { dataExplorer } from '@/ai/flows/data-explorer-flow';
import { quantitativeModel } from '@/ai/flows/quantitative-model-flow';
import { portfolioManager } from '@/ai/flows/portfolio-manager-flow';
import { calculateValueBetManual } from '@/ai/flows/calculate-value-bet-manual-flow';
import { analyzeSingleMatch } from '@/ai/flows/analyze-single-match-flow';
import { calculateBatchValueBets } from '@/ai/flows/calculate-batch-value-bets-flow';
import { calculateValueBetFromImage } from '@/ai/flows/calculate-value-bet-from-image-flow';
import { fetchDailySchedule } from '@/ai/flows/fetch-daily-schedule-flow';
import { fetchHistoricalOdds } from '@/ai/flows/fetch-historical-odds-flow';


export type ActionState = {
  message?: string;
  data?: any;
  fields?: Record<string, string>;
  issues?: string[];
};

const quantitativeSchema = z.object({
    teamA: z.string().min(1, { message: "El nombre del Equipo A es obligatorio." }),
    teamB: z.string().min(1, { message: "El nombre del Equipo B es obligatorio." }),
    teamAUrl: z.string().url({ message: "Por favor, introduce una URL válida para el Equipo A." }),
    teamBUrl: z.string().url({ message: "Por favor, introduce una URL válida para el Equipo B." }),
    leagueHomeAvg: z.coerce.number().gt(0, { message: "Debe ser mayor que 0." }),
    leagueAwayAvg: z.coerce.number().gt(0, { message: "Debe ser mayor que 0." }),
    oddsHome: z.coerce.number().gt(1, { message: "Las cuotas deben ser > 1." }),
    oddsDraw: z.coerce.number().gt(1, { message: "Las cuotas deben ser > 1." }),
    oddsAway: z.coerce.number().gt(1, { message: "Las cuotas deben ser > 1." }),
    bankroll: z.coerce.number().min(0, { message: "El bankroll no puede ser negativo." }),
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
        fields[key] = validatedFields.error.flatten().fieldErrors[key as keyof typeof fields]?.[0] ?? "";
    }
    return {
      message: "Error: Por favor, corrige los problemas a continuación.",
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
    const potentialBets = [
      { outcome: 'Victoria Local', odds: oddsHome, modelProbability: modelProbabilities.homeWin, value: modelProbabilities.homeWin * oddsHome - 1 },
      { outcome: 'Empate', odds: oddsDraw, modelProbability: modelProbabilities.draw, value: modelProbabilities.draw * oddsDraw - 1 },
      { outcome: 'Victoria Visitante', odds: oddsAway, modelProbability: modelProbabilities.awayWin, value: modelProbabilities.awayWin * oddsAway - 1 },
    ];
    
    // 3. Portfolio Manager Flow
    const recommendations = await portfolioManager({
        bankroll,
        stakingStrategy: stakingStrategy as any,
        potentialBets: potentialBets
            .filter(bet => bet.value > 0)
            .map(bet => ({ ...bet, matchDescription })),
    });
    
    const valueBets = potentialBets.map(bet => ({
        match: matchDescription,
        outcome: bet.outcome,
        odds: bet.odds,
        estProbability: bet.modelProbability * 100,
        value: bet.value,
    }));
    
    const responseData = {
        valueBets,
        recommendations: recommendations.filter(rec => rec.recommendedStake > 0),
    };

    return { message: "Análisis completado.", data: responseData };
  } catch (e: any) {
    return {
      message: `Ha ocurrido un error inesperado: ${e.message || 'Error desconocido'}.`,
      issues: [e.message || 'Error desconocido'],
    };
  }
}

// Zod schema for manual analysis, using a discriminated union
const FootballInputSchema = z.object({
  sport: z.literal('futbol'),
  equipo_a_nombre: z.string().min(1, { message: "Obligatorio" }),
  equipo_b_nombre: z.string().min(1, { message: "Obligatorio" }),
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
  jugador_a_nombre: z.string().min(1, { message: "Obligatorio" }),
  jugador_b_nombre: z.string().min(1, { message: "Obligatorio" }),
  cuota_jugador_a: z.coerce.number().gt(1),
  cuota_jugador_b: z.coerce.number().gt(1),
  superficie: z.string().min(1, { message: "Obligatorio" }),
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
      message: "Error: Por favor, corrige los problemas a continuación.",
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

    return { message: "Análisis completado.", data: responseData };
  } catch (e: any) {
     return {
      message: `Ha ocurrido un error inesperado: ${e.message || 'Error desconocido'}.`,
      issues: [e.message || 'Error desconocido'],
    };
  }
}

const singleMatchSchema = z.object({
  match: z.string().min(1, { message: "Los detalles del partido son obligatorios." }),
});

export async function handleSingleMatchAnalysis(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = singleMatchSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key as keyof typeof fields]?.[0] ?? "";
    }
    return {
      message: "Error: Por favor, corrige los problemas a continuación.",
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
            { match: matchDescription, outcome: `Gana ${result.teamA}`, odds: result.odds.teamA, estProbability: 0, value: 0 },
            { match: matchDescription, outcome: 'Empate', odds: result.odds.draw || 0, estProbability: 0, value: 0 },
            { match: matchDescription, outcome: `Gana ${result.teamB}`, odds: result.odds.teamB, estProbability: 0, value: 0 },
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

    return { message: "Análisis completado.", data: responseData };
  } catch (e: any) {
    return {
      message: `Ha ocurrido un error inesperado: ${e.message || 'Error desconocido'}.`,
      issues: [e.message || 'Error desconocido'],
    };
  }
}


const batchSchema = z.object({
  matchesText: z.string().min(1, { message: "La lista de partidos es obligatoria." }),
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
        fields[key] = validatedFields.error.flatten().fieldErrors[key as keyof typeof fields]?.[0] ?? "";
    }
    return {
      message: "Error: Por favor, corrige los problemas a continuación.",
      issues: validatedFields.error.flatten().formErrors,
      fields,
    };
  }

  try {
    const { analyzedMatches } = await calculateBatchValueBets(validatedFields.data);

    // Transform the raw analysis into the structure ResultsDisplay expects
    const responseData = {
      isBatch: true,
      batchAnalysis: analyzedMatches,
      valueBets: [], 
      recommendations: [],
    };


    return { message: `${analyzedMatches.length} partidos analizados.`, data: responseData };
  } catch (e: any) {
    const message = e.message.includes('QUOTA_EXCEEDED') 
        ? 'Has alcanzado tu límite de análisis. Actualiza a Premium para continuar.'
        : `Ha ocurrido un error inesperado: ${e.message || 'Error desconocido'}.`;

    return {
        message: message,
        issues: [message]
    };
  }
}

const imageSchema = z.object({
    image: z.instanceof(File).refine(file => file.size > 0, 'Se requiere una imagen.'),
});

function toDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function handleImageAnalysis(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = imageSchema.safeParse({ image: formData.get('image') });

  if (!validatedFields.success) {
    return {
      message: 'Error de validación.',
      issues: validatedFields.error.flatten().formErrors,
      fields: { image: validatedFields.error.flatten().fieldErrors.image?.[0] ?? '' }
    };
  }

  try {
    const imageDataUri = await toDataURL(validatedFields.data.image);
    const { analyzedMatches } = await calculateValueBetFromImage({ imageDataUri });

    const responseData = {
      isBatch: true, // Treat as batch for display purposes
      batchAnalysis: analyzedMatches,
      valueBets: [], 
      recommendations: [],
    };

    return { message: `${analyzedMatches.length} partidos extraídos de la imagen.`, data: responseData };
  } catch (e: any) {
    return {
      message: `Ha ocurrido un error inesperado: ${e.message || 'Error desconocido'}.`,
      issues: [e.message || 'Error desconocido'],
    };
  }
}


const liveOddsSchema = z.object({
  sport: z.string().min(1, { message: 'El deporte es obligatorio.' }),
});

export async function handleFetchDailySchedule(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = liveOddsSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key as keyof typeof fields]?.[0] ?? "";
    }
    return {
      message: "Error: Por favor, corrige los problemas a continuación.",
      issues: validatedFields.error.flatten().formErrors,
      fields,
    };
  }

  try {
    const { matches } = await fetchDailySchedule(validatedFields.data);

    if (matches.length === 0) {
      return { message: "No se encontraron partidos programados para los criterios seleccionados." };
    }

    return { message: `Se encontraron ${matches.length} partidos.`, data: { matches, isLiveOdds: true } };
  } catch (e: any) {
    return {
      message: `Error al obtener la programación: ${e.message || 'Error desconocido'}.`,
      issues: [e.message || 'Error desconocido'],
    };
  }
}

const simulationSchema = z.object({
  sport: z.string().min(1, { message: 'El deporte es obligatorio.' }),
  date: z.string().min(1, { message: 'La fecha es obligatoria.' }),
});

export async function handleRunSimulation(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = simulationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = validatedFields.error.flatten().fieldErrors[key as keyof typeof fields]?.[0] ?? "";
    }
    return {
      message: "Error de validación.",
      issues: validatedFields.error.flatten().formErrors,
      fields,
    };
  }

  try {
    const results = await fetchHistoricalOdds(validatedFields.data);
    
    return { message: `Simulación completada. Se encontraron ${results.data.length} partidos.`, data: { ...results, isSimulation: true } };
  } catch (e: any) {
    return {
      message: `Error al ejecutar la simulación: ${e.message || 'Error desconocido'}.`,
      issues: [e.message || 'Error desconocido'],
    };
  }
}
