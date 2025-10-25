"use client"

import { Button } from "@/components/ui/button"
import { siteConfig, services, treatments } from "@/lib/site-data"
import { Navigation } from "@/components/navigation"
import { KiroKIChat } from "@/components/kiro-ki-chat"
import { Card, Section, SectionHeader } from "@/components/ui/section"
import { getCardClasses, getTextClasses, getHeadingClasses } from "@/lib/theme-config"
import { Activity, Award, Clock, Heart, CheckCircle2, ArrowRight, Zap } from "lucide-react"
import { useState } from "react"

// Hero image mapping for services
const HERO_IMAGES: Record<string, string> = {
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

// Treatment method icons
const treatmentIcons: Record<string, any> = {
  "Kiropraktikk": Activity,
  "Massasje": Heart,
  "Low-level Laser": Zap,
  "Shock Wave": Zap,
  "PMST": Activity,
  "PEMF": Activity,
}

export default function TjenesterPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Categories for filtering (could be expanded dynamically)
  const categories = [
    { id: "all", name: "Alle Behandlinger" },
    { id: "common", name: "Vanligste" },
    { id: "specific", name: "Spesifikke Områder" },
  ]

  // Smart filtering based on category
  const filteredServices = selectedCategory === "all"
    ? services
    : selectedCategory === "common"
    ? services.slice(0, 4)
    : services.slice(4)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F12] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Background with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-treatment-bw.jpg"
            alt="Våre tjenester"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex-1 flex flex-col justify-center">
          <div className="text-center">
            <div className="mb-6 inline-block px-4 py-2 bg-[#f48337]/20 ring-1 ring-[#f48337]/40 backdrop-blur rounded-full">
              <span className="text-sm font-medium text-white">Profesjonell behandling siden 1981</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Våre Tjenester
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
              Vi tilbyr profesjonell kiropraktikk og massasje for alle typer muskel- og skjelettplager.
              Moderne utstyr kombinert med erfarne terapeuter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-full px-8 py-4 text-lg shadow-lg shadow-[#f48337]/30">
                  Bestill Time Nå
                </Button>
              </a>
              <a href="#behandlinger">
                <Button size="lg" variant="outline" className="bg-white/10 ring-1 ring-white/20 border-0 text-white hover:bg-white/20 rounded-full px-8 py-4 text-lg">
                  Se Behandlinger
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-[#0B0F12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`${getCardClasses('light')} p-6 text-center`}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/40 mb-4">
                <Award className="w-6 h-6 text-[#f48337]" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${getTextClasses('primary')}`}>Erfarne Terapeuter</h3>
              <p className={`text-sm ${getTextClasses('tertiary')}`}>Autoriserte fagpersoner</p>
            </div>

            <div className={`${getCardClasses('light')} p-6 text-center`}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/40 mb-4">
                <Activity className="w-6 h-6 text-[#f48337]" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${getTextClasses('primary')}`}>Moderne Utstyr</h3>
              <p className={`text-sm ${getTextClasses('tertiary')}`}>Avansert teknologi</p>
            </div>

            <div className={`${getCardClasses('light')} p-6 text-center`}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/40 mb-4">
                <Clock className="w-6 h-6 text-[#f48337]" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${getTextClasses('primary')}`}>44+ År Erfaring</h3>
              <p className={`text-sm ${getTextClasses('tertiary')}`}>Siden 1981</p>
            </div>

            <div className={`${getCardClasses('light')} p-6 text-center`}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/40 mb-4">
                <Heart className="w-6 h-6 text-[#f48337]" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${getTextClasses('primary')}`}>5000+ Pasienter</h3>
              <p className={`text-sm ${getTextClasses('tertiary')}`}>Fornøyde kunder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Methods Section */}
      <section id="behandlingsmetoder" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-[#0B0F12] dark:to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${getHeadingClasses('h2')} mb-6`}>
              Våre Behandlingsmetoder
            </h2>
            <p className={`text-xl ${getTextClasses('tertiary')} max-w-3xl mx-auto leading-relaxed`}>
              Vi kombinerer tradisjonell kiropraktikk med moderne teknologi for best mulig resultat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {treatments.map((treatment, index) => {
              const Icon = treatmentIcons[treatment.name] || Activity
              return (
                <a
                  key={treatment.name}
                  href={treatment.url}
                  className={`block ${getCardClasses('light')} p-8 hover:ring-[#f48337] hover:ring-2 transition-all group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/40 flex items-center justify-center group-hover:bg-[#f48337]/30 transition-colors">
                        <Icon className="w-7 h-7 text-[#f48337]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-2 ${getTextClasses('primary')} flex items-center justify-between`}>
                        {treatment.name}
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className={`${getTextClasses('tertiary')} leading-relaxed`}>
                        {treatment.description}
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Equipment Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10">
              <img
                src="/images/equipment-red-light.jpg"
                alt="Moderne behandlingsutstyr"
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10">
              <img
                src="/images/treatment-back-1.jpg"
                alt="Profesjonell behandling"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* All Treatments Section */}
      <section id="behandlinger" className="py-24 px-6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`${getHeadingClasses('h2')} mb-6`}>
              Hva Vi Behandler
            </h2>
            <p className={`text-xl ${getTextClasses('tertiary')} max-w-3xl mx-auto leading-relaxed`}>
              Vi har spesialisert oss på behandling av et bredt spekter av plager
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#f48337] text-white shadow-lg shadow-[#f48337]/30"
                    : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => {
              const imageSrc = HERO_IMAGES[service.id] || '/images/hero-treatment-bw.jpg'

              return (
                <a
                  key={service.id}
                  href={service.url}
                  className={`block ${getCardClasses('light')} overflow-hidden hover:ring-[#f48337] hover:ring-2 group p-0 transition-all`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 rounded-full bg-[#f48337]/20 backdrop-blur ring-1 ring-white/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                        {service.title}
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-white/80">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className={`${getCardClasses('light')} p-12 max-w-3xl mx-auto`}>
              <h3 className={`${getHeadingClasses('h3')} mb-4`}>
                Usikker på hvilken behandling du trenger?
              </h3>
              <p className={`${getTextClasses('tertiary')} mb-8 leading-relaxed`}>
                Ta kontakt med oss, så hjelper vi deg med å finne den beste løsningen for dine plager
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`tel:${siteConfig.contact.phone}`}>
                  <Button size="lg" className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-full px-8 py-3">
                    Ring Oss: {siteConfig.contact.phone}
                  </Button>
                </a>
                <a href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-3">
                    Bestill Time Online
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#0B0F12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`${getHeadingClasses('h2')} mb-6`}>
                Hvorfor Velge Oss?
              </h2>
              <p className={`text-xl ${getTextClasses('tertiary')} mb-8 leading-relaxed`}>
                Med over 44 års erfaring og 5000+ fornøyde pasienter, er vi Tønsbergs ledende
                kiropraktiske senter.
              </p>

              <div className="space-y-4">
                {[
                  "Autoriserte kiropraktorer og massører",
                  "Moderne behandlingsutstyr",
                  "Skreddersydde behandlingsplaner",
                  "Sentralt beliggende i Tønsberg",
                  "Rask timebestilling online",
                  "Erfaren og vennlig personale"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#f48337] flex-shrink-0 mt-0.5" />
                    <span className={`text-lg ${getTextClasses('secondary')}`}>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a href="/">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-3">
                    Tilbake til Forsiden
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10">
                <img
                  src="/images/treatment-back-3.jpg"
                  alt="Behandling"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10 mt-8">
                <img
                  src="/images/treatment-neck-1.jpg"
                  alt="Behandling"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10 -mt-8">
                <img
                  src="/images/treatment-neck-2.jpg"
                  alt="Behandling"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10">
                <img
                  src="/images/rygg-massage.jpg"
                  alt="Behandling"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kiro KI Chat */}
      <KiroKIChat />

      {/* Footer */}
      <footer className="py-16 px-6 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className={`text-sm ${getTextClasses('tertiary')}`}>
            © {new Date().getFullYear()} {siteConfig.name} • {siteConfig.location.city}
          </p>
        </div>
      </footer>
    </div>
  )
}
