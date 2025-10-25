'use client';

import { useState } from 'react';
import { CitationPopup } from './citation-popup';

interface Citation {
  source: string;
  finding: string;
}

interface ResearchCitationsSectionProps {
  citations: Citation[];
}

export function ResearchCitationsSection({ citations }: ResearchCitationsSectionProps) {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedCitation(null), 300);
  };

  return (
    <>
      <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Relatert forskning</h2>
        <p className="text-white/70 text-center mb-8 max-w-2xl mx-auto">
          Vår behandling er basert på nyere forskning fra anerkjente tidsskrifter og systematiske oversikter
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {citations.map((citation, index) => (
            <button
              key={index}
              onClick={() => handleCitationClick(citation)}
              className="group p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 hover:ring-[#f48337]/30 hover:bg-white/10 transition-all cursor-pointer text-left"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f48337]/20 ring-1 ring-[#f48337]/30 flex items-center justify-center">
                  <span className="text-[#f48337] font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-[#f48337] transition-colors">
                    {citation.source}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {citation.finding}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCitation && (
        <CitationPopup
          citation={selectedCitation}
          isOpen={isPopupOpen}
          onClose={closePopup}
        />
      )}
    </>
  );
}
