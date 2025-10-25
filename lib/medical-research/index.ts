/**
 * Medical Research Module
 * Adapted from Mahana Mapper Engine for evidence-based patient follow-up
 *
 * @module @kiro/medical-research
 * @version 1.0.0
 *
 * This module provides:
 * - Web-grounded medical research via OpenAI web search
 * - Claims extraction with provenance tracking
 * - Patient-friendly report synthesis
 * - Email generation with citations
 *
 * Based on Mahana Mapper Engine's proven 7-stage pipeline:
 * - Stage 1: Web Search (OpenAI web search tool)
 * - Stage 6A: Claims Extraction (provenance tracking)
 * - Stage 6B: Brain Processing (synthesis)
 */

// Types
export type {
  MedicalCondition,
  ResearchPrompt,
  ResearchResult,
  Citation,
  Exercise,
  Claim,
  PatientResearchReport
} from './types';

// Research (Stage 1)
export {
  researchPatientCondition,
  researchMedicalCondition
} from './providers/web-research';

// Verification (Stage 6A)
export {
  extractMedicalClaims,
  mergeAllClaims,
  filterClaimsByConfidence,
  groupClaimsByType,
  calculateClaimStats
} from './verify/claims-extractor';

// Synthesis (Stage 6B)
export {
  synthesizePatientReport,
  generateEmailContent
} from './brain/synthesizer';

/**
 * Complete pipeline for patient research
 *
 * @example
 * ```typescript
 * import { runPatientResearchPipeline } from '@/lib/medical-research';
 *
 * const report = await runPatientResearchPipeline({
 *   condition: {
 *     name: 'Korsryggsmerter',
 *     icd10Code: 'M54.5',
 *     bodyRegion: 'Korsrygg',
 *     symptoms: ['Smerter i nedre del av ryggen']
 *   },
 *   patientContext: 'Kontoransatt, sittende arbeid',
 *   focus: 'all'
 * });
 *
 * console.log(report.summary);
 * console.log(report.exercises);
 * ```
 */
export async function runPatientResearchPipeline(options: {
  condition: any;
  patientContext?: string;
  clinicianNotes?: string;
  focus?: 'exercises' | 'studies' | 'treatment-options' | 'lifestyle' | 'all';
}) {
  const { researchPatientCondition } = await import('./providers/web-research');
  const { extractMedicalClaims } = await import('./verify/claims-extractor');
  const { synthesizePatientReport } = await import('./brain/synthesizer');

  // Step 1: Research
  const research = await researchPatientCondition({
    condition: options.condition,
    patientContext: options.patientContext,
    focus: options.focus || 'all'
  });

  // Step 2: Extract claims
  const claims = extractMedicalClaims(research);

  // Step 3: Synthesize report
  const report = await synthesizePatientReport({
    condition: options.condition,
    claims,
    citations: research.citations,
    patientContext: options.patientContext,
    clinicianNotes: options.clinicianNotes
  });

  return report;
}

/**
 * Cost estimation for research pipeline
 *
 * Based on Mahana Engine metrics:
 * - Web research: $0.0001-$0.002 per query (OpenAI GPT-4o-mini)
 * - Synthesis: ~$0.001 per report
 * - Total: ~$0.003 per patient research
 *
 * At scale (with caching):
 * - 100 patients/month: ~$0.30
 * - 1000 patients/month: ~$3.00
 */
export const COST_ESTIMATES = {
  perResearch: 0.003,
  per100Patients: 0.30,
  per1000Patients: 3.00,
  withCaching: {
    per100Patients: 0.15, // 50% cache hit rate
    per1000Patients: 1.50
  }
};

/**
 * System capabilities and limits
 */
export const CAPABILITIES = {
  maxConditionsPerQuery: 3,
  maxCitationsPerReport: 10,
  maxExercisesPerReport: 5,
  supportedLanguages: ['no', 'en'],
  evidenceGrades: ['A', 'B', 'C', 'D'] as const,
  focusAreas: ['exercises', 'studies', 'treatment-options', 'lifestyle', 'all'] as const
};
