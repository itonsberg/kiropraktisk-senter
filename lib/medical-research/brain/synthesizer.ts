/**
 * Medical Research Synthesis (Brain Processing)
 * Adapted from Mahana Mapper Engine's Stage 6B
 *
 * Synthesizes verified claims into patient-friendly reports with personalization
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { PatientResearchReport, Claim, MedicalCondition, Citation, Exercise } from '../types';

export interface SynthesisOptions {
  condition: MedicalCondition;
  claims: Claim[];
  citations: Citation[];
  patientContext?: string;
  clinicianNotes?: string;
  previousReports?: string[]; // For follow-up research
}

/**
 * Build synthesis prompt for patient report
 */
function buildSynthesisPrompt(options: SynthesisOptions): string {
  const { condition, claims, citations, patientContext, clinicianNotes } = options;

  const claimsText = claims.map((c, i) =>
    `${i + 1}. [${c.evidenceGrade}] ${c.statement} (Confidence: ${(c.confidence * 100).toFixed(0)}%, Verdict: ${c.verdict})`
  ).join('\n');

  const citationsText = citations.slice(0, 10).map((c, i) =>
    `${i + 1}. ${c.url} (${c.source}, confidence: ${(c.confidence * 100).toFixed(0)}%)`
  ).join('\n');

  return `You are a medical research synthesizer helping chiropractors provide evidence-based patient education.

**Patient Condition**: ${condition.name}
**Body Region**: ${condition.bodyRegion}
**Symptoms**: ${condition.symptoms.join(', ')}
${patientContext ? `\n**Patient Context**: ${patientContext}` : ''}
${clinicianNotes ? `\n**Clinician Notes**: ${clinicianNotes}` : ''}

**Verified Claims from Research**:
${claimsText}

**Top Citations**:
${citationsText}

**Your Task**:
Create a patient-friendly research report that:
1. Summarizes the evidence in clear, non-technical language
2. Highlights 3-5 key findings most relevant to this patient
3. Recommends evidence-based exercises (with safety notes)
4. Provides actionable next steps
5. Includes appropriate safety warnings
6. Cites sources clearly

**Tone**:
- Empathetic and encouraging
- Clear and accessible (8th grade reading level)
- Evidence-based but not overly technical
- Honest about what is/isn't proven

**Format** (JSON):
{
  "summary": "2-3 paragraph patient-friendly summary of the evidence",
  "key_findings": [
    {
      "title": "Finding title",
      "explanation": "What this means for you",
      "evidence_level": "Strong/Moderate/Limited",
      "source_urls": ["url1", "url2"]
    }
  ],
  "exercises": [
    {
      "name": "Exercise name",
      "description": "How to perform (step by step)",
      "frequency": "How often",
      "duration": "How long",
      "safety_notes": ["Important safety info"],
      "evidence_level": "high/medium/low"
    }
  ],
  "safety_warnings": [
    "Warning 1: When to stop and seek care",
    "Warning 2: Contraindications"
  ],
  "next_steps": [
    "Step 1: What to do first",
    "Step 2: Follow-up actions",
    "Step 3: Long-term strategy"
  ],
  "confidence": 0-1,
  "evidence_grade": "A/B/C/D"
}

Create the patient report now.`;
}

/**
 * Synthesize patient research report from verified claims
 */
export async function synthesizePatientReport(options: SynthesisOptions): Promise<PatientResearchReport> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log(`\n🧠 SYNTHESIZING REPORT: ${options.condition.name}`);
  console.log(`   Claims: ${options.claims.length}`);
  console.log(`   Citations: ${options.citations.length}`);

  const prompt = buildSynthesisPrompt(options);

  try {
    const { text, usage } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.3, // Balanced creativity and consistency
    });

    // Parse structured output
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse synthesis output');
    }

    const data = JSON.parse(jsonMatch[0]);

    // Build final report
    const report: PatientResearchReport = {
      condition: options.condition,
      summary: data.summary,
      keyFindings: data.key_findings.map((f: any) => ({
        type: 'treatment-efficacy' as const,
        statement: f.title,
        sources: options.citations.filter(c => f.source_urls?.includes(c.url)),
        confidence: f.evidence_level === 'Strong' ? 0.9 : f.evidence_level === 'Moderate' ? 0.7 : 0.5,
        verdict: f.evidence_level === 'Strong' ? 'supported' as const : 'plausible' as const,
        evidenceGrade: data.evidence_grade
      })),
      exercises: data.exercises.map((e: any) => ({
        name: e.name,
        description: e.description,
        frequency: e.frequency,
        duration: e.duration,
        safetyNotes: e.safety_notes || [],
        evidenceLevel: e.evidence_level
      })),
      citations: options.citations,
      safetyWarnings: data.safety_warnings || [],
      nextSteps: data.next_steps || [],
      researchedAt: new Date().toISOString(),
      confidence: data.confidence || calculateOverallConfidence(options.claims),
      evidenceGrade: data.evidence_grade || calculateOverallEvidenceGrade(options.claims)
    };

    console.log(`   ✅ Report synthesized`);
    console.log(`   Confidence: ${(report.confidence * 100).toFixed(0)}%`);
    console.log(`   Evidence Grade: ${report.evidenceGrade}`);
    console.log(`   Tokens used: ${usage?.totalTokens || 0}`);

    return report;

  } catch (error) {
    console.error('[Synthesis] Failed to synthesize report:', error);
    throw error;
  }
}

