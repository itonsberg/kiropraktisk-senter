/**
 * Patient Follow-up Integration Example
 *
 * This shows how the medical research module integrates with the
 * full patient follow-up system described in AI_PATIENT_FOLLOWUP_V2_IMPLEMENTATION.md
 */

import { runPatientResearchPipeline, generateEmailContent } from '../index';
import type { MedicalCondition } from '../types';

/**
 * SCENARIO 1: Post-Treatment Follow-up (1 hour after visit)
 *
 * Flow:
 * 1. Clinician updates journal in admin dashboard
 * 2. System triggers research 1 hour later
 * 3. Email sent to patient with personalized findings
 */
export async function postTreatmentFollowup(params: {
  patientId: string; // Encrypted ID
  treatmentDate: Date;
  clinicianNotes: string; // From journal (anonymized)
  condition: MedicalCondition;
  patientEmail: string;
}) {
  console.log(`\n📅 POST-TREATMENT FOLLOW-UP`);
  console.log(`   Patient: ${params.patientId}`);
  console.log(`   Condition: ${params.condition.name}`);
  console.log(`   Waiting 1 hour after treatment...`);

  // Wait 1 hour (in production, this would be a scheduled job)
  // await delay(3600000);

  // Run research pipeline
  const report = await runPatientResearchPipeline({
    condition: params.condition,
    clinicianNotes: params.clinicianNotes,
    focus: 'all'
  });

  // Generate email
  const email = generateEmailContent(report);

  // Send via Resend (TODO: integrate)
  console.log(`\n📧 Sending follow-up email...`);
  console.log(`   To: ${params.patientEmail}`);
  console.log(`   Subject: ${email.subject}`);
  console.log(`   Confidence: ${(report.confidence * 100).toFixed(0)}%`);
  console.log(`   Evidence Grade: ${report.evidenceGrade}`);

  // In production:
  // await resend.emails.send({
  //   from: 'Kiro AI <ai@kiropraktisksenter.no>',
  //   to: params.patientEmail,
  //   subject: email.subject,
  //   html: email.html,
  //   text: email.text
  // });

  return {
    reportId: `report_${Date.now()}`,
    sent: true,
    confidence: report.confidence,
    citationCount: report.citations.length
  };
}

/**
 * SCENARIO 2: Monthly Check-in
 *
 * Flow:
 * 1. Cron job runs monthly for all active patients
 * 2. Research focuses on new findings since last check-in
 * 3. Email sent with updates and progress tracking
 */
export async function monthlyCheckIn(params: {
  patientId: string;
  condition: MedicalCondition;
  lastCheckIn: Date;
  previousReports: string[]; // IDs of previous reports
  patientEmail: string;
}) {
  console.log(`\n📆 MONTHLY CHECK-IN`);
  console.log(`   Patient: ${params.patientId}`);
  console.log(`   Last check-in: ${params.lastCheckIn.toLocaleDateString()}`);

  // Run research with focus on progress and new studies
  const report = await runPatientResearchPipeline({
    condition: params.condition,
    patientContext: `Ongoing treatment since ${params.lastCheckIn.toLocaleDateString()}`,
    focus: 'studies' // Focus on new research
  });

  // Filter for new findings (in production, compare with previous reports)
  const newFindings = report.keyFindings.slice(0, 3);

  console.log(`\n✨ New findings: ${newFindings.length}`);

  // Generate email
  const email = generateEmailContent(report);

  return {
    reportId: `report_${Date.now()}`,
    sent: true,
    newFindings: newFindings.length
  };
}

/**
 * SCENARIO 3: Patient Reply (Two-way Conversation)
 *
 * Flow:
 * 1. Patient replies to follow-up email with questions
 * 2. System parses reply and extracts question
 * 3. Targeted research focused on patient's specific concern
 * 4. Reply sent with additional context
 */
export async function handlePatientReply(params: {
  patientId: string;
  originalReportId: string;
  patientQuestion: string;
  condition: MedicalCondition;
  patientEmail: string;
}) {
  console.log(`\n💬 PATIENT REPLY`);
  console.log(`   Question: "${params.patientQuestion}"`);

  // Determine focus based on question
  const focus = detectFocus(params.patientQuestion);

  // Run targeted research
  const report = await runPatientResearchPipeline({
    condition: params.condition,
    patientContext: `Patient question: ${params.patientQuestion}`,
    focus
  });

  // Generate conversational reply
  const email = generateEmailContent(report);

  console.log(`\n📧 Sending reply...`);
  console.log(`   Focus: ${focus}`);

  return {
    reportId: `reply_${Date.now()}`,
    sent: true,
    focus
  };
}

