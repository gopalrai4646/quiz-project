import React from 'react';
import { TOPICS } from '../types.js';
import { useQuizStore } from '../store/useQuizStore.js';
import { generateQuizQuestions } from '../services/geminiService.js';

const TopicScreen = () => {
  const { setTopic, setLoading, setQuestions, setError } = useQuizStore();

  const handleSelectTopic = async (topic) => {
    setTopic(topic);
    setLoading(true);
    setError(null);

    try {
      const questions = await generateQuizQuestions(topic);
      setQuestions(questions);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message || "Failed to generate quiz.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center fade-in">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
         Knowledge Quiz
      </h1>
    
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
        Pick a topic and challenge your mind.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => handleSelectTopic(topic)}
            className="group relative h-32 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-500 overflow-hidden flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 text-xl font-bold text-gray-800 dark:text-white group-hover:scale-105 transition-transform">
              {topic}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicScreen;


