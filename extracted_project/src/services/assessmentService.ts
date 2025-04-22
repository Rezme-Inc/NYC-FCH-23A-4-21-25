import { RestorativeRecord, CriminalRecord, CompanyPolicy, JurisdictionLaw, AssessmentReport } from '../types';

export class AssessmentService {
  private async validateTimeBasedCriteria(
    criminalRecord: CriminalRecord,
    policy: CompanyPolicy
  ): Promise<Array<{ compliant: boolean; offense: string; timeElapsed: number }>> {
    return criminalRecord.charges.map(charge => {
      const chargeDate = new Date(charge.date);
      const yearsSinceCharge = new Date().getFullYear() - chargeDate.getFullYear();
      
      return {
        compliant: charge.offense.toLowerCase().includes('felony') 
          ? yearsSinceCharge >= policy.timeBasedCriteria.felony
          : yearsSinceCharge >= policy.timeBasedCriteria.misdemeanor,
        offense: charge.offense,
        timeElapsed: yearsSinceCharge
      };
    });
  }

  private async checkJurisdictionCompliance(
    criminalRecord: CriminalRecord,
    jurisdictionLaw: JurisdictionLaw
  ): Promise<{
    compliant: Array<{ factor: string; notes: string; article23ASection: string }>;
    violations: Array<{ factor: string; notes: string; article23ASection: string }>;
  }> {
    const compliant: Array<{ factor: string; notes: string; article23ASection: string }> = [];
    const violations: Array<{ factor: string; notes: string; article23ASection: string }> = [];

    for (const charge of criminalRecord.charges) {
      const waitingPeriod = jurisdictionLaw.waitingPeriods[charge.offense.toLowerCase()];
      const chargeDate = new Date(charge.date);
      const yearsSinceCharge = new Date().getFullYear() - chargeDate.getFullYear();

      if (!waitingPeriod || yearsSinceCharge >= waitingPeriod) {
        compliant.push({
          factor: "Jurisdiction Waiting Period",
          notes: `${charge.offense} meets the required waiting period of ${waitingPeriod} years`,
          article23ASection: "Article 23-A Section 4"
        });
      } else {
        violations.push({
          factor: "Jurisdiction Waiting Period",
          notes: `${charge.offense} does not meet the required waiting period of ${waitingPeriod} years`,
          article23ASection: "Article 23-A Section 4"
        });
      }
    }

    return { compliant, violations };
  }

  private async evaluateRestorativeEfforts(
    record: RestorativeRecord
  ): Promise<{
    strengths: Array<{ factor: string; notes: string; article23ASection: string }>;
    concerns: Array<{ factor: string; notes: string; article23ASection: string }>;
  }> {
    const strengths: Array<{ factor: string; notes: string; article23ASection: string }> = [];
    const concerns: Array<{ factor: string; notes: string; article23ASection: string }> = [];

    // Evaluate rehabilitation efforts
    if (record.rehabilitationEfforts.length > 0) {
      strengths.push({
        factor: "Rehabilitation Efforts",
        notes: `Demonstrated commitment through ${record.rehabilitationEfforts.length} rehabilitation activities`,
        article23ASection: "Article 23-A Section 7"
      });
    }

    // Evaluate community service
    if (record.communityService.length > 0) {
      strengths.push({
        factor: "Community Service",
        notes: `Active participation in ${record.communityService.length} community service activities`,
        article23ASection: "Article 23-A Section 7"
      });
    }

    // Evaluate employment history
    if (record.employmentHistory.length > 0) {
      strengths.push({
        factor: "Employment History",
        notes: "Demonstrated stable employment history",
        article23ASection: "Article 23-A Section 7"
      });
    } else {
      concerns.push({
        factor: "Employment History",
        notes: "Limited employment history requires further review",
        article23ASection: "Article 23-A Section 7"
      });
    }

    // Evaluate character references
    if (record.characterReferences.length >= 3) {
      strengths.push({
        factor: "Character References",
        notes: `Strong support through ${record.characterReferences.length} character references`,
        article23ASection: "Article 23-A Section 7"
      });
    }

    return { strengths, concerns };
  }

  public async performAssessment(
    restorativeRecord: RestorativeRecord,
    criminalRecord: CriminalRecord,
    companyPolicy: CompanyPolicy,
    jurisdictionLaw: JurisdictionLaw
  ): Promise<AssessmentReport> {
    // Perform time-based validation
    const timeBasedResults = await this.validateTimeBasedCriteria(criminalRecord, companyPolicy);
    
    // Check jurisdiction compliance
    const jurisdictionResults = await this.checkJurisdictionCompliance(criminalRecord, jurisdictionLaw);
    
    // Evaluate restorative efforts
    const restorativeResults = await this.evaluateRestorativeEfforts(restorativeRecord);

    const compliantFactors = [
      ...jurisdictionResults.compliant,
      ...restorativeResults.strengths,
      ...timeBasedResults
        .filter(result => result.compliant)
        .map(result => ({
          factor: "Time-Based Criteria",
          notes: `${result.offense}: ${result.timeElapsed} years elapsed meets requirements`,
          article23ASection: "Article 23-A Section 4"
        }))
    ];

    const concernFactors = [
      ...jurisdictionResults.violations,
      ...restorativeResults.concerns,
      ...timeBasedResults
        .filter(result => !result.compliant)
        .map(result => ({
          factor: "Time-Based Criteria",
          notes: `${result.offense}: ${result.timeElapsed} years elapsed does not meet requirements`,
          article23ASection: "Article 23-A Section 4"
        }))
    ];

    return {
      candidateId: restorativeRecord.candidateId,
      recommendation: 'further-review',
      factors: {
        compliant: compliantFactors.map(f => ({
          factor: f.factor,
          rating: "positive",
          notes: f.notes,
          article23ASection: f.article23ASection
        })),
        concerns: concernFactors.map(f => ({
          factor: f.factor,
          rating: "negative",
          notes: f.notes,
          article23ASection: f.article23ASection
        }))
      },
      legalAnalysis: `Based on ${jurisdictionLaw.state} law requirements, the following factors have been analyzed: ${
        jurisdictionLaw.mandatoryFactors.join(', ')
      }. The assessment shows compliance with ${
        compliantFactors.length
      } criteria and ${
        concernFactors.length
      } areas requiring review.`,
      policyAnalysis: `Analysis based on company policy shows alignment with ${
        timeBasedResults.filter(result => result.compliant).length
      } out of ${
        timeBasedResults.length
      } time-based criteria. Each factor has been evaluated against the company's background check matrix.`,
      dateGenerated: new Date().toISOString(),
      policyReferences: [
        {
          id: 'policy-1',
          title: 'Background Check Policy',
          section: 'Time-Based Criteria',
          url: `/policies/background-check#time-criteria`
        },
        {
          id: 'policy-2',
          title: 'Hiring Guidelines',
          section: 'Criminal History Assessment',
          url: `/policies/hiring-guidelines#criminal-history`
        }
      ],
      legalReferences: [
        {
          id: 'law-1',
          jurisdiction: jurisdictionLaw.state,
          title: 'Fair Chance Act',
          section: 'Individual Assessment Requirements',
          url: `/legal/${jurisdictionLaw.state.toLowerCase()}/fair-chance-act#individual-assessment`
        },
        {
          id: 'law-2',
          jurisdiction: jurisdictionLaw.state,
          title: 'Employment Discrimination Laws',
          section: 'Criminal History Considerations',
          url: `/legal/${jurisdictionLaw.state.toLowerCase()}/employment-discrimination#criminal-history`
        }
      ]
    };
  }
}