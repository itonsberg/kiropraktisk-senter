/**
 * Test Script: Send Patient Research Email
 *
 * This script tests the complete patient research pipeline:
 * 1. Research a medical condition
 * 2. Extract and verify claims
 * 3. Synthesize patient-friendly report
 * 4. Send email via Resend
 *
 * Usage:
 * npx tsx scripts/test-patient-email.ts [your-email@example.com]
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

interface TestCondition {
  name: string;
  icd10Code: string;
  bodyRegion: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

const TEST_CONDITIONS: TestCondition[] = [
  {
    name: 'Korsryggsmerter',
    icd10Code: 'M54.5',
    bodyRegion: 'Korsrygg',
    symptoms: [
      'Smerter i nedre del av ryggen',
      'Stivhet om morgenen',
      'Forverring ved løfting',
      'Bedring i hvile'
    ],
    severity: 'moderate'
  },
  {
    name: 'Nakkesmerter',
    icd10Code: 'M54.2',
    bodyRegion: 'Nakke',
    symptoms: [
      'Stiv nakke',
      'Hodepine i bakhodet',
      'Smerter som stråler til skulder'
    ],
    severity: 'moderate'
  },
  {
    name: 'Knesmerter',
    icd10Code: 'M25.56',
    bodyRegion: 'Kne',
    symptoms: [
      'Smerte ved belastning',
      'Hevelse',
      'Redusert bevegelighet'
    ],
    severity: 'moderate'
  }
];

async function testPatientResearch(condition: TestCondition, email: string, sendEmail: boolean = true) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 TESTING PATIENT RESEARCH: ${condition.name}`);
  console.log(`${'='.repeat(80)}\n`);

  const start = Date.now();

  try {
    const response = await fetch(`${API_URL}/api/patient-research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        condition,
        patientContext: 'Kontoransatt, sittende arbeid 8 timer/dag',
        patientEmail: email,
        focus: 'all',
        sendEmail
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    const duration = Date.now() - start;

    console.log(`\n✅ RESEARCH COMPLETE (${(duration / 1000).toFixed(1)}s)\n`);

    console.log(`📊 Report Summary:`);
    console.log(`   Condition: ${result.report.condition.name}`);
    console.log(`   Evidence Grade: ${result.report.evidenceGrade}`);
    console.log(`   Confidence: ${(result.report.confidence * 100).toFixed(0)}%`);
    console.log(`   Key Findings: ${result.report.keyFindings.length}`);
    console.log(`   Exercises: ${result.report.exercises.length}`);
    console.log(`   Safety Warnings: ${result.report.safetyWarnings.length}`);

    console.log(`\n📧 Email Status:`);
    console.log(`   Sent: ${result.metadata.emailSent ? '✅ Yes' : '❌ No'}`);
    if (result.metadata.emailError) {
      console.log(`   Error: ${result.metadata.emailError}`);
    }
    if (result.metadata.emailSent) {
      console.log(`   Recipient: ${email}`);
    }

    console.log(`\n💰 Cost Breakdown:`);
    console.log(`   Research tokens: ${result.metadata.totalCitations} citations`);
    console.log(`   Total claims: ${result.metadata.totalClaims}`);
    console.log(`   Estimated cost: $${result.metadata.cost.total.toFixed(4)}`);

    console.log(`\n📝 Sample Summary (first 200 chars):`);
    console.log(`   "${result.report.summary.slice(0, 200)}..."`);

    if (result.report.exercises.length > 0) {
      console.log(`\n💪 Sample Exercise:`);
      const ex = result.report.exercises[0];
      console.log(`   Name: ${ex.name}`);
      console.log(`   Frequency: ${ex.frequency}`);
      console.log(`   Duration: ${ex.duration}`);
    }

    console.log(`\n${'='.repeat(80)}\n`);

    return result;

  } catch (error) {
    console.error(`\n❌ TEST FAILED:`, error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'test@example.com';
  const conditionIndex = parseInt(args[1] || '0');
  const sendEmail = args[2] !== 'false'; // Send by default

  console.log(`\n🚀 PATIENT RESEARCH EMAIL TEST\n`);
  console.log(`   API URL: ${API_URL}`);
  console.log(`   Test Email: ${email}`);
  console.log(`   Send Email: ${sendEmail}`);
  console.log(`   Condition: ${TEST_CONDITIONS[conditionIndex].name}\n`);

  // Check API health
  console.log(`⚡ Checking API status...`);
  const healthCheck = await fetch(`${API_URL}/api/patient-research`);
  const health = await healthCheck.json();

  console.log(`   Status: ${health.status}`);
  console.log(`   Email Sending: ${health.capabilities.emailSending ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   OpenAI: ${health.configuration.openaiApiKey}`);
  console.log(`   Resend: ${health.configuration.resendApiKey}`);

  if (!health.capabilities.emailSending && sendEmail) {
    console.log(`\n⚠️  WARNING: Email sending is disabled but sendEmail=true`);
    console.log(`   Proceeding anyway (report will be generated without sending)\n`);
  }

  // Run test
  const condition = TEST_CONDITIONS[conditionIndex];
  await testPatientResearch(condition, email, sendEmail);

  console.log(`✅ TEST COMPLETE\n`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('\n💥 FATAL ERROR:', error);
    process.exit(1);
  });
}
