import React from 'react';
import DocumentViewer from './components/DocumentViewer';
import QuizContainer from './components/QuizContainer';
import { DocumentProvider } from './context/DocumentContext';

function App() {
  return (
    <DocumentProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Document Review & Assessment</h1>
        </header>
        <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <DocumentViewer />
          <QuizContainer />
        </main>
      </div>
    </DocumentProvider>
  );
}

export default App;