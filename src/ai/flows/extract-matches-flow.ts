'use server';
/**
 * @fileOverview Extracts individual match strings from a larger block of text.
 *
 * - extractMatches - A function that handles the match extraction process.
 * - ExtractMatchesInput - The input type for the function.
 * - ExtractMatchesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ExtractMatchesOutput, ExtractMatchesOutputSchema } from '../schemas';

const ExtractMatchesInputSchema = z.object({
  matchesText: z.string().describe('Un bloque de texto con los detalles de múltiples partidos.'),
});
export type ExtractMatchesInput = z.infer<typeof ExtractMatchesInputSchema>;


export async function extractMatches(input: ExtractMatchesInput): Promise<ExtractMatchesOutput> {
  return extractMatchesFlow(input);
}


const prompt = ai.definePrompt({
  name: 'extractMatchesPrompt',
  input: {schema: ExtractMatchesInputSchema},
  output: {schema: ExtractMatchesOutputSchema},
  prompt: `A partir del siguiente texto, identifica y extrae cada partido individual.
Los partidos pueden estar separados por saltos de línea, comas, o simplemente estar en líneas consecutivas.
Devuelve el resultado como un array de strings en formato JSON, donde cada string del array contenga el texto completo de un único partido.

Texto:
"{{{matchesText}}}"
`,
});

const extractMatchesFlow = ai.defineFlow(
  {
    name: 'extractMatchesFlow',
    inputSchema: ExtractMatchesInputSchema,
    outputSchema: ExtractMatchesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
