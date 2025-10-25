'use client';

import { ResearchParagraph } from './research-paragraph';

interface TreatmentContentProps {
  paragraphs: string[];
  treatmentTitle: string;
  heroImage: string;
}

export function TreatmentContent({ paragraphs, treatmentTitle, heroImage }: TreatmentContentProps) {
  return (
    <>
      {/* Intro Section with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12 space-y-6">
          {paragraphs.slice(0, 3).map((paragraph, index) => (
            <ResearchParagraph key={index} topic={treatmentTitle} hasResearch={index > 0}>
              {paragraph}
            </ResearchParagraph>
          ))}
        </div>

        <div className="rounded-3xl overflow-hidden ring-1 ring-white/10">
          <img
            src={heroImage}
            alt={treatmentTitle}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Additional Content */}
      {paragraphs.length > 3 && (
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12 space-y-6 mb-16">
          {paragraphs.slice(3, 5).map((paragraph, index) => (
            <ResearchParagraph key={index + 3} topic={treatmentTitle}>
              {paragraph}
            </ResearchParagraph>
          ))}
        </div>
      )}
    </>
  );
}
