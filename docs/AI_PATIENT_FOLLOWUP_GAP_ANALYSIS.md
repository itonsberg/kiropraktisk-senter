# AI Patient Follow-up System - Gap Analysis & Critical Planning
## What We Need to Figure Out Before Building

**Date:** 2025-10-25
**Status:** Planning Phase - Critical Decisions Needed

---

## 🚨 CRITICAL GAPS & DECISIONS NEEDED

### 1. **MAHANA ENGINE - THE BIGGEST UNKNOWN**

#### Current Status: ❓ UNDEFINED
We reference "Mahana Engine" extensively but we need to define:

**QUESTION 1.1: What IS the Mahana Engine?**
- [ ] Is it an existing product/service we're integrating with?
- [ ] Is it something WE need to build from scratch?
- [ ] Is it a third-party medical research API?
- [ ] Is it a wrapper around PubMed/research databases?

**QUESTION 1.2: If we're building it, what's the architecture?**
```typescript
// Option A: Simple wrapper around PubMed API
interface MahanaEngineV1 {
  searchPubMed(query: string): Promise<Study[]>;
  filterByEvidenceLevel(studies: Study[]): Study[];
}

// Option B: Full AI research agent
interface MahanaEngineV2 {
  conductDeepResearch(condition: string): Promise<{
    summaries: string[];
    exercises: Exercise[];
    timeline: Timeline;
    evidenceGrade: string;
  }>;
}

// Option C: Hybrid - Database + AI synthesis
interface MahanaEngineV3 {
  // Pre-indexed database of research
  database: ResearchDatabase;
  // AI to synthesize and personalize
  synthesizer: AIAgent;
}
```

**DECISION NEEDED:**
- Which approach do we take?
- Do we have access to medical research databases?
- What's the licensing situation for medical content?
- How do we ensure accuracy and liability protection?

**DEPENDENCIES:**
- API keys for research databases (PubMed, Cochrane, etc.)
- Legal review for medical advice
- Clinical validation process
- Cost per research query

---

### 2. **MEDICAL/LEGAL LIABILITY**

#### Current Status: 🔴 HIGH RISK - Not Addressed

**QUESTION 2.1: Who is legally responsible for AI recommendations?**
```
Scenario: AI recommends exercise → Patient gets worse → Lawsuit?

Options:
A) Clinic takes full responsibility (need insurance)
B) AI vendor takes responsibility (need their insurance)
C) Shared responsibility with clear disclaimers
D) Educational only - no medical advice (limits usefulness)
```

**DECISION NEEDED:**
- [ ] Consult with medical malpractice lawyer
- [ ] Review insurance coverage for AI-generated advice
- [ ] Define clear scope: "educational" vs "medical advice"
- [ ] Create disclaimer templates for emails

**Required Disclaimers:**
```typescript
const emailDisclaimer = `
⚠️ VIKTIG INFORMASJON:
Denne informasjonen er basert på forskning og ment som veiledning.
Den erstatter IKKE medisinsk rådgivning fra din behandler.
Kontakt klinikken eller lege hvis symptomene forverres.

Ved akutte symptomer: Ring 113
Ved spørsmål: Ring oss på +47 400 95 900
`;
```

**QUESTION 2.2: GDPR & Patient Data**
- [ ] Can we legally process patient data with external AI (OpenAI)?
- [ ] Do we need a Data Processing Agreement (DPA) with OpenAI?
- [ ] Is patient consent required for AI processing?
- [ ] How long can we store conversation data?
- [ ] Right to be forgotten - how to implement?

**QUESTION 2.3: Medical Device Regulation?**
- [ ] Does this qualify as a "medical device" under EU MDR?
- [ ] If yes, do we need CE marking?
- [ ] Clinical validation requirements?

---

### 3. **DATA QUALITY & CLINICIAN WORKFLOW**

#### Current Status: ⚠️ ASSUMPTIONS MADE

**QUESTION 3.1: How do clinicians actually document today?**

