'use server';
/**
 * @fileOverview A Genkit flow for synthesizing predictions from multiple quantitative models.
 *
 * - multiModelAnalysis - A function that synthesizes probabilities into a consensus.
 * - MultiModelAnalysisInput - The input type for the function.
 * - MultiModelAnalysisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ModelProbabilitiesSchema = z.object({
  homeWin: z.number().describe('Home win probability as a percentage (e.g., 45.5).'),
  draw: z.number().describe('Draw probability as a percentage.'),
  awayWin: z.number().describe('Away win probability as a percentage.'),
});

const MultiModelAnalysisInputSchema = z.object({
  equipo_local: z.string().describe('The name of the home team.'),
  equipo_visitante: z.string().describe('The name of the away team.'),
  poissonModel: ModelProbabilitiesSchema.describe('Probabilities from the Poisson model.'),
  eloModel: ModelProbabilitiesSchema.describe('Probabilities from the Elo rating model.'),
  mlModel: ModelProbabilitiesSchema.describe('Probabilities from the calibrated Machine Learning (SVM) model.'),
});
export type MultiModelAnalysisInput = z.infer<typeof MultiModelAnalysisInputSchema>;

const MultiModelAnalysisOutputSchema = z.object({
  consensusProbability: z.object({
    homeWin: z.number().describe('The consensus home win probability as a float (e.g., 0.462).'),
    draw: z.number().describe('The consensus draw probability as a float.'),
    awayWin: z.number().describe('The consensus away win probability as a float.'),
  }),
  analystReasoning: z.string().describe("A brief explanation of how the consensus was reached, noting any significant model convergences or divergences."),
});
export type MultiModelAnalysisOutput = z.infer<typeof MultiModelAnalysisOutputSchema>;


export async function multiModelAnalysis(input: MultiModelAnalysisInput): Promise<MultiModelAnalysisOutput> {
  return multiModelAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multiModelAnalysisPrompt',
  input: { schema: MultiModelAnalysisInputSchema },
  output: { schema: MultiModelAnalysisOutputSchema },
  prompt: `Actúa como un analista cuantitativo experto en deportes. Se te han proporcionado las probabilidades de resultado para un partido de fútbol desde tres modelos predictivos independientes.

Partido: {{{equipo_local}}} vs {{{equipo_visitante}}}

Probabilidades del Modelo Poisson:
- Victoria Local: {{{poissonModel.homeWin}}}%
- Empate: {{{poissonModel.draw}}}%
- Victoria Visitante: {{{poissonModel.awayWin}}}%

Probabilidades del Modelo Elo:
- Victoria Local: {{{eloModel.homeWin}}}%
- Empate: {{{eloModel.draw}}}%
- Victoria Visitante: {{{eloModel.awayWin}}}%

Probabilidades del Modelo ML Calibrado (SVM):
- Victoria Local: {{{mlModel.homeWin}}}%
- Empate: {{{mlModel.draw}}}%
- Victoria Visitante: {{{mlModel.awayWin}}}%

Tu tarea es:
1.  Sintetizar estas tres predicciones en una única 'Probabilidad de Consenso' para cada resultado (Victoria Local, Empate, Victoria Visitante). Puedes usar un promedio ponderado o un método más sofisticado si lo consideras apropiado.
2.  Proporcionar un breve 'Razonamiento del Analista' (máximo 100 palabras) explicando cómo llegaste a la probabilidad de consenso, destacando cualquier convergencia o divergencia significativa entre los modelos.

Devuelve tu respuesta en el siguiente formato JSON estricto:
`,
});

const multiModelAnalysisFlow = ai.defineFlow(
  {
    name: 'multiModelAnalysisFlow',
    inputSchema: MultiModelAnalysisInputSchema,
    outputSchema: MultiModelAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
