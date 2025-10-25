/**
 * Patient Research API Endpoint
 *
 * POST /api/patient-research
 * Triggers medical research for a patient condition and sends email report
 *
 * This is the core endpoint for the AI patient follow-up system
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { researchPatientCondition } from '@/lib/medical-research/providers/web-research';
import { extractMedicalClaims } from '@/lib/medical-research/verify/claims-extractor';
import { synthesizePatientReport, generateEmailContent } from '@/lib/medical-research/brain/synthesizer';
import type { MedicalCondition } from '@/lib/medical-research/types';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use Node.js runtime for Resend compatibility
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for research + synthesis

interface ResearchRequest {
  patientId?: string; // Encrypted/anonymized ID
  condition: MedicalCondition;
  patientContext?: string; // Anonymized context
  clinicianNotes?: string; // From journal (anonymized)
  patientEmail?: string; // For sending report
  focus?: 'exercises' | 'studies' | 'treatment-options' | 'lifestyle' | 'all';
  sendEmail?: boolean; // Whether to send email or just return report
}

/**
 * POST /api/patient-research
 * Main research endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body: ResearchRequest = await request.json();

    // Validate required fields
    if (!body.condition || !body.condition.name || !body.condition.bodyRegion) {
      return NextResponse.json(
        { error: 'Missing required fields: condition.name and condition.bodyRegion' },
        { status: 400 }
      );
    }

    console.log(`\n🏥 PATIENT RESEARCH REQUEST`);
    console.log(`   Condition: ${body.condition.name}`);
    console.log(`   Focus: ${body.focus || 'all'}`);
    console.log(`   Send email: ${body.sendEmail || false}`);

    // Step 1: Research the condition
    const researchResult = await researchPatientCondition({
      condition: body.condition,
      patientContext: body.patientContext,
      focus: body.focus || 'all'
    });

    // Step 2: Extract and verify claims
    const claims = extractMedicalClaims(researchResult);

    console.log(`   Claims extracted: ${claims.length}`);

    // Step 3: Synthesize patient report
    const report = await synthesizePatientReport({
      condition: body.condition,
      claims,
      citations: researchResult.citations,
      patientContext: body.patientContext,
      clinicianNotes: body.clinicianNotes
    });

    console.log(`   Report synthesized (confidence: ${(report.confidence * 100).toFixed(0)}%)`);

    // Step 4: Send email if requested
    let emailSent = false;
    let emailError = null;

    if (body.sendEmail && body.patientEmail) {
      const emailContent = generateEmailContent(report);

      try {
        console.log(`   📧 Sending email to: ${body.patientEmail}`);
        console.log(`   Subject: ${emailContent.subject}`);

        const { data, error } = await resend.emails.send({
          from: 'Kiro AI <ai@kiropraktisksenter.no>',
          to: body.patientEmail,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          replyTo: 'kontakt@kiropraktisksenter.no'
        });

        if (error) {
          throw error;
        }

        emailSent = true;
        console.log(`   ✅ Email sent successfully (ID: ${data?.id})`);

      } catch (error) {
        emailError = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to send email:', emailError);
        // Continue anyway - report is still generated
      }
    }

    // Return complete report
    return NextResponse.json({
      success: true,
      report: {
        condition: report.condition,
        summary: report.summary,
        keyFindings: report.keyFindings.map(f => ({
          statement: f.statement,
          evidenceGrade: f.evidenceGrade,
          sources: f.sources.map(s => ({ url: s.url, source: s.source }))
        })),
        exercises: report.exercises,
        safetyWarnings: report.safetyWarnings,
        nextSteps: report.nextSteps,
        confidence: report.confidence,
        evidenceGrade: report.evidenceGrade,
        researchedAt: report.researchedAt
      },
      metadata: {
        totalCitations: report.citations.length,
        totalClaims: claims.length,
        emailSent,
        emailError,
        cost: {
          research: researchResult.tokens * 0.0000015, // GPT-4o-mini pricing
          synthesis: 0.001, // Estimated
          total: (researchResult.tokens * 0.0000015) + 0.001
        }
      }
    });

  } catch (error) {
    console.error('Patient research error:', error);

    return NextResponse.json(
      {
        error: 'Failed to complete research',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/patient-research/status
 * Health check endpoint
 */
export async function GET() {
  const resendConfigured = !!process.env.RESEND_API_KEY;

  return NextResponse.json({
    status: 'operational',
    service: 'patient-research',
    version: '1.0.0',
    capabilities: {
      research: true,
      claimsExtraction: true,
      reportSynthesis: true,
      emailGeneration: true,
      emailSending: resendConfigured
    },
    configuration: {
      resendApiKey: resendConfigured ? 'configured' : 'missing',
      openaiApiKey: !!process.env.OPENAI_API_KEY ? 'configured' : 'missing'
    }
  });
}
