import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDocument } from '../context/DocumentContext';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentViewer: React.FC = () => {
  const { currentQuestionId, highlights } = useDocument();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.2);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // Custom text renderer to apply highlighting
  const textRenderer = (textItem: any) => {
    const currentHighlights = highlights.filter(h => h.questionId === currentQuestionId);
    const isHighlighted = currentHighlights.some(highlight => {
      const textContent = textItem.str;
      const highlightText = highlight.text;
      return textContent.includes(highlightText);
    });

    return isHighlighted ? (
      <span className="bg-yellow-200 px-1 rounded">
        {textItem.str}
        <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Assistant summarize info
        </span>
      </span>
    ) : (
      textItem.str
    );
  };

  return (
    <div className="w-full md:w-1/2 bg-white border-r overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <div className="space-x-2">
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              -
            </button>
            <button
              onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              +
            </button>
            <span className="text-sm text-gray-600">
              {Math.round(scale * 100)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </div>
        </div>

        <div className="border rounded-lg shadow-sm bg-white">
          <Document
            file="/sample.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            className="mx-auto"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              customTextRenderer={textRenderer}
              renderTextLayer={true}
            />
          </Document>
        </div>

        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPageNumber(prev => Math.min(numPages || prev, prev + 1))}
            disabled={pageNumber >= (numPages || 1)}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;