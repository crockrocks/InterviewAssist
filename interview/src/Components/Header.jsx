
import { useState, useEffect } from 'react';
 
export default function Header({ darkMode, toggleDarkMode }) {
    return (
      <header className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Interview</h1>
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
    );
  }
  
