import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { siteConfig, treatments, services } from '@/lib/site-data';
import knowledgeBase from '@/lib/knowledge-base.json';
import { KiroKIChat } from '@/components/kiro-ki-chat';
import { Testimonials } from '@/components/ui/testimonials';
import { Navigation } from '@/components/navigation';
import { Card, CardContent } from '@/components/ui/section';
import { getTextClasses, getHeadingClasses, getCardClasses } from '@/lib/theme-config';
import { ResearchCitationsSection } from '@/components/research-citations-section';
import { TreatmentContent } from '@/components/treatment-content';

interface TreatmentData {
  id: string;
  title: string;
  url: string;
  content: string;
  metadata: {
    symptoms: string[];
    treatments: string[];
    images: string[];
    redFlags?: string[];
    evidenceGrade?: string;
    timeline?: string;
    researchCitations?: Array<{
      source: string;
      finding: string;
    }>;
  };
}

// Map treatment IDs to hero images
const HERO_IMAGES: Record<string, string> = {
  'rygg': '/images/rygg-hero.jpg',
  'nakke': '/images/nakke-hero.jpg',
  'skulder': '/images/skulder-hero.jpg',
  'kne': '/images/kne-hero.jpg',
  'myalgi': '/images/rygg-massage.jpg',
  'ankel-fot': '/images/treatment-foot-1.jpg',
  'handledd': '/images/treatment-neck-1.jpg',
  'albue': '/images/treatment-neck-2.jpg',
  'kjeve': '/images/treatment-back-3.jpg',
  'hodepine': '/images/hodepine-hero.jpg',
};

