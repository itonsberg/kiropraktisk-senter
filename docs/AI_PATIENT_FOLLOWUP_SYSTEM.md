# AI Patient Follow-up System (APFS)
## Personalized Research & Communication Pipeline

**Version:** 1.0
**Date:** 2025-10-25
**Status:** Planning Phase

---

## 🎯 Executive Summary

An intelligent patient follow-up system that automatically researches patient conditions using scientific evidence, generates personalized treatment plans and exercises, and maintains conversational context through email-based dialogue.

### Key Value Propositions
- **Automated Post-Treatment Care**: Reduces clinician workload while improving patient outcomes
- **Evidence-Based Recommendations**: All suggestions rooted in scientific research via Mahana Engine
- **Personalized Journey**: Each patient gets tailored advice based on their specific condition
- **Conversational AI**: Patients can reply to emails and continue the dialogue
- **Scalable Care**: One clinician can effectively support hundreds of patients

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SYSTEM OVERVIEW                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Supabase   │──1──▶│  Trigger     │──2──▶│   AI Agent   │
│   Database   │      │  Service     │      │   Pipeline   │
└──────────────┘      └──────────────┘      └──────────────┘
                                                     │
                                                     │3
                                                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    Resend    │◀──6──│   Research   │◀──4──│    Mahana    │
│    Email     │      │  Synthesizer │      │    Engine    │
└──────────────┘      └──────────────┘      └──────────────┘
      │                                              │
      │7                                             │5
      ▼                                              ▼
┌──────────────┐                            ┌──────────────┐
│   Patient    │──8──▶  Reply Handler  ──9─▶│  Supabase    │
│   Inbox      │                             │  Threads DB  │
└──────────────┘                            └──────────────┘
```

---

## 📊 Database Schema (Supabase)

### **Table: patients**
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',

  -- Patient preferences
  communication_preferences JSONB DEFAULT '{
    "email_enabled": true,
    "frequency": "standard",
    "language": "no"
  }'::jsonb
);
```

### **Table: treatments**
```sql
CREATE TABLE treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  clinician_id UUID REFERENCES clinicians(id),
  treatment_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Clinical data
  chief_complaint TEXT NOT NULL,
  diagnosis TEXT,
  treatment_notes TEXT,
  clinical_findings JSONB,

  -- Structured data for AI
  condition_codes TEXT[], -- ICD-10 codes
  body_regions TEXT[], -- ['lower_back', 'neck', etc]
  severity_score INTEGER CHECK (severity_score BETWEEN 1 AND 10),

  -- AI Processing
  ai_research_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  ai_research_completed_at TIMESTAMPTZ,
  ai_followup_sent_at TIMESTAMPTZ,
  next_followup_due TIMESTAMPTZ
);
```

### **Table: ai_research_sessions**
```sql
CREATE TABLE ai_research_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  treatment_id UUID REFERENCES treatments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Research input
  research_query JSONB NOT NULL,
  condition_summary TEXT NOT NULL,

  -- Mahana Engine results
  research_findings JSONB, -- Raw research data
  evidence_level TEXT, -- 'high', 'medium', 'low'
  sources_count INTEGER,

  -- AI synthesis
  personalized_plan JSONB, -- Exercises, tips, timeline
  email_content TEXT,

  -- Quality metrics
  confidence_score DECIMAL(3,2),
  processing_time_ms INTEGER,

  status TEXT DEFAULT 'processing' -- processing, completed, failed
);
```

### **Table: patient_conversations**
```sql
CREATE TABLE patient_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  treatment_id UUID REFERENCES treatments(id),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  research_session_id UUID REFERENCES ai_research_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Email thread tracking
  email_thread_id TEXT UNIQUE NOT NULL, -- Resend thread ID
  subject TEXT NOT NULL,

  -- Conversation metadata
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' -- active, resolved, archived
);
```

### **Table: conversation_messages**
```sql
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES patient_conversations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Message data
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sender_email TEXT NOT NULL,
  content TEXT NOT NULL,
  content_html TEXT,

  -- AI processing
  ai_analyzed BOOLEAN DEFAULT FALSE,
  ai_sentiment TEXT, -- positive, neutral, negative, urgent
  ai_intent TEXT, -- question, concern, feedback, emergency
  ai_response TEXT, -- AI generated response

  -- Email metadata
  resend_message_id TEXT UNIQUE,
  resend_status TEXT
);
```

