/**
 * AI-Powered Medical Research via Vercel AI Gateway
 * Adapted from Mahana Mapper Engine for evidence-based medical research
 *
 * Uses OpenAI's web search tool for real-time medical research
 * Focuses on PubMed, Cochrane, health authorities, and peer-reviewed journals
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { ResearchPrompt, ResearchResult, Citation } from '../types';

/**
 * Trusted medical sources for citation prioritization
 */
const TRUSTED_SOURCES = {
  tier1: [
    'pubmed.ncbi.nlm.nih.gov',
    'cochrane.org',
    'bmj.com',
    'thelancet.com',
    'nejm.org'
  ],
  tier2: [
    'helsenorge.no',
    'nhi.no',
    'helsedirektoratet.no',
    'who.int',
    'uptodate.com',
    'mayoclinic.org',
    'nih.gov'
  ],
  tier3: [
    'ncbi.nlm.nih.gov',
    'medlineplus.gov',
    'webmd.com',
    'healthline.com'
  ]
};

/**
 * Extract URLs from text and categorize by source quality
 */
function extractCitations(text: string): Citation[] {
  const urlRegex = /https?:\/\/[^\s"<>]+/g;
  const urls = [...new Set(text.match(urlRegex) || [])];

  return urls.map(url => {
    const domain = new URL(url).hostname.toLowerCase();

    let source: Citation['source'] = 'other';
    let confidence = 0.5;

    if (domain.includes('pubmed')) {
      source = 'pubmed';
      confidence = 0.95;
    } else if (domain.includes('cochrane')) {
      source = 'cochrane';
      confidence = 0.95;
    } else if (TRUSTED_SOURCES.tier2.some(d => domain.includes(d))) {
      source = 'health-authority';
      confidence = 0.85;
    } else if (domain.includes('journal') || TRUSTED_SOURCES.tier1.some(d => domain.includes(d))) {
      source = 'journal';
      confidence = 0.90;
    } else if (TRUSTED_SOURCES.tier3.some(d => domain.includes(d))) {
      source = 'trusted-health';
      confidence = 0.75;
    }

    return {
      url,
      title: '', // Will be enriched later
      source,
      snippet: '', // Will be enriched later
      confidence,
      verdict: confidence > 0.8 ? 'supported' : 'plausible'
    };
  });
}

/**
 * Calculate evidence grade based on citations
 */
function calculateEvidenceGrade(citations: Citation[]): 'A' | 'B' | 'C' | 'D' {
  const tier1Count = citations.filter(c => c.source === 'pubmed' || c.source === 'cochrane').length;
  const tier2Count = citations.filter(c => c.source === 'journal').length;

  if (tier1Count >= 3) return 'A'; // Multiple RCTs/systematic reviews
  if (tier1Count >= 1 || tier2Count >= 2) return 'B'; // At least one RCT or multiple cohort studies
  if (citations.length >= 2) return 'C'; // Case studies or expert opinion from trusted sources
  return 'D'; // Limited evidence
}

/**
 * Build medical research prompt
 */
function buildMedicalPrompt(options: ResearchPrompt): string {
  const { condition, patientContext, focus = 'all', existingKnowledge = [] } = options;

  const focusInstructions = {
    'exercises': 'Focus on evidence-based exercises, stretches, and physical therapy recommendations',
    'studies': 'Focus on recent research studies and clinical trial findings',
    'treatment-options': 'Focus on treatment modalities, effectiveness, and clinical guidelines',
    'lifestyle': 'Focus on lifestyle modifications, ergonomics, and prevention strategies',
    'all': 'Cover exercises, research findings, treatment options, and lifestyle recommendations'
  };

  const existingText = existingKnowledge.length > 0
    ? `\n**What the patient already knows**:\n${existingKnowledge.join('\n')}\n`
    : '';

  return `You are a medical research assistant helping chiropractors provide evidence-based patient education.

**Patient Condition**: ${condition.name}${condition.icd10Code ? ` (ICD-10: ${condition.icd10Code})` : ''}
**Body Region**: ${condition.bodyRegion}
**Symptoms**: ${condition.symptoms.join(', ')}
${patientContext ? `**Context**: ${patientContext}\n` : ''}${existingText}

**Your Task**:
${focusInstructions[focus]}

**Search Strategy**:
1. Search PubMed, Cochrane Library, and peer-reviewed medical journals first
2. Look for systematic reviews, RCTs, and meta-analyses (highest evidence)
3. Check clinical guidelines from health authorities (Helsedirektoratet, WHO, NICE)
4. Find evidence-based exercise protocols with safety considerations
5. Identify lifestyle modifications supported by research
6. Look for recovery timelines and prognostic factors

**Critical Requirements**:
- USE WEB SEARCH to find REAL medical literature (no hallucinations)
- Prioritize sources: PubMed > Cochrane > Medical Journals > Health Authorities
- Include ALL URLs in your response
- Note any safety warnings or contraindications
- Distinguish between "proven effective" vs "may help" vs "insufficient evidence"
- Include publication years for studies

**Output Format** (JSON):
{
  "evidence_summary": "2-3 sentence summary of the evidence",
  "key_findings": [
    {
      "claim": "specific finding",
      "evidence_level": "A/B/C/D",
      "sources": ["url1", "url2"]
    }
  ],
  "exercises": [
    {
      "name": "exercise name",
      "description": "how to perform",
      "frequency": "e.g., 2-3x daily",
      "evidence": "supporting research",
      "safety": "contraindications/warnings"
    }
  ],
  "lifestyle_recommendations": ["tip 1", "tip 2"],
  "safety_warnings": ["warning 1", "warning 2"],
  "citations": ["url1", "url2", "url3"],
  "confidence": 0-1,
  "evidence_grade": "A/B/C/D"
}

Search the medical literature now and provide evidence-based recommendations!`;
}

/**
 * Research medical condition with OpenAI web search
 */
export async function researchMedicalCondition(options: ResearchPrompt): Promise<ResearchResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const start = Date.now();
  const prompt = buildMedicalPrompt(options);

  console.log(`   [Medical Research] Starting search for "${options.condition.name}"...`);

  try {
    const { text, usage } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.2, // Lower temperature for medical accuracy
      tools: {
        web_search: openai.tools.webSearchPreview({
          searchContextSize: 'large', // More context for medical research
        }),
      },
    });

    const citations = extractCitations(text);
    const evidenceGrade = calculateEvidenceGrade(citations);
    const duration_ms = Date.now() - start;

    console.log(`   [Medical Research] ✅ Found ${citations.length} citations (${duration_ms}ms)`);
    console.log(`   Evidence Grade: ${evidenceGrade}`);

    // Parse exercises from response (simplified - would use structured output in production)
    const exercises = parseExercises(text);

    return {
      findings: text,
      citations,
      exercises,
      confidence: calculateConfidence(citations),
      model: 'gpt-4o-mini-web-search',
      tokens: usage?.totalTokens || 0,
      duration_ms,
      evidenceGrade
    };
  } catch (error) {
    console.error('[Medical Research] Research failed:', error);
    throw error;
  }
}

