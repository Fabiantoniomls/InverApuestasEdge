'use server';
/**
 * @fileOverview A Genkit flow for analyzing news articles to extract qualitative insights.
 *
 * - qualitativeInsight - A function that analyzes articles and returns structured insights.
 * - QualitativeInsightInput - The input type for the function.
 * - QualitativeInsightOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QualitativeInsightInputSchema = z.object({
  equipo_local: z.string().describe('The name of the home team.'),
  equipo_visitante: z.string().describe('The name of the away team.'),
  contenido_articulos: z.string().describe('The full text content of news articles or reports to be analyzed.'),
});
export type QualitativeInsightInput = z.infer<typeof QualitativeInsightInputSchema>;

const TeamAnalysisSchema = z.object({
  teamName: z.string(),
  sentiment: z.enum(['Positive', 'Neutral', 'Negative']),
  keyFactors: z.array(z.string()),
  adjustmentFactor: z.number(),
});

const QualitativeInsightOutputSchema = z.object({
  qualitativeSummary: z.string().describe('A concise summary integrating key factors and sentiment analysis.'),
  teamAnalysis: z.array(TeamAnalysisSchema),
});
export type QualitativeInsightOutput = z.infer<typeof QualitativeInsightOutputSchema>;


export async function qualitativeInsight(input: QualitativeInsightInput): Promise<QualitativeInsightOutput> {
  return qualitativeInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'qualitativeInsightPrompt',
  input: { schema: QualitativeInsightInputSchema },
  output: { schema: QualitativeInsightOutputSchema },
  prompt: `Actúa como un analista deportivo de élite y un experto en procesamiento de lenguaje natural. Tu tarea es analizar el siguiente conjunto de artículos de noticias y reportes previos al partido para el próximo enfrentamiento entre {{{equipo_local}}} y {{{equipo_visitante}}}.

Contenido de los Artículos:
"""
{{{contenido_articulos}}}
"""

Realiza las siguientes tareas:
1.  **Identifica Factores Clave:** Extrae los temas más importantes que podrían impactar el resultado del partido. Enfócate específicamente en:
    *   Lesiones de jugadores clave o suspensiones.
    *   Estado de forma reciente y moral del equipo (rachas de victorias/derrotas, comentarios de jugadores/entrenadores).
    *   Cambios tácticos o estratégicos mencionados.
    *   Conflictos internos o noticias extradeportivas relevantes.
2.  **Análisis de Sentimiento por Equipo:** Para cada equipo, determina el sentimiento general (Positivo, Neutral, Negativo) que se desprende de los artículos.
3.  **Resumen del Analista:** Escribe un resumen conciso (máximo 150 palabras) que integre los factores clave y el análisis de sentimiento, proporcionando una perspectiva cualitativa sobre el partido.
4.  **Factor de Ajuste Cualitativo:** Basado en tu análisis, proporciona un 'Factor de Ajuste' numérico para cada equipo, que va de -5.0 a +5.0. Un valor positivo indica que los factores cualitativos favorecen a ese equipo más de lo que las estadísticas podrían sugerir. Un valor negativo indica problemas o desventajas ocultas.

Devuelve tu respuesta en el siguiente formato JSON estricto.`,
});

const qualitativeInsightFlow = ai.defineFlow(
  {
    name: 'qualitativeInsightFlow',
    inputSchema: QualitativeInsightInputSchema,
    outputSchema: QualitativeInsightOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
