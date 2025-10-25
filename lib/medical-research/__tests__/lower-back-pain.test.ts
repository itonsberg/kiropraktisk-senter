/**
 * Medical Research Test Suite
 * Test case: Lower Back Pain (Lumbago)
 *
 * This validates the complete pipeline:
 * 1. Web research with citation discovery
 * 2. Claims extraction and verification
 * 3. Report synthesis and email generation
 */

import { researchPatientCondition } from '../providers/web-research';
import { extractMedicalClaims, calculateClaimStats } from '../verify/claims-extractor';
import { synthesizePatientReport, generateEmailContent } from '../brain/synthesizer';
import type { MedicalCondition } from '../types';

describe('Medical Research Pipeline - Lower Back Pain', () => {
  // Test condition: Common lower back pain
  const testCondition: MedicalCondition = {
    icd10Code: 'M54.5',
    name: 'Korsryggsmerter',
    symptoms: [
      'Smerter i nedre del av ryggen',
      'Stivhet om morgenen',
      'Forverring ved løfting',
      'Bedring i hvile'
    ],
    bodyRegion: 'Korsrygg',
    severity: 'moderate'
  };

  const patientContext = 'Kontoransatt, sittende arbeid 8 timer/dag, aktiv på fritiden';

  it('should research lower back pain and find evidence-based sources', async () => {
    console.log('\n🧪 TEST 1: Web Research');

    const result = await researchPatientCondition({
      condition: testCondition,
      patientContext,
      focus: 'all'
    });

    // Validate research results
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.evidenceGrade).toMatch(/[ABCD]/);

    console.log(`   ✅ Found ${result.citations.length} citations`);
    console.log(`   ✅ Confidence: ${(result.confidence * 100).toFixed(0)}%`);
    console.log(`   ✅ Evidence Grade: ${result.evidenceGrade}`);

    // Check for quality sources
    const tier1Sources = result.citations.filter(c =>
      c.source === 'pubmed' || c.source === 'cochrane'
    );
    console.log(`   ✅ Tier 1 sources (PubMed/Cochrane): ${tier1Sources.length}`);

    expect(tier1Sources.length).toBeGreaterThan(0); // Should find at least one RCT/review

  }, 30000); // 30s timeout for web research

  it('should extract and verify claims from research', async () => {
    console.log('\n🧪 TEST 2: Claims Extraction');

    const research = await researchPatientCondition({
      condition: testCondition,
      focus: 'exercises'
    });

    const claims = extractMedicalClaims(research);
    const stats = calculateClaimStats(claims);

    console.log(`   ✅ Extracted ${claims.length} claims`);
    console.log(`   ✅ By verdict:`, stats.byVerdict);
    console.log(`   ✅ Avg confidence: ${(stats.avgConfidence * 100).toFixed(0)}%`);

    expect(claims.length).toBeGreaterThan(0);
    expect(stats.byVerdict.supported + stats.byVerdict.plausible).toBeGreaterThan(0);

  }, 30000);

  it('should synthesize patient-friendly report', async () => {
    console.log('\n🧪 TEST 3: Report Synthesis');

    // First, do research
    const research = await researchPatientCondition({
      condition: testCondition,
      patientContext,
      focus: 'all'
    });

    // Extract claims
    const claims = extractMedicalClaims(research);

    // Synthesize report
    const report = await synthesizePatientReport({
      condition: testCondition,
      claims,
      citations: research.citations,
      patientContext,
      clinicianNotes: 'Første konsultasjon, ingen røde flagg'
    });

    console.log(`   ✅ Report generated`);
    console.log(`   ✅ Key findings: ${report.keyFindings.length}`);
    console.log(`   ✅ Exercises: ${report.exercises.length}`);
    console.log(`   ✅ Safety warnings: ${report.safetyWarnings.length}`);
    console.log(`   ✅ Next steps: ${report.nextSteps.length}`);

    expect(report.summary.length).toBeGreaterThan(100);
    expect(report.keyFindings.length).toBeGreaterThanOrEqual(3);
    expect(report.exercises.length).toBeGreaterThan(0);
    expect(report.nextSteps.length).toBeGreaterThan(0);

  }, 45000);

  it('should generate email content', async () => {
    console.log('\n🧪 TEST 4: Email Generation');

    // Quick research
    const research = await researchPatientCondition({
      condition: testCondition,
      focus: 'exercises'
    });

    const claims = extractMedicalClaims(research);
    const report = await synthesizePatientReport({
      condition: testCondition,
      claims,
      citations: research.citations
    });

    const email = generateEmailContent(report);

    console.log(`   ✅ Subject: ${email.subject}`);
    console.log(`   ✅ HTML length: ${email.html.length} chars`);
    console.log(`   ✅ Text length: ${email.text.length} chars`);

    expect(email.subject).toContain('Korsryggsmerter');
    expect(email.html).toContain('<!DOCTYPE html>');
    expect(email.html).toContain(testCondition.name);
    expect(email.text).toContain(testCondition.name);

  }, 45000);

  it('should handle edge case: no research results', () => {
    console.log('\n🧪 TEST 5: Edge Case - No Results');

    const emptyResult = {
      findings: '{}',
      citations: [],
      exercises: [],
      confidence: 0.3,
      model: 'test',
      tokens: 0,
      duration_ms: 0,
      evidenceGrade: 'D' as const
    };

    const claims = extractMedicalClaims(emptyResult);
    const stats = calculateClaimStats(claims);

    console.log(`   ✅ Gracefully handled empty result`);
    console.log(`   ✅ Claims: ${claims.length}`);

    expect(claims.length).toBe(0);
    expect(stats.total).toBe(0);
  });
});

