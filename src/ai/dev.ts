'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/quantitative-model-flow.ts';
import '@/ai/flows/portfolio-manager-flow.ts';
import '@/ai/flows/data-explorer-flow.ts';
import '@/ai/flows/analyze-single-match-flow.ts';
import '@/ai/flows/extract-matches-flow.ts';
import '@/ai/flows/calculate-batch-value-bets-flow.ts';
import '@/ai/flows/calculate-value-bet-from-text-flow.ts';
import '@/ai/flows/calculate-value-bet-manual-flow.ts';
import '@/ai/flows/qualitative-insight-flow.ts';
import '@/ai/flows/multi-model-analysis-flow.ts';
import '@/ai/flows/calculate-value-bet-from-image-flow.ts';
import '@/ai/flows/fetch-live-odds-flow.ts';
