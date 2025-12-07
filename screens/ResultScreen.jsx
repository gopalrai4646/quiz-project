import React from 'react';
import { useQuizStore } from '../store/useQuizStore.js';

const ResultScreen = () => {
  const { score, questions, selectedTopic, feedback, resetQuiz } = useQuizStore();
  const total = questions.length;
  const percentage = (score / total) * 100;

  return (
    <div className="max-w-2xl mx-auto text-center px-4 fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quiz Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{selectedTopic}</p>

        <div className="mb-8">
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
             <div className="text-5xl font-extrabold text-blue-600">
               {score}/{total}
             </div>
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
             You scored {Math.round(percentage)}%
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-xl mb-8 text-left">
          <h3 className="text-sm uppercase tracking-wide text-blue-500 font-bold mb-2">AI Feedback</h3>
          <p className="text-gray-700 dark:text-gray-200 italic leading-relaxed">
            {feedback || "Generating feedback..."}
          </p>
        </div>

        <button
          onClick={resetQuiz}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-105"
        >
          Try Another Topic
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;


