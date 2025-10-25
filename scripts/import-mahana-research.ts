import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

interface Article {
  title: string
  content: string
  url: string
  metadata?: {
    symptoms?: string[]
    sources?: Array<{
      title: string
      url: string
      credibility: number
    }>
    evidence_level?: string
    research_date?: string
  }
}

// Parse markdown article
function parseMarkdownArticle(filepath: string): Article | null {
  try {
    const content = readFileSync(filepath, 'utf-8')

    // Extract title (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : 'Untitled'

    // Remove markdown formatting for clean content
    const cleanContent = content
      .replace(/^#+\s+/gm, '') // Remove headings
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
      .trim()

    // Extract sources/citations
    const sources: any[] = []
    const sourceMatches = content.matchAll(/\[(\d+)\]\s*(.+?)\n/g)
    for (const match of sourceMatches) {
      sources.push({
        title: match[2],
        url: '',
        credibility: 80 // Default high credibility for research articles
      })
    }

    return {
      title,
      content: cleanContent.slice(0, 3000), // Limit for knowledge base
      url: `/forskning/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      metadata: {
        symptoms: extractSymptoms(cleanContent),
        sources: sources.length > 0 ? sources : undefined,
        evidence_level: 'high',
        research_date: new Date().toISOString().split('T')[0]
      }
    }
  } catch (error) {
    console.error(`Error parsing ${filepath}:`, error)
    return null
  }
}

// Extract symptoms/keywords from content
function extractSymptoms(content: string): string[] {
  const keywords = [
    'back pain', 'neck pain', 'headache', 'shoulder pain',
    'knee pain', 'ankle pain', 'wrist pain', 'elbow pain',
    'muscle tension', 'stiffness', 'inflammation',
    'ryggsmerte', 'nakkesmerter', 'hodepine', 'skuldersmerter',
    'knesmerter', 'muskelspenning', 'stivhet'
  ]

  const found = keywords.filter(keyword =>
    content.toLowerCase().includes(keyword.toLowerCase())
  )

  return [...new Set(found)] // Remove duplicates
}

async function main() {
  const mahanaPath = '/Users/botega/kiropraktisksenter.no/mahana-engine/people/heidi-haavik/articles'
  const knowledgeBasePath = join(process.cwd(), 'lib/knowledge-base.json')

  console.log('🔍 Importing Mahana Engine research...')

  // Load existing knowledge base
  const existingKB = JSON.parse(readFileSync(knowledgeBasePath, 'utf-8'))
  console.log(`📚 Current knowledge base: ${existingKB.length} entries`)

  // Import articles
  const files = readdirSync(mahanaPath).filter(f => f.endsWith('.md'))
  console.log(`📄 Found ${files.length} research articles`)

  const newArticles: Article[] = []
  for (const file of files) {
    const article = parseMarkdownArticle(join(mahanaPath, file))
    if (article) {
      newArticles.push(article)
      console.log(`  ✓ ${article.title}`)
    }
  }

  // Merge with existing knowledge base (avoid duplicates)
  const existingTitles = new Set(existingKB.map((e: any) => e.title))
  const filtered = newArticles.filter(a => !existingTitles.has(a.title))

  const enhanced = [...existingKB, ...filtered]

  // Save enhanced knowledge base
  writeFileSync(
    knowledgeBasePath,
    JSON.stringify(enhanced, null, 2),
    'utf-8'
  )

  console.log(`\n✅ Enhanced knowledge base saved!`)
  console.log(`   Total entries: ${enhanced.length}`)
  console.log(`   New research articles: ${filtered.length}`)
  console.log(`   Original entries: ${existingKB.length}`)
}

main().catch(console.error)
