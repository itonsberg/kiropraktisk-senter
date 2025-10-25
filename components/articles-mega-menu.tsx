"use client"

import { useState } from "react"
import { ChevronDown, BookOpen, Brain, Activity } from "lucide-react"
import { articles } from "@/lib/articles-data"

const HERO_IMAGE = "/images/research-hero.jpg" // Can be replaced with research image

export function ArticlesMegaMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-white">
        Artikler
        <ChevronDown className={`w-4 h-4 transition-transform text-white ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] max-w-[90vw] bg-black/95 backdrop-blur-xl rounded-2xl ring-1 ring-white/10 shadow-2xl p-6 z-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Featured Section */}
            <div className="hidden md:block">
              <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#f48337]/20 to-[#d6c5ab]/20 p-6 flex flex-col justify-center">
                <Brain className="w-12 h-12 text-[#f48337] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Forskningsbaserte Artikler</h3>
                <p className="text-sm text-white/80">Lær om nevrovitenskap og kiropraktikk fra Dr. Heidi Haavik</p>
              </div>
            </div>

            {/* Right: Article List */}
            <div className="md:col-span-2 space-y-2 max-h-[400px] overflow-y-auto">
              {articles.map((article) => {
                const Icon = article.keywords.includes('hjernefunksjon') ? Brain :
                            article.keywords.includes('spinal') ? Activity : BookOpen

                return (
                  <a
                    key={article.slug}
                    href={`/forskning/${article.slug}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#f48337]/20 flex items-center justify-center shrink-0 group-hover:bg-[#f48337]/30 transition-colors">
                      <Icon className="w-5 h-5 text-[#f48337]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white mb-0.5 group-hover:text-[#f48337] transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/40">{article.readTime}</span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <a
              href="/forskning"
              className="text-sm text-[#f48337] hover:text-[#f48337]/80 font-medium"
            >
              Se alle forskningsartikler →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
