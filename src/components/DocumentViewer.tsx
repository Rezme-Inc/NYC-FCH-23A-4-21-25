import React from 'react';
import { FileText, Link2, ExternalLink } from 'lucide-react';

interface DocumentViewerProps {
  document: {
    name: string;
    url: string;
  } | null;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center">
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No document selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link2 className="w-5 h-5 text-blue-500 mr-2" />
          <span className="font-medium">{document.name}</span>
        </div>
        <a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
        >
          <span className="text-sm mr-1">View Policy</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}