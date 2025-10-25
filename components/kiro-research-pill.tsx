'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface KiroResearchPillProps {
  text: string;
  topic: string;
  onResearch?: (query: string) => void;
}

export function KiroResearchPill({ text, topic, onResearch }: KiroResearchPillProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const query = `Forklar mer detaljert om ${topic}: ${text.slice(0, 200)}`;

    // Open Kiro KI Chat with the query
    const event = new CustomEvent('kiro-ki-open', {
      detail: { query }
    });
    window.dispatchEvent(event);

    if (onResearch) {
      onResearch(query);
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#f48337]/20 to-[#d6c5ab]/20 ring-1 ring-[#f48337]/30 hover:from-[#f48337]/30 hover:to-[#d6c5ab]/30 hover:ring-[#f48337]/50 transition-all duration-200 group cursor-pointer"
      aria-label="Spør Kiro KI for mer informasjon"
    >
      <span className="text-[10px] font-medium text-white/80 group-hover:text-white tracking-wide">
        Kiro Ki Forskning
      </span>
      <img
        src="/media/logos/logo-white-icon.svg"
        alt="Kiro KI"
        className="w-3.5 h-3.5 opacity-90 group-hover:opacity-100 transition-opacity"
        style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(73%) saturate(1542%) hue-rotate(343deg) brightness(98%) contrast(93%)' }}
      />
    </button>
  );
}