describe('Medical Research Pipeline - Common Conditions', () => {
  const conditions: MedicalCondition[] = [
    {
      icd10Code: 'M54.2',
      name: 'Nakkesmerter',
      symptoms: ['Stiv nakke', 'Hodepine', 'Skuldersmerter'],
      bodyRegion: 'Nakke'
    },
    {
      icd10Code: 'M25.56',
      name: 'Knesmerter',
      symptoms: ['Smerte ved belastning', 'Hovne', 'Redusert bevegelighet'],
      bodyRegion: 'Kne'
    },
    {
      icd10Code: 'M75.1',
      name: 'Rotator cuff syndrom',
      symptoms: ['Skuldersmerter', 'Svakhet ved armhev', 'Nattsmerter'],
      bodyRegion: 'Skulder'
    }
  ];

  it.each(conditions)('should research $name and provide evidence', async (condition) => {
    console.log(`\n🧪 TEST: ${condition.name}`);

    const result = await researchPatientCondition({
      condition,
      focus: 'treatment-options'
    });

    console.log(`   ✅ Citations: ${result.citations.length}`);
    console.log(`   ✅ Evidence: ${result.evidenceGrade}`);
    console.log(`   ✅ Confidence: ${(result.confidence * 100).toFixed(0)}%`);

    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.evidenceGrade).toMatch(/[ABCD]/);

  }, 30000);
});

/**
 * Manual test runner (for development)
 *
 * Run with: npx tsx lib/medical-research/__tests__/lower-back-pain.test.ts
 */
if (require.main === module) {
  (async () => {
    console.log('🚀 Running manual medical research test...\n');

    const condition: MedicalCondition = {
      icd10Code: 'M54.5',
      name: 'Korsryggsmerter',
      symptoms: ['Smerter i nedre del av ryggen', 'Stivhet'],
      bodyRegion: 'Korsrygg',
      severity: 'moderate'
    };

    try {
      // Step 1: Research
      console.log('STEP 1: Research');
      const research = await researchPatientCondition({
        condition,
        patientContext: 'Kontoransatt, sittende arbeid',
        focus: 'all'
      });

      // Step 2: Extract claims
      console.log('\nSTEP 2: Extract Claims');
      const claims = extractMedicalClaims(research);
      const stats = calculateClaimStats(claims);
      console.log('Stats:', JSON.stringify(stats, null, 2));

      // Step 3: Synthesize report
      console.log('\nSTEP 3: Synthesize Report');
      const report = await synthesizePatientReport({
        condition,
        claims,
        citations: research.citations,
        patientContext: 'Kontoransatt'
      });

      // Step 4: Generate email
      console.log('\nSTEP 4: Generate Email');
      const email = generateEmailContent(report);

      console.log('\n✅ TEST COMPLETE');
      console.log('\nSummary:', report.summary.slice(0, 200) + '...');
      console.log('\nEmail subject:', email.subject);

    } catch (error) {
      console.error('❌ TEST FAILED:', error);
      process.exit(1);
    }
  })();
}
