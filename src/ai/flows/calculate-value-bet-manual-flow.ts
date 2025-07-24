
'use server';
/**
 * @fileOverview Flujo de Genkit para calcular apuestas de valor a partir de datos manuales,
 * utilizando un tipado estricto por deporte.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- PASO 1: Refactorizar el Esquema de Entrada con `discriminatedUnion` ---

// Esquema base y estricto para Fútbol
const FootballInputSchema = z.object({
  sport: z.literal('futbol'),
  equipo_a_nombre: z.string(),
  equipo_b_nombre: z.string(),
  cuota_equipo_a: z.coerce.number(),
  cuota_empate: z.coerce.number(),
  cuota_equipo_b: z.coerce.number(),
  liga_goles_local_promedio: z.coerce.number(),
  liga_goles_visitante_promedio: z.coerce.number(),
  equipo_a_xgf: z.coerce.number(),
  equipo_a_xga: z.coerce.number(),
  equipo_b_xgf: z.coerce.number(),
  equipo_b_xga: z.coerce.number(),
});

// Esquema base y estricto para Tenis
const TennisInputSchema = z.object({
  sport: z.literal('tenis'),
  jugador_a_nombre: z.string(),
  jugador_b_nombre: z.string(),
  cuota_jugador_a: z.coerce.number(),
  cuota_jugador_b: z.coerce.number(),
  superficie: z.string(),
  jugador_a_primer_servicio_pct: z.coerce.number(),
  jugador_a_puntos_ganados_1er_serv_pct: z.coerce.number(),
  jugador_a_puntos_ganados_2do_serv_pct: z.coerce.number(),
  jugador_b_primer_servicio_pct: z.coerce.number(),
  jugador_b_puntos_ganados_1er_serv_pct: z.coerce.number(),
  jugador_b_puntos_ganados_2do_serv_pct: z.coerce.number(),
});

// Unión discriminada: Zod validará que los datos correspondan al 'sport' indicado.
const CalculateValueBetManualInputSchema = z.discriminatedUnion('sport', [
  FootballInputSchema,
  TennisInputSchema,
]);

export type CalculateValueBetManualInput = z.infer<typeof CalculateValueBetManualInputSchema>;

// El esquema de salida sigue siendo robusto.
const ValueBetSchema = z.object({
  market: z.string().describe('El mercado de apuestas.'),
  odds: z.number().describe('La cuota para el mercado.'),
  probability: z.number().describe('La probabilidad estimada del resultado (en decimal, ej: 0.55).'),
  expectedValue: z.number().describe('El valor esperado de la apuesta.'),
});

const CalculateValueBetManualOutputSchema = z.object({
  analysis: z.string().describe('El análisis cualitativo del partido generado por la IA.'),
  valueBets: z.array(ValueBetSchema).describe('Un array con las apuestas de valor encontradas.'),
});
export type CalculateValueBetManualOutput = z.infer<typeof CalculateValueBetManualOutputSchema>;

// --- PASO 2: Simplificar el Prompt ---
// El prompt ya no calcula, solo analiza y estima probabilidades.
const analysisPrompt = ai.definePrompt({
  name: 'generateQualitativeAnalysisPrompt',
  // El input es un objeto genérico, ya que la lógica está en el flujo.
  input: { schema: z.object({ sport: z.string(), context: z.string() }) },
  // La salida es solo el texto del análisis y las probabilidades estimadas.
  output: { schema: z.object({
      analysisText: z.string(),
      probabilities: z.record(z.number()) // ej: { "local": 0.5, "draw": 0.2, "visitor": 0.3 }
  })},
  prompt: `
    Eres un analista deportivo experto. Basado en los siguientes datos para un partido de {{sport}}:

    {{{context}}}

    1.  Escribe un análisis cualitativo detallado sobre el enfrentamiento.
    2.  Estima las probabilidades reales (en decimal) para los mercados principales y devuélvelas en el campo 'probabilities'.
        Para futbol, usa las claves "local", "draw", "visitor".
        Para tenis, usa las claves "playerA", "playerB".
  `,
});


export async function calculateValueBetManual(input: CalculateValueBetManualInput): Promise<CalculateValueBetManualOutput> {
  return calculateValueBetManualFlow(input);
}

// --- PASO 3: Reconstruir el Flujo con la Lógica de Negocio ---
const calculateValueBetManualFlow = ai.defineFlow(
  {
    name: 'calculateValueBetManualFlow',
    inputSchema: CalculateValueBetManualInputSchema,
    outputSchema: CalculateValueBetManualOutputSchema,
  },
  async (input) => {
    // 1. Llamar a la IA para obtener el análisis y las probabilidades estimadas.
    const { output: llmOutput } = await analysisPrompt({
        sport: input.sport,
        context: JSON.stringify(input, null, 2) // Enviamos todo el contexto validado
    });
    if (!llmOutput) {
        throw new Error("La IA no pudo generar un análisis.");
    }

    const { analysisText, probabilities } = llmOutput;
    const valueBets: z.infer<typeof ValueBetSchema>[] = [];

    // 2. Realizar los cálculos matemáticos en TypeScript.
    // La lógica de cálculo ahora es determinista y fiable.
    if (input.sport === 'futbol') {
        const markets = [
            { market: `Gana ${input.equipo_a_nombre}`, odds: input.cuota_equipo_a, probKey: "local" },
            { market: 'Empate', odds: input.cuota_empate, probKey: "draw" },
            { market: `Gana ${input.equipo_b_nombre}`, odds: input.cuota_equipo_b, probKey: "visitor" },
        ];
        for (const m of markets) {
            const prob = probabilities[m.probKey] || 0;
            const ev = (prob * m.odds) - 1;
            if (ev > 0) { // Solo añadir si es una apuesta de valor.
                valueBets.push({ market: m.market, odds: m.odds, probability: prob, expectedValue: ev });
            }
        }
    } else if (input.sport === 'tenis') {
        const markets = [
            { market: `Gana ${input.jugador_a_nombre}`, odds: input.cuota_jugador_a, probKey: "playerA" },
            { market: `Gana ${input.jugador_b_nombre}`, odds: input.cuota_jugador_b, probKey: "playerB" },
        ];
        for (const m of markets) {
            const prob = probabilities[m.probKey] || 0;
            const ev = (prob * m.odds) - 1;
            if (ev > 0) {
                valueBets.push({ market: m.market, odds: m.odds, probability: prob, expectedValue: ev });
            }
        }
    }
    
    // 3. Devolver el resultado combinado.
    return {
      analysis: analysisText,
      valueBets: valueBets,
    };
  }
);
