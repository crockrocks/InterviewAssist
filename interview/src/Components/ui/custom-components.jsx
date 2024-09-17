import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${className}`}
    {...props}
  />
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${className}`}
    {...props}
  />
);