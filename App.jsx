import React, { useEffect } from 'react';
import { useQuizStore } from './store/useQuizStore.js';
import { ScreenState } from './types.js';
import TopicScreen from './screens/TopicScreen.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import ResultScreen from './screens/ResultScreen.jsx';
import Loader from './components/Loader.jsx';

function App() {
  const { 
    currentScreen, 
    isLoading, 
    isDarkMode, 
    toggleDarkMode, 
    errorMsg, 
    goToScreen,
    selectedTopic
  } = useQuizStore();

  useEffect(() => {
    // Initial Dark Mode Setup from local storage handled in store, 
    // but ensuring class is applied on mount
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Main Content Render Logic
  const renderContent = () => {
    if (isLoading) {
      const msg = currentScreen === ScreenState.TOPICS 
        ? `Generating ${selectedTopic} Quiz...` 
        : "Analyzing Results...";
      return <Loader message={msg} />;
    }

    if (errorMsg || currentScreen === ScreenState.ERROR) {
      return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-auto border border-red-100 dark:border-red-900/30">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{errorMsg || "An unexpected error occurred."}</p>
          <button 
            onClick={() => goToScreen(ScreenState.TOPICS)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (currentScreen) {
      case ScreenState.TOPICS:
        return <TopicScreen />;
      case ScreenState.QUIZ:
        return <QuizScreen />;
      case ScreenState.RESULT:
        return <ResultScreen />;
      default:
        return <TopicScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center max-w-5xl mx-auto w-full">
        <button 
          onClick={() => goToScreen(ScreenState.TOPICS)}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
             Q
           </div>
           <span className="font-bold text-gray-700 dark:text-gray-200">Quiz</span>
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-yellow-400 shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-400 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
}

export default App;