/**
 * Calculate overall confidence based on citation quality
 */
function calculateConfidence(citations: Citation[]): number {
  if (citations.length === 0) return 0.3;

  const avgConfidence = citations.reduce((sum, c) => sum + c.confidence, 0) / citations.length;
  const tier1Bonus = citations.filter(c => c.source === 'pubmed' || c.source === 'cochrane').length * 0.05;

  return Math.min(0.95, avgConfidence + tier1Bonus);
}

/**
 * Parse exercises from AI response
 * TODO: Use structured output in production
 */
function parseExercises(text: string): any[] {
  // Simplified parser - in production would use AI structured output
  return [];
}

/**
 * Main research function for medical conditions
 */
export async function researchPatientCondition(options: ResearchPrompt): Promise<ResearchResult> {
  console.log(`\n🏥 MEDICAL RESEARCH: ${options.condition.name}`);
  console.log(`   Body Region: ${options.condition.bodyRegion}`);
  console.log(`   Focus: ${options.focus || 'all'}`);
  console.log(`   Using OpenAI Web Search for evidence-based research...\n`);

  try {
    const result = await researchMedicalCondition(options);

    console.log(`\n✅ Medical Research Results:`);
    console.log(`   Citations Found: ${result.citations.length}`);
    console.log(`   Evidence Grade: ${result.evidenceGrade}`);
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(0)}%`);
    console.log(`   Tokens: ${result.tokens}`);
    console.log(`   Duration: ${result.duration_ms}ms`);

    return result;

  } catch (error) {
    console.error('[Medical Research] Failed:', error);
    throw error;
  }
}