We assume they write structured notes, but reality might be:
```
// What we hope for:
{
  diagnosis: "Lumbar disc herniation L4-L5",
  bodyRegions: ["lower_back"],
  symptoms: ["radiating_pain", "numbness"],
  severity: 7
}

// What we might actually get:
{
  notes: "Pt c/o LBP, prob disc. Check next week."
}
```

**DECISION NEEDED:**
- [ ] Audit current documentation practices
- [ ] Create template for AI-compatible notes
- [ ] Build NLP to extract structured data from free text?
- [ ] Train clinicians on new documentation format?

**QUESTION 3.2: When does the trigger actually happen?**
```typescript
// Scenario A: Clinician clicks "Send AI Follow-up" button
//   → Manual, reliable, but easy to forget

// Scenario B: Auto-trigger 1 hour after closing journal
//   → Automatic, but might send incomplete research

// Scenario C: Scheduled review (e.g., 9 AM next day)
//   → Batch processing, more efficient
```

**Which approach?**
- [ ] Manual trigger (safer, less automation)
- [ ] Automatic trigger (more automation, less control)
- [ ] Hybrid (auto-suggest, clinician approves)

**QUESTION 3.3: Can clinicians override AI recommendations?**
```typescript
interface AIResearchApproval {
  sessionId: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  clinicianNotes?: string;
  modifications?: {
    removedExercises?: string[];
    addedNotes?: string;
  };
}
```

Should we allow clinician review before sending?
- **PRO**: Better quality control, less liability
- **CON**: Defeats purpose of automation, adds workload

---

### 4. **CONVERSATION HANDLING - THE HARD PART**

#### Current Status: 🟡 COMPLEX - Needs Deep Planning

**QUESTION 4.1: What happens when AI doesn't know the answer?**
```typescript
// Patient asks: "Should I take ibuprofen with this?"
// AI response options:

// Option A: Honest admission
"Det er et godt spørsmål, men jeg kan ikke gi medisinsk råd om medikamenter.
Ring klinikken på +47 400 95 900 for å snakke med en behandler."

// Option B: Deflect
"La meg sende spørsmålet ditt videre til en behandler som kan hjelpe deg bedre."

// Option C: Research-based (risky)
"Basert på forskning, er ibuprofen ofte brukt for [condition]. Men jeg anbefaler
at du sjekker med behandleren din først."
```

**Which approach? Need clear guidelines for:**
- [ ] Medication questions
- [ ] Worsening symptoms
- [ ] New/different symptoms
- [ ] Emergency situations
- [ ] Unrelated health issues

**QUESTION 4.2: When to escalate to human?**
```typescript
interface EscalationTriggers {
  // Sentiment-based
  urgentKeywords: string[]; // ["severe", "unbearable", "emergency"]
  negativePattern: boolean; // Multiple negative messages

  // Clinical-based
  worseningSymptoms: boolean;
  newSymptoms: string[];

  // Conversation-based
  repeatedQuestions: boolean; // Asked same thing 3+ times
  dissatisfaction: boolean; // "This isn't helping"

  // Time-based
  noImprovement: boolean; // After 2 weeks, still same issues
}
```

**DECISION NEEDED:**
- [ ] Define escalation criteria
- [ ] How to notify clinician (email, SMS, dashboard alert)?
- [ ] SLA for human response (within 24h? 48h?)
- [ ] Fallback if clinician doesn't respond?

**QUESTION 4.3: Multi-language support?**
Currently assuming Norwegian, but:
- [ ] What about English-speaking patients?
- [ ] Refugees with interpreters?
- [ ] Should AI detect language and respond accordingly?

---

### 5. **EMAIL DELIVERABILITY & ENGAGEMENT**

#### Current Status: ⚠️ OPTIMISTIC ASSUMPTIONS

**QUESTION 5.1: Will emails actually get read?**

Industry averages:
- Healthcare emails: 20-25% open rate
- Automated follow-ups: 15-20% open rate
- Email replies: 2-5% response rate

Our assumptions:
- 60% open rate ← **Optimistic!**
- 30% reply rate ← **Very optimistic!**

**REALITY CHECK NEEDED:**
- [ ] Run A/B tests with subject lines
- [ ] Test send times (morning vs. evening)
- [ ] Segment by age (young vs. elderly)
- [ ] Consider SMS as alternative channel?

