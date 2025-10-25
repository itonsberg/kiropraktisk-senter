"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Clinician {
  name: string;
  role: string;
  specialty: string;
  description: string;
  imageUrl: string;
  qualifications: string[];
  experience: string;
  focus: string[];
  bookingUrl?: string;
}

const clinicians: Clinician[] = [
  {
    name: "Lars Martin Holthe",
    role: "Kiropraktor & Klinikksjef",
    specialty: "Spesialist nerve-muskel-og skjelettplager",
    description:
      "Lars Martin behandler kroppen som en helhet, med et sterkt fokus på optimal funksjon av hjernen og nervesystemet.",
    imageUrl: "/images/team/lars.jpg",
    qualifications: [
      "Autorisert Kiropraktor",
      "Gonstead systemet",
      "Carrick institute",
      "DNALife"
    ],
    experience: "7+ år",
    focus: [
      "Ryggplager",
      "Idrettsskader",
      "Kroniske smerter",
      "Nakkesmerter"
    ],
    bookingUrl: "/om-oss"
  },
  {
    name: "Anniken Nordby",
    role: "Klinikk Assistent",
    specialty: "Ansvarlig for booking og pasientmottak",
    description:
      "Anniken er klinikkens hjertevarme mottak. Hun sørger for at alle pasienter føler seg velkommen og får en smidig opplevelse fra booking til behandling.",
    imageUrl: "/images/team/anniken.jpg",
    qualifications: [
      "Resepsjon og kundeservice",
      "Timebestilling og koordinering",
      "Pasientoppfølging",
      "Administrativ støtte"
    ],
    experience: "Flere år",
    focus: [
      "Booking og timebestilling",
      "Pasientmottak",
      "Administrativ støtte",
      "Kundeservice"
    ],
    bookingUrl: "#kontakt"
  },
  {
    name: "Yurii Vasylets",
    role: "Muskelterapeut & Kinesiolog",
    specialty: "Spesialist i idrettsmassasje og triggerpunktbehandling",
    description:
      "Yurii er utdannet muskelterapeut og kinesiolog fra Ukraina med over 6 års erfaring. Han har omfattende erfaring med både profesjonelle idrettsutøvere og soldater, og har en dyp forståelse for komplekse muskelsmerter, langvarige plager og idrettsskader. Med sin bakgrunn har han utviklet ekspertise i arbeid med bindevev, holdningsmuskulatur og muskelsmerter.",
    imageUrl: "/images/team/yuri.jpg",
    qualifications: [
      "Utdannet Muskelterapeut",
      "Kinesiolog",
      "Sertifisert i Triggerpunktbehandling",
      "6+ års klinisk erfaring"
    ],
    experience: "6+ år",
    focus: [
      "Bindevevsmassasje",
      "Idrettsmassasje",
      "Triggerpunktbehandling",
      "Kinesiologisk muskeltesting"
    ],
    bookingUrl: "#kontakt"
  },
  {
    name: "Kristian Santiago Ankersen",
    role: "Muskelterapeut PT og Massør",
    specialty: "Helse og Treningsfysiolog med høy kompetanse innen idrett",
    description:
      "Kristian er utdannet Helse og Treningsfysiolog ved Høgskolen i Innlandet og utdannet muskelterapeut. Han jobber med rygg-, muskel- og leddplager, og har høy kompetanse innen idrett. Som aktiv toppidrettsutøver innen ski og rulleski har han en unik forståelse for idrettsrelaterte plager og prestasjonsoptimalisering.",
    imageUrl: "/images/team/kristian.jpg",
    qualifications: [
      "Helse og Treningsfysiolog (Høgskolen i Innlandet)",
      "Utdannet Muskelterapeut",
      "PT og Massør",
      "Aktiv toppidrettsutøver"
    ],
    experience: "Flere år",
    focus: [
      "Rygg-, muskel- og leddplager",
      "Idrettsskader",
      "Prestasjonsoptimalisering",
      "Rehabilitering"
    ],
    bookingUrl: "#kontakt"
  }
];

