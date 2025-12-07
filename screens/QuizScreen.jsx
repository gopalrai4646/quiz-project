import React from 'react';
import { useQuizStore } from '../store/useQuizStore.js';
import { generateFeedback } from '../services/geminiService.js';
import QuestionCard from '../components/QuestionCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

const QuizScreen = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    userAnswers, 
    answerQuestion, 
    nextQuestion, 
    prevQuestion,
    setLoading,
    setFeedback
  } = useQuizStore();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;

  const handleNext = async () => {
    // If it's the last question, we need to handle transition and feedback loading
    if (currentQuestionIndex === totalQuestions - 1) {
        setLoading(true);
        // Transition to result screen (calculates score in store)
        nextQuestion();
        
        // Fetch feedback while showing loader (App.jsx shows loader if isLoading is true)
        const { selectedTopic, score } = useQuizStore.getState();
        if (selectedTopic) {
            try {
                const msg = await generateFeedback(selectedTopic, score, totalQuestions);
                setFeedback(msg);
            } catch (e) {
                console.error("Failed to generate feedback", e);
                setFeedback("Great job!");
            }
        }
        setLoading(false);
    } else {
        nextQuestion();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 w-full">
      <ProgressBar current={currentQuestionIndex} total={totalQuestions} />
      
      <QuestionCard 
        question={currentQuestion}
        selectedOptionIndex={userAnswers[currentQuestionIndex]}
        onOptionSelect={(idx) => answerQuestion(currentQuestionIndex, idx)}
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors
            ${currentQuestionIndex === 0 
              ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
            }
          `}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`px-8 py-2 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-0.5
            ${!hasAnswered
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30'
            }
          `}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;


