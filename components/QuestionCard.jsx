import React from 'react';

const QuestionCard = ({ question, selectedOptionIndex, onOptionSelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 fade-in">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6 leading-relaxed">
        {question.question}
      </h2>
      
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          
          return (
            <button
              key={index}
              onClick={() => onOptionSelect(index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                }
              `}
            >
              <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                 ${isSelected 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-400 group-hover:border-blue-400'
                 }
              `}>
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className={`text-lg ${isSelected ? 'font-semibold text-blue-900 dark:text-blue-200' : 'text-gray-700 dark:text-gray-500'}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;


