'use server';
/**
 * @fileOverview Extracts team statistics from a given URL.
 *
 * - dataExplorer - A function that handles the data extraction process.
 * - DataExplorerInput - The input type for the dataExplorer function.
 * - DataExplorerOutput - The return type for the dataExplorer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataExplorerInputSchema = z.object({
  teamName: z.string().describe('The name of the team to extract statistics for.'),
  dataSourceUrl: z.string().url().describe('The URL of the data source (e.g., FBref.com).'),
});
export type DataExplorerInput = z.infer<typeof DataExplorerInputSchema>;

const DataExplorerOutputSchema = z.object({
  home: z.object({
    goalsFor: z.number().describe('Goals scored in home matches.'),
    goalsAgainst: z.number().describe('Goals conceded in home matches.'),
    xGFor: z.number().describe('Expected goals scored in home matches.'),
    xGAgainst: z.number().describe('Expected goals conceded in home matches.'),
  }).describe('Home match statistics'),
  away: z.object({
    goalsFor: z.number().describe('Goals scored in away matches.'),
    goalsAgainst: z.number().describe('Goals conceded in away matches.'),
    xGFor: z.number().describe('Expected goals scored in away matches.'),
    xGAgainst: z.number().describe('Expected goals conceded in away matches.'),
  }).describe('Away match statistics'),
});
export type DataExplorerOutput = z.infer<typeof DataExplorerOutputSchema>;

export async function dataExplorer(input: DataExplorerInput): Promise<DataExplorerOutput> {
  return dataExplorerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dataExplorerPrompt',
  input: {schema: DataExplorerInputSchema},
  output: {schema: DataExplorerOutputSchema},
  prompt: `You are a sports data analyst. Extract the following statistics for the team {{teamName}} from the data source at {{dataSourceUrl}}:

  - Goals For (home matches)
  - Goals Against (home matches)
  - xG For (home matches)
  - xG Against (home matches)
  - Goals For (away matches)
  - Goals Against (away matches)
  - xG For (away matches)
  - xG Against (away matches)

  Return the data in JSON format.
`,
});

const dataExplorerFlow = ai.defineFlow(
  {
    name: 'dataExplorerFlow',
    inputSchema: DataExplorerInputSchema,
    outputSchema: DataExplorerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
