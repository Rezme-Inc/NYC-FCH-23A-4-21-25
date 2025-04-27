import React from 'react';
import { Award, Building, Heart, Shield, TrendingUp, FileText } from 'lucide-react';
import { Logo } from './Logo';

interface CompletionCelebrationProps {
  onContinue: () => void;
}

export function CompletionCelebration({ onContinue }: CompletionCelebrationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 md:p-8 max-w-2xl w-full mx-auto my-8 shadow-2xl">
        <div className="text-center">
          <Logo className="mb-6" />
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-500" />
              <Award className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Assessment Complete!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            You've completed a thorough Article 23-A assessment, demonstrating your commitment to fair hiring practices and legal compliance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Building className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">Business Impact</h3>
              <p className="text-sm text-blue-700">Protecting your business from unnecessary exposure to negligent hiring claims</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 mb-1">Community Impact</h3>
              <p className="text-sm text-green-700">Strengthening families and communities throughout New York</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900 mb-1">Economic Impact</h3>
              <p className="text-sm text-purple-700">Contributing to rebuilding New York's economic base</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg text-left mb-8">
            <p className="text-yellow-800">
              Your careful consideration of all Article 23-A factors helps create fair employment opportunities while maintaining workplace safety and security.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 sticky bottom-0 bg-white pt-4">
            <button
              onClick={onContinue}
              className="w-full md:w-auto bg-blue-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center group"
            >
              <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View Assessment Results
            </button>
            <p className="text-sm text-gray-500">
              Click to review your detailed assessment analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}