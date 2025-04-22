import { ArrowLeft, CreditCard } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import defaultPdf from "./assets/jacobi_restorative_record.pdf";
import { AssessmentReport as AssessmentReportComponent } from "./components/AssessmentReport";
import CandidateList from "./components/CandidateList";
import { CompletionCelebration } from "./components/CompletionCelebration";
import { Logo } from "./components/Logo";
import { ManualAssessment } from "./components/ManualAssessment";
import { PDFViewer } from "./components/PDFViewer";
import Profile from "./components/Profile";
import { SendAssessmentModal } from "./components/SendAssessmentModal";
import { SplitScreen } from "./components/SplitScreen";
import type { AssessmentReport } from "./types";

interface Factor {
  id: number;
  title: string;
  description: string;
  value: number;
  notes: string;
  article23ASection: string;
  tooltip: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentReport, setAssessmentReport] =
    useState<AssessmentReport | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(true);

  const handleAccessCandidate = useCallback(() => {
    setCurrentStep(0);
    setIsAssessing(false);
    setAssessmentReport(null);
    setShowCelebration(false);
    setShowAssessmentPrompt(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsSendModalOpen(false);
  }, []);

  const handlePreview = useCallback(
    async (data: { recipientEmail: string }) => {
      try {
        // Here you would typically handle the preview logic
        console.log("Sending assessment to:", data.recipientEmail);
      } catch (error) {
        console.error("Failed to send assessment:", error);
        throw error; // Re-throw to be handled by the modal
      }
    },
    []
  );

  const handleManualAssessmentComplete = useCallback(
    (factors: Factor[], hasCertificate: boolean) => {
      const overallScore =
        factors.reduce((sum, factor) => sum + factor.value, 0) / factors.length;

      const report: AssessmentReport = {
        candidateId: "manual-assessment",
        recommendation:
          overallScore >= 5
            ? "hire"
            : overallScore <= 3
            ? "reject"
            : "further-review",
        certificateOfRelief: hasCertificate,
        factors: {
          compliant: factors
            .filter((f) => f.value >= 4)
            .map((f) => ({
              factor: f.title,
              rating: f.value.toString(),
              notes: f.notes,
              article23ASection: f.article23ASection,
            })),
          concerns: factors
            .filter((f) => f.value <= 3)
            .map((f) => ({
              factor: f.title,
              rating: f.value.toString(),
              notes: f.notes,
              article23ASection: f.article23ASection,
            })),
        },
        legalAnalysis: `Manual assessment conducted following Article 23-A guidelines. ${
          factors.filter((f) => f.value >= 4).length
        } positive factors and ${
          factors.filter((f) => f.value <= 3).length
        } areas of concern identified.`,
        policyAnalysis:
          "Individual assessment completed with detailed consideration of all Article 23-A factors.",
        dateGenerated: new Date().toISOString(),
        individualizedAssessment: {
          factors: factors.map((f) => ({
            title: f.title,
            rating: f.value,
            ratingLabel: getLikertLabel(f.value),
            notes: f.notes,
            article23ASection: f.article23ASection,
          })),
          overallScore,
          recommendedAction:
            overallScore >= 5
              ? "hire"
              : overallScore <= 3
              ? "reject"
              : "further-review",
        },
        policyReferences: [
          {
            id: "article-23a",
            title: "Article 23-A",
            section: "Individual Assessment Requirements",
            url: "/policies/article-23a",
          },
        ],
        legalReferences: [
          {
            id: "ny-correction-law",
            jurisdiction: "New York",
            title: "NY Correction Law",
            section: "Article 23-A",
            url: "/legal/ny/correction-law#article-23a",
          },
        ],
      };

      setAssessmentReport(report);
      setShowCelebration(true);
    },
    []
  );

  const getLikertLabel = useCallback((value: number): string => {
    switch (value) {
      case 1:
        return "Strongly Unfavorable";
      case 2:
        return "Moderately Unfavorable";
      case 3:
        return "Slightly Unfavorable";
      case 4:
        return "Neutral";
      case 5:
        return "Slightly Favorable";
      case 6:
        return "Moderately Favorable";
      case 7:
        return "Strongly Favorable";
      default:
        return "Neutral";
    }
  }, []);

  const startAssessment = useCallback(async () => {
    try {
      setShowAssessmentPrompt(false);
      setCurrentStep(3);
    } catch (error) {
      console.error("Failed to start assessment:", error);
    }
  }, []);

  const renderRightPanel = useMemo(
    () => (
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
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <AssessmentReportComponent report={assessmentReport} />
          </div>
        ) : (
          !isAssessing &&
          !assessmentReport &&
          currentStep === 3 && (
            <SplitScreen
              leftContent={<PDFViewer url={defaultPdf} />}
              rightContent={
                <ManualAssessment onComplete={handleManualAssessmentComplete} />
              }
            />
          )
        )}
      </div>
    ),
    [isAssessing, assessmentReport, currentStep, handleManualAssessmentComplete]
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <CandidateList onAccessCandidate={handleAccessCandidate} />
            }
          />
          <Route
            path="/profile"
            element={<Profile onAccessCandidate={handleAccessCandidate} />}
          />
          <Route
            path="/assessment"
            element={
              <div className="min-h-screen bg-gray-100 relative">
                {assessmentReport && !showCelebration && (
                  <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
                    <button
                      onClick={() => setIsSendModalOpen(true)}
                      className="flex items-center px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold shadow-lg transform hover:-translate-y-1 duration-200 group animate-fade-in"
                    >
                      <CreditCard className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-base md:text-lg">
                        SEND ASSESSMENT RESULTS
                      </span>
                    </button>
                  </div>
                )}
                <div className="container mx-auto px-4 py-8">
                  <div className="flex items-center justify-between mb-6">
                    <Logo />
                    <button
                      onClick={() => window.history.back()}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                  </div>
                  {showAssessmentPrompt ? (
                    <div className="bg-white rounded-lg p-6 md:p-8 max-w-4xl w-full mx-auto my-8 shadow-2xl">
                      <div className="text-center">
                        <Logo className="mb-6" />
                        <h2 className="text-xl md:text-2xl font-bold mb-4">
                          Begin Individualized Assessment
                        </h2>
                        <p className="text-gray-600 mb-8">
                          You're about to review a candidate, we're going to
                          walk you through an individualized assessment. Below
                          you will find a summary of the background report and
                          the job requisition you are looking to fill at your
                          organization:
                        </p>

                        <div className="space-y-8">
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Background Check Summary
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                              <li>
                                • Conviction: Possession with Intent to Sell a
                                Controlled Substance (Class B felony)
                              </li>
                              <li>• Date of Conviction: May 12, 2018</li>
                              <li>• Jurisdiction: Kings County, NY</li>
                              <li>
                                • Sentence: Indeterminate 1–9 years; served four
                                years in state custody (June 2019 – June 2023)
                              </li>
                              <li>
                                • Release & Supervision: Paroled in June 2023;
                                completed all parole and probation requirements
                                by May 2025
                              </li>
                              <li>
                                • Parole Violation: One curfew violation
                                recorded in September 2023; resulted in a formal
                                warning and no further sanctions
                              </li>
                            </ul>
                          </div>

                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Job Requisition: Entry‑Level Sales Associate
                            </h3>
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">
                                Position Overview:
                              </h4>
                              <p className="text-gray-700">
                                The Entry‑Level Sales Associate will support
                                sales initiatives by engaging prospects,
                                presenting product information, and assisting
                                with day‑to‑day sales activities. This role
                                includes structured training, mentorship, and
                                opportunities for professional growth.
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Key Responsibilities:
                              </h4>
                              <ul className="space-y-2 text-gray-700">
                                <li>
                                  • Prospect and qualify leads through outreach
                                  and inbound inquiries
                                </li>
                                <li>
                                  • Conduct product demonstrations and
                                  articulate value propositions
                                </li>
                                <li>
                                  • Maintain and update CRM records with
                                  accurate opportunity and pipeline data
                                </li>
                                <li>
                                  • Collaborate with marketing and customer
                                  success teams to ensure seamless customer
                                  experiences
                                </li>
                                <li>
                                  • Meet or exceed individual sales targets and
                                  contribute to team goals
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">
                              What to Expect:
                            </h3>
                            <ul className="list-disc list-inside text-blue-700 space-y-1">
                              <li>Evaluate eight Article 23-A factors</li>
                              <li>Consider certificate of relief status</li>
                              <li>Document your reasoning for each factor</li>
                              <li>Receive a comprehensive compliance report</li>
                            </ul>
                          </div>

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
                  ) : (
                    <>
                      {renderRightPanel}
                      {isSendModalOpen && (
                        <SendAssessmentModal
                          isOpen={isSendModalOpen}
                          onClose={handleModalClose}
                          handlePreview={handlePreview}
                          onReset={handleAccessCandidate}
                        />
                      )}
                      {showCelebration && (
                        <CompletionCelebration
                          onContinue={() => setShowCelebration(false)}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
