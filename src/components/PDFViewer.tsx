import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  file?: File;
  url?: string;
}

export function PDFViewer({ file, url }: PDFViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (url) {
      setFileUrl(url);
    }
  }, [file, url]);

  if (!fileUrl) return null;

  return (
    <div className="h-full w-full bg-gray-50 rounded-lg shadow-inner">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-full w-full">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1}
            theme={{
              theme: 'auto'
            }}
          />
        </div>
      </Worker>
    </div>
  );
}