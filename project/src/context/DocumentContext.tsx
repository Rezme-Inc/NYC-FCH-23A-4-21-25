import React, { createContext, useState, useContext, ReactNode } from 'react';
import { documentContent } from '../data/documentContent';
import { quizQuestions } from '../data/quizData';

interface HighlightRange {
  id: string;
  start: number;
  end: number;
  questionId: number;
  summary: string;
  researchInfo: string;
  expandedInfo: string;
}

interface DocumentContextType {
  content: string;
  currentQuestionId: number;
  setCurrentQuestionId: (id: number) => void;
  highlights: HighlightRange[];
  questions: any[];
  activeHighlightId: string | null;
  setActiveHighlightId: (id: string | null) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  
  // Extract highlights from quiz questions
  const highlights: HighlightRange[] = quizQuestions.flatMap(question => 
    question.highlights.map((highlight: any) => ({
      ...highlight,
      questionId: question.id
    }))
  );

  return (
    <DocumentContext.Provider value={{
      content: documentContent,
      currentQuestionId,
      setCurrentQuestionId,
      highlights,
      questions: quizQuestions,
      activeHighlightId,
      setActiveHighlightId
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};