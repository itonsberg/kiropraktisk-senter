# AI Patient Follow-up System - V2 Implementation Plan
## Based on Clarified Requirements

**Date:** 2025-10-25
**Status:** Ready to Build

---

## ✅ RESOLVED DECISIONS

### 1. **Mahana Engine: BUILT ✓**
- Cost: ~$0.01 per topic (extremely affordable)
- Already has 7-9 verification stages
- Proven to prevent hallucinations
- Need to check current "ultrathink" stages

### 2. **Legal/Ethics: Research-Based, Not Medical Advice ✓**
- Transparent that it's Kiro AI (not pretending to be human)
- Include sources prominently in emails
- Let users verify research themselves
- Clear educational disclaimer

### 3. **Data Privacy: Blackbox/Encryption Required ✓**
- Clinician sends journal → Anonymization layer → AI processing
- AI never sees sensitive patient identifiers
- Need to design encryption pipeline

### 4. **Clinician Workflow: Simple Send System ✓**
- After each visit, clinician can trigger research
- Optional: Patients connect via HelseNorge API

### 5. **Email Platform: Resend vs Knock.app ✓**
- Need to evaluate both
- Knock.app has interesting features (what specifically?)

### 6. **System Monitoring: Health & Learning ✓**
- Small pings, summarization
- System learns over time

---

## 🏗️ REVISED ARCHITECTURE

```
┌────────────────────────────────────────────────────────────┐
│                  PRIVACY-FIRST PIPELINE                    │
└────────────────────────────────────────────────────────────┘

1. CLINICIAN INPUT
   ↓
┌─────────────────────────┐
│  Journal Entry          │  "Pasient: John Doe, 35 år
│  (Contains PII)         │   Diagnose: L4-L5 prolaps
│                         │   Smertenivå: 7/10..."
└─────────────────────────┘
   ↓
2. ANONYMIZATION LAYER (Critical!)
   ↓
┌─────────────────────────┐
│  Encrypted Payload      │  {
│  (Zero PII)             │    session_id: "uuid-abc-123",
│                         │    condition: "lumbar_disc_herniation",
│                         │    severity: 7,
│                         │    body_region: ["lower_back"],
│                         │    symptoms_hash: "sha256..."
│                         │  }
└─────────────────────────┘
   ↓
3. MAHANA ENGINE (Blackbox)
   ↓
┌─────────────────────────┐
│  Research Results       │  {
│  (Evidence-based)       │    studies: [...],
│                         │    exercises: [...],
│                         │    timeline: {...}
│                         │  }
└─────────────────────────┘
   ↓
4. AI SYNTHESIS (Still anonymized)
   ↓
┌─────────────────────────┐
│  Personalized Plan      │  Template ready, but no name yet
│  (Generic template)     │
└─────────────────────────┘
   ↓
5. RE-IDENTIFICATION (Only for sending)
   ↓
┌─────────────────────────┐
│  Final Email            │  "Hei John, basert på forskning om
│  (With patient name)    │   L4-L5 prolaps..."
└─────────────────────────┘
   ↓
6. RESEND/KNOCK → Patient

```

---

## 🔐 ANONYMIZATION PIPELINE (The Critical Part)

### **Design Pattern: Zero-Knowledge Architecture**

