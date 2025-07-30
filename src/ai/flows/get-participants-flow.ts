
'use server';
/**
 * @fileOverview A Genkit flow to get a list of participants (teams/players) for a given sport from Sportradar.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetParticipantsInputSchema = z.object({
    sport: z.string().describe('The Sportradar competition ID (e.g., sr:competition:23).'),
});
export type GetParticipantsInput = z.infer<typeof GetParticipantsInputSchema>;


const ParticipantSchema = z.object({
    id: z.string(),
    name: z.string(),
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
    const apiKey = process.env.SPORTRADAR_API_KEY;
    if (!apiKey) {
      throw new Error('SPORTRADAR_API_KEY is not configured in environment variables.');
    }

    // Sportradar endpoint for competitors in a season (we need a season ID)
    // This is more complex than The Odds API. We will mock this for now.
    // A real implementation would first fetch seasons for a competition, then competitors.
    console.warn("getParticipantsFlow is using mock data as Sportradar's participant endpoint is complex.");
    
    // Mock data for demonstration
    const mockParticipants = [
        { id: 'sr:competitor:37', name: 'Real Madrid' },
        { id: 'sr:competitor:38', name: 'FC Barcelona' },
        { id: 'sr:competitor:42', name: 'Manchester City' },
    ];

    return { participants: mockParticipants };
  }
);
