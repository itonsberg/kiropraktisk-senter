import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articles } from '@/lib/articles-data'
import { Card } from '@/components/ui/card'
import { Calendar, Clock, User, ExternalLink } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)

  if (!article) {
    return {
      title: 'Artikkel ikke funnet',
    }
  }

  return {
    title: `${article.title} – Kiropraktisk Senter`,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.publishDate,
      authors: [article.author],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 text-xs font-medium rounded-full bg-[#f48337]/10 text-[#f48337]"
              >
                {keyword}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishDate).toLocaleDateString('nb-NO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} lesing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />').replace(/###/g, '<h3>').replace(/##/g, '<h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- (.*?)(<br \/>|$)/g, '<li>$1</li>') }} />
            </article>
          </Card>

          {/* Sources */}
          {article.sources && article.sources.length > 0 && (
            <Card className="mt-8 p-8">
              <h3 className="text-xl font-bold mb-4">Referanser</h3>
              <div className="space-y-4">
                {article.sources.map((source, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <p className="text-sm font-medium mb-1 group-hover:text-[#f48337] transition-colors flex items-center gap-2">
                          {source.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                      </a>
                    ) : (
                      <p className="text-sm font-medium mb-1">{source.title}</p>
                    )}
                    {source.authors && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {source.authors.join(', ')}
                      </p>
                    )}
                    {source.journal && source.year && (
                      <p className="text-xs text-muted-foreground">
                        <em>{source.journal}</em> ({source.year})
                      </p>
                    )}
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[#f48337]/10 text-[#f48337]">
                      {source.type === 'research' && 'Forskningsartikkel'}
                      {source.type === 'review' && 'Review'}
                      {source.type === 'clinical' && 'Klinisk Studie'}
                      {source.type === 'textbook' && 'Lærebok'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Author Info */}
          <Card className="mt-8 p-8 bg-muted/50">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#f48337] flex items-center justify-center text-white text-2xl font-bold">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Om Forfatteren</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>{article.author}</strong> er en ledende forsker innen kiropraktisk nevrovitenskap.
                </p>
                <p className="text-sm text-muted-foreground">
                  Hennes banebrytende arbeid utforsker hvordan kiropraktiske justeringer påvirker hjernefunksjon og nervesystemet.
                </p>
              </div>
            </div>
          </Card>

          {/* Related Articles */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Relaterte Artikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles
                .filter((a) => a.slug !== article.slug)
                .slice(0, 2)
                .map((relatedArticle) => (
                  <a
                    key={relatedArticle.slug}
                    href={`/forskning/${relatedArticle.slug}`}
                    className="group"
                  >
                    <Card className="p-6 h-full hover:ring-2 hover:ring-[#f48337] transition-all">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#f48337] transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {relatedArticle.readTime} lesing
                      </div>
                    </Card>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
