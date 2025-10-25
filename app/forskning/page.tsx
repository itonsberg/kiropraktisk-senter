import type { Metadata } from 'next'
import { articles } from '@/lib/articles-data'
import { Card } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Forskning & Artikler – Kiropraktisk Senter',
  description: 'Utforsk forskningsbaserte artikler om kiropraktikk, nevrovitenskap og spinal helse. Lær hvordan kiropraktisk behandling påvirker hjernefunksjonen din.',
  keywords: ['kiropraktikk forskning', 'nevrovitenskap', 'spinal helse', 'hjernefunksjon', 'somatosensorikk'],
}

export default function ForskningPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Forskning & Artikler
            </h1>
            <p className="text-xl text-muted-foreground">
              Utforsk forskningsbaserte artikler om kiropraktikk, nevrovitenskap og hvordan behandling påvirker hjernefunksjonen. All forskning er basert på arbeidet til Dr. Heidi Haavik og andre ledende forskere.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <a
                key={article.slug}
                href={`/forskning/${article.slug}`}
                className="group"
              >
                <Card className="h-full p-6 hover:ring-2 hover:ring-[#f48337] transition-all">
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.keywords.slice(0, 2).map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-[#f48337]/10 text-[#f48337]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 group-hover:text-[#f48337] transition-colors">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.publishDate).toLocaleDateString('nb-NO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="mt-16 p-8 md:p-12 bg-gradient-to-br from-[#f48337]/10 to-[#d6c5ab]/10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Vil du vite mer om hvordan kiropraktikk kan hjelpe deg?
              </h2>
              <p className="text-muted-foreground mb-6">
                Vårt team av erfarne kiropraktorer kan hjelpe deg med alt fra ryggsmerter til forbedret hjernefunksjon.
              </p>
              <a
                href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter" target="_blank" rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-[#f48337] text-white font-medium rounded-lg hover:bg-[#f48337]/90 transition-colors"
              >
                Bestill Time
              </a>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
