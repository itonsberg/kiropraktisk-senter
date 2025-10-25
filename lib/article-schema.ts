/**
 * Enhanced Article Schema with External Image Support
 * Use this schema for all research articles and knowledge base entries
 */

export interface ArticleImage {
  url: string // External URL (Unsplash, Pexels, etc.)
  alt: string // Alt text for accessibility
  caption?: string // Optional caption
  credit?: string // Photo credit
  position?: 'hero' | 'inline' | 'gallery' // Where to display
}

export interface ArticleSource {
  title: string
  url: string
  credibility: number // 0-100
  type?: 'academic' | 'clinical' | 'professional' | 'general'
}

export interface ArticleMetadata {
  symptoms?: string[]
  keywords?: string[]
  sources?: ArticleSource[]
  images?: ArticleImage[] // NEW: External image URLs
  evidence_level?: 'high' | 'medium' | 'standard'
  research_date?: string
  author?: string
  readTime?: number // Minutes
  language?: 'no' | 'en'
}

export interface Article {
  title: string
  content: string
  url: string
  metadata?: ArticleMetadata
}

/**
 * Example Article with External Images
 */
export const exampleArticle: Article = {
  title: "Hvordan kiropraktikk påvirker hjernen",
  content: "Research content here...",
  url: "/forskning/hjerne-kiropraktikk",
  metadata: {
    symptoms: ["hodepine", "nakkesmerter", "konsentrasjon"],
    keywords: ["hjerne", "nevrologi", "forskning"],
    evidence_level: "high",
    research_date: "2025-01-15",
    author: "Dr. Heidi Haavik",
    readTime: 5,
    language: "no",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200",
        alt: "Brain and spinal cord illustration",
        caption: "The connection between spine and brain function",
        credit: "Unsplash",
        position: "hero"
      },
      {
        url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
        alt: "Chiropractic adjustment",
        caption: "Spinal adjustment technique",
        credit: "Unsplash",
        position: "inline"
      }
    ],
    sources: [
      {
        title: "Haavik H. et al. - Brain function and chiropractic",
        url: "https://pubmed.ncbi.nlm.nih.gov/...",
        credibility: 95,
        type: "academic"
      }
    ]
  }
}

/**
 * Recommended Image Sources (Free, High Quality)
 */
export const imageSourceRecommendations = {
  unsplash: {
    url: "https://unsplash.com",
    api: "https://api.unsplash.com",
    searchTerms: {
      spine: "spine anatomy",
      brain: "brain neuroscience",
      chiropractic: "physical therapy",
      exercise: "rehabilitation exercise",
      anatomy: "human anatomy"
    }
  },
  pexels: {
    url: "https://pexels.com",
    api: "https://api.pexels.com",
    free: true
  },
  wikimedia: {
    url: "https://commons.wikimedia.org",
    medicalImages: true,
    license: "CC-BY-SA"
  }
}

/**
 * Helper: Generate Unsplash URL with parameters
 */
export function getUnsplashUrl(photoId: string, options?: {
  width?: number
  height?: number
  quality?: number
  crop?: 'faces' | 'focalpoint' | 'edges' | 'entropy'
}): string {
  const params = new URLSearchParams()
  if (options?.width) params.set('w', options.width.toString())
  if (options?.height) params.set('h', options.height.toString())
  if (options?.quality) params.set('q', options.quality.toString())
  if (options?.crop) params.set('crop', options.crop)

  return `https://images.unsplash.com/photo-${photoId}?${params.toString()}`
}