**QUESTION 5.2: Email infrastructure**
```typescript
// Current plan: followup@kiropraktisksenter.no

// Issues:
// 1. SPF/DKIM setup - do we have access to DNS?
// 2. IP reputation - new domain = spam risk
// 3. Bounce handling - what if email doesn't exist?
// 4. Unsubscribe - legally required, how to handle?
```

**DECISION NEEDED:**
- [ ] Domain configuration access
- [ ] Resend domain verification
- [ ] Warm-up period for new sender
- [ ] Unsubscribe workflow (stops AI, still can book?)

**QUESTION 5.3: Reply detection challenges**
```
Email threading is HARD:

Problem 1: Patient uses different email client
  → Headers might not match
  → Conversation breaks

Problem 2: Patient forwards email to family member
  → Who replies?
  → GDPR violation if we respond?

Problem 3: Patient replies to old email
  → Which conversation to resume?
  → Old research might be outdated
```

**Mitigation strategies:**
- [ ] Use unique email addresses per conversation?
- [ ] Implement robust email parsing
- [ ] Handle edge cases explicitly
- [ ] Set expiration on conversation threads (30 days?)

---

### 6. **AI QUALITY & HALLUCINATION PREVENTION**

#### Current Status: 🔴 CRITICAL - AI Can Make Mistakes

**QUESTION 6.1: How do we prevent medical misinformation?**

AI hallucination risks:
```typescript
// Dangerous scenarios:

// 1. AI invents a study that doesn't exist
"According to a 2023 study in The Lancet..."  // ← Fake!

// 2. AI misinterprets research
"Ice is proven to reduce inflammation"
// ← Oversimplification, context matters

// 3. AI gives contraindicated advice
"Stretch your neck"
// ← Dangerous if patient has cervical instability
```

**SAFEGUARDS NEEDED:**
- [ ] Citation verification - check studies actually exist
- [ ] Contraindication database - avoid dangerous advice
- [ ] Temperature = 0.3 for medical content (less creativity)
- [ ] Regular audit of AI outputs by clinician
- [ ] User feedback mechanism ("Was this helpful?")

**QUESTION 6.2: Research currency**
```typescript
// How do we keep research up-to-date?

interface ResearchCache {
  condition: string;
  lastUpdated: Date;
  validUntil: Date; // 6 months? 1 year?
  needsRefresh: boolean;
}

// If research is >6 months old → re-query?
// How often to re-index Mahana database?
```

**DECISION NEEDED:**
- [ ] Cache duration for research
- [ ] Update frequency
- [ ] Version control for treatment recommendations

---

### 7. **COST MANAGEMENT & SCALING**

#### Current Status: 💰 ESTIMATES NEED VALIDATION

**QUESTION 7.1: Are our cost estimates realistic?**

Let's reality-check:
```typescript
// Current estimate: $665/month for 1000 patients

// Breakdown assumptions:
- OpenAI: 1000 research sessions × $0.20 = $200
  → But what if conversations have 5+ exchanges?
  → Could be 5000 API calls × $0.02 = $100 extra

- Mahana Engine: $400/month
  → Is this a real price or placeholder?
  → Per-query pricing? Flat fee? Unknown!

- Resend: 4000 emails × $0.005 = $20
  → Assumes 4 emails per patient
  → Reality might be 10+ emails = $50

// REVISED estimate: $665 → $900+/month
```

**DECISION NEEDED:**
- [ ] Get actual pricing from Mahana (or build cost)
- [ ] Test with 10 patients to measure real usage
- [ ] Set budget alerts and caps
- [ ] Define pricing tiers if we charge patients

**QUESTION 7.2: What if costs spiral out of control?**
```typescript
// Safeguards:
interface CostControls {
  maxEmailsPerPatient: 10; // Hard cap
  maxAITokensPerConversation: 5000;
  autoArchiveConversation: 30; // days
  requireApprovalAbove: 100; // NOK
}
```

---

### 8. **INTEGRATION WITH EXISTING SYSTEMS**

#### Current Status: 🟡 UNKNOWN - Need Clinic's Tech Stack

