import React from 'react';
import { Database, Send, UserCircle } from 'lucide-react';

interface ShareOptionsProps {
  decision: 'hire' | 'reject';
  onShare: (action: 'hris' | 'supervisor' | 'candidate') => void;
  onClose: () => void;
}

export function ShareOptions({ decision, onShare, onClose }: ShareOptionsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Share Assessment Results</h2>
        <div className="space-y-4">
          <button
            onClick={() => onShare('hris')}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Database className="w-5 h-5 mr-2" />
            Attach to Candidate Profile (HRIS)
          </button>
          <button
            onClick={() => onShare('supervisor')}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <UserCircle className="w-5 h-5 mr-2" />
            Send to Manager/Supervisor
          </button>
          {decision === 'reject' && (
            <button
              onClick={() => onShare('candidate')}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Adverse Action Notice
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}