"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { services } from "@/lib/site-data"

const HERO_IMAGE = "/images/treatment-back-1.jpg" // Featured image for mega menu

const imageMap: Record<string, string> = {
  'rygg': '/images/rygg-hero.jpg',
  'nakke': '/images/nakke-hero.jpg',
  'skulder': '/images/skulder-hero.jpg',
  'kne': '/images/kne-hero.jpg',
  'myalgi': '/images/myalgi-hero.jpg',
  'ankel-fot': '/images/ankel-hero.jpg',
  'handledd': '/images/handledd-hero.jpg',
  'albue': '/images/albue-hero.jpg',
  'kjeve': '/images/kjeve-hero.jpg',
  'hodepine': '/images/hodepine-hero.jpg',
}

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-white">
        Hva vi behandler
        <ChevronDown className={`w-4 h-4 transition-transform text-white ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] max-w-[90vw] bg-black/95 backdrop-blur-xl rounded-2xl ring-1 ring-white/10 shadow-2xl p-6 z-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Featured Image */}
            <div className="hidden md:block">
              <div className="relative h-full rounded-xl overflow-hidden">
                <img
                  src={HERO_IMAGE}
                  alt="Profesjonell behandling"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white mb-1">Profesjonell Behandling</h3>
                  <p className="text-sm text-white/80">Siden 1981</p>
                </div>
              </div>
            </div>

            {/* Right: Treatment List */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {services.map((service) => {
                const imageSrc = imageMap[service.id] || '/images/hero-treatment-bw.jpg'

                return (
                  <a
                    key={service.id}
                    href={service.url}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <img
                      src={imageSrc}
                      alt={service.title}
                      className="w-12 h-12 rounded object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white mb-0.5 group-hover:text-[#f48337] transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-1">
                        {service.description}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <a
              href="#alle-behandlinger"
              className="text-sm text-[#f48337] hover:text-[#f48337]/80 font-medium"
            >
              Se alle behandlinger →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
