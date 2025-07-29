
'use server';
/**
 * @fileOverview A Genkit flow to get a filtered, sorted, and paginated list of matches.
 * This simulates a Cloud Function that would query a Firestore database.
 * 
 * - getMatches - A function that returns a list of matches based on filters.
 * - GetMatchesInput - The input type for the function.
 * - GetMatchesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { GetMatchesResponse, Match } from '@/lib/types';
import { leagues, teams, matches as allMatches } from './_data/mock-data'; // Using mock data

const GetMatchesInputSchema = z.object({
    leagues: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minValue: z.number().optional(),
    minOdds: z.number().optional(),
    maxOdds: z.number().optional(),
    markets: z.array(z.string()).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
});

export type GetMatchesInput = z.infer<typeof GetMatchesInputSchema>;


export async function getMatches(input: GetMatchesInput): Promise<GetMatchesResponse> {
  return getMatchesFlow(input);
}


const getMatchesFlow = ai.defineFlow(
  {
    name: 'getMatchesFlow',
    inputSchema: GetMatchesInputSchema,
    outputSchema: z.any(), // Using any because GetMatchesResponse is complex
  },
  async (filters) => {
    // This is where you would normally query Firestore.
    // For this prototype, we'll filter the mock data.
    
    let filteredMatches = [...allMatches];

    // Filtering logic
    if (filters.leagues && filters.leagues.length > 0 && filters.leagues.join('') !== '') {
      filteredMatches = filteredMatches.filter(match => filters.leagues!.includes(match.league.id));
    }
    if (filters.startDate) {
      filteredMatches = filteredMatches.filter(match => new Date(match.startTime) >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      filteredMatches = filteredMatches.filter(match => new Date(match.startTime) <= new Date(filters.endDate!));
    }
    if (filters.minValue) {
      filteredMatches = filteredMatches.filter(match => (match.valueScore || 0) >= filters.minValue!);
    }
     if (filters.minOdds) {
      filteredMatches = filteredMatches.filter(match => (match.odds?.home || 0) >= filters.minOdds!);
    }
    if (filters.maxOdds) {
      filteredMatches = filteredMatches.filter(match => (match.odds?.home || 0) <= filters.maxOdds!);
    }

    // Sorting logic
    if (filters.sortBy) {
        filteredMatches.sort((a, b) => {
            const aVal = (a as any)[filters.sortBy!] ?? 0;
            const bVal = (b as any)[filters.sortBy!] ?? 0;
            if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Pagination logic
    const totalMatches = filteredMatches.length;
    const limit = filters.limit ?? 10;
    const page = filters.page ?? 1;
    const totalPages = Math.ceil(totalMatches / limit);
    const startIndex = (page - 1) * limit;
    const paginatedMatches = filteredMatches.slice(startIndex, startIndex + limit);


    return {
      data: paginatedMatches,
      totalMatches,
      totalPages,
      currentPage: page,
    };
  }
);
