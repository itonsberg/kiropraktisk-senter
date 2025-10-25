"use client"

import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle-new'
import { MegaMenu } from '@/components/mega-menu'
import { ArticlesMegaMenu } from '@/components/articles-mega-menu'
import { siteConfig } from '@/lib/site-data'

export function Navigation() {
  return (
    <nav className="relative z-50 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
      {/* Logo */}
      <a href="/" className="flex items-center gap-3">
        <img src="/media/logos/logo.png" alt="Kiropraktisk Senter" className="h-[100px] w-auto object-contain" />
      </a>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-1">
        <MegaMenu />
        <ArticlesMegaMenu />
        <a
          href="/#tjenester"
          className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-white"
        >
          Tjenester
        </a>
        <a
          href="/#om-oss"
          className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-white"
        >
          Om Oss
        </a>
        <a
          href="/#kontakt"
          className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-white"
        >
          Kontakt
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href={`tel:${siteConfig.contact.phone}`}
          className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors flex items-center gap-2 text-white"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Ring Oss</span>
        </a>
        <Button className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-full px-6">Bestill Time</Button>
      </div>
    </nav>
  )
}
