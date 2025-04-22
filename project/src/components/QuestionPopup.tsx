import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface QuestionPopupProps {
  question: {
    title: string;
    description: string;
    highlights: Array<{
      researchInfo: string;
      expandedInfo: string;
    }>;
  };
  onClose: () => void;
}

const QuestionPopup: React.FC<QuestionPopupProps> = ({ question, onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [canProceed, setCanProceed] = useState(false);
  const highlight = question.highlights[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          setCanProceed(true);
          clearInterval(timer);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 relative">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Timer className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{timeRemaining}s</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.title}</h3>
        <p className="text-gray-600 mb-6">{question.description}</p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">Research Summary:</h4>
          <p className="text-blue-900">{highlight.researchInfo}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Additional Context:</h4>
          <p className="text-gray-600">{highlight.expandedInfo}</p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            disabled={!canProceed}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canProceed ? 'Proceed to Question' : `Please wait ${timeRemaining}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;