/**
 * SCENARIO 4: Batch Processing (100 patients at once)
 *
 * Flow:
 * 1. Cron job triggers for all patients needing follow-up
 * 2. Research runs in parallel with rate limiting
 * 3. Emails queued and sent via BullMQ
 * 4. Cost tracking and analytics
 */
export async function batchFollowup(params: {
  patients: Array<{
    id: string;
    email: string;
    condition: MedicalCondition;
    lastContact: Date;
  }>;
  batchSize?: number;
}) {
  console.log(`\n🔄 BATCH FOLLOW-UP`);
  console.log(`   Total patients: ${params.patients.length}`);

  const batchSize = params.batchSize || 10;
  const results = [];

  // Process in batches to avoid rate limits
  for (let i = 0; i < params.patients.length; i += batchSize) {
    const batch = params.patients.slice(i, i + batchSize);

    console.log(`\n   Processing batch ${i / batchSize + 1}...`);

    // Run research for all patients in parallel
    const batchResults = await Promise.all(
      batch.map(async (patient) => {
        try {
          const report = await runPatientResearchPipeline({
            condition: patient.condition,
            focus: 'exercises' // Focus on actionable advice
          });

          return {
            patientId: patient.id,
            success: true,
            confidence: report.confidence,
            cost: 0.003 // Estimated cost per research
          };
        } catch (error) {
          console.error(`Failed for patient ${patient.id}:`, error);
          return {
            patientId: patient.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    results.push(...batchResults);

    // Rate limiting: wait 1s between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const successCount = results.filter(r => r.success).length;
  const totalCost = results.filter(r => r.success).length * 0.003;

  console.log(`\n✅ Batch complete`);
  console.log(`   Successful: ${successCount}/${params.patients.length}`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);

  return {
    total: params.patients.length,
    successful: successCount,
    failed: params.patients.length - successCount,
    totalCost
  };
}

/**
 * Helper: Detect focus area from patient question
 */
function detectFocus(question: string): 'exercises' | 'studies' | 'treatment-options' | 'lifestyle' | 'all' {
  const lower = question.toLowerCase();

  if (lower.includes('øvelse') || lower.includes('trening') || lower.includes('strekk')) {
    return 'exercises';
  }
  if (lower.includes('forskning') || lower.includes('studie') || lower.includes('bevis')) {
    return 'studies';
  }
  if (lower.includes('behandling') || lower.includes('terapi') || lower.includes('medisin')) {
    return 'treatment-options';
  }
  if (lower.includes('kosthold') || lower.includes('livsstil') || lower.includes('søvn')) {
    return 'lifestyle';
  }

  return 'all';
}

/**
 * EXAMPLE USAGE
 */
if (require.main === module) {
  (async () => {
    console.log('🚀 Running Patient Follow-up Integration Examples\n');

    // Example 1: Post-treatment follow-up
    await postTreatmentFollowup({
      patientId: 'patient_abc123',
      treatmentDate: new Date(),
      clinicianNotes: 'M54.5 - Acute lower back pain, no red flags, good progress',
      condition: {
        icd10Code: 'M54.5',
        name: 'Korsryggsmerter',
        bodyRegion: 'Korsrygg',
        symptoms: ['Akutte smerter i nedre del av ryggen', 'Forverring ved bøying'],
        severity: 'moderate'
      },
      patientEmail: 'patient@example.com'
    });

    // Example 2: Batch processing (simulate 5 patients)
    await batchFollowup({
      patients: [
        {
          id: 'p1',
          email: 'p1@example.com',
          condition: { name: 'Nakkesmerter', bodyRegion: 'Nakke', symptoms: [] },
          lastContact: new Date('2025-09-25')
        },
        {
          id: 'p2',
          email: 'p2@example.com',
          condition: { name: 'Knesmerter', bodyRegion: 'Kne', symptoms: [] },
          lastContact: new Date('2025-09-20')
        },
        {
          id: 'p3',
          email: 'p3@example.com',
          condition: { name: 'Skuldersmerter', bodyRegion: 'Skulder', symptoms: [] },
          lastContact: new Date('2025-09-15')
        }
      ],
      batchSize: 2
    });

  })();
}
