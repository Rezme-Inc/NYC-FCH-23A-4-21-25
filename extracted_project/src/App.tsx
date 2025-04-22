import React, { useState, useCallback, useMemo } from 'react';
import { SplitScreen } from './components/SplitScreen';
import { AssessmentSteps } from './components/AssessmentSteps';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentViewer } from './components/DocumentViewer';
import { FileCheck, AlertCircle, FileText, ClipboardList, FileWarning, Send, Database, Link, BookOpen, Settings, Brain, UserCircle, Scale, CreditCard, ArrowLeft, Home } from 'lucide-react';
import type { CompanyPolicy, JurisdictionLaw, AssessmentReport, AssessmentFactor } from './types';
import { ManualAssessment } from './components/ManualAssessment';
import { AssessmentReport as AssessmentReportComponent } from './components/AssessmentReport';
import { CompletionCelebration } from './components/CompletionCelebration';
import { PDFViewer } from './components/PDFViewer';
import { SendAssessmentModal } from './components/SendAssessmentModal';
import defaultPdf from './assets/jacobi_restorative_record.pdf';
import { Logo } from './components/Logo';

interface Factor {
  title: string;
  value: number;
  notes: string;
  article23ASection: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);
  const [documents, setDocuments] = useState<{
    policies?: { name: string; url: string }[];
  }>({});
  const [assessmentReport, setAssessmentReport] = useState<AssessmentReport | null>(null);
  const [activeDocument, setActiveDocument] = useState<'policies' | null>(null);
  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const handlePolicyUrlSubmit = useCallback((url: string, name: string) => {
    setDocuments(prev => ({
      ...prev,
      policies: [...(prev.policies || []), { name, url }]
    }));
  }, []);

  const getLikertLabel = useCallback((value: number): string => {
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
  }, []);

  const handleManualAssessmentComplete = useCallback((factors: Factor[], hasCertificate: boolean) => {
    const overallScore = factors.reduce((sum, factor) => sum + factor.value, 0) / factors.length;
    
    const report: AssessmentReport = {
      candidateId: 'manual-assessment',
      recommendation: overallScore >= 5 ? 'hire' : overallScore <= 3 ? 'reject' : 'further-review',
      certificateOfRelief: hasCertificate,
      factors: {
        compliant: factors
          .filter(f => f.value >= 4)
          .map(f => ({
            factor: f.title,
            rating: f.value.toString(),
            notes: f.notes,
            article23ASection: f.article23ASection
          })),
        concerns: factors
          .filter(f => f.value <= 3)
          .map(f => ({
            factor: f.title,
            rating: f.value.toString(),
            notes: f.notes,
            article23ASection: f.article23ASection
          }))
      },
      legalAnalysis: `Manual assessment conducted following Article 23-A guidelines. ${
        factors.filter(f => f.value >= 4).length
      } positive factors and ${
        factors.filter(f => f.value <= 3).length
      } areas of concern identified.`,
      policyAnalysis: 'Individual assessment completed with detailed consideration of all Article 23-A factors.',
      dateGenerated: new Date().toISOString(),
      individualizedAssessment: {
        factors: factors.map(f => ({
          title: f.title,
          rating: f.value,
          ratingLabel: getLikertLabel(f.value),
          notes: f.notes,
          article23ASection: f.article23ASection
        })),
        overallScore,
        recommendedAction: overallScore >= 5 ? 'hire' : overallScore <= 3 ? 'reject' : 'further-review'
      },
      policyReferences: [
        {
          id: 'article-23a',
          title: 'Article 23-A',
          section: 'Individual Assessment Requirements',
          url: '/policies/article-23a'
        }
      ],
      legalReferences: [
        {
          id: 'ny-correction-law',
          jurisdiction: 'New York',
          title: 'NY Correction Law',
          section: 'Article 23-A',
          url: '/legal/ny/correction-law#article-23a'
        }
      ]
    };
    
    setAssessmentReport(report);
    setShowCelebration(true);
  }, [getLikertLabel]);

  const startAssessment = useCallback(async () => {
    try {
      setShowAssessmentPrompt(false);
      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to start assessment:', error);
    }
  }, []);

  const handlePreview = useCallback(async (data: { recipientEmail: string }) => {
    try {
      // Here you would typically handle the preview logic
      console.log('Sending assessment to:', data.recipientEmail);
    } catch (error) {
      console.error('Failed to send assessment:', error);
      throw error; // Re-throw to be handled by the modal
    }
  }, []);

  const handleSendClick = useCallback(() => {
    setIsSendModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsSendModalOpen(false);
  }, []);

  const resetAssessment = useCallback(() => {
    setCurrentStep(0);
    setIsAssessing(false);
    setAssessmentReport(null);
    setShowAssessmentPrompt(true);
    setShowCelebration(false);
  }, []);

  const renderLeftPanel = useMemo(() => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileCheck className="w-5 h-5 mr-2 text-blue-500" />
          Assessment Progress
        </h2>
        <AssessmentSteps currentStep={currentStep} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Optional Documents</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Company Policies</h4>
            {(() => {
              const maybePolicies = documents?.policies;
              if (!maybePolicies) return null;
              
              const policies = Array.isArray(maybePolicies) ? maybePolicies : null;
              if (!policies) return null;
              
              if (policies.length === 0) return null;
              
              return (
                <div className="space-y-2">
                  {policies.map((policy, index) => (
                    <DocumentViewer key={index} document={policy} />
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  ), [currentStep, documents?.policies]);

  const renderRightPanel = useMemo(() => (
    <div className="space-y-6">
      {isAssessing ? (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : assessmentReport ? (
        <AssessmentReportComponent
          report={assessmentReport}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <Scale className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Ready to begin assessment</p>
              <button
                onClick={() => setShowAssessmentPrompt(true)}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ), [isAssessing, assessmentReport]);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Send Assessment Button - Only show after assessment is completed */}
      {assessmentReport && !showCelebration && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
          <button
            onClick={handleSendClick}
            className="flex items-center px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold shadow-lg transform hover:-translate-y-1 duration-200 group animate-fade-in"
          >
            <CreditCard className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-base md:text-lg">SEND ASSESSMENT RESULTS</span>
          </button>
        </div>
      )}

      <header className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={resetAssessment}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
              >
                <Home className="w-5 h-5" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                New York City Fair Chance Act (New York Corrections Law Article 23-A)
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveDocument('policies')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeDocument === 'policies' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Company Policies
              </button>
              {assessmentReport && (
                <button
                  onClick={resetAssessment}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Start New Assessment
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8 relative">
        {!isAssessing && assessmentReport ? (
          <div className="bg-white rounded-lg shadow p-6">
            <AssessmentReportComponent report={assessmentReport} />
          </div>
        ) : !isAssessing && !assessmentReport && currentStep === 3 && (
          <SplitScreen
            leftContent={<PDFViewer url={defaultPdf} />}
            rightContent={<ManualAssessment onComplete={handleManualAssessmentComplete} />}
          />
        )}
      </div>

      {activeDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Company Policies</h2>
              <button
                onClick={() => setActiveDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-800 font-medium mb-2">Customize Your Assessment</p>
                <p className="text-blue-700">
                  This is where you would customize your assessment based on company policy. We're currently developing enhanced features to help organizations seamlessly integrate their policies into the assessment framework.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-800 font-medium mb-2">Become an ALPHA Partner</p>
                <p className="text-yellow-700 mb-4">
                  Interested in shaping the future of policy-driven assessments? Join our ALPHA program to get early access to advanced policy integration features.
                </p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as HTMLFormElement).email.value;
                  console.log('ALPHA signup:', email);
                  alert('Thank you for your interest! We will be in touch soon.');
                  (e.target as HTMLFormElement).reset();
                }}>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>

              <div className="border-t pt-6">
                <DocumentUpload
                  onUrlSubmit={handlePolicyUrlSubmit}
                  label="Add Policy Link"
                />
                {documents.policies && documents.policies.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Linked Policies</h3>
                    <div className="space-y-2">
                      {documents.policies.map((policy, index) => (
                        <DocumentViewer key={index} document={policy} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssessmentPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-left">
              <div className="text-center mb-6">
                <Logo className="mb-6" />
                <h2 className="text-xl md:text-2xl font-bold mb-4">Begin Individualized Assessment</h2>
                <p className="text-gray-600">
                  You're about to review a candidate, we're going to walk you through an individualized assessment. Below you will find a summary of the background report and the job requisition you are looking to fill at your organization:
                </p>
              </div>

              <div className="space-y-8">
                {/* Background Check Summary Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Background Check Summary</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Conviction: Possession with Intent to Sell a Controlled Substance (Class B felony)</li>
                    <li>• Date of Conviction: May 12, 2018</li>
                    <li>• Jurisdiction: Kings County, NY</li>
                    <li>• Sentence: Indeterminate 1–9 years; served four years in state custody (June 2019 – June 2023)</li>
                    <li>• Release & Supervision: Paroled in June 2023; completed all parole and probation requirements by May 2025</li>
                    <li>• Parole Violation: One curfew violation recorded in September 2023; resulted in a formal warning and no further sanctions</li>
                  </ul>
                </div>

                {/* Job Requisition Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Requisition: Entry‑Level Sales Associate</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Position Overview:</h4>
                    <p className="text-gray-700">
                      The Entry‑Level Sales Associate will support sales initiatives by engaging prospects, presenting product information, and assisting with day‑to‑day sales activities. This role includes structured training, mentorship, and opportunities for professional growth.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Responsibilities:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Prospect and qualify leads through outreach and inbound inquiries</li>
                      <li>• Conduct product demonstrations and articulate value propositions</li>
                      <li>• Maintain and update CRM records with accurate opportunity and pipeline data</li>
                      <li>• Collaborate with marketing and customer success teams to ensure seamless customer experiences</li>
                      <li>• Meet or exceed individual sales targets and contribute to team goals</li>
                    </ul>
                  </div>
                </div>

                {/* What to Expect Section */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">What to Expect:</h3>
                  <ul className="list-disc list-inside text-blue-700 space-y-1">
                    <li>Evaluate eight Article 23-A factors</li>
                    <li>Consider certificate of relief status</li>
                    <li>Document your reasoning for each factor</li>
                    <li>Receive a comprehensive compliance report</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={startAssessment}
                    className="px-12 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Begin Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCelebration && (
        <CompletionCelebration
          onContinue={() => setShowCelebration(false)}
        />
      )}

      <SendAssessmentModal
        isOpen={isSendModalOpen}
        onClose={handleModalClose}
        handlePreview={handlePreview}
        onReset={resetAssessment}
      />
    </div>
  );
}

export default App;