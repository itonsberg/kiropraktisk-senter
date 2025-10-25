/**
 * Medical Claims Extraction & Verification
 * Adapted from Mahana Mapper Engine's Stage 6A
 *
 * Extracts verifiable claims from medical research with provenance tracking
 */

import type { Claim, Citation, ResearchResult } from '../types';

/**
 * Extract claims from research findings
 */
export function extractMedicalClaims(research: ResearchResult): Claim[] {
  const claims: Claim[] = [];

  try {
    // Parse AI response for structured findings
    const jsonMatch = research.findings.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[Claims] No structured data found in research findings');
      return claims;
    }

    const data = JSON.parse(jsonMatch[0]);

    // Extract treatment efficacy claims
    if (data.key_findings) {
      for (const finding of data.key_findings) {
        const sources = research.citations.filter(c =>
          finding.sources?.some((url: string) => c.url.includes(url))
        );

        claims.push({
          type: 'treatment-efficacy',
          statement: finding.claim,
          sources,
          confidence: calculateClaimConfidence(sources),
          verdict: assignVerdict(sources, finding.evidence_level),
          evidenceGrade: finding.evidence_level || research.evidenceGrade
        });
      }
    }

    // Extract exercise benefit claims
    if (data.exercises) {
      for (const exercise of data.exercises) {
        const sources = research.citations.filter(c =>
          exercise.evidence && c.url.includes(exercise.evidence)
        );

        claims.push({
          type: 'exercise-benefit',
          statement: `${exercise.name}: ${exercise.description}`,
          sources,
          confidence: exercise.evidence ? 0.8 : 0.5,
          verdict: sources.length > 0 ? 'supported' : 'plausible',
          evidenceGrade: exercise.evidence ? 'B' : 'C'
        });
      }
    }

    // Extract lifestyle recommendations as claims
    if (data.lifestyle_recommendations) {
      for (const rec of data.lifestyle_recommendations) {
        claims.push({
          type: 'risk-factor',
          statement: rec,
          sources: research.citations, // All citations support context
          confidence: 0.7,
          verdict: 'plausible',
          evidenceGrade: 'C'
        });
      }
    }

  } catch (error) {
    console.error('[Claims] Failed to parse research findings:', error);
  }

  return claims;
}

/**
 * Calculate claim confidence based on source quality
 */
function calculateClaimConfidence(sources: Citation[]): number {
  if (sources.length === 0) return 0.3;

  const avgSourceConfidence = sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length;
  const countBonus = Math.min(0.15, sources.length * 0.05); // Up to +0.15 for multiple sources

  return Math.min(0.95, avgSourceConfidence + countBonus);
}

/**
 * Assign verdict based on source quality and evidence level
 */
function assignVerdict(
  sources: Citation[],
  evidenceLevel?: string
): 'supported' | 'plausible' | 'refuted' | 'unknown' {
  if (sources.length === 0) return 'unknown';

  const tier1Sources = sources.filter(s => s.source === 'pubmed' || s.source === 'cochrane');
  const avgConfidence = sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length;

  // High-quality evidence from tier 1 sources
  if (tier1Sources.length >= 2 && evidenceLevel === 'A') return 'supported';

  // Good evidence from multiple sources
  if (tier1Sources.length >= 1 || (sources.length >= 2 && avgConfidence >= 0.8)) return 'supported';

  // Moderate evidence
  if (sources.length >= 1 && avgConfidence >= 0.7) return 'plausible';

  return 'unknown';
}

/**
 * Merge claims from multiple research queries
 * Used when researching same condition from different angles
 */
export function mergeAllClaims(researchResults: ResearchResult[]): Claim[] {
  const allClaims = researchResults.flatMap(r => extractMedicalClaims(r));

  // Group by statement (deduplicate)
  const claimMap = new Map<string, Claim>();

  for (const claim of allClaims) {
    const existing = claimMap.get(claim.statement);

    if (!existing) {
      claimMap.set(claim.statement, claim);
    } else {
      // Merge sources and update confidence
      const mergedSources = [
        ...existing.sources,
        ...claim.sources.filter(s => !existing.sources.some(es => es.url === s.url))
      ];

      const mergedClaim: Claim = {
        ...existing,
        sources: mergedSources,
        confidence: Math.max(existing.confidence, claim.confidence),
        verdict: pickBestVerdict(existing.verdict, claim.verdict),
        evidenceGrade: pickBestEvidenceGrade(existing.evidenceGrade, claim.evidenceGrade)
      };

      claimMap.set(claim.statement, mergedClaim);
    }
  }

  return Array.from(claimMap.values());
}

/**
 * Pick best verdict when merging claims
 */
function pickBestVerdict(
  a: Claim['verdict'],
  b: Claim['verdict']
): Claim['verdict'] {
  const hierarchy: Claim['verdict'][] = ['supported', 'plausible', 'unknown', 'refuted'];
  return hierarchy.indexOf(a) <= hierarchy.indexOf(b) ? a : b;
}

/**
 * Pick best evidence grade when merging claims
 */
function pickBestEvidenceGrade(a: 'A' | 'B' | 'C' | 'D', b: 'A' | 'B' | 'C' | 'D'): 'A' | 'B' | 'C' | 'D' {
  const hierarchy = ['A', 'B', 'C', 'D'];
  return hierarchy.indexOf(a) <= hierarchy.indexOf(b) ? a : b;
}

/**
 * Filter claims by minimum confidence threshold
 */
export function filterClaimsByConfidence(claims: Claim[], minConfidence: number): Claim[] {
  return claims.filter(c => c.confidence >= minConfidence);
}

/**
 * Group claims by type for reporting
 */
export function groupClaimsByType(claims: Claim[]): Record<Claim['type'], Claim[]> {
  return claims.reduce((acc, claim) => {
    if (!acc[claim.type]) acc[claim.type] = [];
    acc[claim.type].push(claim);
    return acc;
  }, {} as Record<Claim['type'], Claim[]>);
}

/**
 * Calculate statistics for claims
 */
export function calculateClaimStats(claims: Claim[]) {
  const byType = groupClaimsByType(claims);
  const byVerdict = {
    supported: claims.filter(c => c.verdict === 'supported').length,
    plausible: claims.filter(c => c.verdict === 'plausible').length,
    refuted: claims.filter(c => c.verdict === 'refuted').length,
    unknown: claims.filter(c => c.verdict === 'unknown').length,
  };

  const avgConfidence = claims.length > 0
    ? claims.reduce((sum, c) => sum + c.confidence, 0) / claims.length
    : 0;

  return {
    total: claims.length,
    byType: Object.fromEntries(
      Object.entries(byType).map(([type, list]) => [type, list.length])
    ),
    byVerdict,
    avgConfidence,
  };
}