---

## 🔄 System Workflow

### **Phase 1: Treatment → Research Trigger**

```typescript
// 1. Clinician updates journal in admin panel
// Trigger: After treatment record is updated

interface TreatmentUpdate {
  patientId: string;
  treatmentId: string;
  chiefComplaint: string;
  diagnosis: string;
  clinicalFindings: {
    bodyRegions: string[];
    symptoms: string[];
    severity: number;
    mobility: string;
    painLevel: number;
  };
  treatmentNotes: string;
}

// 2. Schedule AI research (1 hour after treatment or monthly)
async function scheduleAIResearch(treatment: TreatmentUpdate) {
  const trigger = {
    type: 'post_treatment',
    delay: '1 hour', // or 'monthly'
    treatmentId: treatment.treatmentId
  };

  await scheduledJobs.create({
    name: 'ai-patient-research',
    runAt: new Date(Date.now() + 3600000),
    data: treatment
  });
}
```

### **Phase 2: AI Research Pipeline**

```typescript
// 3. Mahana Engine Integration
interface MahanaResearchRequest {
  condition: string;
  symptoms: string[];
  bodyRegion: string[];
  patientContext: {
    age?: number;
    activityLevel?: string;
    previousTreatments?: string[];
  };
  researchScope: {
    exercises: boolean;
    studies: boolean;
    tips: boolean;
    timeline: boolean;
  };
}

async function conductResearch(treatment: TreatmentUpdate) {
  // Build research query
  const query: MahanaResearchRequest = {
    condition: treatment.diagnosis,
    symptoms: treatment.clinicalFindings.symptoms,
    bodyRegion: treatment.clinicalFindings.bodyRegions,
    patientContext: {},
    researchScope: {
      exercises: true,
      studies: true,
      tips: true,
      timeline: true
    }
  };

  // Call Mahana Engine
  const research = await mahanaEngine.research(query);

  // Store research session
  const session = await db.aiResearchSessions.create({
    treatmentId: treatment.treatmentId,
    patientId: treatment.patientId,
    researchQuery: query,
    conditionSummary: treatment.chiefComplaint,
    researchFindings: research.findings,
    evidenceLevel: research.evidenceLevel,
    sourcesCount: research.sources.length,
    status: 'processing'
  });

  return { session, research };
}
```

### **Phase 3: AI Synthesis & Personalization**

```typescript
// 4. Generate personalized content with AI
async function synthesizePersonalizedPlan(
  research: MahanaResearchResult,
  treatment: TreatmentUpdate,
  patient: Patient
) {
  const prompt = `
You are a medical research assistant for Kiropraktisk Senter.

PATIENT CONTEXT:
- Name: ${patient.name}
- Condition: ${treatment.diagnosis}
- Symptoms: ${treatment.clinicalFindings.symptoms.join(', ')}
- Severity: ${treatment.clinicalFindings.severity}/10
- Body Region: ${treatment.clinicalFindings.bodyRegions.join(', ')}

RESEARCH FINDINGS:
${JSON.stringify(research.findings, null, 2)}

TASK:
Create a personalized follow-up email with:

1. EMPATHY & UNDERSTANDING (2-3 sentences)
   - Acknowledge their condition
   - Show you understand their discomfort

2. RESEARCH SUMMARY (3-4 sentences)
   - What the science says about their condition
   - Expected recovery timeline based on evidence
   - Cite 2-3 key studies from the research

3. PERSONALIZED EXERCISE PLAN
   - 3-5 exercises specific to their condition
   - Clear instructions with frequency/duration
   - Progression timeline
   - Visual references if available

4. LIFESTYLE TIPS (3-5 bullet points)
   - Evidence-based recommendations
   - Specific to their condition
   - Practical and actionable

5. QUESTIONS TO MONITOR PROGRESS
   - 3-4 yes/no questions to track improvement
   - Help identify if they need to return

6. NEXT STEPS
   - When to expect improvement
   - When to contact clinic
   - Encouragement to reply with questions

