# Resend Domain Verification Guide

**Required for production email delivery**

---

## 🎯 Why Verify Your Domain?

Without domain verification:
- ✅ Emails work but sent from `@resend.dev` subdomain
- ⚠️ May go to spam
- ⚠️ Lower trust/deliverability

With domain verification:
- ✅ Emails sent from `ai@kiropraktisksenter.no`
- ✅ Better deliverability (95%+ inbox rate)
- ✅ Professional appearance
- ✅ DMARC compliance

---

## 📋 Step-by-Step Setup

### 1. Log into Resend

Go to: https://resend.com/domains

### 2. Add Your Domain

Click **"Add Domain"** and enter:
```
kiropraktisksenter.no
```

### 3. Add DNS Records

Resend will provide 3 DNS records to add. Log into your DNS provider (whoever manages kiropraktisksenter.no) and add these records:

#### **SPF Record** (Sender Policy Framework)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

#### **DKIM Record** (DomainKeys Identified Mail)
```
Type: TXT
Name: resend._domainkey
Value: [Resend will provide this - looks like "v=DKIM1; k=rsa; p=MIGfMA..."]
```

#### **DMARC Record** (Domain-based Message Authentication)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@kiropraktisksenter.no
```

**Note**: If you already have SPF/DMARC records, you'll need to merge them (see "Advanced Setup" below).

### 4. Verify in Resend

After adding DNS records:
1. Wait 5-10 minutes for DNS propagation
2. Click **"Verify"** in Resend dashboard
3. You should see ✅ green checkmarks for all records

### 5. Test Email Delivery

Send a test email:

```bash
npx tsx scripts/test-patient-email.ts your-email@example.com
```

Check the email headers - you should see:
```
From: Kiro AI <ai@kiropraktisksenter.no>
```

---

## 🔍 Verification Checklist

- [ ] SPF record added (check with `dig TXT kiropraktisksenter.no`)
- [ ] DKIM record added (check with `dig TXT resend._domainkey.kiropraktisksenter.no`)
- [ ] DMARC record added (check with `dig TXT _dmarc.kiropraktisksenter.no`)
- [ ] All records verified in Resend dashboard (green checkmarks)
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)
- [ ] Email shows `From: Kiro AI <ai@kiropraktisksenter.no>`

---

## 🛠️ Troubleshooting

### DNS Records Not Verifying

**Issue**: Added records but Resend says "Not verified"

**Fixes**:
1. Wait 10-30 minutes for DNS propagation
2. Check records with `dig`:
   ```bash
   dig TXT kiropraktisksenter.no
   dig TXT resend._domainkey.kiropraktisksenter.no
   dig TXT _dmarc.kiropraktisksenter.no
   ```
3. Remove trailing dots from DNS records if your DNS provider adds them automatically
4. Clear DNS cache: `sudo dscacheutil -flushcache` (macOS)

### Emails Going to Spam

**Issue**: Emails delivered but landing in spam folder

**Fixes**:
1. Make sure all 3 DNS records are verified (SPF + DKIM + DMARC)
2. Send to yourself first and mark as "Not Spam"
3. Avoid spam trigger words in subject line
4. Check spam score at: https://www.mail-tester.com/
5. Warm up your domain (start with small volumes, gradually increase)

### Wrong "From" Address

**Issue**: Emails still coming from `@resend.dev`

**Fixes**:
1. Verify domain is confirmed in Resend dashboard
2. Check code uses correct `from` address:
   ```typescript
   from: 'Kiro AI <ai@kiropraktisksenter.no>'  // ✅ Correct
   from: 'ai@resend.dev'  // ❌ Wrong
   ```
3. Restart dev server after verification

---

## 📊 Advanced Setup

### If You Already Have SPF Record

Merge with Resend's SPF:

**Before**:
```
v=spf1 include:_spf.google.com ~all
```

**After** (add Resend):
```
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

### If You Already Have DMARC Record

Merge policies:

**Before**:
```
v=DMARC1; p=none; rua=mailto:existing@email.com
```

**After** (add multiple reporting addresses):
```
v=DMARC1; p=quarantine; rua=mailto:existing@email.com,mailto:dmarc@kiropraktisksenter.no
```

### Custom Subdomain Setup

If you want to use a subdomain (e.g., `mail.kiropraktisksenter.no`):

1. In Resend, add `mail.kiropraktisksenter.no` instead of `kiropraktisksenter.no`
2. Add DNS records to subdomain
3. Update code:
   ```typescript
   from: 'Kiro AI <ai@mail.kiropraktisksenter.no>'
   ```

---

## 🔐 Security Best Practices

### DMARC Policy Levels

- `p=none` - Monitor only (reports but doesn't block)
- `p=quarantine` - Send suspicious emails to spam (recommended)
- `p=reject` - Block suspicious emails entirely (strictest)

**Recommendation**: Start with `p=quarantine`, monitor reports, then consider `p=reject` after 30 days.

### SPF Alignment

Make sure your SPF includes:
- `include:_spf.resend.com` (for Resend)
- Any other email services you use
- `~all` (soft fail) or `-all` (hard fail)

**Recommendation**: Use `~all` initially, then switch to `-all` after confirming everything works.

### DKIM Key Rotation

Resend handles DKIM key rotation automatically. No action needed!

---

## 📈 Monitoring

### Check Email Deliverability

Use these tools to monitor:

1. **Resend Dashboard**: https://resend.com/emails
   - Open rates
   - Bounce rates
   - Spam complaints

2. **MX Toolbox**: https://mxtoolbox.com/SuperTool.aspx
   - Check SPF: `spf:kiropraktisksenter.no`
   - Check DMARC: `dmarc:kiropraktisksenter.no`
   - Check blacklists

3. **Mail Tester**: https://www.mail-tester.com/
   - Send test email
   - Get spam score (aim for 10/10)

### DMARC Reports

Set up DMARC reporting to monitor authentication:

```
rua=mailto:dmarc@kiropraktisksenter.no
```

You'll receive daily/weekly reports showing:
- How many emails passed/failed SPF/DKIM
- Who's sending emails on your behalf
- Potential spoofing attempts

**Tools for parsing DMARC reports**:
- https://dmarc.postmarkapp.com/ (free)
- https://dmarcian.com/ (paid)

---

## ✅ Verification Complete!

Once verified, you can:
- ✅ Send emails from `ai@kiropraktisksenter.no`
- ✅ Expect 95%+ inbox delivery rate
- ✅ Build patient trust with professional branding
- ✅ Scale to thousands of emails/month

**Next steps**:
1. Test with 10 beta patients
2. Monitor deliverability for 1 week
3. Gradually scale to 100+ patients

---

## 📞 Support

**Resend issues**:
- Documentation: https://resend.com/docs
- Support: support@resend.com
- Discord: https://discord.gg/resend

**DNS provider support**:
Contact whoever manages `kiropraktisksenter.no` DNS (likely your web host or registrar)

---

Last updated: 2025-10-25
