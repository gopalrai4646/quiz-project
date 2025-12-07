import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Question {current + 1} / {total}
        </span>
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;


