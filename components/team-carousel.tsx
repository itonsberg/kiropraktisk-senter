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
    name: "Lars Petter Ekeland",
    role: "Kiropraktor & Klinikksjef",
    specialty: "Spesialist i idrettsskader og korsryggplager",
    description:
      "Lars Petter har over 40 års erfaring med kiropraktisk behandling og har behandlet tusenvis av pasienter siden 1981.",
    imageUrl: "/images/team-senior-male-bw.jpg",
    qualifications: [
      "Autorisert Kiropraktor",
      "Spesialist i Idrettsskader",
      "40+ års klinisk erfaring",
      "Sertifisert i Shock Wave og PEMF"
    ],
    experience: "40+ år",
    focus: [
      "Korsryggplager",
      "Idrettsskader",
      "Langvarige smerter",
      "Holdningskorrigering"
    ],
    bookingUrl: "#kontakt"
  },
  {
    name: "Øyvind Martinsen",
    role: "Kiropraktor",
    specialty: "Spesialist i nakke- og hodepineplager",
    description:
      "Øyvind er ekspert på nakke- og hodepinerelaterte plager med over 15 års erfaring.",
    imageUrl: "/images/team-male-glasses-bw.jpg",
    qualifications: [
      "Autorisert Kiropraktor",
      "Spesialist i Nakkeplager",
      "15+ års klinisk erfaring",
      "Sertifisert i Low-level Laser"
    ],
    experience: "15+ år",
    focus: [
      "Nakkesmerter",
      "Hodepine & Migrene",
      "Whiplash-skader",
      "Ansiktssmerter (TMJ)"
    ],
    bookingUrl: "#kontakt"
  },
  {
    name: "Ane Kristiansen",
    role: "Massør & Manuellterapeut",
    specialty: "Spesialist i muskelterapi og myalgi",
    description:
      "Ane har omfattende kompetanse innen massasje, triggerpunktbehandling og manuellterapi.",
    imageUrl: "/images/team-female-portrait.jpg",
    qualifications: [
      "Autorisert Massør",
      "Sertifisert Manuellterapeut",
      "Triggerpunkt-spesialist",
      "Utdannet i Myofascial Release"
    ],
    experience: "10+ år",
    focus: [
      "Myalgi & Fibromyalgi",
      "Triggerpunktbehandling",
      "Spenningshodepine",
      "Rehabilitering"
    ],
    bookingUrl: "#kontakt"
  },
  {
    name: "Martin Johansen",
    role: "Kiropraktor",
    specialty: "Spesialist i ekstremitetsskader",
    description:
      "Martin fokuserer på skader i armer, ben, skuldre og hofter som tidligere toppidrettsutøver.",
    imageUrl: "/images/team-young-male.jpg",
    qualifications: [
      "Autorisert Kiropraktor",
      "Spesialist i Ekstremiteter",
      "Tidligere Toppidrettsutøver",
      "Sertifisert i PMST og Shock Wave"
    ],
    experience: "8+ år",
    focus: [
      "Skulderproblemer",
      "Kne- og ankelskader",
      "Albue- og håndleddplager",
      "Idrettsrehabilitering"
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