```typescript
// lib/privacy/anonymizer.ts

interface PatientJournal {
  // Raw input from clinician (CONTAINS PII)
  patientId: string;
  patientName: string;
  patientEmail: string;
  age: number;
  gender: string;
  treatmentDate: Date;
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  severity: number;
}

interface AnonymizedPayload {
  // What AI sees (ZERO PII)
  sessionId: string; // Random UUID, not linked to patient
  demographicHash: string; // Age+gender hashed
  conditionCode: string; // Standardized medical code
  bodyRegions: string[];
  symptoms: string[];
  severity: number;
  contextHash: string; // Clinical context, hashed

  // Metadata for system
  timestamp: number;
  version: string;
}

interface ReidentificationKey {
  // Stored separately, encrypted at rest
  sessionId: string;
  patientId: string;
  patientEmail: string;
  encryptedName: string; // AES-256 encrypted
  treatmentId: string;
}

export class PrivacyPipeline {
  private encryptionKey: CryptoKey;

  async anonymize(journal: PatientJournal): Promise<{
    payload: AnonymizedPayload;
    reidentKey: ReidentificationKey;
  }> {
    const sessionId = crypto.randomUUID();

    // Extract medical info (no PII)
    const payload: AnonymizedPayload = {
      sessionId,
      demographicHash: await this.hashDemographics(journal.age, journal.gender),
      conditionCode: await this.mapToICD10(journal.diagnosis),
      bodyRegions: await this.extractBodyRegions(journal.chiefComplaint),
      symptoms: await this.extractSymptoms(journal.clinicalNotes),
      severity: journal.severity,
      contextHash: await this.hashContext(journal.clinicalNotes),
      timestamp: Date.now(),
      version: '1.0'
    };

    // Create reident key (stored separately!)
    const reidentKey: ReidentificationKey = {
      sessionId,
      patientId: journal.patientId,
      patientEmail: journal.patientEmail,
      encryptedName: await this.encrypt(journal.patientName),
      treatmentId: journal.treatmentDate.toISOString()
    };

    return { payload, reidentKey };
  }

  private async hashDemographics(age: number, gender: string): Promise<string> {
    // Create age bucket to prevent exact age tracking
    const ageBucket = Math.floor(age / 10) * 10; // 35 → 30-39
    const data = `${ageBucket}-${gender}`;
    const hash = await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(data)
    );
    return Buffer.from(hash).toString('hex');
  }

  private async mapToICD10(diagnosis: string): Promise<string> {
    // Map Norwegian diagnosis to ICD-10 code
    // "L4-L5 prolaps" → "M51.1"
    return await diagnosisMapper.toICD10(diagnosis);
  }

  private async extractBodyRegions(complaint: string): Promise<string[]> {
    // NLP: Extract standardized body regions
    // "Vondt i korsryggen" → ["lower_back"]
    return await nlpExtractor.bodyRegions(complaint);
  }

  private async extractSymptoms(notes: string): Promise<string[]> {
    // NLP: Extract standardized symptoms
    // "Utstråling til venstre ben" → ["radiating_pain", "leg_pain"]
    return await nlpExtractor.symptoms(notes);
  }

  private async hashContext(notes: string): Promise<string> {
    // Hash clinical context for ML/research (anonymized)
    const hash = await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(notes)
    );
    return Buffer.from(hash).toString('hex');
  }

  private async encrypt(data: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      new TextEncoder().encode(data)
    );
    return Buffer.from(encrypted).toString('base64');
  }

  async reidentify(
    sessionId: string,
    template: string
  ): Promise<{ email: string; content: string }> {
    // Fetch reident key from secure storage
    const key = await db.reidentKeys.findBySession(sessionId);

    if (!key) {
      throw new Error('Reidentification key not found');
    }

    // Decrypt patient name
    const patientName = await this.decrypt(key.encryptedName);

    // Merge template with real data
    const content = template
      .replace('{{patient_name}}', patientName)
      .replace('{{session_id}}', sessionId);

    return {
      email: key.patientEmail,
      content
    };
  }

  async purge(sessionId: string): Promise<void> {
    // After email sent, delete reident key (GDPR compliance)
    await db.reidentKeys.delete(sessionId);
  }
}
```

---

## 🗄️ DATABASE SCHEMA (Updated)

### **Separation of Concerns**

