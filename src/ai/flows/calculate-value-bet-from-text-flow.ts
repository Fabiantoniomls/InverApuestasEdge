'use server';
/**
 * @fileOverview Flujo de Genkit que genera un análisis estructurado y ficticio
 * a partir de una simple cadena de texto de un partido.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- Esquemas ---
const CalculateValueBetFromTextInputSchema = z.object({
  matchesText: z
    .string()
    .describe(
      'Detalles de los partidos, ej: "Adrian Mannarino 1.80 vs Valentin Royer 2.10\\nNovak Djokovic 1.50 vs Carlos Alcaraz 2.50"'
    ),
  sportKey: z.string().describe('Clave del deporte, ej: tennis_atp_wimbledon'),
});
export type CalculateValueBetFromTextInput = z.infer<typeof CalculateValueBetFromTextInputSchema>;


const CalculateValueBetFromTextOutputSchema = z.object({
  analyzedMatches: z.array(z.object({
    teamA: z.string().describe("Name of Team A"),
    teamB: z.string().describe("Name of Team B"),
    odds: z.object({
        teamA: z.number().describe("Decimal odds for Team A to win"),
        teamB: z.number().describe("Decimal odds for Team B to win"),
        draw: z.number().optional().describe("Decimal odds for a draw")
    }),
    analysis: z.string().describe("Detailed qualitative analysis of the match"),
    valueBetFound: z.boolean().describe("Whether a value bet opportunity was identified"),
    recommendation: z.string().optional().describe("The recommended bet (e.g., 'Team A to win') if a value bet is found")
  })).describe('An array of structured analysis objects, one for each match found in the text.'),
});
export type CalculateValueBetFromTextOutput = z.infer<typeof CalculateValueBetFromTextOutputSchema>;


const simpleAnalysisPrompt = ai.definePrompt({
    name: 'simpleBettingAnalysisPrompt',
    input: { schema: z.object({match: z.string()}) },
    output: { schema: z.object({
      teamA: z.string().describe("Name of Team A"),
      teamB: z.string().describe("Name of Team B"),
      odds: z.object({
          teamA: z.number().describe("Decimal odds for Team A to win"),
          teamB: z.number().describe("Decimal odds for Team B to win"),
          draw: z.number().optional().describe("Decimal odds for a draw")
      }),
      analysis: z.string().describe("Detailed qualitative analysis of the match"),
      valueBetFound: z.boolean().describe("Whether a value bet opportunity was identified"),
      recommendation: z.string().optional().describe("The recommended bet (e.g., 'Team A to win') if a value bet is found")
    })},
    prompt: `
      Eres Inverapuestas AI, un analista experto.
      Tu tarea es generar un análisis de valor ficticio y estructurado para el partido: "{{match}}".

      Rellena todos los campos del objeto JSON de salida con datos ficticios pero coherentes.
      - El análisis debe ser de 1-2 líneas.
      - La probabilidad debe ser un porcentaje.
      - El cálculo de valor debe seguir la fórmula (probabilidad * cuota) - 1.
      - El veredicto debe ser una sentencia final clara.
      - La etiqueta de valor debe ser "Apuesta de Valor" si el resultado es > 0, o "Sin Valor" si es <= 0.
    `,
});

export async function calculateBatchValueBetsFromText(input: CalculateValueBetFromTextInput): Promise<CalculateValueBetFromTextOutput> {
  return calculateValueBetFromTextFlow(input);
}

const calculateValueBetFromTextFlow = ai.defineFlow(
  {
    name: 'calculateValueBetFromTextFlow',
    inputSchema: CalculateValueBetFromTextInputSchema,
    outputSchema: CalculateValueBetFromTextOutputSchema,
  },
  async (input) => {
    const { matches } = await ai.generate({
        prompt: `Extrae los partidos del siguiente texto en un array de strings: ${input.matchesText}`,
        output: {
            schema: z.object({
                matches: z.array(z.string()),
            })
        }
    });

    const analyzedMatches = await Promise.all(matches.map(async (match) => {
        const { output } = await simpleAnalysisPrompt({match});
        return output!;
    }));

    return { analyzedMatches };
  }
);