**QUESTION 8.1: What EHR/Journal system does the clinic use?**
```
Options:
A) Visma/Helse → Need API access
B) SystemX → Need integration docs
C) Custom solution → Need database access
D) Paper-based → Need digitization first
E) Excel sheets → Need migration plan
```

**CRITICAL:** We designed around Supabase, but:
- [ ] Does clinic already have patient database?
- [ ] Can we integrate or need to migrate?
- [ ] Who owns patient data?
- [ ] How to sync appointments, treatments, etc.?

**QUESTION 8.2: Authentication & Authorization**
```typescript
// Who can access what?

// Scenario 1: Clinician admin panel
// - View all patient conversations
// - Override AI recommendations
// - Manually trigger research

// Scenario 2: Patient portal (future)
// - View own conversation history
// - Update preferences
// - Request human follow-up

// Scenario 3: AI service
// - Read treatment data
// - Write research results
// - Send emails on behalf of clinic
```

**DECISION NEEDED:**
- [ ] Define user roles and permissions
- [ ] SSO integration (if clinic has existing auth)
- [ ] API security (JWT, API keys, mTLS?)

---

### 9. **PILOT & TESTING STRATEGY**

#### Current Status: 📋 NEEDS DETAILED PLAN

**QUESTION 9.1: How do we validate this works?**

**Phase 1: Internal Testing (Week 1-2)**
- [ ] Test with fake patient data
- [ ] Clinicians review AI outputs
- [ ] Identify edge cases and bugs

**Phase 2: Small Pilot (Week 3-4)**
- [ ] 5-10 real patients (with explicit consent)
- [ ] One clinician only
- [ ] Daily reviews of AI outputs
- [ ] Patient feedback interviews

**Phase 3: Controlled Rollout (Week 5-8)**
- [ ] 50 patients across 2-3 clinicians
- [ ] A/B test: AI vs. standard care
- [ ] Measure: engagement, satisfaction, outcomes
- [ ] Iterate based on feedback

**Phase 4: Full Launch (Week 9+)**
- [ ] All interested patients
- [ ] Monitor closely for first month
- [ ] Establish ongoing QA process

**QUESTION 9.2: What metrics prove this works?**
```typescript
interface SuccessMetrics {
  // Patient outcomes (most important!)
  symptomImprovement: number; // % reporting better
  satisfactionScore: number; // NPS or 1-5 rating
  complianceRate: number; // % doing exercises

  // Engagement
  emailOpenRate: number;
  replyRate: number;
  conversationLength: number; // avg messages

  // Clinical efficiency
  clinicianTimeSaved: number; // hours/week
  followUpVisitsReduced: number; // %

  // Business
  patientRetention: number; // % return patients
  revenue: number; // if we charge
  cost: number; // actual vs. estimate
}
```

---

### 10. **ETHICAL & PATIENT EXPERIENCE**

#### Current Status: 🤔 PHILOSOPHICAL QUESTIONS

**QUESTION 10.1: Should patients know it's AI?**
```
Option A: Fully transparent
"Hei! Dette er en AI-assistent basert på forskning..."
  → PRO: Honest, builds trust
  → CON: Some patients might distrust AI

Option B: Implied human
"Hei! Vi har gjennomført forskning..."
  → PRO: Feels more personal
  → CON: Deceptive? Ethical issue?

Option C: Hybrid
"Hei! Dette er en personlig rapport utarbeidet av vårt AI-system..."
  → PRO: Transparent but not scary
  → CON: Wordy
```

**DECISION NEEDED:**
- [ ] Transparency policy
- [ ] How to explain AI to elderly patients?
- [ ] Opt-out mechanism for AI-averse patients

**QUESTION 10.2: What about the human touch?**
```
Risk: Automation can feel cold

Mitigations:
- Clinician reviews and adds personal note?
- Video message from clinician embedded in email?
- Option to "Talk to my clinician" always visible?
- Handoff to human after X messages?
```

**QUESTION 10.3: Accessibility**
- [ ] Screen reader compatibility
- [ ] Large text option for visually impaired
- [ ] Simple language for low literacy patients
- [ ] Translation for non-Norwegian speakers