```sql
-- ENCRYPTED DATABASE: Contains PII
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name_encrypted TEXT NOT NULL, -- AES-256
  phone_encrypted TEXT, -- AES-256
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PUBLIC DATABASE: No PII, can be used by AI
CREATE TABLE anonymized_sessions (
  session_id UUID PRIMARY KEY,
  demographic_hash TEXT NOT NULL,
  condition_code TEXT NOT NULL, -- ICD-10
  body_regions TEXT[],
  symptoms TEXT[],
  severity INTEGER,
  context_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- No link to patient! Completely isolated.
);

CREATE TABLE research_results (
  session_id UUID REFERENCES anonymized_sessions(session_id),
  mahana_findings JSONB NOT NULL,
  evidence_level TEXT,
  sources JSONB,
  ai_synthesis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENCRYPTED DATABASE: Reidentification keys
CREATE TABLE reident_keys (
  session_id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_email_encrypted TEXT NOT NULL,
  patient_name_encrypted TEXT NOT NULL,
  treatment_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),

  -- Auto-delete after 7 days for GDPR
  CHECK (expires_at > created_at)
);

-- Auto-purge expired keys
CREATE OR REPLACE FUNCTION purge_expired_keys()
RETURNS void AS $$
BEGIN
  DELETE FROM reident_keys
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Run daily
SELECT cron.schedule('purge-keys', '0 2 * * *', 'SELECT purge_expired_keys()');
```

### **Row-Level Security (RLS)**

```sql
-- AI service can ONLY read anonymized data
ALTER TABLE anonymized_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI service read only"
  ON anonymized_sessions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'ai_service');

-- No one can read reident keys via SQL
ALTER TABLE reident_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can access reident keys"
  ON reident_keys FOR ALL
  USING (false); -- Deny all SQL access

-- Access only via stored procedures with audit logging
```

---

## 📧 EMAIL COMPARISON: Resend vs Knock.app

### **Resend**
```typescript
// Pros:
// - Vercel integration
// - Supabase integration
// - Simple API
// - Good deliverability

// Cons:
// - Basic features
// - No advanced workflow automation
// - Limited template management

const email = await resend.emails.send({
  from: 'Kiro AI <ai@kiropraktisksenter.no>',
  to: patient.email,
  subject: 'Din personlige oppfølging',
  html: content,
  headers: {
    'Reply-To': 'followup@kiropraktisksenter.no'
  }
});
```

### **Knock.app**
```typescript
// Pros:
// - Notification workflows (email + SMS + in-app)
// - Better template management
// - Preferences center (let users control frequency)
// - Better analytics
// - Multi-channel support

// Cons:
// - More complex setup
// - Slightly higher cost

await knock.workflows.trigger('patient-followup', {
  recipients: [patient.id],
  data: {
    patientName: patient.name,
    researchFindings: research,
    exercises: exercises
  },
  preferences: {
    channel_types: ['email', 'sms'], // Optional SMS
    frequency: patient.preferences.frequency
  }
});
```

**RECOMMENDATION:** Start with Resend (simpler), migrate to Knock if we need:
- SMS fallback
- In-app notifications
- Advanced preference management
- Multi-channel campaigns

---

## 🔄 COMPLETE WORKFLOW (With Privacy)

```typescript
// 1. Clinician submits journal
async function submitJournal(journal: PatientJournal) {

  // 2. Anonymize immediately
  const { payload, reidentKey } = await privacyPipeline.anonymize(journal);

  // 3. Store in separate databases
  await db.anonymizedSessions.create(payload);
  await db.reidentKeys.create(reidentKey); // Encrypted DB

  // 4. Trigger research (AI sees zero PII)
  await scheduleJob('mahana-research', {
    sessionId: payload.sessionId,
    // No patient info passed!
  });
}

// 5. Mahana Engine processes (zero knowledge)
async function conductResearch(sessionId: string) {

  // Fetch anonymized payload
  const session = await db.anonymizedSessions.findById(sessionId);

  // Call Mahana (no PII in request)
  const research = await mahanaEngine.research({
    conditionCode: session.conditionCode,
    bodyRegions: session.bodyRegions,
    symptoms: session.symptoms,
    severity: session.severity
  });

  // Store results (still no PII)
  await db.researchResults.create({
    sessionId,
    mahanaFindings: research.findings,
    evidenceLevel: research.evidenceLevel,
    sources: research.sources
  });

  // 6. AI synthesis (still anonymized)
  const synthesis = await synthesizeContent(research, session);

  await db.researchResults.update(sessionId, {
    aiSynthesis: synthesis
  });

  // 7. Schedule email send
  await scheduleJob('send-email', { sessionId });
}

// 8. Email sending (reidentification happens HERE only)
async function sendFollowupEmail(sessionId: string) {

  // Get research results (anonymized)
  const research = await db.researchResults.findBySession(sessionId);

  // Get template (no PII)
  const template = generateEmailTemplate(research);

  // Reidentify ONLY for sending
  const { email, content } = await privacyPipeline.reidentify(
    sessionId,
    template
  );

  // Send email
  await resend.emails.send({
    from: 'Kiro AI <ai@kiropraktisksenter.no>',
    to: email,
    subject: 'Forskningsbasert oppfølging fra Kiro AI',
    html: content
  });

  // IMPORTANT: Purge reident key immediately after sending
  await privacyPipeline.purge(sessionId);

  // Log (without PII)
  await auditLog.create({
    action: 'email_sent',
    sessionId,
    timestamp: new Date()
  });
}
```