Format in clean, readable Norwegian. Be warm but professional.
Use markdown for structure.
`;

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'You are a medical research assistant specialized in evidence-based patient education.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  const emailContent = aiResponse.choices[0].message.content;

  // Store the synthesis
  await db.aiResearchSessions.update(session.id, {
    personalizedPlan: {
      exercises: extractExercises(emailContent),
      tips: extractTips(emailContent),
      timeline: extractTimeline(emailContent)
    },
    emailContent,
    confidenceScore: research.evidenceLevel === 'high' ? 0.95 : 0.85,
    completedAt: new Date(),
    status: 'completed'
  });

  return emailContent;
}
```

### **Phase 4: Email Delivery (Resend)**

```typescript
// 5. Send personalized email via Resend
async function sendFollowupEmail(
  patient: Patient,
  emailContent: string,
  session: AIResearchSession
) {
  const email = await resend.emails.create({
    from: 'Kiropraktisk Senter <followup@kiropraktisksenter.no>',
    to: patient.email,
    subject: `Din personlige oppfølging - ${session.conditionSummary}`,
    html: markdownToHtml(emailContent),
    headers: {
      'X-Patient-ID': patient.id,
      'X-Session-ID': session.id,
      'X-Treatment-ID': session.treatmentId
    },
    tags: [
      { name: 'type', value: 'ai-followup' },
      { name: 'condition', value: session.conditionSummary }
    ]
  });

  // Store conversation thread
  await db.patientConversations.create({
    treatmentId: session.treatmentId,
    patientId: patient.id,
    researchSessionId: session.id,
    emailThreadId: email.id,
    subject: `Din personlige oppfølging - ${session.conditionSummary}`,
    messageCount: 1,
    lastMessageAt: new Date()
  });

  // Store first message
  await db.conversationMessages.create({
    conversationId: conversation.id,
    direction: 'outbound',
    senderEmail: 'followup@kiropraktisksenter.no',
    content: emailContent,
    contentHtml: markdownToHtml(emailContent),
    resendMessageId: email.id,
    resendStatus: 'sent'
  });

  return email;
}
```

### **Phase 5: Reply Handling & Conversation**

```typescript
// 6. Resend webhook: Patient replies to email
app.post('/api/webhooks/resend/inbound', async (req, res) => {
  const { from, to, subject, html, text, headers } = req.body;

  // Find conversation thread
  const conversation = await db.patientConversations.findByEmailThread(
    headers['References'] || headers['In-Reply-To']
  );

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  // Store incoming message
  const message = await db.conversationMessages.create({
    conversationId: conversation.id,
    direction: 'inbound',
    senderEmail: from,
    content: text,
    contentHtml: html,
    aiAnalyzed: false
  });

  // Analyze message intent
  const analysis = await analyzePatientMessage(message.content);

  // Update message with analysis
  await db.conversationMessages.update(message.id, {
    aiAnalyzed: true,
    aiSentiment: analysis.sentiment,
    aiIntent: analysis.intent
  });

  // Handle urgent cases
  if (analysis.intent === 'emergency' || analysis.sentiment === 'urgent') {
    await notifyClinician({
      patientId: conversation.patientId,
      message: message.content,
      urgency: 'high'
    });
  }

  // Generate AI response
  const aiResponse = await generateContextualResponse(
    conversation,
    message,
    analysis
  );

  // Send reply
  await sendAIReply(conversation, aiResponse);

  res.json({ success: true });
});

// 7. Generate contextual AI response
async function generateContextualResponse(
  conversation: PatientConversation,
  incomingMessage: ConversationMessage,
  analysis: MessageAnalysis
) {
  // Get conversation history
  const history = await db.conversationMessages.findByConversation(
    conversation.id,
    { limit: 10, orderBy: 'created_at ASC' }
  );

  // Get original research session
  const research = await db.aiResearchSessions.findById(
    conversation.researchSessionId
  );

  const prompt = `
You are a medical research assistant continuing a conversation with a patient.

ORIGINAL RESEARCH CONTEXT:
${JSON.stringify(research.researchFindings, null, 2)}

CONVERSATION HISTORY:
${history.map(m => `[${m.direction}] ${m.content}`).join('\n')}

PATIENT'S LATEST MESSAGE:
${incomingMessage.content}