/**
 * Calculate overall confidence from claims
 */
function calculateOverallConfidence(claims: Claim[]): number {
  if (claims.length === 0) return 0.3;

  const supportedClaims = claims.filter(c => c.verdict === 'supported');
  const avgConfidence = claims.reduce((sum, c) => sum + c.confidence, 0) / claims.length;
  const supportedBonus = (supportedClaims.length / claims.length) * 0.1;

  return Math.min(0.95, avgConfidence + supportedBonus);
}

/**
 * Calculate overall evidence grade from claims
 */
function calculateOverallEvidenceGrade(claims: Claim[]): 'A' | 'B' | 'C' | 'D' {
  if (claims.length === 0) return 'D';

  const grades = claims.map(c => c.evidenceGrade);
  const aCount = grades.filter(g => g === 'A').length;
  const bCount = grades.filter(g => g === 'B').length;

  if (aCount >= claims.length * 0.5) return 'A'; // Majority A-grade
  if (aCount + bCount >= claims.length * 0.5) return 'B'; // Majority A/B
  if (bCount >= claims.length * 0.3) return 'C';
  return 'D';
}

/**
 * Generate patient-friendly email from report
 */
export function generateEmailContent(report: PatientResearchReport): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Forskning om ${report.condition.name} - Oppdaterte anbefalinger`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #f48337 0%, #e67332 100%); color: white; padding: 30px; text-align: center; }
    .content { max-width: 600px; margin: 0 auto; padding: 20px; }
    .section { margin: 30px 0; }
    .finding { background: #f5f5f5; padding: 15px; margin: 10px 0; border-left: 4px solid #f48337; }
    .exercise { background: #fff; border: 1px solid #e0e0e0; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .evidence-badge { display: inline-block; background: #f48337; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; }
    .citation { font-size: 12px; color: #666; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔬 Forskning om ${report.condition.name}</h1>
    <p>Evidensgrad: <span class="evidence-badge">${report.evidenceGrade}</span></p>
  </div>

  <div class="content">
    <div class="section">
      <h2>📋 Oppsummering</h2>
      <p>${report.summary}</p>
    </div>

    <div class="section">
      <h2>🔑 Viktigste funn</h2>
      ${report.keyFindings.slice(0, 5).map(f => `
        <div class="finding">
          <h3>${f.statement}</h3>
          <p class="citation">Kilder: ${f.sources.map(s => `<a href="${s.url}">${s.source}</a>`).join(', ')}</p>
        </div>
      `).join('')}
    </div>

    ${report.exercises.length > 0 ? `
      <div class="section">
        <h2>💪 Anbefalte øvelser</h2>
        ${report.exercises.map(e => `
          <div class="exercise">
            <h3>${e.name}</h3>
            <p>${e.description}</p>
            <p><strong>Hyppighet:</strong> ${e.frequency}</p>
            <p><strong>Varighet:</strong> ${e.duration}</p>
            ${e.safetyNotes.length > 0 ? `
              <p><strong>⚠️ Sikkerhetsmerknader:</strong></p>
              <ul>${e.safetyNotes.map(n => `<li>${n}</li>`).join('')}</ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${report.safetyWarnings.length > 0 ? `
      <div class="section">
        <h2>⚠️ Viktige varsler</h2>
        ${report.safetyWarnings.map(w => `<div class="warning">${w}</div>`).join('')}
      </div>
    ` : ''}

    <div class="section">
      <h2>🎯 Neste steg</h2>
      <ol>
        ${report.nextSteps.map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>

    <div class="section">
      <p class="citation">
        <strong>Kilder:</strong><br>
        ${report.citations.slice(0, 10).map((c, i) => `${i + 1}. <a href="${c.url}">${c.source}</a>`).join('<br>')}
      </p>
    </div>
  </div>

  <div class="footer">
    <p>🤖 Denne rapporten er generert av Kiro AI basert på vitenskapelig forskning.</p>
    <p>Har du spørsmål? Ring oss på <strong>+47 400 95 900</strong></p>
  </div>
</body>
</html>
  `;

  const text = `
FORSKNING OM ${report.condition.name.toUpperCase()}
Evidensgrad: ${report.evidenceGrade}

OPPSUMMERING
${report.summary}

VIKTIGSTE FUNN
${report.keyFindings.slice(0, 5).map((f, i) => `${i + 1}. ${f.statement}`).join('\n')}

${report.exercises.length > 0 ? `
ANBEFALTE ØVELSER
${report.exercises.map((e, i) => `
${i + 1}. ${e.name}
   ${e.description}
   Hyppighet: ${e.frequency}
   Varighet: ${e.duration}
`).join('\n')}
` : ''}

${report.safetyWarnings.length > 0 ? `
VIKTIGE VARSLER
${report.safetyWarnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}
` : ''}

NESTE STEG
${report.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---
Generert av Kiro AI | Ring oss: +47 400 95 900
  `.trim();

  return { subject, html, text };
}
