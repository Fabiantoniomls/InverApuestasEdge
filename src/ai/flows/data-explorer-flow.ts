'use server';
/**
 * @fileOverview Extracts team statistics from a given URL.
 *
 * - dataExplorer - A function that handles the data extraction process.
 * - DataExplorerInput - The input type for the dataExplorer function.
 * - DataExplorerOutput - The return type for the dataExplorer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataExplorerInputSchema = z.object({
  teamName: z.string().describe('The name of the team to extract statistics for.'),
  dataSourceUrl: z.string().url().describe('The URL of the data source (e.g., FBref.com).'),
});
export type DataExplorerInput = z.infer<typeof DataExplorerInputSchema>;

const DataExplorerOutputSchema = z.object({
  teamName: z.string(),
  stats: z.object({
    home: z.object({
      gamesPlayed: z.number().int(),
      goalsFor: z.number().int(),
      goalsAgainst: z.number().int(),
      expectedGoalsFor: z.number(),
      expectedGoalsAgainst: z.number(),
    }),
    away: z.object({
      gamesPlayed: z.number().int(),
      goalsFor: z.number().int(),
      goalsAgainst: z.number().int(),
      expectedGoalsFor: z.number(),
      expectedGoalsAgainst: z.number(),
    }),
  }),
});
export type DataExplorerOutput = z.infer<typeof DataExplorerOutputSchema>;

export async function dataExplorer(input: DataExplorerInput): Promise<DataExplorerOutput> {
  return dataExplorerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dataExplorerPrompt',
  input: {schema: DataExplorerInputSchema},
  output: {schema: DataExplorerOutputSchema},
  prompt: `Eres un asistente de extracción de datos deportivos altamente preciso. Tu tarea es analizar el contenido HTML de la URL proporcionada y extraer las estadísticas clave para el equipo especificado. Ignora cualquier elemento de navegación, anuncios o texto irrelevante. Enfócate únicamente en las tablas de estadísticas.

URL: {{{dataSourceUrl}}}
Equipo: {{{teamName}}}

Extrae las siguientes métricas y devuélvelas en un formato JSON estricto. No incluyas ninguna explicación, solo el objeto JSON.
`,
});

const dataExplorerFlow = ai.defineFlow(
  {
    name: 'dataExplorerFlow',
    inputSchema: DataExplorerInputSchema,
    outputSchema: DataExplorerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
