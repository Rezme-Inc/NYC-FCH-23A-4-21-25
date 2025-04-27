export interface RestorativeRecord {
  candidateId: string;
  rehabilitationEfforts: string[];
  communityService: string[];
  employmentHistory: string[];
  characterReferences: string[];
  educationAchievements: string[];
  timeElapsed: string;
}

export interface CriminalRecord {
  candidateId: string;
  charges: Array<{
    offense: string;
    date: string;
    disposition: string;
    jurisdiction: string;
  }>;
}

export interface CompanyPolicy {
  restrictedOffenses: string[];
  timeBasedCriteria: {
    felony: number; // years
    misdemeanor: number; // years
  };
  exemptPositions: string[];
  industrySpecificRestrictions: string[];
}

export interface JurisdictionLaw {
  state: string;
  requirements: string[];
  mandatoryFactors: string[];
  waitingPeriods: Record<string, number>;
  protectedCategories: string[];
}

export interface PolicyReference {
  id: string;
  title: string;
  section: string;
  url: string;
}

export interface LegalReference {
  id: string;
  jurisdiction: string;
  title: string;
  section: string;
  url: string;
}

export interface AssessmentFactor {
  factor: string;
  rating: string;
  notes: string;
  article23ASection: string;
}

interface IndividualizedAssessment {
  factors: Array<{
    title: string;
    rating: number;
    ratingLabel: string;
    notes: string;
    article23ASection: string;
  }>;
  overallScore: number;
  recommendedAction: 'hire' | 'reject' | 'further-review';
}

export interface AssessmentReport {
  candidateId: string;
  recommendation: 'hire' | 'reject' | 'further-review';
  certificateOfRelief: boolean;
  factors: {
    compliant: AssessmentFactor[];
    concerns: AssessmentFactor[];
  };
  legalAnalysis: string;
  policyAnalysis: string;
  dateGenerated: string;
  individualizedAssessment?: IndividualizedAssessment;
  policyReferences: PolicyReference[];
  legalReferences: LegalReference[];
}