"use client"

import { useState } from "react"
import { ChevronDown, Activity, Heart, Zap, Radio, Waves } from "lucide-react"
import { treatments } from "@/lib/site-data"

const HERO_IMAGE = "/images/equipment-red-light.jpg" // Featured image for mega menu

// Treatment method icons
const treatmentIcons: Record<string, any> = {
  "Kiropraktikk": Activity,
  "Massasje": Heart,
  "Low-level Laser": Zap,
  "Shock Wave": Waves,
  "PMST": Radio,
  "PEMF": Radio,
}

// Treatment method images
const treatmentImages: Record<string, string> = {
  "Kiropraktikk": "/images/treatment-back-1.jpg",
  "Massasje": "/images/rygg-massage.jpg",
  "Low-level Laser": "/images/equipment-red-light.jpg",
  "Shock Wave": "/images/treatment-neck-1.jpg",
  "PMST": "/images/treatment-neck-2.jpg",
  "PEMF": "/images/treatment-back-3.jpg",
}

export function TjenesterMegaMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-4 py-2 backdrop-blur rounded-full transition-colors text-white ${
          isOpen
            ? 'bg-[#f48337] ring-1 ring-[#f48337]'
            : 'bg-black/40 ring-1 ring-white/20 hover:bg-black/50'
        }`}
      >
        Tjenester
        <ChevronDown className={`w-4 h-4 transition-transform text-white ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[850px] max-w-[90vw] z-50">
          <div className="bg-black/95 backdrop-blur-xl rounded-2xl ring-1 ring-white/10 shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Featured Section */}
            <div className="hidden md:block">
              <div className="relative h-full rounded-xl overflow-hidden">
                <img
                  src={HERO_IMAGE}
                  alt="Moderne behandlingsutstyr"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f48337]/30 backdrop-blur flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-[#f48337]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Moderne Behandlingsmetoder</h3>
                  <p className="text-sm text-white/80">6 spesialiserte tjenester for optimal helse</p>
                </div>
              </div>
            </div>

            {/* Right: Treatment Methods Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {treatments.map((treatment) => {
                const Icon = treatmentIcons[treatment.name] || Activity
                const imageSrc = treatmentImages[treatment.name] || HERO_IMAGE

                return (
                  <a
                    key={treatment.name}
                    href={treatment.url}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                      <img
                        src={imageSrc}
                        alt={treatment.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white mb-0.5 group-hover:text-[#f48337] transition-colors">
                        {treatment.name}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2">
                        {treatment.description}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Bottom Section with Features */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-[#f48337] text-lg font-bold">6</div>
                <div className="text-xs text-white/60">Behandlingsmetoder</div>
              </div>
              <div className="text-center">
                <div className="text-[#f48337] text-lg font-bold">44+</div>
                <div className="text-xs text-white/60">År erfaring</div>
              </div>
              <div className="text-center">
                <div className="text-[#f48337] text-lg font-bold">5000+</div>
                <div className="text-xs text-white/60">Pasienter</div>
              </div>
            </div>
            <div className="text-center">
              <a
                href="/tjenester"
                className="text-sm text-[#f48337] hover:text-[#f48337]/80 font-medium"
              >
                Se alle tjenester og behandlinger →
              </a>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}
