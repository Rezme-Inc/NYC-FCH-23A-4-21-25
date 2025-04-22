import React from 'react';
import { useDocument } from '../context/DocumentContext';
import InfoTooltip from './InfoTooltip';

interface HighlightRange {
  id: string;
  start: number;
  end: number;
  questionId: number;
  summary: string;
  researchInfo: string;
  expandedInfo: string;
}

interface HighlightedTextProps {
  text: string;
  highlights: HighlightRange[];
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlights }) => {
  const { activeHighlightId, setActiveHighlightId } = useDocument();
  
  if (!highlights.length) {
    return <div className="text-gray-700">{text}</div>;
  }

  // Sort highlights by start position in descending order to prevent index shift
  const sortedHighlights = [...highlights].sort((a, b) => b.start - a.start);
  
  let result = text;
  
  sortedHighlights.forEach(highlight => {
    const isActive = activeHighlightId === highlight.id;
    const highlightClass = isActive 
      ? 'bg-yellow-200 transition-colors duration-300 rounded px-1' 
      : 'bg-yellow-100 transition-colors duration-300 rounded px-1';
    
    const before = result.substring(0, highlight.start);
    const highlighted = result.substring(highlight.start, highlight.end);
    const after = result.substring(highlight.end);
    
    const highlightedContent = `
      <span 
        id="highlight-${highlight.id}" 
        class="${highlightClass}"
        data-highlight-id="${highlight.id}"
      >
        ${highlighted}
        <span class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Assistant summarize info
        </span>
      </span>
    `;
    
    result = `${before}${highlightedContent}${after}`;
  });
  
  return (
    <div 
      className="relative text-gray-700"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const highlightEl = target.closest('[data-highlight-id]') as HTMLElement;
        if (highlightEl) {
          const highlightId = highlightEl.dataset.highlightId;
          setActiveHighlightId(highlightId || null);
        }
      }}
      dangerouslySetInnerHTML={{ __html: result }}
    />
  );
};

export default HighlightedText;