import React, { useState } from 'react';
import { Scale, AlertCircle, Info, FileCheck, Shield, ArrowLeft, ArrowRight, FileWarning, ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';

interface Factor {
  id: number;
  title: string;
  description: string;
  value: number;
  notes: string;
  article23ASection: string;
  tooltip: string;
}

interface ManualAssessmentProps {
  onComplete: (factors: Factor[], hasCertificate: boolean) => void;
}

export function ManualAssessment({ onComplete }: ManualAssessmentProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasCertificate, setHasCertificate] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [showDoNotHireModal, setShowDoNotHireModal] = useState(false);
  const [doNotHireJustification, setDoNotHireJustification] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [factors, setFactors] = useState<Factor[]>([
    {
      id: 1,
      title: "Public Policy Consideration",
      description: "New York State's public policy of encouraging the employment of persons previously convicted of one or more criminal offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 1",
      tooltip: "New York State encourages hiring qualified applicants with prior convictions. Article 23-A aims to remove unfair barriers while ensuring reliable and trustworthy candidates are considered."
    },
    {
      id: 2,
      title: "Job Duties and Responsibilities",
      description: "The specific duties and responsibilities necessarily related to the license or employment sought.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 2",
      tooltip: "Consider the specific tasks, required skills, and daily responsibilities of the position."
    },
    {
      id: 3,
      title: "Conviction Impact on Performance",
      description: "The bearing, if any, the criminal offense or offenses for which the person was previously convicted will have on their ability to perform duties or responsibilities.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 3",
      tooltip: "Evaluate if the conviction affects job performance. For example, a financial crime conviction might be relevant for a banking position."
    },
    {
      id: 4,
      title: "Time Since Offense",
      description: "The time which has elapsed since the occurrence of the criminal offense or offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 4",
      tooltip: "Research shows that after 4-7 conviction-free years, the likelihood of future arrest matches that of someone without convictions. Consider evidence of rehabilitation."
    },
    {
      id: 5,
      title: "Age at Time of Offense",
      description: "The age of the person at the time of occurrence of the criminal offense or offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 5",
      tooltip: "People often mature and change significantly after youthful mistakes. Consider the applicant's age when the offense occurred."
    },
    {
      id: 6,
      title: "Offense Seriousness",
      description: "The seriousness of the offense or offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 6",
      tooltip: "Not all offenses are equally serious. Consider the specific circumstances of the case, as legal definitions may not reflect the actual situation."
    },
    {
      id: 7,
      title: "Rehabilitation Evidence",
      description: "Any information produced by the person, or produced on their behalf, in regard to rehabilitation and good conduct.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 7",
      tooltip: "Look for evidence of rehabilitation such as education, employment history, training programs, or volunteer work that demonstrates responsibility and positive change."
    },
    {
      id: 8,
      title: "Public Safety and Property Protection",
      description: "The legitimate interest in protecting property, and the safety and welfare of specific individuals or the general public.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 8",
      tooltip: "Consider if hiring would create risks to people or property. The conviction itself is not a valid reason to deny employment."
    }
  ]);

  const handleValueChange = (id: number, value: number) => {
    setFactors(prev => prev.map(factor => 
      factor.id === id ? { ...factor, value } : factor
    ));
    checkCompletion();
  };

  const handleNotesChange = (id: number, notes: string) => {
    setFactors(prev => prev.map(factor => 
      factor.id === id ? { ...factor, notes } : factor
    ));
    checkCompletion();
  };

  const checkCompletion = () => {
    const isComplete = currentQuestionIndex === factors.length - 1;
    setIsAssessmentComplete(isComplete);
  };

  const getLikertLabel = (value: number) => {
    switch (value) {
      case 1: return "Strongly Unfavorable";
      case 2: return "Moderately Unfavorable";
      case 3: return "Slightly Unfavorable";
      case 4: return "Neutral";
      case 5: return "Slightly Favorable";
      case 6: return "Moderately Favorable";
      case 7: return "Strongly Favorable";
      default: return "Neutral";
    }
  };

  const getSliderColor = (value: number) => {
    if (value <= 2) return 'red';
    if (value <= 4) return 'yellow';
    return 'green';
  };

  const getSliderGradient = (value: number) => {
    const percentage = ((value - 1) / 6) * 100;
    if (value <= 2) {
      return `linear-gradient(to right, red 0%, red ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
    } else if (value <= 4) {
      return `linear-gradient(to right, yellow 0%, yellow ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
    } else {
      return `linear-gradient(to right, green 0%, green ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
    }
  };

  const handleDoNotHireClick = () => {
    setShowDoNotHireModal(true);
  };

  const handleDoNotHireConfirm = () => {
    if (doNotHireJustification.trim()) {
      onComplete(factors.map(f => ({
        ...f,
        notes: f.id === 8 ? `${f.notes}\n\nDO NOT HIRE Justification: ${doNotHireJustification}` : f.notes
      })), hasCertificate || false);
      setShowDoNotHireModal(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < factors.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      checkCompletion();
    } else {
      checkCompletion();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (showWelcome) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
          Article 23-A Assessment Guide
        </h2>
        <div className="space-y-6 text-gray-600">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-700">
              It is the policy of the State of New York to encourage employers to hire qualified applicants with prior convictions. Article 23-A provides a framework for making intelligent, informed, and fair hiring decisions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Key Assessment Principles</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Each factor must be evaluated individually and in relation to others</li>
              <li>No single factor should determine the final hiring decision</li>
              <li>Qualified candidates must be assessed on a case-by-case basis</li>
              <li>Consider both job-specific factors and broader policy implications</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
            <p className="text-yellow-700">
              If an applicant holds a Certificate of Relief for Disabilities or a Certificate of Good Conduct, these create a presumption of rehabilitation and must be given special consideration in your assessment.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Assessment Process</h4>
            <p>
              You will evaluate eight factors mandated by Article 23-A. For each factor:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Rate the factor on a scale of 1-7</li>
              <li>Provide detailed notes explaining your rating</li>
              <li>Consider how each factor relates to others</li>
              <li>Document any specific circumstances or considerations</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowWelcome(false)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <FileCheck className="w-5 h-5 mr-2" />
            Begin Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Scale className="w-6 h-6 mr-2 text-blue-500" />
          Article 23-A Assessment Factors
        </h2>
        <p className="text-gray-600 mt-2">
          Rate each factor on a scale of 1-7, where:
          <br />
          1 = Strongly Unfavorable, 4 = Neutral, 7 = Strongly Favorable
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {factors.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-8">
          <div className="border-b pb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{factors[currentQuestionIndex].title}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{factors[currentQuestionIndex].description}</p>
                <p className="text-xs text-gray-500 mt-1">{factors[currentQuestionIndex].article23ASection}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-col gap-2 w-full md:w-64">
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={factors[currentQuestionIndex].value}
                      onChange={(e) => handleValueChange(factors[currentQuestionIndex].id, parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                      style={{
                        backgroundImage: getSliderGradient(factors[currentQuestionIndex].value),
                        transition: 'background-image 0.2s ease-in-out'
                      }}
                    />
                    <div className="absolute -top-2 left-0 w-full flex justify-between">
                      {[1, 2, 3, 4, 5, 6, 7].map((mark) => (
                        <div
                          key={mark}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            factors[currentQuestionIndex].value >= mark
                              ? getSliderColor(mark) === 'red' ? 'bg-red-500' :
                                getSliderColor(mark) === 'yellow' ? 'bg-yellow-500' :
                                'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                  </div>
                  <div className="text-center">
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      getSliderColor(factors[currentQuestionIndex].value) === 'red' ? 'text-red-500' :
                      getSliderColor(factors[currentQuestionIndex].value) === 'yellow' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {getLikertLabel(factors[currentQuestionIndex].value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <textarea
                value={factors[currentQuestionIndex].notes}
                onChange={(e) => handleNotesChange(factors[currentQuestionIndex].id, e.target.value)}
                placeholder="Add notes..."
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          {currentQuestionIndex === factors.length - 1 ? 'Complete' : 'Next'}
          {currentQuestionIndex < factors.length - 1 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Additional Information</h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          {factors[currentQuestionIndex].tooltip}
        </p>
      </div>

      {isAssessmentComplete && currentQuestionIndex === factors.length - 1 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Assessment Complete</h3>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="certificate"
                checked={hasCertificate}
                onChange={(e) => setHasCertificate(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="certificate" className="text-sm font-medium text-gray-700">
                Candidate has Certificate of Relief from Disabilities or Good Conduct
              </label>
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            {showTooltip && (
              <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Certificate Information</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  A Certificate of Relief from Disabilities or Good Conduct is a legal document that may be issued to individuals with criminal records. It indicates they have taken steps toward rehabilitation and may be eligible for certain employment opportunities that would otherwise be restricted.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => onComplete(factors, hasCertificate || false)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <FileCheck className="w-5 h-5" />
              Hire
            </button>
            <button
              onClick={handleDoNotHireClick}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Do Not Hire
            </button>
            <button
              onClick={() => onComplete(factors, hasCertificate || false)}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <FileWarning className="w-5 h-5" />
              Further Review
            </button>
          </div>
        </div>
      )}

      {showDoNotHireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Justification Required</h3>
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-yellow-700 text-sm">
                Article 23-A recognizes two instances where an employer may legitimately deny employment to an applicant based on his/her prior conviction:
              </p>
              <ol className="list-decimal pl-5 mt-2 text-yellow-700 text-sm space-y-2">
                <li>When there is a direct relationship between the prior offense and the specific employment sought.</li>
                <li>When the employment would involve an unreasonable risk to property or the safety or welfare of specific individuals or the general public. The conviction itself is not a legitimate reason.</li>
              </ol>
            </div>
            <textarea
              value={doNotHireJustification}
              onChange={(e) => setDoNotHireJustification(e.target.value)}
              placeholder="Please provide justification for not hiring..."
              className="w-full p-2 border rounded text-sm mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDoNotHireModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDoNotHireConfirm}
                disabled={!doNotHireJustification.trim()}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  !doNotHireJustification.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}