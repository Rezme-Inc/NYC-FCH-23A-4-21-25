import React, { useState } from 'react';
import { InfoIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';

interface QuizQuestionProps {
  question: {
    id: number;
    title: string;
    description: string;
    articleReference: string;
    highlights: any[];
  };
  highlights: any[];
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, highlights }) => {
  const [sliderValue, setSliderValue] = useState(4); // Default to neutral value
  const [showInfoFor, setShowInfoFor] = useState<string | null>(null);
  const [showExpandedFor, setShowExpandedFor] = useState<string | null>(null);
  
  const { setActiveHighlightId } = useDocument();
  
  // Rating labels
  const ratings = [
    "Strongly Unfavorable",
    "Unfavorable",
    "Slightly Unfavorable",
    "Neutral",
    "Slightly Favorable",
    "Favorable",
    "Strongly Favorable"
  ];
  
  const getRatingLabel = () => {
    return ratings[sliderValue - 1] || "Not Rated";
  };
  
  const handleMouseEnter = (highlightId: string) => {
    setActiveHighlightId(highlightId);
  };
  
  const handleMouseLeave = () => {
    setActiveHighlightId(null);
  };
  
  const toggleShowInfo = (highlightId: string) => {
    setShowInfoFor(showInfoFor === highlightId ? null : highlightId);
  };
  
  const toggleShowExpanded = (highlightId: string) => {
    setShowExpandedFor(showExpandedFor === highlightId ? null : highlightId);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mr-2">{question.title}</h3>
          <InfoIcon size={18} className="text-gray-400" />
        </div>
        <p className="text-gray-600 mb-2">{question.description}</p>
        <p className="text-sm text-gray-500">{question.articleReference}</p>
      </div>
      
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Relevant Information:</h4>
        <ul className="space-y-3">
          {highlights.map((highlight) => (
            <li 
              key={highlight.id}
              className="flex items-start"
              onMouseEnter={() => handleMouseEnter(highlight.id)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="flex-shrink-0 h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                <span className="h-2.5 w-2.5 bg-blue-600 rounded-full"></span>
              </span>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-gray-700">{highlight.summary}</span>
                  <button 
                    className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                    onClick={() => toggleShowInfo(highlight.id)}
                  >
                    <InfoIcon size={16} />
                  </button>
                </div>
                
                {showInfoFor === highlight.id && (
                  <div className="mt-2 ml-1 p-3 bg-gray-50 rounded-md text-sm">
                    <p className="text-gray-700">{highlight.researchInfo}</p>
                    
                    <div className="mt-2">
                      <button
                        className="text-blue-500 text-sm flex items-center hover:text-blue-700 focus:outline-none"
                        onClick={() => toggleShowExpanded(highlight.id)}
                      >
                        {showExpandedFor === highlight.id ? (
                          <>
                            <ChevronUp size={14} className="mr-1" /> Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} className="mr-1" /> Show more
                          </>
                        )}
                      </button>
                      
                      {showExpandedFor === highlight.id && (
                        <div className="mt-2 text-sm text-gray-600">
                          {highlight.expandedInfo}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-500">1 = Strongly Unfavorable, 4 = Neutral, 7 = Strongly Favorable</span>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max="7"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-sm font-medium min-w-24 text-right">{getRatingLabel()}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Add notes:</h4>
        <textarea 
          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Add notes..."
        ></textarea>
      </div>
    </div>
  );
};

export default QuizQuestion;