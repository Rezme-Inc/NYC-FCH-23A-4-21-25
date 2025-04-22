import React from 'react';
import { FileText, Scale, Clock, UserCheck, Book, Shield } from 'lucide-react';
import type { AssessmentReport } from '../types';

interface AssessmentReportProps {
  report: AssessmentReport;
}

export function AssessmentReport({ report }: AssessmentReportProps) {
  // Helper function to get rating color classes
  const getRatingColorClasses = (rating: number) => {
    if (rating > 4) return 'bg-green-100 text-green-800';
    if (rating < 4) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800'; // Neutral is now yellow
  };

  // Helper function to get factor by title
  const getFactorByTitle = (title: string) => {
    const allFactors = [
      ...(report.individualizedAssessment?.factors || []),
      ...report.factors.compliant.map(f => ({
        title: f.factor,
        rating: 5,
        ratingLabel: 'Compliant',
        notes: f.notes,
        article23ASection: f.article23ASection
      })),
      ...report.factors.concerns.map(f => ({
        title: f.factor,
        rating: 3,
        ratingLabel: 'Concern',
        notes: f.notes,
        article23ASection: f.article23ASection
      }))
    ];
    return allFactors.find(f => f.title.toLowerCase().includes(title.toLowerCase()));
  };

  const article23AFactors = [
    {
      title: "Public Policy Consideration",
      description: "New York State's public policy of encouraging the employment of persons previously convicted of one or more criminal offenses.",
      section: "§ 753(1)(a)"
    },
    {
      title: "Job Duties and Responsibilities",
      description: "The specific duties and responsibilities necessarily related to the license or employment sought.",
      section: "§ 753(1)(b)"
    },
    {
      title: "Conviction Impact on Performance",
      description: "The bearing, if any, the criminal offense or offenses for which the person was previously convicted will have on their ability to perform duties or responsibilities.",
      section: "§ 753(1)(c)"
    },
    {
      title: "Time Since Offense",
      description: "The time which has elapsed since the occurrence of the criminal offense or offenses.",
      section: "§ 753(1)(d)"
    },
    {
      title: "Age at Time of Offense",
      description: "The age of the person at the time of occurrence of the criminal offense or offenses.",
      section: "§ 753(1)(e)"
    },
    {
      title: "Offense Seriousness",
      description: "The seriousness of the offense or offenses.",
      section: "§ 753(1)(f)"
    },
    {
      title: "Rehabilitation Evidence",
      description: "Any information produced by the person, or produced on their behalf, in regard to rehabilitation and good conduct.",
      section: "§ 753(1)(g)"
    },
    {
      title: "Public Safety and Property Protection",
      description: "The legitimate interest in protecting property, and the safety and welfare of specific individuals or the general public.",
      section: "§ 753(1)(h)"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Certificate Status */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-500" />
          Certificate of Relief Status
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-medium">
                {report.certificateOfRelief 
                  ? "Certificate of Relief/Good Conduct Presented"
                  : "No Certificate of Relief/Good Conduct Presented"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {report.certificateOfRelief 
                  ? "Under Article 23-A § 753(2), this certificate creates a presumption of rehabilitation."
                  : "No presumption of rehabilitation under Article 23-A § 753(2)."}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              report.certificateOfRelief 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {report.certificateOfRelief ? 'Certificate Present' : 'No Certificate'}
            </span>
          </div>
        </div>
      </div>

      {/* Legal Compliance Analysis */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Scale className="w-5 h-5 mr-2 text-blue-500" />
          Article 23-A Legal Compliance Analysis
        </h3>
        <div className="space-y-6">
          {article23AFactors.map((factor, index) => {
            const assessmentFactor = getFactorByTitle(factor.title);

            return (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{factor.title}</h4>
                      <span className="text-sm text-gray-500">{factor.section}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                  </div>
                </div>
                {assessmentFactor ? (
                  <div className="mt-3 border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Assessment Result</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColorClasses(assessmentFactor.rating)}`}>
                        {assessmentFactor.ratingLabel}
                      </span>
                    </div>
                    {assessmentFactor.notes && (
                      <p className="text-sm text-gray-600 mt-1">{assessmentFactor.notes}</p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm text-gray-500 italic">No assessment data available for this factor</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time-Based Criteria */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Time-Based Criteria
        </h3>
        <div className="space-y-4">
          {report.individualizedAssessment?.factors
            .filter(f => f.title.toLowerCase().includes('time'))
            .map((factor, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{factor.title}</h4>
                  <span className={`text-sm ${getRatingColorClasses(factor.rating)}`}>
                    {factor.ratingLabel}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      factor.rating > 4 ? 'bg-green-500' :
                      factor.rating < 4 ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${(factor.rating / 7) * 100}%` }}
                  ></div>
                </div>
                {factor.notes && (
                  <p className="mt-2 text-sm text-gray-600">{factor.notes}</p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Policy Alignment */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Book className="w-5 h-5 mr-2 text-blue-500" />
          Policy Alignment
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Legal Framework</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{report.legalAnalysis}</p>
              <div className="mt-4 space-y-2">
                {report.legalReferences.map((ref, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <span className="font-medium">{ref.title}</span> - {ref.section}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Company Policy</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{report.policyAnalysis}</p>
              <div className="mt-4 space-y-2">
                {report.policyReferences.map((ref, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <span className="font-medium">{ref.title}</span> - {ref.section}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}