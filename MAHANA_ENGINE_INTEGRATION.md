# Mahana Engine Integration Guide
## Research-Driven Article System for Kiropraktisk Senter

### Overview
The Mahana Engine (located at `/Users/botega/kiropraktisksenter.no/mahana-engine/`) is a 4-stage research pipeline that generates deep, evidence-based articles from verified sources.

### What Was Cloned
From the Heidi Haavik research engine:
- **26 files** (560KB)
- **4 pipeline stages** (TypeScript)
- **10 AI-generated articles** (10,671 words)
- **37 discovered URLs**
- **18,877 words** of research data

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Stage 1: SERP Harvest                                   │
│  - Google search for topic keywords                      │
│  - Extract URLs and snippets                             │
│  Output: /data/output/stage1_urls.json                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Stage 2: Normalize & Clean                              │
│  - Deduplicate URLs                                      │
│  - Filter by credibility                                 │
│  - Score sources                                         │
│  Output: /data/output/stage2_normalized.json            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Stage 3: Web Scraping                                   │
│  - Fetch full website content                            │
│  - Extract main text                                     │
│  - Parse metadata                                        │
│  Output: /data/output/stage3_scraped.json               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Stage 4: Deep Academic Scraping                         │
│  - Fetch PDFs and papers                                 │
│  - Extract citations                                     │
│  - Build knowledge graph                                 │
│  Output: /data/output/stage4_deep_research.json         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Article Generation (Gemini 2.5 Flash Lite)             │
│  - Process research data                                 │
│  - Generate 10 articles (avg 8.4s each)                 │
│  - Include citations and links                           │
│  Output: /data/articles/*.md                            │
└─────────────────────────────────────────────────────────┘
```

### Integration with Kiropraktisk Senter

#### 1. Knowledge Base Enhancement

**Current System:**
```typescript
// lib/knowledge-base.json
[
  {
    "title": "Ryggplager",
    "content": "Manual content...",
    "url": "/tjenester/rygg",
    "metadata": { "symptoms": [...] }
  }
]
```

**Enhanced with Mahana Engine:**
```typescript
// lib/knowledge-base-enhanced.json
[
  {
    "title": "Ryggplager",
    "content": "Research-backed content from 15+ sources",
    "url": "/tjenester/rygg",
    "metadata": {
      "symptoms": [...],
      "sources": [
        {
          "title": "Clinical Study on Lower Back Pain",
          "url": "https://...",
          "credibility": 85,
          "citation": "Journal of Chiropractic Medicine, 2023"
        }
      ],
      "evidence_level": "high",
      "research_date": "2025-01-15"
    }
  }
]
```

#### 2. Article Pipeline Setup

**Location:** `/mahana-engine/`

**Running the Pipeline:**
```bash
cd /Users/botega/kiropraktisksenter.no/mahana-engine

# Run full pipeline for a topic
npm run pipeline -- --topic "nakke plager" --output ../son-doong-expeditions/lib/articles/

# Run individual stages
npm run stage1 -- --query "cervical pain treatment"
npm run stage2
npm run stage3
npm run stage4
npm run generate-articles
```

#### 3. Automated Content Generation

**Weekly Research Pipeline:**
```typescript
// scripts/weekly-research.ts
const topics = [
  'idrettsskader behandling',
  'korsryggplager øvelser',
  'hodepine årsaker',
  'skulder rehabilitering'
]

for (const topic of topics) {
  await runMahanaPipeline(topic)
  await generateArticles()
  await updateKnowledgeBase()
  await publishToWebsite()
}
```

### Model Performance Comparison

| Model | Avg Speed | Quality | Cost | Best For |
|-------|-----------|---------|------|----------|
| **Gemini 2.5 Flash Lite** | 8.4s | Good | Free | High volume |
| Gemini 2.0 Flash | 12.7s | Better | Low | Balanced |
| GPT-4o-mini | 21.6s | Best | Medium | Technical |

**Recommended:** Gemini 2.5 Flash Lite for production (fast + free)

### Content Quality Standards

1. **Credibility Scoring:**
   - Academic papers: 90-100
   - Medical journals: 80-90
   - Professional blogs: 60-80
   - General websites: 40-60
   - Minimum threshold: 42/100

2. **Source Requirements:**
   - Minimum 3 verified sources per article
   - At least 1 academic/clinical source
   - Citations for all medical claims
   - Last updated within 5 years

3. **Content Structure:**
   ```markdown
   # [Title]

   ## Introduction (150 words)
   - Problem statement
   - Evidence preview

   ## Research Evidence (500 words)
   - Multiple studies cited
   - Clear methodology
   - Results interpretation

   ## Clinical Application (300 words)
   - Practical recommendations
   - When to seek help

   ## Sources
   - [1] Citation...
   - [2] Citation...
   ```

### Integration Steps

#### Step 1: Install Dependencies
```bash
cd /Users/botega/kiropraktisksenter.no/mahana-engine
npm install
```

#### Step 2: Configure Topics
```typescript
// mahana-engine/config/topics.ts
export const researchTopics = [
  {
    query: 'chiropractic cervical treatment research',
    keywords: ['nakke', 'cervical', 'whiplash'],
    target: 'nakke-article.md'
  },
  {
    query: 'lower back pain chiropractic evidence',
    keywords: ['rygg', 'lumbar', 'disc'],
    target: 'rygg-article.md'
  }
]
```

#### Step 3: Run Initial Research
```bash
npm run full-pipeline
```

#### Step 4: Review Generated Articles
```bash
ls mahana-engine/data/articles/
# - how-chiropractic-adjustments-affect-brain-function.md
# - neuroscience-behind-spinal-health.md
# ... 8 more articles
```

#### Step 5: Integrate into Website
```typescript
// lib/article-importer.ts
import { readFileSync } from 'fs'
import { join } from 'path'

export function importResearchArticles() {
  const articlesPath = '/Users/botega/kiropraktisksenter.no/mahana-engine/data/articles'
  const articles = []

  // Read all .md files
  const files = readdirSync(articlesPath)

  for (const file of files) {
    const content = readFileSync(join(articlesPath, file), 'utf-8')
    const article = parseMarkdown(content)
    articles.push(article)
  }

  return articles
}
```

### Data Flow

```
Mahana Engine              →  Knowledge Base        →  Kiro KI Chat
├── Research data                ├── Enhanced content     ├── Smart responses
├── 10+ articles                 ├── Source citations     ├── Evidence-based
└── Source verification          └── Credibility scores   └── Patient guidance

        ↓                             ↓                          ↓

Website Articles          →  SEO Optimization      →  Patient Trust
├── Tjenester pages              ├── Keyword rich         ├── Verified sources
├── Blog posts                   ├── Long-form content    ├── Expert authority
└── Treatment guides             └── Internal linking     └── Higher conversion
```

### Monitoring & Quality Control

**Automated Checks:**
```typescript
// scripts/quality-check.ts
interface QualityMetrics {
  sourceCount: number          // Min 3
  credibilityScore: number    // Min 42/100
  wordCount: number           // Min 800 words
  citationCount: number       // Min 2
  lastResearchDate: Date      // Max 30 days old
}

async function validateArticle(article: Article): Promise<boolean> {
  const metrics = calculateMetrics(article)
  return metrics.sourceCount >= 3
    && metrics.credibilityScore >= 42
    && metrics.wordCount >= 800
}
```

### Maintenance Schedule

**Weekly:**
- Run pipeline for 1-2 new topics
- Update existing articles with new research
- Review and approve generated content

**Monthly:**
- Re-scrape all sources for updates
- Verify link validity
- Update credibility scores

**Quarterly:**
- Complete knowledge base refresh
- Archive outdated research
- Generate new article ideas

### Next Actions

1. ✅ Review 10 generated articles in `/mahana-engine/data/articles/`
2. Choose top 5 for immediate publishing
3. Customize with clinic branding
4. Set up automated weekly research runs
5. Monitor Kiro KI response quality

### Files & Locations

- **Pipeline Code:** `/Users/botega/kiropraktisksenter.no/mahana-engine/src/`
- **Generated Articles:** `/Users/botega/kiropraktisksenter.no/mahana-engine/data/articles/`
- **Research Data:** `/Users/botega/kiropraktisksenter.no/mahana-engine/data/output/`
- **Config:** `/Users/botega/kiropraktisksenter.no/mahana-engine/config/`
- **Docs:** `/Users/botega/kiropraktisksenter.no/mahana-engine/README.md`

### Support

For technical issues or questions about the pipeline:
- README: `/Users/botega/kiropraktisksenter.no/mahana-engine/README.md`
- HANDOFF: `/Users/botega/kiropraktisksenter.no/mahana-engine/HANDOFF.md`