MESSAGE ANALYSIS:
- Sentiment: ${analysis.sentiment}
- Intent: ${analysis.intent}
- Key concerns: ${analysis.concerns?.join(', ')}

TASK:
Respond to the patient's message with:
1. Direct answer to their question/concern
2. Reference to original research if relevant
3. Additional evidence-based advice if applicable
4. Reassurance and next steps
5. Encouragement to continue dialogue

Keep response concise (150-200 words).
Use warm, professional Norwegian.
If urgent/emergency detected, advise to contact clinic immediately.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'You are a medical research assistant providing evidence-based patient support.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.6,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}

// 8. Send AI reply via Resend
async function sendAIReply(
  conversation: PatientConversation,
  content: string
) {
  const patient = await db.patients.findById(conversation.patientId);

  const email = await resend.emails.create({
    from: 'Kiropraktisk Senter <followup@kiropraktisksenter.no>',
    to: patient.email,
    subject: `Re: ${conversation.subject}`,
    html: markdownToHtml(content),
    headers: {
      'In-Reply-To': conversation.emailThreadId,
      'References': conversation.emailThreadId
    },
    tags: [
      { name: 'type', value: 'ai-reply' }
    ]
  });

  // Store outbound message
  await db.conversationMessages.create({
    conversationId: conversation.id,
    direction: 'outbound',
    senderEmail: 'followup@kiropraktisksenter.no',
    content,
    contentHtml: markdownToHtml(content),
    resendMessageId: email.id
  });

  // Update conversation
  await db.patientConversations.update(conversation.id, {
    messageCount: conversation.messageCount + 1,
    lastMessageAt: new Date()
  });
}
```

---

## 🧩 Integration Points

### **1. Mahana Engine Integration**

```typescript
// mahana-engine/client.ts
export class MahanaEngineClient {
  private apiKey: string;
  private baseUrl: string;

  async research(query: MahanaResearchRequest): Promise<MahanaResearchResult> {
    const response = await fetch(`${this.baseUrl}/api/research`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        condition: query.condition,
        symptoms: query.symptoms,
        filters: {
          evidenceLevel: ['systematic_review', 'rct', 'cohort'],
          publicationYears: [2015, 2024],
          languages: ['en', 'no', 'se', 'dk']
        },
        scope: query.researchScope
      })
    });

    return response.json();
  }

  async searchExercises(condition: string, bodyRegion: string[]): Promise<Exercise[]> {
    // Search for evidence-based exercises
  }

  async getStudies(topic: string, limit: number = 10): Promise<Study[]> {
    // Fetch relevant studies
  }
}

interface MahanaResearchResult {
  findings: {
    overview: string;
    keyPoints: string[];
    studies: Study[];
    exercises: Exercise[];
    recoveryTimeline: Timeline;
  };
  evidenceLevel: 'high' | 'medium' | 'low';
  sources: Source[];
  confidence: number;
}
```

### **2. Resend Integration**

```typescript
// lib/email/resend-client.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Webhook setup for inbound emails
export async function setupResendWebhooks() {
  await resend.webhooks.create({
    url: `${process.env.APP_URL}/api/webhooks/resend/inbound`,
    events: ['email.received', 'email.delivered', 'email.bounced']
  });
}

// Email templates
export const templates = {
  followUp: (patient: Patient, content: string) => ({
    from: 'Kiropraktisk Senter <followup@kiropraktisksenter.no>',
    replyTo: 'followup@kiropraktisksenter.no',
    to: patient.email,
    subject: 'Din personlige oppfølging',
    html: renderTemplate('follow-up', { patient, content })
  })
};
```

### **3. Supabase Realtime Triggers**

```sql
-- Trigger: Auto-schedule AI research after treatment update
CREATE OR REPLACE FUNCTION trigger_ai_research()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if diagnosis is set and not already processed
  IF NEW.diagnosis IS NOT NULL
     AND NEW.ai_research_status = 'pending'
     AND OLD.ai_research_status IS DISTINCT FROM 'completed' THEN

    -- Schedule research job (1 hour delay)
    INSERT INTO scheduled_jobs (
      job_type,
      run_at,
      payload,
      status
    ) VALUES (
      'ai_patient_research',
      NOW() + INTERVAL '1 hour',
      jsonb_build_object(
        'treatment_id', NEW.id,
        'patient_id', NEW.patient_id,
        'trigger_type', 'post_treatment'
      ),
      'pending'
    );

    NEW.ai_research_status := 'scheduled';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_treatment_update
  BEFORE UPDATE ON treatments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_ai_research();
