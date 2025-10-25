"use client"

import { Navigation } from "@/components/navigation"
import { Heart, Award, Activity, Users, Target, Zap, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/section"
import { getCardClasses, getTextClasses, getHeadingClasses } from "@/lib/theme-config"
import { useState } from "react"

export default function OmOssPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F12] text-gray-900 dark:text-white">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-gray-50/80 dark:bg-[#0B0F12]/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
        <Navigation />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f48337]/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f48337]/20 ring-1 ring-[#f48337]/30 mb-6">
            <Heart className="w-8 h-8 text-[#f48337]" />
          </div>
          <h1 className={`${getHeadingClasses('h1')} mb-6`}>Om Kiropraktisk Senter</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Velkommen til Kiropraktisk Senter, en klinikk med røtter tilbake til 1999, nå med ny lokasjon på Eik.
            Vi er dedikert til å hjelpe deg med å oppnå bedre helse gjennom en helhetlig tilnærming til behandling og forebygging.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Card variant="light" className="p-12 mb-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Hos oss tilbyr vi <strong>kiropraktikk, massasje og andre terapier</strong>, som laserbehandling,
                sjokkbølgebehandling og pulsert elektromagnetisk terapi (PEMF, PMST). Vårt mål er å skape en balansert
                og funksjonell kropp ved å optimalisere nervesystemet, redusere smerter og forbedre bevegelsesmønstre.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Vi ønsker at alle våre pasienter skal ha <strong>et godt liv i god bevegelse</strong>.
              </p>
            </div>
          </Card>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className={`${getHeadingClasses('h2')} text-center mb-12`}>Hvorfor mange velger oss</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Grundig undersøkelse */}
              <Card variant="light" className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/30 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-[#f48337]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      Grundig undersøkelse og presis diagnostisering
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Vi tar oss tid til å forstå dine plager, med en helhetlig tilnærming for å finne den
                      underliggende årsaken til plagene dine.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Moderne behandling */}
              <Card variant="light" className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#f48337]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      Moderne behandling – skreddersydd for deg
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Vi kombinerer manuelle teknikker med banebrytende teknologi og avansert utstyr for
                      optimal behandlingseffekt.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Personlig oppfølging */}
              <Card variant="light" className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#f48337]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      Personlig oppfølging for varige resultater
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Vårt mål er ikke bare å lindre smerte, men å hjelpe deg med langsiktig bedring og bedre
                      livskvalitet gjennom individuell tilpasning og oppfølging.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Image Gallery Section - Clinic Showcase */}
          <div className="mb-16">
            <h2 className={`${getHeadingClasses('h2')} text-center mb-12`}>Vårt Moderne Senter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Large Image */}
              <div className="md:row-span-2 relative rounded-2xl overflow-hidden group">
                <img
                  src="/images/treatment-back-1.jpg"
                  alt="Kiropraktisk Senter - Behandlingsrom"
                  className="w-full h-full object-cover min-h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-bold mb-2">Moderne Fasiliteter</h3>
                  <p className="text-white/90">State-of-the-art utstyr og komfortable behandlingsrom</p>
                </div>
              </div>

              {/* Small Image 1 */}
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="/images/equipment-red-light.jpg"
                  alt="Avansert behandlingsutstyr"
                  className="w-full h-full object-cover min-h-[195px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold">Avansert Teknologi</h3>
                </div>
              </div>

              {/* Small Image 2 */}
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="/images/treatment-neck-1.jpg"
                  alt="Profesjonell behandling"
                  className="w-full h-full object-cover min-h-[195px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold">Profesjonell Behandling</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Lars Section */}
          <Card variant="light" className="p-12 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Image */}
              <div className="lg:col-span-1">
                <div className="relative rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="/images/team-senior-male-bw.jpg"
                    alt="Lars Martin Holthe"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-1">Lars Martin Holthe</h3>
                    <p className="text-white/90">Eier og Kiropraktor</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2">
                <h3 className={`${getHeadingClasses('h3')} mb-6`}>Møt vår grunnlegger</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    Lars Martin Holthe, eier og kiropraktor ved Kiropraktisk Senter, er utdannet fra Life University i Atlanta, USA.
                    Under studiet hadde han muligheten til å gå i lære hos sin mentor, <strong>John Cox</strong>, en av
                    verdens ledende Gonstead-kiropraktorer.
                  </p>
                  <p>
                    Gjennom årene har han bygget en solid faglig bakgrunn med videreutdanning innen Gonstead-systemet,
                    funksjonell nevrologi ved Carrick Institute, samt sertifisering innen nutrigenetikk, nutrigenomikk
                    og farmakogenomikk fra DNALife.
                  </p>
                  <p>
                    Lars behandler kroppen som en helhet, med et sterkt fokus på optimal funksjon av hjernen og nervesystemet.
                    Han har bred erfaring med ulike plager, men har en spesiell interesse for <strong>kjeve- og nakkesmerter</strong>,
                    samt <strong>idrettsskader</strong>. Som klinikkens spesialist på idrettsskader jobber han tett med både
                    profesjonelle og mosjonister for å sikre optimal funksjon og skadeforebygging.
                  </p>
                  <p>
                    Forebyggende behandling er en viktig del av Lars' filosofi – han tror på å styrke kroppen før smerter
                    og skader oppstår. På fritiden er han en lidenskapelig friluftsentusiast og trives spesielt godt med laksefiske.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* FAQ Section */}
          <Card variant="light" className="p-12 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Title and Description */}
              <div>
                <h2 className={`${getHeadingClasses('h2')} mb-6`}>
                  Ofte Stilte Spørsmål
                </h2>
                <p className={`text-xl text-gray-700 dark:text-gray-300 leading-relaxed`}>
                  Alt du trenger å vite om våre behandlinger, fra bookingprosess til behandlingsforløp.
                </p>
              </div>

              {/* Right Column - FAQ Accordion */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card
                    key={index}
                    variant="light"
                    className="overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className={`w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-900 dark:text-white`}
                    >
                      <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                      {openFaq === index ? (
                        <Minus className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className={`text-gray-700 dark:text-gray-300 leading-relaxed`}>{faq.answer}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Vi ser frem til å ønske deg velkommen til Kiropraktisk Senter og hjelpe deg på veien mot en
              <strong> sterkere, sunnere og mer funksjonell kropp!</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-full px-8">
                  Bestill Time
                </Button>
              </a>
              <a href="/#kontakt">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Kontakt Oss
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
