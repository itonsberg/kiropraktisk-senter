# Instagram Integration Guide

## Option 1: Instagram Basic Display API (Free, Official)

### Prerequisites:
- Instagram Business or Creator account
- Facebook Developer account
- Website must be HTTPS (production only)

### Steps:

1. **Convert to Business/Creator Account:**
   - Open Instagram app
   - Settings → Account → Switch to Professional Account
   - Choose "Business" or "Creator"

2. **Create Facebook App:**
   - Go to https://developers.facebook.com/apps
   - Create App → Consumer → Basic Display
   - Add Instagram Basic Display product

3. **Configure Instagram Basic Display:**
   - Add Valid OAuth Redirect URI: `https://yourdomain.com/auth/instagram/callback`
   - Add Deauthorize Callback URL: `https://yourdomain.com/auth/instagram/deauthorize`
   - Add Data Deletion Request URL: `https://yourdomain.com/auth/instagram/delete`

4. **Get Access Token:**
   - User Token Generator → Add Instagram Tester
   - Generate Token
   - Copy long-lived access token (valid 60 days)

5. **Add to `.env.local`:**
```bash
INSTAGRAM_TOKEN=your_access_token_here
```

6. **Create API Route:**
Create `/app/api/instagram/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.INSTAGRAM_TOKEN

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
    )
    const data = await response.json()

    return NextResponse.json(data.data.slice(0, 4))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
```

7. **Update InstagramFeed Component:**
Replace placeholder posts with actual API fetch in `/components/instagram-feed.tsx`

---

## Option 2: EmbedSocial (Easiest, Paid)

1. Go to https://embedsocial.com/products/embedfeed/
2. Sign up (free trial available)
3. Connect Instagram account
4. Copy embed code
5. Add to your site

**Cost:** ~$29/month

---

## Option 3: Manual Embed (Quick & Free)

### For specific posts:

1. Go to Instagram post in browser
2. Click "..." → "Embed"
3. Copy embed code
4. Paste in component

### Example:
```html
<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/YOUR_POST_ID/">
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

---

## Option 4: Juicer.io (Free Tier Available)

1. Sign up at https://www.juicer.io
2. Connect Instagram
3. Get embed code
4. Free tier: 1 feed, watermark

**Cost:** Free (with watermark) or $19/month

---

## Recommended Approach

For your use case, I recommend:

1. **Development/Testing:** Use manual placeholders (already set up)
2. **Production:** Instagram Basic Display API (free, official)
3. **Alternative:** EmbedSocial if you want zero maintenance

---

## Current Implementation

The Instagram feed component is already created at:
`/components/instagram-feed.tsx`

To add it to any page:
```tsx
import { InstagramFeed } from '@/components/instagram-feed'

// In your component:
<InstagramFeed />
```

### Update Instagram handle:
Edit line 90 in `/components/instagram-feed.tsx`:
```tsx
@kiropraktisksenter  // Change to your actual handle
```

### Update placeholder posts:
Edit the `placeholderPosts` array (lines 10-34) with your actual post data.
