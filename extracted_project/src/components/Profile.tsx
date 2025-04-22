import React from "react";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  onAccessCandidate: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onAccessCandidate }) => {
  const navigate = useNavigate();

  const handleAccessCandidate = () => {
    onAccessCandidate();
    navigate("/assessment");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">RESTORATIVE RECORD</h1>
          <button
            onClick={handleAccessCandidate}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
          >
            ACCESS CANDIDATE
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Profile picture placeholder */}
          <div className="md:col-span-1">
            <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
              <span className="text-gray-500">Profile Picture</span>
            </div>
          </div>

          {/* Right column - Candidate information */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Jacobi Iverson</h2>
                <p className="text-gray-600">
                  Preferred Occupation: Account Executive, Customer Success
                  Agent, Solutions Engineer
                </p>
                <p className="text-gray-600">English: Bilingual</p>
                <p className="text-gray-600">
                  Other Proficient Languages: Spanish
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Personal Narrative
                </h3>
                <p className="text-gray-700">
                  I am Jacobi Iverson. A youthful mistake led to a drug
                  possession conviction three years ago, but since then I've
                  committed myself to rigorous self-improvement—earning a GED
                  with honors, an Associate's in Business Administration, and
                  certifications in OSHA 10-Hour and Excel. I taught myself data
                  analysis and project coordination to fuel my passion for
                  logistics and complex problem-solving. Through leading peer
                  mentoring groups and restorative justice circles, I've honed
                  my teamwork and leadership skills. I am ready to bring my
                  resilience, accountability, and analytical rigor to the
                  Account Executive role at a rapidly growing organization.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Personal Achievements
                </h3>
                <p className="text-gray-700">
                  I am proud to have maintained 18 months of continuous
                  sobriety, a journey supported by weekly individual therapy and
                  bi-weekly peer support groups. Embracing accountability and
                  self-reflection, I confronted past behaviors and developed
                  healthy coping strategies. This commitment not only restored
                  my own well-being but also strengthened my role as a reliable
                  provider and mentor for my family, demonstrating the
                  discipline, resilience, and emotional intelligence I bring to
                  every aspect of my life.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Community Service
                </h3>
                <p className="text-gray-700">
                  Name of Award: Grey 18 Month Narcotics Anonymous Recovery Chip
                  (Apr 2025)
                  <br />
                  By Narcotics Anonymous
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Soft Skills:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      <li>Creativity and Innovation</li>
                      <li>Critical Thinking</li>
                      <li>Growth Mindset</li>
                      <li>Collaboration and Teamwork</li>
                      <li>Self-Motivation and Self-Discipline</li>
                      <li>Digital Literacy</li>
                      <li>Remote Working Proficiency</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Hard Skills:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      <li>Data Analysis</li>
                      <li>Research Methodology</li>
                      <li>Programming/Coding</li>
                      <li>Project Management</li>
                      <li>Sales and Marketing</li>
                      <li>Accounting and Finance</li>
                      <li>Supply Chain and Logistics Management</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Community Engagements
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Mentoring and Coaching</h4>
                  <p className="text-gray-700">
                    Engagement role: Reentry Coordinator
                    <br />
                    Organization: The Osborne Association
                    <br />
                    Website: https://www.osborneny.org/
                    <br />
                    <br />
                    Launched an after-school mentorship program in Queens for
                    youth with incarcerated parents. Over eight months, I guided
                    20 students (ages 10–16) through weekly workshops on
                    emotional resilience, study strategies, and goal setting. By
                    creating a safe space for candid conversation and connecting
                    each child with tailored resources, I helped boost their
                    school engagement.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Rehabilitative Programs
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Substance Use Disorder Treatment</li>
                  <li>Faith-Based Initiatives</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Microcredentials and Certifications
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">
                      OSHA 10-Hour General Industry Certification
                    </h4>
                    <p className="text-gray-700">
                      Issuing organization: Occupational Safety and Health
                      Administration (OSHA)
                      <br />
                      Issued: Mar 2020
                      <br />
                      Credential ID: OSHA-2020-JA12345
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">
                      Prison Food Handler Certification
                    </h4>
                    <p className="text-gray-700">
                      Issuing organization: NY Department of Public Health
                      <br />
                      Issued: Apr 2020 | Exp: Apr 2023
                      <br />
                      Credential ID: FHC-2020-JA45678
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Education</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">
                    Borough of Manhattan Community College (CUNY)
                  </h4>
                  <p className="text-gray-700">
                    Associate of Applied Science
                    <br />
                    Sep 2016 - May 2018
                    <br />
                    New York, NY
                    <br />
                    Field of Study: Business Administration; Grades: 2.8
                    <br />
                    <br />
                    While earning my A.A.S. in Business Administration through
                    BMCC's Prison-to-College Pipeline, I completed 24
                    credits—covering accounting, organizational behavior, and
                    business law—within a structured correctional setting.
                    Balancing coursework with institutional requirements
                    sharpened my discipline and time-management. After release,
                    I transitioned to the main campus, carrying forward the
                    resilience and commitment that education instilled in me.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Employment History
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">
                    Warehouse Associate (Work-Release Program)
                  </h4>
                  <p className="text-gray-700">
                    Department of Corrections - Anchor Logistics |
                    Apprenticeship
                    <br />
                    Albany, NY
                    <br />
                    Jan 2019 - Dec 2020 (2 years, Employed while incarcerated)
                    <br />
                    <br />
                    While incarcerated, I participated in a structured
                    work-release program at Anchor Logistics, where I managed
                    end-to-end warehouse operations. I processed an average of
                    120 orders per day, operated forklift equipment, and
                    maintained precise inventory records. Collaborating with
                    supervisors and fellow associates, I identified and
                    implemented process improvements that increased packing
                    efficiency by 12%. Through this role, I demonstrated
                    reliability, attention to detail, and teamwork—skills that
                    formed the foundation of my professional discipline and
                    operational acumen.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Hobbies and Interests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">General:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      <li>Chess or Other Strategy Games</li>
                      <li>Coding or Programming</li>
                      <li>Tutoring or Mentoring</li>
                      <li>Learning New Technologies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Sports:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      <li>Basketball</li>
                      <li>Golf</li>
                      <li>Hockey</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Other:</h4>
                  <p className="text-gray-700">
                    Hackathon Enthusiast: I actively participate in hackathons
                    to sharpen my problem-solving skills, collaborate with
                    diverse teams under tight deadlines, and prototype
                    innovative solutions—particularly in logistics, data
                    analytics, and social impact domains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