---

## 🔬 MAHANA ENGINE - VERIFICATION STAGES

**Need to check "ultrathink" for exact stages, but typical flow:**

```typescript
interface MahanaVerificationPipeline {
  stages: [
    {
      name: 'Stage 1: Query Validation',
      validates: 'Medical terminology is standardized'
    },
    {
      name: 'Stage 2: Source Retrieval',
      validates: 'Studies are from trusted databases (PubMed, Cochrane)'
    },
    {
      name: 'Stage 3: Evidence Grading',
      validates: 'Quality of studies (RCT > Cohort > Case Study)'
    },
    {
      name: 'Stage 4: Citation Verification',
      validates: 'All citations actually exist and are accessible'
    },
    {
      name: 'Stage 5: Contradiction Detection',
      validates: 'No conflicting recommendations'
    },
    {
      name: 'Stage 6: Safety Check',
      validates: 'No dangerous advice, contraindications checked'
    },
    {
      name: 'Stage 7: Recency Filter',
      validates: 'Preferably last 5-10 years, note if older'
    },
    {
      name: 'Stage 8: Consensus Building',
      validates: 'Multiple sources agree'
    },
    {
      name: 'Stage 9: Human-Readable Synthesis',
      validates: 'Complexity appropriate for patient education'
    }
  ];
}
```

**TODO:** Check actual ultrathink stages and document them

---

## 🛠️ CLINICIAN INTERFACE (Simple!)

### **Option A: Web Dashboard**
```typescript
// /admin/follow-up/create

interface FollowUpForm {
  patientId: string; // Dropdown
  diagnosis: string;
  chiefComplaint: string;
  severity: number; // 1-10 slider
  bodyRegions: string[]; // Checkboxes
  clinicalNotes?: string; // Optional

  // Auto-trigger options
  sendTiming: 'immediate' | '1_hour' | '24_hours' | 'manual_review';
}

// Submit → Anonymization → Research → Email
```

### **Option B: Email-Based (Even Simpler!)**
```
Clinician sends email to: journal@kiropraktisksenter.no

Subject: Follow-up for Patient #12345

Body:
Diagnose: L4-L5 disc herniation
Severity: 7
Notes: Radiating pain to left leg, reduced mobility

→ System parses email → Anonymizes → Research → Sends to patient
```

### **Option C: HelseNorge API Integration (Future)**
```typescript
// Patient connects their journal
// System auto-fetches latest entry
// Clinician reviews → Approves → Auto-send

const entry = await helseNorgeAPI.getLatestJournalEntry(patientId);
// Parse and anonymize
```

**RECOMMENDATION:** Start with Option A (web dashboard), add Option B for convenience

---

## 📊 SYSTEM MONITORING & LEARNING

