# Quick Start Guide - AI Patient Follow-up System

Get started in **5 minutes**!

---

## ✅ Prerequisites

1. **Environment variables** are already configured in `.env.local`:
   ```bash
   OPENAI_API_KEY=vck_7KMTRIMGo5ug6eMxb0cjDTKrEDm22OyoDe0OPEuiWZ5g0LyYjZ3U0Bte
   RESEND_API_KEY=re_WxcPcSxK_PBw9ZZCbjfDDiXm4pbXZGHLn
   ```

2. **Dependencies** are installed:
   ```bash
   pnpm install  # Already done!
   ```

3. **Dev server** is running:
   ```bash
   pnpm dev  # On port 3000
   ```

---

## 🚀 Step 1: Health Check (30 seconds)

Check that the system is operational:

```bash
curl http://localhost:3000/api/patient-research | jq
```

**Expected output**:
```json
{
  "status": "operational",
  "capabilities": {
    "research": true,
    "claimsExtraction": true,
    "reportSynthesis": true,
    "emailGeneration": true,
    "emailSending": true  ← Should be true!
  },
  "configuration": {
    "resendApiKey": "configured",
    "openaiApiKey": "configured"
  }
}
```

✅ If `emailSending: true`, you're ready to go!

---

## 📧 Step 2: Send Test Email (2 minutes)

Send yourself a real patient research email:

```bash
npx tsx scripts/test-patient-email.ts your-email@example.com
```

**What this does**:
1. Researches "Korsryggsmerter" (lower back pain)
2. Searches PubMed, Cochrane, health authorities
3. Extracts 10+ verified claims
4. Generates patient-friendly report with exercises
5. Sends beautiful HTML email via Resend

**Expected output**:
```
🚀 PATIENT RESEARCH EMAIL TEST

⚡ Checking API status...
   Status: operational
   Email Sending: ✅ Enabled

================================================================================
🧪 TESTING PATIENT RESEARCH: Korsryggsmerter
================================================================================

✅ RESEARCH COMPLETE (12.3s)

📊 Report Summary:
   Evidence Grade: B
   Confidence: 85%
   Key Findings: 5
   Exercises: 3

📧 Email Status:
   Sent: ✅ Yes
   Recipient: your-email@example.com

💰 Cost: $0.0055

================================================================================

✅ TEST COMPLETE
```

**Check your inbox!** You should receive a professional email with:
- Evidence-based research findings
- Recommended exercises with safety notes
- Citations to PubMed/Cochrane articles
- Next steps and warning signs

---

## 🧪 Step 3: Test Different Conditions (1 minute)

Test other common conditions:

```bash
# Neck pain
npx tsx scripts/test-patient-email.ts your@email.com 1

# Knee pain
npx tsx scripts/test-patient-email.ts your@email.com 2
```

**Available conditions**:
- `0` = Korsryggsmerter (lower back pain)
- `1` = Nakkesmerter (neck pain)
- `2` = Knesmerter (knee pain)

---

## 🎯 Step 4: Use the API (1 minute)

Make a direct API call:

```bash
curl -X POST http://localhost:3000/api/patient-research \
  -H "Content-Type: application/json" \
  -d '{
    "condition": {
      "name": "Skuldersmerter",
      "bodyRegion": "Skulder",
      "symptoms": ["Smerter ved armhev", "Nattsmerter"]
    },
    "patientEmail": "patient@example.com",
    "patientContext": "Kontoransatt, mye dataarbeid",
    "focus": "exercises",
    "sendEmail": true
  }'
```

**Response** (simplified):
```json
{
  "success": true,
  "report": {
    "summary": "...",
    "keyFindings": [...],
    "exercises": [...],
    "confidence": 0.85,
    "evidenceGrade": "B"
  },
  "metadata": {
    "emailSent": true,
    "totalCitations": 8,
    "cost": {
      "total": 0.0055
    }
  }
}
```

---

## 📚 Step 5: Explore the Code (Optional)

### View the research module

```bash
cat lib/medical-research/README.md
```

### View test suite

```bash
cat lib/medical-research/__tests__/lower-back-pain.test.ts
```

### View integration examples

```bash
cat patient-followup-system/examples/patient-followup-integration.ts
```

---

## 🎉 You're Done!

You've successfully:
- ✅ Verified the system is operational
- ✅ Sent a test email via Resend
- ✅ Tested different medical conditions
- ✅ Made a direct API call

---

## 🚨 Common Issues

### Issue: `emailSending: false`

**Cause**: Resend API key not configured
**Fix**: Check `.env.local` has `RESEND_API_KEY=re_WxcPcSxK_PBw9ZZCbjfDDiXm4pbXZGHLn`

### Issue: Email not received

**Cause**: Domain not verified (emails sent from Resend subdomain may go to spam)
**Fix**:
1. Check spam folder
2. Verify `kiropraktisksenter.no` domain in Resend dashboard (see `config/resend-setup.md`)

### Issue: `research: false`

**Cause**: OpenAI API key not configured
**Fix**: Check `.env.local` has `OPENAI_API_KEY=vck_...`

---

## 📖 Next Steps

### Learn More
- Read `README.md` - Full project overview
- Read `docs/ARCHITECTURE.md` - System architecture
- Read `docs/API_REFERENCE.md` - API documentation

### Customize
- Modify email templates in `lib/medical-research/brain/synthesizer.ts`
- Add more test conditions in `scripts/test-patient-email.ts`
- Create integration examples for your use case

### Deploy
- Follow `STATUS.md` for production deployment checklist
- Verify domain in Resend (see `config/resend-setup.md`)
- Set up Supabase for patient data

---

**Questions?** Check the documentation in `patient-followup-system/docs/`

Last updated: 2025-10-25
