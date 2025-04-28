import { ArrowLeft, CreditCard, FileCheck } from "lucide-react";
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [assessorEmail, setAssessorEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setShowEmailModal(true);
    } catch (error) {
      console.error("Failed to start assessment:", error);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = useCallback(async (email: string) => {
    try {
      setIsSubmitting(true);
      setEmailError("");

      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address");
        return;
      }

      // Send email to Google Apps Script
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxIrcRsDZW4oYfp60TsDAQQjnojOko0LMrP-zDWVqFpDu5wZPCKzVDCjCSbdEIUAROsWA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log("Email submission response:", response);

      setAssessorEmail(email);
      setShowEmailModal(false);
      setCurrentStep(3);
    } catch (error) {
      console.error("Failed to save email:", error);
      setEmailError("Failed to save email. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Enter Your Email</h2>
              <p className="text-gray-600 mb-4">
                Please enter your email address to continue with the assessment.
              </p>
              <input
                type="email"
                value={assessorEmail}
                onChange={(e) => {
                  setAssessorEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="Enter your email address"
                className={`w-full p-2 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded mb-2`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mb-4">{emailError}</p>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEmailSubmit(assessorEmail)}
                  disabled={!assessorEmail || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
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
                      <div className="text-left">
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
                            <ul className="space-y-3 text-gray-700 list-none pl-0">
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  Conviction: Possession with Intent to Sell a
                                  Controlled Substance (Class B felony)
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Date of Conviction: May 12, 2018</span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Jurisdiction: Kings County, NY</span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  Sentence: Indeterminate 1–9 years; served four
                                  years in state custody (June 2019 – June 2023)
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  Release & Supervision: Paroled in June 2023;
                                  completed all parole and probation
                                  requirements by May 2025
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  Parole Violation: One curfew violation
                                  recorded in September 2023; resulted in a
                                  formal warning and no further sanctions
                                </span>
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
                              <ul className="space-y-2 text-gray-700 list-none pl-0">
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>
                                    Prospect and qualify leads through outreach
                                    and inbound inquiries
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>
                                    Conduct product demonstrations and
                                    articulate value propositions
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>
                                    Maintain and update CRM records with
                                    accurate opportunity and pipeline data
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>
                                    Collaborate with marketing and customer
                                    success teams to ensure seamless customer
                                    experiences
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>
                                    Meet or exceed individual sales targets and
                                    contribute to team goals
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              What to Expect
                            </h3>
                            <ul className="space-y-3 text-gray-700 list-none pl-0">
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  You will be guided through an individualized
                                  assessment process
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  Each factor will be evaluated on a scale of
                                  1-7
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  You will have the opportunity to provide notes
                                  for each factor
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  At the end, you will make a final decision:
                                  Hire, Do Not Hire, or Send for Further Review
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                          <button
                            onClick={startAssessment}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                          >
                            <FileCheck className="w-5 h-5 mr-2" />
                            Begin Assessment
                          </button>
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
