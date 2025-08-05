'use server';
/**
 * @fileOverview The narrative synthesis flow.
 * This flow takes a complete AnalysisPayload, including a confidence score,
 * and uses an AI model to generate an expert, human-readable analysis report.
 *
 * - narrativeSynthesisFlow - The main synthesis function.
 * - NarrativeSynthesisInput - The input type for the flow (matches AnalysisPayload).
 * - NarrativeSynthesisOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AnalysisPayload } from '@/lib/types';

// Zod schema for the input, matching the AnalysisPayload interface.
const NarrativeSynthesisInputSchema = z.object({
  matchDetails: z.object({
    sport: z.enum(['football', 'tennis']),
    participants: z.string(),
    marketOdds: z.object({ home: z.number(), draw: z.number().optional(), away: z.number() }),
  }),
  quantitativeAnalysis: z.object({
    modelUsed: z.enum(['Poisson-xG', 'Elo']),
    scrapedStats: z.record(z.any()),
    probabilities: z.object({ home: z.number(), draw: z.number().optional(), away: z.number() }),
  }).optional(),
  qualitativeAnalysis: z.object({
    userInput: z.record(z.any()),
    narrative: z.string(),
  }).optional(),
  liveOdds: z.any(),
  confidenceScore: z.number().optional(),
});
export type NarrativeSynthesisInput = z.infer<typeof NarrativeSynthesisInputSchema>;


// Zod schema for the structured JSON output from the AI model.
const ValueBetSchema = z.object({
    market: z.string().describe("The market the bet is for, e.g., 'Home Win'."),
    odds: z.number().describe("The decimal odds for this market."),
    modelProbability: z.number().describe("The model's estimated probability for this outcome."),
    expectedValue: z.number().describe("The calculated Expected Value (EV) for this bet.")
});

const NarrativeSynthesisOutputSchema = z.object({
  narrative: z.string().describe("The complete, human-readable analysis text."),
  valueBets: z.array(ValueBetSchema).describe("An array of value bet objects, one for each opportunity found."),
});
export type NarrativeSynthesisOutput = z.infer<typeof NarrativeSynthesisOutputSchema>;


export async function narrativeSynthesis(input: NarrativeSynthesisInput): Promise<NarrativeSynthesisOutput> {
  return narrativeSynthesisFlow(input);
}

// The detailed prompt that guides the large language model.
const synthesisPrompt = ai.definePrompt({
    name: 'narrativeSynthesisPrompt',
    input: { schema: NarrativeSynthesisInputSchema },
    output: { schema: NarrativeSynthesisOutputSchema },
    prompt: `
        **Role and Goal:** You are an elite quantitative sports betting analyst with an expert but friendly tone. Your task is to receive a JSON \`AnalysisPayload\` object and generate a comprehensive value analysis report. Your final output must be a structured JSON object.

        **Input Context:** The \`AnalysisPayload\` contains all the data: match details, quantitative analysis (if it exists), qualitative notes, market odds, and an Analysis Confidence Score.

        **Step-by-Step Reasoning Process:**

        1.  **Confidence Analysis:** Start by evaluating the \`confidenceScore\`. If it's low (e.g., < 60), your narrative must begin with a clear warning about the low reliability of the data.

        2.  **Expected Value (EV) Calculation:** For each outcome (home, draw, away), calculate the Expected Value using the formula: \`Value = (Estimated_Probability) * Decimal_Odd - 1\`. Use the probabilities from the quantitative model if they exist; otherwise, use an estimate based on the qualitative data provided. A value > 0 indicates a value bet.

        3.  **Narrative Construction:** Generate an explanatory text (\`narrative\`).
            *   If quantitative data exists, explain the discrepancy between the model and the market. Example: 'The model identifies value because the team's xG (1.9) is higher than their recent goal tally suggests, something the market seems to be ignoring.'
            *   If quantitative data is missing, state it explicitly: 'Warning: Advanced metrics (xG/xGA) could not be gathered. This analysis is based on historical and qualitative data, reducing its predictive power.'

        4.  **Output Formatting:** Structure your final response as a single JSON object.

        **Analysis Payload to process:**
        \`\`\`json
        {{{jsonStringify this}}}
        \`\`\`
    `,
    helpers: {
        jsonStringify: (obj: any) => JSON.stringify(obj, null, 2),
    }
});


const narrativeSynthesisFlow = ai.defineFlow(
  {
    name: 'narrativeSynthesisFlow',
    inputSchema: NarrativeSynthesisInputSchema,
    outputSchema: NarrativeSynthesisOutputSchema,
  },
  async (payload) => {
    
    // The prompt is designed to handle all the logic, so we just invoke it.
    const { output } = await synthesisPrompt(payload);

    if (!output) {
        throw new Error("The narrative synthesis AI failed to generate a response.");
    }
    
    return output;
  }
);
