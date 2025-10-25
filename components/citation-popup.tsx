'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, BookOpen } from 'lucide-react';

interface CitationPopupProps {
  citation: {
    source: string;
    finding: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface SchemaData {
  title?: string;
  publisher?: string;
  year?: string;
  url?: string;
  abstract?: string;
  authors?: string[];
}

export function CitationPopup({ citation, isOpen, onClose }: CitationPopupProps) {
  const [schemaData, setSchemaData] = useState<SchemaData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && citation) {
      // Simulate fetching schema data (in real implementation, this would fetch from actual source)
      setLoading(true);

      // Parse source to extract journal and year
      const sourceMatch = citation.source.match(/(.+?)\s+(\d{4})/);
      const journal = sourceMatch ? sourceMatch[1] : citation.source;
      const year = sourceMatch ? sourceMatch[2] : '';

      // Mock schema data based on the citation source
      setTimeout(() => {
        setSchemaData({
          title: citation.finding,
          publisher: journal,
          year: year,
          url: getJournalUrl(journal),
          abstract: citation.finding,
          authors: ['Multiple authors']
        });
        setLoading(false);
      }, 300);
    }
  }, [isOpen, citation]);

  const getJournalUrl = (journal: string): string => {
    const urls: Record<string, string> = {
      'Cochrane': 'https://www.cochranelibrary.com',
      'JAMA': 'https://jamanetwork.com',
      'BMJ': 'https://www.bmj.com',
      'Lancet': 'https://www.thelancet.com',
      'BJSM': 'https://bjsm.bmj.com',
      'JOSPT': 'https://www.jospt.org',
      'Cephalalgia': 'https://journals.sagepub.com/home/cep'
    };

    for (const [key, url] of Object.entries(urls)) {
      if (journal.includes(key)) return url;
    }
    return 'https://scholar.google.com';
  };

  const getJournalIcon = (journal: string): JSX.Element => {
    // Return BookOpen icon for all journals
    return <BookOpen className="w-5 h-5 text-[#f48337]" />;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl ring-1 ring-white/10 max-w-2xl w-full max-h-[80vh] overflow-hidden pointer-events-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f48337]/20 ring-1 ring-[#f48337]/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#f48337]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Forskningskilde</h3>
                <p className="text-sm text-white/60">Vitenskapelig referanse</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f48337]"></div>
              </div>
            ) : schemaData ? (
              <div className="space-y-6">
                {/* Publisher */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <div className="w-10 h-10 rounded-lg bg-[#f48337]/20 ring-1 ring-[#f48337]/30 flex items-center justify-center flex-shrink-0">
                    {getJournalIcon(schemaData.publisher || '')}
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Publisert i</div>
                    <div className="text-lg font-semibold text-white">
                      {schemaData.publisher} {schemaData.year}
                    </div>
                  </div>
                </div>

                {/* Finding */}
                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-2">Hovedfunn</h4>
                  <p className="text-white/90 leading-relaxed">{schemaData.abstract}</p>
                </div>

                {/* Relevance for treatment */}
                <div className="p-4 rounded-2xl bg-[#f48337]/10 ring-1 ring-[#f48337]/30">
                  <h4 className="text-sm font-medium text-[#f48337] mb-2">Relevans for behandling</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Dette forskningsfunnet støtter bruken av kiropraktisk behandling som en evidensbasert tilnærming for denne tilstanden.
                  </p>
                </div>

                {/* External link */}
                {schemaData.url && (
                  <a
                    href={schemaData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 hover:ring-[#f48337]/30 hover:bg-white/10 transition-all text-white group"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:text-[#f48337] transition-colors" />
                    <span className="font-medium">Besøk {schemaData.publisher}</span>
                  </a>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-white/60">
              <div className="flex items-center gap-2">
                <img src="/logo-white-icon.svg" alt="Kiro" className="w-4 h-4" />
                <span>Kiro Forskning</span>
              </div>
              <div>Evidensbasert behandling</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