export async function generateStaticParams() {
  return knowledgeBase.map((treatment: TreatmentData) => ({
    slug: treatment.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const treatment = knowledgeBase.find((t: TreatmentData) => t.id === resolvedParams.slug);

  if (!treatment) {
    return {
      title: 'Behandling ikke funnet',
    };
  }

  return {
    title: `${treatment.title} - Kiropraktisk Senter`,
    description: treatment.content.slice(0, 160),
  };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const treatment = knowledgeBase.find((t: TreatmentData) => t.id === resolvedParams.slug);

  if (!treatment) {
    notFound();
  }

  const heroImage = HERO_IMAGES[treatment.id] || '/images/hero-treatment-bw.jpg';

  // Split content into paragraphs and filter out duplicate title
  const paragraphs = treatment.content
    .split('\n\n')
    .filter(p => p.trim().length > 0 && !p.includes('Introduction Video'))
    .filter((p, index) => {
      // Remove first paragraph if it's a duplicate of the title
      if (index === 0 && p.trim() === treatment.title.trim()) {
        return false;
      }
      // Also remove if first 2 paragraphs are identical
      if (index === 1 && paragraphs[0] && p.trim() === paragraphs[0].trim()) {
        return false;
      }
      return true;
    });

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={treatment.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center flex-1 flex flex-col justify-center">
          <a href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Tilbake til forsiden
          </a>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight">
            {treatment.title}
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 font-normal">
            Profesjonell behandling siden 1981
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#f48337] text-white hover:bg-[#f48337]/90 rounded-full px-8 py-4 text-lg shadow-lg shadow-[#f48337]/30">
                Bestill Time Nå
              </Button>
            </a>
            <a href={`tel:${siteConfig.contact.phone}`}>
              <Button size="lg" variant="outline" className="bg-white/10 ring-1 ring-white/20 border-0 text-white hover:bg-white/20 rounded-full px-8 py-4 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Ring Oss
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="relative z-10 py-24 px-6 bg-[#141414] text-white">
        <div className="max-w-6xl mx-auto">
          <TreatmentContent
            paragraphs={paragraphs}
            treatmentTitle={treatment.title}
            heroImage={heroImage}
          />

          {/* Symptoms Section */}
          {treatment.metadata.symptoms && treatment.metadata.symptoms.length > 0 && (
            <div className="mt-16 mb-16 rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 tracking-tight">Vanlige Symptomer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treatment.metadata.symptoms
                  .filter(s => s.length < 200 && !s.includes('Hva vi behandler'))
                  .slice(0, 8)
                  .map((symptom, index) => {
                    // Add image after 4th symptom (index 3)
                    if (index === 4) {
                      return (
                        <>
                          {/* Image between symptoms */}
                          <div key={`image-${index}`} className="md:col-span-2 rounded-2xl overflow-hidden ring-1 ring-white/10 my-4">
                            <img
                              src={heroImage}
                              alt={treatment.title}
                              className="w-full h-64 md:h-96 object-cover"
                            />
                          </div>
                          {/* Continue with symptom */}
                          <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                            <CheckCircle2 className="w-5 h-5 text-[#f48337] flex-shrink-0 mt-0.5" />
                            <span className="text-white/90">{symptom}</span>
                          </div>
                        </>
                      )
                    }
                    return (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                        <CheckCircle2 className="w-5 h-5 text-[#f48337] flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 font-normal">{symptom}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Treatment Methods Section */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#f48337]/20 to-[#f48337]/10 ring-1 ring-[#f48337]/30 backdrop-blur p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Våre Behandlingsmetoder</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {treatments.map((treatment) => (
                <Card key={treatment.name} variant="light">
                  <div className="text-center p-6">
                    <p className={`font-semibold text-sm mb-2 ${getTextClasses('primary')}`}>{treatment.name}</p>
                    <p className={`text-xs ${getTextClasses('tertiary')} leading-relaxed`}>{treatment.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* More Content */}
          {paragraphs.length > 5 && (
            <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-bold mb-6 tracking-tight">Behandling og Tilnærming</h2>
              <div className="space-y-6">
                {paragraphs.slice(5, 8).map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed text-white/80 font-normal">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags Warning Section */}
          {treatment.metadata.redFlags && treatment.metadata.redFlags.length > 0 && (
            <div className="rounded-3xl bg-[#1e1e1e] ring-2 ring-[#e58949]/30 backdrop-blur p-8 md:p-12 mb-16">
              <div className="flex items-start gap-4 mb-6">
                <ShieldAlert className="w-10 h-10 text-[#e58949] flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">⚠️ Varselsymptomer</h2>
                  <p className="text-lg text-white">
                    Søk akutt medisinsk hjelp hvis du opplever ett eller flere av disse symptomene:
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treatment.metadata.redFlags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[#141414] ring-1 ring-[#e58949]/20">
                    <AlertTriangle className="w-5 h-5 text-[#e58949] flex-shrink-0 mt-0.5" />
                    <span className="text-white">{flag}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/80 mt-6 text-center">
                Disse symptomene kan indikere alvorlige tilstander som krever umiddelbar legevurdering.
              </p>
            </div>
          )}

          {/* Evidence Grade Badge */}
          {treatment.metadata.evidenceGrade && (
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#f48337]/20 to-[#d6c5ab]/20 ring-1 ring-[#f48337]/30">
                <CheckCircle2 className="w-5 h-5 text-[#f48337]" />
                <span className="text-white font-medium">
                  Evidensgrad: {treatment.metadata.evidenceGrade}
                </span>
                {treatment.metadata.timeline && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-white/80 text-sm">
                      Typisk behandlingstid: {treatment.metadata.timeline}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Research Citations Section */}
          {treatment.metadata.researchCitations && treatment.metadata.researchCitations.length > 0 && (
            <ResearchCitationsSection citations={treatment.metadata.researchCitations} />
          )}

          {/* Equipment Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
              <img
                src="/images/equipment-red-light.jpg"
                alt="Moderne behandlingsutstyr"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
              <img
                src="/images/treatment-back-1.jpg"
                alt="Profesjonell behandling"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* All Treatments List */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white tracking-tight">Alle Våre Behandlinger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
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
                };
                const imageSrc = imageMap[service.id] || '/images/hero-treatment-bw.jpg';

                return (
                  <a
                    key={service.id}
                    href={service.url}
                    className={`flex items-center gap-4 p-4 ${getCardClasses('light')} hover:ring-[#f48337] hover:ring-2 group transition-all`}
                  >
                    <img
                      src={imageSrc}
                      alt={service.title}
                      className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg mb-1 ${getTextClasses('primary')}`}>{service.title}</h4>
                      <p className={`text-sm ${getTextClasses('tertiary')} font-normal`}>{service.description}</p>
                    </div>
                    <div className="text-[#f48337]">→</div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div id="kontakt" className="mt-16 rounded-3xl bg-gradient-to-br from-[#f48337] to-[#f48337]/80 p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Klar for å ta kontakt?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Vi er her for å hjelpe deg med {treatment.title.toLowerCase()}. Bestill time i dag!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors">
                <Phone className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-sm font-medium">Ring oss</div>
                  <div className="text-lg font-bold">{siteConfig.contact.phone}</div>
                </div>
              </a>

              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors">
                <Mail className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-sm font-medium">Send e-post</div>
                  <div className="text-lg font-bold break-all">{siteConfig.contact.email}</div>
                </div>
              </a>
            </div>

            <div className="mt-8">
              <a href="/">
                <Button variant="outline" className="bg-white/10 ring-1 ring-white/20 border-0 text-white hover:bg-white/20 rounded-full px-8 py-3">
                  Tilbake til forsiden
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 bg-[#141414]">
        <Testimonials />
      </section>

      <KiroKIChat />
    </>
  );
}
