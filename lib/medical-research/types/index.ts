/**
 * Medical Research Types
 * Adapted from Mahana Mapper Engine for medical/chiropractic research
 */

export interface MedicalCondition {
  icd10Code?: string;
  name: string;
  symptoms: string[];
  bodyRegion: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface ResearchPrompt {
  condition: MedicalCondition;
  patientContext?: string; // Anonymized context
  focus?: 'exercises' | 'studies' | 'treatment-options' | 'lifestyle' | 'all';
  existingKnowledge?: string[]; // What patient already knows
}

export interface ResearchResult {
  findings: string;
  citations: Citation[];
  exercises: Exercise[];
  confidence: number;
  model: string;
  tokens: number;
  duration_ms: number;
  evidenceGrade: 'A' | 'B' | 'C' | 'D'; // A=RCT, B=Cohort, C=Case, D=Expert
}

export interface Citation {
  url: string;
  title: string;
  source: 'pubmed' | 'cochrane' | 'health-authority' | 'journal' | 'trusted-health' | 'other';
  snippet: string;
  confidence: number;
  verdict: 'supported' | 'plausible' | 'refuted' | 'unknown';
}

export interface Exercise {
  name: string;
  description: string;
  frequency: string;
  duration: string;
  safetyNotes: string[];
  videoUrl?: string;
  imageUrl?: string;
  evidenceLevel: 'high' | 'medium' | 'low';
}

export interface Claim {
  type: 'treatment-efficacy' | 'exercise-benefit' | 'risk-factor' | 'symptom-correlation' | 'recovery-timeline';
  statement: string;
  sources: Citation[];
  confidence: number;
  verdict: 'supported' | 'plausible' | 'refuted' | 'unknown';
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
}

export interface PatientResearchReport {
  condition: MedicalCondition;
  summary: string; // Patient-friendly summary
  keyFindings: Claim[];
  exercises: Exercise[];
  citations: Citation[];
  safetyWarnings: string[];
  nextSteps: string[];
  researchedAt: string;
  confidence: number;
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
}
