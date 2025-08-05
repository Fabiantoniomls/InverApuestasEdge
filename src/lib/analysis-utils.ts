/**
 * @fileOverview Utility functions for the analysis engine.
 * This file contains helper functions for processing and evaluating analysis data.
 */

import type { AnalysisPayload } from './types';

/**
 * Calculates a confidence score for a given analysis payload based on a weighted average of several factors.
 * The score reflects the reliability of the analysis based on the quality and completeness of the input data.
 *
 * @param payload The AnalysisPayload object to evaluate.
 * @returns A confidence score between 0 and 100.
 */
export function calculateConfidenceScore(payload: AnalysisPayload): number {
  let score = 0;

  // --- 1. Data Source Tier (Weight: 30%) ---
  // Assesses the quality of the primary data source.
  let dataSourceScore = 0;
  if (payload.quantitativeAnalysis?.scrapedStats?.teamAData?.dataSourceUrl?.includes('fbref.com')) {
    dataSourceScore = 100; // Tier 1 source
  } else if (payload.quantitativeAnalysis?.scrapedStats) {
    dataSourceScore = 70; // Tier 2 source (assumed if scraped but not FBref)
  } else if (payload.qualitativeAnalysis) {
    dataSourceScore = 40; // User-provided data
  }
  score += dataSourceScore * 0.30;

  // --- 2. Data Completeness (Weight: 40%) ---
  // Checks for the presence of advanced metrics like xG.
  let completenessScore = 0;
  const quantStats = payload.quantitativeAnalysis?.scrapedStats;
  if (quantStats?.teamAData?.stats?.home?.expectedGoalsFor && quantStats?.teamBData?.stats?.home?.expectedGoalsFor) {
    completenessScore = 100; // All key metrics (xG) present
  } else if (quantStats) {
    completenessScore = 70; // Assumes at least one key metric is missing
  } else {
    completenessScore = 40; // Assumes multiple/all metrics are missing
  }
  score += completenessScore * 0.40;

  // --- 3. Model Applicability (Weight: 20%) ---
  // Scores based on whether a quantitative model was successfully run.
  let modelApplicabilityScore = 0;
  if (payload.quantitativeAnalysis?.modelUsed?.includes('Poisson-xG')) {
    modelApplicabilityScore = 100; // Preferred quantitative model was run
  } else {
    modelApplicabilityScore = 30; // Fallback to fundamental/user-input analysis
  }
  score += modelApplicabilityScore * 0.20;

  // --- 4. Data Freshness (Weight: 10%) ---
  // Evaluates how recent the data is. This is a simplified check.
  // A real implementation would need a timestamp in the scraped data.
  // For now, we assume data from quantitative analysis is fresh.
  let dataFreshnessScore = 0;
  if (payload.quantitativeAnalysis) {
    dataFreshnessScore = 100; // Data < 7 days (Assumed)
  } else {
    dataFreshnessScore = 60; // Data 7-30 days (Assumed for user input)
  }
  score += dataFreshnessScore * 0.10;

  return Math.round(score);
}
