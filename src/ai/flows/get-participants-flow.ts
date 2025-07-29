
'use server';
/**
 * @fileOverview A Genkit flow to get a list of participants (teams/players) for a given sport.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetParticipantsInputSchema = z.object({
    sport: z.string().describe('The sport key to fetch participants for (e.g., soccer_spain_la_liga).'),
});
export type GetParticipantsInput = z.infer<typeof GetParticipantsInputSchema>;


const ParticipantSchema = z.object({
    id: z.string(),
    full_name: z.string(),
});

const GetParticipantsOutputSchema = z.object({
    participants: z.array(ParticipantSchema)
});
export type GetParticipantsOutput = z.infer<typeof GetParticipantsOutputSchema>;


export async function getParticipants(input: GetParticipantsInput): Promise<GetParticipantsOutput> {
  return getParticipantsFlow(input);
}


const getParticipantsFlow = ai.defineFlow(
  {
    name: 'getParticipantsFlow',
    inputSchema: GetParticipantsInputSchema,
    outputSchema: GetParticipantsOutputSchema,
  },
  async ({ sport }) => {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
      throw new Error('THE_ODDS_API_KEY is not configured in environment variables.');
    }

    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/participants?apiKey=${apiKey}`;

    try {
      const response = await fetch(apiUrl, { cache: 'no-store' });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch participants: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      const validatedData = z.array(ParticipantSchema).safeParse(data);

      if (!validatedData.success) {
        console.error("Zod validation error for participants:", validatedData.error.issues);
        return { participants: [] };
      }

      return { participants: validatedData.data };

    } catch (error) {
      console.error('Error in getParticipantsFlow:', error);
      throw error;
    }
  }
);
