import React, { useState } from 'react';
import { InfoIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface InfoTooltipProps {
  researchInfo: string;
  expandedInfo: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ researchInfo, expandedInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        className="text-blue-500 hover:text-blue-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <InfoIcon size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Research Information:</p>
            <p>{researchInfo}</p>
            
            {expandedInfo && (
              <div className="mt-2">
                <button
                  className="text-blue-500 text-sm flex items-center hover:text-blue-700 focus:outline-none"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? (
                    <>
                      <ChevronUp size={14} className="mr-1" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} className="mr-1" /> Show more
                    </>
                  )}
                </button>
                
                {showMore && (
                  <div className="mt-2 text-sm text-gray-600">
                    {expandedInfo}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;