import React, { useState } from 'react';
import { Scale, AlertCircle, Info, FileCheck, Shield } from 'lucide-react';

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
  const [hasCertificate, setHasCertificate] = useState<boolean | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [showDoNotHireModal, setShowDoNotHireModal] = useState(false);
  const [doNotHireJustification, setDoNotHireJustification] = useState('');
  const [factors, setFactors] = useState<Factor[]>([
    {
      id: 1,
      title: "Public Policy Consideration",
      description: "New York State's public policy of encouraging the employment of persons previously convicted of one or more criminal offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 1",
      tooltip: "As previously discussed, it is the policy of the State of New York to encourage employers to hire applicants with prior convictions. Article 23-A aims to eliminate bias and illegitimate obstacles people with prior convictions face when seeking work, while at the same time, protecting society's interest in hiring and employing reliable and trustworthy job candidates. Though Article 23-A does not require employers to give preferential treatment to qualified job seekers with prior convictions, it does seek to remove prejudice against such applicants in obtaining jobs. This prejudice is not only widespread, but unfair and counterproductive to you as an employer seeking qualified workers and to the people of New York."
    },
    {
      id: 2,
      title: "Job Duties and Responsibilities",
      description: "The specific duties and responsibilities necessarily related to the license or employment sought.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 2",
      tooltip: "What does the job entail? What are the responsibilities of the job? Are any special skills required? What is the job like on a day-to-day basis?"
    },
    {
      id: 3,
      title: "Conviction Impact on Performance",
      description: "The bearing, if any, the criminal offense or offenses for which the person was previously convicted will have on their ability to perform duties or responsibilities.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 3",
      tooltip: "Do the job responsibilities share any qualities with the activities that led to the conviction? For instance, a person convicted of burglary or credit card fraud may not be suitable for a job counting money at the bank. Does the offense make the applicant less suitable for the job? If so, can you articulate what makes this person less qualified?"
    },
    {
      id: 4,
      title: "Time Since Offense",
      description: "The time which has elapsed since the occurrence of the criminal offense or offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 4",
      tooltip: "Research shows that if a person is conviction free for four to seven years or longer, the likelihood of future arrest is about the same as for someone who has never been convicted of a crime. This time is reduced by the person's involvement in positive activities, including employment, education, and occupational training. Therefore, even for applicants with recent convictions, it is important that the employer consider evidence of rehabilitation and other facts and circumstances that indicate that the applicant does not present a significant risk of re-offending."
    },
    {
      id: 5,
      title: "Age at Time of Offense",
      description: "The age of the person at the time of occurrence of the criminal offense or offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 5",
      tooltip: "It is not uncommon for someone who exercised poor judgment during youth to mature into a productive, hard working, law abiding adult. When evaluating an applicant with a prior conviction, employers should consider the applicant's age at the time the offense was committed."
    },
    {
      id: 6,
      title: "Offense Seriousness",
      description: "The seriousness of the offense or offenses.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 6",
      tooltip: "Not all offenses are the same and how they are defined does not always reflect the circumstances involved in a case. A youth who may have taken another youth's book bag off his body to toss it around can be charged with robbery. (This is a real case example.) Therefore, the circumstances of the case may more accurately reflect the seriousness of the conviction. An employer should always give consideration to the seriousness of the offense or offenses and the circumstances therein."
    },
    {
      id: 7,
      title: "Rehabilitation Evidence",
      description: "Any information produced by the person, or produced on their behalf, in regard to rehabilitation and good conduct.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 7",
      tooltip: "There are a variety of ways that applicants with prior convictions can demonstrate that they have put their lives back on track, and that they will be successful and valuable employees. Applicants may seek to demonstrate their rehabilitation by presenting documents from prior jobs they have held or programs they've been involved with since the time of his/her offense. All evidence of rehabilitation should be considered.\n\nSome examples of items that an applicant might provide to demonstrate his/her rehabilitation are:\n• Education: Transcripts, diplomas, certifications, or letters from teachers.\n• References from past employers or job training programs\n• Evidence of participation in counseling and other workforce development or social service programs\n• Volunteer Programs: Documentation of volunteer activities that indicate responsibility and willingness to contribute to others' well-being."
    },
    {
      id: 8,
      title: "Public Safety and Property Protection",
      description: "The legitimate interest in protecting property, and the safety and welfare of specific individuals or the general public.",
      value: 4,
      notes: "",
      article23ASection: "Article 23-A Section 8",
      tooltip: "Recording and keeping track of the factors enumerated in Article 23-A and evaluating them fairly will help employers to determine whether a direct relationship exists between the position sought and the prior offense, or whether the employers' legitimate interest in protecting the welfare of people and property would be risked by hiring the applicant. If after careful consideration of all factors the determination is made not to hire the applicant, an employer will typically be safe in denying employment. However, if the evaluation of all factors indicates that an applicant is qualified for the position sought, an employer should be prepared to demonstrate a legitimate reason not related to the prior conviction for not hiring the applicant. The conviction itself is not a legitimate reason."
    }
  ]);

  const handleValueChange = (id: number, value: number) => {
    setFactors(prev => prev.map(factor => 
      factor.id === id ? { ...factor, value } : factor
    ));
  };

  const handleNotesChange = (id: number, notes: string) => {
    setFactors(prev => prev.map(factor => 
      factor.id === id ? { ...factor, notes } : factor
    ));
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
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-8">
          {factors.map(factor => (
            <div key={factor.id} className="border-b pb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{factor.title}</h3>
                    <button
                      onClick={() => setActiveTooltip(activeTooltip === factor.id ? null : factor.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{factor.article23ASection}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={factor.value}
                      onChange={(e) => handleValueChange(factor.id, parseInt(e.target.value))}
                      className="w-48"
                    />
                    <span className="text-sm font-medium w-24">{getLikertLabel(factor.value)}</span>
                  </div>
                  <textarea
                    value={factor.notes}
                    onChange={(e) => handleNotesChange(factor.id, e.target.value)}
                    placeholder="Add notes..."
                    className="w-full md:w-64 h-20 p-2 border rounded text-sm"
                  />
                </div>
              </div>
              {activeTooltip === factor.id && (
                <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                  {factor.tooltip}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasCertificate === true}
              onChange={(e) => setHasCertificate(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Candidate has Certificate of Relief from Disabilities or Good Conduct</span>
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => onComplete(factors, hasCertificate || false)}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <FileCheck className="w-5 h-5 mr-2" />
            HIRE
          </button>

          <button
            onClick={handleDoNotHireClick}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            DO NOT HIRE
          </button>

          <button
            onClick={() => onComplete(factors, hasCertificate || false)}
            className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
          >
            <Info className="w-5 h-5 mr-2" />
            SEND FOR FURTHER REVIEW
          </button>
        </div>
      </div>

      {showDoNotHireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Article 23-A Requirement</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
              <p className="text-yellow-800">
                Article 23-A recognizes two instances where an employer may legitimately deny employment to an applicant based on his/her prior conviction: (1) When there is a direct relationship between the prior offense and the specific employment sought, and (2) When the employment would involve an unreasonable risk to property or the safety or welfare of specific individuals or the general public. The conviction itself is not a legitimate reason.
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please describe the relationship between the prior offense and the specific employment sought or the unreasonable risk to property, safety, or welfare:
              </label>
              <textarea
                value={doNotHireJustification}
                onChange={(e) => setDoNotHireJustification(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your justification here..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDoNotHireModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDoNotHireConfirm}
                disabled={!doNotHireJustification.trim()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm DO NOT HIRE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}