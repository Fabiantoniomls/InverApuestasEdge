import { z } from 'zod';

export const AnalyzeSingleMatchOutputSchema = z.object({
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
});
export type AnalyzeSingleMatchOutput = z.infer<typeof AnalyzeSingleMatchOutputSchema>;
