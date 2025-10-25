# Quick Instagram Integration Guide

## Option 1: Manual Embed (Easiest - 5 minutes)

### Step 1: Get Instagram Post URLs
1. Open Instagram in your browser
2. Go to each post you want to feature
3. Copy the URL (e.g., `https://www.instagram.com/p/ABC123/`)

### Step 2: Get Embed Code
1. On the Instagram post, click the three dots (...)
2. Select "Embed"
3. Copy the embed code
4. Click "Include caption" if desired

### Step 3: Add to Website
Update `/components/instagram-feed.tsx`:

```typescript
const placeholderPosts: InstagramPost[] = [
  {
    id: '1',
    imageUrl: 'PASTE_IMAGE_URL_HERE', // Right-click image → Copy Image Address
    caption: 'YOUR CAPTION HERE',
    permalink: 'https://instagram.com/p/YOUR_POST_ID/'
  },
  // Repeat for 4 posts
]
```

---

## Option 2: Instagram Basic Display API (Free, requires setup)

### Prerequisites:
- Instagram Business/Creator account
- Facebook Developer account

### Quick Steps:

1. **Go to Facebook Developers**
   https://developers.facebook.com/apps

2. **Create App**
   - Type: Consumer
   - Add Instagram Basic Display

3. **Configure Settings**
   - Valid OAuth Redirect URIs: `https://yourdomain.com/auth/instagram/callback`
   - Add your Instagram account as tester

4. **Generate Token**
   - User Token Generator
   - Copy Long-Lived Access Token (60 days)

5. **Add to `.env.local`**
   ```bash
   INSTAGRAM_TOKEN=your_token_here
   ```

6. **Create API Route**

Create `/app/api/instagram/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.INSTAGRAM_TOKEN

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${token}`
    )
    const data = await response.json()
    return NextResponse.json(data.data.slice(0, 4))
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

7. **Update Component**

Update `/components/instagram-feed.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function InstagramFeed() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/instagram')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    // ... rest of component using real posts
  )
}
```

---

## Option 3: Third-Party Service (Fastest, Paid)

### EmbedSocial ($29/month)
1. Sign up at https://embedsocial.com
2. Connect Instagram
3. Copy widget code
4. Paste into your site

### Juicer.io (Free with watermark)
1. Sign up at https://juicer.io
2. Connect Instagram
3. Get embed code
4. Free tier includes watermark

---

## Recommended Approach

**For You:** Start with **Manual Embed** (Option 1)

- ✅ Works immediately
- ✅ No API setup needed
- ✅ Free forever
- ✅ Full control
- ⚠️  Need to update manually when adding new posts

**Later:** Upgrade to API (Option 2) if you post frequently

---

## Where to Add Instagram Feed

Already created at `/components/instagram-feed.tsx`

**Add to homepage:**
```tsx
import { InstagramFeed } from '@/components/instagram-feed'

// In your page component:
<InstagramFeed />
```

**Good placement:** Between Testimonials and Footer

---

## Your Instagram Handle

Update line 95 in `/components/instagram-feed.tsx`:

```tsx
<p className="text-xl text-gray-700 dark:text-white/80">
  @YOUR_ACTUAL_INSTAGRAM_HANDLE
</p>
```

Also update the link on line 106 and 134.
