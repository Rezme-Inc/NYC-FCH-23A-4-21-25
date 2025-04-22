import React from 'react';
import { ClipboardCheck, Scale, Building, FileCheck } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
}

export function AssessmentSteps({ currentStep }: { currentStep: number }) {
  const steps: Step[] = [
    {
      title: 'Restorative Record Review',
      description: 'Analyzing candidate\'s rehabilitation efforts',
      icon: <ClipboardCheck className="w-6 h-6" />,
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'active' : 'pending'
    },
    {
      title: 'Legal Requirements',
      description: 'Checking jurisdiction-specific laws',
      icon: <Scale className="w-6 h-6" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending'
    },
    {
      title: 'Company Policy Review',
      description: 'Evaluating against company guidelines',
      icon: <Building className="w-6 h-6" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending'
    },
    {
      title: 'Final Assessment',
      description: 'Generating comprehensive report',
      icon: <FileCheck className="w-6 h-6" />,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending'
    }
  ];

  return (
    <div className="py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <nav aria-label="Progress">
          <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {steps.map((step, index) => (
              <li key={step.title} className="md:flex-1">
                <div className={`group pl-4 py-2 flex flex-col border-l-4 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 ${
                  step.status === 'completed' ? 'border-green-500' :
                  step.status === 'active' ? 'border-blue-500' :
                  'border-gray-200'
                }`}>
                  <span className="text-xs font-semibold tracking-wide uppercase flex items-center">
                    {step.icon}
                    <span className="ml-2 md:hidden">{step.title}</span>
                  </span>
                  <span className="text-sm font-medium mt-2 hidden md:block">{step.title}</span>
                  <span className="text-sm text-gray-500 hidden md:block">{step.description}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}