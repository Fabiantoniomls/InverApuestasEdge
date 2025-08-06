'use server';

import { z } from 'zod';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getUserIdFromSession } from '@/app/actions/auth.actions';
import type { SavedAnalysis, AnalysisPayload } from '@/lib/types';
import { db } from '@/lib/firebase-admin';

// Zod schema for input validation, based on SavedAnalysis but omitting server-generated fields
const SaveAnalysisInputSchema = z.object({
  analysisTitle: z.string().min(1, 'El título del análisis es obligatorio.'),
  analysisType: z.enum(['quantitative', 'fundamental', 'batch']),
  isBetPlaced: z.boolean().default(false),
  betOutcome: z.enum(['PENDING', 'WON', 'LOST', 'VOID']).default('PENDING'),
  confidenceScore: z.number().min(0).max(100),
  valueBetResult: z.object({
    market: z.string(),
    odds: z.number(),
    modelProbability: z.number(),
    expectedValue: z.number(),
    recommendedStake: z.number().optional(),
  }),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  fullPayload: z.any(), // Keeping as 'any' to match the AnalysisPayload interface
});

type SaveAnalysisInput = z.infer<typeof SaveAnalysisInputSchema>;

type SaveAnalysisResponse = {
  success: boolean;
  message: string;
  analysisId?: string;
  error?: any;
};

/**
 * Saves an analysis result to the authenticated user's history in Firestore.
 * This is a Next.js Server Action, ensuring all logic runs securely on the server.
 *
 * @param analysisData The data for the analysis to be saved, validated against SaveAnalysisInputSchema.
 * @returns A response object indicating success or failure.
 */
export async function saveAnalysisToHistory(
  analysisData: SaveAnalysisInput
): Promise<SaveAnalysisResponse> {
  // 1. Authenticate user and get their UID
  // In a real app, this would involve verifying a JWT from the client.
  const userId = await getUserIdFromSession();
  if (!userId) {
    return {
      success: false,
      message: 'Error de autenticación: Usuario no encontrado.',
      error: 'Authentication failed',
    };
  }

  // 2. Validate input data
  const validatedData = SaveAnalysisInputSchema.safeParse(analysisData);
  if (!validatedData.success) {
    return {
      success: false,
      message: 'Error de validación: Los datos proporcionados son inválidos.',
      error: validatedData.error.flatten(),
    };
  }

  try {
    // 3. Construct the document to be saved, adding server-side fields
    const analysisCollectionRef = db.collection('users').doc(userId).collection('analyses');
    const newAnalysisDocRef = analysisCollectionRef.doc(); // Auto-generate ID

    const newAnalysis: SavedAnalysis = {
      ...validatedData.data,
      id: newAnalysisDocRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fullPayload: validatedData.data.fullPayload as AnalysisPayload, // Casting after validation
    };

    // 4. Securely write data to the user's subcollection in Firestore
    await newAnalysisDocRef.set(newAnalysis);

    return {
      success: true,
      message: 'Análisis guardado en el historial correctamente.',
      analysisId: newAnalysisDocRef.id,
    };
  } catch (error) {
    console.error('Error saving analysis to Firestore:', error);
    return {
      success: false,
      message: 'Ocurrió un error en el servidor al intentar guardar el análisis.',
      error: error,
    };
  }
}
