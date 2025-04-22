import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import QuestionPopup from './QuestionPopup';
import { useDocument } from '../context/DocumentContext';

const QuizContainer: React.FC = () => {
  const { currentQuestionId, setCurrentQuestionId, questions } = useDocument();
  const [isStarted, setIsStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const currentQuestion = questions.find(q => q.id === currentQuestionId);
  const questionCount = questions.length;
  
  const handleStart = () => {
    setIsStarted(true);
    setShowPopup(true);
  };
  
  const handleNext = () => {
    if (currentQuestionId < questionCount) {
      setCurrentQuestionId(currentQuestionId + 1);
      setShowPopup(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionId > 1) {
      setCurrentQuestionId(currentQuestionId - 1);
      setShowPopup(true);
    }
  };
  
  const getRelatedHighlights = () => {
    return currentQuestion?.highlights || [];
  };
  
  if (!isStarted) {
    return (
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Background Check Assessment</h2>
          <p className="text-gray-600 mb-8">
            This assessment will help you understand the key factors in evaluating background checks.
            Each question includes relevant research and guidelines.
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full md:w-1/2 bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Assessment</h2>
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionId} of {questionCount}
          </span>
        </div>
        
        {currentQuestion && (
          <>
            {showPopup && (
              <QuestionPopup
                question={currentQuestion}
                onClose={() => setShowPopup(false)}
              />
            )}
            <QuizQuestion 
              question={currentQuestion}
              highlights={getRelatedHighlights()}
            />
          </>
        )}
        
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionId === 1}
            className={`px-4 py-2 rounded-md font-medium ${
              currentQuestionId === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentQuestionId === questionCount}
            className={`px-4 py-2 rounded-md font-medium ${
              currentQuestionId === questionCount
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;