import React from 'react';

const AlternatePage = ({ darkMode }) => (
  <div className={`${darkMode ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'} min-h-screen flex items-center justify-center`}>
    <h1 className="text-3xl font-bold">Building</h1>
  </div>
);

export default AlternatePage;
