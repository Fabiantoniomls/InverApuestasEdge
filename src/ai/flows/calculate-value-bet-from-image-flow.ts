'use server';
/**
 * @fileOverview A Genkit flow that analyzes an image of sports odds and extracts match data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AnalyzeSingleMatchOutputSchema, AnalyzeSingleMatchOutput } from '../schemas';

const CalculateValueBetFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of sports odds, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CalculateValueBetFromImageInput = z.infer<typeof CalculateValueBetFromImageInputSchema>;

const CalculateValueBetFromImageOutputSchema = z.object({
  analyzedMatches: z.array(AnalyzeSingleMatchOutputSchema).describe('An array of structured analysis objects, one for each match found in the image.'),
});
export type CalculateValueBetFromImageOutput = z.infer<typeof CalculateValueBetFromImageOutputSchema>;


export async function calculateValueBetFromImage(input: CalculateValueBetFromImageInput): Promise<CalculateValueBetFromImageOutput> {
  return calculateValueBetFromImageFlow(input);
}


const extractMatchesFromImagePrompt = ai.definePrompt({
    name: 'extractMatchesFromImagePrompt',
    input: { schema: CalculateValueBetFromImageInputSchema },
    output: { schema: z.object({
        matches: z.array(z.object({
            teamA: z.string(),
            teamB: z.string(),
            oddsA: z.number(),
            oddsB: z.number(),
            drawOdds: z.number().optional(),
        }))
    })},
    prompt: `You are an expert at extracting structured data from images.
Analyze the provided image which contains a list of sports matches and their odds.
Extract each match into a structured object with the participants and their odds.

Image: {{media url=imageDataUri}}

Identify Team A, Team B, and their respective decimal odds for winning.
Return an array of all matches found in the image.`,
});

const calculateValueBetFromImageFlow = ai.defineFlow(
  {
    name: 'calculateValueBetFromImageFlow',
    inputSchema: CalculateValueBetFromImageInputSchema,
    outputSchema: CalculateValueBetFromImageOutputSchema,
  },
  async (input) => {
    const { output } = await extractMatchesFromImagePrompt(input);
    if (!output) {
      return { analyzedMatches: [] };
    }

    // Transform the extracted data to match the standard analysis output format.
    const analyzedMatches: AnalyzeSingleMatchOutput[] = output.matches.map(match => ({
        teamA: match.teamA,
        teamB: match.teamB,
        odds: {
            teamA: match.oddsA,
            teamB: match.oddsB,
            draw: match.drawOdds,
        },
        analysis: 'Odds extracted from image. Further analysis required.',
        valueBetFound: false, // Default to false as we only extracted odds.
        recommendation: 'N/A'
    }));
    
    return { analyzedMatches };
  }
);
