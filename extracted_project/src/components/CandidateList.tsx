import React from "react";
import { useNavigate } from "react-router-dom";

interface CandidateListProps {
  onAccessCandidate: () => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ onAccessCandidate }) => {
  const navigate = useNavigate();

  const handleAccessCandidate = () => {
    onAccessCandidate();
    navigate("/assessment");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Candidate List</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Legal Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferred Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-4 whitespace-nowrap">Jacobi Iverson</td>
                <td className="px-6 py-4 whitespace-nowrap">Jacobi</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  jacobiive@email.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap">BRT</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAccessCandidate}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      ASSESS CANDIDATE
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
