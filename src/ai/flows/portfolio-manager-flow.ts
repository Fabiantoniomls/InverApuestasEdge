'use server';

/**
 * @fileOverview This file implements the Portfolio Management AI agent.
 *
 * - portfolioManagerFlow - A Genkit flow that recommends optimal bets based on bankroll, staking strategy, model probabilities, and market odds.
 * - PortfolioManagerInput - The input type for the portfolioManagerFlow function.
 * - PortfolioManagerOutput - The return type for the portfolioManagerFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioManagerInputSchema = z.object({
  bankroll: z.number().describe('The user\'s total bankroll amount.'),
  stakingStrategy: z.enum(['QuarterKelly', 'HalfKelly', 'FullKelly', 'Percentage', 'Fixed']).describe('The staking strategy to use.'),
  potentialBets: z.array(
    z.object({
      matchDescription: z.string().describe('A description of the match.'),
      outcome: z.string().describe('The predicted outcome of the match.'),
      odds: z.number().describe('The market odds for the predicted outcome.'),
      modelProbability: z.number().describe('The model\'s calculated probability for the predicted outcome.')
    })
  ).describe('An array of potential bets with match details, odds, and model probabilities.')
});

export type PortfolioManagerInput = z.infer<typeof PortfolioManagerInputSchema>;

const PortfolioManagerOutputSchema = z.array(
  z.object({
    match: z.string().describe('The match description.'),
    outcome: z.string().describe('The betting outcome.'),
    value: z.number().describe('The calculated value of the bet.'),
    recommendedStake: z.number().describe('The recommended stake for the bet in the user\'s currency.')
  })
).describe('An array of recommended bets with match, outcome, value, and recommended stake.');

export type PortfolioManagerOutput = z.infer<typeof PortfolioManagerOutputSchema>;

export async function portfolioManager(input: PortfolioManagerInput): Promise<PortfolioManagerOutput> {
  return portfolioManagerFlow(input);
}

const portfolioManagerFlow = ai.defineFlow(
  {
    name: 'portfolioManagerFlow',
    inputSchema: PortfolioManagerInputSchema,
    outputSchema: PortfolioManagerOutputSchema,
  },
  async input => {
    const {bankroll, stakingStrategy, potentialBets} = input;

    const recommendedBets = potentialBets.map(bet => {
      const {matchDescription, outcome, odds, modelProbability} = bet;
      const value = modelProbability * odds - 1;

      let recommendedStake;
      switch (stakingStrategy) {
        case 'QuarterKelly':
          recommendedStake = (bankroll * value) / (4 * (odds - 1));
          break;
        case 'HalfKelly':
          recommendedStake = (bankroll * value) / (2 * (odds - 1));
          break;
        case 'FullKelly':
          recommendedStake = (bankroll * value) / (odds - 1);
          break;
        case 'Percentage':
          recommendedStake = bankroll * 0.01; // 1% of bankroll
          break;
        case 'Fixed':
          recommendedStake = 10; // Fixed stake of 10 units
          break;
        default:
          recommendedStake = 0;
      }

      // Ensure the stake is not negative and round it to 2 decimal places
      recommendedStake = Math.max(0, recommendedStake);
      recommendedStake = Math.round(recommendedStake * 100) / 100;

      return {
        match: matchDescription,
        outcome: outcome,
        value: value,
        recommendedStake: recommendedStake,
      };
    });

    return recommendedBets;
  }
);
