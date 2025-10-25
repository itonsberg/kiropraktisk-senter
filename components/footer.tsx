"use client"

import { Heart, Button } from "lucide-react"
import { siteConfig, stats } from "@/lib/site-data"
import { Card, SectionHeader } from "@/components/ui/section"
import { Mapbox3D } from "@/components/mapbox-3d"
import { getTextClasses } from "@/lib/theme-config"

export function Footer() {
  return (
    <footer className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Map Section */}
        <div className="mb-12">
          <SectionHeader
            title="Finn Oss"
            description="Sentralt i Tønsberg på Eikveien 33"
          />
          <Mapbox3D />
        </div>

        <Card variant="light" className="p-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-[#f48337]" />
                <span className={`text-xl font-semibold ${getTextClasses('primary')}`}>{siteConfig.name}</span>
              </div>
              <p className={`${getTextClasses('tertiary')} leading-relaxed`}>
                Profesjonell kiropraktikk og massasje i Tønsberg siden {stats.since}. Vi er dedikerte til din helse og velvære.
              </p>
            </div>

            {/* Tjenester Links */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${getTextClasses('primary')}`}>TJENESTER</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/behandlinger/rygg" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Ryggsmerter
                  </a>
                </li>
                <li>
                  <a href="/behandlinger/nakke" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Nakkesmerter
                  </a>
                </li>
                <li>
                  <a href="/behandlinger/hodepine" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Hodepine
                  </a>
                </li>
                <li>
                  <a href="/#tjenester" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Alle tjenester
                  </a>
                </li>
              </ul>
            </div>

            {/* Forskning Links */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${getTextClasses('primary')}`}>FORSKNING</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/forskning" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Alle artikler
                  </a>
                </li>
                <li>
                  <a href="/forskning/hvordan-kiropraktikk-pavirker-hjernefunksjonen" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Hjernefunksjon
                  </a>
                </li>
                <li>
                  <a href="/forskning/nevrovitenskapen-bak-spinal-helse" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Spinal Helse
                  </a>
                </li>
                <li>
                  <a href="/#om-oss" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Om Oss
                  </a>
                </li>
              </ul>
            </div>

            {/* Kontakt Links */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${getTextClasses('primary')}`}>KONTAKT</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/#kontakt" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Kontakt Oss
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.contact.phone}`} className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    Send E-post
                  </a>
                </li>
                <li>
                  <a href="/#faq" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-footer */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-8">
            <p className={`text-sm text-center ${getTextClasses('tertiary')}`}>© {new Date().getFullYear()} {siteConfig.name} • {siteConfig.location.city}</p>
          </div>
        </Card>
      </div>
    </footer>
  )
}
