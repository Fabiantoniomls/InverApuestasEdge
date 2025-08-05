'use server';
/**
 * @fileOverview The main orchestrator flow for analyzing a match.
 * This flow gathers data from various sources and models to build a comprehensive analysis payload.
 *
 * - masterAnalysisFlow - The main orchestrator function.
 * - MasterAnalysisInput - The input type for the flow.
 * - MasterAnalysisOutput - The return type for the flow (conforms to AnalysisPayload).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AnalysisPayload } from '@/lib/types';
import { dataExplorer, DataExplorerOutput } from './data-explorer-flow';
import { quantitativeModel, QuantitativeModelOutput } from './quantitative-model-flow';
import { fetchLiveOdds } from './fetch-live-odds-flow';

const MasterAnalysisInputSchema = z.object({
  sport: z.enum(['football', 'tennis']),
  teamAName: z.string(),
  teamBName: z.string(),
  teamAUrl: z.string().url(),
  teamBUrl: z.string().url(),
  marketOdds: z.object({
    home: z.coerce.number(),
    draw: z.coerce.number(),
    away: z.coerce.number(),
  }),
  leagueAverages: z.object({
      homeGoals: z.coerce.number(),
      awayGoals: z.coerce.number(),
  }),
});

export type MasterAnalysisInput = z.infer<typeof MasterAnalysisInputSchema>;
export type MasterAnalysisOutput = AnalysisPayload;

export async function masterAnalysis(input: MasterAnalysisInput): Promise<MasterAnalysisOutput> {
  return masterAnalysisFlow(input);
}

const masterAnalysisFlow = ai.defineFlow(
  {
    name: 'masterAnalysisFlow',
    inputSchema: MasterAnalysisInputSchema,
    outputSchema: z.any(), // Using any because AnalysisPayload is an interface
  },
  async (input) => {
    
    const participants = `${input.teamAName} vs ${input.teamBName}`;

    // 1. Initialize the payload
    const analysisPayload: AnalysisPayload = {
        matchDetails: {
            sport: input.sport,
            participants: participants,
            marketOdds: input.marketOdds,
        },
        liveOdds: null, // Will be populated later
    };

    try {
        // 2. Invoke data explorers and live odds in parallel
        const [teamADataResult, teamBDataResult, liveOddsResult] = await Promise.allSettled([
            dataExplorer({ teamName: input.teamAName, dataSourceUrl: input.teamAUrl }),
            dataExplorer({ teamName: input.teamBName, dataSourceUrl: input.teamBUrl }),
            fetchLiveOdds({ sport: 'soccer' })
        ]);

        if (liveOddsResult.status === 'fulfilled') {
            analysisPayload.liveOdds = liveOddsResult.value;
        }

        // 3. Conditional Quantitative Analysis
        if (teamADataResult.status === 'fulfilled' && teamBDataResult.status === 'fulfilled') {
            const teamAData = teamADataResult.value;
            const teamBData = teamBDataResult.value;

            // Check for key metrics (xG)
            const teamAHasXg = teamAData.stats.home.expectedGoalsFor !== undefined;
            const teamBHasXg = teamBData.stats.home.expectedGoalsFor !== undefined;

            if (teamAHasXg && teamBHasXg) {
                 const modelProbabilities = await quantitativeModel({
                    teamA_data: {
                        homeGoalsFor: teamAData.stats.home.goalsFor,
                        homeGoalsAgainst: teamAData.stats.home.goalsAgainst,
                        homeXGFor: teamAData.stats.home.expectedGoalsFor,
                        homeXGAgainst: teamAData.stats.home.expectedGoalsAgainst,
                        awayGoalsFor: teamAData.stats.away.goalsFor,
                        awayGoalsAgainst: teamAData.stats.away.goalsAgainst,
                        awayXGFor: teamAData.stats.away.expectedGoalsFor,
                        awayXGAgainst: teamAData.stats.away.expectedGoalsAgainst,
                    },
                    teamB_data: {
                        homeGoalsFor: teamBData.stats.home.goalsFor,
                        homeGoalsAgainst: teamBData.stats.home.goalsAgainst,
                        homeXGFor: teamBData.stats.home.expectedGoalsFor,
                        homeXGAgainst: teamBData.stats.home.expectedGoalsAgainst,
                        awayGoalsFor: teamBData.stats.away.goalsFor,
                        awayGoalsAgainst: teamBData.stats.away.goalsAgainst,
                        awayXGFor: teamBData.stats.away.expectedGoalsFor,
                        awayXGAgainst: teamBData.stats.away.expectedGoalsAgainst,
                    },
                    leagueAverages: {
                        homeGoals: input.leagueAverages.homeGoals,
                        awayGoals: input.leagueAverages.awayGoals,
                    },
                 });

                 analysisPayload.quantitativeAnalysis = {
                    modelUsed: 'Poisson-xG',
                    scrapedStats: { teamAData, teamBData },
                    probabilities: modelProbabilities,
                 };
            }
        } else {
             console.error("Data explorer flow failed for one or both teams.");
             // quantitativeAnalysis remains undefined, as per requirements
        }

    } catch (error) {
        console.error("An error occurred during the masterAnalysisFlow:", error);
        // Depending on desired behavior, we could throw the error or return the partial payload
    }

    // 4. Return the assembled payload
    return analysisPayload;
  }
);
