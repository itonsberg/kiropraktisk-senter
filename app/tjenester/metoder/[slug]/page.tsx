import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ArrowLeft, CheckCircle2, Heart, Activity, Zap, Brain } from 'lucide-react';
import { siteConfig, treatments } from '@/lib/site-data';
import { treatmentMethods, getTreatmentMethod, getAllTreatmentSlugs } from '@/lib/treatment-methods-data';
import { KiroKIChat } from '@/components/kiro-ki-chat';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/section';
import { getTextClasses, getHeadingClasses, getCardClasses } from '@/lib/theme-config';

export async function generateStaticParams() {
  return getAllTreatmentSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const method = getTreatmentMethod(resolvedParams.slug);

  if (!method) {
    return {
      title: 'Behandlingsmetode ikke funnet',
    };
  }

  return {
    title: `${method.title} - ${method.subtitle} | Kiropraktisk Senter`,
    description: method.meta,
  };
}

export default async function TreatmentMethodPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const method = getTreatmentMethod(resolvedParams.slug);

  if (!method) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={method.hero.image}
            alt={method.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center">
          <a href="/tjenester" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Tilbake til tjenester
          </a>

          <div className="mb-6 inline-block px-4 py-2 bg-[#f48337]/20 ring-1 ring-[#f48337]/40 backdrop-blur rounded-full mx-auto">
            <span className="text-sm font-medium text-white">{method.hero.badge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
            {method.title}
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 font-light mb-8">
            {method.subtitle}
          </p>

          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            {method.meta}
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
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto">
          {/* Intro Section */}
          <div className="mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              {method.sections.intro.title}
            </h2>
            <div className="space-y-6">
              {method.sections.intro.content.map((paragraph, index) => (
                <p key={index} className="text-xl leading-relaxed text-white/90 text-center max-w-4xl mx-auto">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* What Is It Section */}
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{method.sections.whatIsIt.title}</h2>
            <div className="space-y-6 mb-8">
              {method.sections.whatIsIt.content.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed text-white/90">
                  {paragraph}
                </p>
              ))}
            </div>

            {method.sections.whatIsIt.benefits && method.sections.whatIsIt.benefits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {method.sections.whatIsIt.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                    <CheckCircle2 className="w-5 h-5 text-[#f48337] flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How It Works Section */}
          <div className="rounded-3xl bg-gradient-to-br from-[#f48337]/10 to-[#d6c5ab]/10 ring-1 ring-[#f48337]/20 backdrop-blur p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{method.sections.howItWorks.title}</h2>
            <div className="space-y-6 mb-8">
              {method.sections.howItWorks.content.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed text-white/90">
                  {paragraph}
                </p>
              ))}
            </div>

            {method.sections.howItWorks.steps && method.sections.howItWorks.steps.length > 0 && (
              <div className="space-y-4 mt-8">
                {method.sections.howItWorks.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/10">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f48337] text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white/90 pt-1">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{method.sections.benefits.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {method.sections.benefits.items.map((benefit, index) => (
                <Card key={index} variant="light" className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-[#f48337]/20 ring-1 ring-[#f48337]/40 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-7 h-7 text-[#f48337]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-white/80 leading-relaxed">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Conditions Section */}
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{method.sections.conditions.title}</h2>
            <div className="space-y-8">
              {method.sections.conditions.categories.map((category, catIndex) => (
                <div key={catIndex}>
                  {method.sections.conditions.categories.length > 1 && (
                    <h3 className="text-2xl font-semibold mb-4 text-[#f48337]">{category.name}</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                        <CheckCircle2 className="w-5 h-5 text-[#f48337] flex-shrink-0 mt-0.5" />
                        <span className="text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="rounded-3xl bg-gradient-to-br from-[#f48337]/20 to-[#f48337]/10 ring-1 ring-[#f48337]/30 backdrop-blur p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{method.sections.whyChoose.title}</h2>
            <div className="space-y-6 mb-8">
              {method.sections.whyChoose.content.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed text-white/90">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              {method.sections.whyChoose.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#f48337] flex-shrink-0 mt-0.5" />
                  <span className="text-white/90 font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* All Treatment Methods Grid */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Våre Andre Behandlingsmetoder</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {treatments.filter(t => t.url !== `/tjenester/metoder/${method.slug}`).map((treatment) => (
                <a
                  key={treatment.name}
                  href={treatment.url}
                  className="block p-6 rounded-xl bg-white/5 ring-1 ring-white/10 hover:ring-[#f48337] hover:ring-2 transition-all text-center"
                >
                  <p className="font-semibold text-sm mb-2 text-white">{treatment.name}</p>
                  <p className="text-xs text-white/60 leading-relaxed">{treatment.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#f48337] to-[#f48337]/80 p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Klar for å ta kontakt?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Vi er her for å hjelpe deg med {method.title.toLowerCase()}. Bestill time i dag!
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

            <div className="mt-8 flex gap-4 justify-center">
              <a href="/tjenester">
                <Button variant="outline" className="bg-white/10 ring-1 ring-white/20 border-0 text-white hover:bg-white/20 rounded-full px-8 py-3">
                  Se Alle Tjenester
                </Button>
              </a>
              <a href="/">
                <Button variant="outline" className="bg-white/10 ring-1 ring-white/20 border-0 text-white hover:bg-white/20 rounded-full px-8 py-3">
                  Tilbake til forsiden
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <KiroKIChat />
    </>
  );
}