export function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % clinicians.length);
  const handlePrevious = () =>
    setCurrentIndex(
      (index) => (index - 1 + clinicians.length) % clinicians.length
    );

  const currentClinician = clinicians[currentIndex];

  return (
    <section className="w-full bg-[#f9f9f9] dark:bg-transparent py-16">
      <div className="max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Møt Vårt Team
        </h2>
        <p className="text-xl text-gray-600 dark:text-white/80 max-w-3xl mx-auto">
          Fire spesialister med unik kompetanse - finn den rette for dine behov
        </p>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex relative items-center gap-8">
        {/* Avatar */}
        <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-gray-200 dark:bg-neutral-800 flex-shrink-0 ring-2 ring-[#f48337]/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentClinician.imageUrl}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <img
                src={currentClinician.imageUrl}
                alt={currentClinician.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl p-8 flex-1 ring-1 ring-gray-200 dark:ring-[#f48337]/30 backdrop-blur">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentClinician.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentClinician.name}
                </h3>
                <p className="text-sm font-normal text-white dark:text-white bg-[#f48337] dark:bg-[#f48337] inline-block px-3 py-1 rounded-full mb-1">
                  {currentClinician.role}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
                  {currentClinician.specialty}
                </p>
              </div>

              <p className="text-gray-700 dark:text-white/80 text-base leading-relaxed mb-6">
                {currentClinician.description}
              </p>

              {/* Focus Areas */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-[#f48337]" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Fokusområder:</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentClinician.focus.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#f48337]/10 text-[#f48337] rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#f48337]" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Erfaring</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{currentClinician.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#f48337]" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Spesialisering</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{currentClinician.specialty.split(' ')[2]}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <a
                  href={currentClinician.bookingUrl}
                  className="flex items-center justify-center w-12 h-12 bg-[#f48337] text-white rounded-full hover:bg-[#f48337]/90 transition-colors shadow-lg"
                  aria-label={`Bestill time med ${currentClinician.name.split(' ')[0]}`}
                >
                  <Calendar className="w-5 h-5" />
                </a>
                <a
                  href={currentClinician.bookingUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#f48337]/30 ring-1 ring-[#f48337]/30 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-[#f48337] hover:text-white transition-all"
                >
                  Les mer om {currentClinician.name.split(' ')[0]}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden max-w-sm mx-auto text-center">
        {/* Avatar */}
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-3xl overflow-hidden mb-6 ring-2 ring-[#f48337]/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentClinician.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <img
                src={currentClinician.imageUrl}
                alt={currentClinician.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card content */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentClinician.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentClinician.name}
              </h3>
              <p className="text-sm font-normal text-white dark:text-white bg-[#f48337] dark:bg-[#f48337] inline-block px-3 py-1 rounded-full mb-1">
                {currentClinician.role}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4 mt-2">
                {currentClinician.specialty}
              </p>
              <p className="text-gray-700 dark:text-white/80 text-sm leading-relaxed mb-6">
                {currentClinician.description}
              </p>

              {/* Focus Areas */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#f48337]" />
                  Fokusområder
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentClinician.focus.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#f48337]/10 text-[#f48337] rounded-full text-xs font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href={currentClinician.bookingUrl}
                  className="flex items-center justify-center w-12 h-12 bg-[#f48337] text-white rounded-full hover:bg-[#f48337]/90 transition-colors shadow-lg"
                  aria-label={`Bestill time med ${currentClinician.name.split(' ')[0]}`}
                >
                  <Calendar className="w-5 h-5" />
                </a>
                <a
                  href={currentClinician.bookingUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#f48337]/30 ring-1 ring-[#f48337]/30 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-[#f48337] hover:text-white transition-all"
                >
                  Les mer om {currentClinician.name.split(' ')[0]}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-center items-center gap-6 mt-12">
        {/* Previous */}
        <button
          onClick={handlePrevious}
          aria-label="Forrige kliniker"
          className="w-12 h-12 rounded-full bg-[#f48337]/30 dark:bg-[#f48337]/30 border border-[#f48337]/30 shadow-md flex items-center justify-center hover:bg-[#f48337]/40 transition-colors cursor-pointer backdrop-blur"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {clinicians.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all cursor-pointer",
                index === currentIndex
                  ? "bg-[#f48337] w-8"
                  : "bg-[#f48337]/30 hover:bg-[#f48337]/50"
              )}
              aria-label={`Gå til kliniker ${index + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          aria-label="Neste kliniker"
          className="w-12 h-12 rounded-full bg-[#f48337]/30 dark:bg-[#f48337]/30 border border-[#f48337]/30 shadow-md flex items-center justify-center hover:bg-[#f48337]/40 transition-colors cursor-pointer backdrop-blur"
        >
          <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
      </div>
      </div>
    </section>
  );
}
