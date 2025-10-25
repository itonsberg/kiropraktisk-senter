"use client"

import { Heart, Phone, Clock, ShieldCheck, Activity, Award, Plus, Minus, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { siteConfig, services, treatments, stats } from "@/lib/site-data"
import { KiroKIChat } from "@/components/kiro-ki-chat"
import { Navigation } from "@/components/navigation"
import { Mapbox3D } from "@/components/mapbox-3d"
import { BodyDiagram } from "@/components/body-diagram"
import { Testimonials } from "@/components/ui/testimonials"
import { TeamCarousel } from "@/components/team-carousel"
import { Section, SectionHeader, Card, CardContent, CardTitle, CardDescription, IconWrapper } from "@/components/ui/section"
import { getCardClasses, getTextClasses, getHeadingClasses } from "@/lib/theme-config"
import { ArticlesPreview } from "@/components/articles-preview"

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showAllServices, setShowAllServices] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "Hva er kiropraktikk?",
      answer:
        "Kiropraktikk er en manuell behandlingsform som fokuserer på å diagnostisere og behandle smerter og funksjonsforstyrrelser i nerve-, muskel- og skjelettsystemet. Vi bruker spesifikke teknikker for å gjenopprette normal funksjon.",
    },
    {
      question: "Hva er inkludert i behandlingen?",
      answer:
        "Behandlingen inkluderer en grundig konsultasjon, undersøkelse, diagnose og skreddersydd behandlingsplan. Vi bruker avansert utstyr som Low-level Laser, Shock Wave, PMST og PEMF ved behov.",
    },
    {
      question: "Er kiropraktikk trygt?",
      answer:
        "Ja, kiropraktikk er svært trygt når det utføres av autoriserte kiropraktorer. Vi har behandlet over 5000 pasienter siden 1981 med høy suksessrate og minimal risiko.",
    },
    {
      question: "Hvordan bestiller jeg time?",
      answer:
        "Du kan bestille time på nett via vår bookingløsning, ringe oss på +47 400 95 900, eller sende e-post til post@kiropraktisksenter.no. Vi svarer raskt og finner en tid som passer deg.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F12] text-gray-900 dark:text-white transition-colors">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/media/videos/video-1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        </div>

        {/* Navigation */}
        <div className="relative z-50">
          <Navigation />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-140px)] px-6 text-center">
          {/* Badge */}
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <span className="text-sm font-medium text-white">Siden {stats.since} • {stats.patients} Pasienter</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 text-balance text-white">Et liv i bevegelse.</h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Behandler nerve-muskel-og skjelettplager med moderne utstyr og erfarne terapeuter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-full px-8 py-4 text-lg shadow-lg shadow-[#f48337]/30">
                Bestill Time Nå
              </Button>
            </a>
            <a href="#behandlinger">
              <Button
                size="lg"
                variant="outline"
                className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8 py-4 text-lg"
              >
                Se Våre Tjenester
              </Button>
            </a>
          </div>

          {/* Footer Note */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Din helse er vår prioritet</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#0B0F12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Optimal funksjon */}
            <div className="rounded-2xl bg-[#f9f9f9] dark:bg-black/20 ring-1 ring-gray-200 dark:ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-[#d6c5ab]/30 ring-1 ring-gray-200 dark:ring-[#d6c5ab]/40 mb-6">
                <Award className="w-6 h-6 text-[#d6c5ab]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Optimal funksjon</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Ikke bare fravær av smerte, men bedre samspill mellom hjerne og kropp</p>
            </div>

            {/* Vitenskapsbasert */}
            <div className="rounded-2xl bg-[#f9f9f9] dark:bg-black/20 ring-1 ring-gray-200 dark:ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-[#d6c5ab]/30 ring-1 ring-gray-200 dark:ring-[#d6c5ab]/40 mb-6">
                <Activity className="w-6 h-6 text-[#d6c5ab]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vitenskapsbasert</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Moderne forskning viser målbare effekter på hjernens aktivitet</p>
            </div>

            {/* Helhetlig tilnærming */}
            <div className="rounded-2xl bg-[#f9f9f9] dark:bg-black/20 ring-1 ring-gray-200 dark:ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-[#d6c5ab]/30 ring-1 ring-gray-200 dark:ring-[#d6c5ab]/40 mb-6">
                <Clock className="w-6 h-6 text-[#d6c5ab]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Helhetlig tilnærming</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Vi ser kroppen som et system der alt henger sammen</p>
            </div>

            {/* Skreddersydd behandling */}
            <div className="rounded-2xl bg-[#f9f9f9] dark:bg-black/20 ring-1 ring-gray-200 dark:ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-[#d6c5ab]/30 ring-1 ring-gray-200 dark:ring-[#d6c5ab]/40 mb-6">
                <Heart className="w-6 h-6 text-[#d6c5ab]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Skreddersydd behandling</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Presis justering kombinert med råd om livsstil og øvelser</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#f48337] to-[#f48337]/80 p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-5xl md:text-6xl font-bold mb-2">{stats.experience}</div>
                <p className="text-white/90 font-medium">Grunnlagt</p>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-bold mb-2">{stats.patients}</div>
                <p className="text-white/90 font-medium">Fornøyde Pasienter</p>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-bold mb-2">100%</div>
                <p className="text-white/90 font-medium">Autorisert Personell</p>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-bold mb-2">6</div>
                <p className="text-white/90 font-medium">Behandlingsmetoder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 bg-gradient-to-b from-black via-gray-900 to-black">
        <TeamCarousel />
      </section>

      {/* Body Diagram Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <BodyDiagram />
        </div>
      </section>

      {/* Services Section */}
      <Section id="behandlinger">
        <div className={getCardClasses('glass')} style={{ padding: '3rem' }}>
          <SectionHeader
            title="Hva vi behandler"
            description="Vi behandler et bredt spekter av muskel- og skjelettplager med skreddersydde løsninger."
          />

          {/* Services Grid */}
          <div id="alle-behandlinger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 [&>*:last-child:nth-child(3n+1)]:lg:col-start-2">
            {(showAllServices ? services : services.slice(0, 6)).map((service, index) => {
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
              const imageSrc = imageMap[service.id] || '/images/hero-treatment-bw.jpg'

              return (
                <a key={service.id} href={service.url} className={`block ${getCardClasses('light')} overflow-hidden hover:ring-[#f48337] hover:ring-2 group p-0`}>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute top-4 left-4 text-3xl font-bold text-white/40">{String(index + 1).padStart(2, '0')}.</div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-semibold text-white mb-1">{service.title}</h3>
                      <p className="text-sm text-white/80">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

            {/* See All/Less Button */}
            <div className="text-center">
              <Button
                onClick={() => setShowAllServices(!showAllServices)}
                variant="outline"
                className="bg-[#fff5ed] border-0 text-[#f48337] hover:bg-[#ffe8d6] rounded-full px-10 py-4 font-semibold"
              >
                {showAllServices ? (
                  <>
                    <Minus className="w-4 h-4 mr-2" />
                    Se Mindre
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Se Alle {services.length} Behandlinger
                  </>
                )}
              </Button>
            </div>

          {/* Treatments */}
          <div id="tjenester" className="mb-12 mt-16">
            <h3 className={`${getHeadingClasses('h3')} text-center mb-8 mt-8`}>Våre Behandlingsmetoder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatments.map((treatment) => (
                <a key={treatment.name} href={treatment.url} className="block">
                  <Card variant="light" className="h-full hover:ring-[#f48337] hover:ring-2 transition-all">
                    <div className="p-6">
                      <p className={`font-semibold text-lg mb-2 ${getTextClasses('primary')}`}>{treatment.name}</p>
                      <p className={`text-sm ${getTextClasses('tertiary')} leading-relaxed`}>{treatment.description}</p>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-full px-12 py-4 text-lg font-semibold shadow-lg shadow-[#f48337]/30"
              >
                Bestill Time
              </Button>
            </a>
          </div>
        </div>
      </Section>

      {/* Articles Preview */}
      <ArticlesPreview />

      {/* Contact Section */}
      <Section id="kontakt">
        <Card variant="light" className="p-12">
          <SectionHeader title="Ta Kontakt" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Contact Form */}
            <div className="rounded-2xl bg-white dark:bg-[#111111] p-8 shadow-2xl ring-1 ring-gray-200 dark:ring-[#f48337]/30">
              <h3 className={`text-2xl font-bold mb-6 ${getTextClasses('primary')}`}>Send en henvendelse</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${getTextClasses('primary')}`}>
                    Navn
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#f48337]/30 bg-white dark:bg-black/30 backdrop-blur ${getTextClasses('primary')} placeholder:text-gray-400 focus:ring-2 focus:ring-[#f48337] focus:border-transparent`}
                    placeholder="Ditt fulle navn"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${getTextClasses('primary')}`}>
                    E-post
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#f48337]/30 bg-white dark:bg-black/30 backdrop-blur ${getTextClasses('primary')} placeholder:text-gray-400 focus:ring-2 focus:ring-[#f48337] focus:border-transparent`}
                    placeholder="din.epost@eksempel.no"
                  />
                </div>
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${getTextClasses('primary')}`}>
                    Melding
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#f48337]/30 bg-white dark:bg-black/30 backdrop-blur ${getTextClasses('primary')} placeholder:text-gray-400 focus:ring-2 focus:ring-[#f48337] focus:border-transparent resize-none`}
                    placeholder="Fortell oss om dine plager eller spørsmål..."
                  />
                </div>
                <Button className="w-full bg-[#f48337] hover:bg-[#f48337]/90 text-white rounded-lg py-3 font-normal text-base transition-all">
                  Send Melding
                </Button>
              </form>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-8">
              <div>
                <p className={`text-xl ${getTextClasses('tertiary')} leading-relaxed mb-8`}>
                  Vi svarer på alle henvendelser innen én virkedag. Du kan også ringe eller sende e-post direkte.
                </p>

                {/* Contact Cards */}
                <div className="space-y-4">
                  <Card variant="light" className="p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <Phone className="w-6 h-6 text-[#f48337]" />
                      <div>
                        <h4 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Telefon</h4>
                        <a href={`tel:${siteConfig.contact.phone}`} className="text-[#f48337] hover:underline">
                          {siteConfig.contact.phone}
                        </a>
                      </div>
                    </div>
                  </Card>

                  <Card variant="light" className="p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <Mail className="w-6 h-6 text-[#f48337]" />
                      <div>
                        <h4 className={`text-lg font-semibold ${getTextClasses('primary')}`}>E-post</h4>
                        <a href={`mailto:${siteConfig.contact.email}`} className="text-[#f48337] hover:underline">
                          {siteConfig.contact.email}
                        </a>
                      </div>
                    </div>
                  </Card>

                  <Card variant="light" className="p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <Heart className="w-6 h-6 text-[#f48337]" />
                      <div>
                        <h4 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Adresse</h4>
                        <p className={getTextClasses('secondary')}>
                          {siteConfig.location.address}<br />
                          {siteConfig.location.postalCode} {siteConfig.location.city}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Kiro KI Chat */}
      <KiroKIChat />

      {/* Footer */}
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
                {["Kiropraktikk", "Massasje", "Ryggsmerter", "Hodepine"].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Om Oss Links */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${getTextClasses('primary')}`}>OM OSS</h3>
              <ul className="space-y-3">
                {["Vårt Team", "Våre Verdier", "Behandlingsmetoder", "Beliggenhet"].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontakt Links */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${getTextClasses('primary')}`}>KONTAKT</h3>
              <ul className="space-y-3">
                {["Bestill Time", "Kontakt Oss", "FAQ", "Åpningstider"].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${getTextClasses('tertiary')} hover:text-[#f48337] transition-colors text-sm leading-relaxed`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-12 mb-12">
            <div className="max-w-md">
              <h3 className={`text-lg font-semibold mb-4 ${getTextClasses('primary')}`}>Motta helsetips og tilbud</h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Din e-postadresse"
                  className={`flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 ${getTextClasses('primary')} placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#f48337] focus:outline-none`}
                />
                <Button className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-lg px-6 h-[50px]">Abonner</Button>
              </div>
            </div>
          </div>

          {/* Sub-footer */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-8">
            <p className={`text-sm text-center ${getTextClasses('tertiary')}`}>© {new Date().getFullYear()} {siteConfig.name} • {siteConfig.location.city}</p>
          </div>
        </Card>
        </div>
      </footer>
    </div>
  )
}