---

## 🎯 PRIORITY DECISION MATRIX

### MUST DECIDE BEFORE CODING (P0)
1. ✅ Mahana Engine: Build vs. Buy vs. API
2. ✅ Legal review: Liability & disclaimers
3. ✅ Clinician workflow: How they trigger system
4. ✅ EHR integration: What system exists today
5. ✅ Transparency: Tell patients it's AI?

### SHOULD DECIDE EARLY (P1)
6. ⚠️ Escalation triggers: When to alert human
7. ⚠️ Cost controls: Budget caps and monitoring
8. ⚠️ Quality assurance: Review process for AI outputs
9. ⚠️ Email infrastructure: Domain setup, DNS
10. ⚠️ Pilot strategy: Which patients first

### CAN DECIDE LATER (P2)
11. 💡 Multi-language support
12. 💡 Patient portal (view history)
13. 💡 SMS fallback
14. 💡 Video messages
15. 💡 Advanced analytics

---

## 📝 NEXT STEPS - RECOMMENDED ORDER

### **Step 1: Stakeholder Interviews (This Week)**
Talk to:
- [ ] Clinic owner/manager → Business goals, budget
- [ ] 2-3 clinicians → Current workflow, pain points
- [ ] 1-2 patients → Would they want this?
- [ ] Legal advisor → Liability review
- [ ] IT admin → Current tech stack

### **Step 2: Technical Discovery (Next Week)**
- [ ] Audit current EHR/journal system
- [ ] Map data fields available
- [ ] Test Resend email deliverability
- [ ] Prototype Mahana Engine (decide build vs. buy)
- [ ] Cost validation with real API calls

### **Step 3: MVP Definition (Week 3)**
Based on learnings, cut scope to absolute minimum:
```typescript
// MVP might be:
// - Manual trigger only (no automation)
// - Pre-written templates (no AI synthesis)
// - Resend for emails (no replies yet)
// - 10 patients max
// - Clinician reviews every email

// V2 adds:
// - AI synthesis
// - Conversation handling
// - Automation
```

### **Step 4: Build & Test (Week 4-8)**
- [ ] Build MVP
- [ ] Test internally
- [ ] Pilot with 5-10 patients
- [ ] Iterate based on feedback

### **Step 5: Go/No-Go Decision (Week 9)**
Evaluate:
- [ ] Does it actually help patients?
- [ ] Do clinicians like it?
- [ ] Is cost sustainable?
- [ ] Are we confident in AI quality?

If YES → Scale
If NO → Pivot or shut down

---

## 🚧 RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI gives dangerous advice | HIGH | MEDIUM | Clinician review, strict prompts, liability insurance |
| Patients ignore emails | MEDIUM | HIGH | A/B test, improve copy, try SMS |
| Costs exceed revenue | HIGH | MEDIUM | Budget caps, usage limits, test with small group first |
| Legal issues (GDPR, MDR) | HIGH | LOW | Legal review upfront, DPA with vendors |
| Integration fails | MEDIUM | MEDIUM | Start manual, automate later |
| Clinicians reject system | HIGH | MEDIUM | Involve early, show time savings, make optional |
| Mahana doesn't exist | HIGH | MEDIUM | Prototype with PubMed API, validate first |

---

## 💭 OPEN QUESTIONS FOR DISCUSSION

1. **Mahana Engine**: What exactly is this? Do we build it?
2. **Legal**: Can we get sign-off from lawyer before building?
3. **Budget**: What's the max monthly cost we're willing to accept?
4. **Timeline**: Is 12 weeks realistic or should we aim for MVP in 4-6 weeks?
5. **Ownership**: Who maintains this system long-term?
6. **Pricing**: Do we charge patients, or is this clinic's value-add?
7. **Clinician adoption**: Will they actually use this or see it as extra work?
8. **Patient consent**: Opt-in vs. opt-out for AI follow-ups?
9. **Data retention**: How long to keep conversation history?
10. **Failure mode**: What happens if AI system goes down?

---

**This is a complex system. Let's tackle these gaps methodically before writing production code.**

Which area should we dive into first? 🤔