```

---

## 📅 Scheduling & Automation

### **Job Scheduler (using pg_cron or external scheduler)**

```typescript
// jobs/ai-research-scheduler.ts
import { CronJob } from 'cron';

// Run AI research for scheduled treatments
export const aiResearchJob = new CronJob('*/15 * * * *', async () => {
  const pendingJobs = await db.scheduledJobs.findPending({
    jobType: 'ai_patient_research',
    runAtBefore: new Date()
  });

  for (const job of pendingJobs) {
    try {
      await processAIResearch(job.payload);
      await db.scheduledJobs.markCompleted(job.id);
    } catch (error) {
      await db.scheduledJobs.markFailed(job.id, error.message);
    }
  }
});

// Monthly follow-ups for ongoing conditions
export const monthlyFollowUpJob = new CronJob('0 9 1 * *', async () => {
  const patientsForFollowUp = await db.treatments.findMonthlyFollowUps();

  for (const treatment of patientsForFollowUp) {
    await scheduleAIResearch({
      ...treatment,
      triggerType: 'monthly_followup'
    });
  }
});
```

---

## 🔒 Security & Privacy

### **GDPR Compliance**

```typescript
// Patient consent management
interface ConsentSettings {
  aiProcessing: boolean; // Consent for AI analysis
  emailCommunication: boolean; // Consent for automated emails
  dataRetention: number; // Days to keep data
  researchParticipation: boolean; // Anonymous research data
}

// Data encryption
async function encryptSensitiveData(data: any) {
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: generateIV() },
    await getEncryptionKey(),
    new TextEncoder().encode(JSON.stringify(data))
  );
  return Buffer.from(encrypted).toString('base64');
}

// Audit logging
await db.auditLog.create({
  action: 'ai_research_conducted',
  patientId: patient.id,
  treatmentId: treatment.id,
  timestamp: new Date(),
  metadata: {
    sessionId: session.id,
    dataAccessed: ['diagnosis', 'symptoms', 'clinical_findings']
  }
});
```

### **Access Control**

```sql
-- Row Level Security (RLS) policies
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view their own patients"
  ON treatments FOR SELECT
  USING (clinician_id = auth.uid());

CREATE POLICY "AI service can update research status"
  ON treatments FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'ai_service')
  WITH CHECK (auth.jwt() ->> 'role' = 'ai_service');
```

---

## 💰 Cost Estimation

### **Monthly Operating Costs (100 patients)**

| Service | Usage | Cost/Month |
|---------|-------|------------|
| **Supabase** | Database + Auth | $25 |
| **Resend** | 400 emails (4 per patient) | $5 |
| **OpenAI GPT-4** | 100 sessions × 2000 tokens | $20 |
| **Mahana Engine** | 100 research queries | $50 |
| **Vercel/Hosting** | Edge functions + storage | $20 |
| **Total** | | **~$120/month** |

### **Scaling (1000 patients)**

| Service | Usage | Cost/Month |
|---------|-------|------------|
| **Supabase** | Pro plan | $25 |
| **Resend** | 4000 emails | $20 |
| **OpenAI GPT-4** | 1000 sessions | $200 |
| **Mahana Engine** | 1000 queries | $400 |
| **Vercel/Hosting** | Pro plan | $20 |
| **Total** | | **~$665/month** |

**Revenue potential**: 1000 patients × 50 NOK/month = 50,000 NOK/month
**Profit margin**: ~93% (50,000 - 665 = 49,335 NOK/month)

---

## 🚀 Implementation Phases

### **Phase 1: MVP (4 weeks)**
- ✅ Supabase schema setup
- ✅ Basic AI research pipeline
- ✅ Mahana Engine integration
- ✅ Resend email sending
- ✅ Admin trigger interface

### **Phase 2: Conversation (3 weeks)**
- ✅ Inbound email webhook
- ✅ Message analysis (sentiment/intent)
- ✅ Contextual AI responses
- ✅ Conversation threading

### **Phase 3: Automation (2 weeks)**
- ✅ Scheduled follow-ups
- ✅ Monthly recurring checks
- ✅ Clinician notifications
- ✅ Analytics dashboard

### **Phase 4: Optimization (2 weeks)**
- ✅ A/B testing email templates
- ✅ Response quality scoring
- ✅ Patient satisfaction tracking
- ✅ Cost optimization

---

## 📊 Success Metrics

### **Key Performance Indicators (KPIs)**

1. **Patient Engagement**
   - Email open rate: Target 60%+
   - Reply rate: Target 30%+
   - Exercise compliance: Target 50%+

2. **Clinical Outcomes**
   - Symptom improvement: Track via follow-up questions
   - Return visit reduction: Target 20% decrease
   - Patient satisfaction: Target NPS 50+

3. **System Performance**
   - Research accuracy: 90%+ evidence-based
   - Response time: <24 hours for replies
   - Email deliverability: 98%+

4. **Business Impact**
   - Clinician time saved: Target 2-3 hours/week
   - Patient retention: Target +15%
   - Revenue per patient: Track upsell opportunities

---

## 🔧 Technical Stack

```yaml
Backend:
  - Runtime: Node.js / Bun
  - Framework: Next.js 14+ (API Routes)
  - Database: Supabase (PostgreSQL)
  - Queue: pg_boss or Bull
  - Cron: node-cron or Supabase pg_cron

