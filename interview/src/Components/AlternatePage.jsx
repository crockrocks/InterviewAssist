import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AlternatePage = ({ darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData({ title: 'Alternate Page Content', description: 'This is a dynamically loaded content.' });
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <LoadingSkeleton darkMode={darkMode} />;
  }

  if (error) {
    return (
      <div className={`bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded relative`} role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'}`}>
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'} bg-gray-100 dark:bg-gray-700`}>
        <button onClick={toggleSidebar} className="w-full p-4 flex justify-end">
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
        {isSidebarOpen && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Sidebar Content</h2>
            <p>Additional content can go here.</p>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
        <p>{data.description}</p>
      </div>
    </div>
  );
};

const LoadingSkeleton = ({ darkMode }) => (
  <div className={`flex h-screen ${darkMode ? 'bg-dark-background' : 'bg-light-background'}`}>
    <div className="w-64 bg-gray-100 dark:bg-gray-700">
      <div className="h-full animate-pulse bg-gray-200 dark:bg-gray-600"></div>
    </div>
    <div className="flex-1 p-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default AlternatePage;
