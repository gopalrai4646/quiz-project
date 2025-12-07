import React from 'react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-xl font-medium text-gray-600 dark:text-gray-300 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;


