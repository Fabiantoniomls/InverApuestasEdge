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
  matchesText: z.string().describe('A block of text containing multiple match details.'),
});
export type ExtractMatchesInput = z.infer<typeof ExtractMatchesInputSchema>;


export async function extractMatches(input: ExtractMatchesInput): Promise<ExtractMatchesOutput> {
  return extractMatchesFlow(input);
}

const prompt = ai.definePrompt({
    name: 'extractMatchesPrompt',
    input: { schema: ExtractMatchesInputSchema },
    output: { schema: ExtractMatchesOutputSchema },
    prompt: `You are a text processing expert. Your task is to extract individual sports match details from a given block of text. Each match is usually on its own line or separated by a clear delimiter.

Analyze the following text and return an array of strings, where each string is a self-contained description of a single match.

Text to process:
"{{{matchesText}}}"

Extract the matches into a JSON array.`,
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
