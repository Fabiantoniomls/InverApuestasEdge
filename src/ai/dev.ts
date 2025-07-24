import { config } from 'dotenv';
config();

import '@/ai/flows/fundamental-analysis-flow.ts';
import '@/ai/flows/quantitative-model-flow.ts';
import '@/ai/flows/portfolio-manager-flow.ts';
import '@/ai/flows/data-explorer-flow.ts';
import '@/ai/flows/analyze-single-match-flow.ts';
import '@/ai/flows/extract-matches-flow.ts';
import '@/ai/flows/calculate-batch-value-bets-flow.ts';