```typescript
// lib/monitoring/health-checker.ts

interface SystemHealth {
  // Performance
  averageResearchTime: number; // ms
  averageEmailDeliveryTime: number; // ms

  // Quality
  emailOpenRate: number; // %
  patientReplyRate: number; // %
  satisfactionScore: number; // 1-5 from patient feedback

  // AI Quality
  mahanaSuccessRate: number; // % successful research
  aiHallucinationDetected: number; // count
  citationVerificationRate: number; // %

  // Volume
  totalSessionsProcessed: number;
  activeConversations: number;

  // Costs
  mahanaApiCost: number; // USD
  openaiApiCost: number; // USD
  resendCost: number; // USD
}

// Ping every hour
setInterval(async () => {
  const health = await calculateSystemHealth();

  await db.systemHealth.create({
    timestamp: new Date(),
    metrics: health
  });

  // Alert if issues
  if (health.mahanaSuccessRate < 0.9) {
    await alertAdmin('Mahana success rate dropping');
  }

  if (health.emailOpenRate < 0.2) {
    await alertAdmin('Email engagement low');
  }
}, 3600000); // 1 hour

// Learning: Track what works
interface LearningData {
  conditionType: string;
  subjectLineUsed: string;
  openRate: number;
  replyRate: number;
  patientSatisfaction: number;
}

// Over time, optimize:
// - Best subject lines per condition
// - Optimal send time (morning vs evening)
// - Content length (short vs detailed)
// - Exercise count (3 vs 5 vs 7)
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **Phase 1: Privacy Foundation (Week 1-2)**
- [ ] Build anonymization pipeline
- [ ] Set up encrypted databases (patients vs anonymized)
- [ ] Test encryption/decryption flow
- [ ] Implement reident key management
- [ ] Auto-purge mechanism

### **Phase 2: Mahana Integration (Week 2-3)**
- [ ] Review ultrathink verification stages
- [ ] Build Mahana API client
- [ ] Test with sample conditions
- [ ] Validate cost per query (~$0.01)
- [ ] Document evidence grading system

### **Phase 3: Clinician Interface (Week 3-4)**
- [ ] Build web dashboard for journal submission
- [ ] Add patient lookup/search
- [ ] Implement form validation
- [ ] Test anonymization on submit
- [ ] Add preview mode

### **Phase 4: Email System (Week 4-5)**
- [ ] Evaluate Resend vs Knock
- [ ] Set up domain (ai@kiropraktisksenter.no)
- [ ] SPF/DKIM configuration
- [ ] Build email templates
- [ ] Test deliverability

### **Phase 5: Testing (Week 5-6)**
- [ ] Internal testing with fake data
- [ ] Clinician UAT (User Acceptance Testing)
- [ ] Privacy audit
- [ ] Performance testing (100 concurrent)
- [ ] Cost validation

### **Phase 6: Pilot (Week 6-8)**
- [ ] 10 real patients (with consent)
- [ ] One clinician
- [ ] Daily monitoring
- [ ] Patient feedback surveys
- [ ] Iterate based on learnings

### **Phase 7: Scale (Week 8+)**
- [ ] Gradual rollout (50 → 100 → 500)
- [ ] Monitor costs closely
- [ ] A/B test subject lines
- [ ] Add conversation handling (Phase 2 feature)

---

## 💰 REVISED COST ESTIMATE

### **100 Patients/Month**
| Service | Usage | Cost |
|---------|-------|------|
| Mahana Engine | 100 queries × $0.01 | $1 |
| OpenAI (synthesis) | 100 sessions × 2000 tokens | $20 |
| Resend | 400 emails | $5 |
| Supabase | Database + storage | $25 |
| Total | | **$51/month** |

### **1000 Patients/Month**
| Service | Usage | Cost |
|---------|-------|------|
| Mahana Engine | 1000 queries × $0.01 | $10 |
| OpenAI | 1000 sessions | $200 |
| Resend | 4000 emails | $20 |
| Supabase Pro | | $25 |
| Total | | **$255/month** |

**MUCH more affordable than initial estimate!** 🎉

---

## ❓ REMAINING QUESTIONS

1. **HelseNorge API**: Is this realistic? What's the approval process?
2. **Knock.app features**: Which specific features interest you?
3. **Ultrathink stages**: Can we review the actual 7-9 stages?
4. **SMS fallback**: Should we add SMS as a channel (Knock supports this)?
5. **Clinician adoption**: How many clinicians would use this? (affects scaling)
6. **Patient opt-in**: Automatic for all patients, or require consent?
7. **Conversation handling**: Phase 2 or essential for MVP?

---

**Ready to start building the privacy pipeline?** 🔐
