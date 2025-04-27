import React, { useCallback } from 'react';
import { FileUp, AlertCircle } from 'lucide-react';

interface PDFUploadPromptProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

export function PDFUploadPrompt({ onFileSelect, onClose }: PDFUploadPromptProps) {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <FileUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">Upload Restorative Record</h2>
          <p className="text-gray-600 mb-6">
            Please upload the candidate's Restorative Record PDF to begin the assessment process.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 hover:border-blue-500 transition-colors"
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FileUp className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600">Drag and drop or click to upload PDF</span>
            </label>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-left mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Important Note</h3>
                <p className="text-sm text-blue-700">
                  The PDF will be displayed alongside the assessment form for easy reference during the evaluation process.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <label
              htmlFor="pdf-upload"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Select PDF
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}