AI/ML:
  - LLM: OpenAI GPT-4 Turbo
  - Research: Mahana Engine (custom)
  - Vector Search: Supabase pgvector (optional)

Communication:
  - Email: Resend
  - Templates: React Email
  - Markdown: marked / remark

Infrastructure:
  - Hosting: Vercel Edge Functions
  - CDN: Vercel Edge Network
  - Monitoring: Sentry
  - Analytics: PostHog

Development:
  - Language: TypeScript
  - Testing: Vitest + Playwright
  - CI/CD: GitHub Actions
```

---

## 🎨 Email Template Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', sans-serif; color: #333; }
    .header { background: linear-gradient(135deg, #f48337 0%, #d6c5ab 100%); padding: 30px; }
    .content { padding: 30px; max-width: 600px; margin: 0 auto; }
    .exercise-card { border-left: 4px solid #f48337; padding: 15px; margin: 15px 0; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://kiropraktisksenter.no/logo.png" alt="Logo" width="150">
  </div>

  <div class="content">
    <h2>Hei {{patient_name}},</h2>

    <p>Takk for at du besøkte oss! Vi har gjennomført forskning på din tilstand og satt sammen en personlig plan for deg. ✨</p>

    <h3>🔬 Hva forskningen sier</h3>
    <p>{{research_summary}}</p>

    <h3>💪 Dine personlige øvelser</h3>
    {{#each exercises}}
    <div class="exercise-card">
      <strong>{{name}}</strong>
      <p>{{description}}</p>
      <small>Hyppighet: {{frequency}} | Varighet: {{duration}}</small>
    </div>
    {{/each}}

    <h3>📋 Tips for raskere bedring</h3>
    <ul>
      {{#each tips}}
      <li>{{this}}</li>
      {{/each}}
    </ul>

    <h3>❓ Spørsmål til deg</h3>
    <p>Svar gjerne på disse for å hjelpe oss følge din fremgang:</p>
    <ul>
      {{#each questions}}
      <li>{{this}}</li>
      {{/each}}
    </ul>

    <p><strong>Har du spørsmål?</strong> Bare svar på denne e-posten, så svarer vår AI-assistent deg!</p>

    <p>Med vennlig hilsen,<br>
    Teamet ved Kiropraktisk Senter</p>
  </div>
</body>
</html>
```

---

## 🎯 Next Steps

1. **Week 1-2**: Database setup + basic pipeline
2. **Week 3-4**: Mahana integration + AI synthesis
3. **Week 5-6**: Email system + conversation handling
4. **Week 7-8**: Testing + refinement
5. **Week 9**: Beta launch with 10 patients
6. **Week 10-12**: Iterate based on feedback
7. **Week 13+**: Full launch

---

**Questions? Want to dive deeper into any section?**
