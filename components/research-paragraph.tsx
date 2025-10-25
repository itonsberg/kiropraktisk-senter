'use client';

import { useState } from 'react';
import { KiroResearchPill } from './kiro-research-pill';

interface ResearchParagraphProps {
  children: React.ReactNode;
  topic: string;
  hasResearch?: boolean;
}

export function ResearchParagraph({ children, topic, hasResearch = true }: ResearchParagraphProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!hasResearch) {
    return <p className="text-lg leading-relaxed text-white/90">{children}</p>;
  }

  const textContent = typeof children === 'string' ? children : '';

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="mb-2">
          <KiroResearchPill text={textContent} topic={topic} />
        </div>
      )}
      <p className="text-lg leading-relaxed text-white/90">
        {children}
      </p>
    </div>
  );
}
