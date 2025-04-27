import React from 'react';
import { Layers, Scale, FileCheck, Building } from 'lucide-react';

interface SplitScreenProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export function SplitScreen({ leftContent, rightContent }: SplitScreenProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 p-6 overflow-hidden border-r border-gray-200">
        <div className="h-full">
          {leftContent}
        </div>
      </div>
      <div className="w-1/2 p-6 overflow-y-auto">
        <div className="h-full">
          {rightContent}
        </div>
      </div>
    </div>
  );
}